/* ==========================================================================
   Lusail Corp — all site content.

   STRUCTURE: two tiers, sector -> companies.
   A sector holds any number of companies, including none (Future Ventures).

       /sectors/<slug>/            the sector, and the companies in it
       /companies/                 every company, filterable by sector
       /companies/<slug>/          one company

   PHOTOGRAPHY
   photoStyle is 'plate' (full-width captioned photograph), 'still' (a cutout
   product shot, contained on white) or 'none' (typographic only). Two of the
   four companies have no usable photography in the supplied folder — there is
   no laundry imagery and no fresh-produce imagery at all — so they are set to
   'none' rather than given a picture that is not of their business.

   ARABIC
   Every -Ar field is a translation written for this build. It reads correctly
   but has not been reviewed on the client side; check it before launch.
   ========================================================================== */

const SITE = {
  name: 'Lusail Corp',
  nameAr: 'لوسيل كورب',
  tagline: 'Building Businesses. Creating Value.',
  taglineAr: 'نبني الأعمال. نصنع القيمة.',
  supporting: 'One Group. Multiple Businesses. Shared Ambition.',
  supportingAr: 'مجموعة واحدة. أعمال متعددة. طموح مشترك.',
  blurb: 'A diversified corporate group based in the State of Qatar.',
  blurbAr: 'مجموعة شركات متنوعة مقرها دولة قطر.',
  domain: 'https://lusailcorp.qa',

  /* The logo is an asset, not a design ingredient. Nothing in the layout is
     derived from its shape, so swapping these files re-brands the site.
     Paths are relative to site-assets/logo/. */
  brand: {
    logoOnLight: 'lusail-corp-horizontal-black.svg',
    logoOnDark: 'lusail-corp-horizontal-white.svg',
    logoWidth: 574, logoHeight: 112,
    faviconSvg: 'favicon.svg',
    faviconIco: 'favicon.ico',
    appleTouch: 'apple-touch-icon.png'
  },

  /* One published address. Enquiries are routed internally from there, which
     is why the form sends the 'area' field — it tells the Group which desk a
     message belongs to. The phone number is a placeholder: replace the zeros. */
  contact: {
    location: 'State of Qatar',
    locationAr: 'دولة قطر',
    email: 'info@lusailcorp.qa',
    phone: '+974 0000 0000',
    linkedin: '#',
    instagram: '#'
  },

  nav: [
    { href: '/about/', label: 'About Us', labelAr: 'من نحن' },
    { href: '/companies/', label: 'Our Companies', labelAr: 'شركاتنا' },
    { href: '/sectors/', label: 'Our Sectors', labelAr: 'قطاعاتنا', mega: true },
    { href: '/partnerships/', label: 'Partnerships', labelAr: 'الشراكات' },
    { href: '/careers/', label: 'Careers', labelAr: 'الوظائف' },
    { href: '/contact/', label: 'Contact', labelAr: 'تواصل معنا' }
  ]
};

/* --------------------------------------------------------------------------
   SECTORS and the companies inside them
   -------------------------------------------------------------------------- */

const SECTORS = [
  {
    slug: 'consumer-services',
    name: 'Consumer & Lifestyle Services', nameAr: 'خدمات المستهلك ونمط الحياة',
    short: 'Businesses designed around everyday customer needs, convenience and service.',
    shortAr: 'أعمال مبنية على احتياجات العملاء اليومية والراحة وجودة الخدمة.',
    headline: 'Everyday Services. Better Experiences.',
    headlineAr: 'خدمات يومية. تجربة أفضل.',
    intro: 'Our consumer-service businesses focus on practical customer needs and service quality.',
    introAr: 'تركّز أعمالنا في خدمات المستهلك على الاحتياجات العملية للعملاء وعلى جودة الخدمة.',
    body: [
      'Through concepts such as Cavallo Laundry, we aim to develop reliable service businesses capable of building strong relationships with their customers.'
    ],
    bodyAr: [
      'من خلال مفاهيم مثل مغسلة كافالو، نسعى إلى بناء شركات خدمات موثوقة قادرة على تكوين علاقات قوية مع عملائها.'
    ],
    photo: null, photoStyle: 'none',
    companies: [
      {
        slug: 'cavallo-laundry',
        name: 'Cavallo Laundry', nameAr: 'مغسلة كافالو',
        role: 'Professional Garment & Textile Care', roleAr: 'العناية الاحترافية بالملابس والمنسوجات',
        headline: 'Professional Laundry & Garment Care',
        headlineAr: 'غسيل وعناية احترافية بالملابس',
        short: 'Professional laundry and garment-care services, focused on convenience, consistency and service quality.',
        shortAr: 'خدمات غسيل وعناية احترافية بالملابس، تركّز على الراحة والثبات وجودة الخدمة.',
        intro: 'Cavallo Laundry operates within Lusail Corp’s consumer services portfolio.',
        introAr: 'تعمل مغسلة كافالو ضمن محفظة خدمات المستهلك في لوسيل كورب.',
        body: [
          'The business provides professional laundry and garment-care services, combining practical service delivery with a focus on convenience and consistency.',
          'The company represents Lusail Corp’s presence in the consumer and lifestyle services sector.'
        ],
        bodyAr: [
          'تقدّم الشركة خدمات غسيل وعناية احترافية بالملابس، وتجمع بين تقديم الخدمة بشكل عملي والتركيز على الراحة والثبات.',
          'وتمثّل الشركة حضور لوسيل كورب في قطاع خدمات المستهلك ونمط الحياة.'
        ],
        facts: [
          { k: 'Sector', kAr: 'القطاع', v: 'Consumer & Lifestyle Services', vAr: 'خدمات المستهلك ونمط الحياة' },
          { k: 'Activity', kAr: 'النشاط', v: 'Laundry and Garment Care', vAr: 'الغسيل والعناية بالملابس' },
          { k: 'Market', kAr: 'السوق', v: 'Qatar', vAr: 'قطر' }
        ],
        cta: 'Visit Cavallo Laundry', ctaAr: 'زيارة مغسلة كافالو',
        photo: null, photoStyle: 'none'
      }
    ]
  },

  {
    slug: 'food-beverage',
    name: 'Food & Beverage', nameAr: 'الأغذية والمشروبات',
    short: 'Consumer-facing concepts centred on quality products, service and experience.',
    shortAr: 'مفاهيم موجّهة للمستهلك ترتكز على جودة المنتج والخدمة والتجربة.',
    headline: 'Creating Consumer Brands',
    headlineAr: 'نبني علامات استهلاكية',
    intro: 'Food and beverage is an important part of our developing portfolio.',
    introAr: 'تشكّل الأغذية والمشروبات جزءاً مهماً من محفظتنا المتنامية.',
    body: [
      'Through Nero Café, Lusail Corp is building direct experience in customer-facing hospitality and café operations.'
    ],
    bodyAr: [
      'من خلال نيرو كافيه، تبني لوسيل كورب خبرة مباشرة في الضيافة وتشغيل المقاهي.'
    ],
    photo: 'coffee', photoStyle: 'still',
    photoCaption: 'Coffee, the product the café is built around.',
    photoCaptionAr: 'البن، المنتج الذي يقوم عليه المقهى.',
    companies: [
      {
        slug: 'nero-cafe',
        name: 'Nero Café', nameAr: 'نيرو كافيه',
        role: 'Coffee. Experience. Community.', roleAr: 'قهوة. تجربة. مجتمع.',
        headline: 'A Coffee Concept Built Around Experience',
        headlineAr: 'مفهوم قهوة يقوم على التجربة',
        short: 'A café concept built around quality coffee, service and atmosphere.',
        shortAr: 'مفهوم مقهى يقوم على جودة القهوة والخدمة وأجواء المكان.',
        intro: 'Nero Café represents Lusail Corp’s presence within the food and beverage sector.',
        introAr: 'يمثّل نيرو كافيه حضور لوسيل كورب في قطاع الأغذية والمشروبات.',
        body: [
          'Built around coffee, service and atmosphere, the café aims to create a welcoming experience for customers and establish a distinctive identity within Qatar’s dynamic food and beverage market.',
          'The brand focuses on creating an inviting café experience where quality products, service and atmosphere come together.'
        ],
        bodyAr: [
          'يقوم المقهى على القهوة والخدمة والأجواء، ويهدف إلى تقديم تجربة مرحّبة للعملاء وبناء هوية مميزة داخل سوق الأغذية والمشروبات النشط في قطر.',
          'تركّز العلامة على خلق تجربة مقهى جاذبة تجتمع فيها جودة المنتج والخدمة والأجواء.'
        ],
        facts: [
          { k: 'Sector', kAr: 'القطاع', v: 'Food & Beverage', vAr: 'الأغذية والمشروبات' },
          { k: 'Activity', kAr: 'النشاط', v: 'Café & Coffee', vAr: 'المقهى والقهوة' },
          { k: 'Market', kAr: 'السوق', v: 'Qatar', vAr: 'قطر' }
        ],
        cta: 'Discover Nero Café', ctaAr: 'اكتشف نيرو كافيه',
        photo: 'coffee', photoStyle: 'still'
      }
    ]
  },

  {
    slug: 'food-supply',
    name: 'Food Supply & Distribution', nameAr: 'توريد وتوزيع الأغذية',
    short: 'Commercial activities connecting food products and fresh produce with the Qatar market.',
    shortAr: 'أنشطة تجارية تربط المنتجات الغذائية والخضار والفواكه الطازجة بالسوق القطري.',
    headline: 'Connecting Supply With Demand',
    headlineAr: 'نربط العرض بالطلب',
    intro: 'Food distribution plays an important role in connecting producers, suppliers, businesses and customers.',
    introAr: 'يؤدي توزيع الأغذية دوراً مهماً في الربط بين المنتجين والموردين والشركات والعملاء.',
    body: [
      'ROMA Commercial currently focuses on supplying fruits and vegetables within Qatar, creating a foundation from which its product and customer network can continue to develop.'
    ],
    bodyAr: [
      'تركّز روما التجارية حالياً على توريد الفواكه والخضار داخل قطر، بما يوفّر أساساً تتوسع منه شبكة منتجاتها وعملائها.'
    ],
    photo: null, photoStyle: 'none',
    companies: [
      {
        slug: 'roma-commercial',
        name: 'ROMA Commercial', nameAr: 'روما التجارية',
        role: 'Fresh Produce Supply & Commercial Distribution', roleAr: 'توريد المنتجات الطازجة والتوزيع التجاري',
        headline: 'Supplying Fresh Produce to Qatar',
        headlineAr: 'توريد المنتجات الطازجة إلى قطر',
        short: 'Supply and distribution of fresh fruits and vegetables within the Qatar market.',
        shortAr: 'توريد وتوزيع الفواكه والخضار الطازجة داخل السوق القطري.',
        intro: 'ROMA Commercial is a commercial supply business focused on fruits and vegetables within the Qatar market.',
        introAr: 'روما التجارية شركة توريد تجاري تركّز على الفواكه والخضار داخل السوق القطري.',
        body: [
          'The business works across sourcing and supply to help meet the needs of Qatar’s food market.',
          'Through dependable sourcing and commercial relationships, the company works to connect quality produce with the needs of businesses and customers across Qatar.',
          'As ROMA Commercial develops, the company aims to expand its commercial relationships, product categories and supply capabilities.'
        ],
        bodyAr: [
          'تعمل الشركة في التوريد والإمداد لتلبية احتياجات سوق الأغذية في قطر.',
          'ومن خلال مصادر توريد موثوقة وعلاقات تجارية راسخة، تربط الشركة المنتجات الجيدة باحتياجات الشركات والعملاء في أنحاء قطر.',
          'ومع تطوّر روما التجارية، تهدف الشركة إلى توسيع علاقاتها التجارية وفئات منتجاتها وقدراتها التوريدية.'
        ],
        facts: [
          { k: 'Sector', kAr: 'القطاع', v: 'Food Supply & Distribution', vAr: 'توريد وتوزيع الأغذية' },
          { k: 'Activity', kAr: 'النشاط', v: 'Fruits & Vegetables', vAr: 'الفواكه والخضار' },
          { k: 'Market', kAr: 'السوق', v: 'Qatar', vAr: 'قطر' }
        ],
        cta: 'Contact ROMA Commercial', ctaAr: 'تواصل مع روما التجارية',
        photo: null, photoStyle: 'none'
      }
    ]
  },

  {
    slug: 'trading',
    name: 'Trading & Commodities', nameAr: 'التجارة والسلع',
    short: 'International sourcing, import, export and commercial trading across selected commodity categories.',
    shortAr: 'التوريد الدولي والاستيراد والتصدير والتجارة في فئات مختارة من السلع.',
    headline: 'Connecting Global Supply With Commercial Opportunity',
    headlineAr: 'نربط التوريد العالمي بالفرصة التجارية',
    intro: 'Lusail Commercial develops international sourcing, importing and exporting activities across selected product categories.',
    introAr: 'تطوّر لوسيل التجارية أنشطة التوريد الدولي والاستيراد والتصدير في فئات مختارة من المنتجات.',
    body: [
      'Coffee and wheat currently form the initial focus of this business, with the potential for additional commodities and commercial activities as the company develops.'
    ],
    bodyAr: [
      'يشكّل البن والقمح محور التركيز الأولي لهذا النشاط، مع إمكانية إضافة سلع وأنشطة تجارية أخرى مع تطوّر الشركة.'
    ],
    photo: 'grain', photoStyle: 'still',
    photoCaption: 'Wheat and coffee, the initial focus of the Group’s trading business.',
    photoCaptionAr: 'القمح والبن، محور التركيز الأولي لنشاط التجارة في المجموعة.',
    companies: [
      {
        slug: 'lusail-commercial',
        name: 'Lusail Commercial', nameAr: 'لوسيل التجارية',
        role: 'International Trade & Commodities', roleAr: 'التجارة الدولية والسلع',
        headline: 'Connecting Products, Suppliers and Markets',
        headlineAr: 'نربط المنتجات بالموردين والأسواق',
        short: 'International import and export, initially focused on commodities including coffee and wheat.',
        shortAr: 'الاستيراد والتصدير الدولي، بتركيز أولي على سلع تشمل البن والقمح.',
        intro: 'Lusail Commercial is the Group’s international trading business.',
        introAr: 'لوسيل التجارية هي ذراع المجموعة للتجارة الدولية.',
        body: [
          'The company is focused on importing and exporting selected commodities, initially including coffee and wheat.',
          'Through relationships with suppliers and commercial partners, Lusail Commercial works to identify sourcing opportunities and develop dependable trading channels between international markets and customers.'
        ],
        bodyAr: [
          'تركّز الشركة على استيراد وتصدير سلع مختارة، تشمل في البداية البن والقمح.',
          'ومن خلال علاقاتها مع الموردين والشركاء التجاريين، تعمل لوسيل التجارية على تحديد فرص التوريد وبناء قنوات تجارية موثوقة بين الأسواق الدولية والعملاء.'
        ],
        products: [
          { t: 'Coffee', tAr: 'البن', d: 'International sourcing and commercial trade of coffee products.', dAr: 'التوريد الدولي والتجارة في منتجات البن.' },
          { t: 'Wheat', tAr: 'القمح', d: 'Sourcing and commercial trade of wheat for relevant markets and customers.', dAr: 'توريد القمح والتجارة فيه للأسواق والعملاء المعنيين.' }
        ],
        activities: ['Import', 'Export', 'International Sourcing', 'Commodity Trading', 'Supplier Development', 'Commercial Partnerships'],
        activitiesAr: ['الاستيراد', 'التصدير', 'التوريد الدولي', 'تجارة السلع', 'تطوير الموردين', 'الشراكات التجارية'],
        facts: [
          { k: 'Sector', kAr: 'القطاع', v: 'Trading & Commodities', vAr: 'التجارة والسلع' },
          { k: 'Activity', kAr: 'النشاط', v: 'Import, export and commodity trading', vAr: 'الاستيراد والتصدير وتجارة السلع' },
          { k: 'Market', kAr: 'السوق', v: 'Qatar and international', vAr: 'قطر والأسواق الدولية' }
        ],
        cta: 'Partner With Lusail Commercial', ctaAr: 'كن شريكاً للوسيل التجارية',
        photo: 'grain', photoStyle: 'still'
      }
    ]
  },

  {
    slug: 'future-ventures',
    name: 'Future Ventures', nameAr: 'مشاريع المستقبل',
    short: 'Our portfolio will continue to evolve. New sectors will join it.',
    shortAr: 'ستواصل محفظتنا التطوّر، وستنضم إليها قطاعات جديدة.',
    headline: 'Always Looking Forward',
    headlineAr: 'نتطلّع دائماً إلى الأمام',
    intro: 'Our current sectors do not define the limits of Lusail Corp.',
    introAr: 'قطاعاتنا الحالية لا تحدّ نطاق لوسيل كورب.',
    body: [
      'We continue to evaluate businesses and sectors that offer compelling commercial opportunities and fit the Group’s capabilities and direction.',
      'Lusail Corp remains open to new businesses, sectors, partnerships and commercial opportunities that complement our capabilities and long-term direction. As Lusail Corp expands, new industries will become part of our portfolio.'
    ],
    bodyAr: [
      'نواصل دراسة الأعمال والقطاعات التي تنطوي على فرص تجارية مقنعة وتتوافق مع قدرات المجموعة واتجاهها.',
      'وتبقى لوسيل كورب منفتحة على أعمال وقطاعات وشراكات وفرص تجارية جديدة تكمّل قدراتنا واتجاهنا بعيد المدى. ومع توسّع المجموعة، ستنضم صناعات جديدة إلى محفظتنا.'
    ],
    photo: null, photoStyle: 'none',
    companies: []
  }
];

/* --------------------------------------------------------------------------
   Home: the four things the Group does
   -------------------------------------------------------------------------- */

const WHAT_WE_DO = [
  { t: 'Build', tAr: 'نبني',
    d: 'We identify opportunities to create and develop businesses that respond to real commercial and consumer demand.',
    dAr: 'نحدّد الفرص لإنشاء وتطوير أعمال تستجيب لطلب تجاري واستهلاكي حقيقي.' },
  { t: 'Operate', tAr: 'ندير',
    d: 'We support companies with strategic direction, commercial oversight and the systems required for effective operations.',
    dAr: 'ندعم الشركات بالتوجيه الاستراتيجي والإشراف التجاري والأنظمة اللازمة للتشغيل الفعّال.' },
  { t: 'Grow', tAr: 'ننمّي',
    d: 'We help our companies strengthen their market presence, improve their capabilities and pursue sustainable expansion.',
    dAr: 'نساعد شركاتنا على تعزيز حضورها في السوق وتطوير قدراتها والسعي إلى توسّع مستدام.' },
  { t: 'Partner', tAr: 'نشارك',
    d: 'We develop relationships with suppliers, operators, businesses and international partners that can create mutual commercial value.',
    dAr: 'نبني علاقات مع الموردين والمشغّلين والشركات والشركاء الدوليين بما يخلق قيمة تجارية متبادلة.' }
];

/* Home: how the Group creates value */
const VALUE_CREATION = [
  { t: 'Strategic Direction', tAr: 'التوجيه الاستراتيجي',
    d: 'We establish clear commercial priorities and support each business in defining its path forward.',
    dAr: 'نضع أولويات تجارية واضحة وندعم كل شركة في تحديد مسارها.' },
  { t: 'Operational Development', tAr: 'التطوير التشغيلي',
    d: 'We encourage efficient processes, appropriate systems and stronger operating structures across our businesses.',
    dAr: 'نشجّع على العمليات الكفؤة والأنظمة المناسبة والهياكل التشغيلية الأقوى في جميع أعمالنا.' },
  { t: 'Market Development', tAr: 'تطوير السوق',
    d: 'We support our companies as they identify customers, partnerships, products and opportunities for expansion.',
    dAr: 'ندعم شركاتنا في تحديد العملاء والشراكات والمنتجات وفرص التوسّع.' },
  { t: 'Group Capabilities', tAr: 'قدرات المجموعة',
    d: 'Where appropriate, our companies can benefit from shared knowledge, commercial relationships and group-level capabilities.',
    dAr: 'حيثما كان ملائماً، تستفيد شركاتنا من المعرفة المشتركة والعلاقات التجارية وقدرات المجموعة.' },
  { t: 'Long-Term Perspective', tAr: 'نظرة بعيدة المدى',
    d: 'We aim to develop businesses with lasting commercial foundations rather than focusing only on short-term opportunities.',
    dAr: 'نسعى إلى بناء أعمال ذات أسس تجارية راسخة بدل التركيز على الفرص قصيرة الأجل وحدها.' }
];

/* About: the Group's values */
const VALUES = [
  { t: 'Integrity', tAr: 'النزاهة',
    d: 'We believe sustainable business begins with responsible decisions, transparency and respect for our partners, customers and people.',
    dAr: 'نؤمن بأن العمل المستدام يبدأ بقرارات مسؤولة وشفافية واحترام لشركائنا وعملائنا وموظفينا.' },
  { t: 'Execution', tAr: 'التنفيذ',
    d: 'Ideas create opportunities. Execution turns those opportunities into businesses. We value action, accountability and measurable progress.',
    dAr: 'الأفكار تصنع الفرص، والتنفيذ يحوّلها إلى أعمال. نقدّر المبادرة والمساءلة والتقدّم القابل للقياس.' },
  { t: 'Customer Focus', tAr: 'التركيز على العميل',
    d: 'Every company within our portfolio ultimately exists to serve a market. Understanding customers and delivering real value remain central to our approach.',
    dAr: 'كل شركة في محفظتنا موجودة في النهاية لخدمة سوق. ويظل فهم العملاء وتقديم قيمة حقيقية في صميم نهجنا.' },
  { t: 'Agility', tAr: 'المرونة',
    d: 'Markets evolve quickly. We encourage our companies to remain responsive, practical and willing to adapt when new opportunities emerge.',
    dAr: 'تتغيّر الأسواق بسرعة. نشجّع شركاتنا على البقاء سريعة الاستجابة وعملية ومستعدة للتكيّف عند ظهور فرص جديدة.' },
  { t: 'Partnership', tAr: 'الشراكة',
    d: 'Strong businesses are built through strong relationships. We value lasting relationships with suppliers, clients, employees and commercial partners.',
    dAr: 'تُبنى الأعمال القوية على علاقات قوية. نقدّر العلاقات الدائمة مع الموردين والعملاء والموظفين والشركاء التجاريين.' },
  { t: 'Long-Term Thinking', tAr: 'التفكير بعيد المدى',
    d: 'We aim to create businesses with strong foundations and the ability to develop over time.',
    dAr: 'نسعى إلى بناء أعمال ذات أسس متينة وقدرة على التطوّر مع الوقت.' }
];

/* Home: what the Group is actively looking to do next */
const GROWTH = [
  { icon: 'found',       t: 'Establish new businesses.', tAr: 'تأسيس أعمال جديدة.' },
  { icon: 'expand',      t: 'Expand existing companies.', tAr: 'توسيع الشركات القائمة.' },
  { icon: 'sectors',     t: 'Enter new commercial sectors.', tAr: 'دخول قطاعات تجارية جديدة.' },
  { icon: 'partnership', t: 'Develop strategic partnerships.', tAr: 'تطوير شراكات استراتيجية.' },
  { icon: 'supply',      t: 'Build supplier and distribution relationships.', tAr: 'بناء علاقات توريد وتوزيع.' },
  { icon: 'markets',     t: 'Explore new regional and international markets.', tAr: 'استكشاف أسواق إقليمية ودولية جديدة.' },
  { icon: 'network',     t: 'Strengthen connections between our portfolio companies.', tAr: 'تعزيز الروابط بين شركات المحفظة.' }
];

/* Partnerships page */
const PARTNER_TYPES = [
  { icon: 'markets', t: 'International Suppliers', tAr: 'الموردون الدوليون',
    d: 'Companies seeking reliable commercial relationships and market opportunities.',
    dAr: 'شركات تبحث عن علاقات تجارية موثوقة وفرص في السوق.' },
  { icon: 'found', t: 'Local Suppliers & Businesses', tAr: 'الموردون والشركات المحلية',
    d: 'Organizations interested in supplying or collaborating with our portfolio companies.',
    dAr: 'جهات ترغب في التوريد لشركات محفظتنا أو التعاون معها.' },
  { icon: 'leaf', t: 'Producers & Exporters', tAr: 'المنتجون والمصدّرون',
    d: 'Producers of food, agricultural products, coffee, wheat and other future trading categories.',
    dAr: 'منتجو الأغذية والمنتجات الزراعية والبن والقمح وفئات تجارية أخرى مستقبلاً.' },
  { icon: 'route', t: 'Distributors & Buyers', tAr: 'الموزعون والمشترون',
    d: 'Businesses looking for commercial supply relationships within Qatar or international markets.',
    dAr: 'شركات تبحث عن علاقات توريد تجاري داخل قطر أو في الأسواق الدولية.' },
  { icon: 'partnership', t: 'Business Partners', tAr: 'الشركاء التجاريون',
    d: 'Organizations interested in joint commercial opportunities, new concepts or strategic cooperation.',
    dAr: 'جهات مهتمة بفرص تجارية مشتركة أو مفاهيم جديدة أو تعاون استراتيجي.' },
  { icon: 'spark', t: 'Entrepreneurs', tAr: 'روّاد الأعمال',
    d: 'Operators and founders with businesses or concepts that may complement the future direction of Lusail Corp.',
    dAr: 'مشغّلون ومؤسسون لديهم أعمال أو مفاهيم قد تكمّل اتجاه لوسيل كورب المستقبلي.' }
];

/* Careers page */
const CAREER_VALUES = [
  { t: 'Entrepreneurial Thinking', tAr: 'التفكير الريادي' },
  { t: 'Responsibility', tAr: 'المسؤولية' },
  { t: 'Collaboration', tAr: 'التعاون' },
  { t: 'Customer Focus', tAr: 'التركيز على العميل' },
  { t: 'Problem Solving', tAr: 'حل المشكلات' },
  { t: 'Continuous Development', tAr: 'التطوير المستمر' }
];

/* Set to [] to show the "no current opening" state, which the brief specifies. */
const OPEN_ROLES = [];

/* Flat list of every company, each carrying a back-reference to its sector. */
const ALL_COMPANIES = SECTORS.flatMap(s =>
  s.companies.map(c => Object.assign({}, c, {
    sectorSlug: s.slug, sectorName: s.name, sectorNameAr: s.nameAr,
    photo: c.photo || s.photo,
    photoStyle: c.photoStyle || s.photoStyle || 'none'
  }))
);

module.exports = {
  SITE, SECTORS, ALL_COMPANIES,
  WHAT_WE_DO, VALUE_CREATION, VALUES, GROWTH,
  PARTNER_TYPES, CAREER_VALUES, OPEN_ROLES
};
