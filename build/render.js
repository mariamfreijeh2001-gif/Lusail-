/* ==========================================================================
   Lusail Corp — static site generator.

   Reads /data/site.js, writes finished HTML into /dist. No dependencies.
   Run with:  npm run build

   PAGES
     /                     home
     /about/               the Group: what it is, what it believes, who it
                           wants to hear from
     /companies/           the portfolio, filterable by sector
     /companies/<slug>/    one company
     /careers/             working here
     /contact/             channels and the enquiry form
     /404.html

   A sector has no page of its own. There are four sectors and four
   companies, so a sector page would have said what its company page already
   says. Sectors survive as a heading and a filter: /companies/?sector=trading
   is where "Trading & Commodities" goes, and vercel.json redirects the old
   /sectors/ URLs there.

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
  PARTNER_TYPES, CAREER_VALUES, OPEN_ROLES
} = require('../data/site.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'dist');

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
  // a spark: founders and new concepts
  spark: '<path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5M5.2 5.2l3.5 3.5M15.3 15.3l3.5 3.5M18.8 5.2l-3.5 3.5M8.7 15.3l-3.5 3.5"/><circle cx="12" cy="12" r="2.6"/>'
};
const icon = name => ICON_PATHS[name]
  ? `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON_PATHS[name]}</svg>`
  : '';

const BULLET = `<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="currentColor" fill-opacity=".5"><path d="M4 8L8 4L12 8L8 12L4 8Z"/><path d="M8 2a6 6 0 1 1 0 12A6 6 0 0 1 8 2Zm0-1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Z"/></svg>`;
const CARET = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill-rule="evenodd" clip-rule="evenodd" d="M16.53 8.97a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06L12 12.44l3.47-3.47a.75.75 0 0 1 1.06 0Z"/></svg>`;
const BURGER = `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 7h18M3 12h18M3 17h18"/></svg>`;
const CHEV = `<svg viewBox="0 0 18 18" aria-hidden="true" focusable="false"><path d="M4 7l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;

/* ---------- chrome ----------------------------------------------------- */

function head({ title, desc, url, image }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#181717">
<link rel="canonical" href="${SITE.domain}${url}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE.domain}${url}">
${image ? `<meta property="og:image" content="${SITE.domain}/assets/img/${image}.jpg">` : ''}
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="/assets/logo/${B.faviconSvg}" type="image/svg+xml">
<link rel="icon" href="/assets/logo/${B.faviconIco}" sizes="any">
<link rel="apple-touch-icon" href="/assets/logo/${B.appleTouch}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Inter:wght@500;600&family=Space+Grotesk:wght@500&family=Playfair+Display:ital,wght@1,600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/site.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
`;
}

/* The bar carries four links and one action. "Sectors" opens a panel rather
   than a page: each sector goes to the portfolio filtered to it, and the
   companies inside it go straight to their own pages. */
const NAV = [
  ['Home', '/'],
  ['Sectors', '/companies/'],
  ['About Us', '/about/'],
  ['Join Us', '/careers/']
];

function sectorsPanel() {
  return `      <div class="secmenu" id="secmenu">
${SECTORS.map(s => `        <div class="secmenu-col">
          <a class="secmenu-head" href="/companies/?sector=${s.slug}">${esc(s.name)}</a>
${s.companies.map(c => `          <a class="secmenu-co" href="/companies/${c.slug}/">${esc(c.name)}</a>`).join('\n')}
        </div>`).join('\n')}
      </div>`;
}

/* overHero: the home page opens on a photograph that runs under the bar, so
   the bar starts transparent over it and fills as the page moves. Every other
   page puts its photograph below a solid bar, as they are drawn. */
function header(current, overHero) {
  const link = ([label, href]) => {
    const here = href === current ? ' aria-current="page"' : '';
    return label === 'Sectors'
      ? `      <div class="navwrap" id="navwrap">
        <button class="nav-btn" type="button" id="secBtn" aria-expanded="false" aria-controls="secmenu">
          Sectors${CARET}
        </button>
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
<div class="menu" id="menu">
  <a href="/">Home</a>
  <a href="/companies/">Portfolio</a>
${SECTORS.map(s => `  <a class="sub" href="/companies/?sector=${s.slug}">${esc(s.name)}</a>`).join('\n')}
  <a href="/about/">About Us</a>
  <a href="/careers/">Join Us</a>
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
          <h2>Sectors</h2>
          <ul>
${SECTORS.map(s => `            <li><a href="/companies/?sector=${s.slug}">${esc(s.name)}</a></li>`).join('\n')}
          </ul>
        </div>
        <div class="foot-col">
          <h2>Contact</h2>
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
function pageHead({ eyebrow, h1, lede, photo, action }) {
  return `<section class="pagehead">
  <img class="pagehead-bg" src="/assets/img/${photo}.jpg" alt="" width="1600" height="1066" fetchpriority="high">
  <div class="wrap">
    <span class="pagehead-eyebrow">${esc(eyebrow)}</span>
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
        <span class="cocard-shot"><img src="/assets/img/${c.hero}.jpg" alt="" width="640" height="480" loading="lazy"></span>
        <span class="cocard-body">
          <span class="cocard-sector">${esc(c.sectorName)}</span>
          <span class="cocard-name">${esc(c.name)}</span>
          <span class="cocard-role">${esc(c.role)}</span>
        </span>
      </a>`;
}

function companyRail(list, id) {
  return `<div class="corail"${id ? ` id="${id}"` : ''}>
${list.map(coCard).join('\n')}
    </div>`;
}

/* The closing card: the picture runs the width, the carbon panel sits over
   its right two thirds, and the list of what comes next fills the floor. */
function ctaBand() {
  return `<section class="next">
  <div class="wrap">
    <div class="next-frame rise">
      <img class="next-bg" src="/assets/img/cta-towers.jpg" alt="" width="800" height="1200" loading="lazy">
      <div class="next-card">
        <img class="watermark" src="/assets/logo/${B.markOnLight}" alt="" width="270" height="350" aria-hidden="true" loading="lazy">
        <div class="next-say">
          <h2>What&rsquo;s Next for Lusail Corp?</h2>
          <p>Our story is being built one business, one partnership and one opportunity at a time.</p>
          <div class="next-act">
            <a class="btn btn-light" href="/companies/">Explore our companies</a>
            <a class="btn btn-ghost" href="/contact/">Talk to us</a>
          </div>
        </div>
        <ul class="nexts">
${GROWTH.map(g => `          <li>${BULLET}<span>${esc(g.t)}</span></li>`).join('\n')}
        </ul>
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
  const map = dotGrid(MAP_BOX);

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
    return { r, x, y, px: x * SCALE, py: y * SCALE, w: r.t.length * 7.6 + 26, lane: 0 };
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

  const pins = placed.map(p => `      <button class="pin" type="button" data-region="${esc(p.r.t)}"
        style="left:${(p.x / MAP_BOX.width * 100).toFixed(2)}%;top:${(p.y / MAP_BOX.height * 100).toFixed(2)}%;--stem:${STEM_0 + p.lane * LANE}px">
        <span class="pin-lab">
          <span class="pin-nm">${esc(p.r.t)}</span>
          <span class="pin-co"><span>${esc(p.r.d)}</span></span>
        </span>
        <span class="pin-stem" aria-hidden="true"></span>
        <span class="pin-dot" aria-hidden="true"></span>
      </button>`).join('\n');

  return `<div class="mapwrap" id="mapwrap">
      <svg viewBox="0 0 ${MAP_BOX.width} ${MAP_BOX.height}" role="img"
           aria-label="A world map marking the regions Lusail Corp sources from">
        <path class="dots" d="${map.d}"/>
      </svg>
${pins}
    </div>`;
}

/* The same markets again, as a register that can be read straight down. */
function reachList() {
  return `<div class="reg">
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
  const card = (x, i) => `        <button class="bcard${i === 0 ? ' bcard-photo' : ''}" type="button" aria-expanded="${i === 0}">
${i === 0 ? '          <img src="/assets/img/why-group.jpg" alt="" width="1000" height="561" loading="lazy">\n' : ''}          <span class="n">${num(i)}</span>
          <h3>${esc(x.t)}</h3>
          ${i === 0
    ? `<p>${esc(x.d)}</p>`
    : `<span class="say"><div><p>${esc(x.d)}</p></div></span>`}
        </button>`;

  return `<div class="bento">
${card(WHY[0], 0)}
      <div class="bento-col">
${WHY.slice(1).map((x, i) => card(x, i + 1)).join('\n')}
      </div>
    </div>`;
}

/* One panel open at a time, widening to carry its paragraph while the rest
   hold their number and their name. */
function ladder() {
  return `<div class="ladder" id="ladder">
${WHAT_WE_DO.map((w, i) => `      <button class="lad" type="button" aria-expanded="${i === 0}">
        <span class="n">${num(i)}</span>
        <span class="lad-b">
          <h3>${esc(w.t)}</h3>
          <p>${esc(w.d)}</p>
        </span>
      </button>`).join('\n')}
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
  /* A figure with no value of its own counts the portfolio. */
  const stats = FIGURES.map(f => [f.k, f.v == null ? String(ALL_COMPANIES.length) : f.v]);

  return head({
    title: `${SITE.name} · ${SITE.tagline}`,
    desc: 'Lusail Corp is a Qatar-based diversified corporate group building and supporting businesses across commodity trading, food supply and distribution, consumer services and hospitality.',
    url: '/', image: 'hero-doha'
  })
    + header('/', true)
    + `<section class="hero">
  <img class="hero-bg" src="/assets/img/hero-doha.jpg" alt="" width="1585" height="992" fetchpriority="high">
  <div class="wrap">
    <div class="hero-say">
      <h1>Building Businesses. Creating <em>Value</em>.</h1>
      <p class="hero-lede">Lusail Corp is a Qatar-based diversified corporate group building, operating and supporting businesses across multiple sectors.</p>
    </div>
    <div class="hero-cta">
      <a class="btn btn-light" href="/companies/">Explore our companies</a>
      <a class="btn btn-ghost" href="/about/">Discover Lusail Corp</a>
    </div>
  </div>
</section>

<section class="section intro" aria-labelledby="introTitle">
  <div class="wrap">
    <div class="intro-top rise">
      <h2 id="introTitle">One Group.<br>Multiple <span class="soft">Businesses.</span><br>Shared Ambition.</h2>
      <div class="intro-note">
        <img src="/assets/logo/${B.markOnLight}" alt="" width="44" height="57" loading="lazy">
        <div>
          <p>Our role goes beyond ownership. We provide strategic direction, commercial support and a shared platform from which our companies strengthen their operations, develop their markets and pursue new opportunities.</p>
          <p>Today it spans commodity trading, food supply and distribution, consumer services and hospitality.</p>
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
      <p>Our portfolio reflects our belief that opportunities can exist across different industries, so we build businesses where we see strong commercial potential.</p>
    </div>
    <div class="seccards">
${SECTORS.map((s, i) => `      <a class="seccard rise d${Math.min(i, 3)}" href="/companies/?sector=${s.slug}">
        <img src="/assets/img/${SECTOR_SHOT[s.slug] || 'card-trading'}.jpg" alt="" width="640" height="914" loading="lazy">
        <span class="seccard-cap">
          <b>${esc(s.name)}</b>
          <span>View</span>
        </span>
      </a>`).join('\n')}
    </div>
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
    ${ladder()}
  </div>
</section>

`
    + ctaBand()
    + footer();
}

/* ---------- about ------------------------------------------------------- */

/* Six values, one open at a time, with a photograph holding the column
   beside them. */
function valueList() {
  return `<div class="valacc" id="valacc">
${VALUES.map((v, i) => `      <div class="val${i === 0 ? ' open' : ''}">
        <button class="val-btn" type="button" aria-expanded="${i === 0}" aria-controls="val${i}">
          <span class="val-n">${num(i)}</span>
          <span class="val-t">${esc(v.t)}</span>
          ${CHEV}
        </button>
        <div class="val-panel" id="val${i}"><div><p>${esc(v.d)}</p></div></div>
      </div>`).join('\n')}
    </div>`;
}

function pageAbout() {
  return head({
    title: `About Us · ${SITE.name}`,
    desc: 'Lusail Corp is a diversified corporate group registered in the State of Qatar, bringing together businesses across commodity trading, food supply, consumer services and hospitality.',
    url: '/about/', image: 'hero-about'
  })
    + header('/about/')
    + pageHead({
      eyebrow: 'About Us',
      h1: 'Building a Group for the Future.',
      lede: 'Lusail Corp is a diversified corporate group registered in the State of Qatar, bringing together businesses across consumer services, food and beverage, commercial distribution and international trade.',
      photo: 'hero-about'
    })
    + `<section class="section tight" aria-labelledby="whoTitle">
  <div class="wrap">
    <div class="head2 rise">
      <h2 id="whoTitle">A Platform for Business Growth</h2>
      <p>Four companies, one set of standards, and a shared platform underneath them.</p>
    </div>
    <div class="prose2 rise">
      <p>Lusail Corp was established to create, develop and support businesses with the potential to grow. Our companies operate independently in their own markets while sharing the Group&rsquo;s direction and capabilities.</p>
      <p>That structure lets each business keep its own identity, customers and commercial focus, and still draw on relationships and knowledge built elsewhere in the Group. As Lusail Corp develops, further businesses and sectors will join the portfolio.</p>
    </div>
    <figure class="wideshot rise">
      <img src="/assets/img/about-platform.jpg" alt="The Group at work" width="900" height="600" loading="lazy">
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
    ${head2('valTitle', 'The values that <span class="soft">guide us</span>', 'The businesses we own are varied. The way they are run is not.')}
    <div class="valwrap">
      ${valueList()}
      <figure class="valshot rise">
        <img src="/assets/img/card-trading.jpg" alt="" width="640" height="914" loading="lazy">
      </figure>
    </div>
  </div>
</section>

<section class="section stone" aria-labelledby="vcTitle">
  <div class="wrap">
    ${head2('vcTitle', 'How We <span class="soft">Create Value</span>', 'Growth is not adding companies to a list. It is making each one better than it was.')}
    <div class="vcreate">
${VALUE_CREATION.map((v, i) => `      <div class="vc rise d${Math.min(i, 3)}">
        <span class="vc-n">${num(i)}</span>
        <h3>${esc(v.t)}</h3>
        <p>${esc(v.d)}</p>
      </div>`).join('\n')}
    </div>
  </div>
</section>

<section class="section" id="work-with-us" aria-labelledby="pwTitle">
  <div class="wrap">
    ${head2('pwTitle', 'Who we want to <span class="soft">hear from</span>', 'Our companies depend on relationships across their markets. These are the ones we are looking for.')}
    <div class="plines">
${PARTNER_TYPES.map(p => `      <div class="pline rise">
        <h3>${esc(p.t)}</h3>
        <p>${esc(p.d)}</p>
      </div>`).join('\n')}
    </div>
    <p class="after rise"><a class="btn btn-dark" href="/contact/">Start a conversation</a></p>
  </div>
</section>

`
    + ctaBand()
    + footer();
}

/* ---------- the portfolio ----------------------------------------------- */

function pageCompaniesIndex() {
  const chips = [
    `      <button type="button" class="chip" data-filter="all" aria-pressed="true">All <em>${ALL_COMPANIES.length}</em></button>`,
    ...SECTORS.filter(s => s.companies.length).map(s =>
      `      <button type="button" class="chip" data-filter="${s.slug}" data-label="${esc(s.name)}" aria-pressed="false">${esc(s.name)} <em>${s.companies.length}</em></button>`)
  ].join('\n');

  return head({
    title: `Our Companies · ${SITE.name}`,
    desc: 'The Lusail Corp portfolio: Lusail Commercial, ROMA Commercial, Cavallo Laundry and Nero Café.',
    url: '/companies/', image: 'card-trading'
  })
    + header('/companies/')
    + pageHead({
      eyebrow: 'Our Companies',
      h1: 'Four businesses, one group.',
      lede: 'Each company runs in its own market with its own customers. What they share is the platform underneath them.',
      photo: 'hero-lusail-commercial'
    })
    + `<section class="section tight">
  <div class="wrap">
    <div class="filters" role="group" aria-label="Filter companies by sector">
${chips}
    </div>
    <span class="count" id="count" role="status">Showing all ${ALL_COMPANIES.length} companies</span>
    ${companyRail(ALL_COMPANIES, 'coGrid')}
    <p class="empty" id="empty" hidden>No companies in that sector.</p>
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
    <div class="prodrail" id="prodrail">
${c.products.map(p => `      <article class="prod">
        <img src="/assets/img/${p.img}.jpg" alt="" width="640" height="480" loading="lazy">
        <h3>${esc(p.t)}</h3>
        <p>${esc(p.d)}</p>
      </article>`).join('\n')}
    </div>
    <div class="railnav">
      <button class="railbtn" type="button" data-rail="prodrail" data-dir="-1" aria-label="Previous">&#8592;</button>
      <button class="railbtn" type="button" data-rail="prodrail" data-dir="1" aria-label="Next">&#8594;</button>
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
    url: `/companies/${c.slug}/`, image: c.hero
  })
    + header('/companies/')
    + pageHead({
      eyebrow: c.sectorName,
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
        <img src="/assets/img/${c.still}.jpg" alt="" width="900" height="1125" loading="lazy">
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

${products}${activities}<section class="section tight" aria-labelledby="othTitle">
  <div class="wrap">
    ${head2('othTitle', 'The other <span class="soft">companies</span>', '')}
    ${companyRail(others)}
  </div>
</section>

`
    + ctaBand()
    + footer();
}

/* ---------- careers ------------------------------------------------------ */

function pageCareers() {
  const roles = OPEN_ROLES.length
    ? `<div class="roles">
${OPEN_ROLES.map(r => `      <a class="role" href="mailto:${SITE.contact.email}?subject=${encodeURIComponent('Application — ' + r.t)}">
        <h3>${esc(r.t)}</h3>
        <span class="meta">${esc(r.co)}</span>
        <span class="meta">${esc(r.loc)}</span>
        <span class="go">Apply</span>
      </a>`).join('\n')}
    </div>`
    : `<div class="noroles rise">
      <div>
        <h3>No current opening?</h3>
        <p>We are always interested in meeting people who are good at what they do. Send your CV and tell us which company or area interests you, and what you would want to work on.</p>
        <p class="after"><a class="btn btn-dark" href="mailto:${SITE.contact.email}?subject=${encodeURIComponent('Speculative application')}">Send your CV</a></p>
      </div>
      <dl class="channels">
        <div><dt>Email</dt><dd><a href="mailto:${SITE.contact.email}">${esc(SITE.contact.email)}</a></dd></div>
        <div><dt>Include</dt><dd>Your CV, and the company or area that interests you.</dd></div>
      </dl>
    </div>`;

  return head({
    title: `Join Us · ${SITE.name}`,
    desc: 'Lusail Corp is building businesses across several industries in Qatar, which makes room for people with different backgrounds and skills.',
    url: '/careers/', image: 'hero-contact'
  })
    + header('/careers/')
    + pageHead({
      eyebrow: 'Join Us',
      h1: 'Build with us.',
      lede: 'We are building businesses across several industries, which makes room for people with different backgrounds, skills and ambitions.',
      photo: 'hero-contact'
    })
    + `<section class="section tight">
  <div class="wrap">
    <p class="lead-para rise">Whether the work is with the Group directly or inside one of our companies, our people are part of a growing organisation where initiative counts and the results are visible.</p>
    <div class="imgrow rise">
      <figure><img src="/assets/img/careers-a.jpg" alt="" width="1000" height="750" loading="lazy"></figure>
      <figure><img src="/assets/img/careers-b.jpg" alt="" width="1000" height="750" loading="lazy"></figure>
      <figure><img src="/assets/img/careers-c.jpg" alt="" width="1000" height="750" loading="lazy"></figure>
    </div>
  </div>
</section>

<section class="section stone" aria-labelledby="cvTitle">
  <div class="wrap">
    ${head2('cvTitle', 'The qualities we <span class="soft">look for</span>', '')}
    <div class="vals">
${CAREER_VALUES.map(v => `      <div class="val-q rise">
        ${icon(v.icon)}
        <h3>${esc(v.t)}</h3>
      </div>`).join('\n')}
    </div>
  </div>
</section>

<section class="section tight" aria-labelledby="joinTitle">
  <div class="wrap">
    ${head2('joinTitle', 'As the portfolio grows, so do the <span class="soft">openings in it</span>', '')}
    ${roles}
  </div>
</section>

`
    + ctaBand()
    + footer();
}

/* ---------- contact ------------------------------------------------------ */

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
    url: '/contact/', image: 'hero-contact'
  })
    + header('/contact/')
    + pageHead({
      eyebrow: 'Contact',
      h1: 'Let’s connect.',
      lede: 'Whether you want to work with one of our companies, supply them, propose something commercial, or just understand the Group better — this reaches us.',
      photo: 'hero-contact'
    })
    + `<section class="section tight">
  <div class="wrap cosplit contactwrap">
    <div class="rise">
      <h2 class="h3">Get in touch</h2>
      <dl class="channels">
        <div><dt>Email</dt><dd><a href="mailto:${SITE.contact.email}">${esc(SITE.contact.email)}</a></dd></div>
        <div><dt>Phone</dt><dd><a href="tel:${SITE.contact.phone.replace(/\s/g, '')}">${esc(SITE.contact.phone)}</a></dd></div>
        <div><dt>Location</dt><dd>${esc(SITE.contact.location)}</dd></div>
        <div><dt>Routing</dt><dd>Pick an area of interest and the message goes to the desk that can answer it.</dd></div>
      </dl>
    </div>
    <form id="form" class="rise d1" novalidate data-mailto="${SITE.contact.email}">
      <div class="hp" aria-hidden="true">
        <label for="fSite">Website</label>
        <input id="fSite" name="website" type="text" tabindex="-1" autocomplete="off">
      </div>
      <div class="field"><label for="fName">Full name</label><input id="fName" name="name" autocomplete="name" required></div>
      <div class="field"><label for="fCompany">Company</label><input id="fCompany" name="company" autocomplete="organization"></div>
      <div class="field"><label for="fMail">Email address</label><input id="fMail" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="fPhone">Phone number</label><input id="fPhone" name="phone" type="tel" autocomplete="tel"></div>
      <div class="field full"><label for="fArea">Area of interest</label>
        <select id="fArea" name="area">
${areas.map(a => `          <option value="${a.v}">${esc(a.t)}</option>`).join('\n')}
        </select></div>
      <div class="field full"><label for="fMsg">Message</label><textarea id="fMsg" name="message" required></textarea></div>
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
  return head({ title: `Page not found · ${SITE.name}`, desc: 'That page does not exist.', url: '/404.html' })
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
      <a class="btn btn-line" href="/companies/">Our companies</a>
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

/* Every photograph a page asks for, by name. The build checks they all exist
   before writing anything — a missing image is a broken page, and it is
   cheaper to fail here than to find out from the live site. The same list
   decides what gets copied, so photography that no page uses stays in the
   repository without being shipped to every visitor. */
function usedImages() {
  const want = new Set([
    'hero-doha', 'hero-about', 'hero-contact', 'why-group', 'cta-towers',
    'about-platform', 'careers-a', 'careers-b', 'careers-c'
  ]);
  ALL_COMPANIES.forEach(c => {
    want.add(c.hero); want.add(c.still);
    (c.products || []).forEach(p => want.add(p.img));
  });
  Object.values(SECTOR_SHOT).forEach(v => want.add(v));

  const have = new Set(fs.readdirSync(path.join(ROOT, 'site-assets/img'))
    .map(f => f.replace(/\.jpg$/, '')));
  const missing = [...want].filter(v => v && !have.has(v));
  if (missing.length) {
    console.error('\n  missing images in site-assets/img:\n    ' + missing.join('\n    ') + '\n');
    process.exit(1);
  }

  /* Two pages showing the identical photograph reads as a mistake, and it is
     hard to spot by eye once the names differ. Compare the bytes. */
  const seen = new Map();
  for (const name of want) {
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
  const images = usedImages();
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  console.log('pages');
  write('index.html', pageHome());
  write('about/index.html', pageAbout());
  write('companies/index.html', pageCompaniesIndex());
  // one page per company, from the flat list, so a company listed in two
  // sectors is still written exactly once
  ALL_COMPANIES.forEach(c => write(`companies/${c.slug}/index.html`, pageCompany(c)));
  write('careers/index.html', pageCareers());
  write('contact/index.html', pageContact());
  write('404.html', page404());

  console.log('assets');
  copyDir(path.join(ROOT, 'assets/css'), path.join(OUT, 'assets/css'));
  copyDir(path.join(ROOT, 'assets/js'), path.join(OUT, 'assets/js'));
  copyDir(path.join(ROOT, 'site-assets/logo'), path.join(OUT, 'assets/logo'));

  const imgOut = path.join(OUT, 'assets/img');
  fs.mkdirSync(imgOut, { recursive: true });
  let bytes = 0;
  for (const name of images) {
    const from = path.join(ROOT, 'site-assets/img', name + '.jpg');
    fs.copyFileSync(from, path.join(imgOut, name + '.jpg'));
    bytes += fs.statSync(from).size;
  }
  console.log(`  ${images.size} photographs (${Math.round(bytes / 1024)} KB)`);

  const urls = ['/', '/about/', '/companies/', ...ALL_COMPANIES.map(c => `/companies/${c.slug}/`),
    '/careers/', '/contact/'];
  fs.writeFileSync(path.join(OUT, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE.domain}/sitemap.xml\n`);
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url><loc>${SITE.domain}${u}</loc></url>`).join('\n') +
    `\n</urlset>\n`);

  console.log('  robots.txt, sitemap.xml (' + urls.length + ' urls)');
  console.log(`done -> dist/  (${urls.length + 1} pages, ${ALL_COMPANIES.length} companies)`);
}

build();
