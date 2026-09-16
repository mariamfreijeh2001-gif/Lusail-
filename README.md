# Lusail Corp — website

A multi-page static site, generated from one content file. No framework, no
dependencies: `node build/render.js` reads `data/site.js` and writes finished
HTML into `dist/`.

```bash
npm start     # build, then serve on http://localhost:5173
npm run build # build only, into dist/
```

## Structure

Two tiers: a **sector** holds any number of **companies**. One is fine, three is
fine. This is the model Gulf conglomerates use — Al Shirawi runs 17 sectors over
50+ companies — and it is what lets Food hold two separate businesses without
the site pretending they are one.

| URL | |
|---|---|
| `/` | Home |
| `/about/` | How the group is structured and governed |
| `/sectors/` | Every sector |
| `/sectors/<slug>/` | One sector, and the companies in it |
| `/companies/` | Every company, filterable by sector |
| `/companies/<slug>/` | One company |
| `/careers/` | Working here, and open roles |
| `/contact/` | Office, channels, enquiry form |
| `/404.html` | Not found |

Adding a company to an existing sector means adding one object to that sector's
`companies` array. The mega-menu, the filter chips and their counts, the home
rail, the sector page, the sibling cross-links and the sitemap all resize
themselves. Nothing else needs touching.

## Where things live

```
data/site.js          ALL content — sectors, companies, copy, nav, roles
build/render.js       templates + generator
assets/css/site.css   one stylesheet; design tokens at the top
assets/js/site.js     language, mega-menu, sector rail, filter, form
site-assets/logo/     the real logo kit (SVG) + favicons
site-assets/img/      web-sized photography
dist/                 generated — never edit, never commit
```

## Editing content

Everything is in [data/site.js](data/site.js). A sector looks like this:

```js
{
  slug: 'food',                 // -> /sectors/food/
  photo: 'trading',             // expects trading-hero.jpg + trading-card.jpg
  name: 'Food', nameAr: 'الأغذية',
  short, intro, body[],         // each with an -Ar counterpart
  companies: [ … ]              // one or more
}
```

and a company inside it:

```js
{
  slug: 'lusail-foods',         // -> /companies/lusail-foods/
  name: 'Lusail Foods',         // <-- REPLACE
  role: 'Packing and distribution',   // what it is, vs its sector siblings
  photo: 'foods',               // optional; falls back to the sector's photo
  short, intro, body[], caps[], figs[]
}
```

Every text field has an `-Ar` counterpart (`nameAr`, `shortAr`, `bodyAr`).
Both languages must be present or the toggle will blank that node.

Adding a new photo means two files: `<photo>-hero.jpg` at 2000×857 and
`<photo>-card.jpg` at 900×675, in `site-assets/img/`.

### Placeholders that must be replaced

- **Every company name is invented.** They are marked `provisional: true`.
  The sectors were read off the photography — grain, green coffee, rigs,
  cranes, container terminals, warehouses — because the folder contains no
  café or laundry imagery at all. Confirm the real list.
- `figs: []` is empty everywhere. Fill it with real figures
  (`{ v: '14', l: 'countries we source from' }`) or leave it empty and the
  block does not render.
- Phone number and office address are placeholders.
- `OPEN_ROLES` are examples. Set it to `[]` for the "no current openings" state.

Founding year and employee count appear nowhere, by request.

## Design

Green is **not** the site colour. It appears in the logo and in exactly one
deep band — the footer. Every other dark surface is charcoal `#16181A`, the
identity is carried by gold `#BC9640` on cool neutrals, and the photography
supplies the rest. Tokens are at the top of `assets/css/site.css`.

Type is Marcellus for display (Roman inscriptional capitals — the Latin
counterpart to the Kufic mark) with IBM Plex Sans for body, and Noto Kufi
Arabic / IBM Plex Sans Arabic for Arabic, so both scripts are typographic
siblings rather than two different websites.

### Interactive parts

- **Mega-menu** — hovering "What we do" opens every sector and every company
  inside it. Keyboard accessible, closes on Escape, never opens on touch.
- **Home sector rail** — moving across it changes the photograph, the heading,
  the companies named inside that sector, and the link.
- **Company filter** — `/companies/` slices the full list by sector without a
  reload, keeps a live count, and writes `?sector=` so a filtered view can be
  linked to.
- **Scroll reveal** — groups fade up as they arrive. Applied only while JS is
  running and never under `prefers-reduced-motion`, so content is always
  readable.

## Bilingual

English and Arabic with full RTL. Each translatable element holds English as
its content and Arabic in `data-ar`; the toggle swaps them, sets `lang`/`dir`,
and remembers the choice. An inline script in `<head>` applies the saved
language before first paint. `?lang=ar` deep-links into Arabic.

## Contact form

Validates in the browser and, by default, **sends nothing**. To make it live,
set `CONTACT_ENDPOINT` in [assets/js/site.js](assets/js/site.js) to a URL that
accepts a JSON `POST`. Payload is `{name, email, company, topic, message, lang}`
— `company` is the slug the visitor picked, so enquiries can be routed. On
failure it tells the visitor to email `info@lusailcorp.qa` instead.

## Deploying

`vercel.json` is committed, so Vercel needs no manual configuration — it runs
`npm run build` and serves `dist/`. Any other static host works the same way:
build, then upload `dist/`.

Before going live, point `SITE.domain` in `data/site.js` at the real domain;
it feeds the canonical URL, OpenGraph tags and the sitemap.
