/* ==========================================================================
   Lusail Corp — static site generator.

   Reads /data/site.js, writes finished HTML into /dist. No dependencies.
   Run with:  npm run build
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const { SITE, COMPANIES, PILLARS, OPEN_ROLES } = require('../data/site.js');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'dist');

/* ---------- helpers ---------------------------------------------------- */

const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Bilingual text node: English is the content, Arabic rides along in data-ar
// and the language toggle swaps them.
const bi = (en, ar) => ar ? `${esc(en)}" data-ar="${esc(ar)}` : esc(en);
const t = (en, ar) => ar ? ` data-ar="${esc(ar)}"` : '';

const logo = f => fs.readFileSync(path.join(ROOT, 'site-assets/logo', f), 'utf8')
  .trim()
  .replace(/^<svg([^>]*)>/, (m, a) => {
    const vb = a.match(/viewBox="[^"]*"/);
    return `<svg xmlns="http://www.w3.org/2000/svg" ${vb ? vb[0] : ''} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">`;
  });

// Referenced as a file rather than inlined: the browser caches it once
// instead of re-downloading 22KB of path data on every page.
const LOGO_REVERSED = '<img src="/assets/logo/lusail-corp-horizontal-reversed.svg" alt="" width="574" height="112">';
const num = i => String(i + 1).padStart(2, '0');

/* ---------- chrome ----------------------------------------------------- */

function head({ title, desc, url, image }) {
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#16181A">
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
/* Apply the saved language before first paint so the page never flashes
   the wrong script. */
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

function header(current) {
  const links = SITE.nav.map(n => {
    const on = current === n.href ? ' aria-current="page"' : '';
    return `      <a href="${n.href}"${on}${t(n.label, n.labelAr)}>${esc(n.label)}</a>`;
  }).join('\n');

  return `<header class="site-head" id="top">
  <div class="wrap head-row">
    <a class="brand" href="/" aria-label="${esc(SITE.name)} — home">${LOGO_REVERSED}</a>
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
</header>
<main id="main">
`;
}

function footer() {
  const cos = COMPANIES.map(c =>
    `        <li><a href="/companies/${c.slug}/"${t(c.company, c.companyAr)}>${esc(c.company)}</a></li>`
  ).join('\n');
  const group = SITE.nav.map(n =>
    `        <li><a href="${n.href}"${t(n.label, n.labelAr)}>${esc(n.label)}</a></li>`
  ).join('\n');

  return `</main>
<footer class="site-foot">
  <div class="wrap">
    <div class="foot-grid">
      <div>
        <a class="brand" href="/" aria-label="${esc(SITE.name)} — home">${LOGO_REVERSED}</a>
        <p class="foot-blurb" data-ar="مجموعة قطرية تمتلك وتنمّي شركات تشغيلية في التجارة والطاقة والمقاولات والخدمات اللوجستية.">A Qatari group that owns and grows operating companies in trade, energy, contracting and logistics.</p>
      </div>
      <div>
        <h4 data-ar="شركاتنا">Our companies</h4>
        <ul>
${cos}
        </ul>
      </div>
      <div>
        <h4 data-ar="المجموعة">Group</h4>
        <ul>
${group}
        </ul>
      </div>
      <div>
        <h4 data-ar="تواصل">Get in touch</h4>
        <ul>
          <li><a href="mailto:${SITE.contact.email}">${SITE.contact.email}</a></li>
          <li><a href="tel:${SITE.contact.phone.replace(/\s/g, '')}" dir="ltr">${SITE.contact.phone}</a></li>
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

function opener({ crumb, crumbAr, h1, h1Ar, lede, ledeAr, photo }) {
  return `<section class="opener">
  <div class="shot"><img src="/assets/img/${photo}-hero.jpg" alt="" width="2000" height="857" fetchpriority="high"></div>
  <div class="wrap">
    <p class="crumb"${t(crumb, crumbAr)}>${esc(crumb)}</p>
    <h1${t(h1, h1Ar)}>${esc(h1)}</h1>
    ${lede ? `<p class="lede"${t(lede, ledeAr)}>${esc(lede)}</p>` : ''}
  </div>
</section>
`;
}

function companyCards(list) {
  return `<div class="cards">
${list.map((c, i) => `    <a class="card" href="/companies/${c.slug}/">
      <div class="pic"><img src="/assets/img/${c.photo}-card.jpg" alt="${esc(c.sector)}" width="900" height="675" loading="lazy"></div>
      <div class="body">
        <span class="n">${num(COMPANIES.indexOf(c))}</span>
        <h3${t(c.sector, c.sectorAr)}>${esc(c.sector)}</h3>
        <span class="co"${t(c.company, c.companyAr)}>${esc(c.company)}</span>
        <p${t(c.short, c.shortAr)}>${esc(c.short)}</p>
        <span class="more" data-ar="عرض الشركة">View company</span>
      </div>
    </a>`).join('\n')}
</div>`;
}

function pillarsBlock() {
  return `<div class="pillars">
${PILLARS.map(p => `      <div class="pillar">
        <span class="mk" aria-hidden="true"></span>
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

function contactForm() {
  return `<form id="form" novalidate>
        <div class="field"><label for="fName" data-ar="الاسم">Name</label><input id="fName" name="name" autocomplete="name" required></div>
        <div class="field"><label for="fMail" data-ar="البريد الإلكتروني">Email</label><input id="fMail" name="email" type="email" autocomplete="email" required></div>
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
      </form>`;
}

/* ---------- pages ------------------------------------------------------ */

function pageHome() {
  const rail = COMPANIES.map((c, i) =>
    `      <button type="button" data-i="${i}" aria-pressed="${i === 0}"><span class="n">${num(i)}</span><span${t(c.sector, c.sectorAr)}>${esc(c.sector)}</span></button>`
  ).join('\n');

  const shots = COMPANIES.map((c, i) =>
    `      <div class="shot${i === 0 ? ' on' : ''}" data-i="${i}"><img src="/assets/img/${c.photo}-hero.jpg" alt="${esc(c.sector)}" width="2000" height="857" loading="${i === 0 ? 'eager' : 'lazy'}"></div>`
  ).join('\n');

  return head({
    title: `${SITE.name} · Holding Company`,
    desc: 'A Qatari holding company that owns and grows operating companies in commodity trading, coffee, energy, contracting, shipping and distribution.',
    url: '/', image: 'skyline-hero.jpg'
  })
    + header('/')
    + `<section class="hero">
  <div class="shot"><img src="/assets/img/skyline-hero.jpg" alt="" width="2000" height="857" fetchpriority="high"></div>
  <div class="wrap">
    <p class="crumb" data-ar="لوسيل كورب — شركة قابضة">${esc(SITE.name)} — Holding Company</p>
    <h1 data-ar="ست شركات. مجموعة واحدة. قطر.">Six companies. One group. Qatar.</h1>
    <p class="lede" data-ar="نمتلك وننمّي شركات تشغيلية تشتري السلع وتنقلها وتبنيها وتوصّلها — ونمنحها رأس المال والحوكمة اللذين لا تحصل عليهما وحدها.">We own and grow operating companies that buy, move, build and deliver — and give each the capital and governance it would not have alone.</p>
    <div class="hero-cta">
      <a class="btn btn-gold" href="/companies/" data-ar="تعرّف على شركاتنا">Explore our companies</a>
      <a class="btn btn-line" href="/about/" data-ar="عن المجموعة">About the group</a>
    </div>
  </div>
</section>

<section class="section six on-dark" aria-labelledby="sixTitle">
  <div class="wrap">
    <p class="eyebrow" data-ar="المجموعة">The group</p>
    <h2 id="sixTitle" class="sec-head" style="display:block;margin-bottom:0" data-ar="ما تفعله كل شركة">What each company does</h2>
    <div class="stage" id="stage">
${shots}
      <div class="veil" aria-hidden="true"></div>
      <div class="copy">
        <span class="num" id="sNum">01 / 0${COMPANIES.length}</span>
        <h3 id="sName"${t(COMPANIES[0].sector, COMPANIES[0].sectorAr)}>${esc(COMPANIES[0].sector)}</h3>
        <p id="sDesc"${t(COMPANIES[0].short, COMPANIES[0].shortAr)}>${esc(COMPANIES[0].short)}</p>
        <a class="go" id="sLink" href="/companies/${COMPANIES[0].slug}/" data-ar="عرض الشركة">View company</a>
      </div>
    </div>
  </div>
  <div class="wrap" style="padding-inline:0">
    <div class="rail" id="rail">
${rail}
    </div>
  </div>
</section>
<script>
/* Sector copy for the rail above, emitted from data/site.js so the wording
   lives in exactly one place. */
window.LC_SECTORS = ${JSON.stringify(COMPANIES.map(c => ({
      slug: c.slug, sector: c.sector, sectorAr: c.sectorAr,
      short: c.short, shortAr: c.shortAr
    })))};
</script>

<section class="section" aria-labelledby="stTitle">
  <div class="wrap state-grid">
    <div>
      <p class="eyebrow" data-ar="من نحن">Who we are</p>
      <h2 id="stTitle" class="statement" style="margin-top:20px" data-ar="نمتلك شركات يعتمد عليها الناس كل يوم، ونمنحها الأساس الذي تنمو عليه لعقود.">We own businesses people rely on every day, and give them the foundation to grow for decades.</h2>
      <div class="prose">
        <p data-ar="تجمع لوسيل كورب شركات تشغيلية متنوعة تحت كيان واحد. تحتفظ كل شركة بفريقها وعلامتها وعملائها، بينما توفّر المجموعة رأس المال والحوكمة والخدمات المشتركة.">Lusail Corp brings a set of operating companies under one structure. Each keeps its own team, name and customers, while the group provides capital, governance and shared services.</p>
        <p data-ar="الشركات مترابطة بحكم طبيعتها: ما تشتريه الذراع التجارية تنقله شركة الشحن وتخزّنه وتوصّله شركة التوزيع. هذا الترابط هو ما يجعل المجموعة أكثر من مجموع أجزائها.">The companies connect by nature: what the trading arm buys, the shipping arm moves and the distribution arm stores and delivers. That linkage is what makes the group more than the sum of its parts.</p>
      </div>
    </div>
    <dl class="facts">
      <div><dt data-ar="المقر الرئيسي">Headquarters</dt><dd data-ar="لوسيل، قطر">Lusail, Qatar</dd></div>
      <div><dt data-ar="الشركات التشغيلية">Operating companies</dt><dd>${COMPANIES.length}</dd></div>
      <div><dt data-ar="القطاعات">Sectors</dt><dd data-ar="التجارة، الطاقة، المقاولات، اللوجستيات">Trade, energy, contracting, logistics</dd></div>
      <div><dt data-ar="الملكية">Ownership</dt><dd data-ar="قطرية بالكامل">Wholly Qatari owned</dd></div>
    </dl>
  </div>
</section>

<section class="section stone" aria-labelledby="coTitle">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-ar="شركاتنا">Our companies</p>
        <h2 id="coTitle" data-ar="ست شركات، لكل منها صفحتها">Six companies, each with its own page</h2>
      </div>
      <a class="btn btn-ink" href="/companies/" data-ar="عرض الكل">View all</a>
    </div>
    ${companyCards(COMPANIES)}
  </div>
</section>

<section class="section dark on-dark" aria-labelledby="apTitle">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-ar="نهجنا">Our approach</p>
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

function pageAbout() {
  return head({
    title: `About · ${SITE.name}`,
    desc: 'How Lusail Corp is structured, how it is governed, and what the group provides each of its operating companies.',
    url: '/about/', image: 'boardroom-hero.jpg'
  })
    + header('/about/')
    + opener({
      crumb: 'About', crumbAr: 'من نحن',
      h1: 'One owner, six operating companies', h1Ar: 'مالك واحد، ست شركات تشغيلية',
      lede: 'Lusail Corp is a holding company. It does not trade, build or ship itself — it owns the companies that do, and is accountable for how they are run.',
      ledeAr: 'لوسيل كورب شركة قابضة. لا تتاجر ولا تبني ولا تشحن بنفسها، بل تمتلك الشركات التي تفعل ذلك، وتتحمل مسؤولية طريقة إدارتها.',
      photo: 'boardroom'
    })
    + `<section class="section">
  <div class="wrap state-grid">
    <div>
      <p class="eyebrow" data-ar="الهيكل">Structure</p>
      <h2 class="statement" style="margin-top:20px" data-ar="شركة قابضة تُقاس بقوة الشركات التي تمتلكها.">A holding company is judged by the strength of the businesses it owns.</h2>
      <div class="prose">
        <p data-ar="تحتفظ كل شركة تشغيلية بإدارتها وعلامتها وعلاقاتها مع عملائها. لا تدير المجموعة العمل اليومي، بل تعيّن مجالس الإدارة وتضع المعايير وتوفّر رأس المال وتحاسب على النتائج.">Each operating company keeps its own management, name and customer relationships. The group does not run the day-to-day — it appoints boards, sets standards, provides capital and holds each company to its results.</p>
        <p data-ar="هذا الفصل مقصود. أفضل مدير في تجارة الحبوب ليس بالضرورة الأفضل في المقاولات، والشركة القابضة التي تدير كل شيء بنفسها تُفقد شركاتها ما يجعلها جيدة.">That separation is deliberate. The best manager in the grain trade is not necessarily the best in contracting, and a holding company that runs everything itself strips its businesses of what made them good.</p>
        <p data-ar="ما توحّده المجموعة هو المعايير: التقارير المالية، والرقابة الداخلية، والسلامة، وطريقة التعامل مع الموظفين — واحدة في كل الشركات.">What the group does standardise is the standard itself: financial reporting, internal controls, safety, and how people are treated — the same in every company.</p>
      </div>
    </div>
    <dl class="facts">
      <div><dt data-ar="النوع">Type</dt><dd data-ar="شركة قابضة">Holding company</dd></div>
      <div><dt data-ar="المقر الرئيسي">Headquarters</dt><dd data-ar="لوسيل، قطر">Lusail, Qatar</dd></div>
      <div><dt data-ar="الشركات التشغيلية">Operating companies</dt><dd>${COMPANIES.length}</dd></div>
      <div><dt data-ar="الملكية">Ownership</dt><dd data-ar="قطرية بالكامل">Wholly Qatari owned</dd></div>
    </dl>
  </div>
</section>

<section class="section dark on-dark" aria-labelledby="provTitle">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-ar="ما نقدمه">What we provide</p>
        <h2 id="provTitle" data-ar="أربعة أشياء تحصل عليها كل شركة">Four things every company gets</h2>
      </div>
      <p class="lede" data-ar="هذه هي المبررات العملية لوجود الشركات الست تحت مالك واحد.">These are the practical reasons the six sit under one owner.</p>
    </div>
    ${pillarsBlock()}
  </div>
</section>

<section class="section stone" aria-labelledby="howTitle">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-ar="كيف نعمل">How we work</p>
        <h2 id="howTitle" data-ar="كيف تترابط الشركات">How the companies connect</h2>
      </div>
    </div>
    <div class="co-grid">
      <div class="prose">
        <p data-ar="شحنة من الأرز تشرح المجموعة كاملة. تتعاقد الذراع التجارية عليها من المصدر؛ وتحجز شركة الشحن السفينة وتخلّصها جمركياً؛ وتستلمها شركة التوزيع وتخزّنها وتوصّلها لتاجر الجملة.">A consignment of rice explains the whole group. The trading arm contracts it at origin; the shipping arm books the vessel and clears it through customs; the distribution arm receives, stores and delivers it to the wholesaler.</p>
        <p data-ar="في ثلاث خطوات لا تغادر البضاعة المجموعة. كل خطوة تربح، ولا تتسرّب أي حلقة إلى وسيط خارجي — وهذا هو التكامل الرأسي الذي تُبنى عليه شركات التجارة في الخليج.">Across three steps the cargo never leaves the group. Each step earns, and no link leaks to an outside intermediary — the vertical integration that Gulf trading houses are built on.</p>
        <p data-ar="تعمل المقاولات والطاقة بمنطق مختلف: هما شركتا خدمات تبيعان الخبرة والقدرة لا البضائع. لكنهما تشتريان موادهما عبر الذراع التجارية نفسها، وتخضعان للحوكمة نفسها.">Contracting and energy work on a different logic: they are service businesses selling expertise and capacity rather than goods. But they buy their materials through the same trading arm, and answer to the same governance.</p>
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
  </div>
</section>

`
    + ctaBand()
    + footer();
}

function pageCompaniesIndex() {
  return head({
    title: `Our companies · ${SITE.name}`,
    desc: 'The six operating companies of Lusail Corp: commodity trading, coffee, energy, contracting, shipping and distribution.',
    url: '/companies/', image: 'port-wide-hero.jpg'
  })
    + header('/companies/')
    + opener({
      crumb: 'Our companies', crumbAr: 'شركاتنا',
      h1: 'Six companies, six pages', h1Ar: 'ست شركات، ست صفحات',
      lede: 'Each operating company has its own page: what it does, what it handles, and who to contact.',
      ledeAr: 'لكل شركة تشغيلية صفحتها الخاصة: ما تفعله، وما تتولاه، ومن تتواصل معه.',
      photo: 'port-wide'
    })
    + `<section class="section">
  <div class="wrap">
    ${companyCards(COMPANIES)}
  </div>
</section>

`
    + ctaBand()
    + footer();
}

function pageCompany(c, i) {
  const others = COMPANIES.filter(x => x.slug !== c.slug);

  const caps = c.caps.map((cap, k) => {
    const ar = (c.capsAr && c.capsAr[k]) || null;
    return `      <li>
        <span class="n">${num(k)}</span>
        <div><b${t(cap.t, ar && ar.t)}>${esc(cap.t)}</b><span${t(cap.d, ar && ar.d)}>${esc(cap.d)}</span></div>
      </li>`;
  }).join('\n');

  const body = c.body.map((p, k) =>
    `        <p${t(p, c.bodyAr && c.bodyAr[k])}>${esc(p)}</p>`
  ).join('\n');

  const figs = c.figs && c.figs.length
    ? `    <div class="figs">
${c.figs.map(f => `      <div><b>${esc(f.v)}</b><span${t(f.l, f.lAr)}>${esc(f.l)}</span></div>`).join('\n')}
    </div>`
    : '';

  return head({
    title: `${c.sector} — ${c.company} · ${SITE.name}`,
    desc: c.short,
    url: `/companies/${c.slug}/`, image: `${c.photo}-hero.jpg`
  })
    + header('/companies/')
    + opener({
      crumb: `Our companies — ${num(i)}`, crumbAr: `شركاتنا — ${num(i)}`,
      h1: c.sector, h1Ar: c.sectorAr,
      lede: c.intro, ledeAr: c.introAr,
      photo: c.photo
    })
    + `<section class="section">
  <div class="wrap co-grid">
    <div>
      <p class="eyebrow" data-ar="الشركة">The company</p>
      <h2 class="statement" style="margin-top:20px"${t(c.company, c.companyAr)}>${esc(c.company)}</h2>
      <div class="prose" style="margin-top:24px">
${body}
      </div>
${figs}
    </div>
    <div class="aside">
      <h3 data-ar="تواصل">Get in touch</h3>
      <dl>
        <div><dt data-ar="القطاع">Sector</dt><dd${t(c.sector, c.sectorAr)}>${esc(c.sector)}</dd></div>
        <div><dt data-ar="المجموعة">Part of</dt><dd>${esc(SITE.name)}</dd></div>
        <div><dt data-ar="البريد الإلكتروني">Email</dt><dd><a href="mailto:${SITE.contact.email}">${SITE.contact.email}</a></dd></div>
        <div><dt data-ar="الهاتف">Phone</dt><dd><a href="tel:${SITE.contact.phone.replace(/\s/g, '')}" dir="ltr">${SITE.contact.phone}</a></dd></div>
      </dl>
      <a class="btn btn-ink" href="/contact/" data-ar="راسل هذه الشركة">Message this company</a>
    </div>
  </div>
</section>

<section class="section stone" aria-labelledby="capTitle">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-ar="القدرات">Capabilities</p>
        <h2 id="capTitle" data-ar="ما تتولاه هذه الشركة">What this company handles</h2>
      </div>
    </div>
    <ul class="caps">
${caps}
    </ul>
  </div>
</section>

<section class="on-dark" aria-labelledby="sibTitle">
  <div class="wrap" style="padding-block:clamp(44px,5vw,64px) 0">
    <p class="eyebrow" data-ar="بقية المجموعة">The rest of the group</p>
    <h2 id="sibTitle" style="color:#fff;font-size:clamp(1.5rem,2.6vw,2rem);margin-top:16px;margin-bottom:26px" data-ar="الشركات الأخرى">The other companies</h2>
  </div>
  <div class="siblings">
${others.map(o => `    <a href="/companies/${o.slug}/">
      <span class="n">${num(COMPANIES.indexOf(o))}</span>
      <span class="t"${t(o.sector, o.sectorAr)}>${esc(o.sector)}</span>
      <span class="s"${t(o.company, o.companyAr)}>${esc(o.company)}</span>
    </a>`).join('\n')}
  </div>
  <div class="wrap" style="padding-block:clamp(32px,4vw,52px)">
    <a class="btn btn-line" href="/companies/" data-ar="عرض جميع الشركات">View all companies</a>
  </div>
</section>

`
    + footer();
}

function pageCareers() {
  const roles = OPEN_ROLES.length
    ? `<div class="roles">
${OPEN_ROLES.map(r => `      <a class="role" href="mailto:${SITE.contact.careersEmail}?subject=${encodeURIComponent('Application — ' + r.t)}">
        <h3>${esc(r.t)}</h3>
        <span class="meta">${esc(r.co)}</span>
        <span class="meta">${esc(r.loc)} · ${esc(r.type)}</span>
        <span class="go" data-ar="تقديم">Apply</span>
      </a>`).join('\n')}
    </div>`
    : `<p class="lede" data-ar="لا توجد وظائف شاغرة حالياً. أرسل سيرتك الذاتية وسنحتفظ بها.">No open roles at the moment. Send us your CV and we will keep it on file.</p>`;

  return head({
    title: `Careers · ${SITE.name}`,
    desc: 'Working at Lusail Corp and its operating companies — open roles and how to apply.',
    url: '/careers/', image: 'team-hero.jpg'
  })
    + header('/careers/')
    + opener({
      crumb: 'Careers', crumbAr: 'الوظائف',
      h1: 'Work across six companies', h1Ar: 'اعمل في ست شركات',
      lede: 'One group, six very different businesses — and people move between them. A career here is rarely a straight line.',
      ledeAr: 'مجموعة واحدة وست شركات مختلفة تماماً، والناس ينتقلون بينها. المسار المهني هنا نادراً ما يكون خطاً مستقيماً.',
      photo: 'team'
    })
    + `<section class="section">
  <div class="wrap co-grid">
    <div>
      <p class="eyebrow" data-ar="العمل معنا">Working here</p>
      <h2 class="statement" style="margin-top:20px" data-ar="نوظّف للمسار المهني الطويل، لا للوظيفة الحالية فقط.">We hire for the long run, not just the role in front of us.</h2>
      <div class="prose" style="margin-top:24px">
        <p data-ar="لأن المجموعة تمتلك شركات في التجارة والطاقة والمقاولات واللوجستيات، فإن الموظف الذي يبدأ في التخليص الجمركي قد ينتهي في إدارة مستودع أو في مكتب التداول. هذا التنقّل مقصود.">Because the group owns businesses in trade, energy, contracting and logistics, someone who starts in customs clearance can end up running a warehouse or sitting on the trading desk. That movement is deliberate.</p>
        <p data-ar="نعطي الأولوية لتطوير الكوادر القطرية، ونوظّف من خارج قطر حيث تتطلب المهارة ذلك.">We prioritise developing Qatari talent, and recruit internationally where the skill requires it.</p>
      </div>
    </div>
    <div class="aside">
      <h3 data-ar="التقديم">How to apply</h3>
      <dl>
        <div><dt data-ar="البريد الإلكتروني">Email</dt><dd><a href="mailto:${SITE.contact.careersEmail}">${SITE.contact.careersEmail}</a></dd></div>
        <div><dt data-ar="أرفق">Include</dt><dd data-ar="سيرتك الذاتية، والشركة التي تهتم بها.">Your CV, and which company interests you.</dd></div>
        <div><dt data-ar="الرد">Reply</dt><dd data-ar="نرد على كل طلب خلال أسبوعين.">We answer every application within two weeks.</dd></div>
      </dl>
    </div>
  </div>
</section>

<section class="section stone" aria-labelledby="roleTitle">
  <div class="wrap">
    <div class="sec-head">
      <div>
        <p class="eyebrow" data-ar="الوظائف الشاغرة">Open roles</p>
        <h2 id="roleTitle" data-ar="الوظائف المتاحة حالياً">Currently hiring</h2>
      </div>
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
    url: '/contact/', image: 'doha-hero.jpg'
  })
    + header('/contact/')
    + opener({
      crumb: 'Contact', crumbAr: 'تواصل معنا',
      h1: 'Talk to the group', h1Ar: 'تحدّث إلى المجموعة',
      lede: 'One address for all six companies. Tell us which one you need and the message goes to the right desk.',
      ledeAr: 'عنوان واحد لجميع الشركات الست. أخبرنا أيها تقصد وستصل رسالتك إلى الجهة المختصة.',
      photo: 'doha'
    })
    + `<section class="section dark on-dark">
  <div class="wrap contact-grid">
    <div>
      <p class="eyebrow" data-ar="أين نحن">Where we are</p>
      <h2 style="color:#fff;font-size:clamp(1.6rem,3vw,2.3rem);margin-top:18px" data-ar="المكتب الرئيسي">Head office</h2>
      <dl class="channels">
        <div><dt data-ar="العنوان">Office</dt><dd data-ar="${esc(SITE.contact.officeAr)}">${esc(SITE.contact.office)}</dd></div>
        <div><dt data-ar="الهاتف">Phone</dt><dd><a href="tel:${SITE.contact.phone.replace(/\s/g, '')}" dir="ltr">${SITE.contact.phone}</a></dd></div>
        <div><dt data-ar="البريد الإلكتروني">Email</dt><dd><a href="mailto:${SITE.contact.email}">${SITE.contact.email}</a></dd></div>
        <div><dt data-ar="الوظائف">Careers</dt><dd><a href="mailto:${SITE.contact.careersEmail}">${SITE.contact.careersEmail}</a></dd></div>
      </dl>
    </div>
    ${contactForm()}
  </div>
</section>

`
    + footer();
}

function page404() {
  return head({ title: `Page not found · ${SITE.name}`, desc: 'That page does not exist.', url: '/404.html' })
    + header('')
    + `<section class="section" style="min-height:44vh">
  <div class="wrap">
    <p class="eyebrow">404</p>
    <h1 style="font-size:clamp(2rem,4vw,3rem);margin-top:18px" data-ar="الصفحة غير موجودة">That page does not exist</h1>
    <p class="lede" style="margin-top:18px" data-ar="ربما تغيّر الرابط. جرّب صفحة الشركات أو عد إلى الصفحة الرئيسية.">The link may have changed. Try our companies, or go back to the home page.</p>
    <div class="hero-cta">
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
  write('companies/index.html', pageCompaniesIndex());
  COMPANIES.forEach((c, i) => write(`companies/${c.slug}/index.html`, pageCompany(c, i)));
  write('careers/index.html', pageCareers());
  write('contact/index.html', pageContact());
  write('404.html', page404());

  console.log('assets');
  copyDir(path.join(ROOT, 'assets/css'), path.join(OUT, 'assets/css'));
  copyDir(path.join(ROOT, 'assets/js'), path.join(OUT, 'assets/js'));
  copyDir(path.join(ROOT, 'site-assets/logo'), path.join(OUT, 'assets/logo'));
  copyDir(path.join(ROOT, 'site-assets/img'), path.join(OUT, 'assets/img'));

  // robots + sitemap, generated from the real page list
  const urls = ['/', '/about/', '/companies/', ...COMPANIES.map(c => `/companies/${c.slug}/`), '/careers/', '/contact/'];
  fs.writeFileSync(path.join(OUT, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE.domain}/sitemap.xml\n`);
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `  <url><loc>${SITE.domain}${u}</loc></url>`).join('\n') +
    `\n</urlset>\n`);

  console.log('  robots.txt, sitemap.xml (' + urls.length + ' urls)');
  console.log('done -> dist/');
}

build();
