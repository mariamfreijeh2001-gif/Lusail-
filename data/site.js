/* ==========================================================================
   Lusail Corp — all site content.

   STRUCTURE: two tiers, sector -> companies. A sector is a heading, not a
   page: it groups the portfolio and filters it. Every sector's story is told
   on the pages of the companies that work in it.

       /companies/                 every company, filterable by sector
       /companies/<slug>/          one company

   WRITING
   Plain sentences, concrete nouns, no filler. Say what a business does, what
   it moves and where from. Nothing here should be a claim nobody could check.

   PHOTOGRAPHY
   `hero` is the wide photograph behind a page's title; `still` is the upright
   one beside its opening paragraphs; a product's `img` is its card. All of
   them live in site-assets/img/ and are named for where they appear.

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
   SECTORS and the companies inside them
   -------------------------------------------------------------------------- */

const SECTORS = [
  {
    slug: 'investments',
    name: 'Investments & Strategic Services',
    short: 'Capital, commerce and services across energy, technology and industrial development.',
    headline: 'Capital With a Long Horizon',
    intro: 'The Group’s investment platform originates, manages and deploys positions where it can also bring commerce and services.',
    hero: 'hero-sector-investments',
    body: [
      'This is the largest part of the Group and the one with the widest reach. It brings together capital, global sourcing networks and operational execution under one governance framework, so an investment is backed by the ability to supply and to deliver.',
      'Its focus is on energy, advanced technology and industrial development, and on the government programmes, institutional buyers and major private-sector projects that need a counterpart able to commit for the long term.',
      'Growth here is selective by design: fewer, larger positions, chosen for whether they will still make sense in a decade rather than this quarter.'
    ],
    companies: [
      {
        slug: 'tibeco-group',
        /* The one company with its own website. A company with a `site` is
           linked there, in a new tab, and gets no page here; the others keep
           their pages until they have sites of their own. */
        site: 'https://www.tibecogroup.com/',
        /* how its own page looks: the opening layout, and its colour */
        look: 'full', accent: '#3b82c4', accentText: '#1f5c94', tint: '#eef4fa', offerStyle: 'showcase',
        /* Defined here, in its primary sector, and cross-listed in every
           other sector one of its platforms works in. */
        alsoIn: ['energy-industrial', 'technology', 'trading', 'supply-distribution'],
        name: 'TIBECO Group',
        role: 'Commerce · Investment · Services',
        headline: 'Commerce. Investment. Services.',
        short: 'A multi-sector business and investment platform across commerce, energy, technology and institutional supply.',
        intro: 'TIBECO Group is a multi-sector business and investment platform based in West Bay, Doha, working across commerce, investment and services.',
        body: [
          'TIBECO operates three connected platforms. Commerce supplies government entities, national programmes and major private-sector organisations. Investments originates and manages positions in energy, advanced technology and industrial development. Services delivers technology, energy, logistics and operational projects.',
          'Holding the three together is the point. Capital, international sourcing and the ability to execute sit in one structure, so a programme can be financed, supplied and delivered by the same counterpart.',
          'The company works under ISO 9001, ISO 14001 and ISO 45001 management systems and is a member of the International Chamber of Commerce Qatar, with a presence across the Gulf, Europe, North Africa and Asia.'
        ],
        facts: [
          { k: 'Platforms', v: 'Commerce, Investments and Services' },
          { k: 'Base', v: 'West Bay, Doha' },
          { k: 'Presence', v: 'Gulf, Europe, North Africa and Asia' },
          { k: 'Credentials', v: 'ISO 9001 · ISO 14001 · ISO 45001 · ICC Qatar' }
        ],
        productsTitle: 'Business <span class="soft">platforms</span>',
        products: [
          { t: 'Energy & Industrial Materials', img: 'prod-energy-materials',
            d: 'Materials and supply for energy and industrial operators, and investment in the projects behind them.' },
          { t: 'Technology & Advanced Systems', img: 'prod-technology-systems',
            d: 'Enterprise IT integration, advanced systems and AI, delivered with established global technology partners.' },
          { t: 'Industrial, Institutional & Commercial Equipment', img: 'prod-equipment',
            d: 'Equipment sourced and supplied for industrial sites, institutions and commercial operations.' },
          { t: 'Strategic Commodities & Food Security', img: 'prod-food-security',
            d: 'Long-term supply of essential commodities for programmes where continuity matters more than price on the day.' },
          { t: 'Project-Based Commercial Supply', img: 'prod-project-supply',
            d: 'Supply organised around a project’s schedule and specification, from tender to final delivery.' }
        ],
        activities: ['Institutional Supply', 'Strategic Investment', 'Energy', 'Technology & AI', 'Enterprise IT Integration', 'Project Coordination', 'Food Security', 'Government Programmes'],
        figures: [
          { v: 'auto:pillars', k: 'Business platforms' },
          { v: 'auto:products', k: 'Business areas' },
          { v: 'auto:presence', k: 'Regions of presence' },
          { v: '3', k: 'ISO certifications' }
        ],
        pillarsTitle: 'Three <span class="soft">platforms</span>',
        pillars: [
          { t: 'Commerce',
            d: 'A structured commercial and institutional supply platform for government entities, national programmes and major private-sector organisations.' },
          { t: 'Investments',
            d: 'The Group’s principal capital platform, structured to originate, manage and deploy positions across energy, advanced technology and industrial development.' },
          { t: 'Services',
            d: 'Technology, energy, logistics and operational platforms delivering project coordination, enterprise IT integration and institutional service execution.' }
        ],
        credentials: ['ISO 9001:2015 · Quality Management', 'ISO 14001:2015 · Environmental Management', 'ISO 45001:2018 · Occupational Health & Safety', 'ICC Qatar · International Chamber of Commerce member'],
        presence: ['Gulf Region', 'Europe', 'North Africa', 'Asia'],
        cta: 'Partner with TIBECO Group',
        hero: 'hero-tibeco-group',
        still: 'still-tibeco-group'
      }
    ]
  },

  {
    slug: 'energy-industrial',
    name: 'Energy & Industrial',
    short: 'Materials, equipment and investment for energy operators and industrial sites.',
    headline: 'Supplying the Industries That Run the Economy',
    intro: 'Energy and industry need suppliers who can commit to volume, specification and schedule for years at a time.',
    hero: 'hero-sector-energy-industrial',
    body: [
      'The Group works with energy operators and industrial sites as a supplier of materials and equipment, and as an investor in the projects they depend on.',
      'This is work where a missed delivery stops a plant, so what counts is reliability over the life of a contract: certified processes, sourcing that can switch origin when it has to, and a balance sheet the client can rely on.',
      'It draws on the rest of the Group — commodity trading for raw materials, logistics for heavy and project cargo — rather than buying those in.'
    ],
    companies: []
  },

  {
    slug: 'technology',
    name: 'Technology & Advanced Systems',
    short: 'Enterprise IT integration, advanced systems and AI for institutions and businesses.',
    headline: 'Systems That Institutions Can Run On',
    intro: 'Technology is both a business the Group runs and something every other part of the Group relies on.',
    hero: 'hero-sector-technology',
    body: [
      'The Group integrates enterprise systems, infrastructure monitoring, identity and business software for institutions and companies, working with established international technology platforms rather than building everything itself.',
      'Advanced technology and artificial intelligence are also an investment focus: the Group takes positions in them, and uses what it learns inside its own businesses.',
      'Clients here are buying continuity as much as software — a system that is integrated properly, supported afterwards and still running in five years.'
    ],
    companies: []
  },

  {
    slug: 'trading',
    name: 'Trading & Commodities',
    short: 'Edible oils, sugar, wheat, coffee and sulphur — bought abroad and shipped by sea, land and air.',
    headline: 'Global Supply, Commercially Answered',
    intro: 'The Group buys commodities internationally and carries them, which is one business rather than two.',
    hero: 'hero-sector-trading',
    body: [
      'This is the part of the Group that works outside Qatar. It sources edible oils, sugar, wheat, coffee and granular sulphur from producers and suppliers across the Middle East, Europe and the Black Sea, Asia and Central Asia, Africa, the Americas and Australia.',
      'It also moves them. Ocean, road and air freight, vessel chartering and heavy transport sit in the same business as the buying, so an enquiry about a commodity can be answered with the origin, the specification and the route at the same time.',
      'Which origin is used is a commercial decision, not a standing arrangement: it depends on the product, the season, quality, availability and the terms on the day.'
    ],
    companies: [
      {
        slug: 'lusail-commercial',
        /* how its own page looks: the opening layout, and its colour */
        look: 'full', accent: '#d3a750', accentText: '#7d5a1d', tint: '#f7efdf', accentOn: '#0b1a3a',
        /* Defined here, in its primary sector. It also operates in supply and
           distribution, so it is cross-listed there too. */
        alsoIn: ['supply-distribution'],
        name: 'Lusail Commercial',
        role: 'Trading & Logistics',
        headline: 'Global Trade. Reliable Logistics. Connected Markets.',
        short: 'Commodity trading and international freight — sourcing food and industrial commodities, and moving them by sea, land and air.',
        intro: 'Lusail Commercial operates where international trade meets logistics, combining commodity sourcing with the freight capability to move it.',
        body: [
          'The business operates across two connected sides. Commodity trading sources and moves edible oils, sugar, wheat, coffee and granular sulphur from producers and suppliers across the regions below. Logistics manages the cargo itself — ocean, road and air freight, vessel chartering, trailers and heavy transport.',
          'Keeping both under one roof is the point. Purchasing and transport are handled as one commercial question rather than two, so an enquiry can be answered with the origin, the specification and the route together.',
          'Sourcing spans the Middle East, Europe and the Black Sea, Asia and Central Asia, Africa, the Americas and Australia. Which origin is used depends on the product, the season, quality, availability and the terms of the transaction.'
        ],
        facts: [
          { k: 'Sector', v: 'Trading, Supply & Distribution' },
          { k: 'Activity', v: 'Commodity trading and international freight' },
          { k: 'Market', v: 'Qatar and international' },
          { k: 'Transport', v: 'Sea, land, air and multimodal' }
        ],
        products: [
          { t: 'Ocean Freight', img: 'prod-ocean-freight',
            d: 'Full and part container loads, bulk, breakbulk and project cargo between Qatar and international ports.' },
          { t: 'Vessel Chartering', img: 'prod-vessel-chartering',
            d: 'Marine capacity arranged with shipping partners for bulk commodities and large-volume shipments.' },
          { t: 'Land Freight', img: 'prod-land-freight',
            d: 'Heavy trucks, flatbed and low-bed trailers and container movement within Qatar and across regional borders.' },
          { t: 'Air Freight', img: 'prod-air-freight',
            d: 'For urgent, high-value or time-sensitive cargo between Qatar and major international markets.' },
          { t: 'Food & Agricultural Commodities', img: 'prod-food-commodities',
            origins: ['Ukraine', 'Kazakhstan', 'India', 'Indonesia', 'Brazil', 'Colombia', 'Ethiopia', 'Uganda'],
            d: 'Edible oils, sugar, wheat and grains, and coffee, sourced by specification, origin and season.' },
          { t: 'Industrial Commodities', img: 'prod-industrial-commodities',
            origins: ['Qatar', 'UAE', 'Turkmenistan', 'Kazakhstan'],
            d: 'Granular solid sulphur in bulk for industrial and commercial use, with the shipping arranged alongside.' }
        ],
        activities: ['Ocean Freight', 'Land Freight', 'Air Freight', 'Vessel Chartering', 'Multimodal Logistics', 'Commodity Trading', 'Import & Export', 'Global Sourcing'],
        figures: [
          { v: 'auto:products', k: 'Trade & freight lines' },
          { v: 'auto:countries', k: 'Source countries' },
          { v: 'auto:regions', k: 'Sourcing regions' },
          { v: '4', k: 'Transport modes' }
        ],
        pillarsTitle: 'Two sides, <span class="soft">one business</span>',
        pillars: [
          { t: 'Commodity trading', img: 'panel-food-commodities',
            d: 'Edible oils, sugar, wheat, coffee and granular sulphur, sourced from producers and suppliers across six regions by specification, origin and season.' },
          { t: 'International logistics', img: 'panel-ocean-freight',
            d: 'Ocean, road and air freight, vessel chartering, trailers and heavy transport — the cargo itself, managed under the same roof as the buying.' }
        ],
        cta: 'Partner with Lusail Commercial',
        hero: 'hero-lusail-commercial',
        still: 'still-lusail-commercial'
      }
    ]
  },

  {
    slug: 'supply-distribution',
    name: 'Supply & Distribution',
    short: 'Fresh produce, rice and dry goods, imported and delivered to the businesses that sell and serve them.',
    headline: 'Connecting Supply With Demand',
    intro: 'Distribution is the link between a producer abroad and a kitchen, a shelf or a warehouse in Qatar.',
    hero: 'hero-sector-supply-distribution',
    body: [
      'Almost everything ROMA sells arrives by ship or by plane, so the work is in the chain rather than any single link: finding producers, getting the goods in, and putting them where the buyer needs them, in the condition the buyer expects.',
      'Fresh produce has a short commercial life and agricultural supply moves with the season, so this is a business of timing. Relationships across several growing regions matter more than a single cheap origin, because they are what let the supply shift when a season ends or availability tightens.',
      'It sells into the retail and food-service trade: supermarkets, hotels, restaurants, caterers and wholesalers.'
    ],
    companies: [
      {
        slug: 'roma-commercial',
        /* how its own page looks: the opening layout, and its colour */
        look: 'split', accent: '#3f7d3a', accentText: '#2f6a2b', tint: '#edf4e8',
        name: 'ROMA Commercial',
        role: 'Food Import & Distribution',
        headline: 'From Global Farms to Qatar’s Market',
        short: 'Import and distribution of fresh produce, rice and essential foods across the Qatar market.',
        intro: 'ROMA Commercial imports fresh fruit and vegetables, rice and essential foods, and distributes them to businesses across Qatar.',
        body: [
          'Quality food distribution begins long before a product reaches the market. ROMA works across the supply chain: sourcing from producers and international suppliers, coordinating import into Qatar, and distributing to what the local market requires.',
          'Agricultural products are seasonal, so sourcing moves with the harvest. Rather than depending on a single origin, the company builds relationships across different growing regions, which lets it shift as seasons end, quality changes or availability tightens.',
          'Fresh produce has a short commercial life. The operating approach is built around removing delay between source, import and distribution, so products reach supermarkets, hotels, restaurants, caterers and wholesalers in the condition the buyer expects.'
        ],
        facts: [
          { k: 'Sector', v: 'Supply & Distribution' },
          { k: 'Activity', v: 'Food import, wholesale and distribution' },
          { k: 'Market', v: 'Qatar' },
          { k: 'Customers', v: 'Retail, wholesale, hospitality and food service' }
        ],
        products: [
          { t: 'Fresh Vegetables', img: 'prod-fresh-vegetables',
            origins: ['Spain', 'Türkiye', 'India', 'China'],
            d: 'Sourced by season, origin and demand — tomatoes, potatoes, onions, peppers, cucumbers and leafy produce among them.' },
          { t: 'Fresh Fruits', img: 'prod-fresh-fruits',
            origins: ['Spain', 'Brazil', 'Colombia', 'India'],
            d: 'Apples, citrus, bananas, grapes, melons and stone fruit, from international growing regions as the seasons allow.' },
          { t: 'Rice', img: 'prod-rice',
            origins: ['India', 'Vietnam'],
            d: 'Basmati, long-grain, parboiled and white rice, by variety, grade and pack size for retail, food service and hospitality.' },
          { t: 'Grains & Pulses', img: 'prod-grains-pulses',
            origins: ['Canada', 'Australia', 'Türkiye', 'India'],
            d: 'Lentils, chickpeas, beans, peas and wheat products, adapted to what customers in Qatar require.' },
          { t: 'Dry Food Products', img: 'prod-dry-food',
            origins: ['Türkiye', 'India', 'China', 'UAE'],
            d: 'Shelf-stable staples sourced and imported to commercial demand.' }
        ],
        activities: ['International Sourcing', 'Food Import', 'Wholesale Supply', 'Qatar Distribution', 'Seasonal Sourcing', 'Supplier Development'],
        figures: [
          { v: 'auto:products', k: 'Product lines' },
          { v: 'auto:countries', k: 'Source countries' },
          { v: 'auto:regions', k: 'Sourcing regions' },
          { v: '4', k: 'Customer channels' }
        ],
        stepsTitle: 'From the farm <span class="soft">to the shelf</span>',
        steps: [
          { t: 'Source',
            d: 'Producers and international suppliers across several growing regions, so supply can shift as a season ends or availability tightens.' },
          { t: 'Import',
            d: 'Import into Qatar coordinated to take the delay out of the chain between the farm, the port and the warehouse.' },
          { t: 'Distribute',
            d: 'Delivered to supermarkets, hotels, restaurants, caterers and wholesalers in the condition the buyer expects.' }
        ],
        quote: 'Fresh produce has a short commercial life, so this is a business of timing.',
        cta: 'Talk to ROMA Commercial',
        hero: 'hero-roma-commercial',
        still: 'still-roma-commercial'
      }
    ]
  },

  {
    slug: 'consumer-services',
    name: 'Consumer & Lifestyle Services',
    short: 'Garment care for households, judged on doing the same thing well every time.',
    headline: 'Everyday Services. Better Experiences.',
    intro: 'A service business is judged on whether it does the same thing well every time.',
    hero: 'hero-sector-consumer-services',
    body: [
      'This is where the Group serves households rather than businesses. The work is ordinary and frequent, which is exactly why it is hard: a customer notices the one time it goes wrong far more than the fifty times it went right.',
      'So the standards that matter here are unglamorous ones — turnaround, careful handling, and a result that does not vary. A service people use every week has to earn that place every week.',
      'It is also the part of the portfolio closest to the public, and the part that teaches the Group most about what customers in Qatar actually want.'
    ],
    companies: [
      {
        slug: 'cavallo-laundry',
        /* how its own page looks: the opening layout, and its colour */
        look: 'split', accent: '#4a7fa8', accentText: '#2e5f86', tint: '#ecf2f7',
        name: 'Cavallo Laundry',
        role: 'Professional Garment & Textile Care',
        headline: 'Professional Laundry & Garment Care',
        short: 'Professional laundry and garment care, built around convenience and consistency.',
        intro: 'Cavallo Laundry cleans, presses and returns clothes — everyday household laundry, and the pieces that need more care than that.',
        body: [
          'The business provides professional laundry and garment care, handling everyday household items and pieces that need specialist treatment.',
          'A laundry is judged on whether the same garment comes back the same way every time, so the work is built around turnaround, handling and consistency rather than volume alone.',
          'Cavallo is the Group’s presence in consumer and lifestyle services, the part of the portfolio that serves households directly.'
        ],
        facts: [
          { k: 'Sector', v: 'Consumer & Lifestyle Services' },
          { k: 'Activity', v: 'Laundry and garment care' },
          { k: 'Market', v: 'Qatar' }
        ],
        services: [
          { t: 'Everyday Laundry',
            d: 'Washing, drying and folding for the regular household load — the volume most homes generate every week.' },
          { t: 'Pressing & Finishing',
            d: 'Pressing and finishing so a garment comes back ready to wear rather than ready to iron.' },
          { t: 'Specialist Care',
            d: 'The pieces that need handling rather than a standard cycle: heavier fabrics, tailoring, and anything a home machine would spoil.' },
          { t: 'Household Textiles',
            d: 'Bedding, towels and the larger items that are awkward to wash and slow to dry at home.' }
        ],
        activities: ['Garment Care', 'Textile Cleaning', 'Everyday Laundry', 'Specialist Treatment'],
        pillarsTitle: 'What we are <span class="soft">judged on</span>',
        pillars: [
          { t: 'Turnaround',
            d: 'Back when it was promised. A service people use every week has to earn that place every week.' },
          { t: 'Handling',
            d: 'Everyday items and the pieces that need more care than a standard cycle, each treated as what it is.' },
          { t: 'Consistency',
            d: 'The same garment comes back the same way every time — the only standard a laundry is really judged on.' }
        ],
        quote: 'A laundry is judged on whether the same garment comes back the same way every time.',
        cta: 'Ask about Cavallo Laundry',
        hero: 'hero-cavallo-laundry',
        still: 'lifestyle-wide'
      }
    ]
  },

  {
    slug: 'food-beverage',
    name: 'Food & Beverage',
    short: 'A café, and the discipline of opening it every morning.',
    headline: 'Where the Group Meets Its Customers',
    intro: 'Hospitality is where the Group meets its customers face to face.',
    hero: 'hero-sector-food-beverage',
    body: [
      'Qatar’s food and beverage market is busy and competitive, and a concept survives in it by being somewhere people come back to rather than somewhere they pass through once.',
      'That depends on three things working together — the product itself, the service across the counter, and the room people choose to sit in. Any one of them being wrong is enough.',
      'Running a hospitality business also gives the Group something the trading side cannot: daily contact with customers, and the operational discipline that comes with opening every morning.'
    ],
    companies: [
      {
        slug: 'nero-cafe',
        /* how its own page looks: the opening layout, and its colour */
        look: 'dark', accent: '#c08a55', accentText: '#8a5a32', tint: '#f5ede4',
        name: 'Nero Café',
        role: 'Coffee, service, and the room.',
        headline: 'A Coffee Concept Built Around Experience',
        short: 'A café concept built on quality coffee, service and the room it is served in.',
        intro: 'Nero Café is the Group’s coffee shop.',
        body: [
          'The café is built around three things that have to work together: the coffee itself, the service across the counter, and the room people choose to sit in.',
          'Qatar’s food and beverage market is busy and competitive, so the concept is aimed at being somewhere people return to rather than somewhere they pass through.',
          'Nero gives the Group direct experience of running a customer-facing business — daily operations, staffing and standards — which is different from trading and distribution, and useful to it.'
        ],
        facts: [
          { k: 'Sector', v: 'Food & Beverage' },
          { k: 'Activity', v: 'Café and coffee' },
          { k: 'Market', v: 'Qatar' }
        ],
        services: [
          { t: 'Coffee',
            d: 'The product the café is built around, and the thing a customer decides about first.' },
          { t: 'Service',
            d: 'What happens across the counter. In a café it is half of what people are actually paying for.' },
          { t: 'The Room',
            d: 'Somewhere to sit, meet or work. A café people pass through and a café they come back to differ mostly here.' },
          { t: 'Daily Operations',
            d: 'Opening, stocking, staffing and closing, every day — the discipline the rest of the Group does not get from trading.' }
        ],
        activities: ['Café Operations', 'Coffee', 'Hospitality', 'Customer Experience'],
        quote: 'A café survives by being somewhere people come back to, rather than somewhere they pass through once.',
        cta: 'Ask about Nero Café',
        hero: 'hero-nero-cafe',
        still: 'coffee-still'
      }
    ]
  }
];

/* --------------------------------------------------------------------------
   Home: the four things the Group does
   -------------------------------------------------------------------------- */

const WHAT_WE_DO = [
  { t: 'Build',
    d: 'We start businesses where we can see demand in the market rather than where a category looks attractive.' },
  { t: 'Operate',
    d: 'We give each company commercial direction, oversight and the systems it needs to run day to day.' },
  { t: 'Grow',
    d: 'We help each company widen its market, sharpen what it is good at, and expand where the numbers support it.' },
  { t: 'Partner',
    d: 'We build relationships with suppliers, operators and international partners that are worth something to both sides.' }
];

/* About: how the Group creates value */
const VALUE_CREATION = [
  { t: 'Strategic Direction', icon: 'target',
    d: 'We set the commercial priorities with each business and hold it to them.' },
  { t: 'Operational Development', icon: 'solve',
    d: 'We put in the processes and systems a company needs before it needs them.' },
  { t: 'Market Development', icon: 'markets',
    d: 'We help each company find its customers, its partners and its next product.' },
  { t: 'Group Capabilities', icon: 'partnership',
    d: 'Sourcing, logistics and commercial relationships built in one company are open to the others.' },
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
    d: 'Every company here exists to serve a market. Understanding that market is the whole job.' },
  { t: 'Agility',
    d: 'Markets move. Our companies are expected to move with them rather than wait for the year to end.' },
  { t: 'Partnership',
    d: 'Strong businesses are built on relationships that last longer than a single transaction.' },
  { t: 'Long-Term Thinking',
    d: 'We would rather build something with foundations than something with momentum.' }
];

/* Home: what the Group is actively looking to do next */
const GROWTH = [
  { t: 'Establish new businesses', icon: 'spark',
    d: 'Where we can see demand in the market, rather than where a category looks attractive.' },
  { t: 'Expand existing companies', icon: 'target',
    d: 'Wider markets, sharper offers and new locations, where the numbers support it.' },
  { t: 'Enter new commercial sectors', icon: 'markets',
    d: 'Next to what we already know, and with a partner who knows the new one well.' },
  { t: 'Develop strategic partnerships', icon: 'partnership',
    d: 'Joint ventures and long-term cooperation that are worth something to both sides.' },
  { t: 'Build supplier and distribution relationships', icon: 'crate',
    d: 'Producers abroad and buyers in Qatar, held for longer than a single transaction.' },
  { t: 'Explore new regional and international markets', icon: 'supply',
    d: 'Starting with the markets our sourcing and logistics already reach.' },
  { t: 'Strengthen connections between our companies', icon: 'cycle',
    d: 'Sourcing, logistics and customers shared across the portfolio.' }
]

/* About: who the Group wants to hear from. The partnerships page was a whole
   page saying this; it is a section now, and the contact form routes each of
   these to the right desk. */
const PARTNER_TYPES = [
  { t: 'International Suppliers', v: 'international-supplier',
    d: 'Producers and exporters looking for a route into the Qatar market.' },
  { t: 'Local Suppliers & Businesses', v: 'local-business',
    d: 'Companies that want to supply our businesses, or work alongside them.' },
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

   Every one of these is counted from the content below rather than typed in,
   so none of them can be wrong and none can drift as the portfolio changes.
   The design called for "5+ years", "10+ markets" and "50k+ customers"; those
   were nobody's numbers — they came from the design file and no one at the
   Group had confirmed them. These say less and are true.

   `count` names what to count: companies, sectors, regions or countries. */
const FIGURES = [
  { k: 'Operating companies', count: 'companies' },
  { k: 'Business sectors', count: 'sectors' },
  { k: 'Sourcing regions', count: 'regions' },
  { k: 'Source countries', count: 'countries' }
];

/* The order the portfolio is listed in, wherever it is listed. TIBECO leads:
   it is the largest company and the one with the widest reach. The two
   trading businesses follow, since they carry the Group outside Qatar.
   Anything not named here keeps its sector order, behind them. */
const COMPANY_ORDER = ['tibeco-group', 'lusail-commercial', 'roma-commercial'];

/* Flat list of every company, each carrying a back-reference to the sector it
   is defined in. A company appears here exactly once, however many sectors it
   is listed under. */
const ALL_COMPANIES = SECTORS.flatMap(s =>
  s.companies.map(c => Object.assign({}, c, {
    sectorSlug: s.slug, sectorName: s.name,
    sectors: [s.slug].concat(c.alsoIn || [])
  }))
).sort((x, y) => {
  const rank = s => { const i = COMPANY_ORDER.indexOf(s); return i === -1 ? COMPANY_ORDER.length : i; };
  return rank(x.slug) - rank(y.slug);
});

/* Now add the cross-listed companies to the other sectors they work in. This
   runs after ALL_COMPANIES is built, so nothing is counted twice. */
SECTORS.forEach(s => {
  const extra = ALL_COMPANIES.filter(c => (c.alsoIn || []).includes(s.slug));
  if (extra.length) s.companies = s.companies.concat(extra);
});

const rankCompany = slug => {
  const i = COMPANY_ORDER.indexOf(slug);
  return i === -1 ? COMPANY_ORDER.length : i;
};

/* Within a sector its own companies come first and the cross-listed ones
   after, so a sector is introduced by the businesses that belong to it. */
SECTORS.forEach(s => {
  const visiting = c => (c.sectorSlug && c.sectorSlug !== s.slug) ? 1 : 0;
  s.companies.sort((x, y) => visiting(x) - visiting(y) || rankCompany(x.slug) - rankCompany(y.slug));
});

SECTORS.sort((x, y) => {
  /* A sector ranks by the best-ranked company that actually belongs to it.
     A cross-listed company does not lend its rank to the other sector, or
     Supply & Distribution would tie with Trading on the strength of a
     company that is only visiting. */
  const best = s => s.companies.reduce(
    (m, c) => (c.sectorSlug && c.sectorSlug !== s.slug)
      ? m : Math.min(m, rankCompany(c.slug)), COMPANY_ORDER.length);
  return best(x) - best(y);
});

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

/* The markets the Group sources from today, through Lusail Commercial. Not
   every commodity comes from every country: the origin is chosen per product,
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
    d: 'The businesses are run as parts of one group. Sourcing, logistics and commercial relationships built in one company are open to the others.' },
  { t: 'Capital, supply and delivery together',
    d: 'Investment, international sourcing and the ability to execute sit in one structure, so a programme can be financed, supplied and delivered by the same group.' },
  { t: 'Built in Qatar, working beyond it',
    d: 'Every business is based in Qatar and serves demand we can see directly. TIBECO and Lusail Commercial carry the Group into the Gulf, Europe, Africa and Asia.' },
  { t: 'Governed for the long term',
    d: 'Certified management systems, selective growth and partnerships chosen to last — fewer, larger commitments, made for the long run.' }
]


/* --------------------------------------------------------------------------
   THE SUPPLIER PORTAL — what the Group buys, and what it is buying now.

   One registration covers every company. A supplier picks the categories it
   can supply and is invited to events in those categories only. `buyers`
   names the companies that buy in a category, by slug, which is how a link
   from a company page (/suppliers/?company=<slug>) pre-ticks the right
   boxes. The build refuses a buyer that is not a company on the site.

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
  companyTypes: [
    ['manufacturer', 'Manufacturer or producer'],
    ['trader', 'Trader or distributor'],
    ['service', 'Service provider'],
    ['contractor', 'Contractor'],
    ['logistics', 'Logistics or shipping company'],
    ['agent', 'Agent or authorised representative']
  ],
  currencies: [['USD', 'USD'], ['QAR', 'QAR'], ['EUR', 'EUR']],
  incoterms: [['EXW', 'EXW — ex works'], ['FOB', 'FOB — free on board'], ['CFR', 'CFR — cost and freight'], ['CIF', 'CIF — cost, insurance and freight'], ['CPT', 'CPT — carriage paid to'], ['DAP', 'DAP — delivered at place'], ['DDP', 'DDP — delivered duty paid'], ['local', 'Delivered in Qatar']],
  validity: [
    ['30', '30 days from closing'],
    ['60', '60 days from closing'],
    ['90', '90 days from closing']
  ]
};


/* --------------------------------------------------------------------------
   FORMS — every form on the site beyond the contact page, defined once.
   The page templates draw the fields from here and api/contact.js checks
   what arrives against the same list, so a field added here appears on the
   page, is validated, and is printed in the email — with nothing else to
   edit. `options` names a list the build fills in:
     areas             every company, plus the general desks (Contact)
     supplyCategories  the SUPPLY categories above, as checkboxes
     companyTypes, validity   the FORM_LISTS above
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
  enquiry: {
    subject: 'Website enquiry',
    subjectFrom: 'area',
    submit: 'Send enquiry',
    ok: 'Message sent. We reply within two working days.',
    fields: [
      { step: 'About you' },
      { name: 'name', label: 'Full name', type: 'text', required: true, max: 120, auto: 'name',
        why: 'Tell us your name.' },
      { name: 'company', label: 'Company', type: 'text', max: 160, auto: 'organization' },
      { name: 'email', label: 'Email address', type: 'email', required: true, max: 254, auto: 'email' },
      { name: 'phone', label: 'Phone number', type: 'tel', max: 40, auto: 'tel' },
      { step: 'Your message' },
      { name: 'area', label: 'Area of interest', type: 'select', options: 'areas', full: true },
      { name: 'message', label: 'Message', type: 'textarea', required: true, max: 5000, full: true,
        why: 'Write a line about what you need, so we can send it to the right company.' }
    ]
  },

  /* The Supplier Portal: one registration for every company in the Group,
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
        why: 'The Code of Conduct has to be accepted to register.' },
      { name: 'agreeInterest', type: 'agree', required: true, full: true, short: 'Interests declared',
        label: 'No Lusail Corp employee or their relative holds an interest in our company, or we have declared it above.',
        why: 'The declaration of interests has to be made to register.' },
      { name: 'agreeAccurate', type: 'agree', required: true, full: true, short: 'Details confirmed accurate',
        label: 'The information given here is complete and accurate.',
        why: 'The details have to be confirmed to register.' }
    ]
  },

  /* A quotation against one open event: the cover sheet of an offer. The
     signed offer and its documents follow by email, quoting the reference.
     The page fills in the reference; the email goes to the issuing desk. */
  quote: {
    subject: 'Quotation',
    subjectFrom: 'reference',
    submit: 'Submit quotation',
    ok: 'Quotation received by the issuing desk. Email the signed offer, specification and certificates quoting the reference; the desk replies after the event closes.',
    fields: [
      { name: 'reference', label: 'Reference', type: 'hidden', max: 40 },
      { name: 'opportunity', label: 'Event', type: 'hidden', max: 160 },
      { step: 'Your company' },
      { name: 'company', label: 'Company name', type: 'text', required: true, max: 160, auto: 'organization',
        why: 'Tell us which company is quoting.' },
      { name: 'name', label: 'Your name', type: 'text', required: true, max: 120, auto: 'name',
        why: 'Tell us who to reply to.' },
      { name: 'email', label: 'Email address', type: 'email', required: true, max: 254, auto: 'email' },
      { name: 'phone', label: 'Phone number', type: 'tel', max: 40, auto: 'tel' },
      { step: 'Your offer' },
      { name: 'currency', label: 'Currency', type: 'select', options: 'currencies', required: true,
        why: 'Pick the currency of the offer.' },
      { name: 'price', label: 'Price per unit', type: 'text', required: true, max: 80,
        placeholder: 'e.g. 1,040 per MT', why: 'State the unit price.' },
      { name: 'incoterm', label: 'Delivery basis', type: 'select', options: 'incoterms', required: true,
        why: 'Pick the delivery basis the price is quoted on.' },
      { name: 'quantity', label: 'Quantity or scope offered', type: 'text', required: true, max: 160,
        placeholder: 'e.g. 30,000 MT ±10%', why: 'Say how much, or what scope, you are offering.' },
      { name: 'origin', label: 'Origin or manufacturer', type: 'text', max: 120 },
      { name: 'delivery', label: 'Load port, delivery point or lead time', type: 'text', max: 160 },
      { name: 'payment', label: 'Payment terms offered', type: 'text', max: 160, placeholder: 'e.g. irrevocable LC at sight' },
      { name: 'validity', label: 'Offer valid for', type: 'select', options: 'validity', required: true,
        why: 'Say how long the offer stands.' },
      { name: 'message', label: 'Deviations from the requirement, and notes', type: 'textarea', max: 5000, full: true, rows: 4,
        placeholder: 'Anything that differs from the requirement, and anything the desk should know.' },
      { step: 'Declaration' },
      { name: 'agreeTerms', type: 'agree', required: true, full: true, short: 'Terms accepted',
        label: 'This offer is firm for the period stated, and we accept the event terms and the Lusail Corp Supplier Code of Conduct.',
        why: 'The event terms have to be accepted to quote.' }
    ]
  },
  /* The small form in the corner of every page: enough to reach back. */
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
  SITE, SECTORS, ALL_COMPANIES, REACH, REACH_POINTS, HUB, WHY,
  WHAT_WE_DO, VALUE_CREATION, VALUES, GROWTH, FIGURES,
  PARTNER_TYPES, FORMS, FORM_LISTS,
  SUPPLY, OPPORTUNITIES, SUPPLIER_DOCS, SOURCING_TERMS, CODE_OF_CONDUCT
};
