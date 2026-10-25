# TIBECO Group as the design reference — the study

Management asked for the Lusail Corp site to be designed like TIBECO Group's
(<https://www.tibecogroup.com/>), and for TIBECO's **platforms** to become
Lusail's **sectors**. This note records what was studied, how the two sites
map onto each other, what was built, and what still has to be checked against
the live reference.

## What could and could not be studied

The reference site could **not be loaded** from the environment this work was
done in: its network policy refuses `tibecogroup.com`, and the web archive with
it. What follows about TIBECO's site therefore comes from three sources:

1. **The search index.** The site's title is "TIBECO GROUP — Commerce" and its
   description "Elite International Business Group. Commerce, Investment &
   Services across global markets." — a group that puts its three platforms in
   front, with Commerce first, and describes itself in one line over the title.
2. **This repository's own history.** TIBECO is a Lusail Corp company, and the
   Supplier Portal here was carried over from TIBECO's (paths, the portal strip,
   the register page with its progress rail and documents, the "no page per
   event" rule). The earlier sessions that did this recorded what they saw:
   the site is set in **Inter**, its bar is **solid**, each platform has its
   own page, its business areas are listed with a large photograph, and it
   states ISO 9001 / 14001 / 45001, ICC Qatar membership and a presence across
   the Gulf, Europe, North Africa and Asia.
3. **TIBECO's content as the Group holds it** (`data/site.js`): three
   platforms — Commerce, Investments, Services — and five business areas:
   Energy & Industrial Materials; Technology & Advanced Systems; Industrial,
   Institutional & Commercial Equipment; Strategic Commodities & Food Security;
   Project-Based Commercial Supply.

Everything visual below is an inference from that, built so that it can be
corrected quickly once the live site can be compared (see the checklist).

## How TIBECO's structure maps onto Lusail Corp

| TIBECO Group | Lusail Corp | Where |
|---|---|---|
| "Elite International Business Group" over the title | "Diversified Qatari Business Group" | `SITE.descriptor` |
| "Commerce, Investment & Services across global markets" | "Investment, Trade, Supply & Services across Qatar and international markets." | `SITE.fields` |
| **Three platforms** — Commerce, Investments, Services | **Seven sectors** — Investments & Strategic Services, Trading & Commodities, Supply & Distribution, Energy & Industrial, Technology & Advanced Systems, Consumer & Lifestyle Services, Food & Beverage | `SECTORS` |
| A page per platform | A page per sector, `/sectors/<slug>/` | `pageSector()` |
| Business areas on a platform page | Business areas on a sector page — each one a product or service of a company in the sector, tagged with `in: [...]` | `areasOf()` |
| Companies / brands under a platform | Companies in the sector (TIBECO itself is one, linked to its own site) | `sector.companies` |
| About / the Group | About Us | `/about/` |
| Supplier Portal (portal · opportunities · register) | Supplier Portal, same three routes, plus a band on the home page | `/supplier-portal/` |
| Contact | Contact (the one button on the bar) | `/contact/` |
| Credentials: ISO 9001 · 14001 · 45001 · ICC Qatar | Not claimed for the Group — TIBECO holds them, Lusail Corp does not (see "What to confirm") | — |

Seven top-level items would crowd a bar, so **Sectors** is one word on the bar
with a panel of seven under it, a strip of seven under the home title, and a
grid of seven cards on the home page and the sectors index. Three of the seven
sectors are worked only through TIBECO Group today; their pages say so
("through TIBECO Group") and link to tibecogroup.com.

## The new site, page by page

```
/                          Home
/about/                    The Group
/sectors/                  The seven sectors, as cards
/sectors/<slug>/           One sector — NEW
/companies/<slug>/         One company (TIBECO opens tibecogroup.com instead)
/partnerships/             Work With Us
/supplier-portal/          The Supplier Portal, /opportunities/, /register/, /code/
/contact/                  Channels and the enquiry form
```

**Home.** Solid white bar. A photograph with the descriptor over the title
("Building Businesses. Creating Value."), the fields line, two buttons, and
the **seven sectors as a strip** along the foot of the photograph. Then: who
we are, with the four figures counted from the content; the five businesses;
the **seven sectors as cards** (the first wide); what makes it a group; where
we source from (the globe); how we work; the **Supplier Portal band**; the ask.

**A sector page** — the platform page, re-cast. The sector's name and line over
its photograph, with "Business areas" and "Talk to us". The sector's argument
(its headline and three paragraphs) beside three facts: companies, business
areas, and through whom. The **business areas** as a grid of cards — a
photograph, the name, a line, and "through <company>" — drawn from the
companies' own product lists, so a sector can never claim an area no company
offers. The companies in the sector as cards. The other six sectors. The ask.

**The sectors index.** The seven cards and "What makes it a group".

**Company pages, About, Work With Us, the Portal, Contact** keep their content
and order; they take the solid bar, the shorter opening, the type and the card
shapes.

## The design language adopted

| | First design | Now (TIBECO reference) | Set in |
|---|---|---|---|
| Bar | Navy, transparent over the home photograph | **Solid white**, hairline under it, navy words, gold "Contact us" button | `.site-head` |
| Headings | Newsreader, a light serif | **Inter, bold, tight** | `--display`, `h1, h2` |
| Running text | Inter | Inter | `--body` |
| Openings | Full-screen photograph behind a floating bar | Photograph **under** the bar, 58 % of the screen | `.pagehead`, `.hero` |
| Components | Hairline rules, no boxes | **Rounded cards** (14 px), soft shadow when lifted, round arrow buttons | `--radius`, `--shadow`, `.seccard`, `.area`, `.cocard` |
| Buttons | Square | Rounded (8 px); gold on photographs | `.btn`, `.btn-gold` |
| Colour | Navy, gold, warm greys | Unchanged — the brand stays Lusail's | `:root` |
| Sectors | An accordion of seven strips; one long index page | A strip, a grid of cards, a page each | `sectorStrip()`, `sectorCards()`, `pageSector()` |

## What to check against the live tibecogroup.com

Open the reference beside the new site and compare these; each names where to
change it here.

- [ ] **Bar.** Is TIBECO's bar white or dark? Does it carry a button? →
      `.site-head`, `.head-cta` in `assets/css/site.css`.
- [ ] **Hero.** Full-screen or shorter? Centred or left? Is there a strip of
      platforms under the title, or are they the first section below? →
      `.hero`, `.secstrip`; `pageHome()` in `build/render.js`.
- [ ] **The descriptor.** Where "Elite International Business Group" sits and
      how it is set (eyebrow over the title, or a line under it) → `.hero-eyebrow`.
- [ ] **Platform page.** Order of blocks: overview, business areas, brands,
      credentials, contact? Business areas as cards, a list, or a list beside
      one large photograph? → `pageSector()`, `.areas`.
- [ ] **Cards.** Corner radius, border or shadow, hover behaviour → `--radius`,
      `--shadow`, `.seccard`, `.area`.
- [ ] **Type.** Heading weight and tracking (700 and −0.025 em here) → `h1, h2`,
      `--t-display`, `--t-h1`.
- [ ] **Colour.** TIBECO's blue is `#3b82c4` in the Group's own record of it;
      Lusail stays navy and gold. If management wants the *palette* to follow
      TIBECO too, that is `--ink`, `--gold`, `--gold-text` in `:root`.
- [ ] **Counters.** Does TIBECO show figures (years, countries, projects)? The
      Group's four are counted from the content (`FIGURES`).
- [ ] **Credentials band.** TIBECO shows its ISO and ICC credentials; Lusail
      Corp has none to show as a Group. Leave out, or add the Group's own once
      confirmed.
- [ ] **Footer.** Columns and contents → `footer()`.
- [ ] **The Supplier Portal** was already carried over from TIBECO's; check it
      still matches after the restyle.

To do the comparison from a build session, add `www.tibecogroup.com` to the
environment's allowed domains (Network access, in the environment settings),
then ask for a second pass.

## What to confirm with the Group

- **The descriptor line** "Diversified Qatari Business Group" and the fields
  line under the title — written for this redesign, not from the Group's own
  words.
- **Business-area tags.** Which sector pages each TIBECO and Lusail Commercial
  product appears on (`in: [...]` in `data/site.js`) is a reading of the
  products, not a statement from the companies. Freight appears on both
  Trading and Supply & Distribution; TIBECO's Equipment on Energy and Supply.
- **Three sectors through TIBECO alone.** Investments, Energy & Industrial and
  Technology have no Lusail company of their own; their pages say "through
  TIBECO Group". If that reads as too thin, either fold them into fewer
  sectors or add the companies that belong there.
