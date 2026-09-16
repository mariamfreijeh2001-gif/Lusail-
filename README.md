# Lusail Corp — website

Static marketing site for Lusail Corp, a Qatari holding company. No framework, no build
step: three files (HTML, one stylesheet, one script) that can be served by anything.

## Run it locally

```bash
npm start          # serves on http://localhost:5173
```

Or open `index.html` directly — nothing on the page requires a server.

## Structure

```
index.html            page markup, SEO meta, JSON-LD, inline SVG logo symbols
assets/css/styles.css all styling (design tokens at the top of the file)
assets/js/main.js     sector data, bilingual switching, interactions, contact form
assets/img/favicon.svg
robots.txt, sitemap.xml
```

## Editing content

Almost all sector content lives in one place: the `SECTORS` array in
`assets/js/main.js`. Each entry carries both languages and renders into three places
at once — the hero caption, the companies index, and the footer column:

```js
{ id:'food',
  en:{ s:'Food industry', c:'Lusail Foods', t:'…', l:['…'], f:'300+', fl:'…' },
  ar:{ s:'الصناعات الغذائية', c:'لوسيل للأغذية', t:'…', l:['…'], f:'+300', fl:'…' } }
```

`s` sector name · `c` company name · `t` description · `l` capability list ·
`f` headline figure · `fl` figure label.

Its icon comes from `ICONS[id]` in the same file — a 36×36 stroked SVG path. Adding a
seventh sector means adding an entry to both objects; the hero diagram, sector strip,
index and footer all pick it up, though the diagram's folded-line geometry is drawn for
six bars and would need `buildBars()` adjusted.

Static copy (headings, about, news, contact) is edited in `index.html`. Every
translatable element carries the English text as its content and the Arabic in a
`data-ar` attribute — both must be present or the language toggle will blank it.

## Bilingual behaviour

English and Arabic, with full RTL. The toggle sets `<html lang dir>`, swaps fonts
(Marcellus/Instrument Sans → Noto Kufi/IBM Plex Sans Arabic), re-renders the data-driven
sections, and remembers the choice in `localStorage`. An inline script in `<head>`
applies the saved language before first paint so the page never flashes the wrong
script. `?lang=ar` deep-links into Arabic.

## Contact form

The form validates in the browser and, by default, **sends nothing** — it confirms and
resets. To make it live, set `CONTACT_ENDPOINT` in `assets/js/main.js` to a URL that
accepts a JSON `POST` (a form backend, an API route, a serverless function). The payload
is `{name, email, topic, message, lang}`. On a non-2xx response the form tells the
visitor to email `info@lusailcorp.qa` instead.

## Before going live

- [ ] Point the canonical URL, `og:url`, `hreflang`, sitemap and JSON-LD at the real
      domain (they currently read `lusailcorp.qa`)
- [ ] Set `CONTACT_ENDPOINT`
- [ ] Replace the placeholder phone number and office address
- [ ] Add a real `og:image` (1200×630) and reference it in `<head>`
- [ ] Replace the sample news items, or wire the section to a real source
- [ ] Give `Privacy policy` / `Terms` and the social links real destinations

## Deploying

Upload the folder as-is. Any static host works — Netlify, Vercel, Cloudflare Pages,
GitHub Pages, or plain nginx with `index.html` as the root document.
