/* Contact form delivery, via Resend.
 *
 * Vercel picks this up automatically as a serverless function at /api/contact,
 * alongside the static build in dist/. No dependencies — Resend has a plain
 * REST API and the Node runtime has global fetch.
 *
 * Environment variables (Vercel > Project > Settings > Environment Variables):
 *
 *   RESEND_API_KEY   required   from resend.com/api-keys
 *   CONTACT_TO       optional   where enquiries land   (default info@lusailcorp.com)
 *   CONTACT_FROM     optional   the From address       (default onboarding@resend.dev)
 *
 * CONTACT_FROM must be on a domain verified in Resend. Until lusailcorp.com is
 * verified there, Resend only accepts onboarding@resend.dev, which is why that
 * is the default — the form works the moment the key is set, and starts sending
 * from the company's own domain once the domain is verified.
 */

const ENDPOINT = 'https://api.resend.com/emails';

const LIMITS = {
  name: 120, company: 160, email: 254,
  phone: 40, area: 60, message: 5000
};

/* The area codes come from the same file that renders the form's <select>, so
   the two cannot drift apart. The list includes every company, which is how an
   enquiry reaches the right desk rather than a general inbox. Anything not on
   the list is treated as unspecified rather than trusted into a header. */
const { SITE, ALL_COMPANIES } = require('../data/site.js');

const AREAS = Object.assign(
  { general: 'General Enquiry' },
  ...ALL_COMPANIES.map(c => ({ [c.slug]: c.name })),
  {
    supplier: 'Supplier Opportunity',
    partnership: 'Business Partnership',
    careers: 'Careers',
    other: 'Other'
  }
);

const esc = s => String(s).replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const clean = (v, max) =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '';

/* A header cannot contain a newline; strip anything that could split one. */
const headerSafe = s => String(s).replace(/[\r\n]+/g, ' ').trim();

const isEmail = s => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);

/* Best-effort speed bump. Serverless instances are recycled and requests are
   spread across them, so this catches a crude flood from one address and
   nothing more. Real abuse protection would need a shared store. */
const seen = new Map();
const RATE = { max: 5, windowMs: 10 * 60 * 1000 };

function tooMany(ip) {
  const now = Date.now();
  for (const [k, v] of seen) if (now - v.first > RATE.windowMs) seen.delete(k);
  const hit = seen.get(ip);
  if (!hit) { seen.set(ip, { first: now, n: 1 }); return false; }
  if (now - hit.first > RATE.windowMs) { seen.set(ip, { first: now, n: 1 }); return false; }
  hit.n += 1;
  return hit.n > RATE.max;
}

/* Qatar runs on AST year round, no daylight saving, so a fixed offset is
   correct and avoids depending on the host's timezone database. */
function qatarTime(d) {
  const t = new Date(d.getTime() + 3 * 60 * 60 * 1000);
  const pad = n => String(n).padStart(2, '0');
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())} ` +
         `${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())} AST`;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('contact: RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Email is not configured' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Expected a JSON body' });
  }

  /* Honeypot. A real person never sees this field, so anything in it is a bot.
     Answer 200 so the bot learns nothing from the response. */
  if (clean(body.website, 200)) return res.status(200).json({ ok: true });

  const ip = headerSafe(
    (req.headers['x-forwarded-for'] || '').split(',')[0] || 'unknown');
  if (tooMany(ip)) {
    return res.status(429).json({ error: 'Too many messages. Try again shortly.' });
  }

  const f = {
    name: clean(body.name, LIMITS.name),
    company: clean(body.company, LIMITS.company),
    email: clean(body.email, LIMITS.email),
    phone: clean(body.phone, LIMITS.phone),
    area: clean(body.area, LIMITS.area),
    lang: body.lang === 'ar' ? 'ar' : 'en',
    // the message keeps its line breaks; only the length is capped
    message: typeof body.message === 'string'
      ? body.message.trim().slice(0, LIMITS.message) : ''
  };

  const missing = ['name', 'email', 'message'].filter(k => !f[k]);
  if (missing.length) {
    return res.status(400).json({ error: 'Missing: ' + missing.join(', ') });
  }
  if (!isEmail(f.email)) {
    return res.status(400).json({ error: 'That email address is not valid' });
  }

  const areaLabel = AREAS[f.area] || 'General Enquiry';
  const to = process.env.CONTACT_TO || SITE.contact.email;
  const from = process.env.CONTACT_FROM || 'Lusail Corp Website <onboarding@resend.dev>';

  const rows = [
    ['Name', f.name],
    ['Company', f.company || '—'],
    ['Email', f.email],
    ['Phone', f.phone || '—'],
    ['Area of interest', areaLabel],
    ['Language', f.lang === 'ar' ? 'Arabic' : 'English'],
    ['Received', qatarTime(new Date())]
  ];

  const html = `<!doctype html>
<div style="font:15px/1.6 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#030C2B;max-width:640px">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8A6A24">
    Lusail Corp &middot; website enquiry
  </p>
  <h2 style="margin:0 0 20px;font-size:20px;font-weight:600">${esc(areaLabel)}</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-bottom:24px">
    ${rows.map(([k, v]) => `<tr>
      <td style="padding:7px 16px 7px 0;color:#6E7488;white-space:nowrap;vertical-align:top;border-bottom:1px solid #EFEEEC">${esc(k)}</td>
      <td style="padding:7px 0;border-bottom:1px solid #EFEEEC">${esc(v)}</td>
    </tr>`).join('')}
  </table>
  <div style="border-inline-start:3px solid #D3A750;padding:2px 0 2px 16px;white-space:pre-wrap">${esc(f.message)}</div>
  <p style="margin:28px 0 0;font-size:13px;color:#6E7488">
    Reply directly to this email to answer ${esc(f.name)}.
  </p>
</div>`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') +
    '\n\n' + f.message + '\n';

  try {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: [to],
        // so a reply from the inbox goes straight back to the enquirer
        reply_to: f.email,
        subject: headerSafe(`Website enquiry — ${areaLabel} — ${f.name}`),
        html,
        text
      })
    });

    if (!r.ok) {
      // log the detail server-side; never return it, it can echo the key's scope
      console.error('contact: resend ' + r.status + ' ' + await r.text());
      return res.status(502).json({ error: 'Could not send the message' });
    }

    const data = await r.json().catch(() => ({}));
    return res.status(200).json({ ok: true, id: data.id || null });
  } catch (err) {
    console.error('contact: ' + (err && err.message));
    return res.status(502).json({ error: 'Could not send the message' });
  }
};
