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
marquee, the sector page, the sibling cross-links and the sitemap all resize
themselves. Nothing else needs touching.

## Where things live

```
data/site.js          ALL content — sectors, companies, values, roles, nav
build/render.js       templates + generator
assets/css/site.css   one stylesheet; design tokens at the top
assets/js/site.js     language, mega-menu, marquee control, filter, form
site-assets/logo/     the real logo kit (SVG) + favicons
site-assets/img/      web-sized photography
dist/                 generated — never edit, never commit
```

## Editing content

Everything is in [data/site.js](data/site.js). A sector looks like this:

```js
{
  slug: 'food',                        // -> /sectors/food/
  photo: 'food', photoStyle: 'still',  // 'plate' for real photography
  name: 'Food', nameAr: 'الأغذية',
  short, intro, body[],                // each with an -Ar counterpart
  companies: [ … ]                     // one or more
}
```

and a company inside it:

```js
{
  slug: 'lusail-foods',         // -> /companies/lusail-foods/
  name: 'Lusail Foods',         // <-- REPLACE
  role: 'Packing and distribution',   // what it is, vs its sector siblings
  photo: 'rice',                // optional; falls back to the sector's photo
  short, intro, body[], caps[], figs[]
}
```

Every text field has an `-Ar` counterpart (`nameAr`, `shortAr`, `bodyAr`).
Both languages must be present or the toggle will blank that node.

Adding a new photo means, in `site-assets/img/`:

- `<photo>-wide.jpg` at 2400×1029 (21:9) for a plate, **or**
  `<photo>-still.jpg` at 1100×1100 for a cutout product shot
- `<photo>-card.jpg` at 1000×750 (4:3) for the marquee card

### Placeholders that must be replaced

- **Every company name is invented.** They are marked `provisional: true`.
  The sectors were read off the photography — grain, green coffee, rigs,
  cranes, container terminals, warehouses — because the folder contains no
  café or laundry imagery at all. Confirm the real list.
- `VALUES` is written to sound like this group rather than generic virtues,
  but it is still written by me, not by you. Check every line.
- `figs: []` is empty everywhere. Fill it with real figures
  (`{ v: '14', l: 'countries we source from' }`) or leave it empty and the
  block does not render.
- Phone number and office address are placeholders.
- `OPEN_ROLES` are examples. Set it to `[]` for the "no current openings" state.

Founding year and employee count appear nowhere, by request.

## Design

Editorial and typographic: type and white space carry the page, on warm-neutral
paper. Green is **not** the site colour — it is in the logo and the footer, and
nowhere else. The identity is carried by gold `#BC9640` on paper, with a warm
sand band behind the values. Tokens are at the top of `assets/css/site.css`.

**Nothing is written over a photograph.** Strong images run as captioned
`plate` figures with the caption underneath; cutout product shots run as
contained `still` figures on their own white. Each sector and company declares
`photoStyle: 'plate' | 'still'` and the template picks the treatment.

Type is Marcellus for display (Roman inscriptional capitals — the Latin
counterpart to the Kufic mark) with IBM Plex Sans for body, and Noto Kufi
Arabic / IBM Plex Sans Arabic for Arabic, so both scripts are typographic
siblings rather than two different websites.

### Interactive parts

- **Mega-menu** — hovering "What we do" opens every sector and every company
  inside it. Keyboard accessible, closes on Escape, never opens on touch.
- **Sector marquee** — on home, the sectors are cards that move continuously.
  The track holds each sector twice and slides exactly −50%, so the loop is
  seamless; the second copy is `aria-hidden` and untabbable so a screen reader
  hears each sector once. It pauses on hover, on keyboard focus, and from a
  real Pause button — WCAG 2.2.2 wants a way to stop motion running longer
  than five seconds. Under `prefers-reduced-motion` it does not animate at
  all: the clones are dropped, the track becomes a wrapping grid, and the
  button is hidden.
- **Company filter** — `/companies/` slices the full list by sector without a
  reload, keeps a live count, and writes `?sector=` so a filtered view can be
  linked to.
- **Hero and About** — the hero pairs type with a photograph beside it; the
  Kufic mark sits beside the About copy and drifts slowly, disabled under
  `prefers-reduced-motion`.

## Bilingual

English and Arabic with full RTL. Each translatable element holds English as
its content and Arabic in `data-ar`; the toggle swaps them, sets `lang`/`dir`,
and remembers the choice. An inline script in `<head>` applies the saved
language before first paint, and `?lang=ar` deep-links into Arabic.

**A translatable element must never contain another.** The toggle rewrites
`textContent`, so a nested `data-ar` child is destroyed on the first switch.
Split the line into sibling spans instead — see the values heading, where
"The values that" and the highlighted "guide us" are two separate spans.

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
