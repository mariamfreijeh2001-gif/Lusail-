# Lusail Corp — website

A multi-page static site for Lusail Corp, generated from one content file.
No framework, no dependencies: `node build/render.js` reads `data/site.js` and
writes finished HTML into `dist/`.

```bash
npm start     # build, then serve on http://localhost:5173
npm run build # build only, into dist/
```

## Pages

| URL | |
|---|---|
| `/` | Home — the whole group in one pass |
| `/about/` | How the group is structured and governed |
| `/companies/` | Index of all six operating companies |
| `/companies/<slug>/` | One page per company (six of them) |
| `/careers/` | Working here, and open roles |
| `/contact/` | Office, channels, enquiry form |
| `/404.html` | Not found |

## Where things live

```
data/site.js          ALL content — company names, copy, nav, roles, contact
build/render.js       templates + generator
assets/css/site.css   one stylesheet; design tokens at the top
assets/js/site.js     language toggle, nav, sector rail, contact form
site-assets/logo/     the real logo kit (SVG) + favicons
site-assets/img/      web-sized photography
dist/                 generated — never edit, never commit
```

## Editing content

Everything is in [data/site.js](data/site.js). To rename a company, change
`company` in its entry — its own page, the home rail, the cards, the footer and
every sibling link all update on the next build.

Each company entry carries both languages:

```js
{
  slug: 'trading',            // the URL: /companies/trading/
  photo: 'trading',           // expects trading-hero.jpg + trading-card.jpg
  sector: 'Commodity trading', sectorAr: 'تجارة السلع',
  company: 'Lusail Trading',   companyAr: 'لوسيل للتجارة',
  short, intro, body[], caps[], figs[]   // each with an -Ar counterpart
}
```

Adding a seventh company means adding one entry plus two images
(`<photo>-hero.jpg` at 2000×857 and `<photo>-card.jpg` at 900×675). The rail,
the cards and the sitemap all size themselves to the list.

### Placeholders that must be replaced

- **The six company names are invented.** They are marked
  `nameProvisional: true`. The sectors were read off the photography — grain,
  green coffee, rigs, cranes, container terminals, warehouses — because the
  folder contains no café or laundry imagery at all. Confirm the real list.
- `figs: []` is empty on every company. Fill it with real figures
  (`{ v: '14', l: 'countries we source from' }`) or leave it empty and the
  block does not render.
- Phone number and office address are placeholders.
- Open roles in `OPEN_ROLES` are examples. Set it to `[]` to show the
  "no current openings" state.

Founding year and employee count appear nowhere, by request.

## Design

Green is **not** the site colour. It appears in the logo and in exactly one
deep band — the footer. Every other dark surface is charcoal `#16181A`, the
identity is carried by gold `#BC9640` on cool neutrals, and the photography
supplies the rest. Tokens are at the top of `assets/css/site.css`.

Type is Marcellus for display (Roman inscriptional capitals, the Latin
counterpart to the Kufic mark) with IBM Plex Sans for body, and
Noto Kufi Arabic / IBM Plex Sans Arabic for Arabic, so both scripts are
typographic siblings rather than two different websites.

## Bilingual

English and Arabic with full RTL. Each translatable element holds English as
its content and Arabic in `data-ar`; the toggle swaps them, sets `lang`/`dir`,
and remembers the choice. An inline script in `<head>` applies the saved
language before first paint. `?lang=ar` deep-links into Arabic.

Both languages must be present on a node or the toggle will blank it.

## Contact form

Validates in the browser and, by default, **sends nothing**. To make it live,
set `CONTACT_ENDPOINT` in [assets/js/site.js](assets/js/site.js) to a URL that
accepts a JSON `POST`. Payload is `{name, email, topic, message, lang}`. On
failure it tells the visitor to email `info@lusailcorp.qa` instead.

## Deploying

`vercel.json` is committed, so Vercel needs no manual configuration — it runs
`npm run build` and serves `dist/`. Any other static host works the same way:
build, then upload `dist/`.

Before going live, point the domain at the real one: `SITE.domain` in
`data/site.js` feeds the canonical URL, OpenGraph tags and the sitemap.
