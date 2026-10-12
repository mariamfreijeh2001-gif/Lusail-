/* The globe on the home page, prepared at build time.
 *
 * site-assets/geo/land-110m.json is Natural Earth's 110m land layer in
 * TopoJSON form — public domain. TopoJSON stores shared boundaries once, as
 * delta-encoded integer arcs, so it is decoded here, then sampled into land
 * points on the sphere that the browser only has to rotate and draw.
 *
 * No dependency on d3 or the topojson client: the decoding is a dozen lines.
 */
const fs = require('fs');
const path = require('path');

/* ---- topojson --------------------------------------------------------- */

/* Arcs are stored as deltas against a quantised integer grid. Walk each arc
   accumulating the deltas, then map the grid back to degrees. */
function decodeArcs(topology) {
  const { scale, translate } = topology.transform;
  return topology.arcs.map(arc => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => {
      x += dx; y += dy;
      return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
    });
  });
}

/* A negative arc index means "this arc, reversed". The encoding is ~i, so
   index -1 is arc 0 backwards. */
function ring(arcs, indices) {
  const out = [];
  for (const i of indices) {
    const arc = i < 0 ? arcs[~i].slice().reverse() : arcs[i];
    // the last point of one arc is the first of the next; drop the repeat
    out.push(...(out.length ? arc.slice(1) : arc));
  }
  return out;
}

function polygons(topology, objectName) {
  const arcs = decodeArcs(topology);
  const obj = topology.objects[objectName];
  const out = [];
  const add = geom => {
    if (geom.type === 'Polygon') out.push(geom.arcs.map(r => ring(arcs, r)));
    else if (geom.type === 'MultiPolygon') geom.arcs.forEach(p => out.push(p.map(r => ring(arcs, r))));
    else if (geom.type === 'GeometryCollection') geom.geometries.forEach(add);
  };
  add(obj);
  return out;
}

/* ---- dots for a globe ------------------------------------------------- */

/* The land as points on the sphere, for the globe on the home page. Points
   are laid on rings of latitude, spaced so each covers about the same area
   — closer in degrees of longitude toward the poles — and kept where they
   fall on land. Even-odd over every ring, so lakes stay open. The browser
   only has to rotate and project them; it never sees a coastline. */
function globeDots(opts = {}) {
  const file = opts.file || path.join(__dirname, '..', 'site-assets/geo/land-110m.json');
  const topo = JSON.parse(fs.readFileSync(file, 'utf8'));
  const step = opts.step || 1.5;
  const rings = [];
  for (const poly of polygons(topo, Object.keys(topo.objects)[0])) {
    for (const r of poly) {
      if (r.length < 4) continue;
      let minX = 180, maxX = -180, minY = 90, maxY = -90;
      for (const [x, y] of r) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
      if (maxY < -58) continue;                 // Antarctica: under the globe's foot
      rings.push({ r, minX, maxX, minY, maxY });
    }
  }
  const inside = (lon, lat) => {
    let hit = false;
    for (const g of rings) {
      if (lat < g.minY || lat > g.maxY || lon < g.minX || lon > g.maxX) continue;
      const r = g.r;
      for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
        const [xi, yi] = r[i], [xj, yj] = r[j];
        if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) hit = !hit;
      }
    }
    return hit;
  };
  const out = [];
  for (let lat = -56; lat <= 80; lat += step) {
    const dLon = step / Math.max(0.2, Math.cos(lat * Math.PI / 180));
    for (let lon = -180 + dLon / 2; lon < 180; lon += dLon) {
      if (inside(lon, lat)) out.push(Math.round(lon * 10) / 10, Math.round(lat * 10) / 10);
    }
  }
  return out;                                    // flat: lon, lat, lon, lat, …
}

module.exports = { globeDots };
