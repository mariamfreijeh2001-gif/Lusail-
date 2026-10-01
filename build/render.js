/* ==========================================================================
   Lusail Corp — static site generator.

   Reads /data/site.js, writes finished HTML into /dist. No dependencies.
   Run with:  npm run build

   PAGES
     /                     home
     /sectors/             the four sectors, each with the businesses in it
     /sectors/<slug>/      one sector
     /companies/<slug>/    one company
     /about/               the Group: what it is and what it believes
     /partnerships/        Work With Us: who the Group wants to hear from
     /contact/             channels, the enquiry form and the map
     /404.html

   There is no portfolio index and no careers page. Every company is reached
   from the sectors menu, the sectors index or its own sector's page, which is
   one move from anywhere. Applications and partnership enquiries route
   through the contact form's "area of interest" field, and vercel.json
   redirects the URLs those pages used to have.

   DESIGN
   Built to the Figma. Every page opens on a photograph with its title over a
   dark wash; the reading below sits on white and warm off-white in turn.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const { makeProjection, dotGrid } = require('./worldmap.js');
const {
  SITE, REACH, REACH_POINTS, HUB, WHY, SECTORS, ALL_COMPANIES,
  WHAT_WE_DO, VALUE_CREATION, VALUES, GROWTH, FIGURES,
  PARTNER_TYPES
} = require('../data/site.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'dist');

/* ==========================================================================
   Photographs
   Every picture goes out in several sizes, and the browser picks one before
   the stylesheet has arrived — so `sizes` has to describe the box the
   stylesheet will put it in. The sizes themselves are made by
   build/variants.js from the roles in build/imageroles.js; nothing here
   invents a file, and a page asking for one that was never made fails the
   build.
   ========================================================================== */

const IMG_DIR = path.join(ROOT, 'site-assets/img');
const DERIVED = path.join(IMG_DIR, 'derived');

/* The real pixel size of a JPEG, read from its SOF marker, so width/height
   describe the file rather than whatever was typed into the template. They
   had drifted badly: every page hero declared 1600x1066 while carrying
   anything from 673x1200 to 1600x1066. */
function jpegSize(buf) {
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xFF) { i++; continue; }
    const m = buf[i + 1];
    if (m === 0xD8 || m === 0x01 || (m >= 0xD0 && m <= 0xD7)) { i += 2; continue; }
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC)
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error('not a JPEG');
}

const measure = f => { const d = jpegSize(fs.readFileSync(f)); return { w: d.w, h: d.h }; };

/* name -> { nat, sizes: [{ w, h, src }], cropped } */
const PICS = (() => {
  const out = {};
  for (const f of fs.readdirSync(IMG_DIR)) {
    if (!f.endsWith('.jpg')) continue;
    const name = f.slice(0, -4);
    out[name] = { nat: measure(path.join(IMG_DIR, f)), sizes: [], cropped: false };
  }
  if (fs.existsSync(DERIVED)) {
    for (const f of fs.readdirSync(DERIVED)) {
      const m = f.match(/^(.+)-(\d+)\.jpg$/);
      if (!m || !out[m[1]]) continue;
      const d = measure(path.join(DERIVED, f));
      out[m[1]].sizes.push({ w: d.w, h: d.h, src: '/assets/img/derived/' + f });
    }
  }
  for (const p of Object.values(out)) {
    p.sizes.sort((a, b) => a.w - b.w);
    /* A variant cut to a fixed shape cannot sit in the same srcset as the
       original, which is a different shape: the browser would pick whichever
       it liked and the box would change shape under it. Noticing the
       difference here beats keeping a second list in step by hand. */
    const r = p.nat.w / p.nat.h;
    p.cropped = p.sizes.some(s => Math.abs(s.w / s.h - r) > 0.02);
  }
  return out;
})();

/* An <img> that offers every size we made of it.
   `sizes` is the CSS of the box it lands in; `attrs` is anything else. */
function pic(name, sizes, attrs) {
  const p = PICS[name];
  if (!p) { console.error('\n  no such photograph: ' + name + '.jpg\n'); process.exit(1); }
  const cands = p.cropped
    ? p.sizes
    : p.sizes.concat([{ w: p.nat.w, h: p.nat.h, src: '/assets/img/' + name + '.jpg' }]);
  const big = cands[cands.length - 1] || { w: p.nat.w, h: p.nat.h, src: '/assets/img/' + name + '.jpg' };
  const set = cands.length > 1
    ? ` srcset="${cands.map(c => c.src + ' ' + c.w + 'w').join(', ')}" sizes="${sizes}"`
    : '';
  return `<img src="${big.src}"${set} width="${big.w}" height="${big.h}" ${attrs}>`;
}

/* ---------- helpers ---------------------------------------------------- */

const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const num = i => String(i + 1).padStart(2, '0');
const plural = (n, one, many) => n === 1 ? `1 ${one}` : `${n} ${many}`;

/* A social link is only rendered once it points somewhere. While the handles
   are unset the link simply is not there, rather than a link to '#'. */
const SOCIAL = () => [
  ['LinkedIn', SITE.contact.linkedin],
  ['Instagram', SITE.contact.instagram]
].filter(([, href]) => href && href !== '#');

/* The logo appears in the header, the footer, the favicon, beside the home
   introduction and as a watermark on the closing card — never as a shape the
   layout is built around, so the design survives a rebrand. Filenames come
   from SITE.brand. Both bars are carbon, so both take the reversed lockup. */
const B = SITE.brand;
const LOGO = `<img src="/assets/logo/${B.logoOnDark}" alt="" width="${B.logoWidth}" height="${B.logoHeight}">`;

/* Icons, drawn here rather than pulled from a set, so they share the site's
   geometry: 24x24, hairline strokes, square caps, mitre joins, no rounding.
   They are decorative — the label beside each one carries the meaning — so
   they are aria-hidden. */
const ICON_PATHS = {
  // a shield: taking responsibility for the outcome
  shield: '<path d="M12 2.6 20 5.4v6.2c0 4.6-3.2 8.3-8 9.8-4.8-1.5-8-5.2-8-9.8V5.4z"/><path d="M8.6 12.1l2.4 2.4 4.6-4.9"/>',
  // a target: knowing who the customer is
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
  // a path found through: solving the problem
  solve: '<path d="M3.5 3.5h17v17h-17z"/><path d="M3.5 14.5h5v-5h7v5h5"/>',
  // a loop that keeps going: continuous development
  cycle: '<path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20.5 3v4.5H16"/>',
  // two rings overlapping: a partnership, not an acquisition
  partnership: '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
  // three points, all connected: suppliers, the group, buyers
  supply: '<circle cx="4.6" cy="6" r="1.9"/><circle cx="19.4" cy="6" r="1.9"/><circle cx="12" cy="19" r="1.9"/><path d="M6.5 6h11M5.5 7.7l5.5 9.6M18.5 7.7L13 17.3"/>',
  // a crate seen in three-quarters: goods moving
  crate: '<path d="M3.5 7.6 12 3.5l8.5 4.1v8.8L12 20.5l-8.5-4.1z"/><path d="M3.5 7.6 12 11.7l8.5-4.1M12 11.7v8.8"/>',
  // a life ring: everyday service
  ring: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="3.6"/><path d="M6 6l3.4 3.4M18 6l-3.4 3.4M6 18l3.4-3.4M18 18l-3.4-3.4"/>',
  // a cup: the counter, and what is served over it
  cup: '<path d="M4.5 8.5h11.5v6.5a4.5 4.5 0 0 1-4.5 4.5H9a4.5 4.5 0 0 1-4.5-4.5z"/><path d="M16 10.5h2.2a2.6 2.6 0 0 1 0 5.2H16"/><path d="M8 3.2v2.4M11.8 3.2v2.4"/>',
  // a globe: markets beyond Qatar
  markets: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.7 3.3 2.7 13.7 0 17M12 3.5c-2.7 3.3-2.7 13.7 0 17"/>',
  // a leaf: growers and producers
  leaf: '<path d="M20 4c0 9-5 13-11 13H4.5C4.5 9 10 4 20 4z"/><path d="M15 8.5C10.5 10.5 7 14 5 20"/>',
  // a spark: founders and new concepts
  spark: '<path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5M5.2 5.2l3.5 3.5M15.3 15.3l3.5 3.5M18.8 5.2l-3.5 3.5M8.7 15.3l-3.5 3.5"/><circle cx="12" cy="12" r="2.6"/>'
};
/* These are line drawings: the paths carry no fill or stroke of their own, so
   every place that used one had to remember to turn the fill off. The class
   carries that, and each context only says how big and what colour. */
const icon = name => ICON_PATHS[name]
  ? `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON_PATHS[name]}</svg>`
  : '';

const BULLET = `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="currentColor" fill-opacity=".5"><path d="M4 8L8 4L12 8L8 12L4 8Z"/><path d="M8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2Zm0-1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Z"/></svg>`;
const CARET = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.53 8.97a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06L12 12.44l3.47-3.47a.75.75 0 0 1 1.06 0Z"/></svg>`;
const BURGER = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 7h18M3 12h18M3 17h18"/></svg>`;
const CHEV = `<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M4 7l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;


/* ---------- structured data ---------------------------------------------

   What a search engine is told about the Group, in its own vocabulary. It is
   built from the same data the pages are, so it cannot drift from what a
   visitor reads.

   The phone number and the social handles are placeholders, so 'telephone'
   and 'sameAs' are left out entirely rather than published wrong — they
   appear the moment SITE.contact holds real values. Cavallo and Nero are
   plain Organizations rather than LocalBusiness subtypes for the same
   reason: a laundry or a cafe wants a street address and opening hours, and
   claiming to be a local business without them earns nothing. */

const ORG_ID = SITE.domain + '/#organization';
const abs = p => SITE.domain + p;
const coId = c => abs('/companies/' + c.slug + '/') + '#organization';

function orgSchema() {
  const social = SOCIAL().map(([, href]) => href);
  const org = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: SITE.domain + '/',
    logo: {
      '@type': 'ImageObject',
      url: abs('/assets/logo/favicon-512px.png'),
      width: 512, height: 512
    },
    image: abs('/assets/img/hero-doha.jpg'),
    description: SITE.blurb + ' ' + SITE.supporting,
    slogan: SITE.tagline,
    address: { '@type': 'PostalAddress', addressCountry: 'QA', addressRegion: SITE.contact.location },
    areaServed: { '@type': 'Country', name: 'Qatar' },
    contactPoint: [{
      '@type': 'ContactPoint', contactType: 'sales',
      email: SITE.contact.email, availableLanguage: ['en']
    }],
    knowsAbout: [
      'Commodity trading', 'International freight forwarding', 'Ocean freight',
      'Vessel chartering', 'Food import and distribution', 'Garment care'
    ],
    subOrganization: ALL_COMPANIES.map(c => ({ '@id': coId(c) }))
  };
  if (SITE.contact.phone && !/0{4}/.test(SITE.contact.phone)) {
    org.telephone = SITE.contact.phone.replace(/\s/g, '');
  }
  if (social.length) org.sameAs = social;
  return org;
}

function companySchema(c) {
  const org = {
    '@type': 'Organization',
    '@id': coId(c),
    name: c.name,
    url: abs('/companies/' + c.slug + '/'),
    image: abs('/assets/img/' + c.hero + '.jpg'),
    description: c.short,
    parentOrganization: { '@id': ORG_ID },
    address: { '@type': 'PostalAddress', addressCountry: 'QA' },
    areaServed: { '@type': 'Country', name: 'Qatar' }
  };
  const offers = (c.products || c.services || []).map(p => ({
    '@type': 'Offer', itemOffered: { '@type': 'Service', name: p.t }
  }));
  if (offers.length) {
    org.hasOfferCatalog = {
      '@type': 'OfferCatalog', name: c.name + ' — what it offers', itemListElement: offers
    };
  }
  return org;
}

/* A trail of where the page sits. The last step names the current page and
   deliberately carries no url. */
function crumbs(steps) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE.domain + '/' }]
      .concat(steps.map((st, i) => {
        const item = { '@type': 'ListItem', position: i + 2, name: st.name };
        if (st.url) item.item = abs(st.url);
        return item;
      }))
  };
}

const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) });

/* ---------- chrome ----------------------------------------------------- */

function head({ title, desc, url, image, schema, noindex }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#181717">
${noindex ? '<meta name="robots" content="noindex">\n' : `<link rel="canonical" href="${SITE.domain}${url}">`}

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE.domain}${url}">
${image ? `<meta property="og:image" content="${SITE.domain}/assets/img/${image}.jpg">
<meta property="og:image:alt" content="${esc(title)}">` : ''}
<meta property="og:locale" content="en">
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="/assets/logo/${B.faviconSvg}" type="image/svg+xml">
<link rel="icon" href="/assets/logo/${B.faviconIco}" sizes="any">
<link rel="apple-touch-icon" href="/assets/logo/${B.appleTouch}">

<link rel="preload" href="/assets/font/archivo-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css">
${schema ? `\n<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>` : ''}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
`;
}

/* The bar carries four links and one action. "Sectors" opens a panel across
   the measure rather than going anywhere itself: the whole portfolio is four
   sectors and five listings, so it fits, and a visitor gets to the business
   they came for in one move. */
const NAV = [
  ['Home', '/'],
  ['Sectors', '/sectors/'],
  ['About Us', '/about/'],
  ['Work With Us', '/partnerships/']
];

/* A mark per sector, drawn from the set already in ICON_PATHS. */
const SECTOR_ICON = {
  'trading': 'markets',
  'supply-distribution': 'crate',
  'consumer-services': 'ring',
  'food-beverage': 'cup'
};

function sectorsPanel() {
  return `      <div class="secmenu" id="secmenu">
        <a class="secmenu-eyebrow" href="/sectors/">Our sectors <span aria-hidden="true">&#8594;</span></a>
        <div class="secmenu-cols">
${SECTORS.map(s => `          <div class="secmenu-col">
            <a class="secmenu-head" href="/sectors/${s.slug}/">
              ${icon(SECTOR_ICON[s.slug] || 'markets')}
              <span>${esc(s.name)}</span>
            </a>
${s.companies.map(c => `            <a class="secmenu-co" href="/companies/${c.slug}/">${esc(c.name)}</a>`).join('\n')}
          </div>`).join('\n')}
        </div>
      </div>`;
}

/* overHero: the home page opens on a photograph that runs under the bar, so
   the bar starts transparent over it and fills as the page moves. Every other
   page puts its photograph below a solid bar, as they are drawn. */
function header(current, overHero) {
  const link = ([label, href]) => {
    const here = href === current ? ' aria-current="page"' : '';
    /* a sector page is "under" Sectors, so the button carries the mark */
    const onSector = current && current.startsWith('/sectors/') ? ' aria-current="true"' : '';
    /* Sectors is a link to the sectors page and a panel listing them, which
       are two things, so they are two controls: clicking the word goes to
       the page, and the caret beside it opens the panel. One element cannot
       do both — a click would have to either navigate or not. */
    return label === 'Sectors'
      ? `      <div class="navwrap" id="navwrap">
        <a class="nav-link nav-sec" href="${href}"${here || onSector}>Sectors</a>
        <button class="nav-caret" type="button" id="secBtn" aria-expanded="false" aria-controls="secmenu" aria-label="Show the sectors">${CARET}</button>
${sectorsPanel()}
      </div>`
      : `      <a class="nav-link" href="${href}"${here}>${esc(label)}</a>`;
  };

  return `<header class="site-head${overHero ? ' over' : ''}" id="top">
  <a class="brand" href="/" aria-label="${esc(SITE.name)} — home">${LOGO}</a>
  <nav class="nav" aria-label="Main">
${NAV.map(link).join('\n')}
  </nav>
  <a class="head-cta" href="/contact/">Contact us</a>
  <button class="burger" type="button" id="burger" aria-expanded="false" aria-controls="menu" aria-label="Menu">
    ${BURGER}
  </button>
</header>
<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Menu">
${NAV.map(([label, href]) => `  <a href="${href}"${href === current ? ' aria-current="page"' : ''}>${esc(label)}</a>` +
  (label === 'Sectors'
    ? '\n' + SECTORS.map(s => `  <a class="sub" href="/sectors/${s.slug}/"${'/sectors/' + s.slug + '/' === current ? ' aria-current="page"' : ''}>${esc(s.name)}</a>`).join('\n')
    : '')).join('\n')}
  <a class="btn btn-light" href="/contact/">Contact us</a>
</div>
<main id="main">
`;
}

function footer() {
  const social = SOCIAL();
  return `</main>
<footer class="site-foot">
  <div class="wrap">
    <div class="foot">
      <div class="foot-id">
        <a class="brand" href="/" aria-label="${esc(SITE.name)} — home">${LOGO}</a>
        <p>${esc(SITE.tagline)}<br>${esc(SITE.blurb)}</p>
      </div>
      <div class="foot-cols">
        <div class="foot-col">
          <p class="foot-h">Sectors</p>
          <ul>
${SECTORS.map(s => `            <li><a href="/sectors/${s.slug}/">${esc(s.name)}</a></li>`).join('\n')}
          </ul>
        </div>
        <div class="foot-col">
          <p class="foot-h">Contact</p>
          <ul>
            <li><a href="mailto:${SITE.contact.email}">${esc(SITE.contact.email)}</a></li>
            <li><a href="tel:${SITE.contact.phone.replace(/\s/g, '')}">${esc(SITE.contact.phone)}</a></li>
            <li><span>${esc(SITE.contact.location)}</span></li>
${social.map(([label, href]) => `            <li><a href="${href}">${esc(label)}</a></li>`).join('\n')}
          </ul>
        </div>
      </div>
    </div>
    <p class="foot-legal">© ${esc(SITE.name)}. All Rights Reserved.</p>
  </div>
</footer>
<script src="/assets/js/site.js" defer></script>
</body>
</html>
`;
}

/* ---------- reusable blocks -------------------------------------------- */

/* Every page but the home page opens the same way: a photograph, a dark
   wash, and the title sitting on it. */
function pageHead({ eyebrow, eyebrowHref, h1, lede, photo, action }) {
  const brow = eyebrowHref
    ? `<a class="pagehead-eyebrow" href="${eyebrowHref}">${esc(eyebrow)}</a>`
    : `<span class="pagehead-eyebrow">${esc(eyebrow)}</span>`;
  return `<section class="pagehead">
  ${pic(photo, '100vw', 'class="pagehead-bg" alt="" fetchpriority="high"')}
  <div class="wrap">
    ${brow}
    <h1>${esc(h1)}</h1>
    ${lede ? `<p class="pagehead-lede">${esc(lede)}</p>` : ''}
${action ? `    <a class="btn btn-light pagehead-cta" href="${action.href}">${esc(action.label)}</a>` : ''}
  </div>
</section>

`;
}

/* A section head: the statement on the left with one word greyed out, and
   the qualifying line held to the right of it. */
function head2(id, html, aside) {
  return `<div class="head2 rise">
      <h2 id="${id}">${html}</h2>
${aside ? `      <p>${esc(aside)}</p>` : ''}
    </div>`;
}

/* The card. Every company listing on the site is made of these. */
function coCard(c) {
  /* a company can sit in more than one sector, so this is a space-separated
     list and the filter matches any of them */
  const inSectors = (c.sectors || [c.sectorSlug]).join(' ');
  return `      <a class="cocard" href="/companies/${c.slug}/" data-sector="${inSectors}">
        <span class="cocard-shot">${pic(c.hero, '(max-width:700px) 72vw, 334px', `alt="${esc(c.name)}" loading="lazy"`)}</span>
        <span class="cocard-body">
          <span class="cocard-sector">${esc(c.sectorName)}</span>
          <span class="cocard-name">${esc(c.name)}</span>
          <span class="cocard-role">${esc(c.role)}</span>
        </span>
      </a>`;
}

function companyRail(list, id) {
  return `<div class="cogrid"${id ? ` id="${id}"` : ''}>
${list.map(coCard).join('\n')}
    </div>`;
}

/* The closing band, on the foot of every page. It was a 573px photograph
   carrying a 798px panel with a heading, a paragraph, two buttons and a
   seven-item list — a whole section repeated under every page on the site,
   and the list of what the Group wants to do next was buried in it where
   nobody reading about a café would look. It is now one carbon strip: the
   ask, one line, and the two things you can do about it. The list moved to
   Work With Us, which is the page that is about exactly that. */
function ctaBand() {
  return `<section class="next">
  <div class="wrap">
    <div class="next-card rise">
      <img class="watermark" src="/assets/logo/${B.markOnLight}" alt="" width="270" height="350" aria-hidden="true" loading="lazy">
      <div class="next-say">
        <h2>Tell us which one you are</h2>
        <p>Producers and exporters looking for a route into Qatar, buyers who need supply they can rely on, and operators with a business that fits the Group.</p>
      </div>
      <div class="next-act">
        <a class="btn btn-light" href="/contact/">Send an enquiry</a>
        <a class="btn btn-ghost" href="/sectors/">Explore our sectors</a>
      </div>
    </div>
  </div>
</section>

`;
}

/* ---------- the map ----------------------------------------------------- */

/* The markets the Group reaches: a dotted map drawn once at build time from
   the same list the register underneath reads from, so a market cannot
   appear in one and not the other. */
const MAP_BOX = { width: 1052, height: 343, latTop: 78, latBottom: -56, pitch: 5 };

/* A region's pin goes at the mean of the places inside it, which puts it on
   or beside the landmass being named without anyone placing it by hand. */
function regionPoint(region) {
  const pts = REACH_POINTS[region] || [];
  if (!pts.length) return null;
  const lon = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  const lat = pts.reduce((a, p) => a + p[2], 0) / pts.length;
  return [lon, lat];
}

function reachMap() {
  const project = makeProjection(MAP_BOX);

  /* Europe, the Middle East and Central Asia sit close together, so their
     labels would print on top of one another. Each pin gets a stem long
     enough to lift its label clear of the ones already placed: the pins stay
     on their markets and the names stay readable.

     The test is done in the measure the map is drawn into, because the pins
     scale with the map while the labels are a fixed size on top of it. */
  const SCALE = 1210 / MAP_BOX.width;
  const LAB_H = 30, STEM_0 = 26, LANE = 34;

  const placed = REACH.map(r => {
    const at = regionPoint(r.t);
    if (!at) return null;
    const [x, y] = project(at);
    /* the collapsed pill carries the region name and nothing else, so its
       width is the name at 12px plus the padding */
    return { r, x, y, px: x * SCALE, py: y * SCALE, w: r.t.length * 6.8 + 24, lane: 0 };
  }).filter(Boolean);

  const done = [];
  for (const p of placed.slice().sort((a, b) => a.px - b.px)) {
    for (let lane = 0; lane < 6; lane++) {
      const bot = p.py - (STEM_0 + lane * LANE), top = bot - LAB_H;
      const near = q => Math.abs(q.px - p.px) < (q.w + p.w) / 2 + 12;
      const overlaps = q => !(bot < q.top - 6 || top > q.bot + 6);
      /* a label must clear the other labels, and must not be parked on top
         of someone else's dot */
      const onDot = q => Math.abs(q.px - p.px) < p.w / 2 + 7 &&
        q.py > top - 7 && q.py < bot + 7;
      const clash = done.some(q => (near(q) && overlaps(q)) || onDot(q));
      if (clash && lane < 5) continue;
      p.lane = lane; p.top = top; p.bot = bot; done.push(p);
      break;
    }
  }

  /* Labels, not controls. Each pin opened a card of countries on hover —
     word for word the same list the register under the map already prints, so
     the whole interaction revealed what was visible a screen below it. It cost
     overlapping targets, a card that ran off the side of a phone, and one a
     pointer could not travel into. The map says where; the register says what. */
  const pins = placed.map(p => {
    const pc = p.x / MAP_BOX.width * 100;
    return `      <div class="pin" data-region="${esc(p.r.t)}"
        style="left:${pc.toFixed(2)}%;top:${(p.y / MAP_BOX.height * 100).toFixed(2)}%;--stem:${STEM_0 + p.lane * LANE}px">
        <span class="pin-lab"><span class="pin-nm">${esc(p.r.t)}</span></span>
        <span class="pin-stem" aria-hidden="true"></span>
        <span class="pin-dot" aria-hidden="true"></span>
      </div>`;
  }).join(String.fromCharCode(10));

  /* The dot grid is 65KB of path data. Inline it once and it is 70% of the
     home page's HTML, re-downloaded on every visit and parsed before the
     footer is even seen. As a file it is cached, and the pins on top of it
     are ordinary buttons either way. */
  return `<div class="mapwrap" id="mapwrap">
      <img class="mapdots" src="/assets/img/worldmap.svg" width="${MAP_BOX.width}" height="${MAP_BOX.height}"
           alt="" loading="lazy">
${pins}
    </div>`;
}

/* The same markets again, as a register that can be read straight down. */
function reachList() {
  return `<div class="reg" id="markets">
${REACH.map(x => `      <div data-region="${esc(x.t)}">
        <h3>${esc(x.t)}</h3>
        <p>${esc(x.d)}</p>
      </div>`).join('\n')}
    </div>`;
}

/* ---------- home -------------------------------------------------------- */

/* Four claims about the Group. The first is stated outright over the
   photograph; the other three name themselves and give their reasoning when
   asked, so the row reads as four headings rather than four paragraphs. */
function bento() {
  /* The first states itself over the photograph, so it is not a control at
     all — it had been a button with nothing to do and `aria-expanded="true"`
     for ever, which is a promise to a screen reader that nothing kept.
     On the other three the heading is the button and the reasoning sits
     outside it: inside, each button's accessible name was its whole text,
     reveal included, so the reveal meant nothing to anyone listening. */
  const card = (x, i) => i === 0
    ? `        <div class="bcard bcard-photo">
          ${pic('why-group', '(max-width:900px) 100vw, 48vw', 'alt="Two people shaking hands over a table" loading="lazy"')}
          <span class="n">${num(i)}</span>
          <h3>${esc(x.t)}</h3>
          <p>${esc(x.d)}</p>
        </div>`
    : `        <div class="bcard">
          <span class="n">${num(i)}</span>
          <h3><button class="bcard-btn" type="button" aria-expanded="false" aria-controls="why-${i}">${esc(x.t)}</button></h3>
          <span class="say" id="why-${i}"><span><p>${esc(x.d)}</p></span></span>
        </div>`;

  return `<div class="bento">
${card(WHY[0], 0)}
      <div class="bento-col">
${WHY.slice(1).map((x, i) => card(x, i + 1)).join('\n')}
      </div>
    </div>`;
}

/* The four businesses, as panels that open one at a time. The first is open
   until the pointer picks another, and each one is a link — so pointing at a
   company previews it and clicking goes there. Pure CSS, so it works before
   any script runs and on a keyboard. */
function companyLadder() {
  return `<div class="ladder">
${ALL_COMPANIES.map((c, i) => `      <a class="lad" href="/companies/${c.slug}/">
        ${pic(c.hero, '(max-width:860px) 100vw, 25vw', `class="lad-bg" alt="${esc(c.name)}" loading="lazy"`)}
        <span class="n">${num(i)}</span>
        <span class="lad-b">
          <span class="lad-sec">${esc(c.sectorName)}</span>
          <h3>${esc(c.name)}</h3>
          <span class="lad-say">
            <span class="lad-say-in">
              <span class="lad-role">${esc(c.role)}</span>
              <span class="lad-p">${esc(c.short)}</span>
              <span class="lad-go">Visit ${esc(c.name)} <span aria-hidden="true">&#8594;</span></span>
            </span>
          </span>
        </span>
      </a>`).join('\n')}
    </div>`;
}

/* What the Group does with them: four plain cards, no interaction. */
function whatWeDo() {
  return `<div class="wwd">
${WHAT_WE_DO.map((w, i) => `      <div class="wwd-card rise d${Math.min(i, 3)}">
        <span class="wwd-n">${num(i)}</span>
        <h3>${esc(w.t)}</h3>
        <p>${esc(w.d)}</p>
      </div>`).join('\n')}
    </div>`;
}

/* The four sectors, each behind the photograph of the business that leads
   it, going to the portfolio filtered to that sector. */
const SECTOR_SHOT = {
  'trading': 'card-trading',
  'supply-distribution': 'card-supply',
  'consumer-services': 'card-consumer',
  'food-beverage': 'card-food'
};

function pageHome() {
  /* Counted, not typed: every figure on the band is derived from the content
     further down the same file, so it cannot contradict it. */
  const tally = {
    companies: ALL_COMPANIES.length,
    sectors: SECTORS.length,
    regions: Object.keys(REACH_POINTS).length,
    countries: Object.values(REACH_POINTS).reduce((n, p) => n + p.length, 0)
  };
  const stats = FIGURES.map(f => [f.k, String(f.count ? tally[f.count] : f.v)]);

  return head({
    title: `${SITE.name} · ${SITE.tagline}`,
    desc: 'A Qatar-based group of four companies: commodity trading and international freight, food import and distribution, garment care and a café.',
    url: '/', image: 'hero-doha',
    schema: graph(orgSchema(), {
      '@type': 'WebSite', '@id': SITE.domain + '/#website',
      url: SITE.domain + '/', name: SITE.name, inLanguage: 'en',
      publisher: { '@id': ORG_ID }
    })
  })
    + header('/', true)
    + `<section class="hero">
  ${pic('hero-doha', '100vw', 'class="hero-bg" alt="" fetchpriority="high"')}
  <div class="wrap">
    <div class="hero-say">
      <h1>Building Businesses. Creating <em>Value</em>.</h1>
      <p class="hero-lede">A group of four companies in Qatar: commodity trading and international freight, food import and distribution, garment care, and a caf&eacute;.</p>
    </div>
    <div class="hero-cta">
      <a class="btn btn-light" href="/sectors/">Explore our sectors</a>
      <a class="btn btn-ghost" href="/about/">Discover Lusail Corp</a>
    </div>
  </div>
</section>

<section class="section intro" aria-labelledby="introTitle">
  <div class="wrap">
    <div class="intro-top rise">
      <h2 id="introTitle">We buy commodities <br>and we <span class="soft">move them.</span></h2>
      <div class="intro-note">
        <img src="/assets/logo/${B.markOnLight}" alt="" width="44" height="57" loading="lazy">
        <div>
          <p>Because the freight sits in the same business as the buying, an enquiry can be answered with the origin, the specification and the route at once, rather than passed to a forwarder.</p>
          <p>Alongside it the Group imports and distributes food across Qatar, and runs a laundry and a caf&eacute;. Sourcing, shipping and supplier relationships built in one company are open to the others.</p>
        </div>
      </div>
    </div>
    <div class="stats rise" id="stats">
      <dl>
${stats.map(([k, v]) => `        <div><dt>${esc(k)}</dt><dd data-to="${esc(v)}">${esc(v)}</dd></div>`).join('\n')}
      </dl>
    </div>
  </div>
</section>

<section class="section sectors" aria-labelledby="secTitle">
  <div class="wrap">
    <div class="sec-intro rise">
      <h2 id="secTitle">Diversified by Design</h2>
      <p>Four sectors, four companies. Each one sells into a market we can see from Qatar.</p>
    </div>
    <div class="seccards">
${SECTORS.map((s, i) => `      <a class="seccard rise d${Math.min(i, 3)}" href="/sectors/${s.slug}/">
        ${pic(SECTOR_SHOT[s.slug] || 'card-trading', '(max-width:700px) 86vw, 22vw', `alt="${esc(s.name)}" loading="lazy"`)}
        <span class="seccard-cap">
          <b>${esc(s.name)}</b>
          <span class="seccard-more"><span>
            <span class="seccard-say">${esc(s.short)}</span>
            <span class="seccard-who">${s.companies.map(c => esc(c.name)).join(' &middot; ')} <span aria-hidden="true">&#8594;</span></span>
          </span></span>
        </span>
      </a>`).join('\n')}
    </div>
  </div>
</section>

<section class="section stone" aria-labelledby="coTitle">
  <div class="wrap">
    ${head2('coTitle', 'The four <span class="soft">businesses</span>', 'Each runs in its own market with its own customers. Point at one to see it; click to go there.')}
    ${companyLadder()}
  </div>
</section>

<section class="section" aria-labelledby="whyTitle">
  <div class="wrap">
    ${head2('whyTitle', 'What makes it a <span class="soft">group</span>', 'The businesses we own are varied. The way they are run is not.')}
    ${bento()}
  </div>
</section>

<section class="section src" aria-labelledby="srcTitle">
  <div class="wrap">
    ${head2('srcTitle', 'Where we <span class="soft">source</span> from', 'Not every commodity comes from every country. The origin is chosen per product — by season, quality, availability and the terms of the transaction.')}
    ${reachMap()}
    ${reachList()}
  </div>
</section>

<section class="section" aria-labelledby="wwdTitle">
  <div class="wrap">
    ${head2('wwdTitle', 'Building <span class="soft">More</span> Than a Portfolio', 'We are an active owner. Each company is run independently, but none of them is run alone.')}
    ${whatWeDo()}
  </div>
</section>

`
    + ctaBand()
    + footer();
}

/* ---------- about ------------------------------------------------------- */

/* Six values, one open at a time, with a photograph holding the column
   beside them. */
/* The six values. One line each, so each is simply on the page rather than
   behind a click: six rows of which five are shut is a lot of height spent
   hiding two sentences. */
function valueList() {
  return `<div class="vals">
${VALUES.map((v, i) => `      <div class="valcard rise d${Math.min(i, 3)}">
        <span class="valcard-n">${num(i)}</span>
        <h3>${esc(v.t)}</h3>
        <p>${esc(v.d)}</p>
      </div>`).join(String.fromCharCode(10))}
    </div>`;
}

function pageAbout() {
  return head({
    title: `About Us · ${SITE.name}`,
    desc: 'How Lusail Corp is put together: what the Group does for its four companies, what it believes, and who it wants to hear from.',
    url: '/about/', image: 'hero-about',
    schema: graph({ '@type': 'AboutPage', url: abs('/about/'), name: 'About ' + SITE.name,
      mainEntity: { '@id': ORG_ID } }, crumbs([{ name: 'About Us' }]))
  })
    + header('/about/')
    + pageHead({
      eyebrow: 'About Us',
      h1: 'Building a Group for the Future.',
      lede: 'Lusail Corp is a diversified corporate group based in the State of Qatar, bringing together commodity trading, food supply and distribution, consumer services and hospitality.',
      photo: 'hero-about'
    })
    + `<section class="section tight stone" aria-labelledby="whoTitle">
  <div class="wrap">
    <h2 id="whoTitle" class="platform-h rise">A Platform for Business Growth</h2>
    <div class="twocol rise">
      <div>
        <p>Lusail Corp was established with a straightforward ambition: to create, develop and support businesses with the potential to grow.</p>
        <p>Our portfolio companies operate independently within their respective markets while sharing the strategic direction and broader capabilities of the Group.</p>
      </div>
      <div>
        <p>This structure allows each business to keep its own identity, customers and commercial focus while benefiting from belonging to a diversified organisation.</p>
        <p>As the Group develops, additional businesses and sectors will become part of the Lusail Corp portfolio.</p>
      </div>
    </div>
    <figure class="bandshot rise">
      ${pic('about-platform', '100vw', 'alt="" loading="lazy"')}
    </figure>
  </div>
</section>

<section class="section stone" aria-labelledby="vmTitle">
  <div class="wrap">
    <h2 id="vmTitle" class="sr-only">Vision and mission</h2>
    <div class="vm-grid">
      <div class="vm rise">
        <span class="vm-label">Our Vision</span>
        <h3>To build a diversified group of strong and sustainable businesses.</h3>
        <p>To grow Lusail Corp into a recognised corporate group with interests across several commercial sectors, in Qatar and beyond it.</p>
      </div>
      <div class="vm rise d1">
        <span class="vm-label">Our Mission</span>
        <h3>To find opportunities, build capability and create lasting commercial value.</h3>
        <p>We develop businesses through responsible management, strong partnerships, efficient operations and a continuous focus on customers and markets.</p>
      </div>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="valTitle">
  <div class="wrap">
    ${head2('valTitle', 'The values that <span class="soft">guide us</span>', 'Six of them, and we would rather be caught keeping these than talking about them.')}
    ${valueList()}
  </div>
</section>

<section class="section stone" aria-labelledby="vcTitle">
  <div class="wrap">
    ${head2('vcTitle', 'How We <span class="soft">Create Value</span>', 'Growth is not adding companies to a list. It is making each one better than it was.')}
    <div class="vcreate">
${VALUE_CREATION.map((v, i) => `      <div class="vc rise d${Math.min(i, 3)}">
        ${icon(v.icon)}
        <h3>${esc(v.t)}</h3>
        <p>${esc(v.d)}</p>
      </div>`).join('\n')}
    </div>
  </div>
</section>


`
    + ctaBand()
    + footer();
}

/* ---------- one company -------------------------------------------------- */

function pageCompany(c) {
  const others = ALL_COMPANIES.filter(x => x.slug !== c.slug);

  const products = c.products && c.products.length
    ? `<section class="section stone" aria-labelledby="prodTitle">
  <div class="wrap">
    ${head2('prodTitle', 'What we trade <span class="soft">today</span>', '')}
    <div class="prodgrid">
${c.products.map(p => `      <article class="prod">
        <span class="prod-pic">${pic(p.img, '(max-width:520px) 90vw, (max-width:820px) 44vw, (max-width:1100px) 29vw, 290px', `alt="${esc(p.t)}" loading="lazy"`)}</span>
        <h3>${esc(p.t)}</h3>
        <p>${esc(p.d)}</p>
${p.origins ? `        <p class="prod-from"><span>Sourced from</span>${p.origins.map(o =>
    `<a href="/sectors/trading/#markets">${esc(o)}</a>`).join('')}</p>` : ''}
      </article>`).join('\n')}
    </div>
  </div>
</section>

`
    : '';

  /* A company with no product list still has to say what it does. These are
     the named services, spelled out. */
  const services = c.services && c.services.length
    ? `<section class="section stone" aria-labelledby="svcTitle">
  <div class="wrap">
    ${head2('svcTitle', 'What we <span class="soft">do</span>', `The work ${esc(c.name)} is actually asked for.`)}
    <div class="svcs">
${c.services.map((s, i) => `      <div class="svc rise d${Math.min(i, 3)}">
        <span class="svc-n">${num(i)}</span>
        <h3>${esc(s.t)}</h3>
        <p>${esc(s.d)}</p>
      </div>`).join('\n')}
    </div>
  </div>
</section>

`
    : '';

  const activities = c.activities && c.activities.length
    ? `<section class="section tight" aria-labelledby="actTitle">
  <div class="wrap">
    ${head2('actTitle', 'What this company <span class="soft">handles</span>', '')}
    <ul class="tags rise">
${c.activities.map(a => `      <li>${esc(a)}</li>`).join('\n')}
    </ul>
  </div>
</section>

`
    : '';

  return head({
    title: `${c.name} · ${SITE.name}`, desc: c.short,
    url: `/companies/${c.slug}/`, image: c.hero,
    schema: graph(companySchema(c), crumbs([
      { name: 'Our Sectors', url: '/sectors/' },
      { name: c.sectorName, url: '/sectors/' + c.sectorSlug + '/' },
      { name: c.name }
    ]))
  })
    + header(`/sectors/${c.sectorSlug}/`)
    + pageHead({
      /* the sector above this company is a place you can go */
      eyebrow: c.sectorName, eyebrowHref: `/sectors/${c.sectorSlug}/`,
      h1: c.name,
      lede: c.headline,
      photo: c.hero,
      action: { href: `/contact/?company=${c.slug}`, label: 'Contact us' }
    })
    + `<section class="section tight">
  <div class="wrap">
    <p class="lead-para rise">${esc(c.intro)}</p>
    <div class="cosplit">
      <figure class="costill rise">
        ${pic(c.still, '(max-width:860px) 100vw, 590px', `alt="${esc(c.name)}"`)}
      </figure>
      <div class="prose rise d1">
${c.body.map(p => `        <p>${esc(p)}</p>`).join('\n')}
      </div>
    </div>
    <dl class="factstrip rise">
${c.facts.map(f => `      <div><dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd></div>`).join('\n')}
    </dl>
    <p class="after rise"><a class="btn btn-dark" href="/contact/?company=${c.slug}">${esc(c.cta)}</a></p>
  </div>
</section>

${products}${services}${activities}<section class="section tight" aria-labelledby="othTitle">
  <div class="wrap">
    ${head2('othTitle', 'The other <span class="soft">companies</span>', '')}
    ${companyRail(others)}
  </div>
</section>

`
    + ctaBand()
    + footer();
}

/* ---------- the sectors ---------------------------------------------------- */

/* Built to the Figma (node 200:360). A numbered index of the four sectors
   stands at the left and stays there while the page moves, marking whichever
   sector you are reading; the sector itself runs down the right as a heading,
   its line, its argument, the businesses inside it and a photograph. Four is
   few enough to show the whole list at once, so the index answers "where am I
   and what else is there" without anybody having to scroll to find out. */
function pageSectorsIndex() {
  return head({
    title: `Our Sectors · ${SITE.name}`,
    desc: 'Lusail Corp operates across commodity trading, food supply and distribution, consumer services and hospitality.',
    url: '/sectors/', image: 'skyline-tall',
    schema: graph(crumbs([{ name: 'Our Sectors' }]), {
      '@type': 'ItemList', name: 'Lusail Corp sectors',
      itemListElement: SECTORS.map((s, i) => ({
        '@type': 'ListItem', position: i + 1, name: s.name, url: abs('/sectors/' + s.slug + '/')
      }))
    })
  })
    + header('/sectors/')
    + pageHead({
      eyebrow: 'Our Sectors',
      h1: 'Four markets, one way of working.',
      lede: 'The Group operates across commodity trading, food supply and distribution, everyday consumer services and hospitality. The sectors are deliberately broad: they describe where we are now and leave room for what comes next.',
      /* the Group, not one of its sectors — the trading photograph is the
         first band on this same page, and a page should not open on it */
      photo: 'skyline-tall'
    })
    + `<div class="secidx">
  <nav class="secrail" aria-label="The sectors on this page">
    <ol>
${SECTORS.map((s, i) => `      <li><a href="#sec-${s.slug}"${i === 0 ? ' aria-current="location"' : ''}>
        <span class="secrail-n">${i + 1}.</span>
        <span class="secrail-t">${esc(s.name)}</span>
        <span class="secrail-go" aria-hidden="true">&#8627;</span>
      </a></li>`).join('\n')}
    </ol>
  </nav>

${SECTORS.map((s, i) => `  <section class="secblk" data-tone="${i % 4}" id="sec-${s.slug}" aria-labelledby="h-${s.slug}">
    <div class="secblk-col rise">
      <h2 id="h-${s.slug}"><a href="/sectors/${s.slug}/">${esc(s.name)}</a></h2>
      <p class="secblk-lede">${esc(s.intro)}</p>
${s.body.map(p => `      <p class="secblk-say">${esc(p)}</p>`).join(String.fromCharCode(10))}

      <h3 class="secblk-count">${esc(plural(s.companies.length, 'company', 'companies'))} in this sector</h3>
      <div class="cotiles">
${s.companies.map(c => `        <a class="cotile" href="/companies/${c.slug}/">${esc(c.name)}</a>`).join(String.fromCharCode(10))}
      </div>

      <p class="secblk-more"><a href="/sectors/${s.slug}/">More on ${esc(s.name)} <span aria-hidden="true">&#8594;</span></a></p>
    </div>
  </section>`).join(String.fromCharCode(10) + String.fromCharCode(10))}
</div>

`
    + ctaBand()
    + footer();
}

/* ---------- one sector --------------------------------------------------- */

/* A sector page says what the Group does in that market and hands over to the
   companies that do it. It is short on purpose: the detail belongs on the
   company pages, and repeating it here would only make two pages that say the
   same thing in a different order. */
function pageSector(s) {
  const n = s.companies.length;
  const others = SECTORS.filter(x => x.slug !== s.slug);

  return head({
    title: `${s.name} · ${SITE.name}`, desc: s.short,
    url: `/sectors/${s.slug}/`, image: s.hero,
    schema: graph(crumbs([{ name: 'Our Sectors', url: '/sectors/' }, { name: s.name }]), {
      '@type': 'ItemList', name: s.name + ' — companies',
      itemListElement: s.companies.map((c, i) => ({
        '@type': 'ListItem', position: i + 1, name: c.name, url: abs('/companies/' + c.slug + '/')
      }))
    })
  })
    + header(`/sectors/${s.slug}/`)
    + pageHead({
      eyebrow: 'Our Sectors',
      eyebrowHref: '/sectors/',
      h1: s.name,
      lede: s.headline + ' — ' + s.intro,
      photo: s.hero
    })
    + `<section class="section tight">
  <div class="wrap">
    <div class="head2 rise">
      <h2 id="secTitle">What the Group does <span class="soft">here</span></h2>
      <p>${esc(s.short)}</p>
    </div>
    <div class="prose2 rise">
${s.body.map(p => `      <p>${esc(p)}</p>`).join('\n')}
    </div>
  </div>
</section>

${s.slug === 'trading' ? `<section class="section stone src" aria-labelledby="mktTitle">
  <div class="wrap">
    ${head2('mktTitle', 'The markets we <span class="soft">source from</span>', 'Not every commodity comes from every country. The origin is chosen per product — by season, quality, availability and the terms of the transaction.')}
    ${reachList()}
  </div>
</section>

` : ''}
<section class="section stone" aria-labelledby="coTitle">
  <div class="wrap">
    ${head2('coTitle', `The ${n === 1 ? 'company' : 'companies'} working <span class="soft">here</span>`,
    n === 1 ? 'One business, with its own market and its own customers.'
      : `${n} businesses, each with its own market and its own customers.`)}
    ${companyRail(s.companies.map(c => Object.assign({}, c, { sectorName: s.name })))}
  </div>
</section>

<section class="section tight" aria-labelledby="othTitle">
  <div class="wrap">
    ${head2('othTitle', 'The other <span class="soft">sectors</span>', '')}
    <div class="othsecs rise">
${others.map(x => `      <a class="othsec" href="/sectors/${x.slug}/">
        ${icon(SECTOR_ICON[x.slug] || 'markets')}
        <span class="othsec-id">
          <b>${esc(x.name)}</b>
          <em>${esc(x.short)}</em>
        </span>
        <span class="othsec-go" aria-hidden="true">&#8594;</span>
      </a>`).join('\n')}
    </div>
  </div>
</section>

`
    + ctaBand()
    + footer();
}

/* ---------- work with us -------------------------------------------------- */

/* The Group buys, sells and ships for a living, so the people it most needs
   to hear from are suppliers, producers and buyers. This page says who they
   are and hands each of them to the right desk through the contact form.

   It is deliberately not a careers page. There are no vacancies to list, and
   a careers page with nothing on it reads as a company that is not hiring
   rather than one that is growing. Speculative applications still have a
   route: "Careers" is one of the options on the contact form. */
function pagePartnerships() {
  return head({
    title: `Work With Us · ${SITE.name}`,
    desc: 'Lusail Corp works with suppliers, producers, distributors and buyers in Qatar and international markets.',
    url: '/partnerships/', image: 'why-group',
    schema: graph(crumbs([{ name: 'Work With Us' }]))
  })
    + header('/partnerships/')
    + pageHead({
      eyebrow: 'Work With Us',
      h1: 'Most of what we do starts with someone else.',
      lede: 'We buy from producers, sell to distributors, and move goods for both. If you are one of them, this is the page that says so.',
      photo: 'why-group',
      action: { href: '/contact/', label: 'Send an enquiry' }
    })
    + `<section class="section tight" aria-labelledby="pwTitle">
  <div class="wrap">
    ${head2('pwTitle', 'Who we want to <span class="soft">hear from</span>', 'Our companies depend on relationships across their markets. These are the ones we are looking for.')}
    <div class="plines">
${PARTNER_TYPES.map(p => `      <div class="pline rise">
        <h3>${esc(p.t)}</h3>
        <p>${esc(p.d)}</p>
      </div>`).join('\n')}
    </div>
  </div>
</section>

<section class="section stone" aria-labelledby="howTitle">
  <div class="wrap">
    ${head2('howTitle', 'How it <span class="soft">works</span>', '')}
    <div class="vcreate">
      <div class="vc rise">
        ${icon('target')}
        <h3>Tell us which you are</h3>
        <p>The enquiry form asks for an area of interest. That is what routes your message — it is not a formality.</p>
      </div>
      <div class="vc rise d1">
        ${icon('partnership')}
        <h3>It reaches the right desk</h3>
        <p>A supplier enquiry goes to the company that would buy from you, not to a general inbox that forwards it on.</p>
      </div>
      <div class="vc rise d2">
        ${icon('cycle')}
        <h3>We answer with specifics</h3>
        <p>Where it is a commodity, that means the origin, the specification and the route together, because we hold the trading and the freight in one business.</p>
      </div>
    </div>
    <p class="after rise"><a class="btn btn-dark" href="/contact/">Start a conversation</a></p>
  </div>
</section>

<section class="section tight" aria-labelledby="growTitle">
  <div class="wrap">
    ${head2('growTitle', 'What we are looking to <span class="soft">do next</span>', 'This is the page where that list belongs, so it is the page it is on.')}
    <ul class="nexts rise">
${GROWTH.map(g => `      <li>${BULLET}<span>${esc(g.t)}</span></li>`).join(String.fromCharCode(10))}
    </ul>
  </div>
</section>

`
    + ctaBand()
    + footer();
}

/* ---------- contact ------------------------------------------------------ */

/* Where the pin goes on the contact page. Supplied by the client; replace
   these two numbers when the registered address is confirmed. The map is an
   OpenStreetMap frame, so it needs no key and no tracking script. */

function pageContact() {
  /* The dropdown is built from the same list api/contact.js validates
     against, so a new company appears in both at once. */
  const areas = [
    { v: 'general', t: 'General enquiry' },
    ...ALL_COMPANIES.map(c => ({ v: c.slug, t: c.name })),
    { v: 'supplier', t: 'Supplier opportunity' },
    { v: 'partnership', t: 'Business partnership' },
    { v: 'careers', t: 'Careers' },
    { v: 'other', t: 'Other' }
  ];

  return head({
    title: `Contact · ${SITE.name}`,
    desc: 'Contact Lusail Corp about our companies, supply, commercial opportunities or careers.',
    url: '/contact/', image: 'hero-contact',
    schema: graph({ '@type': 'ContactPage', url: abs('/contact/'),
      name: 'Contact ' + SITE.name, mainEntity: { '@id': ORG_ID } },
      crumbs([{ name: 'Contact' }]))
  })
    + header('/contact/')
    + pageHead({
      eyebrow: 'Contact',
      h1: 'Let’s connect.',
      lede: 'Whether you want to work with one of our companies, supply them, propose something commercial, or just understand the Group better — this reaches us.',
      photo: 'hero-contact'
    })
    + `<section class="section tight">
  <div class="wrap cosplit">
    <div class="rise">
      <h2 class="h3">Get in touch</h2>
      <dl class="channels">
        <div><dt>Email</dt><dd><a href="mailto:${SITE.contact.email}">${esc(SITE.contact.email)}</a></dd></div>
        <div><dt>Phone</dt><dd><a href="tel:${SITE.contact.phone.replace(/\s/g, '')}">${esc(SITE.contact.phone)}</a></dd></div>
        <div><dt>Location</dt><dd>${esc(SITE.contact.location)}</dd></div>
        <div><dt>Routing</dt><dd>Pick an area of interest and the message goes to the desk that can answer it.</dd></div>
      </dl>
    </div>
    <form id="form" class="rise d1" novalidate data-mail="${SITE.contact.email}">
      <div class="hp" aria-hidden="true">
        <label for="fSite">Website</label>
        <input id="fSite" name="website" type="text" tabindex="-1" autocomplete="off">
      </div>
      <div class="field"><label for="fName">Full name</label><input id="fName" name="name" autocomplete="name" required aria-describedby="fName-err"><span class="field-err" id="fName-err"></span></div>
      <div class="field"><label for="fCompany">Company</label><input id="fCompany" name="company" autocomplete="organization"></div>
      <div class="field"><label for="fMail">Email address</label><input id="fMail" name="email" type="email" autocomplete="email" required aria-describedby="fMail-err"><span class="field-err" id="fMail-err"></span></div>
      <div class="field"><label for="fPhone">Phone number</label><input id="fPhone" name="phone" type="tel" autocomplete="tel"></div>
      <div class="field full"><label for="fArea">Area of interest</label>
        <select id="fArea" name="area">
${areas.map(a => `          <option value="${a.v}">${esc(a.t)}</option>`).join('\n')}
        </select></div>
      <div class="field full"><label for="fMsg">Message</label><textarea id="fMsg" name="message" required aria-describedby="fMsg-err"></textarea><span class="field-err" id="fMsg-err"></span></div>
      <div class="form-end">
        <button class="btn btn-dark" type="submit">Send enquiry</button>
        <span class="status" id="status" role="status"></span>
      </div>
    </form>
  </div>
</section>

`
    + footer();
}

function page404() {
  return head({ title: `Page not found · ${SITE.name}`, desc: 'That page does not exist.',
    url: '/404.html', noindex: true })
    + header('')
    + pageHead({
      eyebrow: '404',
      h1: 'That page does not exist.',
      lede: 'The link may have changed. Try the portfolio, or go back to the home page.',
      photo: 'hero-contact'
    })
    + `<section class="section tight">
  <div class="wrap">
    <div class="hero-cta">
      <a class="btn btn-dark" href="/">Home</a>
      <a class="btn btn-line" href="/sectors/">Our sectors</a>
    </div>
  </div>
</section>
`
    + footer();
}

/* ---------- write ------------------------------------------------------ */

function write(rel, html) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log('  ' + String(Math.round(html.length / 1024)).padStart(4) + ' KB  ' + rel);
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const s = path.join(from, e.name), d = path.join(to, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

/* Which photographs the site actually asks for — read out of the pages that
   have just been written, not from a list kept by hand beside them. A list
   drifts: add an image to a page, forget to register it, and the build
   happily ships a page pointing at a file it never copied. Reading the
   markup cannot drift, because it is the same markup the browser gets. */
/* The names a generated page asks for under a given path. The check is
   against what the browser will really request, so there is no list to keep
   in step and nothing unreachable gets deployed. */
function usedFrom(re) {
  const want = new Set();
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    if (!e.name.endsWith('.html')) return;
    for (const m of fs.readFileSync(p, 'utf8').matchAll(re)) want.add(m[1]);
  });
  walk(OUT);
  return want;
}

function copyNamed(from, to, names) {
  fs.mkdirSync(to, { recursive: true });
  const missing = [];
  for (const n of names) {
    const src = path.join(from, n);
    if (!fs.existsSync(src)) { missing.push(n); continue; }
    fs.copyFileSync(src, path.join(to, n));
  }
  if (missing.length) {
    console.error('\n  missing in ' + path.relative(ROOT, from) + ':\n    ' + missing.join('\n    ') + '\n');
    process.exit(1);
  }
}

function usedImages() {
  const want = new Set();
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    if (!e.name.endsWith('.html')) return;
    const html = fs.readFileSync(p, 'utf8');
    for (const m of html.matchAll(/\/assets\/img\/((?:derived\/)?[A-Za-z0-9._-]+)\.jpg/g)) want.add(m[1]);
  });
  walk(OUT);

  /* Checked against the files on disk rather than a list kept by hand, so a
     page cannot ask for a size nobody made. A missing derivative means
     build/variants.js has not been run since a photograph changed. */
  const have = new Set();
  for (const f of fs.readdirSync(path.join(ROOT, 'site-assets/img'))) {
    if (f.endsWith('.jpg')) have.add(f.slice(0, -4));
  }
  if (fs.existsSync(DERIVED)) {
    for (const f of fs.readdirSync(DERIVED)) {
      if (f.endsWith('.jpg')) have.add('derived/' + f.slice(0, -4));
    }
  }
  const missing = [...want].filter(v => v && !have.has(v));
  if (missing.length) {
    console.error('\n  missing images in site-assets/img:\n    ' + missing.join('\n    ') +
      (missing.some(m => m.startsWith('derived/')) ? '\n\n  Run `npm run images`.' : '') + '\n');
    process.exit(1);
  }

  /* Two pages showing the identical photograph reads as a mistake, and it is
     hard to spot by eye once the names differ. Compare the bytes. */
  const seen = new Map();
  for (const name of [...want].sort()) {
    if (name.startsWith('derived/')) continue;   // same picture by design
    const sum = require('crypto').createHash('sha1')
      .update(fs.readFileSync(path.join(ROOT, 'site-assets/img', name + '.jpg'))).digest('hex');
    if (seen.has(sum)) {
      console.error(`\n  ${name}.jpg and ${seen.get(sum)}.jpg are the same picture.` +
        '\n  Give one of them its own photograph, or point both at one name.\n');
      process.exit(1);
    }
    seen.set(sum, name);
  }
  return want;
}

function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  console.log('pages');
  write('index.html', pageHome());
  write('about/index.html', pageAbout());
  // one page per company, from the flat list, so a company listed in two
  // sectors is still written exactly once
  ALL_COMPANIES.forEach(c => write(`companies/${c.slug}/index.html`, pageCompany(c)));
  write('sectors/index.html', pageSectorsIndex());
  SECTORS.forEach(s => write(`sectors/${s.slug}/index.html`, pageSector(s)));
  write('partnerships/index.html', pagePartnerships());
  write('contact/index.html', pageContact());
  write('404.html', page404());

  /* the pages exist now, so the photographs they ask for can be read off
     them rather than guessed at */
  const images = usedImages();

  console.log('assets');
  copyDir(path.join(ROOT, 'assets/css'), path.join(OUT, 'assets/css'));
  copyDir(path.join(ROOT, 'assets/js'), path.join(OUT, 'assets/js'));
  /* Only the lockups a page actually asks for. The kit holds twenty-one
     files — five wordmarks, six marks, five horizontals and the icons — and
     deploying all of them put 197 KB of unreachable SVG on the server and
     made the directory look like a description of the site, which it is not.
     Read out of the written HTML, like the photographs. */
  copyNamed(path.join(ROOT, 'site-assets/logo'), path.join(OUT, 'assets/logo'),
    usedFrom(/\/assets\/logo\/([A-Za-z0-9._-]+)/g));
  copyDir(path.join(ROOT, 'site-assets/font'), path.join(OUT, 'assets/font'));

  /* the dotted map, written once as a cacheable file rather than inlined
     into the page that uses it */
  const map = dotGrid(MAP_BOX);
  const mapSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${MAP_BOX.width} ${MAP_BOX.height}" width="${MAP_BOX.width}" height="${MAP_BOX.height}" role="img" aria-label="World map"><path d="${map.d}" fill="none" stroke="#3a3838" stroke-width="2.3" stroke-linecap="round"/></svg>`;

  const imgOut = path.join(OUT, 'assets/img');
  fs.mkdirSync(path.join(imgOut, 'derived'), { recursive: true });
  let bytes = 0, full = 0, cut = 0;
  for (const name of images) {
    const from = path.join(IMG_DIR, name + '.jpg');
    fs.copyFileSync(from, path.join(imgOut, name + '.jpg'));
    bytes += fs.statSync(from).size;
    if (name.startsWith('derived/')) cut++; else full++;
  }
  fs.writeFileSync(path.join(imgOut, 'worldmap.svg'), mapSvg);
  console.log(`  ${full} photographs in ${cut} sizes (${Math.round(bytes / 1024)} KB) + worldmap.svg (${Math.round(mapSvg.length / 1024)} KB)`);

  const urls = ['/', '/about/', ...ALL_COMPANIES.map(c => `/companies/${c.slug}/`),
    '/sectors/', ...SECTORS.map(s => `/sectors/${s.slug}/`), '/partnerships/', '/contact/'];
  const today = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(OUT, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE.domain}/sitemap.xml\n`);
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url><loc>${SITE.domain}${u}</loc><lastmod>${today}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`);

  console.log('  robots.txt, sitemap.xml (' + urls.length + ' urls)');
  console.log(`done -> dist/  (${urls.length + 1} pages, ${ALL_COMPANIES.length} companies)`);
}

build();
