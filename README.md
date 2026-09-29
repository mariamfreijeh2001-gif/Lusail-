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
| `/sectors/` | The four sectors, each with the businesses inside it |
| `/sectors/<slug>/` | One sector |
| `/companies/<slug>/` | One company |
| `/about/` | The Group: what it is, what it believes, who it wants to hear from |
| `/contact/` | Channels and the enquiry form |
| `/404.html` | Not found |

There is **no portfolio index and no careers page**. Every company is reached
from the sectors menu, the sectors index or its own sector's page, which is
one move from anywhere on the site. Applications and partnership enquiries go
through the contact form, which routes on the "area of interest" field. The
old `/companies/`, `/careers/` and `/partnerships/` URLs redirect.

Adding a company to a sector means adding one object to that sector's
`companies` array. The sectors menu, the sectors index, the sector page, the
home page's sector cards, the footer, the contact dropdown (and the email
routing behind it) and the sitemap all follow.

## Where things live

```
data/site.js          ALL content — sectors, companies, values, reach, contact
build/render.js       templates + generator
build/worldmap.js     decodes the land data and projects the home-page map
api/contact.js        Vercel function: validates the form, emails it via Resend
assets/css/site.css   one stylesheet; design tokens at the top
assets/js/site.js     nav, sector menu, map pins, panels, form, reveals
site-assets/logo/     the logo kit (SVG) + favicons
site-assets/img/      web-sized photography
site-assets/geo/      Natural Earth 110m land, TopoJSON (public domain)
dist/                 generated — never edit, never commit
```

## Editing content

Everything is in [data/site.js](data/site.js) — including `FIGURES`, the four
numbers on the home page's stat band. **Three of those four are unverified**:
they came from the design file, not from the Group. See [TODO.md](TODO.md).

A sector:

```js
{
  slug: 'trading',
  name: 'Trading & Commodities',
  short, headline, intro,              // the sector's line, used in listings
  companies: [ … ]                     // one or more
}
```

A company:

```js
{
  slug: 'lusail-commercial',
  name, role, headline, short, intro,
  body: [ … ],                         // the paragraphs beside the photograph
  facts: [{ k, v }, … ],               // the strip under them
  products: [{ t, d, img }, … ],       // optional; becomes the rail
  activities: [ … ],                   // optional; becomes the tags
  alsoIn: ['supply-distribution'],     // optional second sector
  cta: 'Partner with Lusail Commercial',
  hero: 'hero-lusail-commercial',      // wide, behind the title
  still: 'still-lusail-commercial'     // upright, beside the reading
}
```

### Photography

Images are named for where they appear, not for what they show, and all of
them live in `site-assets/img/` as `.jpg`:

| Name | Used by | Shape |
|---|---|---|
| `hero-<page>`, `hero-sector-<slug>` | the photograph behind a page title | wide |
| `still-<company>` | the upright shot beside a company's opening | ~900px |
| `prod-<product>` | one product card in the rail | 640px, 4:3 |
| `card-<sector>` | the home page's sector cards | 640px, tall |
| `hero-doha`, `why-group`, `cta-towers`, `about-platform` | the home and about pages | — |

**The build fails if a page asks for an image that is not there**, rather than
shipping a broken page — see `checkImages()` in
[build/render.js](build/render.js). Add the file, then add the name.

There is no image tooling on a typical machine here, so the JPEGs were
converted from the design file's PNGs through headless Chrome's canvas
encoder. 8.6 MB of PNG became 690 KB of JPEG.

### Before launch

- **Three of the four home-page figures are unverified** — `5+` years, `10+`
  markets and `50k+` customers came from the design, not from the Group.
  Confirm or remove them in `FIGURES`.
- `info@lusailcorp.com` is the one published address, and has no mailbox
  behind it yet.
- LinkedIn and Instagram in `SITE.contact` are `#`, and stay hidden until they
  are real URLs. Set them and they appear in the footer.
- The phone number is a placeholder.
- `OPEN_ROLES` is `[]`, which renders the "No Current Opening?" state the
  brief specifies. Add roles to that array when there are any.
- `SITE.domain` feeds the canonical URL, OpenGraph tags and the sitemap.

See [TODO.md](TODO.md) for the full list.

## Design

Built to the Figma. Near-monochrome and typographic: sections alternate white
and a warm off-white, and carbon `#181717` carries the hero, the sourcing map,
the closing card and the footer. A heading states itself and greys out one
word — "What makes it a *group*" — which is the system's only ornament.
Tokens are at the top of `assets/css/site.css`; changing the brand is changing
those.

| | |
|---|---|
| `--ink` | `#181717` carbon — headings and every dark ground |
| `--ink-2` | `#868585` body copy |
| `--ink-3` | `#c0bfbd` the greyed word inside a heading |
| `--paper` / `--panel` | `#f6f5f3` / `#efedeb` alternating grounds |
| `--line` | `#e3e0dd` card outlines |
| `--pin` | `#fb8449` the sourcing pins, and the one accent |

The frame is 1440 with 115px gutters, leaving the 1210px measure every section
is set to. `--wrap` is the frame, padding included.

Type is **Archivo** for display and body, **Inter** for navigation and buttons,
**Space Grotesk** for the small stat labels, and **Playfair Display** italic for
the one accent word in the hero.

The logo appears in the header and footer (the reversed lockup, on carbon),
the favicon, beside the home introduction, and as a faint watermark on the
closing card. Nothing in the layout is derived from its shape. `SITE.brand`
holds the filenames, so swapping the logo is one edit.

### Interactive parts

- **The bar** — the mark, four links and one action. *Sectors* opens a panel
  listing all four rather than a page; it opens on hover with a pointer, on
  click without one, and closes on Escape or a click outside. Below 1080px it
  collapses to a full-screen menu. Over the home photograph the bar starts
  transparent and fills as the page moves.
- **The figures** — written into the HTML, so they are right before the script
  runs and right if it never does; they count up once when scrolled into view.
- **What makes it a group** — four claims as a bento. The photograph states
  the first outright; the other three name themselves and open their reasoning
  on hover, on focus or on a tap.
- **Building more than a portfolio** — a row of four panels with one open,
  widening to carry its paragraph. Click, hover or use the arrow keys.
- **Where we source from** — a dotted world map generated at build time from
  Natural Earth data (no map library ships to the browser). Each region has a
  pin whose label opens to its countries, and lighting a pin lights its row in
  the register below. Pin labels are laid out at build time so they clear one
  another.
- **Company filter** — `/companies/` slices the portfolio by sector without a
  reload, keeps a live count, and writes `?sector=` so a view can be linked to.
- **Arrival** — each band lifts in once. Hiding is scoped to a `.js` class the
  script adds, so nothing is ever invisible if the script does not run, and a
  band already scrolled past is simply there.

Under `prefers-reduced-motion` nothing animates.

## Language

The site is **English only**. It carried Arabic until the copy was rewritten,
at which point every translation described text that no longer existed — and
a stale translation is worse than none, because it would silently mistranslate
the new copy if it were switched back on. The old strings are in git history
at `7f548c4`; they describe the old wording, not this one.

Putting Arabic back therefore means translating the current text and rendering
it, not reviving those fields. Nothing in the templates assumes one language:
there is no `data-ar`, no toggle, no RTL rule and no pre-paint script left.

## Contact form

The contact page carries the form. It validates in
the browser, then `POST`s the whole form as JSON to `CONTACT_ENDPOINT` —
[api/contact.js](api/contact.js), a Vercel serverless function that relays
through Resend. The payload carries `area`, the dropdown value, so an enquiry
can be routed to the right company; the function turns that code into the
company's name and puts it in the subject line.

Each company page's button links to `/contact/?company=<slug>`, which opens the
form with that company already selected.

The function needs `RESEND_API_KEY` set in the Vercel project. `CONTACT_TO`
and `CONTACT_FROM` are optional overrides.

If the key is missing, or the request fails for any reason, the form does
**not** claim success. It opens the visitor's mail client with the message
already filled in, addressed to `info@lusailcorp.com`, so an enquiry is never
silently lost.

## Deploying

`vercel.json` is committed, so Vercel needs no manual configuration — it runs
`npm run build`, serves `dist/`, and applies the redirects for old and guessed
URLs. Any other static host works the same way: build, then upload `dist/`
(the form then needs its own endpoint, or falls back to email).
