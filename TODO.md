# Lusail Corp — open items

Everything still outstanding on the site, and where each one lives. Items under
**Needs you** cannot be finished without information only Lusail Corp has.

---

## Needs you

### 0. Product origins are indicative — confirm them before launch *— blocking*

Every product on the Lusail Commercial and ROMA pages now shows **"Sourced
from"** with a list of countries. Those pairings are **mine, not yours.**

What is solid: every country used is already on the Group's own declared
sourcing list, so nothing new was introduced, and the build refuses any origin
that is not on that list. What is not solid: *which* commodity comes from
*which* of those countries. I paired them by what is ordinary in the trade —
rice from India and Vietnam, coffee origins in Africa and the Americas,
sulphur from the Gulf and Central Asia — not from anything you have told me.

A buyer may read these as a statement about your actual supply chain. Go
through `origins` in [data/site.js](data/site.js) and correct or delete them.
Deleting is safe: a product with no `origins` simply renders without the row.


### 0b. The Supplier Portal's events are examples — replace them *— blocking*

`/suppliers/` lists five open sourcing events (granular sulphur, lighting
towers and welfare cabins, ICUMSA 45 sugar, fresh vegetables, an inbound
marine logistics RFI). **They were carried over from the portal mock-up to show
the page working**, then corrected on a procurement review (the EN590
diesel event was dropped as reading like a broker-chain template; origins,
bonds, Kahramaa and MoPH requirements were added). The quantities, ports,
dates and the two sulphur clarifications are still examples.

Before launch, replace `OPPORTUNITIES` in [data/site.js](data/site.js) with
real events, or empty the list: the portal then says nothing is open and
the registration keeps working. Each entry needs a reference, the issuing
company, a category, the type, a title, a brief, the closing time (Doha) and
the requirement rows; see the comment above the list.

Also decide:

- **A procurement mailbox.** Registrations and quotations are emailed to
  `info@lusailcorp.com` like everything else (`CONTACT_TO`). A dedicated
  address — and the support phone and hours shown on the page, which are the
  placeholder number and "Sunday to Thursday, 8:00 to 17:00" — need confirming.
- **What "the categories" are.** The eight in `SUPPLY` and the lines under
  each (sulphur, sugar, reefers, laundry chemicals…) were written from the
  mock-up and the companies' own pages. Correct them; they are also the boxes
  a supplier ticks when registering.
- **Quotations are emails, not sealed bids.** A static site cannot hold a
  bid unopened until closing. The page says a quotation goes to one desk
  and nobody else until the closing time; keep that true at the inbox, or
  soften the wording. A real portal with logins and sealed bids is a
  separate application, and the mock-up's "My bids" dashboard is left out
  for that reason.
- **The Supplier Code of Conduct** at `/suppliers/code/` is a ten-point
  short form written for the site. If the Group has a signed document, link
  or replace it.
- **The terms in brief** on the page — quotes in USD or QAR, local supply
  paid 30 days from invoice, offers firm 30 days, registration valid two
  years, "invitation to treat" under Qatar law — were written to the
  procurement reviewer's advice. Confirm each with the Group's lawyer and
  finance before launch; the wording is in `SOURCING_TERMS`.
- **The categories were extended** on the same review: Halal poultry, meat
  and fish, dairy and FMCG for ROMA, and an eighth category, Corporate
  Services & Indirect (insurance, fleet, security, PPE, printing,
  professional services). Delete what the Group does not buy. Nero Café and
  Cavallo Laundry are **not** on the portal, by the owner's decision: their
  pages carry no "Supply …" button and no category names them.

### 1. Social media handles — *footer*
LinkedIn and Instagram were pointing at `#`, a dead link. They are now **hidden
until real URLs exist**, so nothing broken is published in the meantime.

Give me the two profile URLs, or set them yourself in
[data/site.js](data/site.js) under `contact`:

```js
linkedin: 'https://www.linkedin.com/company/…',
instagram: 'https://www.instagram.com/…',
```

The links appear in the footer automatically.

### 2a. Spam — turn on Cloudflare Turnstile (two keys)

Every form already refuses the obvious: a honeypot field, a post that does not
come from the site, a form "filled in" in under 2.5 seconds, more than two
links, and a crude per-address rate limit. What stops the rest is a human
check, and the code for it is in place — it just needs keys.

1. At [dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile → Add
   widget. Hostname `lusailcorp.com` (add `*.vercel.app` too if previews
   should work). Widget mode **Managed**.
2. In Vercel → Settings → Environment Variables, add both to Production,
   Preview and Development, then redeploy:

| Name | Value |
|---|---|
| `TURNSTILE_SITE_KEY` | the widget's site key (read at build; goes into the pages) |
| `TURNSTILE_SECRET_KEY` | the widget's secret (read by the function) |

Until both are set the pages carry no widget and the function skips the
check, so nothing breaks in the meantime. Turnstile is free, sets no cookies
and shows nothing to a visitor unless they look like a bot.

### 2. Contact form — the Resend key is set *(done 2026-10-20)*

The form posts to [api/contact.js](api/contact.js), which relays through
Resend. The production function now has `RESEND_API_KEY` (an empty probe
came back "Missing: name", not "Email is not configured"). Two things still
decide whether a message *arrives*:

- **Where it goes.** Everything is delivered to `CONTACT_TO`, which defaults
  to `info@lusailcorp.com` (the mailbox now exists). To send a company's
  messages to its own desk, set that company's variable in Vercel and
  redeploy; anything unset keeps going to `CONTACT_TO`:

  | Variable | Reaches it |
  |---|---|
  | `CONTACT_TO_TIBECO_GROUP` | enquiries with TIBECO as the area of interest, quotations on TG- events, invitation requests for them, and supplier registrations (unless `CONTACT_TO_SUPPLIERS` is set) |
  | `CONTACT_TO_LUSAIL_COMMERCIAL` | the same for Lusail Commercial and LC- events |
  | `CONTACT_TO_ROMA_COMMERCIAL` | the same for ROMA and RC- events |
  | `CONTACT_TO_SUPPLIERS` | supplier registrations, if they should go somewhere else |
  | `CONTACT_CC` | copied on every message, e.g. `info@lusailcorp.com` |

  A value may hold several addresses separated by commas.
- **Who it comes from.** Until `lusailcorp.com` is verified in Resend, the
  From address is Resend's `onboarding@resend.dev`, and Resend only lets that
  sender deliver to the email address of the Resend account itself. So
  either `CONTACT_TO` is that address for now, or the domain is verified
  (below) and `CONTACT_FROM` becomes e.g. `Lusail Corp Website
  <website@lusailcorp.com>`.

The variables, in Vercel → Project → Settings → Environment Variables
(Production, Preview and Development; a change needs a redeploy):

| Name | Value | Status |
|---|---|---|
| `RESEND_API_KEY` | from resend.com/api-keys | **set** |
| `CONTACT_TO` | where every form is delivered (defaults to `info@lusailcorp.com`) | set it to a read mailbox |
| `CONTACT_FROM` | the From address, on a domain verified in Resend | after the domain is verified |

**Verifying the domain:** Resend → Domains → Add `lusailcorp.com` → paste the
DKIM and SPF records it gives you into HostGator's DNS. Then set
`CONTACT_FROM` and the site sends from its own address without a code change.

If a send ever fails the form does not pretend to succeed — it says so, keeps
what was typed, and offers the same message to the visitor's mail client.

### 4. Domain and DNS — done

Fixed. On 2026-10-12 `lusailcorp.com` redirects (308) to `www.lusailcorp.com`,
which resolves to Vercel and serves the current site. Nothing left to do here.

### 5. Email does not exist yet

`lusailcorp.com` has **no MX records**, so `info@lusailcorp.com` cannot receive
anything today. That address is published on every page and is where the
contact form delivers. Set up a mailbox — HostGator includes email hosting, or
use Google Workspace / Microsoft 365 — before launch.

> The site previously said **lusailcorp.qa**. That domain is **not registered**
> at all, so the published email address and every canonical URL pointed
> nowhere. Both now use lusailcorp.com. If .qa is wanted, register it first.

### 6. Facts that would make the writing materially stronger

The copy was reviewed against current practice for corporate-group sites. It
is now free of claims nobody can check — but it is thin on fact, because there
are almost none to use. Each of these would earn its place on the site:

| | Where it would go |
|---|---|
| **Founding year** of the Group, and of each company | the About opening, which currently has no date anywhere |
| **LinkedIn and Instagram URLs** | the footer |
| **Anything countable** — supplier relationships, customers ROMA delivers to, deliveries per week, headcount | the figures band, which now shows only what can be counted from the site itself |
| **Confirmation of the 21 sourcing countries** — is every one a live origin today? | the map |
| **Cavallo and Nero specifics** — location, hours, services, turnaround | their pages, which are the two thinnest |
| **Registrations and licences** — commercial registration, freight forwarding, food safety | the company pages; their absence is conspicuous in trading and food |
| **Any supplier, brand or customer that may be named** | worth more than the whole values section |

The home page's figures band previously read **5+ years · 10+ markets · 50k+
customers · 4 companies**. Three of those came from the design file and nobody
had confirmed them — and "10+ markets" contradicted the map on the same page,
which pins the source countries. All four figures are now counted from the
content, so they cannot be wrong: today **5 companies · 7 sectors · 6
sourcing regions · 22 source countries**.

### 7. Arabic is off, and the old translations are stale

The site renders **English only**. The translations were removed when the copy
was rewritten: every one of them described text that no longer exists, and a
stale translation is worse than none — switched back on, it would silently
mistranslate the new wording.

The old strings are in git history at `7f548c4`. Bringing Arabic back means
translating the current English and rendering it, not reviving those fields.
Nothing in the templates assumes one language any more.

### 8. Two companies borrow a photograph

Cavallo Laundry and Nero Café have no upright photograph of their own, so they
borrow `lifestyle-wide.jpg` and `coffee-still.jpg` for the shot beside their
opening paragraphs. A picture of each business would be better. Everything
else on the site now has its own.

### 9. Pages were removed — check the redirects once it is live

The portfolio index and the careers page are gone. `vercel.json` sends
`/companies/` and `/portfolio/` to `/sectors/`, and `/careers/` and `/jobs/` to
`/contact/`. `/partnerships/` (Work With Us) is a live page; its partnership
application form was replaced by the Supplier Portal and the contact form,
so `/partnerships/#apply` now lands on the page top. Worth spot checking
after the first deploy, since search engines still hold the old URLs.
