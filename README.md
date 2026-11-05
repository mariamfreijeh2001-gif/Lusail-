# Lusail Corp — website

A multi-page static site, generated from one content file. No framework, no
dependencies: `node build/render.js` reads `data/site.js` and writes finished
HTML into `dist/`.

```bash
npm start      # build, then serve on http://localhost:5173
npm run build  # build only, into dist/
npm run images # remake the resized photographs (only after adding or changing one)
npm run import -- "path/to/photo.png" hero-tibeco-group   # bring in any photo, web-sized
```

## Structure

The site lists **what the Group provides**, not which company provides it.
Two tiers: a **service area** holds any number of **services**. An area has
a page of its own; every service in it is written up in full as a section
on that page, with its own anchor. The Group runs seven areas and
twenty-four services today — sulphur, coffee, sugar,
edible oils and wheat; fresh produce, rice and dry foods; ocean, land and air
freight and chartering; energy and industrial materials, equipment, project
supply and food security; enterprise IT and advanced systems; investment and
partnerships; laundry and a café.

The **companies** that deliver the services are named in **one place only**:
the scrolling strip at the foot of the home page (`/#companies`). No service
links to a company and no menu names one. An enquiry about a service is
routed to the company behind it by the contact function, which the visitor
never has to know.

| URL | |
|---|---|
| `/` | Home: the services ledger, the areas, the globe, the one strip of companies |
| `/services/` | Every area, each with the services inside it as cards |
| `/services/<area>/` | One area: its story, then every service in it in full — the story, what is supplied, where from, how it works, its questions, the ask |
| `/services/<area>/#<slug>` | One service — a section on its area's page, which is what every link to it points at |
| `/about/` | The Group: what it is and what it believes |
| `/partnerships/` | Work With Us — who the Group wants to hear from, and the two ways in |
| `/supplier-portal/` | The Supplier Portal: what the Group buys, the next events, how it works, requirements |
| `/supplier-portal/opportunities/` | Every open sourcing event, filterable; each one's action leads to the registration |
| `/supplier-portal/register/` | The registration — progress rail, documents, a draft that stays in the browser |
| `/quote/` | Request a quotation: the service, the quantity or scope, destination, timing and specification, routed to the desk of the service's area |
| `/contact/` | Channels and the enquiry form |
| `/404.html` | Not found |

There is **no company page, no careers page, and no page per service** —
a service is a section on its area's page with an anchor, which is what the
menus, the home page's ledger and the index cards all point at (and the
old per-sector URLs, by redirect). TIBECO — the
one company with a website of its own — is linked there from the companies
strip, in a new tab. Suppliers register once on the Supplier Portal; every
other enquiry goes through the contact form, which routes on the "area of
interest" field: the visitor picks a service area, and `desk` on that area
names the company whose mailbox it reaches. The old `/sectors/`,
`/companies/`, `/portfolio/` and `/careers/` URLs redirect, and so do
guessed ones like `/vendors/`, `/tenders/` and `/procurement/`.

A buyer's path is: find the service (the bar's panel, the home ledger, the
services index, or a search engine landing on the section), read it in
full, then **Request a quotation** — the form at `/quote/` arrives with the
service chosen and asks for what an offer needs. Each area page also says
**how buying works** in four steps (`buying` in data/site.js) and ends in
the other areas; the footer lists every area on every page.

Adding a service to an area means adding one object to that area's
`services` array (and a line to `build/imageroles.js` for its photograph).
The services menu, the services index, the area page, the home page's
ledger, the sitemap and the structured data all follow.

### Search

Each area page is built to be the page a search engine lands a buyer on: a
title that names the area and every service in it (*Commodity Trading —
Sulphur, Coffee, Sugar, Edible Oils, Wheat & Grains | Lusail Corp, Qatar*),
a description to match, a `Service` in JSON-LD for the area whose offer
catalogue holds every service as a `Service` of its own — with its lines,
its activities as keywords and its section's anchor as its address — one
`FAQPage` from every service's questions, a `BreadcrumbList`, an `h2` per
service with its anchor, descriptive `alt` text, and internal links to the
other areas and the sourcing register. The home page carries the areas as
the `Organization`'s offer catalogue, and `/services/` an `ItemList`.

## Where things live

```
data/site.js             ALL content — sectors, companies, values, reach, contact,
                         what the Group buys (SUPPLY), open events (OPPORTUNITIES),
                         every form (FORMS)
build/render.js          templates + generator
build/variants.js        resizes the photographs; run by hand, results committed
build/import.js          brings any photo in at web size (npm run import)
build/imageroles.js      what each photograph is used for, which sets its sizes
build/worldmap.js        decodes the land data into points for the home-page globe
api/contact.js           Vercel function: validates the form, emails it via Resend
assets/css/site.css      one stylesheet; design tokens at the top
assets/js/site.js        nav, sector menu, map pins, panels, form, reveals
site-assets/logo/        the logo kit (SVG) + favicons
site-assets/font/        the three typefaces, self-hosted (SIL OFL; see NOTICE.md)
site-assets/img/         web-sized photography — the originals
site-assets/img/derived/ generated by build/variants.js; committed, not edited
site-assets/geo/         Natural Earth 110m land, TopoJSON (public domain)
dist/                    generated — never edit, never commit
_source/                 raw photography, the full logo kit, retired photos;
                         on disk for reference only, ignored by git
```

## Editing content

Everything is in [data/site.js](data/site.js) — including `FIGURES`, the four
numbers on the home page's stat band. Each is counted from the content
(services, areas, sourcing regions, source countries), so none can drift.

A service area:

```js
{
  slug: 'commodities',
  name: 'Commodity Trading',
  short, headline, intro, body,        // the area's line and its argument
  hero,                                // behind every page title in the area
  accent, accentText, tint, accentOn,  // the colour its pages carry
  icon,                                // its mark in the menu
  desk: 'lusail-commercial',           // which company's mailbox an enquiry reaches
  services: [ … ]                      // one or more
}
```

A service:

```js
{
  slug: 'sulphur',
  name, role, headline, short, intro,
  body: [ … ],                         // the paragraphs beside the photograph
  img: 'prod-industrial-commodities',  // beside the story, and its card
  facts: [{ k, v }, … ],               // the strip under the opening
  lines: [{ t, d }, … ],               // what is supplied, line by line
  origins: [ … ],                      // countries, each on REACH
  steps: [{ t, d }, … ],               // optional; how the work moves
  activities: [ … ],                   // the tags, and the search keywords
  supply: 'energy-materials',          // optional; the portal category, which adds "Supply this"
  cta: 'Enquire about sulphur'
}
```

The questions under a service are in `SERVICE_FAQ`, keyed by slug. The
companies are `COMPANIES`: name, role, one line, and a `site` for the one
with a website.

### Photography

Images are named for where they appear, not for what they show, and all of
them live in `site-assets/img/` as `.jpg`:

| Name | Used by | Shape |
|---|---|---|
| `hero-<page>`, `hero-sector-<slug>` | the photograph behind a page title; an area's hero stands behind every service in it | wide |
| `still-<name>`, `prod-<name>`, `panel-<name>`, `coffee-still` | a service's photograph: beside its story, and its card on the index | 640–2560px |
| `hero-doha`, `hero-sectors`, `why-group`, `about-platform` | the home, sectors and about pages | — |

Banners are imported at up to 2560px from the largest original
(`npm run import -- --max=2560 "photo" name`), and served in five widths.

**The build fails if a page asks for an image that is not there**, rather than
shipping a broken page. `usedImages()` in [build/render.js](build/render.js)
reads the names out of the HTML it has just written, so the check is against
what the browser will actually request — there is no list to keep in step,
and only the images a page really uses are copied. It also refuses two names
holding byte-identical pictures. The logo kit is copied the same way, which
is why five of its twenty-one files reach the server rather than all of them.

#### Sizes

Each photograph ships in several widths and every `<img>` carries a `srcset`,
because one file cannot serve a full-screen banner and a 116px thumbnail.

[build/imageroles.js](build/imageroles.js) says what each photograph is used
for. A role carries the widths that use needs, measured off a browser at 1440
and at 390 and doubled for a 2× screen, and the `sizes` attribute that tells
the browser which box it is headed for before the stylesheet has arrived. A
photograph in two roles takes the union: a company hero has three.

Where the stylesheet pins a box to one shape and fills it with
`object-fit:cover`, the derivative is cropped to that shape, so the browser
is not handed pixels it will throw away. A photograph whose roles disagree
about the shape is left whole — it cannot be cut for one page without being
wrong on another — and `pic()` notices the difference by comparing the files
rather than being told, so a cropped variant never ends up in the same
`srcset` as an uncropped original.

`width` and `height` are read from the files themselves. They had been typed
into the templates and had drifted: every page hero declared 1600×1066 while
carrying anything from 673×1200 to 1600×1066.

#### Making them

There is no image tooling on a typical machine here and none on the build
host, so headless Chrome does the resampling and the JPEG encoding, and the
results are committed. `npm run images` makes only what is missing, so it
costs one Chrome run after adding a photograph and nothing afterwards. Adding
a photograph means a line in `build/imageroles.js` and that one command; a
page asking for a size nobody made fails the build and says so.

### Before launch

- **Product origins are indicative** — the "Sourced from" countries under each
  product need confirming by the Group (`origins` in `data/site.js`).
- `info@lusailcorp.com` is the one published address, and has no mailbox
  behind it yet.
- LinkedIn and Instagram in `SITE.contact` are `#`, and stay hidden until they
  are real URLs. Set them and they appear in the footer.
- The phone number is a placeholder.
- `RESEND_API_KEY` must be set in Vercel before the contact form can send.
- `SITE.domain` feeds the canonical URL, OpenGraph tags and the sitemap.

See [TODO.md](TODO.md) for the full list.

## Design

Built to the **Lusail Corp design system** (Claude Design): editorial and
architectural — navy type on a near-white ground, fine rules instead of boxes
and shadows, a light serif for the voice and a grotesque for the work, and the
logo's gold spent in small amounts. Navy carries the hero overlays, the dark
bands (sourcing, the closing card, company asks and quotes) and the footer.
The tokens are at the top of `assets/css/site.css`; changing the brand is
changing those.

| | |
|---|---|
| `--ink` | `#0B1A3A` navy — headings and every dark ground (a lighter tint of the logo's `#030C2B`, which reads as black on screen) |
| `--ink-2` | `#474d63` secondary copy |
| `--ink-3` | `#7a7f90` the greyed word inside a heading (24px and up only) |
| `--paper` / `--panel` | `#f8f7f6` / `#eceae8` alternating grounds |
| `--line` / `--line-2` | `#dedcd9` / `#c9c6c2` hairlines |
| `--gold` | `#D3A750` the logo gold: rules, dashes, markers, buttons on navy |
| `--gold-text` | `#7d5a1d` gold when it has to be read on a light ground |

Type is **Newsreader** (a light serif) for page titles, section headings, card
titles and the large numerals, and **Archivo** for everything else, labels and
buttons included. Both are served from this origin, from `site-assets/font/`,
under the SIL Open Font License (see its `NOTICE.md`). Every size is one of the
`--t-*` tokens; headings grow with the viewport and running text does not.

Components use **rules, not boxes**: a hairline above each item and a gold rule
that draws across it on hover. Eyebrows above headings are uppercase, tracked
and led by a gold dash. **Every section fits one screen** at 1440×900.

### The pages

- **Every page opens full-screen** with its photograph, the bar transparent
  over it until the page scrolls.
- **Home** — the statement with a rail of the seven areas across the foot
  of the photograph, the Group's four figures (counted from the content),
  **What we provide** — seven area tiles, the first and last wide, each
  with the area's photograph, its line and every service in it as a ruled
  row linking to its section — "What makes it a group", the sourcing
  **globe**, how the Group works, and the one **strip of companies**,
  scrolling across the foot of the page (paused under the pointer;
  standing still under reduced motion).
- **The globe** — land points sampled from Natural Earth at build time
  (`build/worldmap.js` → `/assets/img/globe.json`), drawn and turned in a
  canvas, with a gold arc from every source country to Doha. Pointing at a
  region in the list beside it lights its arcs; drag turns it. It only draws
  while on screen and holds still under reduced motion.
- **Area pages** are landing pages of their own: the area's photograph
  behind the title, its facts strip, its statement with a jump list of its
  services beside the argument, its figures, then **one section per
  service** — the photograph beside the story, the facts, what is supplied
  line by line, how it works where that helps, the questions, and the ask
  (an enquiry pre-addressed to the area with the service named, and "Supply
  this to the Group" where a portal category matches) — then where the area
  sources from, grouped by the Group's regions, and the other areas. The
  structure is shared; the colour is the area's own.
- **The services index** — a numbered rail of the areas at the left that
  marks the one being read, and each area as a block with its argument and
  its services as cards.
- **Work With Us** — who the Group wants to hear from, how it works (a
  timeline), the two ways in (the Supplier Portal, or the contact form), and
  what it is looking to do next (a grid ending in the ask).
- **The Supplier Portal** (`/supplier-portal/`) — TIBECO's portal, carried
  over whole for the Group in the Group's design: the same three routes
  (portal, opportunities, register), the same portal-local strip under the
  bar (Opportunities · How it works · Requirements · Register), and the same
  opening rule — an event's one action is the register page carrying
  `?ref=`, so there is no page per event. The main page explains before it
  asks:
  the port photograph with "Supply the Group. Register once.", two buttons
  and a "Next to close" line naming the nearest event; **open
  opportunities** (one line per event on a wide screen — reference, type,
  title, buyer, closing date with a live "in 9 days", status as a gold or
  grey word, and a "Register to bid" / "Request invite" / "Register to
  respond" action by type — three lines a card on a phone; the full list,
  with the category filter, lives on /supplier-portal/opportunities/ and a
  category card's "n open" arrives there already filtered by `?cat=`);
  **what we buy**
  (eight categories as a grid of ruled cards for the three buying companies —
  TIBECO Group, Lusail Commercial and ROMA Commercial; the café and the
  laundry are not on the portal — closed, each shows its number, name,
  three sample lines, who buys and "2 open", which filters the list; open,
  every line and the buyers as links — one open at a time); how it works in
  four short steps; **the registration form, folded** behind a "Register as
  a supplier" row with an "Open the form" button, which the opening's
  button, a service section's "Supply … to the Group" button and any link to `#register`
  unfold — the documents to have ready sit in the form's side column; the
  **terms in brief** (currency, payment, offer validity, registration
  validity, and the line that every event is an invitation to treat under
  Qatar law); then one linked line for the Code of Conduct, the fraud
  warning and supplier support as three ruled columns. Three design reviews
  and a procurement review shaped it; the third removed a "closing soon"
  strip that repeated the list and a status legend the button labels made
  redundant.
  The **Supplier Code of Conduct** has its own page at `/supplier-portal/code/`,
  ten points. Each event has its own page: the requirement as a table, the
  clarifications published so far, what else is open, and a quotation form
  carrying the reference. A closed event keeps its page and says it has
  closed; an invite-only one takes an invitation request instead of a
  quotation. What a static site cannot do — a login, a sealed bid, a
  dashboard — is left out rather than imitated, and the page promises
  nothing the mail relay cannot keep: no receipts, no verification, no
  expiry tracking, no "nobody else sees it".

### Interactive parts

- **The bar** — *Services* is a link and a caret: the caret opens a panel of
  the areas with every service under each (also on hover; Escape or a click
  outside closes it). The bar's button is *Request a quotation*; Contact is
  a plain link. Below 1080px the bar becomes a full-screen menu with the
  areas folded into a group that opens on a tap.
- **The figures** are written into the HTML and count up once in view.
- **Arrival** — each band lifts in once as it scrolls into view. Hiding is
  scoped to a `.js` class the script adds, so nothing is ever invisible if the
  script does not run.

Under `prefers-reduced-motion` nothing animates.

**The stylesheet has one rule about order:** the phone block at the end of
`site.css` must stay last. Rules added later for wide screens once overrode the
phone layout and the footer columns ran into each other. Anything appended
after it needs its own media query.

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

The globe's land is written once to `/assets/img/globe.json` (about 43 KB)
rather than inlined, so it is cached and fetched only when the globe scrolls
into view; the page carries just the list of places.

`404.html` carries `noindex` and no canonical, so a soft 404 cannot be indexed.

## Accessibility

Measured rather than assumed. Every text colour clears WCAG AA against every
ground it actually sits on — the palest each grey can be and still pass:

| | colour | where it is used |
|---|---|---|
| `--ink` | `#0B1A3A` | headings and body on paper |
| `--ink-2` | `#474d63` | secondary copy on paper and white |
| `--ink-3` | `#7a7f90` | the greyed heading word, 24px and up only |
| `--gold-text` | `#7d5a1d` | gold that has to be read on a light ground (5.8:1) |

The brand gold `#D3A750` reads at about 2:1 on white, so it is never small
text on paper: it marks (rules, dashes, markers) and it is text only on navy.

**The hero text is checked against the photographs, not against a token.**
White on a picture is only as readable as the brightest thing behind it, and
the scrims were failing: the page-hero eyebrow measured **2.36:1** on the
ROMA photograph and the home page's statement **2.34:1**, where 4.5 is
wanted. The check hides the text, photographs each hero, finds the brightest
pixel under where the title sits and composites the text colour over it. Both
scrims are set from that: the worst of the thirteen now measures 4.7, and
most sit above 6.

Anything that reveals content on focus answers plain `:focus`, not only
`:focus-visible` — the sector accordion and the TIBECO showcase.
`:focus-visible` is right for drawing a focus ring, because it keeps the ring
off mouse clicks, but content that only appears for "keyboard-like" focus is
content some people never see. Every interactive target is at least 24px.

Form fields draw a focus ring too. They had `outline:none`, leaving the
darkened border to carry focus — which is also what an invalid field wears,
so "you are here" and "this is wrong" were the same mark, and 28 of the 59
tab stops on the contact page had no focus indicator at all.

A rejected form names the one field it is about and says so **beside that
field**, with `aria-invalid` and `aria-describedby`. It used to say "Fill in
your name, email and message" in a status line 479px below the field it had
just sent focus to.

## On a phone

Checked at 390 x 844 in a real mobile viewport over CDP: no page scrolls
sideways, and targets are at least 44px where a thumb uses them. On a phone
the menu folds Sectors and Companies into groups, the sector accordion becomes
photograph tiles, the figures and company facts are two-by-two, buttons run
the full width, and the footer is just the mark, the line about the Group and
how to reach it (sectors and companies are in the menu).

## Contact form

The contact page carries the form. It validates in
the browser, then `POST`s the whole form as JSON to `CONTACT_ENDPOINT` —
[api/contact.js](api/contact.js), a Vercel serverless function that relays
through Resend. The payload carries `area`, the dropdown value, so an enquiry
can be routed to the right company; the function turns that code into the
company's name and puts it in the subject line.

Each service section's button links to `/contact/?area=<area>&about=<service>`,
which opens the form with that area already selected and the service named
in the message; its second button, "Supply <service> to the Group", opens
the Supplier Portal registration with that category ticked.

The function needs `RESEND_API_KEY` set in the Vercel project. `CONTACT_TO`
and `CONTACT_FROM` are optional overrides.

If the key is missing, or the request fails for any reason, the form does
**not** claim success — it says the send failed, leaves everything typed
where it is so Send can be pressed again, and offers a link that opens the
same message, prefilled, in the visitor's own mail program. When the function
refuses a message for a reason the visitor can fix (a bad address, too many
links, a failed human check) the form repeats that reason instead.

### Spam

Five checks in the function, in this order, and one more once two keys are
set:

1. **Honeypot** — a field no person sees; anything in it is a bot, answered
   with a silent 200 so it learns nothing.
2. **Origin** — the browser's `Origin` header must be the site (or a Vercel
   preview, or localhost). A script posting straight at the function
   usually sends none. Silent 200.
3. **Timing** — the page sends how long it had been open; under 2.5 seconds
   is not a person. Silent 200.
4. **Rate** — five messages in ten minutes from one address, per instance.
5. **Links** — more than two links in any long field is refused with a
   reason.
6. **Cloudflare Turnstile** — a human check that shows nothing to most
   visitors. `TURNSTILE_SITE_KEY` at build puts the widget into every form;
   `TURNSTILE_SECRET_KEY` in the function verifies the token. Without the
   keys neither side does anything, so the site works before they exist.
   See [TODO.md](TODO.md) for the two-step setup.

### The supplier registration, the quotation form and the corner form

Two more forms post to the same function. The **registration**
(`/supplier-portal/register/`) collects what TIBECO's does: the company,
its country, registration and tax numbers, its type and year established,
the person who may quote (company email, mobile), the categories it can
supply, its main products with origins and capacity, certificates, any
interest a Lusail Corp employee holds in it, and three declarations ticked
one by one. Seven optional **documents** attach as files — PDF or image, up
to 2 MB a file and 3 MB in all, limits the page and the function each
enforce for themselves — and ride the email to procurement as attachments.
What is typed **saves as a draft in the browser** and clears when the
registration sends; a progress rail answers for each step the way TIBECO's
does. The old quotation form went with the event pages: an event's action is
registering for it, and quoting happens by email once qualified, shaped like a
real offer: currency, unit price, delivery basis (Incoterm), quantity,
origin, delivery point, payment terms offered, validity, deviations, one
declaration. It is the cover sheet; the signed offer and certificates follow
by email quoting the reference. **Every page but Contact** has a "Get in
touch" button in the corner that opens a short form.

All four forms — Contact (`enquiry`), the registration (`supplier`), the
quotation (`quote`) and the corner form (`callback`) — are defined once, in
`FORMS` in [data/site.js](data/site.js), and share one design: underlined
fields, numbered steps (`{ step: '…' }`), and a thank-you panel once sent.
The page draws its fields from there and `api/contact.js` checks what arrives
against the same definition, so:

- **a new field** is one line in `FORMS` — it appears on the page, is
  validated and is printed in the email;
- **a new supply category** or **company type** appears in the forms on its
  own (`SUPPLY` and `FORM_LISTS`);
- **a new form** is a new entry in `FORMS` plus `formBlock('<name>', '<prefix>')`
  wherever it should appear.

Field types beyond the usual: `checks` (a group of boxes with a tick-all),
`agree` (one box that must be ticked, named by `short` in the email) and
`hidden` (filled by the page at build time, such as the event reference).
The field called `message` is the body of the email; every other field,
long or short, is a row, so a registration's product list is never lost.

A link can preselect: `/supplier-portal/register/?cat=<slug>` ticks a supply
category (every service section's "Supply …" button links there), and
`/contact/?area=<slug>` picks the service area, which is routed to the right
company's desk by `api/contact.js` without the visitor seeing it. A page can also
hand a form a first draft (`data-prefill`), which is how an invite-only
event's "Request an invitation" arrives addressed to the right desk with the
reference in the message. The email subject says which form it came from —
"Supplier registration — <company>", "Quotation — <reference> — <company>",
"Callback request — <name>".

Documents are **not** uploaded. The portal lists what to have ready and
procurement asks for them by email at qualification: the form posts JSON and
the mail relay carries no attachments, and a 4.5 MB function limit would have
made uploads fail for exactly the certificates that matter.

### Sourcing events

`OPPORTUNITIES` in [data/site.js](data/site.js) holds every event: a
reference (`XX-XXX-YY-NNN`), the issuing company, its category, the type
(RFQ, Tender or RFI), a title and brief, the closing time in Doha time, the
requirement as rows, and optionally clarifications and a question deadline.
The build checks every reference, company and category and fails on a bad
one. It drops closed events from the list and the sitemap but still writes
their pages, marked `noindex`, so a link in an email lands somewhere that
explains itself. The script keeps the list honest between builds: it writes
"in 9 days", switches a badge to "Closing soon" inside 72 hours, retires a
row at the hour, and on a closed event's page replaces the form with a note.
Publishing an event is adding an entry and deploying. The five in the file
today are illustrative — carried over from the mock-up — and must be replaced
before launch (see [TODO.md](TODO.md)).

## Deploying

`vercel.json` is committed, so Vercel needs no manual configuration — it runs
`npm run build`, serves `dist/`, and applies the redirects for old and guessed
URLs. Any other static host works the same way: build, then upload `dist/`
(the form then needs its own endpoint, or falls back to email).

It also sets `Cache-Control`, which nothing did before: every repeat visit was
revalidating the stylesheet, the script and every photograph — eighteen
conditional requests on `/services/` alone. Fonts are immutable for a year, as
their names pin the family and the cut. Photographs and logos get a month with
a week of `stale-while-revalidate`; the stylesheet and script an hour with a
day. The stylesheet and script are requested as `site.css?v=<hash>` and
`site.js?v=<hash>`, a fingerprint of their contents, so a deploy never pairs
new pages with an old stylesheet. A replaced photograph keeps its name, so it
can take up to a month to reach a returning visitor.
