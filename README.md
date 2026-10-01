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
| `/about/` | The Group: what it is and what it believes |
| `/partnerships/` | Work With Us — who the Group wants to hear from |
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
  hero,                                // behind its own page title
  shot,                                // optional; beside it on /sectors/
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
shipping a broken page. `usedImages()` in [build/render.js](build/render.js)
reads the names out of the HTML it has just written, so the check is against
what the browser will actually request — there is no list to keep in step,
and only the images a page really uses are copied. It also refuses two names
holding byte-identical pictures.

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
| `--ink-2` | `#6c6b6b` body copy |
| `--ink-3` | `#8f8e8c` the greyed word inside a heading |
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
- **The sectors index** — a numbered index of the four sectors stands beside
  the reading and stays there as the page moves, marking whichever sector is
  on screen. Each entry jumps to its sector; each sector hands on to its own
  page and to the businesses inside it. Below 900px the index lies on its
  side as a strip under the bar and scrolls the marked sector into view.
  Without script it is a plain list of jump links, which still works.
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

## Search

Every page carries JSON-LD built from the same data it renders, so the markup
cannot drift from the words: an `Organization` for the Group with each company
as a `subOrganization`, an `Organization` per company with its services as an
`OfferCatalog`, and a `BreadcrumbList` on everything below the top level.

**The placeholders are deliberately withheld.** `telephone` and `sameAs` only
appear once `SITE.contact` holds a real number and real profile URLs — a made-up
phone number in structured data is worse than none. Cavallo and Nero are plain
`Organization`, not `DryCleaningOrLaundry`/`CafeOrCoffeeShop`: those want a
street address and opening hours, and claiming to be a local business without
them earns nothing.

The dotted world map is written once to `/assets/img/worldmap.svg` rather than
inlined. It is 65 KB of path data — inline it and it was 70% of the home page's
HTML, re-downloaded every visit. As a file it is cached, and the pins over it
are ordinary buttons either way. The home page is 27 KB.

`404.html` carries `noindex` and no canonical, so a soft 404 cannot be indexed.

## Accessibility

Measured rather than assumed. Every text colour clears WCAG AA against every
ground it actually sits on — the palest each grey can be and still pass:

| | drawn | shipped | ratio |
|---|---|---|---|
| `--ink-2` body copy | `#868585` | `#6c6b6b` | 4.55 on panel, 5.31 on white |
| `--ink-3` the greyed word in a heading | `#c0bfbd` | `#8f8e8c` | 3.27 |
| `--num` the oversized numerals | `#c2bebe` | `#8c8888` | 3.00 |
| `--label` stat labels | `#939393` | `#6b6b6b` | 5.33 |

The design drew all four paler; as drawn, body copy failed AA everywhere it
appeared (3.15 to 1 on a panel) and the greyed word sat at 1.69 to 1.

Anything that reveals content on focus answers plain `:focus`, not only
`:focus-visible` — the company panels, the map pins and the bento claims.
`:focus-visible` is right for drawing a focus ring, because it keeps the ring
off mouse clicks, but content that only appears for "keyboard-like" focus is
content some people never see. Every interactive target is at least 24px.

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
