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
 * Routing to a company's own desk, each optional; unset ones fall back to
 * CONTACT_TO. A value may hold several addresses separated by commas.
 *
 *   CONTACT_TO_TIBECO_GROUP        everything addressed to TIBECO Group: an
 *   CONTACT_TO_LUSAIL_COMMERCIAL   enquiry with that area of interest, a
 *   CONTACT_TO_ROMA_COMMERCIAL     quotation on one of its events (by the
 *   CONTACT_TO_CAVALLO_LAUNDRY     reference prefix), an invitation request
 *   CONTACT_TO_NERO_CAFE
 *   CONTACT_TO_SUPPLIERS           supplier registrations (default: TIBECO
 *                                  Group's address if set, else CONTACT_TO)
 *   CONTACT_CC                     copied on every message, e.g. the general inbox
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
const { SITE, ALL_COMPANIES, SECTORS, PARTNER_TYPES, FORMS, FORM_LISTS, SUPPLY, OPPORTUNITIES } = require('../data/site.js');

/* Where a message goes. The general inbox unless a desk is configured for
   the company the message concerns: the area of interest on an enquiry, or
   the issuing company of the event a quotation answers. */
const envList = name => (process.env[name] || '').split(',').map(s => s.trim()).filter(Boolean);
const deskOf = slug => envList('CONTACT_TO_' + String(slug || '').toUpperCase().replace(/-/g, '_'));
function recipients(form, body) {
  const general = envList('CONTACT_TO');
  const fallback = general.length ? general : [SITE.contact.email];
  let to = [];
  if (form === 'supplier') to = envList('CONTACT_TO_SUPPLIERS').length ? envList('CONTACT_TO_SUPPLIERS') : deskOf('tibeco-group');
  else if (form === 'quote') {
    const ref = typeof body.reference === 'string' ? body.reference.trim() : '';
    const ev = OPPORTUNITIES.find(o => o.ref === ref);
    if (ev) to = deskOf(ev.company);
  } else if (form === 'enquiry' || !form) {
    const area = typeof body.area === 'string' ? body.area.trim() : '';
    if (ALL_COMPANIES.some(c => c.slug === area)) to = deskOf(area);
  }
  if (!to.length) to = fallback;
  const cc = envList('CONTACT_CC').filter(a => !to.includes(a));
  return { to, cc };
}

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
   nothing more. The checks that carry the weight are below: the honeypot,
   the origin, the time the page had been open, the link count, and — once
   the keys are set — Cloudflare Turnstile. */
const seen = new Map();
const RATE = { max: 5, windowMs: 10 * 60 * 1000 };

/* Where a submission may come from: the site itself, and Vercel's preview
   deployments. A browser always sends Origin with a cross-site or same-site
   POST from fetch; a script posting straight at the function usually does
   not, or sends someone else's. Local builds are served from localhost. */
const SITE_HOST = new URL(SITE.domain).hostname.replace(/^www\./, '');
function originOk(req) {
  const o = req.headers.origin || '';
  if (!o) return false;
  let h;
  try { h = new URL(o).hostname; } catch (e) { return false; }
  return h === SITE_HOST || h.endsWith('.' + SITE_HOST) || h.endsWith('.vercel.app') || h === 'localhost' || h === '127.0.0.1';
}

/* A real person takes longer than this to fill in a form. The page sends how
   long it had been open; a bot posting straight at the function sends
   nothing, and one driving the page sends something tiny. */
const MIN_FILL_MS = 2500;

/* Cloudflare Turnstile. Verified only when the secret is set; the pages carry
   the widget only when the site key was set at build time, so the two go
   together. A missing or failed token is refused with a message the visitor
   can act on. */
const TURNSTILE_SECRET = (process.env.TURNSTILE_SECRET_KEY || '').trim();
async function humanOk(body, ip) {
  if (!TURNSTILE_SECRET) return { ok: true };
  const token = typeof body['cf-turnstile-response'] === 'string' ? body['cf-turnstile-response'].slice(0, 2048) : '';
  if (!token) return { ok: false, why: 'The human check did not load. Reload the page and try again.' };
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token, remoteip: ip }).toString()
    });
    const j = await r.json().catch(() => ({}));
    if (j.success) return { ok: true };
    console.error('contact: turnstile refused ' + JSON.stringify(j['error-codes'] || []));
    return { ok: false, why: 'The human check failed. Reload the page and try again.' };
  } catch (err) {
    console.error('contact: turnstile ' + (err && err.message));
    return { ok: false, why: 'The human check could not be reached. Try again in a moment.' };
  }
}

/* Spam reads like spam: a message that is mostly links, or that carries more
   than a couple of them, is refused with a reason. Two is generous for a
   genuine enquiry (a website and a product page). */
const linkCount = s => (String(s).match(/https?:\/\/|www\./gi) || []).length;
function looksLikeSpam(body) {
  const texts = ['message', 'products', 'clients'].map(k => body[k]).filter(v => typeof v === 'string');
  if (texts.some(t => linkCount(t) > 2)) return 'Please keep links out of the message — two at most — and send it again.';
  return '';
}

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

/* The lists a FORMS field can take its values from, as value -> label. */
const OPTION_LABELS = {
  partnerTypes: Object.fromEntries(PARTNER_TYPES.map(p => [p.v, p.t])),
  sectors: Object.fromEntries(SECTORS.map(x => [x.slug, x.name])),
  supplyCategories: Object.fromEntries(SUPPLY.map(x => [x.slug, x.name])),
  companyTypes: Object.fromEntries(FORM_LISTS.companyTypes),
  currencies: Object.fromEntries(FORM_LISTS.currencies),
  incoterms: Object.fromEntries(FORM_LISTS.incoterms),
  validity: Object.fromEntries(FORM_LISTS.validity),
  areas: AREAS,
  interests: Object.assign({ general: 'A general enquiry', partnership: 'Working with the Group' },
    Object.fromEntries(SECTORS.map(x => [x.slug, x.name])))
};

async function sendDefined(spec, body, res) {
  const rows = [];
  let email = '', name = '', company = '', message = '', subjectExtra = '';
  for (const fd of spec.fields) {
    if (!fd.name) continue;                       // a step heading, not a field
    const raw = body[fd.name];
    let v = '';
    if (fd.type === 'checks') {
      const allowed = OPTION_LABELS[fd.options] || {};
      const picked = (Array.isArray(raw) ? raw : raw ? [raw] : []).filter(x => allowed[x]);
      if (fd.required && !picked.length) return res.status(400).json({ error: 'Missing: ' + fd.name });
      v = picked.length === Object.keys(allowed).length ? (fd.all || 'All sectors') : picked.map(x => allowed[x]).join(', ');
    } else if (fd.type === 'select') {
      const allowed = OPTION_LABELS[fd.options] || {};
      const x = clean(raw, 80);
      v = allowed[x] || '';
    } else if (fd.type === 'agree') {
      /* a single box; the browser sends 'yes' (or 'on') only when ticked */
      const x = Array.isArray(raw) ? raw[0] : raw;
      v = x === 'yes' || x === 'on' || x === true ? 'Yes' : '';
    } else if (fd.type === 'textarea') {
      v = typeof raw === 'string' ? raw.trim().slice(0, fd.max || 5000) : '';
    } else {
      v = clean(raw, fd.max || 200);
    }
    if (fd.required && !v) return res.status(400).json({ error: 'Missing: ' + fd.name });
    if (fd.type === 'email' && v && !isEmail(v)) return res.status(400).json({ error: 'That email address is not valid' });
    if (fd.name === 'email') email = v;
    if (fd.name === 'name') name = v;
    if (fd.name === 'company') company = v;
    if (fd.name === spec.subjectFrom) subjectExtra = v;
    /* the field called `message` is the body of the email; any other long
       text is a row, so a registration's product list is not lost */
    if (fd.name === 'message') { message = v; continue; }
    if (fd.type === 'hidden' && !v) continue;
    rows.push([fd.short || fd.label, v || '—']);
  }
  if (!email) return res.status(400).json({ error: 'Missing: email' });
  rows.push(['Received', qatarTime(new Date())]);

  const { to, cc } = recipients(body.form, body);
  const from = process.env.CONTACT_FROM || 'Lusail Corp Website <onboarding@resend.dev>';
  const title = spec.subject;
  const html = `<!doctype html>
<div style="font:15px/1.6 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#030C2B;max-width:640px">
  <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#8A6A24">Lusail Corp &middot; website</p>
  <h2 style="margin:0 0 20px;font-size:20px;font-weight:600">${esc(title)}</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-bottom:24px">
    ${rows.map(([k, v]) => `<tr>
      <td style="padding:7px 16px 7px 0;color:#6E7488;white-space:nowrap;vertical-align:top;border-bottom:1px solid #EFEEEC">${esc(k)}</td>
      <td style="padding:7px 0;border-bottom:1px solid #EFEEEC">${esc(v)}</td>
    </tr>`).join('')}
  </table>
  ${message ? `<div style="border-inline-start:3px solid #D3A750;padding:2px 0 2px 16px;white-space:pre-wrap">${esc(message)}</div>` : ''}
  <p style="margin:28px 0 0;font-size:13px;color:#6E7488">Reply directly to this email to answer ${esc(name || email)}.</p>
</div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + (message ? '\n\n' + message + '\n' : '\n');

  try {
    const r = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({
        from, to, reply_to: email,
        subject: headerSafe(`${title}${subjectExtra && subjectExtra !== '—' ? ' — ' + subjectExtra : ''} — ${company || name || email}`),
        html, text
      }, cc.length ? { cc } : {}))
    });
    if (!r.ok) {
      console.error('contact: resend ' + r.status + ' ' + await r.text());
      return res.status(502).json({ error: 'Could not send the message' });
    }
    const data = await r.json().catch(() => ({}));
    return res.status(200).json({ ok: true, id: data.id || null });
  } catch (err) {
    console.error('contact: ' + (err && err.message));
    return res.status(502).json({ error: 'Could not send the message' });
  }
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
     Answer 200 so the bot learns nothing from the response. The same silent
     200 goes to a post from nowhere (no Origin, or another site's) and to a
     form "filled in" faster than a person could read it. */
  if (clean(body.website, 200)) return res.status(200).json({ ok: true });
  if (!originOk(req)) { console.error('contact: origin refused ' + (req.headers.origin || '(none)')); return res.status(200).json({ ok: true }); }
  if (typeof body.t !== 'number' || !(body.t >= MIN_FILL_MS)) { console.error('contact: too fast ' + body.t); return res.status(200).json({ ok: true }); }

  const ip = headerSafe(
    (req.headers['x-forwarded-for'] || '').split(',')[0] || 'unknown');
  if (tooMany(ip)) {
    return res.status(429).json({ error: 'Too many messages. Try again shortly.' });
  }

  const spam = looksLikeSpam(body);
  if (spam) return res.status(400).json({ error: spam });
  const human = await humanOk(body, ip);
  if (!human.ok) return res.status(400).json({ error: human.why });

  /* A form defined in data/site.js FORMS: checked field by field against
     that definition, so a field added there is validated and emailed here
     with nothing else to change. */
  const spec = FORMS[body.form];
  if (spec) return sendDefined(spec, body, res);

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
  const { to, cc } = recipients('enquiry', f);
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
      body: JSON.stringify(Object.assign({
        from,
        to,
        // so a reply from the inbox goes straight back to the enquirer
        reply_to: f.email,
        subject: headerSafe(`Website enquiry — ${areaLabel} — ${f.name}`),
        html,
        text
      }, cc.length ? { cc } : {}))
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
