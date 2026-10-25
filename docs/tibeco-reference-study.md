# TIBECO Group as the design reference — the study

Management asked for the Lusail Corp site to be designed like TIBECO Group's
(<https://www.tibecogroup.com/>), and for TIBECO's **platforms** to become
Lusail's **sectors**. This note records what was studied, how the two sites
map onto each other, what was built, and what still needs the Group's eye.

## What was studied

The reference's own source, the `tibeco-9a2c97f1` repository on the Group's
GitHub (a React site built with Tailwind; the live site is deployed from it).
Every component, page and design token below was read from that source, not
inferred.

### TIBECO's site, as its source describes it

| | TIBECO Group |
|---|---|
| **Grounds** | Dark throughout: page `hsl(220 20% 10%)`, card `hsl(220 18% 14%)`, "mannai-dark" band `hsl(220 25% 8%)`, secondary `hsl(220 15% 20%)`, border `hsl(220 15% 22%)`. Type near-white; muted copy `hsl(215 20% 65%)`. |
| **Accent** | One amber gold, `hsl(38 90% 55%)`, for labels, rules, pins, the primary button. |
| **Type** | Playfair Display (400–700) for every heading; Raleway (300–700) for everything else. Labels uppercase, tracked `.2em`–`.3em`. |
| **Shapes** | `--radius: 0.25rem`; cards `rounded-lg` (8px) with a hairline border that turns `accent/40` on hover. No shadows on cards. |
| **Bar** | Fixed, transparent; `bg-mannai-dark/95` + blur + shadow after 50px of scroll. Left: "☰ Platforms". Centre: the logo (280×80; the monogram alone under 640px). Right: "Corporate ☰". |
| **Menus** | Two drawers over a dimmed page. Left (Platforms): the three platforms, each expanding to its five areas, with icon, uppercase name and Arabic. Right (Corporate): Home, Who We Are, Careers, Supplier Portal, Contact; a profile-PDF button; LinkedIn. |
| **Home** | Preloader (three bouncing dots, 1.8s) → full-screen hero: six photographs crossfading every 5s, `mannai-dark/60` veil, a faint 500px circle, centred "TIBECO GROUP" / "Commerce \| Investment \| Services" / "ELITE INTERNATIONAL BUSINESS GROUP" in gold, two joined buttons ("Learn More" \| "Our Platforms"), slide dots → **Corporate Statement** (image, two paragraphs, "DISCOVER TIBECO") beside **Why TIBECO GROUP** and an **Institutional Strength** box → **Core Business Platforms**: each platform a header row (icon, uppercase name, Arabic, hairline, one line) over a 4-column grid of 4:3 image tiles, the name revealed on hover → **Global Presence**: centred heading with Arabic above and a gold rule, a Mercator map with pulsing pins and dashed gold lines, a paragraph and two figures → Partners marquee → Certificates marquee. |
| **Platform page** | PlatformHero (full-screen centred, with a pill badge "TIBECO – Commerce Platform"; or left-aligned 80vh, split, compact 60vh) → sticky tabs (gold fill on the active one) → sections alternating card and page grounds: a 3-column "Strategic Positioning" (heading + rule + gold label, two paragraphs), icon-card grids, a numbered timeline, bullet lists, a two-card "Platform Integration", a centred **closing statement**, the **Supplier Portal band**. |
| **Who We Are** | 60vh photograph, "TIBECO GROUP" and the section tabs in the hero; Chairman's message, Who We Are, Vision, Market Positioning, Strategic Philosophy, Credentials — each a heading, Arabic, a 64px gold rule, and columns of small muted paragraphs; photographic dividers between. |
| **Footer** | One line: the logo at the left; © · Privacy Policy · Terms · Supplier Portal · Contact Us at the right. |
| **Corner** | A 40px square mail button opening a small contact card; a back-to-top button above it after 400px. |
| **Supplier Portal** | A portal strip under the bar (Supplier Portal · بوابة الموردين · Opportunities · How it works · Requirements · Register); the home with "Supply the Group. Bid in one place.", a "Closing soon" card, how it works as four numbered cards, categories, the opportunities table, requirements and principles, fraud notice and support. Already carried over to this site in an earlier pass. |
| **Arabic** | Every section heading carries an Arabic sub-label in the accent; platforms and areas carry Arabic names. |

## How TIBECO's structure maps onto Lusail Corp

| TIBECO Group | Lusail Corp | Where |
|---|---|---|
| "ELITE INTERNATIONAL BUSINESS GROUP" | "DIVERSIFIED QATARI BUSINESS GROUP" | `SITE.descriptor` |
| "Commerce \| Investment \| Services" | "Investment \| Trade \| Supply \| Services" | `SITE.fields` |
| **Three platforms** — Commerce, Investments, Services | **Seven sectors** | `SECTORS` |
| "☰ Platforms" drawer: platforms → areas | "☰ Sectors" drawer: the seven sectors, with icon, name and Arabic | `header()` |
| "Corporate ☰" drawer: Home, Who We Are, Careers, Supplier Portal, Contact, profile PDF, LinkedIn | "Corporate ☰" drawer: Home, About Us, Work With Us, Supplier Portal, Contact, the Contact button, LinkedIn when set | `CORPORATE` |
| Core Business Platforms: header row + 4-column image tiles per platform | Core Business Sectors: seven image tiles; Group Companies: five tiles | `sectorTiles()`, `companyTiles()` |
| A page per platform (× 5 areas = 15 pages) | A page per sector (7), each listing its business areas | `pageSector()` |
| Business areas on a platform page | Business areas on a sector page — each a product or service of a company in the sector, tagged with `in: [...]` | `areasOf()` |
| Corporate Statement / Why TIBECO / Institutional Strength | The same three blocks, from the Group's own copy | `pageHome()` |
| Global Presence map + 2 figures | The sourcing globe + the Group's 4 figures (counted from the content) | `reachGlobe()`, `FIGURES` |
| Certificates and Partners marquees | Left out — the Group has none to show yet | — |
| Preloader | Left out — an artificial 1.8s delay | — |
| Who We Are with tabs | About Us (the Group, vision and mission, values, value creation, how we work) | `pageAbout()` |
| Careers | Left out — no careers page by the Group's earlier decision | — |

Seven top-level sectors do not fit a bar, which is also why TIBECO puts its
platforms behind a drawer: the structure carries over unchanged. Three of the
seven sectors are worked only through TIBECO Group today; their pages say so
("through TIBECO Group") and link to tibecogroup.com.

## What was kept Lusail's

- **The gold** is the logo's `#D3A750`, not TIBECO's amber `hsl(38 90% 55%)`.
  On these grounds it reads at 9:1, so it is text as well as mark. One token.
- **The globe** stays in place of TIBECO's flat map: it already shows the
  Group's sourcing as gold arcs into Doha, in the same language.
- **The content** is the Group's own throughout; nothing of TIBECO's copy
  was carried over.

## The new site, page by page

```
/                          Home
/about/                    The Group
/sectors/                  The seven sectors, as tiles
/sectors/<slug>/           One sector — the platform page, re-cast
/companies/<slug>/         One company (TIBECO opens tibecogroup.com instead)
/partnerships/             Work With Us
/supplier-portal/          The Supplier Portal, /opportunities/, /register/, /code/
/contact/                  Channels and the enquiry form
```

## What to confirm with the Group

- **The Arabic sub-labels** under section headings and sector names were
  written for this redesign (`AR` in `build/render.js`, `ar` in
  `data/site.js`). A native reader should check them before launch; they can
  be removed by emptying `AR` and the `ar` fields.
- **The descriptor line** and the fields line under the Group's name.
- **Business-area tags.** Which sector pages each TIBECO and Lusail
  Commercial product appears on (`in: [...]`) is a reading of the products,
  not a statement from the companies.
- **Three sectors through TIBECO alone.** Investments, Energy & Industrial
  and Technology have no Lusail company of their own. Either fold them into
  fewer sectors or add the companies that belong there.
- **The gold.** If management wants the palette to follow TIBECO exactly, set
  `--gold` to `#f4a825`.
