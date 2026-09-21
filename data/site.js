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
  domain: 'https://www.lusailcorp.com',

  /* The logo is an asset, not a design ingredient. Nothing in the layout is
     derived from its shape, so swapping these files re-brands the site.
     Paths are relative to site-assets/logo/. */
  brand: {
    /* The full-colour lockup on the paper header and the reversed one on the
       navy footer — the two cuts the brand sheet itself shows. The header sits
       on the warm paper ground rather than pure white, which is kinder to the
       silver C. */
    logoOnLight: 'lusail-corp-horizontal-full-color.svg',
    logoOnDark: 'lusail-corp-horizontal-reversed.svg',
    logoWidth: 564, logoHeight: 142,
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
    email: 'info@lusailcorp.com',
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
    /* Supplied by the client. Swap lifestyle-wide.jpg / -card.jpg to change it. */
    photo: 'lifestyle', photoStyle: 'plate',
    photoCaption: 'Garment care for everyday Qatari life.',
    photoCaptionAr: 'العناية بالملابس في الحياة القطرية اليومية.',
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
        photo: 'lifestyle', photoStyle: 'plate'
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
    slug: 'supply-distribution',
    name: 'Supply & Distribution', nameAr: 'التوريد والتوزيع',
    short: 'Commercial activities connecting producers and products with the Qatar market.',
    shortAr: 'أنشطة تجارية تربط المنتجين والمنتجات بالسوق القطري.',
    headline: 'Connecting Supply With Demand',
    headlineAr: 'نربط العرض بالطلب',
    intro: 'Distribution plays an important role in connecting producers, suppliers, businesses and customers.',
    introAr: 'يؤدي التوزيع دوراً مهماً في الربط بين المنتجين والموردين والشركات والعملاء.',
    body: [
      'The sector currently operates in food. ROMA Commercial supplies fresh fruit and vegetables within Qatar, creating a foundation from which the product range and customer network can continue to develop.'
    ],
    bodyAr: [
      'يعمل القطاع حالياً في مجال الأغذية. تورّد روما التجارية الفواكه والخضار الطازجة داخل قطر، بما يوفّر أساساً تتوسع منه تشكيلة المنتجات وشبكة العملاء.'
    ],
    /* Container ship at berth, from the supplied folder. Swap the file at
       site-assets/img/port-wide.jpg and port-card.jpg to change the picture. */
    photo: 'shipping', photoStyle: 'plate',
    photoCaption: 'Containerised cargo arriving into the Qatar market.',
    photoCaptionAr: 'بضائع بالحاويات تصل إلى السوق القطري.',
    companies: [
      {
        slug: 'roma-commercial',
        name: 'ROMA Commercial', nameAr: 'روما التجارية',
        role: 'Food Import & Distribution', roleAr: 'استيراد وتوزيع الأغذية',
        headline: 'From Global Farms to Qatar\u2019s Market',
        headlineAr: 'من مزارع العالم إلى السوق القطري',
        short: 'Import and distribution of fresh produce, rice and essential foods across the Qatar market.',
        shortAr: 'استيراد وتوزيع المنتجات الطازجة والأرز والأغذية الأساسية في السوق القطري.',
        intro: 'ROMA Commercial connects international producers and suppliers with businesses across Qatar, importing fresh fruit and vegetables, rice and essential food products.',
        introAr: 'تربط روما التجارية المنتجين والموردين الدوليين بالشركات في أنحاء قطر، من خلال استيراد الفواكه والخضار الطازجة والأرز والمنتجات الغذائية الأساسية.',
        body: [
          'Quality food distribution begins long before a product reaches the market. ROMA works across the supply chain: sourcing from suitable producers and international suppliers, coordinating import into Qatar, and distributing according to what the local market requires.',
          'Agricultural products are seasonal, so sourcing has to move with the harvest. Rather than depending on a single origin, the company builds relationships across different growing regions, which lets it shift as seasons end, quality changes or availability tightens.',
          'Fresh produce has a limited commercial life. The operating approach is therefore built around removing delay between source, import and distribution — so products reach supermarkets, hotels, restaurants, caterers and wholesalers in the condition the buyer expects.'
        ],
        bodyAr: [
          'تعمل الشركة في التوريد والإمداد لتلبية احتياجات سوق الأغذية في قطر.',
          'ومن خلال مصادر توريد موثوقة وعلاقات تجارية راسخة، تربط الشركة المنتجات الجيدة باحتياجات الشركات والعملاء في أنحاء قطر.',
          'ومع تطوّر روما التجارية، تهدف الشركة إلى توسيع علاقاتها التجارية وفئات منتجاتها وقدراتها التوريدية.'
        ],
        facts: [
          { k: 'Sector', kAr: 'القطاع', v: 'Supply & Distribution', vAr: 'التوريد والتوزيع' },
          { k: 'Activity', kAr: 'النشاط', v: 'Food import, wholesale and distribution', vAr: 'استيراد الأغذية والبيع بالجملة والتوزيع' },
          { k: 'Market', kAr: 'السوق', v: 'Qatar', vAr: 'قطر' },
          { k: 'Customers', kAr: 'العملاء', v: 'Retail, wholesale, hospitality and food service', vAr: 'التجزئة والجملة والضيافة وخدمات الأغذية' }
        ],
        products: [
          { t: 'Fresh Vegetables', tAr: 'الخضار الطازجة', d: 'A changing selection sourced by season, origin and customer demand — tomatoes, potatoes, onions, peppers, cucumbers and leafy produce among them.', dAr: 'تشكيلة متغيّرة يتم توريدها حسب الموسم والمنشأ وطلب العملاء — من الطماطم والبطاطس والبصل والفلفل والخيار والورقيات.' },
          { t: 'Fresh Fruits', tAr: 'الفواكه الطازجة', d: 'Fruit sourced from international growing regions as seasons allow — apples, citrus, bananas, grapes, melons and stone fruit.', dAr: 'فواكه من مناطق زراعية دولية بحسب المواسم — التفاح والحمضيات والموز والعنب والبطيخ والفواكه ذات النواة.' },
          { t: 'Rice', tAr: 'الأرز', d: 'Basmati, long-grain, parboiled and white rice, sourced by variety, grade and pack size for retail, food service and hospitality.', dAr: 'أرز بسمتي وطويل الحبة ومسلوق وأبيض، حسب الصنف والدرجة وحجم التعبئة للتجزئة وخدمات الأغذية والضيافة.' },
          { t: 'Grains & Pulses', tAr: 'الحبوب والبقوليات', d: 'Lentils, chickpeas, beans, peas and wheat products, adapted to what customers in Qatar require.', dAr: 'العدس والحمص والفاصولياء والبازلاء ومنتجات القمح، بما يتوافق مع احتياجات العملاء في قطر.' },
          { t: 'Dry Food Products', tAr: 'الأغذية الجافة', d: 'Shelf-stable and essential food categories sourced and imported according to commercial demand.', dAr: 'فئات غذائية أساسية وطويلة الصلاحية يتم توريدها واستيرادها حسب الطلب التجاري.' }
        ],
        activities: ['International Sourcing', 'Food Import', 'Wholesale Supply', 'Qatar Distribution', 'Seasonal Sourcing', 'Supplier Development'],
        activitiesAr: ['التوريد الدولي', 'استيراد الأغذية', 'التوريد بالجملة', 'التوزيع في قطر', 'التوريد الموسمي', 'تطوير الموردين'],
        cta: 'Contact ROMA Commercial', ctaAr: 'تواصل مع روما التجارية',
        photo: 'grain', photoStyle: 'plate'
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
        /* Defined here, in its primary sector. It also operates in supply and
           distribution, so it is cross-listed there too. */
        alsoIn: ['supply-distribution'],
        name: 'Lusail Commercial', nameAr: 'لوسيل التجارية',
        role: 'Trading & Logistics', roleAr: 'التجارة والخدمات اللوجستية',
        headline: 'Global Trade. Reliable Logistics. Connected Markets.',
        headlineAr: 'تجارة عالمية. لوجستيات موثوقة. أسواق مترابطة.',
        short: 'Commodity trading and international freight — moving goods by sea, land and air, and sourcing food and industrial commodities.',
        shortAr: 'تجارة السلع والشحن الدولي — نقل البضائع بحراً وبراً وجواً، وتوريد السلع الغذائية والصناعية.',
        intro: 'Lusail Commercial operates where international trade meets logistics, combining commodity sourcing with the freight capability to move it.',
        introAr: 'تعمل لوسيل التجارية عند تقاطع التجارة الدولية مع الخدمات اللوجستية، جامعةً بين توريد السلع والقدرة على نقلها.',
        body: [
          'The business runs on two sides that support each other. Commodity trading sources and moves edible oils, sugar, wheat, coffee and granular sulphur through an international network of producers and suppliers. Logistics coordinates the cargo itself — ocean, road and air freight, vessel chartering, trailers and heavy transport.',
          'Keeping both under one roof is the point. Purchasing and transport are handled as one commercial question rather than two, so an enquiry can be answered with the origin, the specification and the route together.',
          'Sourcing reaches across the Middle East, Europe and the Black Sea, Asia and Central Asia, Africa, the Americas and Australia. Which origin is used depends on the product, the season, quality, availability and the terms of the transaction.'
        ],
        bodyAr: [
          'تركّز الشركة على استيراد وتصدير سلع مختارة، تشمل في البداية البن والقمح.',
          'ومن خلال علاقاتها مع الموردين والشركاء التجاريين، تعمل لوسيل التجارية على تحديد فرص التوريد وبناء قنوات تجارية موثوقة بين الأسواق الدولية والعملاء.'
        ],
        products: [
          { t: 'Ocean Freight', tAr: 'الشحن البحري', d: 'Full and part container loads, bulk, breakbulk and project cargo between Qatar and international ports.', dAr: 'حاويات كاملة وجزئية وبضائع سائبة وعامة وشحنات المشاريع بين قطر والموانئ الدولية.' },
          { t: 'Vessel Chartering', tAr: 'استئجار السفن', d: 'Marine capacity arranged with shipping partners for bulk commodities and large-volume shipments.', dAr: 'تأمين سعة بحرية بالتعاون مع شركاء الشحن للسلع السائبة والشحنات كبيرة الحجم.' },
          { t: 'Land Freight', tAr: 'الشحن البري', d: 'Heavy trucks, flatbed and low-bed trailers and container movement within Qatar and across regional borders.', dAr: 'شاحنات ثقيلة ومقطورات مسطحة ومنخفضة ونقل الحاويات داخل قطر وعبر الحدود الإقليمية.' },
          { t: 'Air Freight', tAr: 'الشحن الجوي', d: 'For urgent, high-value or time-sensitive cargo between Qatar and major international markets.', dAr: 'للشحنات العاجلة أو عالية القيمة أو الحساسة للوقت بين قطر والأسواق الدولية الرئيسية.' },
          { t: 'Food & Agricultural Commodities', tAr: 'السلع الغذائية والزراعية', d: 'Edible oils, sugar, wheat and grains, and coffee, sourced by specification, origin and season.', dAr: 'الزيوت الصالحة للأكل والسكر والقمح والحبوب والبن، حسب المواصفات والمنشأ والموسم.' },
          { t: 'Industrial Commodities', tAr: 'السلع الصناعية', d: 'Granular solid sulphur in bulk for industrial and commercial applications, with the shipping arranged alongside.', dAr: 'الكبريت الصلب المحبب السائب للاستخدامات الصناعية والتجارية، مع تنسيق الشحن معه.' }
        ],
        activities: ['Ocean Freight', 'Land Freight', 'Air Freight', 'Vessel Chartering', 'Multimodal Logistics', 'Commodity Trading', 'Import & Export', 'Global Sourcing'],
        activitiesAr: ['الشحن البحري', 'الشحن البري', 'الشحن الجوي', 'استئجار السفن', 'النقل متعدد الوسائط', 'تجارة السلع', 'الاستيراد والتصدير', 'التوريد العالمي'],
        facts: [
          { k: 'Sector', kAr: 'القطاع', v: 'Trading, Supply & Distribution', vAr: 'التجارة والتوريد والتوزيع' },
          { k: 'Activity', kAr: 'النشاط', v: 'Commodity trading and international freight', vAr: 'تجارة السلع والشحن الدولي' },
          { k: 'Market', kAr: 'السوق', v: 'Qatar, the GCC and international', vAr: 'قطر ودول الخليج والأسواق الدولية' },
          { k: 'Transport', kAr: 'النقل', v: 'Sea, land, air and multimodal', vAr: 'بحراً وبراً وجواً ومتعدد الوسائط' }
        ],
        cta: 'Partner With Lusail Commercial', ctaAr: 'كن شريكاً للوسيل التجارية',
        photo: 'shipping', photoStyle: 'plate'
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
  { icon: 'spark',       t: 'Entrepreneurial Thinking', tAr: 'التفكير الريادي' },
  { icon: 'shield',      t: 'Responsibility', tAr: 'المسؤولية' },
  { icon: 'partnership', t: 'Collaboration', tAr: 'التعاون' },
  { icon: 'target',      t: 'Customer Focus', tAr: 'التركيز على العميل' },
  { icon: 'solve',       t: 'Problem Solving', tAr: 'حل المشكلات' },
  { icon: 'cycle',       t: 'Continuous Development', tAr: 'التطوير المستمر' }
];

/* Set to [] to show the "no current opening" state, which the brief specifies. */
const OPEN_ROLES = [];

/* Flat list of every company, each carrying a back-reference to the sector it
   is defined in. A company appears here exactly once, however many sectors it
   is listed under. */
const ALL_COMPANIES = SECTORS.flatMap(s =>
  s.companies.map(c => Object.assign({}, c, {
    sectorSlug: s.slug, sectorName: s.name, sectorNameAr: s.nameAr,
    sectors: [s.slug].concat(c.alsoIn || []),
    photo: c.photo || s.photo,
    photoStyle: c.photoStyle || s.photoStyle || 'none'
  }))
);

/* Now add the cross-listed companies to the other sectors they work in. This
   runs after ALL_COMPANIES is built, so nothing is counted twice. */
SECTORS.forEach(s => {
  const extra = ALL_COMPANIES.filter(c => (c.alsoIn || []).includes(s.slug));
  if (extra.length) s.companies = s.companies.concat(extra);
});

module.exports = {
  SITE, SECTORS, ALL_COMPANIES,
  WHAT_WE_DO, VALUE_CREATION, VALUES, GROWTH,
  PARTNER_TYPES, CAREER_VALUES, OPEN_ROLES
};
