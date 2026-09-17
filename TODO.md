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

### 2. Contact form delivery — *most important*
The form previously told visitors *"Message sent"* while sending nothing —
enquiries were silently lost. It now opens the visitor's email app with the
message prefilled to `info@lusailcorp.qa`, so nothing disappears.

That is a stopgap. For a proper form, pick one and give me the endpoint URL:

| Option | Cost | Notes |
|---|---|---|
| **Formspree** | free tier | Fastest. Sign up, paste the form URL. |
| **Vercel serverless + Resend** | free tier | Stays on your own domain; I write the function. |
| **Web3Forms** | free | No account needed, just an access key. |

It goes into `CONTACT_ENDPOINT` at the top of the form block in
[assets/js/site.js](assets/js/site.js).

### 3. Real phone number
`+974 0000 0000` is a deliberate placeholder, as you asked. Replace `phone` in
[data/site.js](data/site.js) when the line is live.

### 4. The live domain
`SITE.domain` is currently `https://lusailcorp.qa`. This is used for canonical
tags, social preview cards and `sitemap.xml` — **if the real domain differs,
search engines and link previews will point at the wrong place.** Confirm it.

### 5. ROMA Commercial has no photograph
Every other company has imagery. ROMA renders in the typographic style, which
looks deliberate rather than broken, but a photo would balance the set. Food
distribution, warehousing or packaged goods would fit.

### 6. Careers images are placeholders
`careers-a.jpg`, `careers-b.jpg`, `careers-c.jpg` are stand-ins to show the
layout, as agreed. Replace them one at a time — same filenames, no code change.

### 7. Arabic needs a native review
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
