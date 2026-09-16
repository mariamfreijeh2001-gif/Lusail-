/* ==========================================================================
   Lusail Corp — all site content.

   STRUCTURE: two tiers, sector -> companies.
   A sector holds any number of companies. One is fine; six is fine. This is
   the same model Gulf conglomerates use (Al Shirawi runs 17 sectors over 50+
   companies), and it is what lets "Food" hold two separate businesses without
   the site pretending they are one.

       /sectors/food/              the sector, and the companies in it
       /companies/                 every company, filterable by sector
       /companies/lusail-foods/    one company

   PLACEHOLDER WARNING
   Company names are invented and marked `provisional: true`. The sectors were
   read off the photography in /Assests — grain, green coffee, rigs, cranes,
   container terminals, warehouses — not off confirmed information. Replace
   the names and the site updates everywhere.
   ========================================================================== */

const SITE = {
  name: 'Lusail Corp',
  nameAr: 'لوسيل كورب',
  domain: 'https://lusailcorp.qa',

  contact: {
    office: 'Lusail Tower, Floor 22, Lusail, Qatar',
    officeAr: 'برج لوسيل، الطابق ٢٢، لوسيل، قطر',
    phone: '+974 4000 0000',
    email: 'info@lusailcorp.qa',
    careersEmail: 'careers@lusailcorp.qa'
  },

  nav: [
    { href: '/about/',     label: 'About',         labelAr: 'من نحن' },
    { href: '/sectors/',   label: 'What we do',    labelAr: 'ما نقوم به', mega: true },
    { href: '/companies/', label: 'Our companies', labelAr: 'شركاتنا' },
    { href: '/careers/',   label: 'Careers',       labelAr: 'الوظائف' },
    { href: '/contact/',   label: 'Contact',       labelAr: 'تواصل معنا' }
  ]
};

/* --------------------------------------------------------------------------
   SECTORS

   slug        URL segment -> /sectors/<slug>/
   name        the sector, in plain words
   photo       base name in /assets/img (needs -hero.jpg and -card.jpg)
   short       one line — used on the home rail and the sector cards
   intro       opening paragraph on the sector page
   body[]      further paragraphs on the sector page
   companies[] one or more operating companies

   COMPANY
   slug        URL segment -> /companies/<slug>/
   name        registered name          <-- REPLACE
   role        what this company is, when a sector holds more than one
   short       one line for cards and the index
   intro       opening paragraph on its own page
   body[]      further paragraphs
   caps[]      what it actually handles
   figs[]      headline figures, e.g. { v:'14', l:'countries we source from' }
               leave empty and the block does not render
   photo       optional; falls back to the sector's photo
   -------------------------------------------------------------------------- */

const SECTORS = [
  {
    slug: 'food',
    photo: 'food', photoStyle: 'still',
    photoCaption: 'Rice, pulses and grain — the staples the two food companies buy, pack and move.',
    photoCaptionAr: 'الأرز والبقوليات والحبوب — المواد الأساسية التي تشتريها شركتا الأغذية وتعبئانها وتنقلانها.',
    name: 'Food', nameAr: 'الأغذية',
    short: 'Staple foods brought into Qatar in bulk, and turned into packed goods for the shelf.',
    shortAr: 'المواد الغذائية الأساسية تُجلب إلى قطر بالجملة، وتُحوَّل إلى منتجات معبأة للرفوف.',
    intro: 'Two companies sit in food, and they do genuinely different jobs: one buys the raw commodity abroad and lands it in Qatar, the other packs and distributes it under its own brands.',
    introAr: 'شركتان تعملان في قطاع الأغذية، ومهمتاهما مختلفتان فعلاً: الأولى تشتري السلعة الخام من الخارج وتُدخلها إلى قطر، والثانية تعبئها وتوزّعها بعلاماتها التجارية.',
    body: [
      'Keeping them separate is deliberate. Trading is a margin business measured in cents per tonne and moves on world prices; packing and branding is a consumer business measured in shelf space and repeat purchase. They reward different instincts and need different managers.',
      'What they share is a supply chain. The trading company\'s cargo is the packing company\'s raw material, which is why both sit under the same owner rather than negotiating with each other at arm\'s length.'
    ],
    bodyAr: [
      'الفصل بينهما مقصود. التجارة نشاط هامشه يُقاس بالسنتات للطن ويتحرك مع الأسعار العالمية؛ أما التعبئة والعلامات التجارية فنشاط استهلاكي يُقاس بمساحة الرف وتكرار الشراء. كل منهما يكافئ غرائز مختلفة ويحتاج إدارة مختلفة.',
      'ما يجمعهما هو سلسلة التوريد: شحنة الشركة التجارية هي المادة الخام لشركة التعبئة، ولهذا تقعان تحت مالك واحد بدل التفاوض بينهما كطرفين مستقلين.'
    ],
    companies: [
      {
        slug: 'lusail-foods', provisional: true,
        name: 'Lusail Foods', nameAr: 'لوسيل للأغذية',
        role: 'Packing and distribution', roleAr: 'التعبئة والتوزيع',
        photo: 'rice', photoStyle: 'still',
        short: 'Packs rice, pulses and grain under its own brands and puts them on Qatari shelves.',
        shortAr: 'تعبئ الأرز والبقوليات والحبوب بعلاماتها الخاصة وتضعها على الرفوف القطرية.',
        intro: 'Takes bulk grain and pulses, packs them under its own brands, and sells them to retailers, wholesalers and caterers across Qatar.',
        introAr: 'تأخذ الحبوب والبقوليات السائبة وتعبئها تحت علاماتها التجارية، وتبيعها لتجار التجزئة والجملة وشركات التموين في أنحاء قطر.',
        body: [
          'A consumer business: the product is the same commodity the trading arm buys, but the customer is choosing between bags on a shelf rather than negotiating a tonnage.',
          'That makes packaging, consistency and availability the whole job. A shopper who finds the bag empty once buys the competitor next week.'
        ],
        bodyAr: [
          'نشاط استهلاكي: المنتج هو السلعة نفسها التي تشتريها الذراع التجارية، لكن العميل هنا يختار بين أكياس على رف لا يتفاوض على حمولة.',
          'ولهذا فإن التغليف والثبات والتوافر هي المهمة كلها. المتسوق الذي يجد الكيس ناقصاً مرة واحدة يشتري من المنافس في الأسبوع التالي.'
        ],
        caps: [
          { t: 'Packing and grading', d: 'Cleaning, grading and bagging into retail and catering sizes.' },
          { t: 'Own brands', d: 'Products sold under the company\'s own labels.' },
          { t: 'Retail distribution', d: 'Supply to supermarkets, groceries and wholesalers.' },
          { t: 'Catering supply', d: 'Bulk sizes for hotels, caterers and institutional kitchens.' }
        ],
        capsAr: [
          { t: 'التعبئة والتصنيف', d: 'التنظيف والتصنيف والتعبئة بأحجام التجزئة والتموين.' },
          { t: 'العلامات الخاصة', d: 'منتجات تُباع تحت علامات الشركة نفسها.' },
          { t: 'التوزيع للتجزئة', d: 'التوريد للأسواق والبقالات وتجار الجملة.' },
          { t: 'توريد التموين', d: 'أحجام كبيرة للفنادق وشركات التموين والمطابخ المؤسسية.' }
        ],
        figs: []
      },
      {
        slug: 'lusail-commodities', provisional: true,
        name: 'Lusail Commodities', nameAr: 'لوسيل للسلع',
        role: 'Commodity trading', roleAr: 'تجارة السلع',
        photo: 'grain', photoStyle: 'still',
        short: 'Buys rice, pulses, sesame and sugar at origin and lands them in the Gulf in bulk.',
        shortAr: 'تشتري الأرز والبقوليات والسمسم والسكر من المصدر وتُدخلها إلى الخليج بالجملة.',
        intro: 'Contracts agricultural commodities directly with producers and exporters abroad, and moves them into Qatar and the wider Gulf in bulk.',
        introAr: 'تتعاقد على السلع الزراعية مباشرة مع المنتجين والمصدّرين في الخارج، وتنقلها إلى قطر والخليج بالجملة.',
        body: [
          'Buying at origin rather than through an intermediary is what makes the margin work. It also means the company carries the quality question itself: every lot is specified, sampled and inspected before it ships.',
          'This company sits furthest upstream in the group. What it buys, the shipping company moves, the distribution company stores, and the food company packs.'
        ],
        bodyAr: [
          'الشراء من المصدر بدل الوسيط هو ما يجعل الهامش ممكناً، ويعني أن الشركة تتحمل مسؤولية الجودة بنفسها: كل شحنة تُحدَّد مواصفاتها وتُؤخذ عيناتها وتُفحص قبل الشحن.',
          'هذه الشركة في أول سلسلة المجموعة: ما تشتريه تنقله شركة الشحن وتخزّنه شركة التوزيع وتعبئه شركة الأغذية.'
        ],
        caps: [
          { t: 'Sourcing at origin', d: 'Direct contracts with producers and exporters in the growing regions.' },
          { t: 'Quality and inspection', d: 'Specification, sampling and third-party inspection before a lot ships.' },
          { t: 'Bulk and bagged cargo', d: 'Bulk vessel loads or bagged consignments, depending on the buyer.' },
          { t: 'Group procurement', d: 'Buying for the rest of the group, which lowers the price every company pays.' }
        ],
        capsAr: [
          { t: 'التوريد من المصدر', d: 'تعاقد مباشر مع المنتجين والمصدّرين في مناطق الإنتاج.' },
          { t: 'الجودة والفحص', d: 'تحديد المواصفات وأخذ العينات والفحص من طرف ثالث قبل الشحن.' },
          { t: 'الشحن السائب والمعبأ', d: 'حمولات سفن سائبة أو شحنات معبأة بحسب المشتري.' },
          { t: 'مشتريات المجموعة', d: 'الشراء لبقية شركات المجموعة، ما يخفض السعر على الجميع.' }
        ],
        figs: []
      }
    ]
  },

  {
    slug: 'coffee',
    photo: 'coffee', photoStyle: 'still',
    photoCaption: 'Green coffee, unroasted — graded on origin, altitude, screen size and cup score.',
    photoCaptionAr: 'البن الأخضر غير المحمّص — يُصنّف حسب المنشأ والارتفاع وحجم الحبة ودرجة التذوق.',
    name: 'Coffee', nameAr: 'البن',
    short: 'Green coffee bought at origin, graded and traded — the raw bean, before the roast.',
    shortAr: 'البن الأخضر من مصادره، يُصنّف ويُتاجر به — الحبة الخام قبل التحميص.',
    intro: 'Green coffee: unroasted, still a raw agricultural product, bought at origin and sold on to roasters and wholesalers.',
    introAr: 'البن الأخضر غير المحمّص، وهو لا يزال منتجاً زراعياً خاماً، يُشترى من مصادره ويُباع للمحامص وتجار الجملة.',
    body: [
      'Green coffee has a grading language of its own — origin, altitude, screen size, defect count, cup score — and is bought against those terms rather than against a brand.',
      'Because the bean is sold unroasted, the customer is a roastery or a wholesaler, not a café. That keeps the business in the same trading discipline as the rest of the group.'
    ],
    bodyAr: [
      'للبن الأخضر لغة تصنيف خاصة: المنشأ والارتفاع وحجم الحبة وعدد العيوب ودرجة التذوق، ويُشترى وفق هذه المعايير لا وفق العلامة التجارية.',
      'ولأن الحبة تُباع غير محمّصة، فالعميل محمصة أو تاجر جملة لا مقهى، ما يبقي النشاط ضمن الانضباط التجاري نفسه لبقية المجموعة.'
    ],
    companies: [
      {
        slug: 'lusail-coffee', provisional: true,
        name: 'Lusail Coffee', nameAr: 'لوسيل للبن',
        role: 'Green coffee trading', roleAr: 'تجارة البن الأخضر',
        photo: 'coffee', photoStyle: 'still',
        short: 'Green coffee contracted at origin, graded, and supplied to roasters across the Gulf.',
        shortAr: 'بن أخضر يُتعاقد عليه من المنشأ ويُصنّف ويُورَّد للمحامص في أنحاء الخليج.',
        intro: 'Buys green coffee at origin, grades and stores it, and supplies roasteries and wholesalers across the Gulf.',
        introAr: 'تشتري البن الأخضر من المنشأ وتصنّفه وتخزّنه، وتورّده للمحامص وتجار الجملة في أنحاء الخليج.',
        body: [
          'Lots are contracted directly with exporters in the producing countries, then graded and cupped on arrival so the buyer knows exactly what they are getting.',
          'Conditioned storage matters more than it sounds: green coffee loses value quickly in heat and humidity, which in this climate is the whole problem to solve.'
        ],
        bodyAr: [
          'يُتعاقد على الشحنات مباشرة مع المصدّرين في الدول المنتجة، ثم تُصنّف وتُذاق عند الوصول ليعرف المشتري تماماً ما يحصل عليه.',
          'التخزين المكيّف أهم مما يبدو: البن الأخضر يفقد قيمته سريعاً في الحرارة والرطوبة، وهذه هي المشكلة الأساسية في هذا المناخ.'
        ],
        caps: [
          { t: 'Origin buying', d: 'Lots contracted directly with exporters in the producing countries.' },
          { t: 'Grading and cupping', d: 'Screen size, defect count and cup score recorded for every lot.' },
          { t: 'Conditioned storage', d: 'Temperature and humidity controlled storage between landing and sale.' },
          { t: 'Supply to roasters', d: 'Sold on to roasteries and wholesalers across the Gulf.' }
        ],
        capsAr: [
          { t: 'الشراء من المنشأ', d: 'تعاقد مباشر مع المصدّرين في الدول المنتجة.' },
          { t: 'التصنيف والتذوق', d: 'تسجيل حجم الحبة وعدد العيوب ودرجة التذوق لكل شحنة.' },
          { t: 'التخزين المكيّف', d: 'تخزين بدرجة حرارة ورطوبة مضبوطتين بين الوصول والبيع.' },
          { t: 'التوريد للمحامص', d: 'البيع للمحامص وتجار الجملة في أنحاء الخليج.' }
        ],
        figs: []
      }
    ]
  },

  {
    slug: 'energy',
    photo: 'energy', photoStyle: 'plate',
    photoCaption: 'Processing plant, Mesaieed industrial area.',
    photoCaptionAr: 'منشأة معالجة، منطقة مسيعيد الصناعية.',
    name: 'Energy', nameAr: 'الطاقة',
    short: 'Oil and gas field services, supply and support across Qatar.',
    shortAr: 'خدمات حقول النفط والغاز والتوريد والدعم في أنحاء قطر.',
    intro: 'Services and supply to the oil and gas industry — the work that keeps installations running rather than the extraction itself.',
    introAr: 'خدمات وتوريد لقطاع النفط والغاز: الأعمال التي تبقي المنشآت تعمل، لا الاستخراج نفسه.',
    body: [
      'This is the group\'s most regulated area. Certification, safety record and audit history decide who is allowed onto a site at all, which is where the group\'s governance standard earns its place.'
    ],
    bodyAr: [
      'هذا أكثر مجالات المجموعة خضوعاً للتنظيم. الشهادات وسجل السلامة وتاريخ التدقيق هي ما يحدد من يُسمح له بدخول الموقع أصلاً، وهنا تثبت معايير حوكمة المجموعة جدواها.'
    ],
    companies: [
      {
        slug: 'lusail-energy', provisional: true,
        name: 'Lusail Energy', nameAr: 'لوسيل للطاقة',
        role: 'Field services and supply', roleAr: 'الخدمات الميدانية والتوريد',
        photo: 'energy', photoStyle: 'plate',
        short: 'On-site services, equipment supply and certified crews for operators and their contractors.',
        shortAr: 'خدمات في الموقع وتوريد معدات وفرق معتمدة للمشغّلين ومقاوليهم.',
        intro: 'Field services, equipment supply, maintenance support and certified manpower for operators and the larger contractors working on their behalf.',
        introAr: 'خدمات ميدانية وتوريد معدات ودعم الصيانة وكوادر معتمدة للمشغّلين والمقاولين الكبار العاملين لحسابهم.',
        body: [
          'The work is unglamorous and exacting: the right part, certified, on site, on the day it was promised.',
          'Operators audit their suppliers hard. Passing those audits repeatedly is the actual product.'
        ],
        bodyAr: [
          'العمل غير لامع ودقيق: القطعة الصحيحة، معتمدة، في الموقع، في اليوم الموعود.',
          'المشغّلون يدققون على مورّديهم بصرامة، واجتياز هذا التدقيق مراراً هو المنتج الحقيقي.'
        ],
        caps: [
          { t: 'Field services', d: 'On-site support to operators and their contractors.' },
          { t: 'Equipment supply', d: 'Sourcing and supplying specified equipment and spares.' },
          { t: 'Maintenance support', d: 'Scheduled and call-out maintenance on installed plant.' },
          { t: 'Certified manpower', d: 'Crews carrying the certification the operators require.' }
        ],
        capsAr: [
          { t: 'الخدمات الميدانية', d: 'دعم في الموقع للمشغّلين ومقاوليهم.' },
          { t: 'توريد المعدات', d: 'توفير وتوريد المعدات وقطع الغيار وفق المواصفات.' },
          { t: 'دعم الصيانة', d: 'صيانة دورية وطارئة للمنشآت القائمة.' },
          { t: 'كوادر معتمدة', d: 'فرق تحمل الشهادات التي يشترطها المشغّلون.' }
        ],
        figs: []
      }
    ]
  },

  {
    slug: 'contracting',
    photo: 'contracting', photoStyle: 'plate',
    photoCaption: 'Structural works in progress on a residential scheme.',
    photoCaptionAr: 'أعمال إنشائية جارية في مشروع سكني.',
    name: 'Contracting', nameAr: 'المقاولات',
    short: 'Building and infrastructure work, from site engineering through to handover.',
    shortAr: 'أعمال البناء والبنية التحتية، من هندسة الموقع حتى التسليم.',
    intro: 'Residential, commercial and infrastructure construction, carried from site engineering and procurement through to handover.',
    introAr: 'إنشاءات سكنية وتجارية وبنية تحتية، من هندسة الموقع والمشتريات وحتى التسليم.',
    body: [
      'Construction is where the group\'s capital matters most directly. Retention, long payment cycles and plant purchases all need a balance sheet behind them, and that is what a holding structure provides.'
    ],
    bodyAr: [
      'المقاولات هي المجال الذي يظهر فيه رأس مال المجموعة بأوضح صورة: المحتجزات ودورات الدفع الطويلة وشراء المعدات تحتاج جميعها إلى ميزانية قوية خلفها، وهذا ما يوفره الكيان القابض.'
    ],
    companies: [
      {
        slug: 'lusail-contracting', provisional: true,
        name: 'Lusail Contracting', nameAr: 'لوسيل للمقاولات',
        role: 'Main contracting', roleAr: 'المقاولات الرئيسية',
        photo: 'contracting', photoStyle: 'plate',
        short: 'Main contractor on building and infrastructure packages, and specialist subcontractor on larger schemes.',
        shortAr: 'مقاول رئيسي لحزم المباني والبنية التحتية، ومقاول متخصص في المشاريع الكبرى.',
        intro: 'Works as a main contractor on building and infrastructure packages, and as a specialist subcontractor for structure and finishing on larger schemes.',
        introAr: 'تعمل مقاولاً رئيسياً لحزم المباني والبنية التحتية، ومقاولاً متخصصاً للهيكل والتشطيبات في المشاريع الكبرى.',
        body: [
          'Delivery is the promise: the programme, the quality and the handover date, held together by the site engineering team.',
          'Materials and plant are bought through the group\'s own trading arm, which is a real cost advantage on a long job.'
        ],
        bodyAr: [
          'التسليم هو الوعد: البرنامج الزمني والجودة وتاريخ التسليم، يجمعها فريق هندسة الموقع.',
          'تُشترى المواد والمعدات عبر الذراع التجارية للمجموعة، وهي ميزة تكلفة حقيقية في المشاريع الطويلة.'
        ],
        caps: [
          { t: 'Main contracting', d: 'Full delivery of building and infrastructure packages.' },
          { t: 'Structure and finishing', d: 'Concrete frame, envelope, fit-out and MEP coordination.' },
          { t: 'Site engineering', d: 'Setting out, quality control and programme management on site.' },
          { t: 'Procurement', d: 'Materials and plant bought through the group\'s trading arm.' }
        ],
        capsAr: [
          { t: 'المقاولات الرئيسية', d: 'تنفيذ كامل لحزم المباني والبنية التحتية.' },
          { t: 'الهيكل والتشطيبات', d: 'الهيكل الخرساني والواجهات والتشطيبات والأعمال الكهروميكانيكية.' },
          { t: 'هندسة الموقع', d: 'التخطيط ومراقبة الجودة وإدارة البرنامج الزمني في الموقع.' },
          { t: 'المشتريات', d: 'شراء المواد والمعدات عبر الذراع التجارية للمجموعة.' }
        ],
        figs: []
      }
    ]
  },

  {
    slug: 'logistics',
    photo: 'port', photoStyle: 'plate',
    photoCaption: 'Container operations at the terminal the group ships through.',
    photoCaptionAr: 'عمليات الحاويات في المحطة التي تشحن المجموعة عبرها.',
    name: 'Shipping and logistics', nameAr: 'الشحن والخدمات اللوجستية',
    short: 'Moving cargo from the vessel to the warehouse to the buyer, without leaving the group.',
    shortAr: 'نقل البضائع من السفينة إلى المستودع إلى المشتري، دون مغادرة المجموعة.',
    intro: 'Two companies cover the chain between a lot bought abroad and a pallet arriving at a customer: one handles the sea and the port, the other the warehouse and the road.',
    introAr: 'شركتان تغطيان السلسلة بين شحنة تُشترى في الخارج وطبلية تصل إلى العميل: الأولى تتولى البحر والميناء، والثانية المستودع والطريق.',
    body: [
      'Splitting them follows the real break in the work. Chartering and customs is a documents-and-timing business; warehousing and delivery is a fleet-and-stock business.',
      'Handling the group\'s own volume gives both a base load. Third-party cargo is what makes the capacity pay.'
    ],
    bodyAr: [
      'الفصل بينهما يتبع الانقسام الحقيقي في العمل: الاستئجار والتخليص نشاط مستندات وتوقيت، والتخزين والتوصيل نشاط أسطول ومخزون.',
      'مناولة أحجام المجموعة تمنح الاثنتين حملاً أساسياً، وبضائع الغير هي ما يجعل الطاقة الاستيعابية مربحة.'
    ],
    companies: [
      {
        slug: 'lusail-shipping', provisional: true,
        name: 'Lusail Shipping', nameAr: 'لوسيل للشحن',
        role: 'Freight and clearance', roleAr: 'الشحن والتخليص',
        photo: 'port', photoStyle: 'plate',
        short: 'Chartering, freight forwarding, customs clearance and port handling.',
        shortAr: 'الاستئجار والشحن والتخليص الجمركي والمناولة في الميناء.',
        intro: 'Books the vessel, moves the cargo and clears it through Qatari customs — the sea half of the chain.',
        introAr: 'تحجز السفينة وتنقل البضاعة وتخلّصها عبر الجمارك القطرية: النصف البحري من السلسلة.',
        body: [
          'Chartering, forwarding, clearance and port handling. The work is documents and timing: a container held at the port is a cost that grows daily.'
        ],
        bodyAr: [
          'الاستئجار والشحن والتخليص والمناولة في الميناء. العمل مستندات وتوقيت: الحاوية المحتجزة في الميناء تكلفة تكبر يومياً.'
        ],
        caps: [
          { t: 'Chartering', d: 'Booking vessel space for bulk and containerised cargo.' },
          { t: 'Freight forwarding', d: 'Door-to-door movement, documentation included.' },
          { t: 'Customs clearance', d: 'Clearing consignments through Qatari customs.' },
          { t: 'Port handling', d: 'Discharge, storage and onward release at the terminal.' }
        ],
        capsAr: [
          { t: 'الاستئجار', d: 'حجز مساحات السفن للبضائع السائبة والحاويات.' },
          { t: 'الشحن والتخليص', d: 'النقل من الباب إلى الباب مع كامل المستندات.' },
          { t: 'التخليص الجمركي', d: 'تخليص الشحنات عبر الجمارك القطرية.' },
          { t: 'المناولة في الميناء', d: 'التفريغ والتخزين والإفراج في المحطة.' }
        ],
        figs: []
      },
      {
        slug: 'lusail-distribution', provisional: true,
        name: 'Lusail Distribution', nameAr: 'لوسيل للتوزيع',
        role: 'Warehousing and delivery', roleAr: 'التخزين والتوصيل',
        photo: 'warehouse', photoStyle: 'plate',
        short: 'Warehousing, order fulfilment and fleet delivery across Qatar.',
        shortAr: 'التخزين وتجهيز الطلبات والتوصيل بالأسطول في أنحاء قطر.',
        intro: 'Stores landed goods and delivers them to wholesalers, retailers and institutional buyers — the land half of the chain.',
        introAr: 'تخزّن البضائع الواصلة وتوصّلها لتجار الجملة والتجزئة والمشترين المؤسسيين: النصف البري من السلسلة.',
        body: [
          'Warehousing, picking, fleet delivery and stock management, for the group\'s own goods and for third parties using the same space.',
          'This company closes the loop. A lot bought abroad, shipped, stored here and delivered reaches the buyer without the group ever handing the cargo to an outside party.'
        ],
        bodyAr: [
          'التخزين وتجهيز الطلبات والتوصيل بالأسطول وإدارة المخزون، لبضائع المجموعة ولعملاء الغير في المساحة نفسها.',
          'هذه الشركة تغلق الدائرة: شحنة تُشترى في الخارج وتُشحن وتُخزَّن هنا وتُسلَّم تصل إلى المشتري دون أن تسلّم المجموعة البضاعة لطرف خارجي في أي مرحلة.'
        ],
        caps: [
          { t: 'Warehousing', d: 'Ambient and conditioned storage for landed goods.' },
          { t: 'Order fulfilment', d: 'Picking, packing and consolidation to order.' },
          { t: 'Fleet delivery', d: 'Scheduled delivery across Qatar on the company\'s own fleet.' },
          { t: 'Stock management', d: 'Live stock positions for the group and for third-party clients.' }
        ],
        capsAr: [
          { t: 'التخزين', d: 'تخزين عادي ومكيّف للبضائع الواصلة.' },
          { t: 'تجهيز الطلبات', d: 'التجميع والتعبئة والتوحيد حسب الطلب.' },
          { t: 'التوصيل بالأسطول', d: 'توصيل مجدول في أنحاء قطر بأسطول الشركة.' },
          { t: 'إدارة المخزون', d: 'أرصدة مخزون لحظية للمجموعة ولعملاء الغير.' }
        ],
        figs: []
      }
    ]
  }
];

/* --------------------------------------------------------------------------
   What the group provides its companies. Shown on home and About.
   -------------------------------------------------------------------------- */

const PILLARS = [
  { t: 'Long-term capital', tAr: 'رأس مال طويل الأجل',
    d: 'Funding for expansion, equipment and working capital, planned in years rather than quarters.',
    dAr: 'تمويل للتوسع والمعدات ورأس المال العامل، بخطط تمتد لسنوات لا لأرباع.' },
  { t: 'Governance', tAr: 'الحوكمة',
    d: 'Boards, financial reporting and internal controls held to one standard across every company.',
    dAr: 'مجالس إدارة وتقارير مالية ورقابة داخلية بمعيار واحد في جميع الشركات.' },
  { t: 'Shared services', tAr: 'الخدمات المشتركة',
    d: 'Procurement, logistics, finance and IT run once for the group instead of company by company.',
    dAr: 'المشتريات واللوجستيات والمالية وتقنية المعلومات تُدار مرة واحدة للمجموعة بدل كل شركة على حدة.' },
  { t: 'People', tAr: 'الكفاءات',
    d: 'Developing Qatari talent and moving people between companies to build future leaders.',
    dAr: 'تطوير الكوادر القطرية وتنقّل المواهب بين الشركات لبناء قادة المستقبل.' }
];


/* --------------------------------------------------------------------------
   Values. Written to be specific to how this group actually trades rather
   than generic corporate virtues — replace the wording, keep the specificity.
   -------------------------------------------------------------------------- */

const VALUES = [
  {
    t: 'Our word holds', tAr: 'كلمتنا مُلزِمة',
    d: 'A price agreed on the phone is a price honoured on the invoice, including when the market moves against us before the vessel sails.',
    dAr: 'السعر المتفق عليه هاتفياً هو السعر في الفاتورة، حتى لو تحرك السوق ضدنا قبل أن تُبحر السفينة.'
  },
  {
    t: 'We own, we do not flip', tAr: 'نمتلك ولا نتاجر بالملكية',
    d: 'The group buys businesses to hold them. That is why capital here is planned over years, and why a bad quarter is not a reason to sell a good company.',
    dAr: 'تشتري المجموعة الشركات لتحتفظ بها. لذلك يُخطَّط رأس المال هنا لسنوات، ولا يكون ربع سيء سبباً لبيع شركة جيدة.'
  },
  {
    t: 'One standard, every company', tAr: 'معيار واحد لكل الشركات',
    d: 'The same reporting, the same controls and the same safety rules apply whether a company has forty people or four hundred.',
    dAr: 'التقارير نفسها والرقابة نفسها وقواعد السلامة نفسها، سواء كانت الشركة بأربعين موظفاً أو بأربعمئة.'
  },
  {
    t: 'Built in Qatar', tAr: 'نُبنى في قطر',
    d: 'We develop Qatari talent first and move people between companies, because the group is only as durable as the people who will run it next.',
    dAr: 'نطوّر الكوادر القطرية أولاً وننقل الناس بين الشركات، لأن المجموعة لا تدوم إلا بقدر من سيديرونها بعدنا.'
  }
];

/* --------------------------------------------------------------------------
   Careers. Set OPEN_ROLES = [] for the "no current openings" state.
   `co` should match a company name above.
   -------------------------------------------------------------------------- */

const OPEN_ROLES = [
  { t: 'Commodity trader — grains and pulses', co: 'Lusail Commodities', loc: 'Lusail', type: 'Full time' },
  { t: 'Brand manager', co: 'Lusail Foods', loc: 'Lusail', type: 'Full time' },
  { t: 'Site engineer', co: 'Lusail Contracting', loc: 'Doha', type: 'Full time' },
  { t: 'Customs clearance officer', co: 'Lusail Shipping', loc: 'Hamad Port', type: 'Full time' },
  { t: 'Warehouse supervisor', co: 'Lusail Distribution', loc: 'Birkat Al Awamer', type: 'Full time' },
  { t: 'Group financial accountant', co: 'Lusail Corp', loc: 'Lusail', type: 'Full time' }
];

/* Flat list of every company, each carrying a back-reference to its sector.
   Built here so pages never have to re-derive it. */
const ALL_COMPANIES = SECTORS.flatMap(s =>
  s.companies.map(c => Object.assign({}, c, {
    sectorSlug: s.slug, sectorName: s.name, sectorNameAr: s.nameAr,
    photo: c.photo || s.photo,
    photoStyle: c.photoStyle || s.photoStyle || 'plate'
  }))
);

module.exports = { SITE, SECTORS, ALL_COMPANIES, PILLARS, VALUES, OPEN_ROLES };
