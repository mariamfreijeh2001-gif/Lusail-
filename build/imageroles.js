/* What each photograph is used for, which decides the widths build/variants.js
 * makes and the `sizes` build/render.js writes. The roles are measured, not
 * guessed: every box here was read off a browser at 1440 and at 390.
 *
 * A photograph with two roles takes the union of their widths. A company
 * hero has three: the full-width page opening, its card on the home grid,
 * and its plate in the other-companies row.
 *
 * Adding a photograph means adding a line here and running `npm run images`.
 * A page that asks for a file nobody made fails the build rather than
 * shipping a hole, so a forgotten line cannot reach the site.
 */
module.exports = {
  // full-bleed, behind a page title
  'hero-about': ['hero'],
  'hero-partnerships': ['hero'],
  'hero-contact': ['hero'],
  'hero-doha': ['hero'],
  'hero-sectors': ['hero'],
  'why-group': ['hero'],
  'about-platform': ['hero'],

  // a sector: the photograph behind its own page title, and its strip in the
  // home page's accordion
  'hero-sector-investments': ['hero'],
  'hero-sector-energy-industrial': ['hero'],
  'hero-sector-technology': ['hero'],
  'hero-sector-trading': ['hero'],
  'hero-sector-supply-distribution': ['hero'],
  'hero-sector-consumer-services': ['hero'],
  'hero-sector-food-beverage': ['hero'],

  // a company: its page title, its card, its panel in the row, its plate
  'hero-tibeco-group': ['hero', 'plate', 'panel'],
  'hero-lusail-commercial': ['hero', 'plate', 'panel'],
  'hero-roma-commercial': ['hero', 'plate', 'panel'],
  'hero-cavallo-laundry': ['hero', 'plate', 'panel'],
  'hero-nero-cafe': ['hero', 'plate', 'panel'],

  // the upright shot beside a company's opening paragraphs
  'still-tibeco-group': ['still'],
  // the two sides of Lusail Commercial, side by side
  'panel-food-commodities': ['panel'],
  'panel-ocean-freight': ['panel'],
  'still-lusail-commercial': ['still'],
  'still-roma-commercial': ['still'],
  'coffee-still': ['still'],
  'lifestyle-wide': ['still'],

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
  'prod-energy-materials': ['rail', 'panel'],
  'prod-technology-systems': ['rail', 'panel'],
  'prod-equipment': ['rail', 'panel'],
  'prod-food-security': ['rail', 'panel'],
  'prod-project-supply': ['rail', 'panel'],
};
