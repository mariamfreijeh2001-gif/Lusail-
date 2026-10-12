/* Bring a photograph into the site.
 *
 *   npm run import -- "path/to/any photo.png" hero-tibeco
 *   npm run import -- a.jpg card-energy b.webp prod-rice      (pairs)
 *   npm run import -- --max=2560 big.jpg hero-doha            (a full-width banner)
 *
 * Takes a JPEG, PNG or WebP of any size and writes site-assets/img/<name>.jpg
 * at most 1600px wide, or --max wide. A banner runs the full width of the
 * screen — 2880 real pixels on a 1440 laptop with a sharp display — so give
 * banners --max=2560 from the largest original there is. The
 * same headless Chrome that build/variants.js uses does the resampling, so
 * there is nothing to install. Replacing a photograph is the same command
 * with the existing name; then run `npm run images` and `npm run build`.
 *
 * A new name also needs a line in build/imageroles.js saying what it is for.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFile } = require('child_process');

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const OUT = path.join(__dirname, '..', 'site-assets/img');
const flag = process.argv.find(a => a.startsWith('--max='));
const MAX = flag ? parseInt(flag.slice(6), 10) : 1600;
const QUALITY = MAX > 1600 ? 0.86 : 0.84;

const args = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!args.length || args.length % 2) {
  console.error('usage: npm run import -- <photo> <name> [<photo> <name> …]');
  process.exit(1);
}
const jobs = [];
for (let i = 0; i < args.length; i += 2) {
  const src = path.resolve(args[i]), name = args[i + 1].replace(/\.jpe?g$/i, '');
  if (!fs.existsSync(src)) { console.error('not found: ' + src); process.exit(1); }
  if (!/^[a-z0-9-]+$/.test(name)) { console.error('name must be lowercase-with-dashes: ' + name); process.exit(1); }
  jobs.push({ src, name });
}

const toUrl = p => 'file:///' + p.split(String.fromCharCode(92)).join('/').replace(/^[/]+/, '');
const html = `<!doctype html><meta charset="utf-8"><body><script>
const JOBS = ${JSON.stringify(jobs.map(j => ({ url: toUrl(j.src), name: j.name })))};
function one(j) {
  return new Promise(res => {
    const im = new Image();
    im.onload = () => {
      const w = Math.min(${MAX}, im.naturalWidth), h = Math.round(im.naturalHeight * w / im.naturalWidth);
      let cur = im, cw = im.naturalWidth, ch = im.naturalHeight;
      while (cw / 2 > w) {
        const t = document.createElement('canvas');
        t.width = Math.round(cw / 2); t.height = Math.round(ch / 2);
        const tx = t.getContext('2d'); tx.imageSmoothingQuality = 'high';
        tx.drawImage(cur, 0, 0, cw, ch, 0, 0, t.width, t.height);
        cur = t; cw = t.width; ch = t.height;
      }
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const ctx = c.getContext('2d'); ctx.imageSmoothingQuality = 'high';
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h);   // a transparent PNG gets a white ground, not black
      ctx.drawImage(cur, 0, 0, cw, ch, 0, 0, w, h);
      res({ name: j.name, w, h, data: c.toDataURL('image/jpeg', ${QUALITY}) });
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

const tmp = path.join(os.tmpdir(), 'import-' + Date.now() + '.html');
fs.writeFileSync(tmp, html);
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
  let bad = 0;
  for (const r of rs) {
    if (r.error) { console.error('  ' + r.name + ': ' + r.error); bad++; continue; }
    const buf = Buffer.from(r.data.split(',')[1], 'base64');
    fs.writeFileSync(path.join(OUT, r.name + '.jpg'), buf);
    console.log(`  ${r.name}.jpg  ${r.w}x${r.h}  ${buf.length / 1024 | 0} KB`);
  }
  if (bad) process.exit(1);
});
