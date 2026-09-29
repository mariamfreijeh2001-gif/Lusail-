# Lusail Corp — open items

Everything still outstanding on the site, and where each one lives. Items under
**Needs you** cannot be finished without information only Lusail Corp has.

---

## Needs you

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

### 2. Contact form — set the Resend key in Vercel

The form now posts to [api/contact.js](api/contact.js), which relays through
Resend. **It needs one environment variable before it can send.**

Vercel → Project → Settings → Environment Variables:

| Name | Value | Required |
|---|---|---|
| `RESEND_API_KEY` | from resend.com/api-keys | **yes** |
| `CONTACT_TO` | where enquiries land (defaults to `info@lusailcorp.com`) | no |
| `CONTACT_FROM` | the From address | no |

Add it to **Production, Preview and Development**, then redeploy — env vars are
read at deploy time, so an existing deployment will not pick it up.

**`CONTACT_FROM` needs a verified domain.** Until lusailcorp.com is verified in
Resend (Domains → Add → paste the DKIM/SPF records into HostGator), Resend only
accepts `onboarding@resend.dev`, which is the built-in default. So the form
works as soon as the key is set, and starts sending from your own domain later
without a code change.

Until the key exists the form does not pretend to succeed — it opens the
visitor's mail client with the message prefilled, so no enquiry is lost.

### 3. Real phone number
`+974 0000 0000` is a deliberate placeholder, as you asked. Replace `phone` in
[data/site.js](data/site.js) when the line is live.

### 4. Domain and DNS — blocking launch

The live domain is **lusailcorp.com**. It is registered, DNS is managed at
**HostGator**, and right now it shows a parking error page:

**The site itself is live and correct on Vercel.** Forcing a connection to
Vercel's IP returns HTTP 200, `Server: Vercel`, a valid certificate and the
right page. Nothing is wrong with the deployment.

The fault is one bad DNS record. The `www` name at HostGator has **two
conflicting records at once**:

| Record | Value | Verdict |
|---|---|---|
| `www` **CNAME** | `ef2b1ec2f8d15bf2.vercel-dns-016.com` | correct — this is Vercel |
| `www` **A** | `208.91.197.13` | **delete this** — the old parking IP |
| `@` **A** | `216.150.1.1` | correct — Vercel, and it 308s to www |

A name that has a CNAME may not have any other record (RFC 1034 / RFC 2181).
With both present, resolvers disagree: Google returns the CNAME and reaches
the real site, while other resolvers return the parking A record and show the
error page. **This is why Vercel keeps flipping between Configured and Not
Configured** — its checks land on different answers each time.

### The fix — one action

**HostGator** → cPanel → Zone Editor → lusailcorp.com → **delete the `A`
record on `www` that points to `208.91.197.13`.** Keep the CNAME. Change
nothing else; the apex is already right.

Propagation then takes up to an hour (the zone TTL is 3600s). This will **not**
resolve on its own while the conflicting record is still there.

Do **not** switch the nameservers to Vercel unless email moves too — the
mailboxes would go with them.

### 5. Email does not exist yet

`lusailcorp.com` has **no MX records**, so `info@lusailcorp.com` cannot receive
anything today. That address is published on every page and is where the
contact form delivers. Set up a mailbox — HostGator includes email hosting, or
use Google Workspace / Microsoft 365 — before launch.

> The site previously said **lusailcorp.qa**. That domain is **not registered**
> at all, so the published email address and every canonical URL pointed
> nowhere. Both now use lusailcorp.com. If .qa is wanted, register it first.

### 6. Three of the four home-page figures are unverified — *blocking*

The stat band under the introduction reads **5+ Years Building · 10+ Markets
Served · 50k+ Customers Served · 4 Operating Companies**.

Only the last is real — it counts the portfolio. The other three came from the
Figma, not from the Group, and nobody has confirmed them. A wrong number on a
corporate home page is worse than no number.

Confirm or change them in `FIGURES` in [data/site.js](data/site.js). To drop a
figure entirely, delete its line; the band re-centres on what is left.

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

The portfolio index, the careers page and the partnerships page are gone.
`vercel.json` sends `/companies/` and `/portfolio/` to `/sectors/`, `/careers/`
and `/jobs/` to `/contact/`, and `/partnerships/` to the "Who we want to hear
from" section on `/about/`. Worth spot checking after the first deploy, since
search engines still hold the old URLs.
