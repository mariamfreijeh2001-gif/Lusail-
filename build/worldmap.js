/* A world map, drawn at build time.
 *
 * site-assets/geo/land-110m.json is Natural Earth's 110m land layer in
 * TopoJSON form — public domain. TopoJSON is small because it stores shared
 * boundaries once, as delta-encoded integer arcs, so it has to be decoded
 * before anything can be drawn. That is all this file does: decode the arcs,
 * project them, and hand back SVG path data.
 *
 * No dependency on d3 or the topojson client: the decoding is a dozen lines
 * and the projection is arithmetic.
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

/* ---- projection --------------------------------------------------------- */

/* Equirectangular. A Mercator would inflate Canada and Russia until they
   dominate a map whose subject is trade routes near the equator, so the flat
   one is the honest choice here. */
function makeProjection({ width, height, latTop = 78, latBottom = -56 }) {
  const lonSpan = 360;
  const latSpan = latTop - latBottom;
  return ([lon, lat]) => [
    ((lon + 180) / lonSpan) * width,
    ((latTop - lat) / latSpan) * height
  ];
}

/* ---- output ------------------------------------------------------------- */

function landPath(opts) {
  const file = opts.file || path.join(__dirname, '..', 'site-assets/geo/land-110m.json');
  const topo = JSON.parse(fs.readFileSync(file, 'utf8'));
  const name = Object.keys(topo.objects)[0];
  const project = makeProjection(opts);
  // whole pixels: the map renders at a third of this width, so a decimal
  // place is invisible and costs a fifth of the file
  const round = n => Math.round(n);

  const minArea = opts.minArea == null ? 6 : opts.minArea;
  const parts = [];

  for (const poly of polygons(topo, name)) {
    for (const r of poly) {
      if (r.length < 4) continue;                       // a sliver, not a landmass

      // Antarctica and the far south sit outside the frame entirely; drop the
      // ring rather than clipping it point by point, which leaves a smear
      // along the bottom edge.
      let top = -90, bottom = 90;
      for (const p of r) { if (p[1] > top) top = p[1]; if (p[1] < bottom) bottom = p[1]; }
      if (top < opts.latBottom) continue;

      // Greenland, Svalbard and the Canadian and Russian Arctic islands sit in
      // a row across the top and merge into what looks like a printing fault.
      // A map about trade routes does not need them; the mainlands stay,
      // because their rings reach far below this line.
      if (opts.dropAbove != null && bottom > opts.dropAbove) continue;

      const pts = r.map(project);
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      for (const [x, y] of pts) {
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
      // islands below a few pixels across read as dirt at this size
      if ((maxX - minX) * (maxY - minY) < minArea) continue;

      // A ring running the full width of the frame but only a few pixels tall
      // is a sliver left where a polygon wraps the dateline. It draws as a
      // hairline straight across the map; no landmass has that shape.
      if ((maxX - minX) > opts.width * 0.9 && (maxY - minY) < 8) continue;

      /* Points outside the frame break the path rather than being clamped to
         the edge. Clamping walks every stray point along the boundary, which
         draws a solid bar across the top of the map. */
      let d = '', prev = null, drawn = 0, broken = false;
      for (const [px, py] of pts) {
        if (py < -4 || py > opts.height + 4) { prev = null; broken = true; continue; }
        const x = round(px), y = round(py);
        if (prev && x === prev[0] && y === prev[1]) continue;   // duplicate after rounding
        d += (prev === null ? 'M' : 'L') + x + ' ' + y;
        prev = [x, y];
        drawn++;
      }
      /* A ring that was cut and still spans most of the frame is one that wraps
         the dateline; what survives is a hairline right across the map. */
      if (broken && (maxX - minX) > opts.width * 0.55) continue;
      if (drawn > 3) parts.push(d + (broken ? '' : 'Z'));
    }
  }
  return parts.join('');
}

module.exports = { landPath, makeProjection };
