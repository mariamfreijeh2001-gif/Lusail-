/* The site's routes, in one place.
 *
 * PAGES are what build/render.js writes. REDIRECTS are where every old or
 * guessed address goes. `npm run routes` writes vercel.json from this file,
 * and the build (`npm run build`) refuses to finish if a redirect loops,
 * points at a page that does not exist, or shadows a page that does — so a
 * broken route is caught here, never on the server.
 *
 * Vercel is set to `trailingSlash: true`, which sends /about to /about/ on
 * its own, so every source and destination here ends in a slash. Anything
 * not a page and not listed here is a 404, and the 404 page takes the
 * visitor to the home page.
 */
const { AREAS, SERVICE_AREAS, ALL_SERVICES, PARTNERS_AREA, CONSUMER_AREA } = require('../data/site.js');

/* Where an area's page is: the five business areas under /services/, the
   two other audiences at their own addresses. Mirrors areaHref in render.js. */
const areaPath = a => a.audience === 'partners' ? '/partners/' : a.audience === 'consumer' ? '/consumer/' : `/services/${a.slug}/`;
const servicePath = s => `${areaPath(AREAS.find(a => a.slug === s.areaSlug))}#${s.slug}`;

/* The pages the build writes, as served. */
const PAGES = [
  '/', '/about/', '/services/', ...SERVICE_AREAS.map(areaPath),
  '/partners/', '/consumer/', '/careers/',
  '/supplier-portal/', '/supplier-portal/opportunities/', '/supplier-portal/register/', '/supplier-portal/code/',
  '/contact/'
];

/* Old addresses, grouped by what they were. A `:name` segment matches one
   path segment; `:name*` matches the rest of the path. */
const REDIRECTS = [];
const go = (sources, destination) => sources.forEach(source => REDIRECTS.push({ source, destination }));

/* the first site's pages */
go(['/home/', '/index/'], '/');
go(['/about-us/', '/who-we-are/'], '/about/');
go(['/contact-us/'], '/contact/');
go(['/partnership/', '/partnerships/', '/work-with-us/', '/investment/', '/investors/'], '/partners/');
go(['/everyday/'], '/consumer/');
go(['/jobs/', '/vacancies/'], '/careers/');
go(['/news/', '/news/:path*/', '/media/', '/press/'], '/');

/* the companies are named only on the home page now */
go(['/our-companies/', '/subsidiaries/', '/portfolio/', '/companies/', '/company/'], '/#companies');
const COMPANY_PAGES = {
  'tibeco-group': 'https://www.tibecogroup.com/',
  'lusail-commercial': '/services/commodities/', 'lusail-commodities': '/services/commodities/',
  'lusail-distribution': '/services/food/', 'lusail-foods': '/services/food/', 'roma-commercial': '/services/food/',
  'lusail-shipping': '/services/logistics/',
  'lusail-contracting': '/services/energy-industrial/', 'lusail-energy': '/services/energy-industrial/',
  'cavallo-laundry': '/consumer/#laundry', 'lusail-coffee': '/consumer/#cafe', 'nero-cafe': '/consumer/#cafe'
};
for (const [slug, to] of Object.entries(COMPANY_PAGES)) go([`/companies/${slug}/`, `/company/${slug}/`], to);
go(['/companies/:slug/', '/company/:slug/'], '/#companies');

/* the sectors became service areas */
go(['/our-sectors/', '/our-business/', '/sectors/', '/products/', '/what-we-do/', '/our-services/'], '/services/');
const SECTOR_PAGES = {
  investments: '/partners/', trading: '/services/commodities/', 'supply-distribution': '/services/food/',
  'energy-industrial': '/services/energy-industrial/', technology: '/services/technology/',
  'consumer-services': '/consumer/', 'food-beverage': '/consumer/',
  coffee: '/services/commodities/#coffee', food: '/services/food/', 'food-supply': '/services/food/',
  distribution: '/services/food/', logistics: '/services/logistics/', shipping: '/services/logistics/',
  energy: '/services/energy-industrial/', contracting: '/services/energy-industrial/', 'future-ventures': '/services/'
};
for (const [slug, to] of Object.entries(SECTOR_PAGES)) go([`/sectors/${slug}/`, `/sector/${slug}/`], to);
go(['/sectors/:slug/', '/sector/:slug/'], '/services/');

/* every service once had an address of its own; it is a section now */
for (const s of ALL_SERVICES) go([`/services/${s.slug}/`, `/service/${s.slug}/`], servicePath(s));
go(['/services/sulfur/'], servicePath(ALL_SERVICES.find(s => s.slug === 'sulphur')));
go(['/services/freight/'], '/services/logistics/');
go([`/services/${PARTNERS_AREA.slug}/`], '/partners/');
go([`/services/${CONSUMER_AREA.slug}/`], '/consumer/');

/* a quotation is asked for on the contact page */
go(['/quote/', '/quotation/', '/rfq/', '/request-a-quote/', '/get-a-quote/'], '/contact/?topic=quote');

/* the supplier portal, and the names people guess for it */
go(['/supplier/', '/suppliers/', '/procurement/', '/vendors/'], '/supplier-portal/');
go(['/suppliers/register/', '/vendor-registration/', '/register/'], '/supplier-portal/register/');
go(['/tenders/', '/opportunities/', '/suppliers/opportunities/', '/suppliers/opportunities/:ref/'], '/supplier-portal/opportunities/');
go(['/suppliers/code/'], '/supplier-portal/code/');

/* ---------- checks ------------------------------------------------------
   Run by the build against the pages it has just written. */
const patternToRegExp = src => new RegExp('^' + src
  .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
  .replace(/:[a-z]+\*/g, '.*')
  .replace(/:[a-z]+/g, '[^/]+') + '$');

function checkRoutes(pages, anchorsOf) {
  const errors = [];
  const sources = new Set();
  const pageSet = new Set(pages);
  for (const r of REDIRECTS) {
    if (sources.has(r.source)) errors.push(`'${r.source}' is listed twice`);
    sources.add(r.source);
    if (!r.source.endsWith('/')) errors.push(`'${r.source}' should end in a slash`);
    if (pageSet.has(r.source)) errors.push(`'${r.source}' is a page; it cannot also be a redirect`);
    if (r.source.includes(':')) {
      const hit = pages.find(p => patternToRegExp(r.source).test(p));
      if (hit) errors.push(`'${r.source}' would catch the page '${hit}'`);
    }
    if (/^https?:/.test(r.destination)) continue;
    const [path, hash] = r.destination.split('?')[0].split('#');
    if (!pageSet.has(path)) errors.push(`'${r.source}' goes to '${path}', which is not a page`);
    else if (hash && anchorsOf && !anchorsOf(path).has(hash)) errors.push(`'${r.source}' goes to '#${hash}', which is not on '${path}'`);
    if (sources.has(path)) errors.push(`'${r.source}' goes to '${path}', which is itself redirected`);
  }
  for (const r of REDIRECTS) {
    const path = r.destination.split('?')[0].split('#')[0];
    if (sources.has(path)) errors.push(`'${r.source}' goes to '${path}', which is itself redirected`);
  }
  return [...new Set(errors)];
}

/* vercel.json, whole: the settings, the cache headers, the redirects. */
function vercelConfig() {
  return {
    $schema: 'https://openapi.vercel.sh/vercel.json',
    buildCommand: 'npm run build',
    outputDirectory: 'dist',
    cleanUrls: true,
    trailingSlash: true,
    headers: [
      { source: '/assets/font/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
      { source: '/assets/img/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=604800' }] },
      { source: '/assets/logo/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=604800' }] },
      { source: '/assets/(css|js)/(.*)', headers: [{ key: 'Cache-Control', value: 'public, max-age=3600, stale-while-revalidate=86400' }] }
    ],
    redirects: REDIRECTS.map(r => ({ source: r.source, destination: r.destination, permanent: true }))
  };
}

module.exports = { PAGES, REDIRECTS, checkRoutes, vercelConfig, areaPath, servicePath };

if (require.main === module) {
  const fs = require('fs'), path = require('path');
  const errors = checkRoutes(PAGES);
  if (errors.length) { console.error('\n  routes:\n    ' + errors.join('\n    ') + '\n'); process.exit(1); }
  const file = path.join(__dirname, '..', 'vercel.json');
  fs.writeFileSync(file, JSON.stringify(vercelConfig(), null, 2) + '\n');
  console.log(`vercel.json: ${PAGES.length} pages, ${REDIRECTS.length} redirects`);
}
