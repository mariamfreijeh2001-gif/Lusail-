# Lusail Corp — website

A multi-page static site, generated from one content file. No framework, no
dependencies: `node build/render.js` reads `data/site.js` and writes finished
HTML into `dist/`.

```bash
npm start     # build, then serve on http://localhost:5173
npm run build # build only, into dist/
```

## Structure

Two tiers: a **sector** holds any number of **companies**. The Group runs four
sectors today, and a company can sit in more than one of them — Lusail
Commercial appears under both Trading and Supply & Distribution.

| URL | |
|---|---|
| `/` | Home |
| `/about/` | Who we are, vision, mission, approach, values |
| `/companies/` | The portfolio, filterable by sector |
| `/companies/<slug>/` | One company |
| `/sectors/` | Every sector |
| `/sectors/<slug>/` | One sector, and the companies in it |
| `/partnerships/` | Who the Group wants to hear from |
| `/careers/` | Working here, and how to apply |
| `/contact/` | Channels and the enquiry form |
| `/404.html` | Not found |

Adding a company to a sector means adding one object to that sector's
`companies` array. The mega-menu, the filter chips and their counts, the home
marquee, the sector pages, the footer, the contact dropdown and the sitemap all
resize themselves.

## Where things live

```
data/site.js          ALL content — sectors, companies, values, partners, nav
build/render.js       templates + generator
assets/css/site.css   one stylesheet; design tokens at the top
assets/js/site.js     language, mega-menu, company filter, contact form
site-assets/logo/     the logo kit (SVG) + favicons
site-assets/img/      web-sized photography
dist/                 generated — never edit, never commit
```

## Editing content

Everything is in [data/site.js](data/site.js). A sector:

```js
{
  slug: 'trading',
  name: 'Trading & Commodities', nameAr: '…',
  headline, short, intro, body[],      // each with an -Ar counterpart
  photo: 'grain', photoStyle: 'still', // 'plate' | 'still' | 'none'
  companies: [ … ]                     // zero or more
}
```

A company adds `role`, `facts[]`, `cta`, and optionally `products[]` and
`activities[]` (only Lusail Commercial uses those today).

Every text field has an `-Ar` counterpart. Both languages must be present or
the toggle will blank that node.

### Photography is honest about what it has

`photoStyle` is one of:

- **`plate`** — a strong photograph, full width, caption underneath
- **`still`** — a cutout product shot, contained on its own white
- **`none`** — no photograph at all

**Cavallo Laundry and ROMA Commercial are set to `none`.** The supplied folder
contains no laundry imagery and no fresh-produce imagery, so those pages are
typographic rather than illustrated with a picture that is not of their
business. Supply real photography and switch them to `plate`.

Adding a photo means, in `site-assets/img/`:

- `<photo>-wide.jpg` at 2400×1029 (21:9) for a plate, **or**
  `<photo>-still.jpg` at 1100×1100 for a cutout product shot
- `<photo>-card.jpg` at 1000×750 (4:3) for the marquee card

### Before launch

- **Arabic is mine, not yours.** Every `-Ar` field was written for this build
  and reads correctly, but no native speaker on your side has reviewed it.
- Email addresses (`info@`, `partnerships@`, `careers@`) are assumed.
- LinkedIn and Instagram in `SITE.contact` are `#` placeholders.
- `OPEN_ROLES` is `[]`, which renders the "No Current Opening?" state the
  brief specifies. Add roles to that array when there are any.
- `SITE.domain` feeds the canonical URL, OpenGraph tags and the sitemap.

## Design

Editorial and typographic: type and white space carry the page, on white.
The palette is deep navy `#030C2B`, gold `#D3A750`, grey `#D0CECC` and white.
Navy anchors the footer and sets the type colour; gold carries the identity;
a warm sand band sits behind the values. Tokens are at the top of
`assets/css/site.css` — changing the brand is changing those.

**Nothing is written over a photograph**, anywhere. And **nothing in the layout
is derived from the logo**, which appears only in the header, the footer and the
favicon. `SITE.brand` holds those filenames, so swapping the logo is one edit
and the design survives a rebrand. The neutral black/white logo variants are
used deliberately, so the mark does not clash if the palette changes again.

Type is Marcellus for display with IBM Plex Sans for body, and Noto Kufi Arabic
/ IBM Plex Sans Arabic for Arabic, so both scripts are typographic siblings.

### Interactive parts

- **Mega-menu** — hovering "Our Sectors" opens every sector and company at
  once. Keyboard accessible, closes on Escape, never opens on touch.
- **Sector marquee** — the sectors are cards that move continuously. The track
  holds each sector twice and slides exactly −50%, so the loop is seamless; the
  second copy is `aria-hidden` and untabbable so a screen reader hears each
  sector once. It pauses on hover and on keyboard focus, in CSS alone, and
  under `prefers-reduced-motion` it does not animate at all — the clones are
  dropped and the track becomes a wrapping grid.
- **Company filter** — `/companies/` slices the portfolio by sector without a
  reload, keeps a live count, and writes `?sector=` so a view can be linked to.
- **Hero** — type beside a photograph, sized so that header + hero is exactly
  one screen on desktop. The display size is clamped against viewport *height*
  as well as width, so a short window does not push the buttons below the fold.

## Bilingual

English and Arabic with full RTL. Each translatable element holds English as
its content and Arabic in `data-ar`; the toggle swaps them, sets `lang`/`dir`,
and remembers the choice. An inline script in `<head>` applies the saved
language before first paint, and `?lang=ar` deep-links into Arabic.

**A translatable element must never contain another.** The toggle rewrites
`textContent`, so a nested `data-ar` child is destroyed on the first switch.
Split the line into sibling spans instead — see the values heading.

## Contact form

Validates in the browser, then `POST`s the whole form as JSON to
`CONTACT_ENDPOINT` — [api/contact.js](api/contact.js), a Vercel serverless
function that relays through Resend. The payload carries `area`, the dropdown
value, so an enquiry can be routed to the right company; the function turns
that code into the company's real name and puts it in the subject line.

The function needs `RESEND_API_KEY` set in the Vercel project. `CONTACT_TO`
and `CONTACT_FROM` are optional overrides.

If the key is missing, or the request fails for any reason, the form does
**not** claim success. It opens the visitor's mail client with the message
already filled in, addressed to `info@lusailcorp.com`, so an enquiry is never
silently lost.

## Deploying

`vercel.json` is committed, so Vercel needs no manual configuration — it runs
`npm run build` and serves `dist/`. Any other static host works the same way:
build, then upload `dist/`.
