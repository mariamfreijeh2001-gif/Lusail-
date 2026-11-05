/* ==========================================================================
   Lusail Corp — all site content.

   STRUCTURE: two tiers, service area -> services. The site lists what the
   Group provides — sulphur, coffee, sugar, fresh produce, freight, laundry —
   rather than which company provides it. An area is a heading that groups
   the services; every area has a page of its own, and every service is
   written up in full as a section on it.

       /services/                  every area, each with the services inside it
       /services/<area>/           one area, with each of its services in full
       /services/<area>/#<slug>    one service, on that page

   The companies that deliver the services are named in ONE place only: the
   "companies" section of the About page, drawn from COMPANIES below. No
   service links to a company and no menu names one.

   WRITING
   Plain sentences, concrete nouns, no filler. Say what a service is, what
   it supplies and where from. Nothing here should be a claim nobody could
   check.

   PHOTOGRAPHY
   An area's `hero` is the wide photograph behind every page in it; a
   service's `img` is the shot beside its opening paragraphs and its card on
   the index. All of them live in site-assets/img/ and are named for where
   they appear.

   LANGUAGE
   English only. The site carried Arabic until the content was rewritten, at
   which point every translation described text that no longer existed. They
   are in git history at 7f548c4 if they are ever wanted back — but they
   describe the old copy, not this.
   ========================================================================== */

const SITE = {
  name: 'Lusail Corp',
  tagline: 'Building Businesses. Creating Value.',
  supporting: 'One Group. Multiple Businesses. Shared Ambition.',
  blurb: 'A diversified corporate group based in the State of Qatar.',
  domain: 'https://www.lusailcorp.com',

  /* The logo is an asset, not a design ingredient. Nothing in the layout is
     derived from its shape, so swapping these files re-brands the site.
     Paths are relative to site-assets/logo/. */
  brand: {
    /* Both bars are carbon, so both take the reversed lockup. */
    logoOnLight: 'lusail-corp-horizontal-full-color.svg',
    logoOnDark: 'lusail-corp-horizontal-reversed.svg',
    logoWidth: 564, logoHeight: 142,
    /* The monogram on its own, used large and quietly. */
    markOnLight: 'lusail-corp-mark-full-color.svg',
    faviconSvg: 'favicon.svg',
    faviconIco: 'favicon.ico',
    appleTouch: 'apple-touch-icon.png'
  },

  /* One published address. Enquiries are routed internally from there, which
     is why the form sends the 'area' field — it tells the Group which desk a
     message belongs to. */
  contact: {
    location: 'State of Qatar',
    email: 'info@lusailcorp.com',
    phone: '+974 4434 1999',
    linkedin: '#',
    instagram: '#'
  }
};

/* --------------------------------------------------------------------------
   THE COMPANIES — named in one section of the About page and nowhere else.

   `desk` is not shown: it is the key the contact function routes by
   (CONTACT_TO_<DESK>), and each service area below names the desk its
   enquiries go to. `site` links a company to its own website, in a new tab.
   -------------------------------------------------------------------------- */

const COMPANIES = [
  { slug: 'tibeco-group', name: 'TIBECO Group', site: 'https://www.tibecogroup.com/',
    role: 'Commerce · Investment · Services',
    short: 'A multi-sector business and investment platform in West Bay, Doha: institutional supply, strategic investment, and technology, energy and logistics services. ISO 9001, 14001 and 45001; a member of ICC Qatar.' },
  { slug: 'lusail-commercial', name: 'Lusail Commercial',
    role: 'Trading & Logistics',
    short: 'Commodity trading and international freight in one business — sulphur, coffee, sugar, edible oils and wheat, bought abroad and carried by sea, land and air.' },
  { slug: 'roma-commercial', name: 'ROMA Commercial',
    role: 'Food Import & Distribution',
    short: 'Fresh produce, rice and essential foods imported and distributed to supermarkets, hotels, restaurants, caterers and wholesalers across Qatar.' },
  { slug: 'cavallo-laundry', name: 'Cavallo Laundry',
    role: 'Garment & Textile Care',
    short: 'Professional laundry and garment care for households, built around turnaround, handling and consistency.' },
  { slug: 'nero-cafe', name: 'Nero Café',
    role: 'Coffee & Hospitality',
    short: 'The Group’s café: quality coffee, service across the counter, and a room people come back to.' }
];

/* --------------------------------------------------------------------------
   SERVICE AREAS and the services inside them

   An area:
     slug, name, short, headline, intro, body   the area's own story
     facts                                      the strip under its page title
     quote                                      true where a buyer asks for a quotation
                                                (the form at /quote/) rather than sends an enquiry
     buying, buyingTitle                        how buying works, as steps
     why                                        the checkable reasons to buy from the Group here
     customers                                  who the area serves
     hero                                       behind its page title
     accent, accentText, tint, accentOn         the colour its pages carry
     icon                                       its mark in the menu
     desk                                       which desk an enquiry reaches
     services: [ … ]

   A service:
     slug, name, role, headline, short, intro, body
     img                 the shot beside the story and on the index card
     facts               the strip under the opening
     lines               what is actually supplied — the specifications,
                         the varieties, the routes
     origins             where it is sourced from; each must be on REACH
     steps               how the work moves, where that helps
     activities          the tags under the story
     supply              the Supplier Portal category a producer of this
                         would register in, which puts a "Supply this" button
                         on the page
     cta                 the ask
   -------------------------------------------------------------------------- */

const AREAS = [
  {
    slug: 'commodities',
    name: 'Commodity Trading',
    short: 'Sulphur, coffee, sugar, edible oils and wheat — bought abroad, by specification, and shipped by sea, land and air.',
    headline: 'Global Supply, Commercially Answered',
    intro: 'We buy commodities internationally and carry them, which is one service rather than two.',
    hero: 'hero-sector-food-beverage',
    accent: '#d3a750', accentText: '#7d5a1d', tint: '#f7efdf', accentOn: '#0b1a3a',
    icon: 'markets', desk: 'lusail-commercial',
    body: [
      'This is the part of the Group that works outside Qatar. We source granular sulphur, green coffee, sugar, edible oils and wheat from producers and suppliers across the Middle East, Europe and the Black Sea, Asia and Central Asia, Africa, the Americas and Australia.',
      'We also move them. Ocean, road and air freight, vessel chartering and heavy transport sit in the same business as the buying, so an enquiry about a commodity is answered with the origin, the specification and the route at the same time.',
      'Which origin is used is a commercial decision, not a standing arrangement: it depends on the product, the season, quality, availability and the terms on the day.'
    ],
    quote: true,
    buyingTitle: 'Enquiry to shipment',
    buying: [
      { t: 'Enquiry', d: 'Tell us the product, the quantity, the destination and when you need it. The quotation form takes two minutes.' },
      { t: 'Offer', d: 'Within two working days: the origin, the specification, the price FOB or CFR, and the laycan or shipping window.' },
      { t: 'Contract', d: 'A contract on the agreed terms, payment by letter of credit or as agreed, and the load-port inspection named.' },
      { t: 'Shipment', d: 'The vessel or containers fixed by our own freight desk, the documents issued, and the cargo delivered.' }
    ],
    why: [
      { t: 'One counterpart for the buying and the freight', d: 'The trading desk and the freight desk are one business, so an enquiry is answered with the origin, the specification and the delivered price together.' },
      { t: 'Every cargo inspected independently', d: 'Weight and quality are certified at the load port by SGS, Intertek or Bureau Veritas, and sold to a written specification.' },
      { t: 'Origins that can switch', d: 'Sourcing across six regions means a cargo can move origin when a season ends, a port closes or the terms change.' },
      { t: 'An offer within two working days', d: 'A priced offer, or the questions we need answered to price it, inside two working days of your request.' }
    ],
    customers: ['Refiners and food manufacturers', 'Fertiliser, chemical and metallurgical plants', 'Flour and feed mills', 'Roasters and coffee traders', 'Importers and distributors', 'Government and institutional buyers'],
    facts: [
      { k: 'Products', v: 'Sulphur, coffee, sugar, edible oils, wheat' },
      { k: 'Sourcing', v: 'Six regions, by season and terms' },
      { k: 'Shipping', v: 'Sea, land and air, by the same desk' },
      { k: 'Terms', v: 'FOB, CFR or delivered, by the cargo' }
    ],
    services: [
      {
        slug: 'sulphur',
        name: 'Sulphur',
        role: 'Granular solid sulphur, in bulk',
        headline: 'Granular Sulphur, Shipped in Bulk',
        short: 'Granular solid sulphur in bulk for industrial and commercial use, sourced in the Gulf and Central Asia, with the shipping arranged alongside.',
        intro: 'We supply granular solid sulphur in bulk, and arrange the vessel that carries it.',
        body: [
          'Sulphur is a by-product of gas and oil processing, and the Gulf produces more of it than it uses. We buy it from producers and authorised sellers in the region and in Central Asia and sell it in bulk to industrial buyers — fertiliser, chemical and metallurgical plants — in Asia, Africa and the Mediterranean.',
          'The product is granular: formed, dry, low in dust and fines, which is what receiving ports and plants ask for. Every cargo is sold to a specification sheet and inspected at the load port by an independent surveyor.',
          'Because the freight sits in the same business, a sulphur enquiry is answered as a delivered price — FOB or CFR — with the laycan and the vessel class the route allows.'
        ],
        img: 'prod-sulphur',
        facts: [
          { k: 'Form', v: 'Granular, 2–6 mm' },
          { k: 'Typical purity', v: '99.5% minimum, dry basis' },
          { k: 'Quantity', v: 'Vessel lots, 15,000 MT and up' },
          { k: 'Terms', v: 'FOB Gulf ports or CFR destination' }
        ],
        lines: [
          { t: 'Granular sulphur, Grade A', d: 'Bright yellow granules, 99.5% sulphur minimum, moisture 0.5% maximum, low dust and fines — to the buyer’s specification sheet.' },
          { t: 'Bulk vessel lots', d: 'Handysize to Supramax parcels, 15,000 to 50,000 MT, up to two vessels within a laycan.' },
          { t: 'Independent inspection', d: 'Weight and quality certified at the load port by SGS, Intertek or Bureau Veritas.' },
          { t: 'Delivered pricing', d: 'FOB Ras Laffan or Mesaieed, or CFR the receiving port, with the freight arranged by the same desk.' }
        ],
        origins: ['Qatar', 'UAE', 'Turkmenistan', 'Kazakhstan'],
        activities: ['Bulk Commodities', 'Industrial Supply', 'Vessel Chartering', 'Letters of Credit'],
        supply: 'energy-materials',
        cta: 'Enquire about sulphur'
      },
      {
        slug: 'coffee',
        name: 'Coffee',
        role: 'Green coffee, by origin and grade',
        headline: 'Green Coffee From the Origins That Grow It',
        short: 'Green arabica and robusta coffee bought by origin, grade and crop, from Africa, Asia and the Americas, and shipped to roasters and traders.',
        intro: 'We buy green coffee at origin — by grade, screen size and crop year — and ship it to roasters and traders.',
        body: [
          'Coffee is bought from exporters and cooperatives in the countries that grow it. Arabica from Ethiopia, Colombia and Brazil; robusta from Uganda, Vietnam and Indonesia. Each lot is bought against a sample and a grade, not a description.',
          'What a roaster needs is consistency across a contract: the same screen, the same defect count, the same cup, shipment after shipment. Our buying is built around that, with pre-shipment samples approved before a container is stuffed.',
          'The coffee travels in jute or GrainPro-lined bags in containers, and the shipping, documents and customs are handled by the same desk that bought it.'
        ],
        img: 'coffee-still',
        facts: [
          { k: 'Varieties', v: 'Arabica and robusta' },
          { k: 'Grades', v: 'By origin standard, screen size and defect count' },
          { k: 'Packing', v: '60 or 70 kg bags, containerised' },
          { k: 'Terms', v: 'FOB origin or CFR destination' }
        ],
        lines: [
          { t: 'Washed and natural arabica', d: 'Ethiopian grades 1 to 4, Colombian Excelso and Supremo, Brazilian NY 2/3 — by screen size and cup.' },
          { t: 'Robusta', d: 'Ugandan Screen 15 and 18, Vietnamese Grade 1 and 2, Indonesian EK-1 — for blends and instant.' },
          { t: 'Sample approval', d: 'Offer samples, then pre-shipment samples, approved by the buyer before loading.' },
          { t: 'Containerised shipment', d: 'Full containers of 19 to 21 MT in jute bags, with liners where the destination asks for them.' }
        ],
        origins: ['Ethiopia', 'Uganda', 'Brazil', 'Colombia', 'Vietnam', 'Indonesia'],
        activities: ['Green Coffee', 'Origin Sourcing', 'Quality Sampling', 'Container Shipping'],
        supply: 'commodities-food',
        cta: 'Enquire about coffee'
      },
      {
        slug: 'sugar',
        name: 'Sugar',
        role: 'Refined white and raw sugar',
        headline: 'Sugar, by Grade and by the Shipload',
        short: 'Refined white cane sugar (ICUMSA 45) and raw sugar in bagged or bulk lots, for refiners, food manufacturers and distributors.',
        intro: 'We supply refined white sugar and raw sugar, bagged or in bulk, in quantities from a container to a vessel.',
        body: [
          'Sugar is bought from mills and refineries in the producing countries and from the Gulf refineries that process raw cane. Refined white sugar is sold to the ICUMSA 45 standard; raw sugar to the standard the refiner specifies.',
          'The work is in the documents and the timing as much as the price: a current crop year, a polarisation and moisture that hold on arrival, packing that survives the port, and a shipment date that fits the buyer’s own programme.',
          'Smaller buyers take containers of 50 kg bags; larger ones take breakbulk or bulk vessels. Both are quoted with the freight, so the price is a landed one.'
        ],
        img: 'prod-sugar',
        facts: [
          { k: 'Grades', v: 'ICUMSA 45 refined white; raw sugar' },
          { k: 'Packing', v: '50 kg PP bags with liner; 1 MT big bags; bulk' },
          { k: 'Quantity', v: 'Containers to 25,000 MT vessels' },
          { k: 'Terms', v: 'FOB origin or CFR Hamad Port and beyond' }
        ],
        lines: [
          { t: 'Refined white cane sugar, ICUMSA 45', d: 'Polarisation 99.8° minimum, moisture and ash 0.04% maximum, current crop year, fit for human consumption.' },
          { t: 'Raw cane sugar', d: 'For refiners, to the polarisation and colour the refinery specifies.' },
          { t: 'Bagged or bulk', d: '50 kg polypropylene bags with inner liner for containers and breakbulk; bulk for refinery cargoes.' },
          { t: 'Inspection and payment', d: 'Load-port inspection by SGS or Intertek; payment by irrevocable letter of credit at sight.' }
        ],
        origins: ['Brazil', 'India', 'Ukraine', 'UAE'],
        activities: ['Bulk Commodities', 'Food Manufacturing Supply', 'Letters of Credit', 'Breakbulk Shipping'],
        supply: 'commodities-food',
        cta: 'Enquire about sugar'
      },
      {
        slug: 'edible-oils',
        name: 'Edible Oils',
        role: 'Palm olein, sunflower and soybean oil',
        headline: 'Edible Oils in Bulk, Drum and Bottle',
        short: 'Refined palm olein, sunflower and soybean oil for food manufacturers, distributors and institutional buyers, in flexitanks, drums and retail packs.',
        intro: 'We supply refined edible oils — palm olein, sunflower and soybean — in the pack the buyer’s line or shelf needs.',
        body: [
          'Edible oil is bought from refineries in the producing regions: palm olein from South-East Asia, sunflower oil from the Black Sea and Türkiye, soybean oil from South America. Each is sold refined, bleached and deodorised, to the buyer’s specification.',
          'A manufacturer takes oil in flexitanks or ISO tanks; a distributor takes it in drums, jerrycans or retail bottles under its own label. We quote all of them, with the freight, because the pack decides the route as much as the origin does.',
          'Food oil has a shelf life, so the schedule matters: production date, shipping window and arrival are agreed before the order is confirmed.'
        ],
        img: 'prod-edible-oils',
        facts: [
          { k: 'Oils', v: 'Palm olein, sunflower, soybean' },
          { k: 'Packing', v: 'Flexitank, ISO tank, drum, jerrycan, bottle' },
          { k: 'Quantity', v: 'From one container' },
          { k: 'Terms', v: 'CFR or CIF destination' }
        ],
        lines: [
          { t: 'RBD palm olein', d: 'Refined, bleached and deodorised, IV 56 or 60, from Indonesian and Malaysian refineries.' },
          { t: 'Refined sunflower oil', d: 'Black Sea and Turkish origin, in bulk or bottled under the buyer’s label.' },
          { t: 'Refined soybean oil', d: 'South American origin, for food manufacturing and institutional catering.' },
          { t: 'Private label', d: 'Bottled and labelled at origin to the buyer’s design, with Arabic labelling and MoPH registration where Qatar is the destination.' }
        ],
        origins: ['Indonesia', 'Ukraine', 'Türkiye', 'Brazil'],
        activities: ['Food Commodities', 'Private Label', 'Bulk Liquids', 'Institutional Supply'],
        supply: 'commodities-food',
        cta: 'Enquire about edible oils'
      },
      {
        slug: 'wheat-grains',
        name: 'Wheat & Grains',
        role: 'Milling wheat, feed grains and flour',
        headline: 'Wheat and Grains for Mills, Feed and Food',
        short: 'Milling wheat, feed barley and corn, and flour, sourced from the Black Sea, Central Asia and Australia for mills, feed producers and food manufacturers.',
        intro: 'We supply milling wheat, feed grains and flour from the regions that grow them, in bagged or bulk lots.',
        body: [
          'Wheat is bought from exporters in Ukraine, Kazakhstan, Australia and Canada, by protein, gluten, falling number and test weight — the figures a mill buys on. Feed barley and corn are bought the same way for feed producers.',
          'A grain cargo is a logistics exercise: the crop, the port, the vessel and the laycan all have to line up, and the documents — phytosanitary, fumigation, weight and quality — have to be right for the receiving country.',
          'Bagged flour and smaller grain lots travel in containers; milling programmes take bulk vessels. Both are quoted delivered.'
        ],
        img: 'panel-food-commodities',
        facts: [
          { k: 'Products', v: 'Milling wheat, feed barley, corn, flour' },
          { k: 'Quality', v: 'By protein, gluten, falling number and test weight' },
          { k: 'Packing', v: 'Bulk; 50 kg bags; big bags' },
          { k: 'Terms', v: 'FOB or CFR, by the cargo' }
        ],
        lines: [
          { t: 'Milling wheat', d: 'Protein 11.5% to 13.5%, falling number 250 s minimum, by origin standard and crop year.' },
          { t: 'Feed grains', d: 'Feed barley and yellow corn for feed mills and livestock programmes.' },
          { t: 'Wheat flour', d: 'All-purpose and bakery grades in 50 kg bags, from mills at origin or in the Gulf.' },
          { t: 'Bulk cargoes', d: 'Handysize and Supramax vessels, with phytosanitary, fumigation and quality certificates for the receiving port.' }
        ],
        origins: ['Ukraine', 'Kazakhstan', 'Australia', 'Canada', 'Bulgaria'],
        activities: ['Bulk Grains', 'Milling Supply', 'Feed Supply', 'Bulk Shipping'],
        supply: 'commodities-food',
        cta: 'Enquire about wheat and grains'
      }
    ]
  },

  {
    slug: 'food',
    name: 'Food Supply & Distribution',
    short: 'Fresh produce, rice, grains and dry goods, imported and delivered to the businesses that sell and serve them in Qatar.',
    headline: 'From Global Farms to Qatar’s Market',
    intro: 'Distribution is the link between a producer abroad and a kitchen, a shelf or a warehouse in Qatar.',
    hero: 'hero-roma-commercial',
    accent: '#3f7d3a', accentText: '#2f6a2b', tint: '#edf4e8',
    icon: 'supply', desk: 'roma-commercial',
    body: [
      'Almost everything we distribute arrives by ship or by plane, so the work is in the chain rather than any single link: finding producers, getting the goods in, and putting them where the buyer needs them, in the condition the buyer expects.',
      'Fresh produce has a short commercial life and agricultural supply moves with the season, so this is a business of timing. Relationships across several growing regions matter more than a single cheap origin, because they are what let the supply shift when a season ends or availability tightens.',
      'We sell into the retail and food-service trade: supermarkets, hotels, restaurants, caterers and wholesalers.'
    ],
    quote: true,
    buyingTitle: 'Enquiry to delivery',
    buying: [
      { t: 'Enquiry', d: 'Tell us the lines, the volumes, the pack and where it is delivered — a store, a kitchen, a warehouse.' },
      { t: 'Offer and samples', d: 'A priced offer within two working days, with samples where the line needs them.' },
      { t: 'Programme', d: 'A standing weekly programme agreed: schedule, pack sizes, labels, and the origin to switch to when the season moves.' },
      { t: 'Delivery', d: 'Imported, cleared, held in Qatar where needed, and delivered chilled or dry to your schedule.' }
    ],
    why: [
      { t: 'Standing programmes, not one-off loads', d: 'Weekly schedules agreed in advance, with the pack sizes, labels and the origin to switch to when the season moves.' },
      { t: 'Compliant before it ships', d: 'Ministry of Public Health registration, Halal certification where it applies and Arabic labelling on every line.' },
      { t: 'The cold chain held to the shelf', d: 'Reefers at the variety’s own temperature, cleared on arrival and delivered chilled on your schedule.' },
      { t: 'Stock in Qatar', d: 'Rice, pulses and dry goods held locally for the customers who need delivery this week.' }
    ],
    customers: ['Supermarkets and retail chains', 'Hotels and restaurants', 'Caterers and institutional kitchens', 'Wholesalers', 'Food manufacturers'],
    facts: [
      { k: 'Products', v: 'Fresh produce, rice, pulses, dry foods' },
      { k: 'Market', v: 'Qatar' },
      { k: 'Customers', v: 'Retail, hospitality, catering, wholesale' },
      { k: 'Compliance', v: 'MoPH registration, Halal, Arabic labelling' }
    ],
    services: [
      {
        slug: 'fresh-vegetables',
        name: 'Fresh Vegetables',
        role: 'Imported weekly, by season and origin',
        headline: 'Fresh Vegetables, Every Week of the Year',
        short: 'Tomatoes, cucumbers, peppers, onions, potatoes and leafy produce, imported by air and sea and delivered to retailers and kitchens across Qatar.',
        intro: 'We import fresh vegetables on a weekly programme and deliver them to supermarkets, hotels, restaurants and caterers.',
        body: [
          'Vegetables are sourced by season: Mediterranean and Turkish origins by sea in reefers, Indian and Chinese origins for the staples, and European origins by air when a line needs to be filled quickly. The origin moves as the seasons do.',
          'What a buyer sees is a grade and a shelf life on arrival. We buy Class I produce against a market specification, with the phytosanitary certificate and the Ministry of Public Health registration every shipment needs, and we reject at the port what does not meet it.',
          'Delivery is the last link: chilled, on a schedule, to the buyer’s store or kitchen.'
        ],
        img: 'prod-fresh-vegetables',
        facts: [
          { k: 'Lines', v: 'Tomatoes, cucumbers, capsicum, onions, potatoes, leafy produce' },
          { k: 'Grade', v: 'Class I, Qatar market specification' },
          { k: 'Arrival', v: 'Sea reefer and air, weekly' },
          { k: 'Customers', v: 'Retail, hospitality, catering, wholesale' }
        ],
        lines: [
          { t: 'Salad and cooking vegetables', d: 'Tomatoes, cucumbers, capsicum, courgettes, aubergines, onions and potatoes, by the pallet or the container.' },
          { t: 'Leafy and herb lines', d: 'Lettuce, rocket, spinach, parsley and coriander, flown in to hold their shelf life.' },
          { t: 'Weekly programmes', d: 'Mixed reefer loads to a standing order, with the origin switched mid-season when quality or price moves.' },
          { t: 'Compliance', d: 'GlobalG.A.P. or equivalent growers, phytosanitary certificate per shipment, MoPH registration and Arabic labelling.' }
        ],
        origins: ['Spain', 'Türkiye', 'India', 'China'],
        steps: [
          { t: 'Source', d: 'Growers and exporters across several regions, so supply can shift as a season ends or availability tightens.' },
          { t: 'Import', d: 'Reefers to Hamad Port or air freight to Doha, cleared and inspected on arrival.' },
          { t: 'Distribute', d: 'Delivered chilled to supermarkets, hotels, restaurants, caterers and wholesalers.' }
        ],
        activities: ['Fresh Produce', 'Cold Chain', 'Seasonal Sourcing', 'Qatar Distribution'],
        supply: 'fresh-food',
        cta: 'Enquire about fresh vegetables'
      },
      {
        slug: 'fresh-fruits',
        name: 'Fresh Fruits',
        role: 'Apples, citrus, bananas, grapes and more',
        headline: 'Fresh Fruit as the Seasons Allow',
        short: 'Apples, citrus, bananas, grapes, melons and stone fruit from international growing regions, delivered to retail and food service in Qatar.',
        intro: 'We import fresh fruit from the growing regions in season and deliver it to retailers and kitchens across Qatar.',
        body: [
          'Fruit follows the harvest: citrus and stone fruit from Spain and Türkiye, bananas and tropical fruit from South America and India, apples and grapes from wherever the season is. Buying across hemispheres is what keeps a line on the shelf all year.',
          'Each line is bought by variety, size and grade, ripened or not as the customer wants it, and shipped in reefers at the temperature that variety needs. Bananas are ripened in Qatar to order.',
          'The customer is a supermarket buyer, a hotel purchasing manager or a wholesaler, and each gets a standing programme rather than a one-off load.'
        ],
        img: 'prod-fresh-fruits',
        facts: [
          { k: 'Lines', v: 'Apples, citrus, bananas, grapes, melons, stone fruit' },
          { k: 'Grade', v: 'Class I, by variety and size' },
          { k: 'Arrival', v: 'Sea reefer; air for soft fruit' },
          { k: 'Customers', v: 'Retail, hospitality, catering, wholesale' }
        ],
        lines: [
          { t: 'Citrus and apples', d: 'Oranges, lemons, mandarins and apples by variety and count, from Mediterranean and Southern Hemisphere seasons.' },
          { t: 'Bananas and tropical fruit', d: 'Green bananas ripened to order in Qatar; pineapples, mangoes and papaya in season.' },
          { t: 'Grapes, melons and stone fruit', d: 'Seasonal programmes from Spain, Türkiye and South America.' },
          { t: 'Retail and food-service packs', d: 'Loose, pre-packed or bulk, to the customer’s shelf or kitchen.' }
        ],
        origins: ['Spain', 'Brazil', 'Colombia', 'India', 'Türkiye'],
        steps: [
          { t: 'Source', d: 'Growers and exporters in both hemispheres, so a line is in season somewhere all year.' },
          { t: 'Import', d: 'Reefers at the variety’s own temperature, cleared and inspected at Hamad Port or Doha airport.' },
          { t: 'Distribute', d: 'Ripened where needed, then delivered chilled to the customer.' }
        ],
        activities: ['Fresh Produce', 'Cold Chain', 'Ripening', 'Retail Supply'],
        supply: 'fresh-food',
        cta: 'Enquire about fresh fruits'
      },
      {
        slug: 'rice',
        name: 'Rice',
        role: 'Basmati, long-grain, parboiled and white',
        headline: 'Rice by Variety, Grade and Pack',
        short: 'Basmati, long-grain, parboiled and white rice by variety, grade and pack size, for retail, food service and hospitality in Qatar.',
        intro: 'We import rice by variety and grade and supply it in the pack size each customer sells or cooks from.',
        body: [
          'Rice is bought from millers and exporters in India and Vietnam: basmati and sella from the Indian subcontinent, long-grain and jasmine from South-East Asia. Each is bought by grade, broken percentage, moisture and age.',
          'A hotel kitchen, a supermarket and a wholesaler want the same rice in different packs. We supply 1 kg to 40 kg bags under our own labels or the customer’s, and bulk big bags for processors.',
          'Rice keeps, so the work is in buying the right crop at the right time and holding stock in Qatar for the customers who need delivery this week.'
        ],
        img: 'still-roma-commercial',
        facts: [
          { k: 'Varieties', v: 'Basmati, sella, long-grain, jasmine, parboiled, white' },
          { k: 'Grades', v: 'By broken percentage, moisture and age' },
          { k: 'Packing', v: '1 kg to 40 kg bags; 1 MT big bags' },
          { k: 'Customers', v: 'Retail, food service, hospitality, wholesale' }
        ],
        lines: [
          { t: 'Basmati and sella', d: 'Aged 1121 and traditional basmati, white and golden sella, in retail and catering packs.' },
          { t: 'Long-grain and jasmine', d: 'Vietnamese and Thai-style long-grain, 5% to 25% broken, for food service and wholesale.' },
          { t: 'Parboiled and white rice', d: 'For institutional catering and manufacturing, in 25 and 40 kg bags or big bags.' },
          { t: 'Private label', d: 'Packed and labelled to the customer’s design at origin or in Qatar.' }
        ],
        origins: ['India', 'Vietnam'],
        activities: ['Staple Foods', 'Private Label', 'Wholesale Supply', 'Stock in Qatar'],
        supply: 'fresh-food',
        cta: 'Enquire about rice'
      },
      {
        slug: 'grains-pulses',
        name: 'Grains & Pulses',
        role: 'Lentils, chickpeas, beans and peas',
        headline: 'Pulses and Grains for Shelf and Kitchen',
        short: 'Lentils, chickpeas, beans, peas and wheat products, imported in bulk and packed for retail, food service and manufacturing in Qatar.',
        intro: 'We import pulses and packed grains from the regions that grow them and supply them packed for the shelf or the kitchen.',
        body: [
          'Pulses are bought from exporters in Canada, Australia, Türkiye and India — red and green lentils, chickpeas, kidney and white beans, split peas — by size, colour and defect count.',
          'They arrive in containers of 25 or 50 kg bags and are repacked in Qatar into retail packs under our labels or the customer’s, or supplied in bulk bags to food manufacturers and caterers.',
          'Alongside them we supply packed wheat products — flour, semolina, bulgur and pasta — to the same customers, on the same deliveries.'
        ],
        img: 'prod-food-security',
        facts: [
          { k: 'Lines', v: 'Lentils, chickpeas, beans, peas, flour, semolina, bulgur' },
          { k: 'Quality', v: 'By size, colour and defect count' },
          { k: 'Packing', v: 'Retail packs; 25 and 50 kg bags; bulk' },
          { k: 'Customers', v: 'Retail, food service, manufacturing' }
        ],
        lines: [
          { t: 'Lentils', d: 'Red football and split red lentils, green and brown lentils, by calibre.' },
          { t: 'Chickpeas and beans', d: 'Kabuli chickpeas by size, kidney, white and black beans, split and whole peas.' },
          { t: 'Wheat products', d: 'Flour, semolina, bulgur and pasta in retail and catering packs.' },
          { t: 'Repacking', d: 'Bulk imports packed in Qatar to the customer’s pack size and label.' }
        ],
        origins: ['Canada', 'Australia', 'Türkiye', 'India'],
        activities: ['Staple Foods', 'Repacking', 'Private Label', 'Wholesale Supply'],
        supply: 'fresh-food',
        cta: 'Enquire about grains and pulses'
      },
      {
        slug: 'dry-foods',
        name: 'Dry Food Products',
        role: 'Shelf-stable staples and FMCG',
        headline: 'Shelf-Stable Foods, Imported to Demand',
        short: 'Shelf-stable staples and packaged foods — oils, canned goods, dried fruit and nuts, spices, dairy and beverages — imported and distributed in Qatar.',
        intro: 'We import shelf-stable foods and packaged goods to what the Qatar market asks for and distribute them to retail and food service.',
        body: [
          'Dry foods are the widest line: cooking oils and ghee, canned vegetables and pulses, dried fruit and nuts, spices, sauces, dairy, juices and beverages. They are bought from manufacturers and exporters in Türkiye, India, China and the Gulf, by brand or under our own labels.',
          'The range follows demand. A supermarket chain, a hotel group or a catering company tells us what it needs on the shelf and in the store, and the line is sourced, registered and delivered to that.',
          'Every product carries the Ministry of Public Health registration, the Halal certification where it applies, and the Arabic labelling Qatar requires, before it ships.'
        ],
        img: 'prod-food-commodities',
        facts: [
          { k: 'Lines', v: 'Oils, canned goods, dried fruit and nuts, spices, dairy, beverages' },
          { k: 'Brands', v: 'Manufacturers’ brands or private label' },
          { k: 'Compliance', v: 'MoPH registration, Halal, Arabic labelling' },
          { k: 'Customers', v: 'Retail, hospitality, catering, wholesale' }
        ],
        lines: [
          { t: 'Cooking essentials', d: 'Oils, ghee, sugar, salt, flour and pasta in retail and catering packs.' },
          { t: 'Canned and packaged goods', d: 'Canned vegetables, pulses and fish; sauces, pickles and condiments.' },
          { t: 'Dried fruit, nuts and spices', d: 'Dates, raisins, almonds, pistachios and whole and ground spices.' },
          { t: 'Dairy and beverages', d: 'Long-life milk, cheese, juices and water, chilled where the product needs it.' }
        ],
        origins: ['Türkiye', 'India', 'China', 'UAE'],
        activities: ['FMCG', 'Private Label', 'Halal Supply', 'Qatar Distribution'],
        supply: 'fresh-food',
        cta: 'Enquire about dry foods'
      }
    ]
  },

  {
    slug: 'logistics',
    name: 'Freight & Logistics',
    short: 'Ocean, land and air freight, vessel chartering and heavy transport, between Qatar and the world.',
    headline: 'The Cargo Itself, Managed',
    intro: 'We move goods by sea, land and air, for our own trading and for customers who need the freight on its own.',
    hero: 'hero-sector-trading',
    accent: '#4a7fa8', accentText: '#2e5f86', tint: '#ecf2f7',
    icon: 'crate', desk: 'lusail-commercial',
    body: [
      'The Group carries what it trades, and carries for others on the same routes: containers, bulk and breakbulk by sea, trucks and trailers across the Gulf, and air freight when the cargo cannot wait.',
      'Because the freight desk sits beside the trading desk, it handles the whole movement — booking, documents, customs, delivery — rather than one leg of it, and quotes a door-to-door price when that is what is wanted.',
      'The routes are the ones the Group’s own cargo travels: the Gulf, the Red Sea and Indian Ocean, the Black Sea and the Mediterranean, South-East Asia, and the Americas.'
    ],
    quote: true,
    buyingTitle: 'Enquiry to delivery',
    buying: [
      { t: 'Enquiry', d: 'Tell us the cargo, the route, the dates and whether you want it port to port or door to door.' },
      { t: 'Quote', d: 'A rate, a transit time and the documents required, within two working days.' },
      { t: 'Booking', d: 'Space booked, documents prepared, customs and insurance arranged.' },
      { t: 'Movement', d: 'The cargo moved, tracked and delivered, with one counterpart and one invoice.' }
    ],
    why: [
      { t: 'One counterpart, one invoice', d: 'Booking, documents, customs, insurance and delivery handled by the same desk, port to port or door to door.' },
      { t: 'Our own cargo on the same routes', d: 'The Group moves its own sulphur, grain and produce on these routes, so the capacity and the agents are already in place.' },
      { t: 'Bulk and project cargo, not only boxes', d: 'Vessel chartering, breakbulk and out-of-gauge pieces alongside containers, road and air.' },
      { t: 'A quote within two working days', d: 'Rate, transit time and the documents required, inside two working days.' }
    ],
    customers: ['Traders and manufacturers shipping to or from Qatar', 'Importers and distributors', 'Contractors with project cargo', 'Bulk commodity buyers and sellers'],
    facts: [
      { k: 'Modes', v: 'Ocean, chartering, road, air' },
      { k: 'Routes', v: 'Gulf, Indian Ocean, Black Sea, Asia, Americas' },
      { k: 'Scope', v: 'Port to port or door to door' },
      { k: 'Documents', v: 'B/L, customs, certificates, insurance' }
    ],
    services: [
      {
        slug: 'ocean-freight',
        name: 'Ocean Freight',
        role: 'Container, bulk and breakbulk',
        headline: 'Container, Bulk and Breakbulk by Sea',
        short: 'Full and part container loads, bulk, breakbulk and project cargo between Qatar and international ports, with documents and customs handled.',
        intro: 'We ship full and part container loads, bulk and breakbulk cargo between Qatar and the ports the Group trades with.',
        body: [
          'Ocean freight is booked with the lines and operators serving Hamad Port and the Gulf: FCL and LCL containers on the main trades, reefers for food, and breakbulk or project cargo where a shipment does not fit a box.',
          'The desk handles the whole movement: the booking, the bill of lading, the certificates the destination needs, customs clearance at both ends and delivery to the door, so the customer has one counterpart and one invoice.',
          'For the Group’s own trading the freight is built into the delivered price; for customers it is quoted on its own.'
        ],
        img: 'still-lusail-commercial',
        facts: [
          { k: 'Cargo', v: 'FCL, LCL, reefer, breakbulk, project' },
          { k: 'Routes', v: 'Gulf, Indian Ocean, Black Sea, Mediterranean, Asia, Americas' },
          { k: 'Scope', v: 'Port to port or door to door' },
          { k: 'Documents', v: 'B/L, certificates, customs, insurance' }
        ],
        lines: [
          { t: 'Full and part containers', d: '20-ft and 40-ft dry, high-cube and reefer containers; LCL consolidation for smaller lots.' },
          { t: 'Breakbulk and project cargo', d: 'Out-of-gauge, heavy and project pieces, with the lifting and lashing arranged.' },
          { t: 'Customs and documents', d: 'Export and import clearance, certificates of origin, phytosanitary and inspection certificates, marine insurance.' },
          { t: 'Door to door', d: 'Collection at origin, port handling, sea leg and delivery in Qatar or at destination, on one quote.' }
        ],
        activities: ['Containers', 'Breakbulk', 'Customs Clearance', 'Marine Insurance'],
        supply: 'logistics',
        cta: 'Enquire about ocean freight'
      },
      {
        slug: 'vessel-chartering',
        name: 'Vessel Chartering',
        role: 'Bulk capacity for large shipments',
        headline: 'A Vessel for the Whole Cargo',
        short: 'Marine capacity arranged with shipping partners for bulk commodities and large-volume shipments, from Handysize parcels to full vessels.',
        intro: 'We charter vessels for bulk commodities and large shipments, on voyage or time terms, through our shipping partners.',
        body: [
          'A cargo of sulphur, sugar or grain does not travel in containers; it travels in a chartered vessel. We fix Handysize, Supramax and larger tonnage through brokers and owners for our own trading and for customers with a bulk cargo to move.',
          'The desk handles the fixture from enquiry to discharge: the laycan, the charter party, port agency at both ends, loading and discharge supervision, laytime and demurrage, and the marine insurance.',
          'Inbound to Qatar, the Group runs a standing programme of bulk and bagged commodity liftings into Hamad Port from Red Sea, Indian Ocean and Black Sea ports.'
        ],
        img: 'panel-ocean-freight',
        facts: [
          { k: 'Tonnage', v: 'Handysize, Supramax, Panamax' },
          { k: 'Terms', v: 'Voyage charter, COA, time charter' },
          { k: 'Parcels', v: '5,000 to 60,000 MT' },
          { k: 'Scope', v: 'Fixture, agency, supervision, insurance' }
        ],
        lines: [
          { t: 'Voyage charters', d: 'One cargo, one voyage: tonnage fixed to the laycan and the load and discharge ports.' },
          { t: 'Contracts of affreightment', d: 'A series of liftings over a season or a year, at an agreed rate per tonne.' },
          { t: 'Port agency and supervision', d: 'Agents at both ends, loading and discharge supervision, draft surveys.' },
          { t: 'Laytime and claims', d: 'Statements of fact, laytime calculations and demurrage handled by the same desk.' }
        ],
        activities: ['Bulk Shipping', 'Charter Parties', 'Port Agency', 'Demurrage'],
        supply: 'logistics',
        cta: 'Enquire about chartering'
      },
      {
        slug: 'land-freight',
        name: 'Land Freight',
        role: 'Trucks, trailers and heavy transport',
        headline: 'Trucks and Trailers Across Qatar and the Gulf',
        short: 'Heavy trucks, flatbed and low-bed trailers, reefers and container movement within Qatar and across regional borders.',
        intro: 'We move cargo by road within Qatar and across the Gulf — containers, general cargo, heavy and refrigerated loads.',
        body: [
          'Road freight is the leg every shipment ends with. We run and contract heavy trucks, flatbeds, low-beds and reefer trailers for container haulage from Hamad Port, deliveries to stores, kitchens and sites across Qatar, and cross-border movements to the UAE and the wider Gulf.',
          'Heavy and out-of-gauge pieces — plant, generators, transformers — travel on low-bed and extendable trailers with the permits and escorts the route requires.',
          'For food, reefer trailers hold the cold chain from port to shelf, and the delivery schedule is the customer’s, not ours.'
        ],
        img: 'prod-land-freight',
        facts: [
          { k: 'Fleet', v: 'Heavy trucks, flatbed, low-bed, reefer, container chassis' },
          { k: 'Coverage', v: 'Qatar and the Gulf by road' },
          { k: 'Loads', v: 'Containers, general, heavy, chilled' },
          { k: 'Scope', v: 'Haulage, permits, escorts, delivery' }
        ],
        lines: [
          { t: 'Container haulage', d: 'Port to warehouse and back, with customs and port formalities handled.' },
          { t: 'Distribution', d: 'Scheduled deliveries to supermarkets, hotels, restaurants and sites across Qatar.' },
          { t: 'Heavy and out-of-gauge', d: 'Low-bed and extendable trailers for plant and equipment, with route permits and escorts.' },
          { t: 'Cross-border', d: 'Road movements to the UAE and the Gulf, with transit documents and border clearance.' }
        ],
        activities: ['Road Haulage', 'Heavy Transport', 'Cold Chain', 'Cross-Border'],
        supply: 'logistics',
        cta: 'Enquire about land freight'
      },
      {
        slug: 'air-freight',
        name: 'Air Freight',
        role: 'Urgent, perishable and high-value cargo',
        headline: 'Air Freight When the Cargo Cannot Wait',
        short: 'Air freight for urgent, perishable and high-value cargo between Qatar and major international markets, airport to airport or door to door.',
        intro: 'We fly cargo that cannot wait for a ship — perishables, spare parts, urgent project pieces — between Doha and the world.',
        body: [
          'Air freight is booked on scheduled and charter capacity through Hamad International Airport and the hubs the Group trades through. Perishables fly in cool-chain handling; spare parts and project pieces fly as general cargo or on a charter when size or time demands it.',
          'The desk handles the airway bill, export and import clearance, airport handling and the final delivery, so a shipment is quoted and tracked as one job.',
          'Much of what we fly is our own: fresh produce from Europe, samples for the commodity desk, parts for a customer’s site. The same capacity is open to customers.'
        ],
        img: 'prod-air-freight',
        facts: [
          { k: 'Cargo', v: 'Perishables, parts, high-value, project' },
          { k: 'Capacity', v: 'Scheduled and charter' },
          { k: 'Hub', v: 'Hamad International Airport, Doha' },
          { k: 'Scope', v: 'Airport to airport or door to door' }
        ],
        lines: [
          { t: 'Perishables', d: 'Fresh produce, flowers and chilled food in cool-chain handling at both ends.' },
          { t: 'Urgent and high-value', d: 'Spare parts, electronics and documents, on the next available flight.' },
          { t: 'Charter', d: 'Part and full charters for project cargo and time-critical volumes.' },
          { t: 'Clearance and delivery', d: 'Export and import clearance, airport handling and delivery to the door.' }
        ],
        activities: ['Air Cargo', 'Perishables', 'Charter', 'Customs Clearance'],
        supply: 'logistics',
        cta: 'Enquire about air freight'
      }
    ]
  },

  {
    slug: 'energy-industrial',
    name: 'Energy, Industrial & Project Supply',
    short: 'Materials, equipment and project supply for energy operators, industrial sites, institutions and national programmes.',
    headline: 'Supplying the Industries That Run the Economy',
    intro: 'Energy and industry need a supplier who can commit to volume, specification and schedule for years at a time.',
    hero: 'hero-sector-energy-industrial',
    accent: '#3b82c4', accentText: '#1f5c94', tint: '#eef4fa',
    icon: 'spark', desk: 'tibeco-group',
    body: [
      'We supply energy operators, industrial sites, government entities and major private-sector organisations with materials, equipment and whole project packages, sourced internationally and delivered against a tender, a contract or a programme.',
      'This is work where a missed delivery stops a plant, so what counts is reliability over the life of a contract: certified management systems, sourcing that can switch origin when it has to, and the ability to finance, supply and deliver as one counterpart.',
      'It draws on the rest of the Group — commodity trading for raw materials, freight for heavy and project cargo — rather than buying those in.'
    ],
    quote: true,
    buyingTitle: 'Specification to delivery',
    buying: [
      { t: 'Specification', d: 'Send the specification, the bill of quantities or the tender documents.' },
      { t: 'Offer', d: 'A compliant offer against it — product, origin, delivery and approvals — within the time the tender allows.' },
      { t: 'Contract', d: 'A supply contract or framework on the agreed terms, under certified management systems.' },
      { t: 'Delivery and support', d: 'Delivered to site, inspected, commissioned where it is equipment, and supported afterwards.' }
    ],
    why: [
      { t: 'Specification first', d: 'Every supply is quoted against the client’s specification, bill of quantities or tender documents, and delivered to it.' },
      { t: 'Certified management systems', d: 'Delivered under ISO 9001, ISO 14001 and ISO 45001 systems within the Group.' },
      { t: 'Supplied, approved and supported', d: 'Equipment arrives with the approvals it needs, a warranty and a service agent in Qatar.' },
      { t: 'Financed, supplied and delivered by one counterpart', d: 'Capital, sourcing and execution sit in one structure for programmes that need all three.' }
    ],
    customers: ['Energy operators', 'Industrial sites and contractors', 'Government entities and national programmes', 'Institutions and major private-sector projects'],
    facts: [
      { k: 'Supply', v: 'Materials, equipment, projects, food security' },
      { k: 'Clients', v: 'Operators, institutions, programmes' },
      { k: 'Basis', v: 'Tender, contract or framework' },
      { k: 'Systems', v: 'ISO 9001, 14001 and 45001' }
    ],
    services: [
      {
        slug: 'energy-materials',
        name: 'Energy & Industrial Materials',
        role: 'Fuels, petrochemicals, steel and chemicals',
        headline: 'Materials for Energy and Industrial Operators',
        short: 'Refined fuels, petrochemicals and polymers, lubricants, bitumen, steel and industrial chemicals, supplied to energy and industrial operators against their specification.',
        intro: 'We supply the materials energy and industrial operators run on, sourced from producers and authorised distributors and delivered to specification.',
        body: [
          'Refined fuels, petrochemicals and polymers, lubricants and base oils, bitumen, steel and industrial chemicals: bought from producers, refineries and authorised distributors in the Gulf and internationally, and sold to operators, contractors and institutions against a specification and a delivery schedule.',
          'A supply contract here is measured in years, so each product is sourced from more than one origin and inspected independently, and the contract is backed by a counterpart with the balance sheet and the certified systems to carry it.',
          'Logistics for heavy and hazardous materials — tankers, ISO tanks, bulk vessels, permits — is handled by the Group’s own freight desk.'
        ],
        img: 'prod-industrial-materials',
        facts: [
          { k: 'Materials', v: 'Fuels, petrochemicals, lubricants, bitumen, steel, chemicals' },
          { k: 'Customers', v: 'Energy operators, industrial sites, contractors, institutions' },
          { k: 'Basis', v: 'Specification and schedule, under contract' },
          { k: 'Systems', v: 'ISO 9001, 14001 and 45001 management' }
        ],
        lines: [
          { t: 'Refined fuels', d: 'EN590 diesel, jet A-1 and gasoline to the operator’s specification, by cargo or by programme.' },
          { t: 'Petrochemicals and polymers', d: 'Polyethylene, polypropylene, methanol and urea from Gulf and international producers.' },
          { t: 'Lubricants, base oils and bitumen', d: 'For fleets, plants and road programmes, in bulk, drums and IBCs.' },
          { t: 'Steel and industrial chemicals', d: 'Structural and reinforcing steel, pipe, and process chemicals to specification.' }
        ],
        activities: ['Energy Supply', 'Industrial Materials', 'Contract Supply', 'Hazardous Logistics'],
        supply: 'energy-materials',
        cta: 'Enquire about energy and industrial materials'
      },
      {
        slug: 'equipment',
        name: 'Industrial, Institutional & Commercial Equipment',
        role: 'Sourced, supplied and supported',
        headline: 'Equipment for Sites, Institutions and Operations',
        short: 'Generator sets, construction plant, facility and site equipment, and medical and laboratory equipment, sourced and supplied with warranty and service in Qatar.',
        intro: 'We source and supply equipment for industrial sites, institutions and commercial operations, with the warranty and the service agent to stand behind it.',
        body: [
          'Equipment is bought from manufacturers and authorised dealers against the client’s specification: generator sets and power equipment, construction plant and machinery, facility and site equipment, and medical and laboratory equipment supplied against institutional orders.',
          'A piece of equipment is only useful if it is approved, delivered, commissioned and serviced. Each supply is quoted delivered to site with the approvals it needs — Civil Defence, Kahramaa, the client’s HSE standard — a warranty, and a service agent in Qatar.',
          'For programmes, the equipment is supplied alongside the materials and the project services, so the client has one counterpart.'
        ],
        img: 'prod-equipment',
        facts: [
          { k: 'Equipment', v: 'Power, construction, facility, medical, laboratory' },
          { k: 'Basis', v: 'Client specification, delivered and commissioned' },
          { k: 'Support', v: 'Warranty and a service agent in Qatar' },
          { k: 'Approvals', v: 'Civil Defence, Kahramaa, client HSE' }
        ],
        lines: [
          { t: 'Power and site equipment', d: 'Generator sets, lighting towers, welfare cabins and site services, delivered DDP to site.' },
          { t: 'Construction plant and machinery', d: 'Earthmoving, lifting and materials-handling plant, with operators’ training and spares.' },
          { t: 'Facility and institutional equipment', d: 'Kitchen, laundry, cleaning and facility equipment for institutions and commercial operations.' },
          { t: 'Medical and laboratory', d: 'Supplied against client orders with registration, installation and commissioning.' }
        ],
        activities: ['Equipment Supply', 'Commissioning', 'Spares & Service', 'Institutional Supply'],
        supply: 'equipment',
        cta: 'Enquire about equipment'
      },
      {
        slug: 'project-supply',
        name: 'Project-Based Commercial Supply',
        role: 'From tender to final delivery',
        headline: 'Supply Organised Around a Project',
        short: 'Materials, equipment, packages and site services organised around a project’s schedule and specification, from tender to final delivery.',
        intro: 'We organise supply around a project — its schedule, its specification, its site — from the tender to the last delivery.',
        body: [
          'A project buys hundreds of things at once and needs them in order. We take a project’s bill of quantities and supply it as packages: engineering and EPC packages, fit-out and interior works, site services and manpower, and the logistics and heavy lift that bring it all to site.',
          'The work is coordination as much as supply: sourcing across the Group’s suppliers, consolidating shipments, clearing and delivering to the schedule, and documenting each delivery for the client’s project controls.',
          'Government programmes, national projects and major private-sector developments are the typical client, under a tender or a framework.'
        ],
        img: 'prod-project-supply',
        facts: [
          { k: 'Scope', v: 'Packages, fit-out, site services, logistics' },
          { k: 'Basis', v: 'Tender or framework, to the project schedule' },
          { k: 'Clients', v: 'Government programmes, major projects' },
          { k: 'Delivery', v: 'Consolidated, cleared, delivered to site' }
        ],
        lines: [
          { t: 'EPC and engineering packages', d: 'Supply of engineered packages and equipment against the project specification.' },
          { t: 'Fit-out and interior works', d: 'Materials and finishes for commercial and institutional fit-out, delivered to programme.' },
          { t: 'Site services and manpower', d: 'Welfare, facilities and manpower outsourcing for the duration of the works.' },
          { t: 'Project logistics and heavy lift', d: 'Consolidation, shipping, clearance and heavy transport to site, by the Group’s own freight desk.' }
        ],
        activities: ['Project Supply', 'Tender Response', 'Consolidation', 'Heavy Lift'],
        supply: 'projects',
        cta: 'Enquire about project supply'
      },
      {
        slug: 'food-security',
        name: 'Strategic Commodities & Food Security',
        role: 'Long-term supply for national programmes',
        headline: 'Essential Commodities, Supplied for the Long Term',
        short: 'Long-term supply of essential commodities — grains, sugar, rice, edible oils, pulses — for programmes where continuity matters more than the price on the day.',
        intro: 'We contract the long-term supply of essential commodities for programmes where continuity matters more than the price on the day.',
        body: [
          'A food-security or strategic-reserve programme needs the same commodity, to the same standard, arriving on schedule for years. We structure that as a framework: multiple origins for each commodity, agreed specifications, a shipping programme, and a counterpart able to finance and deliver it.',
          'The commodities are the ones the Group already trades — wheat and grains, sugar, rice, edible oils and pulses — so the programme draws on existing suppliers and existing routes rather than ones built for the occasion.',
          'The client is a government entity, a national programme or an institutional buyer, and the contract is a tender or a framework agreement.'
        ],
        img: 'prod-vessel-chartering',
        facts: [
          { k: 'Commodities', v: 'Wheat, grains, sugar, rice, edible oils, pulses' },
          { k: 'Basis', v: 'Framework agreement, multi-year' },
          { k: 'Clients', v: 'Government entities, national programmes, institutions' },
          { k: 'Structure', v: 'Multiple origins, agreed specification, shipping programme' }
        ],
        lines: [
          { t: 'Framework supply', d: 'Annual or multi-year volumes of each commodity, with the origin switched as seasons and markets move.' },
          { t: 'Specification and inspection', d: 'Agreed standards per commodity and independent inspection on every lifting.' },
          { t: 'Shipping programme', d: 'Bulk and bagged liftings into Hamad Port on a schedule, by the Group’s own chartering desk.' },
          { t: 'Financing and delivery', d: 'Supplied, financed and delivered by one counterpart, under certified management systems.' }
        ],
        activities: ['Food Security', 'Strategic Supply', 'Government Programmes', 'Framework Contracts'],
        supply: 'commodities-food',
        cta: 'Enquire about strategic supply'
      }
    ]
  },

  {
    slug: 'technology',
    name: 'Technology & Advanced Systems',
    short: 'Enterprise IT integration, infrastructure, advanced systems and AI for institutions and businesses.',
    headline: 'Systems That Institutions Can Run On',
    intro: 'Clients here are buying continuity as much as software: a system integrated properly, supported afterwards and still running in five years.',
    hero: 'hero-sector-technology',
    accent: '#2f6f8f', accentText: '#235a75', tint: '#eaf3f7',
    icon: 'solve', desk: 'tibeco-group',
    body: [
      'We integrate enterprise systems, infrastructure monitoring, identity and business software for institutions and companies, working with established international technology platforms rather than building everything ourselves.',
      'Advanced technology and artificial intelligence are also an investment focus for the Group: we take positions in them, and use what we learn inside our own businesses.',
      'The work is delivered under the same certified management systems as the rest of the Group’s institutional supply.'
    ],
    quote: true,
    buyingTitle: 'Scope to support',
    buying: [
      { t: 'Scope', d: 'We scope the system with you: what it has to do, what it connects to, who runs it.' },
      { t: 'Proposal', d: 'A proposal with the platforms, the integration work, the timeline and the support model.' },
      { t: 'Delivery', d: 'Supplied, installed, integrated with your existing systems and tested.' },
      { t: 'Support', d: 'Handed over with training, then monitored and supported from Qatar.' }
    ],
    why: [
      { t: 'Integrated, not just installed', d: 'Systems connected to what the client already runs, tested and handed over with training.' },
      { t: 'Established global platforms', d: 'Delivered with international technology partners rather than built from scratch.' },
      { t: 'Support kept in Qatar', d: 'Monitoring, maintenance and a service desk after go-live.' },
      { t: 'Governed under ISO 9001', d: 'Delivery under certified management systems within the Group.' }
    ],
    customers: ['Government entities', 'Institutions', 'Enterprises', 'Operators of critical infrastructure'],
    facts: [
      { k: 'Scope', v: 'Infrastructure, software, security, AI' },
      { k: 'Partners', v: 'Global technology platforms' },
      { k: 'Clients', v: 'Government, institutions, enterprises' },
      { k: 'Support', v: 'Managed, in Qatar' }
    ],
    services: [
      {
        slug: 'enterprise-it',
        name: 'Enterprise IT Integration',
        role: 'Infrastructure, software and support',
        headline: 'Enterprise Systems, Integrated and Supported',
        short: 'Servers, storage and networking, software licensing and cloud, cybersecurity and identity — supplied, integrated and supported for institutions and businesses.',
        intro: 'We supply and integrate enterprise IT — infrastructure, software, security — and support it after it goes live.',
        body: [
          'Infrastructure first: servers, storage and networking, supplied from the global vendors and installed in the client’s data centre or hosted. Then the software — licences, cloud services, business applications — and the security and identity layer that holds it together.',
          'Integration is the job. A system that is bought and not integrated is a cost; one that is integrated, monitored and supported is an asset. We deliver with established international technology partners and keep the support in Qatar.',
          'Clients are government entities, institutions and companies buying against a tender or a framework, and the delivery is governed under ISO 9001.'
        ],
        img: 'prod-technology-systems',
        facts: [
          { k: 'Scope', v: 'Infrastructure, software, security, support' },
          { k: 'Partners', v: 'Established international technology platforms' },
          { k: 'Clients', v: 'Government, institutions, enterprises' },
          { k: 'Basis', v: 'Tender or framework; managed support' }
        ],
        lines: [
          { t: 'Infrastructure', d: 'Servers, storage and networking, supplied, installed and monitored.' },
          { t: 'Software and cloud', d: 'Licences, cloud services and business applications, with the migration and the integration.' },
          { t: 'Cybersecurity and identity', d: 'Identity and access, endpoint and network security, to the client’s standard.' },
          { t: 'Managed support', d: 'Monitoring, maintenance and a service desk after go-live.' }
        ],
        activities: ['Enterprise IT', 'Systems Integration', 'Cybersecurity', 'Managed Support'],
        supply: 'technology',
        cta: 'Enquire about enterprise IT'
      },
      {
        slug: 'advanced-systems',
        name: 'Advanced Systems & AI',
        role: 'Data platforms, AI and monitoring',
        headline: 'Advanced Systems and AI for Institutions',
        short: 'AI and data platforms, infrastructure monitoring and advanced systems, delivered with global technology partners for institutions and operators.',
        intro: 'We deliver advanced systems — data platforms, AI, infrastructure monitoring — for institutions and operators that need them to run, not just to demonstrate.',
        body: [
          'Advanced systems are bought for a purpose: a data platform that an institution can report from, monitoring that tells an operator what its infrastructure is doing, AI applied to a process that already exists. We scope that purpose with the client and deliver it with the global partners who build the platforms.',
          'The Group invests in advanced technology and AI as well as supplying it, which means the systems we deliver are ones we are prepared to back.',
          'Delivery is a project: scoped, integrated with the client’s existing systems, tested and handed over with the training and support to run it.'
        ],
        img: 'still-tibeco-group',
        facts: [
          { k: 'Scope', v: 'Data platforms, AI, monitoring, advanced systems' },
          { k: 'Partners', v: 'Global technology platforms' },
          { k: 'Clients', v: 'Institutions, operators, programmes' },
          { k: 'Basis', v: 'Scoped project, integrated and supported' }
        ],
        lines: [
          { t: 'Data and AI platforms', d: 'Data platforms, analytics and applied AI, scoped to a process the client already runs.' },
          { t: 'Infrastructure monitoring', d: 'Monitoring and control of IT, facility and operational infrastructure.' },
          { t: 'Integration', d: 'Connected to the client’s existing systems, tested and handed over.' },
          { t: 'Training and support', d: 'The client’s team trained to run it, and support after go-live.' }
        ],
        activities: ['AI & Data', 'Monitoring', 'Systems Delivery', 'Technology Investment'],
        supply: 'technology',
        cta: 'Enquire about advanced systems'
      }
    ]
  },

  {
    slug: 'investment',
    name: 'Investment & Partnerships',
    short: 'Capital for energy, technology and industrial development, and joint ventures with partners who know their market.',
    headline: 'Capital With a Long Horizon',
    intro: 'We invest where we can also bring commerce and services, so a position is backed by the ability to supply and to deliver.',
    hero: 'hero-tibeco-group',
    accent: '#1f3b73', accentText: '#1f3b73', tint: '#e9edf5',
    icon: 'target', desk: 'tibeco-group',
    body: [
      'The Group’s investment platform originates, manages and deploys positions in energy, advanced technology and industrial development, alongside the government programmes, institutional buyers and major private-sector projects those sectors serve.',
      'Growth here is selective by design: fewer, larger positions, chosen for whether they will still make sense in a decade rather than this quarter.',
      'The same platform builds the Group’s joint ventures and long-term partnerships — with producers, operators and founders whose business fits where the Group is going.'
    ],
    buyingTitle: 'Proposal to partnership',
    buying: [
      { t: 'Proposal', d: 'Bring us the business, the project or the market, with a line on what you are looking for.' },
      { t: 'Review', d: 'We look at whether it fits — the sector, the horizon, and what the Group can add beyond capital.' },
      { t: 'Structure', d: 'The investment or the venture structured to the business, not the other way round.' },
      { t: 'Partnership', d: 'A long-term position, with the Group’s sourcing, logistics and customers behind it.' }
    ],
    why: [
      { t: 'More than capital', d: 'Sourcing networks, logistics and institutional supply come with the investment.' },
      { t: 'A long horizon', d: 'Fewer, larger positions chosen to still make sense in ten years.' },
      { t: 'A base in Qatar, reach beyond it', d: 'Presence across the Gulf, Europe, North Africa and Asia.' }
    ],
    customers: ['Developers and operators', 'Producers seeking a route into Qatar', 'Founders with a concept that fits', 'Institutional co-investors'],
    facts: [
      { k: 'Focus', v: 'Energy, technology, industrial development' },
      { k: 'Forms', v: 'Direct investment, joint ventures, partnerships' },
      { k: 'Horizon', v: 'Long term' },
      { k: 'Reach', v: 'Gulf, Europe, North Africa, Asia' }
    ],
    services: [
      {
        slug: 'strategic-investment',
        name: 'Strategic Investment',
        role: 'Positions in energy, technology and industry',
        headline: 'Investment Backed by the Means to Deliver',
        short: 'Capital for energy, advanced technology and industrial development, deployed where the Group can also bring sourcing, supply and execution.',
        intro: 'We take positions in energy, advanced technology and industrial development, where the Group can also supply and deliver.',
        body: [
          'An investment here comes with more than capital. The Group brings its sourcing networks, its logistics and its institutional supply to the businesses it invests in, so a project can be financed, supplied and delivered by the same counterpart.',
          'The focus is energy, advanced technology and industrial development — the sectors the Group already works in and understands — and the horizon is long: positions chosen to still make sense in ten years.',
          'We work with developers, operators and co-investors in Qatar and across the Gulf, Europe, North Africa and Asia.'
        ],
        img: 'hero-sector-investments',
        facts: [
          { k: 'Focus', v: 'Energy, advanced technology, industrial development' },
          { k: 'Horizon', v: 'Long term; fewer, larger positions' },
          { k: 'With', v: 'Developers, operators, co-investors' },
          { k: 'Reach', v: 'Gulf, Europe, North Africa, Asia' }
        ],
        lines: [
          { t: 'Direct investment', d: 'Equity positions in energy, technology and industrial businesses and projects.' },
          { t: 'Project participation', d: 'Capital alongside supply and execution in programmes the Group also delivers.' },
          { t: 'Co-investment', d: 'Alongside developers, operators and institutional co-investors.' },
          { t: 'Governance', d: 'Certified management systems and a selective, long-term mandate.' }
        ],
        activities: ['Strategic Investment', 'Energy', 'Technology & AI', 'Industrial Development'],
        cta: 'Discuss an investment'
      },
      {
        slug: 'partnerships',
        name: 'Joint Ventures & Partnerships',
        role: 'New businesses, new markets, together',
        headline: 'Partnerships Worth Something to Both Sides',
        short: 'Joint ventures, new concepts and long-term commercial cooperation with producers, operators and founders whose business fits where the Group is going.',
        intro: 'We build joint ventures and long-term partnerships with producers, operators and founders — a business in Qatar, a route into the Gulf, a market we should be in.',
        body: [
          'Most of what the Group does started with someone else: a producer looking for a route into Qatar, an operator with a concept that needed a partner, a founder with a business that fitted. The partnership platform is where those conversations go.',
          'A joint venture brings the Group’s capital, its licences and presence in Qatar, its sourcing and logistics, and a partner’s product, know-how or market. The structure follows the business, not the other way round.',
          'We are actively looking to establish new businesses, enter new commercial sectors next to the ones we know, and explore the regional and international markets our sourcing already reaches.'
        ],
        img: 'hero-partnerships',
        facts: [
          { k: 'Forms', v: 'Joint ventures, distribution, licensing, cooperation' },
          { k: 'Partners', v: 'Producers, operators, founders, international groups' },
          { k: 'Brings', v: 'Capital, presence in Qatar, sourcing, logistics' },
          { k: 'Horizon', v: 'Long term' }
        ],
        lines: [
          { t: 'Joint ventures in Qatar', d: 'A business established in Qatar with a partner who brings the product or the know-how.' },
          { t: 'Distribution partnerships', d: 'A producer’s route into Qatar and the Gulf through the Group’s distribution and customers.' },
          { t: 'New concepts', d: 'Operators and founders with a concept that fits the Group’s portfolio and needs a partner to open it.' },
          { t: 'International cooperation', d: 'Long-term commercial cooperation in the markets the Group sources from and sells to.' }
        ],
        activities: ['Joint Ventures', 'Market Entry', 'Distribution Partnerships', 'New Businesses'],
        cta: 'Propose a partnership'
      }
    ]
  },

  {
    slug: 'consumer',
    name: 'Consumer & Hospitality Services',
    short: 'Garment care for households and a café — everyday services, judged on doing the same thing well every time.',
    headline: 'Everyday Services. Better Experiences.',
    intro: 'A service business is judged on whether it does the same thing well every time.',
    hero: 'hero-sector-consumer-services',
    accent: '#c08a55', accentText: '#8a5a32', tint: '#f5ede4',
    icon: 'cup', desk: 'cavallo-laundry',
    body: [
      'This is where the Group serves households rather than businesses. The work is ordinary and frequent, which is exactly why it is hard: a customer notices the one time it goes wrong far more than the fifty times it went right.',
      'So the standards that matter here are unglamorous ones — turnaround, careful handling, a result that does not vary, and a room people choose to come back to.',
      'It is also the part of the Group closest to the public, and the part that teaches us most about what customers in Qatar actually want.'
    ],
    why: [
      { t: 'The same result every time', d: 'Turnaround, handling and consistency are what a household service is judged on.' },
      { t: 'Close to the customer', d: 'Daily contact with the public, and the operational discipline that comes with it.' }
    ],
    customers: ['Households in Qatar', 'The public'],
    facts: [
      { k: 'Services', v: 'Laundry and garment care; a café' },
      { k: 'For', v: 'Households and the public' },
      { k: 'Market', v: 'Qatar' },
      { k: 'Judged on', v: 'Turnaround, handling, consistency' }
    ],
    services: [
      {
        slug: 'laundry',
        name: 'Laundry & Garment Care',
        role: 'Everyday laundry to specialist care',
        headline: 'Professional Laundry and Garment Care',
        short: 'Professional laundry and garment care for households — everyday washing, pressing and finishing, specialist treatment, and household textiles.',
        intro: 'We clean, press and return clothes — everyday household laundry, and the pieces that need more care than that.',
        body: [
          'The service handles everyday household items and the pieces that need specialist treatment: heavier fabrics, tailoring, and anything a home machine would spoil.',
          'A laundry is judged on whether the same garment comes back the same way every time, so the work is built around turnaround, handling and consistency rather than volume alone.',
          'It is the Group’s presence in consumer services, the part of the portfolio that serves households directly.'
        ],
        img: 'hero-cavallo-laundry',
        facts: [
          { k: 'For', v: 'Households' },
          { k: 'Services', v: 'Laundry, pressing, specialist care, textiles' },
          { k: 'Market', v: 'Qatar' },
          { k: 'Judged on', v: 'Turnaround, handling, consistency' }
        ],
        lines: [
          { t: 'Everyday laundry', d: 'Washing, drying and folding for the regular household load — the volume most homes generate every week.' },
          { t: 'Pressing and finishing', d: 'Pressing and finishing so a garment comes back ready to wear rather than ready to iron.' },
          { t: 'Specialist care', d: 'The pieces that need handling rather than a standard cycle: heavier fabrics, tailoring, and anything a home machine would spoil.' },
          { t: 'Household textiles', d: 'Bedding, towels and the larger items that are awkward to wash and slow to dry at home.' }
        ],
        steps: [
          { t: 'Turnaround', d: 'Back when it was promised. A service people use every week has to earn that place every week.' },
          { t: 'Handling', d: 'Everyday items and the pieces that need more care than a standard cycle, each treated as what it is.' },
          { t: 'Consistency', d: 'The same garment comes back the same way every time — the only standard a laundry is really judged on.' }
        ],
        stepsTitle: 'What we are <span class="soft">judged on</span>',
        activities: ['Garment Care', 'Textile Cleaning', 'Everyday Laundry', 'Specialist Treatment'],
        cta: 'Ask about laundry and garment care'
      },
      {
        slug: 'cafe',
        name: 'Café & Hospitality',
        role: 'Coffee, service, and the room',
        headline: 'A Coffee Concept Built Around Experience',
        short: 'A café built on quality coffee, service across the counter and the room it is served in — somewhere people come back to.',
        intro: 'We run a café built around three things that have to work together: the coffee, the service across the counter, and the room people choose to sit in.',
        body: [
          'Qatar’s food and beverage market is busy and competitive, and a concept survives in it by being somewhere people come back to rather than somewhere they pass through once.',
          'That depends on the product itself, the service across the counter, and the room. Any one of them being wrong is enough.',
          'Running a hospitality business also gives the Group something the trading side cannot: daily contact with customers, and the operational discipline that comes with opening every morning.'
        ],
        img: 'hero-nero-cafe',
        facts: [
          { k: 'Concept', v: 'Specialty coffee café' },
          { k: 'Built on', v: 'Coffee, service, the room' },
          { k: 'Market', v: 'Qatar' },
          { k: 'Open to', v: 'Partners and operators for new concepts' }
        ],
        lines: [
          { t: 'Coffee', d: 'The product the café is built around, and the thing a customer decides about first.' },
          { t: 'Service', d: 'What happens across the counter. In a café it is half of what people are actually paying for.' },
          { t: 'The room', d: 'Somewhere to sit, meet or work. A café people pass through and a café they come back to differ mostly here.' },
          { t: 'Daily operations', d: 'Opening, stocking, staffing and closing, every day — the discipline the rest of the Group does not get from trading.' }
        ],
        activities: ['Café Operations', 'Specialty Coffee', 'Hospitality', 'Customer Experience'],
        cta: 'Ask about the café'
      }
    ]
  }
];

/* Home: how buying from the Group works, for any service, and the reasons
   a buyer can check. */
const BUYING = [
  { t: 'Tell us what you need',
    d: 'The service, the quantity or scope, the destination and when. The quotation form takes two minutes.' },
  { t: 'The right desk picks it up',
    d: 'A commodity request goes to the trading desk, produce to distribution, equipment to institutional supply.' },
  { t: 'An offer within two working days',
    d: 'Origin, specification, price on your terms and the delivery window, or the questions we need answered to price it.' },
  { t: 'Contract, ship, deliver',
    d: 'Agreed terms, independent inspection where the cargo needs it, and the freight by our own desk.' }
];

const BUYER_WHY = [
  { t: 'One counterpart', d: 'Trading, freight and supply in one group, so a need is answered whole.' },
  { t: 'Inspected and specified', d: 'Cargoes sold to a written specification and certified at the load port.' },
  { t: 'Certified systems', d: 'ISO 9001, 14001 and 45001 management systems within the Group.' },
  { t: 'Based in Doha', d: 'Sourcing from six regions, delivered in Qatar and the markets it trades with.' }
];

/* Home: how the Group works with what it builds */
const WHAT_WE_DO = [
  { t: 'Build',
    d: 'We start businesses where we can see demand in the market rather than where a category looks attractive.' },
  { t: 'Operate',
    d: 'We give each business commercial direction, oversight and the systems it needs to run day to day.' },
  { t: 'Grow',
    d: 'We help each business widen its market, sharpen what it is good at, and expand where the numbers support it.' },
  { t: 'Partner',
    d: 'We build relationships with suppliers, operators and international partners that are worth something to both sides.' }
];

/* About: how the Group creates value */
const VALUE_CREATION = [
  { t: 'Strategic Direction', icon: 'target',
    d: 'We set the commercial priorities with each business and hold it to them.' },
  { t: 'Operational Development', icon: 'solve',
    d: 'We put in the processes and systems a business needs before it needs them.' },
  { t: 'Market Development', icon: 'markets',
    d: 'We help each service find its customers, its partners and its next product.' },
  { t: 'Group Capabilities', icon: 'partnership',
    d: 'Sourcing, logistics and commercial relationships built for one service are open to the others.' },
  { t: 'Long-Term Perspective', icon: 'cycle',
    d: 'We build for businesses that still make sense in ten years, not only this one.' }
];

/* About: the Group's values */
const VALUES = [
  { t: 'Integrity',
    d: 'Responsible decisions, straight answers, and respect for the partners, customers and people we work with.' },
  { t: 'Execution',
    d: 'Ideas are cheap. We value the follow-through: action, accountability and progress that can be measured.' },
  { t: 'Customer Focus',
    d: 'Every service here exists to serve a market. Understanding that market is the whole job.' },
  { t: 'Agility',
    d: 'Markets move. Our businesses are expected to move with them rather than wait for the year to end.' },
  { t: 'Partnership',
    d: 'Strong businesses are built on relationships that last longer than a single transaction.' },
  { t: 'Long-Term Thinking',
    d: 'We would rather build something with foundations than something with momentum.' }
];

/* Work With Us: what the Group is actively looking to do next */
const GROWTH = [
  { t: 'Establish new businesses', icon: 'spark',
    d: 'Where we can see demand in the market, rather than where a category looks attractive.' },
  { t: 'Expand existing services', icon: 'target',
    d: 'Wider markets, sharper offers and new locations, where the numbers support it.' },
  { t: 'Enter new commercial sectors', icon: 'markets',
    d: 'Next to what we already know, and with a partner who knows the new one well.' },
  { t: 'Develop strategic partnerships', icon: 'partnership',
    d: 'Joint ventures and long-term cooperation that are worth something to both sides.' },
  { t: 'Build supplier and distribution relationships', icon: 'crate',
    d: 'Producers abroad and buyers in Qatar, held for longer than a single transaction.' },
  { t: 'Explore new regional and international markets', icon: 'supply',
    d: 'Starting with the markets our sourcing and logistics already reach.' },
  { t: 'Strengthen connections between our services', icon: 'cycle',
    d: 'Sourcing, logistics and customers shared across the Group.' }
]

/* Work With Us: who the Group wants to hear from. The contact form routes
   each of these to the right desk. */
const PARTNER_TYPES = [
  { t: 'International Suppliers', v: 'international-supplier',
    d: 'Producers and exporters looking for a route into the Qatar market.' },
  { t: 'Local Suppliers & Businesses', v: 'local-business',
    d: 'Companies that want to supply the Group, or work alongside it.' },
  { t: 'Producers & Exporters', v: 'producer-exporter',
    d: 'Growers and processors of food, agricultural products, coffee, wheat and the commodities we trade.' },
  { t: 'Distributors & Buyers', v: 'distributor-buyer',
    d: 'Businesses looking for reliable supply inside Qatar or in international markets.' },
  { t: 'Business Partners', v: 'business-partner',
    d: 'Joint ventures, new concepts and long-term commercial cooperation.' },
  { t: 'Entrepreneurs', v: 'entrepreneur',
    d: 'Operators and founders with a business or an idea that fits where the Group is going.' }
];

/* Home: the Group in four figures, on the band under the introduction.

   Every one of these is counted from the content above rather than typed in,
   so none of them can be wrong and none can drift as the services change.
   `count` names what to count: services, areas, regions or countries. */
const FIGURES = [
  { k: 'Services', count: 'services' },
  { k: 'Service areas', count: 'areas' },
  { k: 'Sourcing regions', count: 'regions' },
  { k: 'Source countries', count: 'countries' }
];

/* The questions a buyer asks about a service before writing, answered on
   its page and published as a FAQPage for search. Keyed by service slug; a
   service with no entry simply has no questions section. Plain answers,
   nothing a buyer could not hold us to. */
const SERVICE_FAQ = {
  sulphur: [
    { q: 'What specification of sulphur does Lusail Corp supply?',
      a: 'Granular solid sulphur, typically 99.5% sulphur minimum on a dry basis, moisture 0.5% maximum, granules of 2 to 6 mm, bright yellow and low in dust and fines. Every cargo is sold to a written specification sheet and inspected at the load port.' },
    { q: 'What is the minimum quantity and how is it shipped?',
      a: 'Sulphur is sold in bulk vessel lots, usually from 15,000 MT upwards, in Handysize to Supramax parcels. Smaller quantities are considered where a part-cargo can be combined. The vessel is chartered by our own freight desk.' },
    { q: 'Where is the sulphur sourced from and on what terms?',
      a: 'From producers and authorised sellers in Qatar and the Gulf, and in Central Asia. It is quoted FOB a Gulf port or CFR the receiving port, with payment by irrevocable letter of credit at sight unless agreed otherwise.' }
  ],
  coffee: [
    { q: 'Which coffee origins and grades can you supply?',
      a: 'Washed and natural arabica from Ethiopia, Colombia and Brazil, and robusta from Uganda, Vietnam and Indonesia, bought by the origin’s own grading — screen size, defect count and cup. Other origins are sourced on request.' },
    { q: 'How is the quality of a coffee shipment controlled?',
      a: 'Each lot is bought against an offer sample and a grade. A pre-shipment sample is sent for approval before the container is stuffed, and the shipment is only loaded once it is approved.' },
    { q: 'What quantity and packing do you ship coffee in?',
      a: 'Full containers of 19 to 21 MT in 60 or 70 kg jute bags, with GrainPro or similar liners where the destination asks for them. Quoted FOB origin or CFR destination with the shipping handled by us.' }
  ],
  sugar: [
    { q: 'What grades of sugar does Lusail Corp supply?',
      a: 'Refined white cane sugar to the ICUMSA 45 standard — polarisation 99.8° minimum, moisture and ash 0.04% maximum, current crop year — and raw cane sugar to the refiner’s specification.' },
    { q: 'How is sugar packed and in what quantities?',
      a: 'In 50 kg polypropylene bags with inner liner for containers and breakbulk, in 1 MT big bags, or in bulk for refinery cargoes. From a single container to vessel lots of 25,000 MT.' },
    { q: 'How are sugar shipments inspected and paid for?',
      a: 'Weight and quality are certified at the load port by SGS or Intertek. Payment is by irrevocable letter of credit at sight, with the price quoted FOB origin or CFR the receiving port.' }
  ],
  'edible-oils': [
    { q: 'Which edible oils can you supply?',
      a: 'Refined, bleached and deodorised palm olein from South-East Asian refineries, refined sunflower oil from the Black Sea and Türkiye, and refined soybean oil from South America, each to the buyer’s specification.' },
    { q: 'In what packing is edible oil shipped?',
      a: 'In flexitanks or ISO tanks for manufacturers, in drums and jerrycans for distributors, and in retail bottles — including under the buyer’s own label, with Arabic labelling where Qatar is the destination.' },
    { q: 'How are shelf life and delivery dates handled?',
      a: 'Production date, shipping window and arrival date are agreed before an order is confirmed, so the oil arrives with the shelf life the buyer’s line or shelf needs.' }
  ],
  'wheat-grains': [
    { q: 'What wheat and grain specifications do you supply?',
      a: 'Milling wheat by protein (typically 11.5% to 13.5%), gluten, falling number and test weight to the origin standard; feed barley and yellow corn for feed producers; and all-purpose and bakery flour in 50 kg bags.' },
    { q: 'Where is the wheat sourced from?',
      a: 'From exporters in Ukraine, Kazakhstan, Bulgaria, Australia and Canada. The origin used depends on the crop, the season, quality and the terms on the day.' },
    { q: 'How is a grain cargo shipped and documented?',
      a: 'Milling programmes travel in Handysize and Supramax bulk vessels chartered by our own desk; bagged flour and smaller lots in containers. Each shipment carries phytosanitary, fumigation, weight and quality certificates for the receiving country.' }
  ],
  'fresh-vegetables': [
    { q: 'Which vegetables do you import and how often?',
      a: 'Tomatoes, cucumbers, capsicum, courgettes, aubergines, onions, potatoes and leafy lines, on a weekly programme by sea reefer and by air, with the origin switched as the seasons move.' },
    { q: 'What grade and certification do your vegetables carry?',
      a: 'Class I produce to the Qatar market specification from GlobalG.A.P. or equivalent growers, with a phytosanitary certificate per shipment, Ministry of Public Health registration and Arabic labelling.' },
    { q: 'Who do you deliver fresh vegetables to?',
      a: 'Supermarkets, hotels, restaurants, caterers and wholesalers across Qatar, delivered chilled on a schedule to the store or kitchen.' }
  ],
  'fresh-fruits': [
    { q: 'Which fruits can you supply through the year?',
      a: 'Apples, citrus, bananas, grapes, melons and stone fruit, bought in both hemispheres so a line is in season somewhere all year. Pineapples, mangoes and papaya in season.' },
    { q: 'How is fruit shipped and ripened?',
      a: 'In reefers at the temperature each variety needs, cleared at Hamad Port or Doha airport. Bananas are shipped green and ripened to order in Qatar.' },
    { q: 'Can you supply fruit on a standing programme?',
      a: 'Yes. Supermarket buyers, hotel purchasing managers and wholesalers are supplied on a standing weekly programme rather than one-off loads.' }
  ],
  rice: [
    { q: 'What varieties and grades of rice do you supply?',
      a: 'Aged 1121 and traditional basmati, white and golden sella, Vietnamese and Thai-style long-grain, jasmine, parboiled and white rice, bought by broken percentage, moisture and age.' },
    { q: 'What pack sizes are available?',
      a: 'Retail and catering packs from 1 kg to 40 kg, and 1 MT big bags for processors, under our own labels or packed and labelled to the customer’s design.' },
    { q: 'Do you hold rice in stock in Qatar?',
      a: 'Yes. Stock is held in Qatar for customers who need delivery this week, alongside the programmes bought at origin for the season.' }
  ],
  'grains-pulses': [
    { q: 'Which pulses do you import?',
      a: 'Red and green lentils, kabuli chickpeas by size, kidney, white and black beans, and split and whole peas, from Canada, Australia, Türkiye and India.' },
    { q: 'Can pulses be packed to our own label?',
      a: 'Yes. Bulk imports are repacked in Qatar into retail packs under the customer’s label and pack size, or supplied in 25 and 50 kg bags and bulk bags.' },
    { q: 'Do you also supply flour and wheat products?',
      a: 'Flour, semolina, bulgur and pasta are supplied in retail and catering packs to the same customers on the same deliveries.' }
  ],
  'dry-foods': [
    { q: 'What dry food lines do you distribute?',
      a: 'Cooking oils and ghee, sugar, salt, flour and pasta; canned vegetables, pulses and fish; sauces and condiments; dates, dried fruit, nuts and spices; long-life dairy, juices and water.' },
    { q: 'Do your products meet Qatar’s import requirements?',
      a: 'Every product carries Ministry of Public Health registration, Halal certification where it applies, and the Arabic labelling Qatar requires before it ships.' },
    { q: 'Can you source a product we do not see listed?',
      a: 'Yes. The range follows demand: a supermarket chain, a hotel group or a caterer tells us what it needs and the line is sourced, registered and delivered to that.' }
  ],
  'ocean-freight': [
    { q: 'What kinds of cargo do you ship by sea?',
      a: 'Full and part container loads in dry, high-cube and reefer containers, breakbulk and out-of-gauge project pieces, and bulk cargo, between Qatar and the ports the Group trades with.' },
    { q: 'Do you handle customs and documents?',
      a: 'Yes. Export and import clearance, bills of lading, certificates of origin, phytosanitary and inspection certificates and marine insurance are handled by the same desk.' },
    { q: 'Can you quote door to door?',
      a: 'Yes. Collection at origin, port handling, the sea leg and delivery in Qatar or at destination are quoted as one price with one invoice.' }
  ],
  'vessel-chartering': [
    { q: 'What vessel sizes do you charter?',
      a: 'Handysize, Supramax and Panamax tonnage for parcels of roughly 5,000 to 60,000 MT, fixed through brokers and owners on voyage charter, contract of affreightment or time charter terms.' },
    { q: 'What does the chartering service include?',
      a: 'The fixture itself, the charter party, port agency at both ends, loading and discharge supervision, draft surveys, laytime and demurrage calculations and marine insurance.' },
    { q: 'Do you charter for cargo that is not your own?',
      a: 'Yes. The same desk that charters for the Group’s sulphur, sugar and grain fixes vessels for customers with a bulk cargo to move.' }
  ],
  'land-freight': [
    { q: 'What road transport do you provide?',
      a: 'Container haulage from Hamad Port, scheduled distribution across Qatar, heavy and out-of-gauge transport on low-bed and extendable trailers, chilled transport in reefer trailers, and cross-border movements to the UAE and the Gulf.' },
    { q: 'Do you handle permits and escorts for heavy loads?',
      a: 'Yes. Route permits, escorts and the lifting at either end are arranged with the movement.' },
    { q: 'Can you deliver on our schedule?',
      a: 'Yes. Distribution deliveries to stores, kitchens and sites run to the customer’s schedule, with the cold chain held from port to shelf for food.' }
  ],
  'air-freight': [
    { q: 'What do you move by air?',
      a: 'Perishables in cool-chain handling, spare parts and high-value goods, documents, and project pieces on scheduled or charter capacity through Hamad International Airport.' },
    { q: 'Can you arrange an air charter?',
      a: 'Yes. Part and full charters are arranged for project cargo and time-critical volumes that scheduled capacity cannot carry.' },
    { q: 'Is the service airport to airport or door to door?',
      a: 'Either. The airway bill, export and import clearance, airport handling and final delivery are handled as one job, quoted and tracked together.' }
  ],
  'energy-materials': [
    { q: 'Which energy and industrial materials do you supply?',
      a: 'Refined fuels such as EN590 diesel, jet A-1 and gasoline; petrochemicals and polymers; lubricants, base oils and bitumen; structural and reinforcing steel, pipe and industrial chemicals, each to the operator’s specification.' },
    { q: 'How do you secure supply over a long contract?',
      a: 'Each product is sourced from more than one origin and inspected independently, under ISO 9001, 14001 and 45001 management systems, with the contract carried by a counterpart able to finance and deliver it.' },
    { q: 'Do you handle the logistics for hazardous materials?',
      a: 'Yes. Tankers, ISO tanks, bulk vessels and the permits they need are handled by the Group’s own freight desk.' }
  ],
  equipment: [
    { q: 'What equipment can you source and supply?',
      a: 'Generator sets and power equipment, lighting towers and welfare cabins, construction plant and machinery, facility and institutional equipment, and medical and laboratory equipment against client orders.' },
    { q: 'Is the equipment delivered, approved and supported?',
      a: 'Yes. Each supply is quoted delivered to site with the approvals it needs — Civil Defence, Kahramaa, the client’s HSE standard — a warranty, and a service agent in Qatar.' },
    { q: 'Can equipment be supplied as part of a larger programme?',
      a: 'Yes. For programmes the equipment is supplied alongside the materials and project services, so the client has one counterpart.' }
  ],
  'project-supply': [
    { q: 'What does project-based supply cover?',
      a: 'EPC and engineering packages, fit-out and interior works, site services and manpower, and the project logistics and heavy lift that bring it all to site, organised around the project’s bill of quantities and schedule.' },
    { q: 'Who are the typical clients?',
      a: 'Government programmes, national projects and major private-sector developments, under a tender or a framework agreement.' },
    { q: 'How is delivery coordinated?',
      a: 'Sourcing across the Group’s suppliers, consolidation, clearance and delivery to the schedule, with each delivery documented for the client’s project controls.' }
  ],
  'food-security': [
    { q: 'Which commodities does strategic supply cover?',
      a: 'Wheat and grains, sugar, rice, edible oils and pulses — the commodities the Group already trades, drawing on existing suppliers and routes.' },
    { q: 'How is continuity of supply secured?',
      a: 'Through a framework with multiple origins for each commodity, agreed specifications, independent inspection on every lifting and a shipping programme into Hamad Port run by the Group’s own chartering desk.' },
    { q: 'Who is this service for?',
      a: 'Government entities, national programmes and institutional buyers contracting under a tender or a multi-year framework agreement.' }
  ],
  'enterprise-it': [
    { q: 'What does enterprise IT integration include?',
      a: 'Servers, storage and networking; software licences, cloud services and business applications; cybersecurity and identity; and managed support after go-live, delivered with established international technology partners.' },
    { q: 'Is support provided after installation?',
      a: 'Yes. Monitoring, maintenance and a service desk are provided after go-live, with the support kept in Qatar.' },
    { q: 'Who do you deliver enterprise IT for?',
      a: 'Government entities, institutions and companies buying against a tender or a framework, with delivery governed under ISO 9001.' }
  ],
  'advanced-systems': [
    { q: 'What advanced systems do you deliver?',
      a: 'Data platforms, analytics and applied AI, infrastructure monitoring and control, and other advanced systems scoped to a process the client already runs.' },
    { q: 'How is a system integrated with what we already have?',
      a: 'Each delivery is a scoped project: connected to the client’s existing systems, tested, and handed over with the training and support to run it.' },
    { q: 'Which partners do you work with?',
      a: 'The global technology platforms that build the systems, with the Group as the delivery partner in Qatar and the region.' }
  ],
  'strategic-investment': [
    { q: 'What does Lusail Corp invest in?',
      a: 'Energy, advanced technology and industrial development — businesses and projects where the Group can also bring sourcing, supply and execution.' },
    { q: 'What is the investment horizon?',
      a: 'Long term. Positions are fewer and larger, chosen for whether they will still make sense in a decade rather than this quarter.' },
    { q: 'Do you co-invest with others?',
      a: 'Yes. The Group invests alongside developers, operators and institutional co-investors in Qatar and across the Gulf, Europe, North Africa and Asia.' }
  ],
  partnerships: [
    { q: 'What kinds of partnership does the Group enter?',
      a: 'Joint ventures in Qatar, distribution partnerships for producers seeking a route into the Gulf, new concepts with operators and founders, and long-term commercial cooperation in the markets the Group sources from and sells to.' },
    { q: 'What does Lusail Corp bring to a joint venture?',
      a: 'Capital, licences and presence in Qatar, sourcing and logistics, and customers across retail, hospitality, industry and institutions.' },
    { q: 'How do we propose a partnership?',
      a: 'Send an enquiry choosing Investment & Partnerships as the area, with a line on the business, the market and what you are looking for. It reaches the desk that handles partnerships directly.' }
  ],
  laundry: [
    { q: 'What laundry services are offered?',
      a: 'Everyday washing, drying and folding; pressing and finishing; specialist care for heavier fabrics, tailoring and delicate pieces; and household textiles such as bedding and towels.' },
    { q: 'Who is the laundry service for?',
      a: 'Households in Qatar. It is the Group’s consumer service, built around turnaround, handling and consistency.' },
    { q: 'How do I ask about the service?',
      a: 'Send an enquiry choosing Consumer & Hospitality Services as the area, and it reaches the laundry desk directly.' }
  ],
  cafe: [
    { q: 'What is the café concept?',
      a: 'A specialty coffee café built on three things that have to work together: the coffee, the service across the counter and the room people choose to sit in.' },
    { q: 'Where is the café?',
      a: 'In Qatar. Location, hours and menu are available on enquiry while the café’s own listing is being prepared.' },
    { q: 'Is the Group open to new hospitality concepts?',
      a: 'Yes. Operators and founders with a concept that fits the Group’s portfolio can propose it through the Investment & Partnerships area.' }
  ]
};

/* Flat list of every service, each carrying a back-reference to its area. */
const ALL_SERVICES = AREAS.flatMap(a =>
  a.services.map(s => Object.assign({}, s, {
    areaSlug: a.slug, areaName: a.name, areaHero: a.hero, desk: a.desk,
    accent: a.accent, accentText: a.accentText, tint: a.tint, accentOn: a.accentOn,
    faq: SERVICE_FAQ[s.slug] || []
  }))
);

/* Every slug has to be unique across the site, or two pages would share an
   address. Checked here so the mistake is found at build, not on the server. */
(function checkSlugs() {
  const seen = new Set();
  for (const s of ALL_SERVICES.concat(AREAS)) {
    if (seen.has(s.slug)) { console.error('\n  site.js: the slug "' + s.slug + '" is used twice.\n'); process.exit(1); }
    seen.add(s.slug);
  }
  for (const k of Object.keys(SERVICE_FAQ)) if (!ALL_SERVICES.some(s => s.slug === k)) {
    console.error('\n  site.js: SERVICE_FAQ names "' + k + '", which is not a service.\n'); process.exit(1);
  }
  for (const a of AREAS) if (!COMPANIES.some(c => c.slug === a.desk)) {
    console.error('\n  site.js: area "' + a.slug + '" routes to a desk "' + a.desk + '" that is not a company.\n'); process.exit(1);
  }
})();

/* Where each market sits, so the map can be drawn from the same list the
   register reads from. [name, lon, lat]. */
const REACH_POINTS = {
  'Middle East': [['Qatar', 51.2, 25.3], ['UAE', 54, 24], ['Türkiye', 35, 39], ['Lebanon', 35.8, 33.9]],
  'Europe & Black Sea': [['Ukraine', 31, 49], ['Bulgaria', 25.5, 42.7], ['Spain', -3.7, 40.4]],
  'Asia & Central Asia': [['China', 104.2, 35.9], ['India', 78.9, 20.6], ['Indonesia', 113.9, -0.8], ['Vietnam', 108.3, 14.1], ['Singapore', 103.8, 1.4], ['Turkmenistan', 59.6, 39], ['Kazakhstan', 66.9, 48]],
  'Africa': [['Ethiopia', 40.5, 9.1], ['Uganda', 32.3, 1.4], ['Libya', 17.2, 26.3]],
  'The Americas': [['Canada', -106, 56], ['United States', -98, 39.8], ['Brazil', -51.9, -14.2], ['Colombia', -74.3, 4.6]],
  'Oceania': [['Australia', 133.8, -25.3]]
};

const HUB = [51.53, 25.29];   // Doha

/* The markets the Group sources from today. Not every commodity comes from
   every country: the origin is chosen per product,
   per season and per set of terms. */
const REACH = [
  { t: 'Middle East', d: 'Qatar · UAE · Türkiye · Lebanon' },
  { t: 'Europe & Black Sea', d: 'Ukraine · Bulgaria · Spain' },
  { t: 'Asia & Central Asia', d: 'China · India · Indonesia · Vietnam · Singapore · Turkmenistan · Kazakhstan' },
  { t: 'Africa', d: 'Ethiopia · Uganda · Libya' },
  { t: 'The Americas', d: 'Canada · United States · Brazil · Colombia' },
  { t: 'Oceania', d: 'Australia' }
];

/* What the Group is, as distinct from the businesses inside it. */
const WHY = [
  { t: 'One group, not a holding list',
    d: 'The businesses are run as parts of one group. Sourcing, logistics and commercial relationships built for one service are open to the others.' },
  { t: 'Capital, supply and delivery together',
    d: 'Investment, international sourcing and the ability to execute sit in one structure, so a programme can be financed, supplied and delivered by the same group.' },
  { t: 'Built in Qatar, working beyond it',
    d: 'Every business is based in Qatar and serves demand we can see directly. Trading, freight and institutional supply carry the Group into the Gulf, Europe, Africa and Asia.' },
  { t: 'Governed for the long term',
    d: 'Certified management systems, selective growth and partnerships chosen to last — fewer, larger commitments, made for the long run.' }
]


/* --------------------------------------------------------------------------
   THE SUPPLIER PORTAL — what the Group buys, and what it is buying now.

   One registration covers the whole Group. A supplier picks the categories
   it can supply and is invited to events in those categories only. `buyers`
   names the desks that buy in a category, by company slug; it is routing,
   not something a visitor sees. A service page's "Supply this" button
   arrives at the registration as /supplier-portal/register/?cat=<slug>,
   which pre-ticks the box. The build refuses a buyer that is not a company.

   `items` is the plain list of what is actually bought — the sulphur, the
   sugar, the generator sets — so a producer can tell at a glance whether
   the Group is a customer for what it makes.
   -------------------------------------------------------------------------- */

const SUPPLY = [
  { slug: 'energy-materials', short: 'Energy', icon: 'spark',
    name: 'Energy & Industrial Materials',
    buyers: ['tibeco-group', 'lusail-commercial'],
    items: ['Granular sulphur', 'Refined fuels — EN590 diesel, jet A-1, gasoline', 'Petrochemicals and polymers', 'Lubricants and base oils', 'Bitumen and industrial chemicals'] },
  { slug: 'commodities-food', short: 'Commodities', icon: 'crate',
    name: 'Bulk Commodities & Food Security',
    buyers: ['tibeco-group', 'lusail-commercial'],
    items: ['Refined white cane sugar (ICUMSA 45) and raw sugar', 'Wheat and milling grains', 'Edible oils — palm olein, sunflower, soybean', 'Rice and pulses in bulk', 'Green coffee'] },
  { slug: 'fresh-food', short: 'Produce', icon: 'supply',
    name: 'Fresh Produce & Food Distribution',
    buyers: ['roma-commercial'],
    items: ['Fresh vegetables and fruit', 'Chilled and frozen poultry, meat and fish (Halal)', 'Dairy and beverages', 'Packed rice, grains and pulses', 'Shelf-stable dry foods and FMCG', 'Produce packaging'] },
  { slug: 'technology', short: 'Technology', icon: 'solve',
    name: 'Technology & Advanced Systems',
    buyers: ['tibeco-group'],
    items: ['Servers, storage and networking', 'Software licences and cloud services', 'Cybersecurity and identity', 'AI and data platforms', 'Supplied to institutional clients against their orders'] },
  { slug: 'equipment', short: 'Equipment', icon: 'target',
    name: 'Industrial, Institutional & Commercial Equipment',
    buyers: ['tibeco-group'],
    items: ['Generator sets and power equipment', 'Construction plant and machinery', 'Facility, site and institutional equipment', 'Medical and laboratory equipment, against client orders', 'Spare parts and consumables'] },
  { slug: 'projects', short: 'Projects', icon: 'cycle',
    name: 'Project-Based Commercial Supply',
    buyers: ['tibeco-group'],
    items: ['EPC and engineering packages', 'Fit-out and interior works', 'Site services and manpower', 'Project logistics and heavy lift'] },
  { slug: 'logistics', short: 'Logistics', icon: 'markets',
    name: 'Freight, Shipping & Logistics',
    buyers: ['lusail-commercial', 'roma-commercial', 'tibeco-group'],
    items: ['Vessel chartering and ocean freight', 'Container, bulk and break-bulk shipping', 'Road haulage — flatbed, low-bed, reefer', 'Air freight', 'Customs clearance, warehousing and cold chain', 'Marine survey, cargo inspection and insurance'] },
  { slug: 'corporate', short: 'Corporate', icon: 'partnership',
    name: 'Corporate Services & Indirect',
    buyers: ['tibeco-group', 'lusail-commercial', 'roma-commercial'],
    items: ['Insurance', 'Vehicles and fleet', 'Security, cleaning and facilities', 'PPE and workwear', 'Printing and marketing', 'Professional services and manpower outsourcing'] }
];

/* What the Group is buying now. One entry per sourcing event; the portal
   lists the open ones and writes a page for each, with its requirement and
   a quotation form that goes to the desk of the company that issued it.

   `closes` is Doha time (UTC+3, no daylight saving). An event drops off the
   list the moment it closes — at build, and in the browser between builds —
   and its page then says so instead of taking quotations.

   `type`: RFQ (a priced quotation), Tender (a priced, documented bid) or
   RFI (information and an indicative price, before a tender).
   `invite: true` means pre-qualified suppliers only; others may ask to be
   invited.

   ILLUSTRATIVE. These five were carried over from the portal mock-up to show
   the page working, and the quantities, ports and dates are examples. Replace
   them with live events before launch, or empty the list: the portal then
   says there is nothing open and the registration still works. */

const OPPORTUNITIES = [
  { ref: 'TG-RFQ-26-041', company: 'tibeco-group', category: 'energy-materials', type: 'RFQ',
    title: 'Granular sulphur, Grade A',
    brief: '30,000 MT ±10% · CFR Zhenjiang, China · laycan 15–30 Nov 2026',
    closes: '2026-11-05 14:00', questionsClose: '2026-10-30',
    requirement: [
      ['Product', 'Granular sulphur, Grade A, to specification sheet TG-SPEC-S-01'],
      ['Origin', 'Middle East Gulf, or as offered. The end-receiver’s import licence and the draft contract are issued to shortlisted bidders.'],
      ['Purity', '99.5% sulphur minimum, dry basis'],
      ['Moisture', '0.5% maximum'],
      ['Form', 'Granules 2–6 mm, bright yellow, low dust and fines'],
      ['Quantity', '30,000 MT ±10% at seller’s option; up to two vessels'],
      ['Delivery', 'CFR Zhenjiang, China (Yangtze). Granular only.'],
      ['Laycan', '15–30 November 2026'],
      ['Payment', 'Irrevocable letter of credit at sight'],
      ['Inspection', 'SGS, Intertek or Bureau Veritas at load port, at seller’s cost'],
      ['Evaluation', 'Lowest compliant CFR price; origin and laycan certainty break ties']
    ],
    clarifications: [
      { on: '9 Oct 2026', q: 'Is crushed lump sulphur acceptable?', a: 'No. Only granular product is accepted, because Yangtze ports restrict bulk crushed lump.' },
      { on: '11 Oct 2026', q: 'Can the quantity be split across two vessels?', a: 'Yes, up to two vessels within the laycan, at least 15,000 MT each.' }
    ] },
  { ref: 'TG-RFQ-26-042', company: 'tibeco-group', category: 'equipment', type: 'RFQ', invite: true,
    title: 'Mobile lighting towers and site welfare units',
    brief: '12 lighting towers, 6 welfare cabins · delivered Ras Laffan · pre-qualified suppliers',
    closes: '2026-11-12 14:00',
    requirement: [
      ['Product', 'Twelve diesel mobile lighting towers (4 × LED, 9 m mast) and six site welfare cabins to the client’s specification'],
      ['Delivery', 'DDP Ras Laffan Industrial City, within 10 weeks of order'],
      ['Compliance', 'Client HSE standard; Qatar Civil Defence approval for cabins'],
      ['Service', 'Twelve months’ warranty with a service agent in Qatar'],
      ['Payment', '30 days from delivery and acceptance'],
      ['Evaluation', 'Lowest compliant delivered price among pre-qualified suppliers']
    ] },
  { ref: 'RC-RFQ-26-031', company: 'roma-commercial', category: 'fresh-food', type: 'RFQ',
    title: 'Fresh vegetables, weekly programme',
    brief: 'Tomatoes, cucumbers, peppers, onions · four reefers a week · Hamad Port or Doha airport',
    closes: '2026-11-09 14:00', questionsClose: '2026-11-04',
    requirement: [
      ['Product', 'Class I tomatoes, cucumbers, capsicum and onions to Qatar market specification'],
      ['Quantity', 'Four 40-ft reefer containers a week for 12 weeks, mixed per order'],
      ['Origin', 'Türkiye, Jordan, Egypt or India by sea; Spain or the Netherlands by air, CPT Doha'],
      ['Delivery', 'CFR Hamad Port or CPT Doha airport; weekly arrivals from 1 December 2026'],
      ['Shelf life', 'At least 70% remaining on arrival'],
      ['Certification', 'GlobalG.A.P. or equivalent; phytosanitary certificate with every shipment; MoPH import registration and Arabic labelling'],
      ['Payment', '30 days from arrival inspection'],
      ['Evaluation', 'Landed price per kg, consistency of grade, and the ability to switch origin mid-season']
    ] },
  { ref: 'LC-TND-26-017', company: 'lusail-commercial', category: 'commodities-food', type: 'Tender',
    title: 'Refined white cane sugar, ICUMSA 45',
    brief: '25,000 MT · FOB origin or CFR Hamad Port · 50 kg PP bags',
    closes: '2026-11-19 14:00', questionsClose: '2026-11-12',
    requirement: [
      ['Product', 'Refined white cane sugar, ICUMSA 45 maximum, polarisation 99.8° minimum, current crop year'],
      ['Quality', 'Moisture 0.04% and ash 0.04% maximum'],
      ['Packing', '50 kg polypropylene bags with inner liner'],
      ['Quantity', '25,000 MT ±5%'],
      ['Delivery', 'FOB origin port, or CFR Hamad Port, Qatar; quote both'],
      ['Shipment', 'December 2026'],
      ['Payment', 'Irrevocable letter of credit at sight; 2% bid bond with the tender'],
      ['Inspection', 'SGS or Intertek at load port'],
      ['Evaluation', 'Lowest compliant price; shipment certainty breaks ties']
    ] },
  { ref: 'LC-RFI-26-012', company: 'lusail-commercial', category: 'logistics', type: 'RFI',
    title: 'Marine logistics, inbound to Hamad Port',
    brief: 'Annual framework · bagged and bulk commodities from Red Sea, Indian and Black Sea ports',
    closes: '2026-12-10 14:00',
    requirement: [
      ['Scope', 'Regular liftings of bagged and bulk commodities bought FOB from Red Sea, Indian and Black Sea ports, to Hamad Port, Qatar'],
      ['Volume', 'Indicatively 60,000 MT a year, in parcels of 5,000 to 25,000 MT'],
      ['Requirement', 'Owned or long-term chartered tonnage, port agency at the load ports, marine cargo and liability insurance'],
      ['Term', 'Annual framework, renewable'],
      ['Response', 'Company profile, fleet list, indicative freight per MT and transit time'],
      ['Next step', 'Shortlisted respondents are invited to a priced tender in January 2027']
    ] },
];

/* What a supplier has ready before registering. Listed so nobody starts a
   registration they cannot finish; the documents themselves are asked for by
   email at qualification, not uploaded here. */
const SUPPLIER_DOCS = [
  'Commercial registration or trade licence, and tax card',
  'Company profile, and an authorisation letter for the person registering',
  'Bank account confirmation letter on the bank’s letterhead',
  'ISO certificates, if held',
  'ICV certificate, if held — it counts in Qatar-delivered tenders',
  'Manufacturer’s authorisation, for traders and agents',
  'MoPH registration and Halal certificates, for food',
  'Marine cargo and liability insurance, for carriers'
];

/* The terms every event is run on, in brief. The long form is in each
   event's documents; this is what a supplier wants before deciding to
   register. The last line is the one that keeps a losing bidder from
   claiming the award. */
const SOURCING_TERMS = [
  { t: 'Currency and language', d: 'Quote in USD or QAR, in English.' },
  { t: 'Payment', d: 'As stated in each event. Supply delivered in Qatar is paid 30 days from invoice unless the event says otherwise.' },
  { t: 'Offers', d: 'Firm for the period you state, 30 days unless the event asks for more.' },
  { t: 'Registration', d: 'Valid for two years. Renewing is a one-line email.' },
  { t: 'Awards', d: 'Each event is an invitation to treat. Lusail Corp and its companies may accept any offer or none, may cancel or re-issue an event, and do not pay bidding costs. The laws of the State of Qatar apply.' }
];

/* The Supplier Code of Conduct, on its own page, in the short form a
   supplier accepts when registering. */
const CODE_OF_CONDUCT = [
  { t: 'Lawful business', d: 'Comply with the laws of Qatar and of every country you operate in, including sanctions, export controls and customs rules.' },
  { t: 'No bribery, no gifts', d: 'Offer nothing of value to any Lusail Corp employee, agent or their relatives to win or keep business. Hospitality beyond a working meal is declined.' },
  { t: 'Conflicts disclosed', d: 'Tell us in writing if any Lusail Corp employee or their relative has an interest in your company, before you quote.' },
  { t: 'Fair competition', d: 'Price independently. No agreement with another bidder on price, quantity, territory or whether to bid.' },
  { t: 'People and safety', d: 'No forced or child labour, lawful wages and hours, and a safe workplace for everyone in your supply chain.' },
  { t: 'Environment', d: 'Meet the environmental laws that apply to your operations, and tell us about any permit you rely on to supply us.' },
  { t: 'Accurate documents', d: 'Every certificate, specification and test result you send is genuine, current and describes the goods actually shipped.' },
  { t: 'Confidentiality', d: 'Specifications, quantities and prices in an event are shared with you for that event only.' },
  { t: 'Subcontractors and audit', d: 'Anyone you subcontract is bound by this Code, and we may audit compliance on reasonable notice.' },
  { t: 'Breach', d: 'A breach may suspend or end your registration. Report a concern to the Group at the address on the Supplier Portal.' }
];
/* The lists a form field can be drawn from, as value -> label. Shared by the
   page that renders the form and the function that checks what arrives. */
const FORM_LISTS = {
  /* what a message to the Contact page is about */
  topics: [
    ['quote', 'Request a quotation'],
    ['question', 'Ask about a service'],
    ['supplier', 'Supply the Group'],
    ['partnership', 'Propose a partnership or investment'],
    ['careers', 'Ask about careers'],
    ['other', 'Something else']
  ],
  companyTypes: [
    ['manufacturer', 'Manufacturer or producer'],
    ['trader', 'Trader or distributor'],
    ['service', 'Service provider'],
    ['contractor', 'Contractor'],
    ['logistics', 'Logistics or shipping company'],
    ['agent', 'Agent or authorised representative']
  ]
};


/* --------------------------------------------------------------------------
   FORMS — every form on the site beyond the contact page, defined once.
   The page templates draw the fields from here and api/contact.js checks
   what arrives against the same list, so a field added here appears on the
   page, is validated, and is printed in the email — with nothing else to
   edit. `options` names a list the build fills in:
     topics            what a message is about (Contact)
     servicesOpt       every service, labelled with its area, or none (Contact)
     supplyCategories  the SUPPLY categories above, as checkboxes
     companyTypes       the FORM_LISTS above
   `why` is what the visitor is told beside the field when it is missing.
   `{ step: '…' }` starts a numbered stage of the form; it holds no data.
   Field types beyond the usual: `checks` (a group of boxes, `all` labels
   the tick-everything box), `agree` (one box that must be ticked; `short`
   is how it is named in the email), `hidden` (filled by the page, such as
   the reference of the event a quotation answers).
   -------------------------------------------------------------------------- */

const FORMS = {
  /* The Contact page: any question, routed by "area" to the desk that can
     answer it. Same build, same look as the application. */
  /* The Contact page: one form for everything. What it is about decides
     the subject; the service it concerns decides the desk; a quotation adds
     the quantity, destination and timing an offer needs. */
  enquiry: {
    subject: 'Website enquiry',
    subjectFrom: 'topic',
    submit: 'Send',
    ok: 'Message sent. The desk that handles it replies within two working days.',
    fields: [
      { step: 'What it is about' },
      { name: 'topic', label: 'I want to', type: 'select', options: 'topics', required: true, full: true,
        why: 'Choose what your message is about.' },
      { name: 'service', label: 'The service it concerns', type: 'select', options: 'servicesOpt', full: true },
      { name: 'quantity', label: 'Quantity or scope', type: 'text', max: 160,
        placeholder: 'For a quotation: 30,000 MT, four reefers a week, one container…' },
      { name: 'destination', label: 'Destination, terms and timing', type: 'text', max: 200,
        placeholder: 'For a quotation: CFR Hamad Port, December 2026' },
      { name: 'message', label: 'Message', type: 'textarea', required: true, max: 5000, full: true, rows: 4,
        placeholder: 'What you need, the specification, or your question.',
        why: 'Write a line about what you need, so we can send it to the right desk.' },
      { step: 'About you' },
      { name: 'name', label: 'Full name', type: 'text', required: true, max: 120, auto: 'name',
        why: 'Tell us your name.' },
      { name: 'company', label: 'Company', type: 'text', max: 160, auto: 'organization' },
      { name: 'email', label: 'Email address', type: 'email', required: true, max: 254, auto: 'email' },
      { name: 'phone', label: 'Phone number', type: 'tel', max: 40, auto: 'tel' }
    ]
  },

  /* The Supplier Portal: one registration for the whole Group,
     cut to what procurement screens on. Everything else — the documents, the
     references — is asked for by email at qualification. */
  supplier: {
    subject: 'Supplier registration',
    subjectFrom: 'reference',
    submit: 'Submit for review',
    ok: 'Registration received. Procurement reviews new suppliers within five working days and asks for your documents by email.',
    fields: [
      { name: 'reference', label: 'Event', type: 'hidden', max: 40 },
      { step: 'Your company' },
      { name: 'company', label: 'Legal name', type: 'text', required: true, max: 160, auto: 'organization',
        placeholder: 'As on your commercial registration', why: 'Tell us the company’s legal name.' },
      { name: 'country', label: 'Country of registration', type: 'text', required: true, max: 80, auto: 'country-name',
        why: 'Tell us where the company is registered.' },
      { name: 'regNo', label: 'Commercial registration or licence no.', type: 'text', required: true, max: 60,
        why: 'The registration or licence number is needed to qualify you.' },
      { name: 'taxNo', label: 'Tax number', type: 'text', required: true, max: 60,
        why: 'The tax number is needed to qualify you.' },
      { name: 'companyType', label: 'Company type', type: 'select', options: 'companyTypes', required: true,
        why: 'Pick the one that describes you best.' },
      { name: 'yearEst', label: 'Year established', type: 'text', max: 12, placeholder: 'For example: 2009' },
      { name: 'site', label: 'Website', type: 'url', max: 200, auto: 'url', placeholder: 'https://' },
      { name: 'principal', label: 'Principal represented, if you are an agent', type: 'text', max: 160 },
      { step: 'Who may quote' },
      { name: 'name', label: 'Full name', type: 'text', required: true, max: 120, auto: 'name',
        why: 'Tell us who is authorised to quote for the company.' },
      { name: 'email', label: 'Company email', type: 'email', required: true, max: 254, auto: 'email',
        note: 'On your company’s own domain, so we can tell it is you.' },
      { name: 'phone', label: 'Mobile', type: 'tel', required: true, max: 40, auto: 'tel', placeholder: '+974',
        why: 'A number procurement can reach you on is needed.' },
      { step: 'What you supply' },
      { name: 'categories', label: 'Categories you can supply', type: 'checks', options: 'supplyCategories', all: 'All categories',
        required: true, full: true, why: 'Choose at least one category. You are invited to events in these only.' },
      { name: 'products', label: 'Main products, origins and capacity', type: 'textarea', required: true, max: 2000, full: true, rows: 3,
        placeholder: 'For example: granular sulphur, FOB Ras Laffan, 30,000 MT a month, producer-authorised',
        why: 'Name what you supply, with the origin, capacity or scope.' },
      { name: 'certs', label: 'Certificates and registrations held', type: 'text', max: 300, full: true,
        placeholder: 'ISO 9001, ICV 48% to Mar 2027, MoPH, Halal, manufacturer’s authorisation…' },
      { name: 'interests', label: 'Any interest a Lusail Corp employee or relative holds in your company', type: 'text', max: 300, full: true,
        placeholder: 'None, or who and what' },
      { step: 'Documents', note: 'Optional — attaching them now speeds up qualification, or send them by email when procurement asks. PDF or image, up to 2 MB a file and 3 MB in all.' },
      { name: 'docCr', label: 'Commercial registration or trade licence', type: 'file', hint: 'Current and valid' },
      { name: 'docTax', label: 'Tax registration certificate', type: 'file', hint: 'Tax / VAT certificate' },
      { name: 'docAuth', label: 'Authorisation letter', type: 'file', hint: 'On company letterhead, signed and stamped' },
      { name: 'docBank', label: 'Bank account confirmation letter', type: 'file', hint: 'Issued by your bank on its letterhead' },
      { name: 'docIcv', label: 'ICV certificate', type: 'file', hint: 'For suppliers registered in Qatar' },
      { name: 'docIso', label: 'ISO 9001 / 14001 / 45001 certificates', type: 'file', hint: 'Where they apply to your scope' },
      { name: 'docProfile', label: 'Company profile', type: 'file', hint: 'Capabilities, key clients, capacity' },
      { step: 'Declarations' },
      { name: 'agreeCode', type: 'agree', required: true, full: true, short: 'Code of Conduct accepted',
        label: 'We have read and accept the Lusail Corp Supplier Code of Conduct.',
        /* the words of the label that open the document itself — a supplier
           must never be asked to accept something the page will not show */
        link: { text: 'Supplier Code of Conduct', href: '/supplier-portal/code/' },
        why: 'The Code of Conduct has to be accepted to register.' },
      { name: 'agreeInterest', type: 'agree', required: true, full: true, short: 'Interests declared',
        label: 'No Lusail Corp employee or their relative holds an interest in our company, or we have declared it above.',
        why: 'The declaration of interests has to be made to register.' },
      { name: 'agreeAccurate', type: 'agree', required: true, full: true, short: 'Details confirmed accurate',
        label: 'The information given here is complete and accurate.',
        why: 'The details have to be confirmed to register.' }
    ]
  },

  callback: {
    subject: 'Callback request',
    submit: 'Send',
    ok: 'Thank you. We will be in touch within two working days.',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true, max: 120, auto: 'name',
        why: 'Tell us your name.' },
      { name: 'email', label: 'Email', type: 'email', required: true, max: 254, auto: 'email' },
      { name: 'message', label: 'Message', type: 'textarea', required: true, max: 600, rows: 3,
        why: 'A line on what you need.' }
    ]
  }
};

module.exports = {
  SITE, AREAS, ALL_SERVICES, COMPANIES, REACH, REACH_POINTS, HUB, WHY,
  WHAT_WE_DO, VALUE_CREATION, VALUES, GROWTH, FIGURES, BUYING, BUYER_WHY,
  PARTNER_TYPES, FORMS, FORM_LISTS,
  SUPPLY, OPPORTUNITIES, SUPPLIER_DOCS, SOURCING_TERMS, CODE_OF_CONDUCT
};
