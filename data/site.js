/* ==========================================================================
   Lusail Corp — all site content.

   This is the only file to edit for wording. Change a company's name here and
   it updates its own page, the home rail, the companies index, the footer and
   every sibling link at once.

   PLACEHOLDER WARNING
   The six companies below are read off the photography in /Assests, not off
   confirmed information: the folder is full of grain, green coffee, rigs,
   cranes, container terminals and warehouses, and contains no café or laundry
   imagery at all. Names marked `nameProvisional: true` are invented and must
   be replaced with the real ones.
   ========================================================================== */

const SITE = {
  name: 'Lusail Corp',
  nameAr: 'لوسيل كورب',
  tagline: 'Holding Company',
  taglineAr: 'شركة قابضة',
  domain: 'https://lusailcorp.qa',

  contact: {
    office: 'Lusail Tower, Floor 22, Lusail, Qatar',
    officeAr: 'برج لوسيل، الطابق ٢٢، لوسيل، قطر',
    phone: '+974 4000 0000',
    email: 'info@lusailcorp.qa',
    careersEmail: 'careers@lusailcorp.qa'
  },

  // Top-level navigation. News was removed at the client's request.
  nav: [
    { href: '/about/',     label: 'About',         labelAr: 'من نحن' },
    { href: '/companies/', label: 'Our companies', labelAr: 'شركاتنا' },
    { href: '/careers/',   label: 'Careers',       labelAr: 'الوظائف' },
    { href: '/contact/',   label: 'Contact',       labelAr: 'تواصل معنا' }
  ]
};

/* --------------------------------------------------------------------------
   The operating companies.

   slug     URL segment -> /companies/<slug>/
   sector   what the business does, in plain words
   company  the operating company's registered name   <-- REPLACE THESE
   short    one line, used on the home rail and cards
   intro    the opening paragraph on its own page
   body     further paragraphs on its own page
   caps     what it actually does, as a numbered list
   figs     headline figures. Leave the array empty until the real ones exist.
   photo    base name in /assets/img (expects -hero.jpg and -card.jpg)
   -------------------------------------------------------------------------- */

const COMPANIES = [
  {
    slug: 'trading',
    photo: 'trading',
    nameProvisional: true,
    sector: 'Commodity trading',
    sectorAr: 'تجارة السلع',
    company: 'Lusail Trading',
    companyAr: 'لوسيل للتجارة',
    short: 'Rice, pulses, sesame and grain sourced abroad and moved into the Gulf in bulk.',
    shortAr: 'الأرز والبقوليات والسمسم والحبوب من مصادرها حول العالم إلى الخليج بالجملة.',
    intro: 'The group\'s trading arm buys agricultural commodities at origin and moves them into Qatar and the wider Gulf in bulk — rice, pulses, sesame, sugar and grain.',
    introAr: 'ذراع المجموعة التجارية تشتري السلع الزراعية من مصادرها وتنقلها إلى قطر والخليج بالجملة: الأرز والبقوليات والسمسم والسكر والحبوب.',
    body: [
      'Buying at origin rather than through an intermediary is what makes the margin work. It also means the company carries the quality question itself: every lot is specified, inspected and documented before it ships.',
      'The trading company sits upstream of the rest of the group. What it buys, the shipping company moves and the distribution company delivers — which is the practical argument for holding all three under one owner.'
    ],
    bodyAr: [
      'الشراء من المصدر مباشرة بدل الوسطاء هو ما يجعل هامش الربح ممكناً، ويعني أيضاً أن الشركة تتحمل مسؤولية الجودة بنفسها: كل شحنة تُحدَّد مواصفاتها وتُفحص وتُوثَّق قبل الشحن.',
      'تقع الشركة التجارية في بداية سلسلة المجموعة. ما تشتريه تنقله شركة الشحن وتوصّله شركة التوزيع، وهذا هو المبرر العملي لجمع الثلاث تحت ملكية واحدة.'
    ],
    caps: [
      { t: 'Sourcing at origin', d: 'Direct relationships with producers and exporters in the growing regions.' },
      { t: 'Quality and inspection', d: 'Specification, sampling and third-party inspection before a lot ships.' },
      { t: 'Bulk and bagged cargo', d: 'Both bulk vessel loads and bagged consignments, depending on the buyer.' },
      { t: 'Group procurement', d: 'Buying for the rest of the group, which lowers the price every company pays.' }
    ],
    capsAr: [
      { t: 'التوريد من المصدر', d: 'علاقات مباشرة مع المنتجين والمصدّرين في مناطق الإنتاج.' },
      { t: 'الجودة والفحص', d: 'تحديد المواصفات وأخذ العينات والفحص من طرف ثالث قبل الشحن.' },
      { t: 'الشحن السائب والمعبأ', d: 'شحنات بالسفن السائبة أو معبأة في أكياس بحسب حاجة المشتري.' },
      { t: 'مشتريات المجموعة', d: 'الشراء لبقية شركات المجموعة، ما يخفض السعر على الجميع.' }
    ],
    figs: []
  },

  {
    slug: 'coffee',
    photo: 'coffee',
    nameProvisional: true,
    sector: 'Coffee',
    sectorAr: 'البن',
    company: 'Lusail Coffee',
    companyAr: 'لوسيل للبن',
    short: 'Green coffee bought at origin, graded and traded — the raw bean, before the roast.',
    shortAr: 'البن الأخضر من مصادره، يُصنّف ويُتاجر به — الحبة الخام قبل التحميص.',
    intro: 'Green coffee — unroasted, still the raw agricultural product — bought at origin, graded, and sold on to roasters and wholesalers.',
    introAr: 'البن الأخضر غير المحمّص، وهو لا يزال منتجاً زراعياً خاماً، يُشترى من مصادره ويُصنّف ويُباع للمحامص وتجار الجملة.',
    body: [
      'Green coffee is a commodity with a grading language of its own: origin, altitude, screen size, defect count, cup score. The company buys against those terms rather than against a brand.',
      'Because the bean is sold unroasted, the customer is a roaster or a wholesaler, not a café. That keeps the business in the same trading discipline as the rest of the group.'
    ],
    bodyAr: [
      'البن الأخضر سلعة لها لغة تصنيف خاصة: المنشأ والارتفاع وحجم الحبة وعدد العيوب ودرجة التذوق. تشتري الشركة وفق هذه المعايير لا وفق العلامة التجارية.',
      'ولأن الحبة تُباع غير محمّصة، فإن العميل محمصة أو تاجر جملة وليس مقهى، ما يبقي النشاط ضمن الانضباط التجاري نفسه لبقية المجموعة.'
    ],
    caps: [
      { t: 'Origin buying', d: 'Lots contracted directly with exporters in the producing countries.' },
      { t: 'Grading and cupping', d: 'Screen size, defect count and cup score recorded for every lot.' },
      { t: 'Supply to roasters', d: 'Sold on to roasteries and wholesalers across the Gulf.' },
      { t: 'Storage and handling', d: 'Conditioned storage that protects the bean between landing and sale.' }
    ],
    capsAr: [
      { t: 'الشراء من المنشأ', d: 'تعاقد مباشر مع المصدّرين في الدول المنتجة.' },
      { t: 'التصنيف والتذوق', d: 'تسجيل حجم الحبة وعدد العيوب ودرجة التذوق لكل شحنة.' },
      { t: 'التوريد للمحامص', d: 'البيع للمحامص وتجار الجملة في أنحاء الخليج.' },
      { t: 'التخزين والمناولة', d: 'تخزين مكيّف يحمي الحبة بين الوصول والبيع.' }
    ],
    figs: []
  },

  {
    slug: 'energy',
    photo: 'energy',
    nameProvisional: true,
    sector: 'Energy',
    sectorAr: 'الطاقة',
    company: 'Lusail Energy',
    companyAr: 'لوسيل للطاقة',
    short: 'Oil and gas field services, supply and support across Qatar.',
    shortAr: 'خدمات حقول النفط والغاز والتوريد والدعم في أنحاء قطر.',
    intro: 'Services and supply to the oil and gas industry — the work that keeps installations running rather than the extraction itself.',
    introAr: 'خدمات وتوريد لقطاع النفط والغاز: الأعمال التي تبقي المنشآت تعمل، لا الاستخراج نفسه.',
    body: [
      'Field services, equipment supply, maintenance support and manpower for operators and the larger contractors working on their behalf.',
      'This is the group\'s most regulated business. Certification, safety record and audit history decide who is allowed to work on a site at all, which is where the group\'s governance standard earns its place.'
    ],
    bodyAr: [
      'خدمات ميدانية وتوريد معدات ودعم الصيانة والكوادر للمشغّلين والمقاولين الكبار العاملين لحسابهم.',
      'هذا أكثر أنشطة المجموعة خضوعاً للتنظيم. الشهادات وسجل السلامة وتاريخ التدقيق هي ما يحدد من يُسمح له بالعمل في الموقع أصلاً، وهنا تثبت معايير حوكمة المجموعة جدواها.'
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
  },

  {
    slug: 'contracting',
    photo: 'contracting',
    nameProvisional: true,
    sector: 'Contracting',
    sectorAr: 'المقاولات',
    company: 'Lusail Contracting',
    companyAr: 'لوسيل للمقاولات',
    short: 'Building and infrastructure work, from site engineering through to handover.',
    shortAr: 'أعمال البناء والبنية التحتية، من هندسة الموقع حتى التسليم.',
    intro: 'Residential, commercial and infrastructure construction, carried from site engineering and procurement through to handover.',
    introAr: 'إنشاءات سكنية وتجارية وبنية تحتية، من هندسة الموقع والمشتريات وحتى التسليم.',
    body: [
      'The company works as a main contractor and, on larger schemes, as a specialist subcontractor for structure and finishing packages.',
      'Construction is where the group\'s capital matters most directly. Retention, long payment cycles and plant purchases all need a balance sheet behind them, and that is what a holding structure provides.'
    ],
    bodyAr: [
      'تعمل الشركة مقاولاً رئيسياً، وفي المشاريع الكبرى مقاولاً متخصصاً لحزم الهيكل والتشطيبات.',
      'المقاولات هي المجال الذي يظهر فيه رأس مال المجموعة بأوضح صورة: المحتجزات ودورات الدفع الطويلة وشراء المعدات تحتاج جميعها إلى ميزانية قوية خلفها، وهذا ما يوفره الكيان القابض.'
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
  },

  {
    slug: 'shipping',
    photo: 'shipping',
    nameProvisional: true,
    sector: 'Shipping',
    sectorAr: 'الشحن',
    company: 'Lusail Shipping',
    companyAr: 'لوسيل للشحن',
    short: 'Containers and bulk cargo through the terminals the group trades across.',
    shortAr: 'الحاويات والبضائع السائبة عبر الموانئ التي تتاجر المجموعة من خلالها.',
    intro: 'Moving the group\'s cargo, and third-party cargo, through the container and bulk terminals that serve Qatar.',
    introAr: 'نقل بضائع المجموعة وبضائع الغير عبر محطات الحاويات والبضائع السائبة التي تخدم قطر.',
    body: [
      'Chartering, freight forwarding, customs clearance and port handling — the chain of steps between a lot bought at origin and a pallet leaving a warehouse.',
      'Handling the group\'s own volume gives the company a base load; third-party cargo is what makes the capacity pay.'
    ],
    bodyAr: [
      'الاستئجار والشحن والتخليص الجمركي والمناولة في الميناء: سلسلة الخطوات بين شحنة تُشترى من المصدر وطبلية تغادر المستودع.',
      'مناولة أحجام المجموعة نفسها تمنح الشركة حملاً أساسياً، وبضائع الغير هي ما يجعل الطاقة الاستيعابية مربحة.'
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
    slug: 'distribution',
    photo: 'distribution',
    nameProvisional: true,
    sector: 'Distribution',
    sectorAr: 'التوزيع',
    company: 'Lusail Distribution',
    companyAr: 'لوسيل للتوزيع',
    short: 'Warehousing and onward delivery to the wholesalers and retailers who buy.',
    shortAr: 'التخزين والتوصيل لتجار الجملة والتجزئة.',
    intro: 'The last step: warehousing landed goods and delivering them to wholesalers, retailers and institutional buyers across Qatar.',
    introAr: 'الخطوة الأخيرة: تخزين البضائع الواصلة وتوصيلها لتجار الجملة والتجزئة والمشترين المؤسسيين في أنحاء قطر.',
    body: [
      'Warehousing, order picking, fleet delivery and stock management for the group\'s own goods and for third parties using the same space.',
      'This company closes the loop. A lot bought by the trading arm, shipped by the shipping arm and stored here reaches the buyer without the group ever handing the cargo to an outside party.'
    ],
    bodyAr: [
      'التخزين وتجهيز الطلبات والتوصيل بالأسطول وإدارة المخزون لبضائع المجموعة ولعملاء الغير في المساحة نفسها.',
      'هذه الشركة تغلق الدائرة: شحنة تشتريها الذراع التجارية وتنقلها ذراع الشحن وتُخزَّن هنا تصل إلى المشتري دون أن تسلّم المجموعة البضاعة لطرف خارجي في أي مرحلة.'
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
];

/* --------------------------------------------------------------------------
   What the group provides its companies. Shown on home and About.
   -------------------------------------------------------------------------- */

const PILLARS = [
  {
    t: 'Long-term capital', tAr: 'رأس مال طويل الأجل',
    d: 'Funding for expansion, equipment and working capital, planned in years rather than quarters.',
    dAr: 'تمويل للتوسع والمعدات ورأس المال العامل، بخطط تمتد لسنوات لا لأرباع.'
  },
  {
    t: 'Governance', tAr: 'الحوكمة',
    d: 'Boards, financial reporting and internal controls held to one standard across every company.',
    dAr: 'مجالس إدارة وتقارير مالية ورقابة داخلية بمعيار واحد في جميع الشركات.'
  },
  {
    t: 'Shared services', tAr: 'الخدمات المشتركة',
    d: 'Procurement, logistics, finance and IT run once for the group instead of six times over.',
    dAr: 'المشتريات واللوجستيات والمالية وتقنية المعلومات تُدار مرة واحدة للمجموعة بدل ست مرات.'
  },
  {
    t: 'People', tAr: 'الكفاءات',
    d: 'Developing Qatari talent and moving people between companies to build future leaders.',
    dAr: 'تطوير الكوادر القطرية وتنقّل المواهب بين الشركات لبناء قادة المستقبل.'
  }
];

/* --------------------------------------------------------------------------
   Careers. Replace with real openings, or set OPEN_ROLES = [] to show the
   "no current openings, send us your CV" state.
   -------------------------------------------------------------------------- */

const OPEN_ROLES = [
  { t: 'Commodity trader — grains and pulses', co: 'Trading', loc: 'Lusail', type: 'Full time' },
  { t: 'Site engineer', co: 'Contracting', loc: 'Doha', type: 'Full time' },
  { t: 'Customs clearance officer', co: 'Shipping', loc: 'Hamad Port', type: 'Full time' },
  { t: 'Warehouse supervisor', co: 'Distribution', loc: 'Birkat Al Awamer', type: 'Full time' },
  { t: 'Group financial accountant', co: 'Lusail Corp', loc: 'Lusail', type: 'Full time' }
];

module.exports = { SITE, COMPANIES, PILLARS, OPEN_ROLES };
