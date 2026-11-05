/* What each photograph is used for, which decides the widths build/variants.js
 * makes and the `sizes` build/render.js writes. The roles are measured, not
 * guessed: every box here was read off a browser at 1440 and at 390.
 *
 * A photograph with two roles takes the union of their widths. A service's
 * photograph has two: the shot beside its story, and its card on the index
 * and in the related-services row.
 *
 * Adding a photograph means adding a line here and running `npm run images`.
 * A page that asks for a file nobody made fails the build rather than
 * shipping a hole, so a forgotten line cannot reach the site.
 */
module.exports = {
  // full-bleed, behind a page title
  'hero-about': ['hero'],
  'hero-partnerships': ['hero', 'still', 'rail'],   // also the partnerships service
  'hero-contact': ['hero'],
  'hero-doha': ['hero'],
  'hero-sectors': ['hero'],
  'why-group': ['hero'],
  'about-platform': ['hero'],

  // a service area: the photograph behind every page title in it, and its
  // strip in the home page's accordion
  'hero-sector-investments': ['hero', 'still', 'rail'],   // also the strategic investment service
  'hero-sector-energy-industrial': ['hero'],
  'hero-sector-technology': ['hero'],
  'hero-sector-trading': ['hero'],
  'hero-roma-commercial': ['hero'],   // food supply & distribution: the warehouse
  'hero-sector-consumer-services': ['hero'],
  'hero-sector-food-beverage': ['hero'],
  'hero-lusail-commercial': ['hero'],                           // freight & logistics

  // a service: the shot beside its story (still) and its card on the index
  // and in the related-services row (rail, uncropped — the card crops it
  // itself with object-fit)
  'hero-tibeco-group': ['hero', 'still', 'rail'],
  'hero-cavallo-laundry': ['still', 'rail'],
  'hero-nero-cafe': ['hero', 'still', 'rail'],
  'still-tibeco-group': ['still', 'rail'],
  'still-lusail-commercial': ['still', 'rail'],
  'still-roma-commercial': ['still', 'rail'],
  'panel-food-commodities': ['panel', 'still', 'rail'],
  'panel-ocean-freight': ['panel', 'still', 'rail'],
  'coffee-still': ['still', 'rail'],
  // generated product photographs (see TODO): the sulphur, sugar, edible
  // oils and energy-materials services
  'prod-sulphur': ['still', 'rail'],
  'prod-sugar': ['still', 'rail'],
  'prod-edible-oils': ['still', 'rail'],
  'prod-industrial-materials': ['still', 'rail'],
  'prod-air-freight': ['still', 'rail'],
  'prod-food-commodities': ['still', 'rail'],
  'prod-vessel-chartering': ['still', 'rail'],
  'prod-fresh-fruits': ['still', 'rail'],
  'prod-fresh-vegetables': ['still', 'rail'],
  'prod-land-freight': ['still', 'rail'],
  'prod-energy-materials': ['panel', 'still', 'rail'],
  'prod-technology-systems': ['panel', 'still', 'rail'],
  'prod-equipment': ['panel', 'still', 'rail'],
  'prod-food-security': ['panel', 'still', 'rail'],
  'prod-project-supply': ['panel', 'still', 'rail'],
};
