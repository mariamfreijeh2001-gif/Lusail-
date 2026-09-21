/* ==========================================================================
   Lusail Corp — static site generator.

   Reads /data/site.js, writes finished HTML into /dist. No dependencies.
   Run with:  npm run build

   Two tiers: a sector holds any number of companies, including none.
     /sectors/            every sector
     /sectors/<slug>/     one sector and the companies in it
     /companies/          every company, filterable by sector
     /companies/<slug>/   one company
     /partnerships/       who the Group wants to hear from

   Design is editorial: pages open with type on paper, never with text over a
   photograph. Photography appears as a captioned plate where it is strong, a
   contained still where the source is a cutout product shot, and not at all
   where there is no honest picture of the business.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const {
  SITE, SECTORS, ALL_COMPANIES,
  WHAT_WE_DO, VALUE_CREATION, VALUES, GROWTH,
  PARTNER_TYPES, CAREER_VALUES, OPEN_ROLES
} = require('../data/site.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'dist');

/* ---------- helpers ---------------------------------------------------- */

const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Bilingual node: English is the content, Arabic rides in data-ar.
// A translatable element must never contain another — the toggle rewrites
// textContent, which would destroy the child.
const t = (en, ar) => ar ? ` data-ar="${esc(ar)}"` : '';

/* The logo appears only where a logo belongs — header, footer, favicon — and
   never as a decorative element the layout is built around, so the design
   survives a rebrand. Filenames come from SITE.brand. */
/* A social link is only rendered once it points somewhere. While the
   handles are unset the row simply is not there, rather than being a
   link to '#'. */
const social = () => [
  ['LinkedIn', 'لينكدإن', SITE.contact.linkedin],
  ['Instagram', 'إنستغرام', SITE.contact.instagram]
]
  .filter(([, , href]) => href && href !== '#')
  .map(([en, ar, href]) =>
    `          <li><a href="${href}"${t(en, ar)}>${en}</a></li>`)
  .join('\n');

const B = SITE.brand;
const logoImg = file =>
  `<img src="/assets/logo/${file}" alt="" width="${B.logoWidth}" height="${B.logoHeight}">`;
const LOGO_DARK = logoImg(B.logoOnLight);
const LOGO_LIGHT = logoImg(B.logoOnDark);

/* Icons, drawn here rather than pulled from a set, so they share the site's
   geometry: 24x24, hairline strokes, square caps, mitre joins, no rounding.
   They are decorative — the label beside each one carries the meaning — so
   they are aria-hidden. */
const ICON_PATHS = {
  // a building going up, with a plus: founding something new
  found: '<path d="M3.5 20.5V8.5h9v12"/><path d="M6 12h1.5M10 12h1.5M6 15.5h1.5M10 15.5h1.5"/><path d="M17.5 3v7M14 6.5h7"/>',
  // four corners pushing outward: growing what is already there
  expand: '<path d="M4 9.5v-5.5h5.5M14.5 4H20v5.5M20 14.5V20h-5.5M9.5 20H4v-5.5"/><path d="M4 4l5 5M20 4l-5 5M20 20l-5-5M4 20l5-5"/>',
  // three squares held, a fourth taken: entering a new sector
  sectors: '<path d="M3.5 3.5h7v7h-7zM13.5 3.5h7v7h-7zM3.5 13.5h7v7h-7z"/><path d="M13.5 13.5h7v7h-7z" fill="currentColor" stroke="none"/>',
  // two rings overlapping: a partnership, not an acquisition
  partnership: '<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
  // three points, all connected: suppliers, the group, buyers
  supply: '<circle cx="4.6" cy="6" r="1.9"/><circle cx="19.4" cy="6" r="1.9"/><circle cx="12" cy="19" r="1.9"/><path d="M6.5 6h11M5.5 7.7l5.5 9.6M18.5 7.7L13 17.3"/>',
  // a globe: markets beyond Qatar
  markets: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.7 3.3 2.7 13.7 0 17M12 3.5c-2.7 3.3-2.7 13.7 0 17"/>',
  // a shield: taking responsibility for the outcome
  shield: '<path d="M12 2.6 20 5.4v6.2c0 4.6-3.2 8.3-8 9.8-4.8-1.5-8-5.2-8-9.8V5.4z"/><path d="M8.6 12.1l2.4 2.4 4.6-4.9"/>',
  // a target: knowing who the customer is
  target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',
  // a path found through: solving the problem
  solve: '<path d="M3.5 3.5h17v17h-17z"/><path d="M3.5 14.5h5v-5h7v5h5"/>',
  // a loop that keeps going: continuous development
  cycle: '<path d="M20 12a8 8 0 1 1-2.6-5.9"/><path d="M20.5 3v4.5H16"/>',
  // a leaf: growers and producers
  leaf: '<path d="M20 4c0 9-5 13-11 13H4.5C4.5 9 10 4 20 4z"/><path d="M15 8.5C10.5 10.5 7 14 5 20"/>',
  // a route with a stop on it: moving goods to a buyer
  route: '<path d="M3.5 18.5h6a4 4 0 0 0 0-8h-5a4 4 0 0 1 0-8h6"/><circle cx="18" cy="16.5" r="3"/><path d="M18 2.5v5M15.5 5h5"/>',
  // a spark: founders and new concepts
  spark: '<path d="M12 2.5v5M12 16.5v5M2.5 12h5M16.5 12h5M5.2 5.2l3.5 3.5M15.3 15.3l3.5 3.5M18.8 5.2l-3.5 3.5M8.7 15.3l-3.5 3.5"/><circle cx="12" cy="12" r="2.6"/>',
  // two companies joined: connections inside the portfolio
  network: '<path d="M3.5 3.5h6v6h-6zM14.5 14.5h6v6h-6z"/><path d="M9.5 6.5h4.5a3 3 0 0 1 3 3v5"/>'
};
const icon = name => ICON_PATHS[name]
  ? `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON_PATHS[name]}</svg>`
  : '';

const num = i => String(i + 1).padStart(2, '0');
const plural = (n, one, many) => n === 1 ? `1 ${one}` : `${n} ${many}`;
const pluralAr = (n, one, many) => n === 1 ? one : n + ' ' + many;
const hasPhoto = o => o && o.photo && o.photoStyle && o.photoStyle !== 'none';

/* ---------- chrome ----------------------------------------------------- */

function head({ title, desc, url, image }) {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#FFFFFF">
<link rel="canonical" href="${SITE.domain}${url}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE.domain}${url}">
${image ? `<meta property="og:image" content="${SITE.domain}/assets/img/${image}">` : ''}
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="/assets/logo/${B.faviconSvg}" type="image/svg+xml">
<link rel="icon" href="/assets/logo/${B.faviconIco}" sizes="any">
<link rel="apple-touch-icon" href="/assets/logo/${B.appleTouch}">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Raleway:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Noto+Kufi+Arabic:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/site.css">

<script>
/* Language before first paint, so the page never flashes the wrong script. */
(function(){
  try{
    var q = new URLSearchParams(location.search).get('lang');
    var l = (q === 'ar' || q === 'en') ? q : localStorage.getItem('lc-lang');
    if(l === 'ar'){ document.documentElement.lang = 'ar'; document.documentElement.dir = 'rtl'; }
  }catch(e){}
})();
</script>
</head>
<body>
<a class="skip" href="#main" data-ar="تخطَّ إلى المحتوى">Skip to content</a>
`;
}

/* Hovering "Our Sectors" opens the whole portfolio at once. */
function megaMenu() {
  return `      <div class="mega" id="mega" hidden>
        <div class="wrap mega-in">
${SECTORS.map(s => `          <div class="mega-col">
            <a class="mega-sec" href="/sectors/${s.slug}/"${t(s.name, s.nameAr)}>${esc(s.name)}</a>
            <ul>
${s.companies.length
      ? s.companies.map(c => `              <li><a href="/companies/${c.slug}/"${t(c.name, c.nameAr)}>${esc(c.name)}</a></li>`).join('\n')
      : `              <li><span class="soon" data-ar="قريباً">In development</span></li>`}
            </ul>
          </div>`).join('\n')}
        </div>
      </div>`;
}

function header(current) {
  const links = SITE.nav.map(n => {
    const on = current === n.href ? ' aria-current="page"' : '';
    const mega = n.mega ? ' data-mega="1" aria-haspopup="true" aria-expanded="false"' : '';
    return `      <a href="${n.href}"${on}${mega}${t(n.label, n.labelAr)}>${esc(n.label)}</a>`;
  }).join('\n');

  return `<header class="site-head" id="top">
  <div class="wrap head-row">
    <a class="brand" href="/" aria-label="${esc(SITE.name)} — home">${LOGO_LIGHT}</a>
    <nav class="nav" id="nav" aria-label="Main">
${links}
    </nav>
    <div class="head-tools">
      <button class="lang" id="langBtn" type="button" aria-label="Switch language">عربي</button>
      <a class="btn btn-gold" href="/contact/" data-ar="تواصل معنا">Contact</a>
      <button class="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="nav" aria-label="Open menu">
        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M3 8h20M3 13h20M3 18h20"/></svg>
      </button>
    </div>
  </div>
${megaMenu()}
</header>
<main id="main">
`;
}

function footer() {
  const explore = SITE.nav.map(n =>
    `        <li><a href="${n.href}"${t(n.label, n.labelAr)}>${esc(n.label)}</a></li>`).join('\n');
  const cos = ALL_COMPANIES.map(c =>
    `        <li><a href="/companies/${c.slug}/"${t(c.name, c.nameAr)}>${esc(c.name)}</a></li>`).join('\n');

  return `</main>
<footer class="site-foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="brand" href="/" aria-label="${esc(SITE.name)} — home">${LOGO_LIGHT}</a>
        <p class="foot-tag"${t(SITE.tagline, SITE.taglineAr)}>${esc(SITE.tagline)}</p>
        <p class="foot-blurb"${t(SITE.blurb, SITE.blurbAr)}>${esc(SITE.blurb)}</p>
      </div>
      <div class="foot-links">
        <h4 data-ar="استكشف">Explore</h4>
        <ul>
${explore}
        </ul>
      </div>
      <div class="foot-links">
        <h4 data-ar="شركاتنا">Our Companies</h4>
        <ul>
${cos}
        </ul>
      </div>
      <div>
        <h4 data-ar="تواصل">Connect</h4>
        <ul>
${social()}
          <li><a href="mailto:${SITE.contact.email}">${SITE.contact.email}</a></li>
          <li><a href="tel:${SITE.contact.phone.replace(/\s/g, '')}" dir="ltr">${esc(SITE.contact.phone)}</a></li>
          <li><span${t(SITE.contact.location, SITE.contact.locationAr)}>${esc(SITE.contact.location)}</span></li>
        </ul>
      </div>
    </div>
    <div class="legal">
      <span data-ar="© لوسيل كورب. جميع الحقوق محفوظة.">© ${esc(SITE.name)}. All Rights Reserved.</span>
      <span data-ar="سياسة الخصوصية · الشروط والأحكام">Privacy Policy · Terms &amp; Conditions</span>
    </div>
  </div>
</footer>
<script src="/assets/js/site.js" defer></script>
</body>
</html>
`;
}

/* ---------- reusable blocks -------------------------------------------- */

function opener({ crumb, crumbAr, h1, h1Ar, lede, ledeAr, meta }) {
  return `<section class="opener">
  <div class="wrap">
    <span class="crumb"${t(crumb, crumbAr)}>${esc(crumb)}</span>
    <h1${t(h1, h1Ar)}>${esc(h1)}</h1>
    ${lede ? `<p class="lede"${t(lede, ledeAr)}>${esc(lede)}</p>` : ''}
    ${meta ? `<p class="op-meta">${meta}</p>` : ''}
  </div>
</section>
`;
}

/* The caption text is kept, as alt. It describes the picture for anyone who
   cannot see it, without printing a credit line under the photograph. */
function plate(photo, caption) {
  return `<figure class="plate">
      <img src="/assets/img/${photo}-wide.jpg" alt="${esc(caption)}" width="2400" height="1029" loading="lazy">
    </figure>`;
}

function still(photo, caption) {
  return `<figure class="still">
        <img src="/assets/img/${photo}-still.jpg" alt="${esc(caption)}" width="1100" height="1100" loading="lazy">
      </figure>`;
}

// Renders whichever treatment the source photograph deserves, or nothing.
function figureFor(o) {
  if (!hasPhoto(o)) return '';
  const cap = o.photoCaption || o.short;
  return o.photoStyle === 'still' ? still(o.photo, cap) : plate(o.photo, cap);
}

/* A process, read across. Used once, for what the Group does. */
function steps(items) {
  return `<div class="steps">
${items.map((v, i) => `      <div class="step">
        <span class="n" aria-hidden="true">${num(i)}</span>
        <h3${t(v.t, v.tAr)}>${esc(v.t)}</h3>
        <p${t(v.d, v.dAr)}>${esc(v.d)}</p>
      </div>`).join('\n')}
    </div>`;
}

/* A definition list. Used once, for how value is created. */
function defList(items) {
  return `<dl class="deflist">
${items.map((v, i) => `      <div>
        <span class="n" aria-hidden="true">${num(i)}</span>
        <dt${t(v.t, v.tAr)}>${esc(v.t)}</dt>
        <dd${t(v.d, v.dAr)}>${esc(v.d)}</dd>
      </div>`).join('\n')}
    </dl>`;
}

/* Icon rows. Used once, for who the Group wants to hear from. */
function iconRows(items) {
  return `<div class="plines">
${items.map(v => `      <div class="pline">
        ${icon(v.icon)}
        <div>
          <h3${t(v.t, v.tAr)}>${esc(v.t)}</h3>
          <p${t(v.d, v.dAr)}>${esc(v.d)}</p>
        </div>
      </div>`).join('\n')}
    </div>`;
}

/* Two products, given room. Used once, on the trading company. */
function prodBlocks(items) {
  return `<div class="prods">
${items.map(v => `      <div class="prod">
        <h3${t(v.t, v.tAr)}>${esc(v.t)}</h3>
        <p${t(v.d, v.dAr)}>${esc(v.d)}</p>
      </div>`).join('\n')}
    </div>`;
}

/* The numbered cards now appear once only, on the About values section,
   which is the treatment the client picked out as a reference. Every other
   section that used to reuse them has its own component above. */
function numberedCards(items, mod) {
  return `<div class="vgrid${mod ? ' ' + mod : ''}">
${items.map((v, i) => `      <div class="vcard">
        <span class="n" aria-hidden="true">${num(i)}</span>
        <h3${t(v.t, v.tAr)}>${esc(v.t)}</h3>
        ${v.d ? `<p${t(v.d, v.dAr)}>${esc(v.d)}</p>` : ''}
      </div>`).join('\n')}
    </div>`;
}

/* The sectors as cards that keep moving. The track holds each sector twice
   and slides exactly -50%, so the join is invisible; the second copy is
   aria-hidden and untabbable so a screen reader hears each sector once.
   It pauses on hover and on focus, in CSS, and does not animate at all under
   prefers-reduced-motion. */
function sectorMarquee() {
  /* The marquee shows the sectors the Group actually operates in. Future
     Ventures has no business in it yet, so it would ride along as an empty
     card; it still has its own row on /sectors/ and its own page. */
  const shown = SECTORS.filter(s => s.companies.length);

  const card = (s, clone) => {
    const n = s.companies.length;
    const hide = clone ? ' aria-hidden="true" tabindex="-1"' : '';
    const count = plural(n, 'company', 'companies');
    const countAr = pluralAr(n, 'شركة واحدة', 'شركات');

    /* A sector with no photograph gets no picture area at all. An empty
       rectangle reads as a broken image; a solid card reads as a choice. */
    const pic = hasPhoto(s)
      ? `<span class="pic">
          <span class="n" aria-hidden="true">${num(SECTORS.indexOf(s))}</span>
          <img src="/assets/img/${s.photo}-card.jpg" alt="${clone ? '' : esc(s.name)}" width="1000" height="750" loading="lazy">
        </span>`
      : '';

    return `      <a class="mcard${hasPhoto(s) ? '' : ' plain'}" href="/sectors/${s.slug}/"${hide}>
        ${pic}
        <span class="body">
          ${hasPhoto(s) ? '' : `<span class="n" aria-hidden="true">${num(SECTORS.indexOf(s))}</span>`}
          <h3${t(s.name, s.nameAr)}>${esc(s.name)}</h3>
          <span class="meta"${t(count, countAr)}>${esc(count)}</span>
          <span class="sub"${t(s.short, s.shortAr)}>${esc(s.short)}</span>
          <span class="go" data-ar="عرض القطاع">View sector</span>
        </span>
      </a>`;
  };

  return `<div class="marquee" id="mq">
    <div class="track">
${shown.map(s => card(s, false)).join('\n')}
${shown.map(s => card(s, true)).join('\n')}
    </div>
  </div>`;
}

function sectorIndex(list) {
  return `<div class="idx">
${list.map(s => {
    const i = SECTORS.indexOf(s);
    const n = s.companies.length;
    const count = n ? plural(n, 'company', 'companies') : 'In development';
    const countAr = n ? pluralAr(n, 'شركة واحدة', 'شركات') : 'قيد التطوير';
    return `      <a href="/sectors/${s.slug}/">
        <span class="n">${num(i)}</span>
        <span>
          <h3${t(s.name, s.nameAr)}>${esc(s.name)}</h3>
          <span class="sub"${t(s.short, s.shortAr)}>${esc(s.short)}</span>
        </span>
        <span class="meta"${t(count, countAr)}>${esc(count)}</span>
        <span class="go" aria-hidden="true">&#8594;</span>
      </a>`;
  }).join('\n')}
    </div>`;
}

function companyIndex(list, { showSector = true } = {}) {
  return list.map((c, i) => {
    const metaEn = showSector && c.sectorName ? c.sectorName : c.role;
    const metaAr = showSector && c.sectorNameAr ? c.sectorNameAr : c.roleAr;
    // a company can belong to several sectors, so the filter matches a list
    const secs = (c.sectors || [c.sectorSlug]).filter(Boolean).join(' ');
    return `      <a href="/companies/${c.slug}/" data-sector="${secs}">
        <span class="n">${num(i)}</span>
        <span>
          <h3${t(c.name, c.nameAr)}>${esc(c.name)}</h3>
          <span class="sub"${t(c.short, c.shortAr)}>${esc(c.short)}</span>
        </span>
        <span class="meta"${t(metaEn, metaAr)}>${esc(metaEn)}</span>
        <span class="go" aria-hidden="true">&#8594;</span>
      </a>`;
  }).join('\n');
}

function ctaBand() {
  return `<section class="cta">
  <div class="wrap">
    <div>
      <h2 data-ar="ما التالي للوسيل كورب؟">What&rsquo;s Next for Lusail Corp?</h2>
      <p data-ar="تُبنى قصتنا عملاً تلو الآخر، وشراكة تلو الأخرى، وفرصة تلو الأخرى.">Our story is being built one business, one partnership and one opportunity at a time.</p>
    </div>
    <div class="cta-actions">
      <a class="btn btn-gold" href="/companies/" data-ar="استكشف شركاتنا">Explore Our Companies</a>
      <a class="btn btn-ink" href="/partnerships/" data-ar="كن شريكاً لنا">Partner With Us</a>
    </div>
  </div>
</section>
`;
}

/* The Group at a glance. One line, not a grid of boxes: only one of these
   four is actually a number. */
function glanceBand() {
  const rows = [
    { v: String(ALL_COMPANIES.length), vAr: String(ALL_COMPANIES.length), k: 'Operating Companies', kAr: 'شركات تشغيلية' },
    { v: 'Multiple', vAr: 'متعددة', k: 'Business Sectors', kAr: 'قطاعات الأعمال' },
    { v: 'Qatar', vAr: 'قطر', k: 'Our Home Market', kAr: 'سوقنا الأساسي' },
    { v: 'One', vAr: 'واحدة', k: 'Shared Vision', kAr: 'رؤية مشتركة' }
  ];
  return `<section class="ribbon" aria-label="The Group at a glance">
  <dl class="wrap">
${rows.map(r => `    <div><dd${t(r.v, r.vAr)}>${esc(r.v)}</dd><dt class="micro"${t(r.k, r.kAr)}>${esc(r.k)}</dt></div>`).join('\n')}
  </dl>
</section>
`;
}

/* ---------- pages ------------------------------------------------------ */

function pageHome() {
  return head({
    title: `${SITE.name} · ${SITE.tagline}`,
    desc: 'Lusail Corp is a Qatar-based diversified corporate group building and supporting businesses across consumer services, food and beverage, commercial distribution and international trade.',
    url: '/', image: 'coffee-still.jpg'
  })
    + header('/')
    + `<section class="hero">
  <img class="hero-bg" src="/assets/img/skyline-tall.jpg" alt="" width="1000" height="1333" fetchpriority="high">
  <div class="wrap">
      <span class="crumb"${t(SITE.name + ' — ' + SITE.supporting, SITE.nameAr + ' — ' + SITE.supportingAr)}>${esc(SITE.name)} — ${esc(SITE.supporting)}</span>
      <h1${t(SITE.tagline, SITE.taglineAr)}>${esc(SITE.tagline)}</h1>
      <p class="lede" data-ar="لوسيل كورب مجموعة شركات قطرية متنوعة، تبني وتدير وتدعم أعمالاً في قطاعات متعددة.">Lusail Corp is a Qatar-based diversified corporate group building, operating and supporting businesses across multiple sectors.</p>
            <div class="hero-cta">
        <a class="btn btn-gold" href="/companies/" data-ar="استكشف شركاتنا">Explore Our Companies</a>
        <a class="btn btn-ghost" href="/about/" data-ar="تعرّف على لوسيل كورب">Discover Lusail Corp</a>
      </div>
  </div>
</section>

`
    + glanceBand()
    + `
<section class="section" aria-labelledby="introTitle">
  <div class="wrap split">
    <div>
      <span class="eyebrow" data-ar="مقدمة">Introduction</span>
      <h2 id="introTitle" class="statement"${t(SITE.supporting, SITE.supportingAr)}>${esc(SITE.supporting)}</h2>
      <div class="prose">
        <p data-ar="تجمع لوسيل كورب محفظة متنامية من الأعمال في صناعات مختلفة.">Lusail Corp brings together a growing portfolio of businesses operating across different industries.</p>
        <p data-ar="ودورنا يتجاوز الملكية: نوفّر التوجيه الاستراتيجي والدعم التجاري ومنصة مشتركة تستطيع شركاتنا من خلالها تقوية عملياتها وتطوير أسواقها واقتناص فرص جديدة.">Our role goes beyond ownership. We provide strategic direction, commercial support and a shared platform from which our companies can strengthen their operations, develop their markets and pursue new opportunities.</p>
        <p data-ar="تمتد محفظتنا اليوم عبر خدمات المستهلك والأغذية والمشروبات وتوريد المنتجات الطازجة وتجارة السلع الدولية. وغداً ستمضي أبعد من ذلك.">Today, our portfolio spans consumer services, food and beverage, fresh produce supply and international commodity trading. Tomorrow, it will go further.</p>
      </div>
    </div>
    <div class="aside">
      <h3 data-ar="شركاتنا">Our Companies</h3>
      <ol class="mini">
${ALL_COMPANIES.map((c, k) => `        <li><a href="/companies/${c.slug}/"><span class="n">${num(k)}</span><span><b${t(c.name, c.nameAr)}>${esc(c.name)}</b><em${t(c.role, c.roleAr)}>${esc(c.role)}</em></span></a></li>`).join('\n')}
      </ol>
      <a class="btn btn-ink" href="/companies/" data-ar="عرض المحفظة">View the portfolio</a>
    </div>
  </div>
</section>

<section class="section stone" aria-labelledby="secTitle">
  <div class="wrap">
    <div class="sec-head row">
      <div>
        <span class="eyebrow" data-ar="قطاعاتنا">Our Sectors</span>
        <h2 id="secTitle" data-ar="متنوّعون بالتصميم">Diversified by Design</h2>
      </div>
      <p class="lede" data-ar="تعكس محفظتنا إيماننا بأن الفرص قد توجد في صناعات مختلفة، فنبني الأعمال حيث نرى إمكانات تجارية قوية.">Our portfolio reflects our belief that opportunities can exist across different industries, so we build businesses where we see strong commercial potential.</p>
    </div>
  </div>
  ${sectorMarquee()}
</section>

<section class="section" aria-labelledby="wwdTitle">
  <div class="wrap">
    <div class="sec-head row">
      <div>
        <span class="eyebrow" data-ar="ما نقوم به">What We Do</span>
        <h2 id="wwdTitle" data-ar="أكثر من مجرد محفظة">Building More Than a Portfolio</h2>
      </div>
      <p class="lede" data-ar="صُمّمت لوسيل كورب لتهيئة بيئة تنمو فيها الأعمال باستقلالية مع استفادتها من قوة مجموعة أوسع.">Lusail Corp is designed to create an environment where businesses can develop independently while benefiting from the strength of a wider corporate group.</p>
    </div>
    ${steps(WHAT_WE_DO)}
  </div>
</section>

<section class="section sand" aria-labelledby="growthTitle">
  <div class="wrap split">
    <div>
      <span class="eyebrow" data-ar="النمو">Growth</span>
      <h2 id="growthTitle" class="statement" data-ar="مبنيّون لما هو قادم">Built for What Comes Next</h2>
      <div class="prose">
        <p data-ar="تمثّل شركات لوسيل كورب اليوم بداية رحلة نمو أوسع.">The companies within Lusail Corp today represent the beginning of a broader growth journey.</p>
        <p data-ar="ومع تغيّر الأسواق وظهور فرص جديدة، صُمّمت محفظتنا لتتطوّر معها.">As markets change and new opportunities emerge, our portfolio is designed to evolve with them.</p>
        <p data-ar="نهجنا انتقائي وعملي ويركّز على الفرص التي تستطيع فيها لوسيل كورب خلق قيمة حقيقية بعيدة المدى.">Our approach is selective, practical and focused on opportunities where Lusail Corp can create meaningful long-term value.</p>
      </div>
    </div>
    <div>
      <p class="micro-head" data-ar="نستكشف باستمرار فرصاً لـ">We continuously explore opportunities to</p>
      <ul class="ticks">
${GROWTH.map(g => `        <li>${icon(g.icon)}<span${t(g.t, g.tAr)}>${esc(g.t)}</span></li>`).join('\n')}
      </ul>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="qatarTitle">
  <div class="wrap split">
    <div>
      <span class="eyebrow" data-ar="قطر">Qatar</span>
      <h2 id="qatarTitle" class="statement" data-ar="متجذّرون في قطر. متصلون بالفرص.">Rooted in Qatar. Connected to Opportunity.</h2>
      <div class="prose">
        <p data-ar="تأسست لوسيل كورب في دولة قطر بطموح بناء مجموعة أعمال متنوعة قادرة على خدمة الطلب المحلي مع تطوير صلات تتجاوز حدود البلاد.">Lusail Corp was established in the State of Qatar with the ambition to build a diversified group of businesses capable of serving local demand while developing connections beyond the country&rsquo;s borders.</p>
        <p data-ar="وتبقى قطر في قلب عملياتنا واستراتيجية نمونا.">Qatar remains at the center of our operations and growth strategy.</p>
        <p data-ar="وفي الوقت نفسه، تتيح أعمال مثل لوسيل التجارية للمجموعة بناء شبكات موردين دولية وعلاقات توريد وفرص تجارية. نظرتنا محلية في الفهم ودولية في الأفق.">At the same time, businesses such as Lusail Commercial allow the Group to develop international supplier networks, sourcing relationships and trading opportunities. Our perspective is local in understanding and international in outlook.</p>
      </div>
    </div>
    <figure class="port-fig">
      <img src="/assets/img/doha-tall.jpg" alt="Doha, Qatar" width="1000" height="1333" loading="lazy">
    </figure>
  </div>
</section>

<section class="section stone fit" aria-labelledby="vcTitle">
  <div class="wrap">
    <div class="sec-head row">
      <div>
        <span class="eyebrow" data-ar="خلق القيمة">Value Creation</span>
        <h2 id="vcTitle" data-ar="كيف نصنع القيمة">How We Create Value</h2>
      </div>
      <p class="lede" data-ar="النمو ليس مجرد إضافة شركات إلى محفظة. النمو عندنا يعني بناء أعمال أفضل.">Growth is not simply about adding more companies to a portfolio. For Lusail Corp, growth means building better businesses.</p>
    </div>
    ${defList(VALUE_CREATION)}
  </div>
</section>

`
    + ctaBand()
    + footer();
}

function pageAbout() {
  return head({
    title: `About Us · ${SITE.name}`,
    desc: 'Lusail Corp is a diversified corporate group registered in the State of Qatar, bringing together businesses across consumer services, food and beverage, commercial distribution and international trade.',
    url: '/about/', image: 'coffee-still.jpg'
  })
    + header('/about/')
    + opener({
      crumb: 'About Us', crumbAr: 'من نحن',
      h1: 'Building a Group for the Future.', h1Ar: 'نبني مجموعة للمستقبل.',
      lede: 'Lusail Corp is a diversified corporate group registered in the State of Qatar, bringing together businesses across consumer services, food and beverage, commercial distribution and international trade.',
      ledeAr: 'لوسيل كورب مجموعة شركات متنوعة مسجّلة في دولة قطر، تجمع أعمالاً في خدمات المستهلك والأغذية والمشروبات والتوزيع التجاري والتجارة الدولية.'
    })
    // Deliberately not the prose-plus-aside layout Home already uses for its
    // introduction: this one runs the statement full measure and sets the copy
    // in two columns, so the two pages do not read as the same page twice.
    + `<section class="section tight" aria-labelledby="whoTitle">
  <div class="wrap">
    <span class="eyebrow" data-ar="من نحن">Who We Are</span>
    <h2 id="whoTitle" class="wide-statement" data-ar="منصّة لنمو الأعمال">A Platform for Business Growth</h2>
    <div class="prose cols">
      <p data-ar="تأسست لوسيل كورب بطموح واضح: إنشاء وتطوير ودعم أعمال لديها القدرة على النمو.">Lusail Corp was established with a straightforward ambition: to create, develop and support businesses with the potential to grow.</p>
      <p data-ar="تعمل شركات محفظتنا باستقلالية في أسواقها، وتتشارك في الوقت نفسه التوجيه الاستراتيجي وقدرات المجموعة الأوسع.">Our portfolio companies operate independently within their respective markets while sharing the strategic direction and broader capabilities of the Group.</p>
      <p data-ar="يتيح هذا الهيكل لكل شركة الاحتفاظ بهويتها وعملائها وتركيزها التجاري، مع استفادتها من الانتماء إلى منظومة متنوعة.">This structure allows each business to maintain its own identity, customers and commercial focus while benefiting from belonging to a diversified organization.</p>
      <p data-ar="ومع تطوّر المجموعة، ستنضم أعمال وقطاعات إضافية إلى محفظة لوسيل كورب.">As the Group develops, additional businesses and sectors will become part of the Lusail Corp portfolio.</p>
    </div>
  </div>
</section>

<section class="section stone">
  <div class="wrap vm-grid">
    <div class="vm">
      <span class="eyebrow" data-ar="رؤيتنا">Our Vision</span>
      <h2 data-ar="أن نبني مجموعة متنوعة من الأعمال القوية والمستدامة.">To Build a Diversified Group of Strong and Sustainable Businesses.</h2>
      <p data-ar="نسعى إلى تطوير لوسيل كورب لتصبح مجموعة معروفة لها مصالح في قطاعات تجارية متعددة في قطر وخارجها.">We aim to develop Lusail Corp into a recognized corporate group with interests across multiple commercial sectors in Qatar and beyond.</p>
    </div>
    <div class="vm">
      <span class="eyebrow" data-ar="مهمتنا">Our Mission</span>
      <h2 data-ar="أن نكتشف الفرص ونبني القدرات ونصنع قيمة تجارية دائمة.">To Identify Opportunities, Build Capabilities and Create Lasting Commercial Value.</h2>
      <p data-ar="نطوّر الأعمال عبر إدارة مسؤولة وشراكات قوية وعمليات كفؤة وتركيز مستمر على العملاء والأسواق.">We develop businesses through responsible management, strong partnerships, efficient operations and a continuous focus on customers and markets.</p>
    </div>
  </div>
</section>

<section class="section tight" aria-labelledby="apprTitle">
  <div class="wrap split">
    <div>
      <span class="eyebrow" data-ar="نهجنا">Our Approach</span>
      <h2 id="apprTitle" class="statement" data-ar="روح ريادية. انضباط في التنفيذ.">Entrepreneurial at Heart. Disciplined in Execution.</h2>
      <div class="prose">
        <p data-ar="تجمع لوسيل كورب بين نهج ريادي تجاه الفرص ونهج منظّم في بناء الشركات.">Lusail Corp combines an entrepreneurial approach to opportunity with a structured approach to building companies.</p>
        <p data-ar="نبحث عن الأعمال والأسواق التي نعتقد أن بإمكاننا الإسهام فيها من خلال التنفيذ القوي والعلاقات التجارية والقدرة التشغيلية والتفكير بعيد المدى.">We look for businesses and markets where we believe we can contribute through strong execution, commercial relationships, operational capability and long-term thinking.</p>
        <p><strong data-ar="نحن لا نُعرَّف بصناعة واحدة. نُعرَّف بطريقة بنائنا.">We are not defined by one industry. We are defined by how we build.</strong></p>
      </div>
    </div>
    <figure class="port-fig">
      <img src="/assets/img/approach-tall.jpg" alt="Group management at work" width="1000" height="1333" loading="lazy">
    </figure>
  </div>
</section>

<section class="section values" aria-labelledby="valTitle">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow" data-ar="قيمنا">Our Values</span>
      <!-- two sibling spans: a translatable element must never contain another -->
      <h2 id="valTitle"><span data-ar="القيم التي">The values that</span> <span class="mark" data-ar="توجّهنا">guide us</span></h2>
    </div>
    ${numberedCards(VALUES, 'three')}
  </div>
</section>

`
    + ctaBand()
    + footer();
}

function pageCompaniesIndex() {
  const chips = [
    `      <button type="button" class="chip" data-filter="all" aria-pressed="true"><span data-ar="الكل">All</span> <em>${ALL_COMPANIES.length}</em></button>`,
    ...SECTORS.filter(s => s.companies.length).map(s =>
      `      <button type="button" class="chip" data-filter="${s.slug}" aria-pressed="false"><span${t(s.name, s.nameAr)}>${esc(s.name)}</span> <em>${s.companies.length}</em></button>`)
  ].join('\n');

  return head({
    title: `Our Companies · ${SITE.name}`,
    desc: 'The Lusail Corp portfolio: Cavallo Laundry, Nero Café, ROMA Commercial and Lusail Commercial.',
    url: '/companies/', image: 'coffee-still.jpg'
  })
    + header('/companies/')
    + opener({
      crumb: 'Our Companies', crumbAr: 'شركاتنا',
      h1: 'Our Portfolio', h1Ar: 'محفظتنا',
      lede: 'A growing collection of businesses serving different markets under one shared corporate direction.',
      ledeAr: 'مجموعة متنامية من الأعمال تخدم أسواقاً مختلفة تحت توجّه مؤسسي واحد.'
    })
    + `<section class="section tight">
  <div class="wrap">
    <div class="filters" role="group" aria-label="Filter companies by sector">
${chips}
    </div>
    <span class="count" id="count" role="status" data-ar="عرض جميع الشركات">Showing all ${ALL_COMPANIES.length} companies</span>
    <div class="idx" id="coGrid">
${companyIndex(ALL_COMPANIES)}
    </div>
    <p class="empty" id="empty" hidden data-ar="لا توجد شركات في هذا القطاع.">No companies in that sector.</p>
  </div>
</section>

`
    + ctaBand()
    + footer();
}

function pageCompany(c, sector) {
  const body = c.body.map((p, k) => `        <p${t(p, c.bodyAr && c.bodyAr[k])}>${esc(p)}</p>`).join('\n');

  const facts = (c.facts || []).map(f =>
    `        <div><dt${t(f.k, f.kAr)}>${esc(f.k)}</dt><dd${t(f.v, f.vAr)}>${esc(f.v)}</dd></div>`).join('\n');

  const products = c.products && c.products.length
    ? `<section class="section stone" aria-labelledby="prodTitle">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow" data-ar="المنتجات الحالية">Current Products</span>
      <h2 id="prodTitle" data-ar="ما نتاجر به اليوم">What we trade today</h2>
    </div>
    ${prodBlocks(c.products)}
  </div>
</section>

` : '';

  const activities = c.activities && c.activities.length
    ? `<section class="section tight" aria-labelledby="actTitle">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow" data-ar="الأنشطة">Activities</span>
      <h2 id="actTitle" data-ar="ما تتولاه هذه الشركة">What this company handles</h2>
    </div>
    <ul class="tags">
${c.activities.map((a, k) => `      <li${t(a, c.activitiesAr && c.activitiesAr[k])}>${esc(a)}</li>`).join('\n')}
    </ul>
  </div>
</section>

` : '';

  const others = ALL_COMPANIES.filter(x => x.slug !== c.slug);

  return head({
    title: `${c.name} · ${SITE.name}`, desc: c.short,
    url: `/companies/${c.slug}/`,
    image: hasPhoto(c) ? `${c.photo}-${c.photoStyle === 'still' ? 'still' : 'wide'}.jpg` : undefined
  })
    + header('/companies/')
    + opener({
      crumb: sector.name, crumbAr: sector.nameAr,
      h1: c.name, h1Ar: c.nameAr,
      lede: c.headline, ledeAr: c.headlineAr,
      meta: `<span${t(c.role, c.roleAr)}>${esc(c.role)}</span> &middot; <a href="/sectors/${sector.slug}/"${t(sector.name, sector.nameAr)}>${esc(sector.name)}</a>`
    })
    + `<section class="section tight">
  <div class="wrap${hasPhoto(c) ? ' split' : ''}">
    <div>
      <span class="eyebrow" data-ar="الشركة">The company</span>
      <p class="lead-para"${t(c.intro, c.introAr)}>${esc(c.intro)}</p>
      <div class="prose${hasPhoto(c) ? '' : ' co-solo'}">
${body}
      </div>
    </div>
    ${hasPhoto(c) ? `<div class="co-aside">
      ${c.photoStyle === 'still'
      ? still(c.photo, c.short, c.shortAr)
      : `<figure class="port-fig">
        <img src="/assets/img/${c.photo}-card.jpg" alt="${esc(c.name)}" width="1000" height="750" loading="lazy">
      </figure>`}
      <a class="btn btn-gold" href="/contact/?company=${c.slug}"${t(c.cta, c.ctaAr)}>${esc(c.cta)}</a>
    </div>` : ''}
  </div>
  <div class="wrap">
    <dl class="factstrip">
${facts}
    </dl>
    ${hasPhoto(c) ? '' : `<p style="margin-top:clamp(28px,3.5vw,44px)"><a class="btn btn-gold" href="/contact/?company=${c.slug}"${t(c.cta, c.ctaAr)}>${esc(c.cta)}</a></p>`}
  </div>
</section>

${products}${activities}<section class="section tight" aria-labelledby="othTitle">
  <div class="wrap">
    <div class="sec-head row">
      <div>
        <span class="eyebrow" data-ar="المحفظة">The portfolio</span>
        <h2 id="othTitle" data-ar="الشركات الأخرى">The other companies</h2>
      </div>
      <a class="btn btn-ink" href="/companies/" data-ar="عرض الكل">View all</a>
    </div>
    <div class="idx">
${companyIndex(others)}
    </div>
  </div>
</section>

`
    + ctaBand()
    + footer();
}

/* A mark per sector, drawn from the set already in ICON_PATHS. */
const SECTOR_ICON = {
  'consumer-services': 'cycle',
  'food-beverage': 'leaf',
  'supply-distribution': 'supply',
  'trading': 'markets',
  'future-ventures': 'spark'
};

/* Sector bands: the sector names itself, then the companies inside it. */
function sectorBands() {
  return `<div class="bands">
${SECTORS.map(s => {
    const n = s.companies.length;
    const count = n ? plural(n, 'company', 'companies') : 'In development';
    const countAr = n ? pluralAr(n, 'شركة واحدة', 'شركات') : 'قيد التطوير';

    /* A sector with no company yet still gets a tile, pointing at its own
       page, so the row reads as deliberate rather than unfinished. */
    const tiles = n
      ? s.companies.map(co => `        <a class="tile" href="/companies/${co.slug}/">
          <span class="shot"><img src="/assets/img/${co.photo || s.photo || 'skyline-tall'}-card.jpg" alt="" width="1000" height="750" loading="lazy"></span>
          <span class="tcap"><span class="tname"${t(co.name, co.nameAr)}>${esc(co.name)}</span></span>
        </a>`).join('\n')
      : `        <a class="tile" href="/sectors/${s.slug}/">
          <span class="shot"><img src="/assets/img/skyline-tall.jpg" alt="" width="1000" height="1333" loading="lazy"></span>
          <span class="tcap"><span class="tname" data-ar="ما نبنيه بعد ذلك">What we build next</span></span>
        </a>`;

    return `      <section class="band">
        <div class="band-head">
          ${icon(SECTOR_ICON[s.slug] || 'sectors')}
          <h3${t(s.name, s.nameAr)}>${esc(s.name)}</h3>
          <span class="rule" aria-hidden="true"></span>
          <span class="count micro"${t(count, countAr)}>${esc(count)}</span>
        </div>
        <p class="band-lede"${t(s.short, s.shortAr)}>${esc(s.short)}</p>
        <div class="tiles n${Math.min(n || 1, 3)}">
${tiles}
        </div>
        <p class="band-more"><a class="tl" href="/sectors/${s.slug}/"${t('Read about ' + s.name, 'اقرأ عن ' + s.nameAr)}>Read about ${esc(s.name)}</a></p>
      </section>`;
  }).join('\n')}
    </div>`;
}

function pageSectorsIndex() {
  return head({
    title: `Our Sectors · ${SITE.name}`,
    desc: 'Lusail Corp operates across consumer services, food and beverage, food supply, trading and commodities, with new sectors in development.',
    url: '/sectors/', image: 'grain-still.jpg'
  })
    + header('/sectors/')
    + opener({
      crumb: 'Our Sectors', crumbAr: 'قطاعاتنا',
      h1: 'Diverse Businesses. Connected Thinking.', h1Ar: 'أعمال متنوعة. تفكير مترابط.',
      lede: 'Lusail Corp operates across multiple industries while maintaining one common focus: building commercially sound businesses capable of sustainable growth.',
      ledeAr: 'تعمل لوسيل كورب في صناعات متعددة مع تركيز واحد مشترك: بناء أعمال سليمة تجارياً وقادرة على النمو المستدام.'
    })
    + `<section class="section band-wrap">
  <div class="wrap">
    ${sectorBands()}
  </div>
</section>

`
    + ctaBand()
    + footer();
}

/* The sectors index opens in place: each row expands to show the companies
   inside it as cards, so the whole portfolio can be read without leaving the
   page, while each sector still has its own address. */
function sectorAccordion() {
  return `<div class="acc">
${SECTORS.map((s, i) => {
    const n = s.companies.length;
    const count = n ? plural(n, 'company', 'companies') : 'In development';
    const countAr = n ? pluralAr(n, 'شركة واحدة', 'شركات') : 'قيد التطوير';
    const open = false;   // every sector starts closed

    const cards = n ? `<div class="cocards">
${s.companies.map(c => {
      const pic = hasPhoto(c)
        ? `<span class="pic"><img src="/assets/img/${c.photo}-card.jpg" alt="${esc(c.name)}" width="1000" height="750" loading="lazy"></span>`
        : '';
      return `            <a class="cocard" href="/companies/${c.slug}/">
              ${pic}
              <span class="body">
                <span class="role micro"${t(c.role, c.roleAr)}>${esc(c.role)}</span>
                <h4${t(c.name, c.nameAr)}>${esc(c.name)}</h4>
                <p${t(c.short, c.shortAr)}>${esc(c.short)}</p>
                <span class="go" data-ar="عرض الشركة">View company</span>
              </span>
            </a>`;
    }).join('\n')}
          </div>`
      : `<p class="acc-empty" data-ar="لا توجد شركة في هذا القطاع بعد. إن كان لديك عمل أو مفهوم يناسبه، نودّ أن نسمع منك.">No company sits in this sector yet. If you have a business or concept that fits it, we would like to hear from you.</p>`;

    return `      <div class="acc-item${open ? ' open' : ''}" id="sec-${s.slug}">
        <button class="acc-btn" type="button" aria-expanded="${open}" aria-controls="panel-${s.slug}">
          <span class="n">${num(i)}</span>
          <span>
            <h3${t(s.name, s.nameAr)}>${esc(s.name)}</h3>
            <span class="sub"${t(s.short, s.shortAr)}>${esc(s.short)}</span>
          </span>
          <span class="meta"${t(count, countAr)}>${esc(count)}</span>
          <span class="plus" aria-hidden="true"></span>
        </button>
        <div class="acc-panel" id="panel-${s.slug}" role="region">
          <div><div class="acc-inner">
            ${cards}
            <p style="margin-top:22px"><a class="tl" href="/sectors/${s.slug}/"${t('Read about ' + s.name, 'اقرأ عن ' + s.nameAr)}>Read about ${esc(s.name)}</a></p>
          </div></div>
        </div>
      </div>`;
  }).join('\n')}
    </div>`;
}

function pageSector(s, i) {
  const others = SECTORS.filter(x => x.slug !== s.slug);
  const cos = s.companies.map(c => Object.assign({}, c, {
    sectorSlug: s.slug, sectorName: s.name, sectorNameAr: s.nameAr
  }));
  const body = s.body.map((p, k) => `        <p${t(p, s.bodyAr && s.bodyAr[k])}>${esc(p)}</p>`).join('\n');
  const n = s.companies.length;
  const count = n ? plural(n, 'company in this sector', 'companies in this sector') : 'In development';
  const countAr = n ? pluralAr(n, 'شركة واحدة في هذا القطاع', 'شركات في هذا القطاع') : 'قيد التطوير';

  return head({
    title: `${s.name} · ${SITE.name}`, desc: s.short,
    url: `/sectors/${s.slug}/`,
    image: hasPhoto(s) ? `${s.photo}-${s.photoStyle === 'still' ? 'still' : 'wide'}.jpg` : undefined
  })
    + header('/sectors/')
    + opener({
      crumb: `Our Sectors — ${num(i)}`, crumbAr: `قطاعاتنا — ${num(i)}`,
      h1: s.headline, h1Ar: s.headlineAr,
      lede: s.intro, ledeAr: s.introAr,
      meta: `<span${t(s.name, s.nameAr)}>${esc(s.name)}</span> &middot; <span${t(count, countAr)}>${esc(count)}</span>`
    })
    // a real photograph runs full width with its caption under it; a cutout
    // product shot is contained in the aside instead
    + (hasPhoto(s) && s.photoStyle === 'plate' ? `<section class="section tight">
  <div class="wrap">
    ${plate(s.photo, s.photoCaption || s.short)}
  </div>
</section>

` : '')
    + `<section class="section tight">
  <div class="wrap split">
    <div>
      <span class="eyebrow" data-ar="القطاع">The sector</span>
      <div class="prose">
${body}
      </div>
    </div>
    <div class="aside">
      ${hasPhoto(s) && s.photoStyle === 'still' ? still(s.photo, s.photoCaption || s.short) : ''}
      ${n ? `<h3 data-ar="شركة المحفظة">Portfolio ${n === 1 ? 'company' : 'companies'}</h3>
      <ol class="mini">
${s.companies.map((c, k) => `        <li><a href="/companies/${c.slug}/"><span class="n">${num(k)}</span><span><b${t(c.name, c.nameAr)}>${esc(c.name)}</b><em${t(c.role, c.roleAr)}>${esc(c.role)}</em></span></a></li>`).join('\n')}
      </ol>` : `<h3 data-ar="قيد التطوير">In development</h3>
      <p class="prose" data-ar="لا توجد شركة في هذا القطاع بعد. إن كان لديك عمل أو مفهوم يناسبه، نودّ أن نسمع منك.">No company sits in this sector yet. If you have a business or concept that fits it, we would like to hear from you.</p>
      <a class="btn btn-ink" href="/partnerships/" data-ar="تحدّث إلينا">Talk to us</a>`}
    </div>
  </div>
</section>

${n ? `<section class="section stone" aria-labelledby="coTitle">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow" data-ar="الشركات">Companies</span>
      <h2 id="coTitle"${n === 1 ? ' data-ar="الشركة العاملة في هذا القطاع"' : ' data-ar="الشركات العاملة في هذا القطاع"'}>${n === 1 ? 'The company working here' : 'The companies working here'}</h2>
    </div>
    <div class="idx">
${companyIndex(cos, { showSector: false })}
    </div>
  </div>
</section>

` : ''}<section class="section tight" aria-labelledby="othTitle">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow" data-ar="بقية المجموعة">The rest of the Group</span>
      <h2 id="othTitle" data-ar="القطاعات الأخرى">The other sectors</h2>
    </div>
    ${sectorIndex(others)}
  </div>
</section>

`
    + ctaBand()
    + footer();
}

function pagePartnerships() {
  return head({
    title: `Partnerships · ${SITE.name}`,
    desc: 'Lusail Corp works with suppliers, producers, distributors, business partners and entrepreneurs in Qatar and international markets.',
    url: '/partnerships/', image: 'grain-still.jpg'
  })
    + header('/partnerships/')
    + opener({
      crumb: 'Partnerships', crumbAr: 'الشراكات',
      h1: 'Better Opportunities Begin With Strong Partnerships.',
      h1Ar: 'الفرص الأفضل تبدأ بشراكات قوية.',
      lede: 'Lusail Corp works with businesses, suppliers and commercial partners in Qatar and international markets.',
      ledeAr: 'تعمل لوسيل كورب مع شركات وموردين وشركاء تجاريين في قطر والأسواق الدولية.'
    })
    + `<section class="section tight" aria-labelledby="ptTitle">
  <div class="wrap">
    <div class="sec-head row">
      <div>
        <span class="eyebrow" data-ar="لنبنِ معاً">Let&rsquo;s build business together</span>
        <h2 id="ptTitle" data-ar="من نودّ التحدث إليه">Who we want to hear from</h2>
      </div>
      <p class="lede" data-ar="تعتمد شركاتنا على علاقات قوية في أسواقها، ونحن مهتمون بتطوير علاقات مع:">Our companies depend on strong relationships across their respective markets. We are interested in developing relationships with:</p>
    </div>
    ${iconRows(PARTNER_TYPES)}
  </div>
</section>

<section class="section stone" aria-labelledby="philTitle">
  <div class="wrap split">
    <div>
      <span class="eyebrow" data-ar="فلسفتنا في الشراكة">Our partnership philosophy</span>
      <h2 id="philTitle" class="statement" data-ar="علاقات مبنية للمدى الطويل">Relationships Built for the Long Term</h2>
      <div class="prose">
        <p data-ar="نؤمن بأن الشراكات الناجحة تقوم على الشفافية وتوافق المصالح والتنفيذ الموثوق.">We believe successful partnerships are based on transparency, aligned interests and reliable execution.</p>
        <p data-ar="هدفنا ليس مجرد إتمام الصفقات، بل بناء علاقات تجارية قادرة على النمو مع الوقت.">Our objective is not simply to complete transactions. It is to build commercial relationships that have the potential to grow over time.</p>
      </div>
    </div>
    <div class="aside">
      <h3 data-ar="ابدأ الحديث">Start a conversation</h3>
      <dl>
        <div><dt data-ar="البريد الإلكتروني">Email</dt><dd><a class="tl" href="mailto:${SITE.contact.email}">${SITE.contact.email}</a></dd></div>
        <div><dt data-ar="الهاتف">Phone</dt><dd><a class="tl" href="tel:${SITE.contact.phone.replace(/\s/g, '')}" dir="ltr">${esc(SITE.contact.phone)}</a></dd></div>
      </dl>
      <a class="btn btn-gold" href="/contact/" data-ar="ابدأ الحديث">Start a Conversation</a>
    </div>
  </div>
</section>

`
    + ctaBand()
    + footer();
}

function pageCareers() {
  const roles = OPEN_ROLES.length
    ? `<div class="roles">
${OPEN_ROLES.map(r => `      <a class="role" href="mailto:${SITE.contact.email}?subject=${encodeURIComponent('Application — ' + r.t)}">
        <h3>${esc(r.t)}</h3>
        <span class="meta">${esc(r.co)}</span>
        <span class="meta">${esc(r.loc)}</span>
        <span class="go" data-ar="تقديم">Apply</span>
      </a>`).join('\n')}
    </div>`
    : `<div class="split">
      <div>
        <h3 class="statement" data-ar="لا توجد وظيفة شاغرة حالياً؟">No Current Opening?</h3>
        <div class="prose" style="margin-top:20px">
          <p data-ar="يسعدنا دائماً التعرّف على الكفاءات.">We are always interested in meeting talented people.</p>
          <p data-ar="أرسل سيرتك الذاتية وأخبرنا كيف يمكنك الإسهام في لوسيل كورب أو في إحدى شركات المحفظة.">Send your CV and tell us how you believe you could contribute to Lusail Corp or one of our portfolio companies.</p>
        </div>
      </div>
      <div class="aside">
        <h3 data-ar="أرسل سيرتك الذاتية">Send your CV</h3>
        <dl>
          <div><dt data-ar="البريد الإلكتروني">Email</dt><dd><a class="tl" href="mailto:${SITE.contact.email}">${SITE.contact.email}</a></dd></div>
          <div><dt data-ar="أرفق">Include</dt><dd data-ar="سيرتك الذاتية، والشركة أو المجال الذي يهمّك.">Your CV, and which company or area interests you.</dd></div>
        </dl>
      </div>
    </div>`;

  return head({
    title: `Careers · ${SITE.name}`,
    desc: 'Lusail Corp is building businesses across multiple industries, creating opportunities for people with different backgrounds, skills and ambitions.',
    url: '/careers/', image: 'coffee-still.jpg'
  })
    + header('/careers/')
    + opener({
      crumb: 'Careers', crumbAr: 'الوظائف',
      h1: 'Build With Us.', h1Ar: 'ابنِ معنا.',
      lede: 'Lusail Corp is building businesses across multiple industries, creating opportunities for people with different backgrounds, skills and ambitions.',
      ledeAr: 'تبني لوسيل كورب أعمالاً في صناعات متعددة، وتخلق فرصاً لأصحاب الخلفيات والمهارات والطموحات المختلفة.'
    })
    + `<section class="section tight">
  <div class="wrap">
    <p class="lead-para" data-ar="سواء كان العمل مع المجموعة مباشرة أو داخل إحدى شركات المحفظة، فإن موظفينا جزء من منظومة متنامية تُقدَّر فيها المبادرة والتنفيذ.">Whether working directly with the Group or within one of our portfolio companies, our people are part of a growing organization where initiative and execution matter.</p>
  </div>
</section>

<section class="section tight">
  <div class="wrap">
    <div class="imgrow">
      <figure><img src="/assets/img/careers-a.jpg" alt="" width="1000" height="750" loading="lazy"></figure>
      <figure><img src="/assets/img/careers-b.jpg" alt="" width="1000" height="750" loading="lazy"></figure>
      <figure><img src="/assets/img/careers-c.jpg" alt="" width="1000" height="750" loading="lazy"></figure>
    </div>
  </div>
</section>

<section class="section stone" aria-labelledby="cvTitle">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow" data-ar="ما نقدّره">What We Value</span>
      <h2 id="cvTitle" data-ar="الصفات التي نبحث عنها">The qualities we look for</h2>
    </div>
    <div class="vals">
${CAREER_VALUES.map(v => `      <div class="val">
        ${icon(v.icon)}
        <h3${t(v.t, v.tAr)}>${esc(v.t)}</h3>
      </div>`).join('\n')}
    </div>
  </div>
</section>

<section class="section tight" aria-labelledby="joinTitle">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow" data-ar="انضم إلينا">Join Our Group</span>
      <h2 id="joinTitle" data-ar="كلما نمت المحفظة، نمت الفرص داخلها.">As our portfolio grows, so will the opportunities within it.</h2>
    </div>
    ${roles}
  </div>
</section>

`
    + footer();
}

function pageContact() {
  const areas = [
    { v: 'general', t: 'General Enquiry', tAr: 'استفسار عام' },
    ...ALL_COMPANIES.map(c => ({ v: c.slug, t: c.name, tAr: c.nameAr })),
    { v: 'supplier', t: 'Supplier Opportunity', tAr: 'فرصة توريد' },
    { v: 'partnership', t: 'Business Partnership', tAr: 'شراكة تجارية' },
    { v: 'careers', t: 'Careers', tAr: 'الوظائف' },
    { v: 'other', t: 'Other', tAr: 'أخرى' }
  ];

  return head({
    title: `Contact · ${SITE.name}`,
    desc: 'Contact Lusail Corp about our companies, supply, commercial opportunities or careers.',
    url: '/contact/', image: 'coffee-still.jpg'
  })
    + header('/contact/')
    + opener({
      crumb: 'Contact', crumbAr: 'تواصل معنا',
      h1: 'Let’s Connect.', h1Ar: 'لنتواصل.',
      lede: 'Whether you are interested in working with one of our companies, becoming a supplier, discussing a commercial opportunity or learning more about Lusail Corp, we would be pleased to hear from you.',
      ledeAr: 'سواء كنت مهتماً بالعمل مع إحدى شركاتنا أو أن تصبح مورّداً أو مناقشة فرصة تجارية أو معرفة المزيد عن لوسيل كورب، يسعدنا أن نسمع منك.'
    })
    + `<section class="section tight">
  <div class="wrap split">
    <div>
      <span class="eyebrow" data-ar="تواصل مباشر">Direct contact</span>
      <dl class="channels">
        <div><dt data-ar="البريد الإلكتروني">Email</dt><dd><a href="mailto:${SITE.contact.email}">${SITE.contact.email}</a></dd></div>
        <div><dt data-ar="الهاتف">Phone</dt><dd><a href="tel:${SITE.contact.phone.replace(/\s/g, '')}" dir="ltr">${esc(SITE.contact.phone)}</a></dd></div>
        <div><dt data-ar="الموقع">Location</dt><dd${t(SITE.contact.location, SITE.contact.locationAr)}>${esc(SITE.contact.location)}</dd></div>
        <div><dt data-ar="التوجيه">Routing</dt><dd data-ar="اختر مجال الاهتمام وسنحوّل رسالتك إلى القسم المختص.">Pick an area of interest and we route your message to the right desk.</dd></div>
      </dl>
    </div>
    <form id="form" novalidate data-mailto="${SITE.contact.email}">
      <div class="hp" aria-hidden="true">
        <label for="fSite">Website</label>
        <input id="fSite" name="website" type="text" tabindex="-1" autocomplete="off">
      </div>
      <div class="field"><label for="fName" data-ar="الاسم الكامل">Full Name</label><input id="fName" name="name" autocomplete="name" required></div>
      <div class="field"><label for="fCompany" data-ar="الشركة">Company</label><input id="fCompany" name="company" autocomplete="organization"></div>
      <div class="field"><label for="fMail" data-ar="البريد الإلكتروني">Email Address</label><input id="fMail" name="email" type="email" autocomplete="email" required></div>
      <div class="field"><label for="fPhone" data-ar="رقم الهاتف">Phone Number</label><input id="fPhone" name="phone" type="tel" autocomplete="tel"></div>
      <div class="field full"><label for="fArea" data-ar="مجال الاهتمام">Area of Interest</label>
        <select id="fArea" name="area">
${areas.map(a => `          <option value="${a.v}"${t(a.t, a.tAr)}>${esc(a.t)}</option>`).join('\n')}
        </select></div>
      <div class="field full"><label for="fMsg" data-ar="الرسالة">Message</label><textarea id="fMsg" name="message" required></textarea></div>
      <div class="form-end">
        <button class="btn btn-gold" type="submit" data-ar="إرسال الاستفسار">Submit Enquiry</button>
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
    + opener({
      crumb: '404', crumbAr: '404',
      h1: 'That page does not exist', h1Ar: 'الصفحة غير موجودة',
      lede: 'The link may have changed. Try our companies, or go back to the home page.',
      ledeAr: 'ربما تغيّر الرابط. جرّب صفحة الشركات أو عد إلى الصفحة الرئيسية.'
    })
    + `<section class="section tight">
  <div class="wrap">
    <div class="hero-cta" style="margin-top:0">
      <a class="btn btn-gold" href="/" data-ar="الصفحة الرئيسية">Home</a>
      <a class="btn btn-ink" href="/companies/" data-ar="شركاتنا">Our Companies</a>
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

function build() {
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  console.log('pages');
  write('index.html', pageHome());
  write('about/index.html', pageAbout());
  write('companies/index.html', pageCompaniesIndex());
  // one page per company, from the flat list, so a company listed in two
  // sectors is still written exactly once
  ALL_COMPANIES.forEach(c =>
    write(`companies/${c.slug}/index.html`,
      pageCompany(c, SECTORS.find(s => s.slug === c.sectorSlug))));
  write('sectors/index.html', pageSectorsIndex());
  SECTORS.forEach((s, i) => write(`sectors/${s.slug}/index.html`, pageSector(s, i)));
  write('partnerships/index.html', pagePartnerships());
  write('careers/index.html', pageCareers());
  write('contact/index.html', pageContact());
  write('404.html', page404());

  console.log('assets');
  copyDir(path.join(ROOT, 'assets/css'), path.join(OUT, 'assets/css'));
  copyDir(path.join(ROOT, 'assets/js'), path.join(OUT, 'assets/js'));
  copyDir(path.join(ROOT, 'site-assets/logo'), path.join(OUT, 'assets/logo'));
  copyDir(path.join(ROOT, 'site-assets/img'), path.join(OUT, 'assets/img'));

  const urls = ['/', '/about/', '/companies/', ...ALL_COMPANIES.map(c => `/companies/${c.slug}/`),
    '/sectors/', ...SECTORS.map(s => `/sectors/${s.slug}/`), '/partnerships/', '/careers/', '/contact/'];
  fs.writeFileSync(path.join(OUT, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE.domain}/sitemap.xml\n`);
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url><loc>${SITE.domain}${u}</loc></url>`).join('\n') +
    `\n</urlset>\n`);

  console.log('  robots.txt, sitemap.xml (' + urls.length + ' urls)');
  console.log(`done -> dist/  (${SECTORS.length} sectors, ${ALL_COMPANIES.length} companies)`);
}

build();
