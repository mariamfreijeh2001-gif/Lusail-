# Lusail Corp — open items

Everything still outstanding on the site, and where each one lives. Items under
**Needs you** cannot be finished without information only Lusail Corp has.

---

## Needs you

### 1. Social media handles — *footer*
LinkedIn and Instagram were pointing at `#`, a dead link. They are now **hidden
until real URLs exist**, so nothing broken is published in the meantime.

Give me the two profile URLs, or set them yourself in
[data/site.js](data/site.js) under `contact`:

```js
linkedin: 'https://www.linkedin.com/company/…',
instagram: 'https://www.instagram.com/…',
```

The links reappear in the footer automatically.

### 2. Contact form — set the Resend key in Vercel

The form now posts to [api/contact.js](api/contact.js), which relays through
Resend. **It needs one environment variable before it can send.**

Vercel → Project → Settings → Environment Variables:

| Name | Value | Required |
|---|---|---|
| `RESEND_API_KEY` | from resend.com/api-keys | **yes** |
| `CONTACT_TO` | where enquiries land (defaults to `info@lusailcorp.com`) | no |
| `CONTACT_FROM` | the From address | no |

Add it to **Production, Preview and Development**, then redeploy — env vars are
read at deploy time, so an existing deployment will not pick it up.

**`CONTACT_FROM` needs a verified domain.** Until lusailcorp.com is verified in
Resend (Domains → Add → paste the DKIM/SPF records into HostGator), Resend only
accepts `onboarding@resend.dev`, which is the built-in default. So the form
works as soon as the key is set, and starts sending from your own domain later
without a code change.

Until the key exists the form does not pretend to succeed — it opens the
visitor's mail client with the message prefilled, so no enquiry is lost.

### 3. Real phone number
`+974 0000 0000` is a deliberate placeholder, as you asked. Replace `phone` in
[data/site.js](data/site.js) when the line is live.

### 4. Domain and DNS — blocking launch

The live domain is **lusailcorp.com**. It is registered, DNS is managed at
**HostGator**, and right now it shows a parking error page:

| Host | Points at | State |
|---|---|---|
| `lusailcorp.com` | a parking IP (216.150.1.1 / 208.91.197.13) | **wrong** — this is the error page |
| `www.lusailcorp.com` | `ef2b1ec2f8d15bf2.vercel-dns-016.com` | Vercel CNAME set, but HTTPS does not answer |

The error page is **not from Vercel** — it is the domain parking page, 195
bytes of plain HTML with no server header. This will **not** fix itself with
time. Two steps:

1. **Vercel** → Project → Settings → Domains → add both `lusailcorp.com` and
   `www.lusailcorp.com`. Vercel then shows the exact records to use and issues
   the TLS certificate automatically once they match. The fact that HTTPS on
   www times out suggests the domain is not added to the project yet.
2. **HostGator** → cPanel → Zone Editor for lusailcorp.com:
   - **Delete** the parking `A` record on `@`.
   - **Add** `A` on `@` → the IP Vercel shows (currently `76.76.21.21`).
   - Leave the `www` CNAME alone — that part is already correct.

Allow up to a few hours for propagation after the change.

Do **not** switch the nameservers to Vercel unless email moves too — the
mailboxes would go with them.

### 5. Email does not exist yet

`lusailcorp.com` has **no MX records**, so `info@lusailcorp.com` cannot receive
anything today. That address is published on every page and is where the
contact form delivers. Set up a mailbox — HostGator includes email hosting, or
use Google Workspace / Microsoft 365 — before launch.

> The site previously said **lusailcorp.qa**. That domain is **not registered**
> at all, so the published email address and every canonical URL pointed
> nowhere. Both now use lusailcorp.com. If .qa is wanted, register it first.

### 6. ROMA Commercial has no photograph
Every other company has imagery. ROMA renders in the typographic style, which
looks deliberate rather than broken, but a photo would balance the set. Food
distribution, warehousing or packaged goods would fit.

### 7. Careers images are placeholders
`careers-a.jpg`, `careers-b.jpg`, `careers-c.jpg` are stand-ins to show the
layout, as agreed. Replace them one at a time — same filenames, no code change.

### 8. Arabic needs a native review
Every Arabic string on the site is my translation. The structure and RTL
behaviour are sound, but the **wording should be read by a native speaker**
before launch, particularly the company descriptions and the value statements.
All of it sits in `data-ar` attributes in [data/site.js](data/site.js).

---

## Done

- **Redirects** — 33 rules in [vercel.json](vercel.json). Covers the URLs
  people guess (`/about-us`, `/our-sectors`, `/contact-us`), singular forms
  (`/sector/x`, `/company/x`), the removed News section, and every historical
  slug from the placeholder era (`/sectors/logistics`,
  `/companies/lusail-coffee` and the rest) so old indexed links still land.
  All destinations verified against the real routes; none shadow a live page.
- **Contact form no longer claims a false send** — see item 2.
- **Dead `#` links removed** — see item 1.
- **Option 2 logo** across header, footer and favicons.

---

## Notes

- Content lives in **one file**, [data/site.js](data/site.js). Sectors,
  companies, nav and contact details are all there; the pages rebuild from it.
- `npm run build` regenerates `dist/`. Vercel runs this on every push.
- A company can sit in more than one sector via `alsoIn` — this is how Lusail
  Commercial appears under both Trading and Supply & Distribution.
