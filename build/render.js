/* ==========================================================================
   Lusail Corp — static site generator.

   Reads /data/site.js, writes finished HTML into /dist. No dependencies.
   Run with:  npm run build

   Two tiers: a sector holds any number of companies.
     /sectors/            every sector
     /sectors/<slug>/     one sector and the companies in it
     /companies/          every company, filterable by sector
     /companies/<slug>/   one company

   Design is editorial: pages open with type on paper, never with text over a
   photograph. Photography appears as a captioned plate where it is strong,
   or as a contained still where the source is a cutout product shot.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const { SITE, SECTORS, ALL_COMPANIES, PILLARS, OPEN_ROLES } = require('../data/site.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'dist');

/* ---------- helpers ---------------------------------------------------- */

const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Bilingual node: English is the content, Arabic rides in data-ar.
const t = (en, ar) => ar ? ` data-ar="${esc(ar)}"` : '';

// Referenced as files so the browser caches them once rather than re-reading
// 22KB of path data on every page. Full colour on the paper header, reversed
// on the green footer.
const LOGO_DARK = '<img src="/assets/logo/lusail-corp-horizontal-full-color.svg" alt="" width="574" height="112">';
const LOGO_LIGHT = '<img src="/assets/logo/lusail-corp-horizontal-reversed.svg" alt="" width="574" height="112">';

const num = i => String(i + 1).padStart(2, '0');
const tel = p => p.replace(/\s/g, '');
const plural = (n, one, many) => n === 1 ? `1 ${one}` : `${n} ${many}`;
const pluralAr = (n, one, many) => n === 1 ? one : n + ' ' + many;

/* ---------- chrome ----------------------------------------------------- */

function head({ title, desc, url, image }) {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#FBFBF9">
<link rel="canonical" href="${SITE.domain}${url}">

<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE.domain}${url}">
${image ? `<meta property="og:image" content="${SITE.domain}/assets/img/${image}">` : ''}
<meta name="twitter:card" content="summary_large_image">

<link rel="icon" href="/assets/logo/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/assets/logo/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/assets/logo/apple-touch-icon.png">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Marcellus&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Noto+Kufi+Arabic:wght@400;500;600&display=swap" rel="stylesheet">
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

/* With several companies inside a sector a flat nav stops working; hovering
   "What we do" opens the whole group at once. */
function megaMenu() {
  return `      <div class="mega" id="mega" hidden>
        <div class="wrap mega-in">
${SECTORS.map(s => `          <div class="mega-col">
            <a class="mega-sec" href="/sectors/${s.slug}/"${t(s.name, s.nameAr)}>${esc(s.name)}</a>
            <ul>
${s.companies.map(c => `              <li><a href="/companies/${c.slug}/"${t(c.name, c.nameAr)}>${esc(c.name)}</a></li>`).join('\n')}
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
    <a class="brand" href="/" aria-label="${esc(SITE.name)} — home">${LOGO_DARK}</a>
    <nav class="nav" id="nav" aria-label="Main">
${links}
    </nav>
    <div class="head-tools">
      <button class="lang" id="langBtn" type="button" aria-label="Switch language">عربي</button>
      <a class="btn btn-gold" href="/contact/" data-ar="تواصل معنا">Contact us</a>
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
  const secs = SECTORS.map(s =>
    `        <li><a href="/sectors/${s.slug}/"${t(s.name, s.nameAr)}>${esc(s.name)}</a></li>`
  ).join('\n');
  const group = SITE.nav.map(n =>
    `        <li><a href="${n.href}"${t(n.label, n.labelAr)}>${esc(n.label)}</a></li>`
  ).join('\n');

  return `</main>
<footer class="site-foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="brand" href="/" aria-label="${esc(SITE.name)} — home">${LOGO_LIGHT}</a>
        <p class="foot-blurb" data-ar="مجموعة قطرية تمتلك وتنمّي شركات تشغيلية في الأغذية والبن والطاقة والمقاولات والخدمات اللوجستية.">A Qatari group that owns and grows operating companies in food, coffee, energy, contracting and logistics.</p>
      </div>
      <div class="foot-links">
        <h4 data-ar="ما نقوم به">What we do</h4>
        <ul>
${secs}
        </ul>
      </div>
      <div class="foot-links">
        <h4 data-ar="المجموعة">Group</h4>
        <ul>
${group}
        </ul>
      </div>
      <div>
        <h4 data-ar="تواصل">Get in touch</h4>
        <ul>
          <li><a href="mailto:${SITE.contact.email}">${SITE.contact.email}</a></li>
          <li><a href="tel:${tel(SITE.contact.phone)}" dir="ltr">${SITE.contact.phone}</a></li>
          <li><span data-ar="${esc(SITE.contact.officeAr)}">${esc(SITE.contact.office)}</span></li>
        </ul>
      </div>
    </div>
    <div class="legal">
      <span data-ar="© ٢٠٢٦ لوسيل كورب القابضة. جميع الحقوق محفوظة.">© 2026 ${esc(SITE.name)} Holding Company. All rights reserved.</span>
      <span data-ar="سياسة الخصوصية · الشروط">Privacy policy · Terms</span>
    </div>
  </div>
</footer>
<script src="/assets/js/site.js" defer></script>
</body>
</html>
`;
}

/* ---------- reusable blocks -------------------------------------------- */

// A typographic opener. Nothing is ever written over a photograph.
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

/* A photograph given its own width, with the caption underneath where a
   caption belongs. Only used for images strong enough to carry it. */
function plate(photo, caption, captionAr, credit) {
  return `<figure class="plate">
      <img src="/assets/img/${photo}-wide.jpg" alt="${esc(caption)}" width="2400" height="1029" loading="lazy">
      <figcaption>
        <b${t(caption, captionAr)}>${esc(caption)}</b>
        ${credit ? `<span${t(credit.en, credit.ar)}>${esc(credit.en)}</span>` : ''}
      </figcaption>
    </figure>`;
}

/* A cutout product shot, contained on its own white. */
function still(photo, caption, captionAr) {
  return `<figure class="still">
        <img src="/assets/img/${photo}-still.jpg" alt="${esc(caption)}" width="1100" height="1100" loading="lazy">
        <figcaption${t(caption, captionAr)}>${esc(caption)}</figcaption>
      </figure>`;
}

/* The sector index: a list you read, not a carousel you operate. */
function sectorIndex(list) {
  return `<div class="idx">
${list.map(s => {
    const i = SECTORS.indexOf(s);
    const n = s.companies.length;
    return `      <a href="/sectors/${s.slug}/">
        <span class="n">${num(i)}</span>
        <span>
          <h3${t(s.name, s.nameAr)}>${esc(s.name)}</h3>
          <span class="sub"${t(s.short, s.shortAr)}>${esc(s.short)}</span>
        </span>
        <span class="meta"${t(plural(n, 'company', 'companies'), pluralAr(n, 'شركة واحدة', 'شركات'))}>${plural(n, 'company', 'companies')}</span>
        <span class="go" aria-hidden="true">&#8594;</span>
      </a>`;
  }).join('\n')}
    </div>`;
}

/* The same list form, for companies. */
function companyIndex(list, { showSector = true } = {}) {
  return list.map((c, i) => {
    const metaEn = showSector && c.sectorName ? c.sectorName : c.role;
    const metaAr = showSector && c.sectorNameAr ? c.sectorNameAr : c.roleAr;
    return `      <a href="/companies/${c.slug}/" data-sector="${c.sectorSlug || ''}">
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

function pillarsBlock() {
  return `<div class="pillars">
${PILLARS.map((p, i) => `      <div class="pillar">
        <span class="n">${num(i)}</span>
        <h3${t(p.t, p.tAr)}>${esc(p.t)}</h3>
        <p${t(p.d, p.dAr)}>${esc(p.d)}</p>
      </div>`).join('\n')}
    </div>`;
}

function ctaBand() {
  return `<section class="cta">
  <div class="wrap">
    <div>
      <h2 data-ar="لنعمل معاً">Let's work together</h2>
      <p data-ar="سواء كنت مورّداً أو شريكاً أو تبحث عن فرصة عمل، سيصلك ردّ من الفريق المختص.">Whether you're a supplier, a partner or looking for a job, the right team will reply.</p>
    </div>
    <a class="btn btn-gold" href="/contact/" data-ar="تواصل معنا">Get in touch</a>
  </div>
</section>
`;
}

function statsBand() {
  return `<section class="stats">
  <dl class="wrap">
    <div><dd>${SECTORS.length}</dd><dt data-ar="قطاعات">Sectors</dt></div>
    <div><dd>${ALL_COMPANIES.length}</dd><dt data-ar="شركات تشغيلية">Operating companies</dt></div>
    <div><dd data-ar="لوسيل، قطر">Lusail, Qatar</dd><dt data-ar="المقر الرئيسي">Headquarters</dt></div>
    <div><dd data-ar="قطرية بالكامل">Wholly Qatari</dd><dt data-ar="الملكية">Ownership</dt></div>
  </dl>
</section>
`;
}

/* ---------- pages ------------------------------------------------------ */

function pageHome() {
  return head({
    title: `${SITE.name} · Holding Company`,
    desc: `A Qatari holding company. ${ALL_COMPANIES.length} operating companies across ${SECTORS.length} sectors: food, coffee, energy, contracting and logistics.`,
    url: '/', image: 'port-wide.jpg'
  })
    + header('/')
    + `<section class="hero">
  <div class="wrap">
    <span class="crumb" data-ar="لوسيل كورب — شركة قابضة">${esc(SITE.name)} — Holding Company</span>
    <h1 data-ar="مجموعة واحدة. شركات تبني وتنقل وتُطعم قطر.">One group. Companies that build, move and feed Qatar.</h1>
    <p class="lede" data-ar="نمتلك وننمّي شركات تشغيلية، ونمنح كلاً منها رأس المال والحوكمة اللذين لا تحصل عليهما وحدها.">We own and grow operating companies, and give each the capital and governance it would not have alone.</p>
    <div class="hero-cta">
      <a class="btn btn-gold" href="/sectors/" data-ar="ما نقوم به">What we do</a>
      <a class="btn btn-ink" href="/companies/" data-ar="شركاتنا">Our companies</a>
    </div>
  </div>
</section>

`
    + statsBand()
    + `
<section class="section" aria-labelledby="secTitle">
  <div class="wrap">
    <div class="sec-head row">
      <div>
        <span class="eyebrow" data-ar="ما نقوم به">What we do</span>
        <h2 id="secTitle" data-ar="خمسة قطاعات. بعضها يضم أكثر من شركة.">Five sectors. Some hold more than one company.</h2>
      </div>
      <a class="btn btn-ink" href="/companies/"${t('All ' + ALL_COMPANIES.length + ' companies', 'جميع الشركات')}>All ${ALL_COMPANIES.length} companies</a>
    </div>
    ${sectorIndex(SECTORS)}
  </div>
</section>

<section class="section tight">
  <div class="wrap">
    ${plate('port', 'Container operations at the terminal the group ships through.',
            'عمليات الحاويات في المحطة التي تشحن المجموعة عبرها.',
            { en: 'Shipping and logistics', ar: 'الشحن والخدمات اللوجستية' })}
  </div>
</section>

<section class="section" aria-labelledby="stTitle">
  <div class="wrap split">
    <div>
      <span class="eyebrow" data-ar="من نحن">Who we are</span>
      <h2 id="stTitle" class="statement" data-ar="نمتلك شركات يعتمد عليها الناس كل يوم، ونمنحها الأساس الذي تنمو عليه لعقود.">We own businesses people rely on every day, and give them the foundation to grow for decades.</h2>
      <div class="prose">
        <p data-ar="تجمع لوسيل كورب شركات تشغيلية تحت كيان واحد. تحتفظ كل شركة بفريقها وعلامتها وعملائها، بينما توفّر المجموعة رأس المال والحوكمة والخدمات المشتركة.">Lusail Corp brings operating companies under one structure. Each keeps its own team, name and customers, while the group provides capital, governance and shared services.</p>
        <p data-ar="بعض القطاعات تضم أكثر من شركة واحدة، وهذا مقصود: التجارة بالجملة والتعبئة للتجزئة نشاطان مختلفان، ودمجهما في شركة واحدة يُضعف كليهما.">Some sectors hold more than one company, and that is deliberate: bulk trading and retail packing are different businesses, and folding them into one company weakens both.</p>
        <p><a class="tl" href="/about/" data-ar="المزيد عن المجموعة">More about the group</a></p>
      </div>
    </div>
    <dl class="facts">
      <div><dt data-ar="المقر الرئيسي">Headquarters</dt><dd data-ar="لوسيل، قطر">Lusail, Qatar</dd></div>
      <div><dt data-ar="القطاعات">Sectors</dt><dd>${SECTORS.length}</dd></div>
      <div><dt data-ar="الشركات التشغيلية">Operating companies</dt><dd>${ALL_COMPANIES.length}</dd></div>
      <div><dt data-ar="الملكية">Ownership</dt><dd data-ar="قطرية بالكامل">Wholly Qatari owned</dd></div>
    </dl>
  </div>
</section>

<section class="section stone" aria-labelledby="apTitle">
  <div class="wrap">
    <div class="sec-head row">
      <div>
        <span class="eyebrow" data-ar="نهجنا">Our approach</span>
        <h2 id="apTitle" data-ar="ما تقدمه المجموعة لكل شركة">What the group gives every company</h2>
      </div>
      <p class="lede" data-ar="دور الشركة القابضة أن تجعل كل شركة تابعة أقوى مما لو عملت وحدها.">A holding company's job is to make each business stronger than it would be on its own.</p>
    </div>
    ${pillarsBlock()}
  </div>
</section>

`
    + ctaBand()
    + footer();
}

function pageSectorsIndex() {
  return head({
    title: `What we do · ${SITE.name}`,
    desc: `The ${SECTORS.length} sectors Lusail Corp operates in, and the ${ALL_COMPANIES.length} companies inside them.`,
    url: '/sectors/', image: 'contracting-wide.jpg'
  })
    + header('/sectors/')
    + opener({
      crumb: 'What we do', crumbAr: 'ما نقوم به',
      h1: `${SECTORS.length} sectors, ${ALL_COMPANIES.length} companies`,
      h1Ar: `${SECTORS.length} قطاعات، ${ALL_COMPANIES.length} شركات`,
      lede: 'A sector is a line of work. Some are served by one company, some by two, because the jobs inside them are genuinely different.',
      ledeAr: 'القطاع خط عمل. بعضها تخدمه شركة واحدة وبعضها شركتان، لأن المهام داخله مختلفة فعلاً.'
    })
    + `<section class="section tight">
  <div class="wrap">
    ${sectorIndex(SECTORS)}
  </div>
</section>

<section class="section tight">
  <div class="wrap">
    ${plate('contracting', 'Structural works in progress on a residential scheme.',
            'أعمال إنشائية جارية في مشروع سكني.',
            { en: 'Contracting', ar: 'المقاولات' })}
  </div>
</section>

`
    + ctaBand()
    + footer();
}

function pageSector(s, i) {
  const others = SECTORS.filter(x => x.slug !== s.slug);
  const cos = s.companies.map(c => Object.assign({}, c, {
    sectorSlug: s.slug, sectorName: s.name, sectorNameAr: s.nameAr,
    photo: c.photo || s.photo, photoStyle: c.photoStyle || s.photoStyle
  }));
  const body = s.body.map((p, k) => `        <p${t(p, s.bodyAr && s.bodyAr[k])}>${esc(p)}</p>`).join('\n');
  const n = s.companies.length;
  const isStill = s.photoStyle === 'still';

  const companyAside = `    <div class="aside">
      <h3 data-ar="الشركات في هذا القطاع">Companies in this sector</h3>
      <ol class="mini">
${s.companies.map((c, k) => `        <li><a href="/companies/${c.slug}/"><span class="n">${num(k)}</span><span><b${t(c.name, c.nameAr)}>${esc(c.name)}</b><em${t(c.role, c.roleAr)}>${esc(c.role)}</em></span></a></li>`).join('\n')}
      </ol>
    </div>`;

  return head({
    title: `${s.name} · ${SITE.name}`, desc: s.short,
    url: `/sectors/${s.slug}/`, image: `${s.photo}-${isStill ? 'still' : 'wide'}.jpg`
  })
    + header('/sectors/')
    + opener({
      crumb: `What we do — ${num(i)}`, crumbAr: `ما نقوم به — ${num(i)}`,
      h1: s.name, h1Ar: s.nameAr,
      lede: s.intro, ledeAr: s.introAr,
      meta: `<span${t(plural(n, 'company in this sector', 'companies in this sector'), pluralAr(n, 'شركة واحدة في هذا القطاع', 'شركات في هذا القطاع'))}>${plural(n, 'company in this sector', 'companies in this sector')}</span>`
    })
    + (isStill ? '' : `<section class="section tight">
  <div class="wrap">
    ${plate(s.photo, s.photoCaption || s.short, s.photoCaptionAr || s.shortAr, { en: s.name, ar: s.nameAr })}
  </div>
</section>

`)
    + `<section class="section tight">
  <div class="wrap split">
    <div>
      <span class="eyebrow" data-ar="القطاع">The sector</span>
      <div class="prose">
${body}
      </div>
    </div>
${isStill
      ? `    <div class="aside">
      ${still(s.photo, s.photoCaption || s.short, s.photoCaptionAr || s.shortAr)}
      <h3 data-ar="الشركات في هذا القطاع">Companies in this sector</h3>
      <ol class="mini">
${s.companies.map((c, k) => `        <li><a href="/companies/${c.slug}/"><span class="n">${num(k)}</span><span><b${t(c.name, c.nameAr)}>${esc(c.name)}</b><em${t(c.role, c.roleAr)}>${esc(c.role)}</em></span></a></li>`).join('\n')}
      </ol>
    </div>`
      : companyAside}
  </div>
</section>

<section class="section stone" aria-labelledby="coTitle">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow" data-ar="الشركات">Companies</span>
      <h2 id="coTitle"${n === 1 ? ' data-ar="الشركة التي تعمل في هذا القطاع"' : ' data-ar="الشركات التي تعمل في هذا القطاع"'}>${n === 1 ? 'The company working here' : 'The companies working here'}</h2>
    </div>
    <div class="idx">
${companyIndex(cos, { showSector: false })}
    </div>
  </div>
</section>

<section class="section tight" aria-labelledby="othTitle">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow" data-ar="بقية المجموعة">The rest of the group</span>
      <h2 id="othTitle" data-ar="القطاعات الأخرى">The other sectors</h2>
    </div>
    ${sectorIndex(others)}
  </div>
</section>

`
    + footer();
}

/* One list of every company, sliced by sector without a page reload. */
function pageCompaniesIndex() {
  const chips = [
    `      <button type="button" class="chip" data-filter="all" aria-pressed="true"><span data-ar="الكل">All</span> <em>${ALL_COMPANIES.length}</em></button>`,
    ...SECTORS.map(s =>
      `      <button type="button" class="chip" data-filter="${s.slug}" aria-pressed="false"><span${t(s.name, s.nameAr)}>${esc(s.name)}</span> <em>${s.companies.length}</em></button>`)
  ].join('\n');

  return head({
    title: `Our companies · ${SITE.name}`,
    desc: `All ${ALL_COMPANIES.length} operating companies of Lusail Corp, filterable by sector.`,
    url: '/companies/', image: 'warehouse-wide.jpg'
  })
    + header('/companies/')
    + opener({
      crumb: 'Our companies', crumbAr: 'شركاتنا',
      h1: `All ${ALL_COMPANIES.length} companies`, h1Ar: `جميع الشركات (${ALL_COMPANIES.length})`,
      lede: 'Every operating company in the group. Filter by sector, or open any one for what it does and who to contact.',
      ledeAr: 'كل شركة تشغيلية في المجموعة. صفِّ حسب القطاع، أو افتح أي شركة لمعرفة ما تفعله ومن تتواصل معه.'
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
  const siblings = sector.companies.filter(x => x.slug !== c.slug);
  const photo = c.photo || sector.photo;
  const isStill = (c.photoStyle || sector.photoStyle) === 'still';

  const caps = c.caps.map((cap, k) => {
    const ar = (c.capsAr && c.capsAr[k]) || null;
    return `      <li>
        <span class="n">${num(k)}</span>
        <div><b${t(cap.t, ar && ar.t)}>${esc(cap.t)}</b><span${t(cap.d, ar && ar.d)}>${esc(cap.d)}</span></div>
      </li>`;
  }).join('\n');

  const body = c.body.map((p, k) => `        <p${t(p, c.bodyAr && c.bodyAr[k])}>${esc(p)}</p>`).join('\n');

  const figs = c.figs && c.figs.length
    ? `      <dl class="facts" style="margin-top:34px">
${c.figs.map(f => `        <div><dt${t(f.l, f.lAr)}>${esc(f.l)}</dt><dd>${esc(f.v)}</dd></div>`).join('\n')}
      </dl>`
    : '';

  return head({
    title: `${c.name} · ${SITE.name}`, desc: c.short,
    url: `/companies/${c.slug}/`, image: `${photo}-${isStill ? 'still' : 'wide'}.jpg`
  })
    + header('/companies/')
    + opener({
      crumb: sector.name, crumbAr: sector.nameAr,
      h1: c.name, h1Ar: c.nameAr,
      lede: c.intro, ledeAr: c.introAr,
      meta: `<span${t(c.role, c.roleAr)}>${esc(c.role)}</span> &middot; <a href="/sectors/${sector.slug}/"${t(sector.name, sector.nameAr)}>${esc(sector.name)}</a>`
    })
    + (isStill ? '' : `<section class="section tight">
  <div class="wrap">
    ${plate(photo, c.short, c.shortAr, { en: c.name, ar: c.nameAr })}
  </div>
</section>

`)
    + `<section class="section tight">
  <div class="wrap split">
    <div>
      <span class="eyebrow" data-ar="الشركة">The company</span>
      <div class="prose">
${body}
      </div>
${figs}
    </div>
    <div class="aside">
      ${isStill ? still(photo, c.short, c.shortAr) : ''}
      <h3 data-ar="تواصل">Get in touch</h3>
      <dl>
        <div><dt data-ar="الدور">Role</dt><dd${t(c.role, c.roleAr)}>${esc(c.role)}</dd></div>
        <div><dt data-ar="القطاع">Sector</dt><dd><a class="tl" href="/sectors/${sector.slug}/"${t(sector.name, sector.nameAr)}>${esc(sector.name)}</a></dd></div>
        <div><dt data-ar="البريد الإلكتروني">Email</dt><dd><a class="tl" href="mailto:${SITE.contact.email}">${SITE.contact.email}</a></dd></div>
        <div><dt data-ar="الهاتف">Phone</dt><dd><a class="tl" href="tel:${tel(SITE.contact.phone)}" dir="ltr">${SITE.contact.phone}</a></dd></div>
      </dl>
      <a class="btn btn-ink" href="/contact/" data-ar="راسل هذه الشركة">Message this company</a>
    </div>
  </div>
</section>

<section class="section stone" aria-labelledby="capTitle">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow" data-ar="القدرات">Capabilities</span>
      <h2 id="capTitle" data-ar="ما تتولاه هذه الشركة">What this company handles</h2>
    </div>
    <ul class="caps">
${caps}
    </ul>
  </div>
</section>

${siblings.length ? `<section class="section tight" aria-labelledby="sibTitle">
  <div class="wrap">
    <div class="sec-head row">
      <div>
        <span class="eyebrow"${t(sector.name, sector.nameAr)}>${esc(sector.name)}</span>
        <h2 id="sibTitle" data-ar="الشركة الأخرى في هذا القطاع">${siblings.length === 1 ? 'The other company in this sector' : 'The other companies in this sector'}</h2>
      </div>
      <a class="btn btn-ink" href="/sectors/${sector.slug}/"${t('All of ' + sector.name, 'كل ' + sector.nameAr)}>All of ${esc(sector.name)}</a>
    </div>
    <div class="idx">
${companyIndex(siblings.map(x => Object.assign({}, x, { sectorSlug: sector.slug })), { showSector: false })}
    </div>
  </div>
</section>

` : ''}`
    + ctaBand()
    + footer();
}

function pageAbout() {
  return head({
    title: `About · ${SITE.name}`,
    desc: 'How Lusail Corp is structured, how it is governed, and what the group provides each of its operating companies.',
    url: '/about/', image: 'boardroom-wide.jpg'
  })
    + header('/about/')
    + opener({
      crumb: 'About', crumbAr: 'من نحن',
      h1: `One owner, ${ALL_COMPANIES.length} operating companies`,
      h1Ar: `مالك واحد، ${ALL_COMPANIES.length} شركات تشغيلية`,
      lede: 'Lusail Corp is a holding company. It does not trade, build or ship itself — it owns the companies that do, and is accountable for how they are run.',
      ledeAr: 'لوسيل كورب شركة قابضة. لا تتاجر ولا تبني ولا تشحن بنفسها، بل تمتلك الشركات التي تفعل ذلك، وتتحمل مسؤولية طريقة إدارتها.'
    })
    + statsBand()
    + `
<section class="section">
  <div class="wrap split">
    <div>
      <span class="eyebrow" data-ar="الهيكل">Structure</span>
      <h2 class="statement" data-ar="شركة قابضة تُقاس بقوة الشركات التي تمتلكها.">A holding company is judged by the strength of the businesses it owns.</h2>
      <div class="prose">
        <p data-ar="تحتفظ كل شركة تشغيلية بإدارتها وعلامتها وعلاقاتها مع عملائها. لا تدير المجموعة العمل اليومي، بل تعيّن مجالس الإدارة وتضع المعايير وتوفّر رأس المال وتحاسب على النتائج.">Each operating company keeps its own management, name and customer relationships. The group does not run the day-to-day — it appoints boards, sets standards, provides capital and holds each company to its results.</p>
        <p data-ar="هذا الفصل مقصود. أفضل مدير في تجارة الحبوب ليس بالضرورة الأفضل في المقاولات، والشركة القابضة التي تدير كل شيء بنفسها تُفقد شركاتها ما يجعلها جيدة.">That separation is deliberate. The best manager in the grain trade is not necessarily the best in contracting, and a holding company that runs everything itself strips its businesses of what made them good.</p>
        <p data-ar="وللسبب نفسه يضم قطاع واحد أحياناً شركتين. الأغذية مثال: التجارة بالجملة والتعبئة للتجزئة نشاطان يكافئان غرائز مختلفة، فيبقيان منفصلين.">For the same reason, one sector sometimes holds two companies. Food is the example: bulk trading and retail packing reward different instincts, so they stay separate.</p>
      </div>
    </div>
    <div class="aside">
      <h3 data-ar="الحوكمة">Governance</h3>
      <dl>
        <div><dt data-ar="مجالس الإدارة">Boards</dt><dd data-ar="لكل شركة تشغيلية مجلس إدارة تعيّنه المجموعة.">Every operating company has a board appointed by the group.</dd></div>
        <div><dt data-ar="التقارير">Reporting</dt><dd data-ar="تقارير مالية موحّدة بالمعايير نفسها في كل الشركات.">Consolidated financial reporting on one standard across all companies.</dd></div>
        <div><dt data-ar="التدقيق">Audit</dt><dd data-ar="رقابة داخلية ومراجعة خارجية سنوية.">Internal controls and an annual external audit.</dd></div>
      </dl>
    </div>
  </div>
</section>

<section class="section tight">
  <div class="wrap">
    ${plate('boardroom', 'Group management meets each operating company monthly.',
            'تجتمع إدارة المجموعة شهرياً مع كل شركة تشغيلية.',
            { en: 'Lusail, Qatar', ar: 'لوسيل، قطر' })}
  </div>
</section>

<section class="section stone" aria-labelledby="provTitle">
  <div class="wrap">
    <div class="sec-head row">
      <div>
        <span class="eyebrow" data-ar="ما نقدمه">What we provide</span>
        <h2 id="provTitle" data-ar="أربعة أشياء تحصل عليها كل شركة">Four things every company gets</h2>
      </div>
      <p class="lede" data-ar="هذه هي المبررات العملية لوجود الشركات تحت مالك واحد.">These are the practical reasons the companies sit under one owner.</p>
    </div>
    ${pillarsBlock()}
  </div>
</section>

<section class="section" aria-labelledby="howTitle">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow" data-ar="كيف نعمل">How we work</span>
      <h2 id="howTitle" data-ar="كيف تترابط الشركات">How the companies connect</h2>
    </div>
    <div class="split">
      <div class="prose">
        <p data-ar="شحنة من الأرز تشرح المجموعة كاملة. تتعاقد شركة السلع عليها من المصدر؛ وتحجز شركة الشحن السفينة وتخلّصها جمركياً؛ وتستلمها شركة التوزيع وتخزّنها؛ وتعبّئها شركة الأغذية وتضعها على الرف.">A consignment of rice explains the whole group. The commodities company contracts it at origin; the shipping company books the vessel and clears customs; the distribution company receives and stores it; the food company packs it and puts it on the shelf.</p>
        <p data-ar="في أربع خطوات لا تغادر البضاعة المجموعة. كل خطوة تربح، ولا تتسرّب أي حلقة إلى وسيط خارجي — وهذا هو التكامل الرأسي الذي تُبنى عليه بيوت التجارة في الخليج.">Across four steps the cargo never leaves the group. Each step earns, and no link leaks to an outside intermediary — the vertical integration that Gulf trading houses are built on.</p>
        <p data-ar="تعمل المقاولات والطاقة بمنطق مختلف: هما شركتا خدمات تبيعان الخبرة والقدرة لا البضائع. لكنهما تشتريان موادهما عبر الذراع التجارية نفسها، وتخضعان للحوكمة نفسها.">Contracting and energy work on a different logic: they are service businesses selling expertise and capacity rather than goods. But they buy materials through the same trading arm, and answer to the same governance.</p>
      </div>
      <div class="aside">
        <h3 data-ar="القطاعات">Sectors</h3>
        <ol class="mini">
${SECTORS.map((s, k) => {
      const n = s.companies.length;
      return `          <li><a href="/sectors/${s.slug}/"><span class="n">${num(k)}</span><span><b${t(s.name, s.nameAr)}>${esc(s.name)}</b><em${t(plural(n, 'company', 'companies'), pluralAr(n, 'شركة واحدة', 'شركات'))}>${plural(n, 'company', 'companies')}</em></span></a></li>`;
    }).join('\n')}
        </ol>
      </div>
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
${OPEN_ROLES.map(r => `      <a class="role" href="mailto:${SITE.contact.careersEmail}?subject=${encodeURIComponent('Application — ' + r.t)}">
        <h3>${esc(r.t)}</h3>
        <span class="meta">${esc(r.co)}</span>
        <span class="meta">${esc(r.loc)} &middot; ${esc(r.type)}</span>
        <span class="go" data-ar="تقديم">Apply</span>
      </a>`).join('\n')}
    </div>`
    : `<p class="lede" data-ar="لا توجد وظائف شاغرة حالياً. أرسل سيرتك الذاتية وسنحتفظ بها.">No open roles at the moment. Send us your CV and we will keep it on file.</p>`;

  return head({
    title: `Careers · ${SITE.name}`,
    desc: `Working at Lusail Corp and its ${ALL_COMPANIES.length} operating companies — open roles and how to apply.`,
    url: '/careers/', image: 'team-wide.jpg'
  })
    + header('/careers/')
    + opener({
      crumb: 'Careers', crumbAr: 'الوظائف',
      h1: `Work across ${ALL_COMPANIES.length} companies`, h1Ar: `اعمل في ${ALL_COMPANIES.length} شركات`,
      lede: 'One group, several very different businesses — and people move between them. A career here is rarely a straight line.',
      ledeAr: 'مجموعة واحدة وشركات مختلفة تماماً، والناس ينتقلون بينها. المسار المهني هنا نادراً ما يكون خطاً مستقيماً.'
    })
    + `<section class="section tight">
  <div class="wrap split">
    <div>
      <span class="eyebrow" data-ar="العمل معنا">Working here</span>
      <h2 class="statement" data-ar="نوظّف للمسار المهني الطويل، لا للوظيفة الحالية فقط.">We hire for the long run, not just the role in front of us.</h2>
      <div class="prose">
        <p data-ar="لأن المجموعة تمتلك شركات في الأغذية والبن والطاقة والمقاولات واللوجستيات، فإن من يبدأ في التخليص الجمركي قد ينتهي في إدارة مستودع أو على مكتب التداول. هذا التنقّل مقصود.">Because the group owns businesses in food, coffee, energy, contracting and logistics, someone who starts in customs clearance can end up running a warehouse or sitting on the trading desk. That movement is deliberate.</p>
        <p data-ar="نعطي الأولوية لتطوير الكوادر القطرية، ونوظّف من خارج قطر حيث تتطلب المهارة ذلك.">We prioritise developing Qatari talent, and recruit internationally where the skill requires it.</p>
      </div>
    </div>
    <div class="aside">
      <h3 data-ar="التقديم">How to apply</h3>
      <dl>
        <div><dt data-ar="البريد الإلكتروني">Email</dt><dd><a class="tl" href="mailto:${SITE.contact.careersEmail}">${SITE.contact.careersEmail}</a></dd></div>
        <div><dt data-ar="أرفق">Include</dt><dd data-ar="سيرتك الذاتية، والشركة التي تهتم بها.">Your CV, and which company interests you.</dd></div>
        <div><dt data-ar="الرد">Reply</dt><dd data-ar="نرد على كل طلب خلال أسبوعين.">We answer every application within two weeks.</dd></div>
      </dl>
    </div>
  </div>
</section>

<section class="section stone" aria-labelledby="roleTitle">
  <div class="wrap">
    <div class="sec-head">
      <span class="eyebrow" data-ar="الوظائف الشاغرة">Open roles</span>
      <h2 id="roleTitle" data-ar="الوظائف المتاحة حالياً">Currently hiring</h2>
    </div>
    ${roles}
  </div>
</section>

`
    + footer();
}

function pageContact() {
  return head({
    title: `Contact · ${SITE.name}`,
    desc: 'Contact Lusail Corp — office, phone, email and enquiry form.',
    url: '/contact/', image: 'doha-wide.jpg'
  })
    + header('/contact/')
    + opener({
      crumb: 'Contact', crumbAr: 'تواصل معنا',
      h1: 'Talk to the group', h1Ar: 'تحدّث إلى المجموعة',
      lede: `One address for all ${ALL_COMPANIES.length} companies. Tell us which one you need and the message goes to the right desk.`,
      ledeAr: 'عنوان واحد لجميع الشركات. أخبرنا أيها تقصد وستصل رسالتك إلى الجهة المختصة.'
    })
    + `<section class="section tight">
  <div class="wrap split">
    <div>
      <span class="eyebrow" data-ar="أين نحن">Where we are</span>
      <h2 class="statement" data-ar="المكتب الرئيسي">Head office</h2>
      <dl class="channels">
        <div><dt data-ar="العنوان">Office</dt><dd data-ar="${esc(SITE.contact.officeAr)}">${esc(SITE.contact.office)}</dd></div>
        <div><dt data-ar="الهاتف">Phone</dt><dd><a href="tel:${tel(SITE.contact.phone)}" dir="ltr">${SITE.contact.phone}</a></dd></div>
        <div><dt data-ar="البريد الإلكتروني">Email</dt><dd><a href="mailto:${SITE.contact.email}">${SITE.contact.email}</a></dd></div>
        <div><dt data-ar="الوظائف">Careers</dt><dd><a href="mailto:${SITE.contact.careersEmail}">${SITE.contact.careersEmail}</a></dd></div>
      </dl>
    </div>
    <form id="form" novalidate>
      <div class="field"><label for="fName" data-ar="الاسم">Name</label><input id="fName" name="name" autocomplete="name" required></div>
      <div class="field"><label for="fMail" data-ar="البريد الإلكتروني">Email</label><input id="fMail" name="email" type="email" autocomplete="email" required></div>
      <div class="field full"><label for="fCo" data-ar="أي شركة؟">Which company?</label>
        <select id="fCo" name="company">
          <option value="group" data-ar="المجموعة — لست متأكداً">The group — not sure</option>
${ALL_COMPANIES.map(c => `          <option value="${c.slug}"${t(c.name, c.nameAr)}>${esc(c.name)}</option>`).join('\n')}
        </select></div>
      <div class="field full"><label for="fTopic" data-ar="موضوع الرسالة">What is this about?</label>
        <select id="fTopic" name="topic">
          <option data-ar="الاستثمار والشراكات">Investment or partnership</option>
          <option data-ar="التوريد لشركاتنا">Supplying our companies</option>
          <option data-ar="الشراء من شركاتنا">Buying from our companies</option>
          <option data-ar="الوظائف">Careers</option>
          <option data-ar="الإعلام">Media enquiry</option>
        </select></div>
      <div class="field full"><label for="fMsg" data-ar="الرسالة">Message</label><textarea id="fMsg" name="message" required></textarea></div>
      <div class="form-end">
        <button class="btn btn-gold" type="submit" data-ar="إرسال الرسالة">Send message</button>
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
      <a class="btn btn-ink" href="/companies/" data-ar="شركاتنا">Our companies</a>
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
  write('sectors/index.html', pageSectorsIndex());
  SECTORS.forEach((s, i) => write(`sectors/${s.slug}/index.html`, pageSector(s, i)));
  write('companies/index.html', pageCompaniesIndex());
  SECTORS.forEach(s => s.companies.forEach(c => write(`companies/${c.slug}/index.html`, pageCompany(c, s))));
  write('careers/index.html', pageCareers());
  write('contact/index.html', pageContact());
  write('404.html', page404());

  console.log('assets');
  copyDir(path.join(ROOT, 'assets/css'), path.join(OUT, 'assets/css'));
  copyDir(path.join(ROOT, 'assets/js'), path.join(OUT, 'assets/js'));
  copyDir(path.join(ROOT, 'site-assets/logo'), path.join(OUT, 'assets/logo'));
  copyDir(path.join(ROOT, 'site-assets/img'), path.join(OUT, 'assets/img'));

  const urls = ['/', '/about/', '/sectors/', ...SECTORS.map(s => `/sectors/${s.slug}/`),
    '/companies/', ...ALL_COMPANIES.map(c => `/companies/${c.slug}/`), '/careers/', '/contact/'];
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
