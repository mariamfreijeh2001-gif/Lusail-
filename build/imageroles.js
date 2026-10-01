/* What each photograph is used for, which decides the widths build/variants.js
 * makes and the `sizes` build/render.js writes. The roles are measured, not
 * guessed: every box here was read off a browser at 1440 and at 390.
 *
 * A photograph with two roles takes the union of their widths. The four
 * company heroes have four, because the same file is a 1400px page hero, a
 * 334px card, a 292px panel in the row of four, and a 93px plate beside a
 * company's name on /sectors/.
 *
 * Adding a photograph means adding a line here and running `npm run images`.
 * A page that asks for a file nobody made fails the build rather than
 * shipping a hole, so a forgotten line cannot reach the site.
 */
module.exports = {
  // full-bleed, behind a page title
  'hero-about': ['hero'],
  'hero-contact': ['hero'],
  'hero-doha': ['hero'],
  'skyline-tall': ['hero'],
  'why-group': ['hero'],
  'about-platform': ['hero'],

  // a sector: the photograph behind its own page title
  'hero-sector-trading': ['hero'],
  'hero-sector-supply-distribution': ['hero'],
  'hero-sector-consumer-services': ['hero'],
  'hero-sector-food-beverage': ['hero'],

  // a company: its page title, its card, its panel in the row, its plate
  'hero-lusail-commercial': ['hero', 'plate', 'panel', 'thumb'],
  'hero-roma-commercial': ['hero', 'plate', 'panel', 'thumb'],
  'hero-cavallo-laundry': ['hero', 'plate', 'panel', 'thumb'],
  'hero-nero-cafe': ['hero', 'plate', 'panel', 'thumb'],

  // the upright shot beside a company's opening paragraphs
  'still-lusail-commercial': ['still'],
  'still-roma-commercial': ['still'],
  'coffee-still': ['still'],
  'lifestyle-wide': ['still'],

  // the home page's sector cards
  'card-trading': ['card'],
  'card-supply': ['card'],
  'card-consumer': ['card'],
  'card-food': ['card'],

  // the product rail on a company page
  'prod-air-freight': ['rail'],
  'prod-dry-food': ['rail'],
  'prod-food-commodities': ['rail'],
  'prod-fresh-fruits': ['rail'],
  'prod-fresh-vegetables': ['rail'],
  'prod-grains-pulses': ['rail'],
  'prod-industrial-commodities': ['rail'],
  'prod-land-freight': ['rail'],
  'prod-ocean-freight': ['rail'],
  'prod-rice': ['rail'],
  'prod-vessel-chartering': ['rail'],
};
