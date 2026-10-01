/* Resized copies of the photography, one per width a page actually draws it at.
 *
 * There is no image tooling on a typical machine here and none on the build
 * host, so headless Chrome does the resampling and the JPEG encoding, and the
 * results are committed. The tool is idempotent: it makes only the files that
 * are missing or older than their source, so `npm run images` after adding a
 * photograph costs one Chrome run and nothing after that.
 *
 *   node build/variants.js          make whatever is missing
 *   node build/variants.js --force  make all of them again
 *
 * Originals in site-assets/img/ stay untouched and remain the source of
 * truth; derivatives are written to site-assets/img/derived/.
 *
 * The widths come from measuring the boxes in a browser at 1440 and at 390,
 * doubled for a 2x screen and capped at the original. WIDTHS below is keyed by
 * the role an image plays, which is also what decides its `sizes` attribute in
 * build/render.js — the two have to agree, so they are described together in
 * the README.
 */
const fs = require('fs'), path = require('path'), os = require('os');
const { execFile } = require('child_process');

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const SRC = path.join(__dirname, '..', 'site-assets', 'img');
const OUT = path.join(SRC, 'derived');
const QUALITY = 0.8;

/* The width a role is drawn at, widest first. A variant wider than the
   original is skipped — nothing is ever upscaled. */
const WIDTHS = {
  hero: [1400, 980, 760],   // full-bleed, behind a page title
  wide: [1500, 1100, 740],  // the landscape plate beside a sector
  still: [1180, 760],       // the upright shot beside a company's opening
  card: [880, 700, 560, 440],   // the home page's sector cards
  panel: [1060, 800, 620, 440], // a company panel in the row of four
  rail: [520, 320],         // a product card in the rail
  plate: [680, 420],        // a company on the sectors index
  thumb: [186],             // the 93px picture beside a company's name
};

/* Where the stylesheet pins a box to one shape and fills it with
   object-fit:cover, the browser downloads pixels it then crops away. These
   are cropped to that shape instead, from the middle. A role with no entry
   sits in a box of changing height and is left whole. */
const ASPECT = {
  rail: 4 / 3,        // .prod img
  plate: 4 / 3,       // .cocard-shot img
  thumb: 93 / 88,     // .minico img
  still: 6 / 5,       // .costill img
  wide: 746 / 451,    // .secblk-shot img
};

/* Which role each photograph plays. An image used in two places takes the
   union of both roles' widths, which is why the heroes also carry `thumb`:
   the same file is a 1400px page hero and a 93px plate on /sectors/. */
const ROLES = require('./imageroles.js');

const jobs = [];
for (const [name, roles] of Object.entries(ROLES)) {
  const src = path.join(SRC, name + '.jpg');
  if (!fs.existsSync(src)) { console.error('missing source: ' + name + '.jpg'); process.exitCode = 1; continue; }
  const nat = jpegWidth(fs.readFileSync(src));
  const want = new Set();
  roles.forEach(r => (WIDTHS[r] || []).forEach(w => { if (w < nat) want.add(w); }));
  /* A photograph in two roles is cropped only if every one of them wants
     the same shape; otherwise one page would get a picture cut for another. */
  const shapes = roles.map(r => ASPECT[r]);
  const aspect = shapes.every(a => a && Math.abs(a - shapes[0]) < 1e-6) ? shapes[0] : 0;
  for (const w of want) {
    const out = path.join(OUT, name + '-' + w + '.jpg');
    const stale = !fs.existsSync(out) || fs.statSync(out).mtimeMs < fs.statSync(src).mtimeMs;
    if (stale || process.argv.includes('--force')) jobs.push({ src, name: name + '-' + w + '.jpg', w, aspect });
  }
}

/* The width of a JPEG, from its SOF marker. Ten lines beats a dependency. */
function jpegWidth(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xFF) { i++; continue; }
    const m = buf[i + 1];
    if (m === 0xD8 || m === 0x01 || (m >= 0xD0 && m <= 0xD7)) { i += 2; continue; }
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) return buf.readUInt16BE(i + 7);
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error('not a JPEG');
}

if (!jobs.length) { console.log('variants: nothing to make'); process.exit(0); }

const toUrl = p => 'file:///' + p.split(String.fromCharCode(92)).join('/').replace(/^[/]+/, '');
const html = `<!doctype html><meta charset="utf-8"><body><script>
const JOBS = ${JSON.stringify(jobs.map(j => ({ url: toUrl(j.src), name: j.name, w: j.w, aspect: j.aspect })))};
const Q = ${QUALITY};
function one(j) {
  return new Promise(res => {
    const im = new Image();
    im.onload = () => {
      // The slice of the original that survives the crop, taken from the middle.
      let sx = 0, sy = 0, sw = im.naturalWidth, sh = im.naturalHeight;
      if (j.aspect) {
        if (sw / sh > j.aspect) { sw = Math.round(sh * j.aspect); sx = Math.round((im.naturalWidth - sw) / 2); }
        else { sh = Math.round(sw / j.aspect); sy = Math.round((im.naturalHeight - sh) / 2); }
      }
      const w = Math.min(j.w, sw);
      const h = Math.round(sh * (w / sw));
      // step down in halves: one big draw loses detail a halving chain keeps
      let cur = im, cx = sx, cy = sy, cw = sw, ch = sh;
      while (cw / 2 > w) {
        const t = document.createElement('canvas');
        t.width = Math.round(cw / 2); t.height = Math.round(ch / 2);
        const tx = t.getContext('2d'); tx.imageSmoothingQuality = 'high';
        tx.drawImage(cur, cx, cy, cw, ch, 0, 0, t.width, t.height);
        cur = t; cx = 0; cy = 0; cw = t.width; ch = t.height;
      }
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(cur, cx, cy, cw, ch, 0, 0, w, h);
      res({ name: j.name, w, h, data: c.toDataURL('image/jpeg', Q) });
    };
    im.onerror = () => res({ name: j.name, error: 'could not read ' + j.url });
    im.src = j.url;
  });
}
Promise.all(JOBS.map(one)).then(rs => {
  const p = document.createElement('pre'); p.id = 'out';
  p.textContent = JSON.stringify(rs);
  document.body.appendChild(p);
});
</script></body>`;

const tmp = path.join(os.tmpdir(), 'variants-' + Date.now() + '.html');
fs.writeFileSync(tmp, html);
console.log('variants: making ' + jobs.length + ' file' + (jobs.length === 1 ? '' : 's') + '…');

execFile(CHROME, [
  '--headless=new', '--disable-gpu', '--allow-file-access-from-files',
  '--virtual-time-budget=120000', '--no-first-run',
  '--user-data-dir=' + path.join(os.tmpdir(), 'variants-profile'),
  '--dump-dom', toUrl(tmp)
], { maxBuffer: 1 << 29, timeout: 600000 }, (err, dom) => {
  fs.unlinkSync(tmp);
  if (err && !dom) { console.error('Chrome failed: ' + err.message); process.exit(1); }
  const m = dom.match(/<pre id="out">([\s\S]*?)<\/pre>/);
  if (!m) { console.error('no output from Chrome'); process.exit(1); }
  const rs = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
  fs.mkdirSync(OUT, { recursive: true });
  let bytes = 0, bad = 0;
  for (const r of rs) {
    if (r.error) { console.error('  ' + r.name + ': ' + r.error); bad++; continue; }
    const buf = Buffer.from(r.data.split(',')[1], 'base64');
    fs.writeFileSync(path.join(OUT, r.name), buf);
    bytes += buf.length;
  }
  console.log('variants: wrote ' + (rs.length - bad) + ' files, ' + (bytes / 1024 | 0) + ' KB');
  if (bad) process.exit(1);
});
