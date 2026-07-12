// KA International — product catalog (demo data)

export const FABRICS = [
  { id: 'ivory-boucle', en: 'Ivory Bouclé', ar: 'بوكليه عاجي', hex: '#EDE8DF', delta: 0 },
  { id: 'charcoal-wool', en: 'Charcoal Wool', ar: 'صوف فحمي', hex: '#3A3E41', delta: 400 },
  { id: 'olive-linen', en: 'Olive Linen', ar: 'كتان زيتوني', hex: '#5E6B41', delta: 350 },
  { id: 'sand-velvet', en: 'Sand Velvet', ar: 'مخمل رملي', hex: '#C9B99A', delta: 550 },
  { id: 'slate-tweed', en: 'Slate Tweed', ar: 'تويد رمادي', hex: '#6C7276', delta: 300 },
]

export const LEATHERS = [
  { id: 'cognac', en: 'Cognac Full-Grain', ar: 'جلد كونياك', hex: '#8B5A33', delta: 0 },
  { id: 'espresso', en: 'Espresso Aniline', ar: 'جلد إسبريسو', hex: '#4A3428', delta: 300 },
  { id: 'bone', en: 'Bone Nappa', ar: 'نابا عاجي', hex: '#DDD6C8', delta: 200 },
]

export const WOODS = [
  { id: 'walnut', en: 'American Walnut', ar: 'جوز أمريكي', hex: '#5D4433', delta: 0 },
  { id: 'oak', en: 'White Oak', ar: 'بلوط أبيض', hex: '#B99C74', delta: 200 },
  { id: 'ebony', en: 'Ebonized Ash', ar: 'دردار داكن', hex: '#2A2523', delta: 450 },
]

export const MARBLES = [
  { id: 'calacatta', en: 'Calacatta Oro', ar: 'كالاكاتا أورو', hex: '#EFEDE8', delta: 0 },
  { id: 'nero', en: 'Nero Marquina', ar: 'نيرو ماركينا', hex: '#26262A', delta: 900 },
  { id: 'verde', en: 'Verde Alpi', ar: 'فيردي ألبي', hex: '#3E5747', delta: 1200 },
]

export const METALS = [
  { id: 'brass', en: 'Brushed Brass', ar: 'نحاس مصنفر', hex: '#B08D46', delta: 0 },
  { id: 'black', en: 'Matte Black', ar: 'أسود مطفي', hex: '#26282A', delta: 0 },
  { id: 'steel', en: 'Satin Steel', ar: 'فولاذ ساتان', hex: '#9FA6AB', delta: 150 },
]

export const LEGS = [
  { id: 'tapered', en: 'Tapered Wood', ar: 'خشبية مدببة', delta: 0 },
  { id: 'plinth', en: 'Plinth Base', ar: 'قاعدة صلبة', delta: 600 },
  { id: 'metal', en: 'Metal Blade', ar: 'معدنية رفيعة', delta: 350 },
]

export const SIZES = {
  sofa: [
    { id: 's220', en: '220 cm — 2.5 Seat', ar: '٢٢٠ سم — مقعدان ونصف', delta: 0, scale: 1 },
    { id: 's260', en: '260 cm — 3 Seat', ar: '٢٦٠ سم — ثلاثة مقاعد', delta: 1400, scale: 1.14 },
    { id: 's300', en: '300 cm — 4 Seat', ar: '٣٠٠ سم — أربعة مقاعد', delta: 2600, scale: 1.28 },
  ],
  table: [
    { id: 't200', en: '200 cm — Seats 6', ar: '٢٠٠ سم — ٦ أشخاص', delta: 0, scale: 1 },
    { id: 't240', en: '240 cm — Seats 8', ar: '٢٤٠ سم — ٨ أشخاص', delta: 1800, scale: 1.16 },
    { id: 't300', en: '300 cm — Seats 10', ar: '٣٠٠ سم — ١٠ أشخاص', delta: 3400, scale: 1.32 },
  ],
  bed: [
    { id: 'queen', en: 'Queen — 160 cm', ar: 'كوين — ١٦٠ سم', delta: 0, scale: 1 },
    { id: 'king', en: 'King — 180 cm', ar: 'كينج — ١٨٠ سم', delta: 1200, scale: 1.1 },
    { id: 'superking', en: 'Super King — 200 cm', ar: 'سوبر كينج — ٢٠٠ سم', delta: 2200, scale: 1.2 },
  ],
}

export const LAYOUTS = [
  { id: 'standard', en: 'Standard', ar: 'قياسي', delta: 0 },
  { id: 'chaise', en: 'With Chaise', ar: 'مع أريكة استرخاء', delta: 2900 },
  { id: 'corner', en: 'Corner L-Shape', ar: 'زاوية على شكل L', delta: 4800 },
]

const img = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const CATEGORIES = [
  { id: 'living', image: img('1555041469-a586c61ea9bc') },
  { id: 'bedroom', image: img('1616594039964-ae9021a400a0') },
  { id: 'dining', image: img('1617806118233-18e1de247200') },
  { id: 'office', image: img('1497366754035-f200968a6e72') },
  { id: 'outdoor', image: img('1600210492486-724fe5c67fb0') },
  { id: 'accessories', image: img('1513506003901-1e6a229e2d15') },
]

export const PRODUCTS = [
  {
    id: 'meridian-sofa',
    name: { en: 'Meridian Sofa', ar: 'أريكة ميريديان' },
    category: 'living',
    price: 14900,
    modelType: 'sofa',
    badge: 'bestseller',
    signature: true,
    description: {
      en: 'Our signature low-profile sofa. Kiln-dried hardwood frame, hand-tied springs and down-wrapped cushions beneath tailored upholstery.',
      ar: 'أريكتنا المميزة بتصميم منخفض. هيكل من الخشب الصلب المجفف، نوابض مربوطة يدويًا ووسائد محشوة بالريش تحت تنجيد مفصل.',
    },
    materials: { en: 'Solid beech, full-grain leather or Italian fabric, brass', ar: 'زان صلب، جلد طبيعي أو قماش إيطالي، نحاس' },
    dims: { en: 'W 260 × D 102 × H 74 cm · Seat H 42 cm', ar: 'عرض ٢٦٠ × عمق ١٠٢ × ارتفاع ٧٤ سم · ارتفاع الجلسة ٤٢ سم' },
    options: { fabric: FABRICS, leather: LEATHERS, wood: WOODS, legs: LEGS, size: SIZES.sofa, layout: LAYOUTS },
    images: [img('1555041469-a586c61ea9bc'), img('1616486338812-3dadae4b4ace'), img('1493663284031-b7e3aefcae8e')],
    rating: 4.9, reviewCount: 84,
  },
  {
    id: 'atlas-armchair',
    name: { en: 'Atlas Armchair', ar: 'كرسي أطلس' },
    category: 'living',
    price: 6800,
    modelType: 'armchair',
    badge: 'new',
    signature: true,
    description: {
      en: 'A sculptural lounge chair with a floating curved back and a swivel plinth in solid walnut.',
      ar: 'كرسي استرخاء منحوت بظهر منحنٍ عائم وقاعدة دوّارة من خشب الجوز الصلب.',
    },
    materials: { en: 'Walnut, memory swivel, bouclé or leather', ar: 'جوز، قاعدة دوّارة، بوكليه أو جلد' },
    dims: { en: 'W 84 × D 88 × H 76 cm', ar: 'عرض ٨٤ × عمق ٨٨ × ارتفاع ٧٦ سم' },
    options: { fabric: FABRICS, leather: LEATHERS, wood: WOODS },
    images: [img('1586023492125-27b2c045efd7'), img('1567016432779-094069958ea5'), img('1493663284031-b7e3aefcae8e')],
    rating: 4.8, reviewCount: 51,
  },
  {
    id: 'oasis-coffee-table',
    name: { en: 'Oasis Coffee Table', ar: 'طاولة أويسس' },
    category: 'living',
    price: 5200,
    modelType: 'coffeeTable',
    description: {
      en: 'Honed marble disc on a sculpted metal column. Quietly monumental.',
      ar: 'قرص رخامي مصقول على عمود معدني منحوت. فخامة هادئة.',
    },
    materials: { en: 'Marble, brushed brass or matte black steel', ar: 'رخام، نحاس مصنفر أو فولاذ أسود مطفي' },
    dims: { en: 'Ø 110 × H 33 cm', ar: 'قطر ١١٠ × ارتفاع ٣٣ سم' },
    options: { marble: MARBLES, metal: METALS },
    images: [img('1600607687939-ce8a6c25118c'), img('1555041469-a586c61ea9bc')],
    rating: 4.7, reviewCount: 36,
  },
  {
    id: 'dune-bed',
    name: { en: 'Dune Bed', ar: 'سرير ديون' },
    category: 'bedroom',
    price: 12400,
    modelType: 'bed',
    badge: 'bestseller',
    signature: true,
    description: {
      en: 'An upholstered sanctuary with a wide curved headboard and floating base, inspired by desert horizons.',
      ar: 'ملاذ منجد بلوح رأس منحنٍ عريض وقاعدة عائمة، مستوحى من آفاق الصحراء.',
    },
    materials: { en: 'Beech frame, premium upholstery, oak feet', ar: 'هيكل زان، تنجيد فاخر، أرجل بلوط' },
    dims: { en: 'W 200 × L 220 × H 110 cm', ar: 'عرض ٢٠٠ × طول ٢٢٠ × ارتفاع ١١٠ سم' },
    options: { fabric: FABRICS, wood: WOODS, size: SIZES.bed },
    images: [img('1616594039964-ae9021a400a0'), img('1617806118233-18e1de247200'), img('1567016432779-094069958ea5')],
    rating: 4.9, reviewCount: 67,
  },
  {
    id: 'mirage-nightstand',
    name: { en: 'Mirage Nightstand', ar: 'كومودينو ميراج' },
    category: 'bedroom',
    price: 2900,
    modelType: 'sideboard',
    description: {
      en: 'Fluted solid wood with a soft-close drawer and honed stone top.',
      ar: 'خشب صلب محزز بدرج سلس الإغلاق وسطح حجري مصقول.',
    },
    materials: { en: 'Oak or walnut, marble, brass pulls', ar: 'بلوط أو جوز، رخام، مقابض نحاسية' },
    dims: { en: 'W 55 × D 42 × H 52 cm', ar: 'عرض ٥٥ × عمق ٤٢ × ارتفاع ٥٢ سم' },
    options: { wood: WOODS, marble: MARBLES, metal: METALS },
    images: [img('1595526114035-0d45ed16cfbf'), img('1616594039964-ae9021a400a0')],
    rating: 4.6, reviewCount: 28,
  },
  {
    id: 'sahara-dining-table',
    name: { en: 'Sahara Dining Table', ar: 'طاولة طعام سهارا' },
    category: 'dining',
    price: 16800,
    modelType: 'table',
    signature: true,
    badge: 'new',
    description: {
      en: 'A monolithic dining table — bookmatched marble or solid timber on twin sculpted pedestals.',
      ar: 'طاولة طعام متفردة — رخام متطابق أو خشب صلب على قاعدتين منحوتتين.',
    },
    materials: { en: 'Marble or solid wood, steel core', ar: 'رخام أو خشب صلب، قلب فولاذي' },
    dims: { en: 'L 240 × W 110 × H 75 cm', ar: 'طول ٢٤٠ × عرض ١١٠ × ارتفاع ٧٥ سم' },
    options: { marble: MARBLES, wood: WOODS, size: SIZES.table },
    images: [img('1617806118233-18e1de247200'), img('1519710164239-da123dc03ef4'), img('1449247709967-d4461a6a6103')],
    rating: 4.9, reviewCount: 42,
  },
  {
    id: 'palm-dining-chair',
    name: { en: 'Palm Dining Chair', ar: 'كرسي طعام بالم' },
    category: 'dining',
    price: 2400,
    modelType: 'armchair',
    description: {
      en: 'Curved-back dining chair, upholstered in performance fabric over a solid frame.',
      ar: 'كرسي طعام بظهر منحنٍ، منجد بقماش عملي فوق هيكل صلب.',
    },
    materials: { en: 'Beech, performance bouclé', ar: 'زان، بوكليه عملي' },
    dims: { en: 'W 52 × D 56 × H 80 cm', ar: 'عرض ٥٢ × عمق ٥٦ × ارتفاع ٨٠ سم' },
    options: { fabric: FABRICS, wood: WOODS },
    images: [img('1519710164239-da123dc03ef4'), img('1617806118233-18e1de247200')],
    rating: 4.5, reviewCount: 31,
  },
  {
    id: 'majlis-executive-desk',
    name: { en: 'Majlis Executive Desk', ar: 'مكتب مجلس التنفيذي' },
    category: 'office',
    price: 11200,
    modelType: 'desk',
    signature: true,
    description: {
      en: 'A commanding desk in leather-wrapped timber with integrated cable channel and soft-close drawers.',
      ar: 'مكتب مهيب من الخشب المغلف بالجلد مع مجرى كابلات مدمج وأدراج سلسة الإغلاق.',
    },
    materials: { en: 'Walnut, saddle leather, brass', ar: 'جوز، جلد سرجي، نحاس' },
    dims: { en: 'W 180 × D 85 × H 74 cm', ar: 'عرض ١٨٠ × عمق ٨٥ × ارتفاع ٧٤ سم' },
    options: { wood: WOODS, leather: LEATHERS, metal: METALS },
    images: [img('1497366754035-f200968a6e72'), img('1497366216548-37526070297c'), img('1524758631624-e2822e304c36')],
    rating: 4.8, reviewCount: 23,
  },
  {
    id: 'vista-lounge-chair',
    name: { en: 'Vista Lounge Chair', ar: 'كرسي فيستا الخارجي' },
    category: 'outdoor',
    price: 4600,
    modelType: 'loungeChair',
    badge: 'new',
    description: {
      en: 'Weatherproof teak and rope lounge chair with quick-dry cushions for terraces and pool decks.',
      ar: 'كرسي استرخاء خارجي من خشب الساج والحبال المقاومة للطقس مع وسائد سريعة الجفاف.',
    },
    materials: { en: 'Grade-A teak, marine rope, olefin', ar: 'ساج درجة أولى، حبال بحرية، أولفين' },
    dims: { en: 'W 78 × D 90 × H 70 cm', ar: 'عرض ٧٨ × عمق ٩٠ × ارتفاع ٧٠ سم' },
    options: { fabric: FABRICS, wood: WOODS },
    images: [img('1600210492486-724fe5c67fb0'), img('1600585154340-be6161a56a0c')],
    rating: 4.7, reviewCount: 19,
  },
  {
    id: 'oasis-fire-table',
    name: { en: 'Oasis Fire Table', ar: 'طاولة نار أويسس' },
    category: 'outdoor',
    price: 8900,
    modelType: 'coffeeTable',
    description: {
      en: 'Cast-stone fire table for desert evenings — gathering, redefined.',
      ar: 'طاولة نار من الحجر المصبوب لأمسيات الصحراء — تجمّع بمفهوم جديد.',
    },
    materials: { en: 'Cast stone, stainless burner', ar: 'حجر مصبوب، موقد ستانلس' },
    dims: { en: 'Ø 120 × H 40 cm', ar: 'قطر ١٢٠ × ارتفاع ٤٠ سم' },
    options: { marble: MARBLES, metal: METALS },
    images: [img('1600585154340-be6161a56a0c'), img('1600210492486-724fe5c67fb0')],
    rating: 4.6, reviewCount: 14,
  },
  {
    id: 'halo-floor-lamp',
    name: { en: 'Halo Floor Lamp', ar: 'مصباح هالو الأرضي' },
    category: 'accessories',
    price: 1900,
    modelType: 'lamp',
    description: {
      en: 'A slender arc of brushed metal crowned with a hand-blown opal glass globe.',
      ar: 'قوس رشيق من المعدن المصنفر يتوجه كرة زجاجية أوبالية منفوخة يدويًا.',
    },
    materials: { en: 'Brass or steel, opal glass', ar: 'نحاس أو فولاذ، زجاج أوبالي' },
    dims: { en: 'H 165 × Ø 38 cm', ar: 'ارتفاع ١٦٥ × قطر ٣٨ سم' },
    options: { metal: METALS, marble: MARBLES },
    images: [img('1507473885765-e6ed057f782c'), img('1513506003901-1e6a229e2d15')],
    rating: 4.8, reviewCount: 45,
  },
  {
    id: 'dune-wool-rug',
    name: { en: 'Dune Wool Rug', ar: 'سجادة ديون الصوفية' },
    category: 'accessories',
    price: 3400,
    modelType: 'rug',
    description: {
      en: 'Hand-knotted New Zealand wool in tonal desert gradients. Each piece unique.',
      ar: 'صوف نيوزيلندي معقود يدويًا بتدرجات صحراوية. كل قطعة فريدة.',
    },
    materials: { en: '100% wool, cotton warp', ar: 'صوف ١٠٠٪، سدى قطني' },
    dims: { en: '300 × 200 cm', ar: '٣٠٠ × ٢٠٠ سم' },
    options: { fabric: FABRICS },
    images: [img('1513506003901-1e6a229e2d15'), img('1586023492125-27b2c045efd7')],
    rating: 4.7, reviewCount: 22,
  },
  {
    id: 'crescent-sideboard',
    name: { en: 'Crescent Sideboard', ar: 'خزانة كريسنت الجانبية' },
    category: 'living',
    price: 9800,
    modelType: 'sideboard',
    signature: true,
    description: {
      en: 'Fluted doors, interior oak drawers and a floating stone top — storage as sculpture.',
      ar: 'أبواب محززة، أدراج داخلية من البلوط وسطح حجري عائم — تخزين كقطعة نحتية.',
    },
    materials: { en: 'Walnut, marble, brass', ar: 'جوز، رخام، نحاس' },
    dims: { en: 'W 200 × D 45 × H 78 cm', ar: 'عرض ٢٠٠ × عمق ٤٥ × ارتفاع ٧٨ سم' },
    options: { wood: WOODS, marble: MARBLES, metal: METALS },
    images: [img('1493663284031-b7e3aefcae8e'), img('1600607687939-ce8a6c25118c')],
    rating: 4.8, reviewCount: 33,
  },
  {
    id: 'aria-office-chair',
    name: { en: 'Aria Office Chair', ar: 'كرسي أريا المكتبي' },
    category: 'office',
    price: 3800,
    modelType: 'armchair',
    description: {
      en: 'Executive comfort in aniline leather with polished swivel base and silent castors.',
      ar: 'راحة تنفيذية بجلد أنيلين مع قاعدة دوّارة مصقولة وعجلات صامتة.',
    },
    materials: { en: 'Aniline leather, aluminum', ar: 'جلد أنيلين، ألمنيوم' },
    dims: { en: 'W 66 × D 66 × H 92–102 cm', ar: 'عرض ٦٦ × عمق ٦٦ × ارتفاع ٩٢–١٠٢ سم' },
    options: { leather: LEATHERS, metal: METALS },
    images: [img('1497366216548-37526070297c'), img('1497366754035-f200968a6e72')],
    rating: 4.6, reviewCount: 26,
  },
]

export const ROOMS = [
  {
    id: 'luxury-living',
    name: { en: 'Luxury Living Room', ar: 'غرفة معيشة فاخرة' },
    description: {
      en: 'Low horizons, warm neutrals and one commanding curve — a living room for slow evenings.',
      ar: 'آفاق منخفضة، درجات دافئة ومنحنى واحد مهيب — غرفة معيشة لأمسيات هادئة.',
    },
    image: img('1600210492493-0946911123ea', 2000),
    products: ['meridian-sofa', 'atlas-armchair', 'oasis-coffee-table', 'crescent-sideboard', 'halo-floor-lamp'],
    hotspots: [
      { productId: 'meridian-sofa', x: 42, y: 62 },
      { productId: 'atlas-armchair', x: 74, y: 58 },
      { productId: 'oasis-coffee-table', x: 55, y: 78 },
      { productId: 'halo-floor-lamp', x: 12, y: 42 },
      { productId: 'crescent-sideboard', x: 88, y: 46 },
    ],
  },
  {
    id: 'master-bedroom',
    name: { en: 'Master Bedroom', ar: 'غرفة النوم الرئيسية' },
    description: {
      en: 'A soft monolith of a bed, flanked by fluted timber — rest as ritual.',
      ar: 'سرير كقطعة واحدة ناعمة، يحيط به خشب محزز — الراحة كطقس يومي.',
    },
    image: img('1616594039964-ae9021a400a0', 2000),
    products: ['dune-bed', 'mirage-nightstand', 'dune-wool-rug', 'halo-floor-lamp'],
    hotspots: [
      { productId: 'dune-bed', x: 50, y: 60 },
      { productId: 'mirage-nightstand', x: 78, y: 66 },
      { productId: 'dune-wool-rug', x: 40, y: 88 },
      { productId: 'halo-floor-lamp', x: 14, y: 46 },
    ],
  },
  {
    id: 'dining-space',
    name: { en: 'Dining Space', ar: 'ركن الطعام' },
    description: {
      en: 'Stone, timber and light — a table that hosts three generations.',
      ar: 'حجر وخشب وضوء — طاولة تستضيف ثلاثة أجيال.',
    },
    image: img('1617806118233-18e1de247200', 2000),
    products: ['sahara-dining-table', 'palm-dining-chair', 'halo-floor-lamp'],
    hotspots: [
      { productId: 'sahara-dining-table', x: 50, y: 66 },
      { productId: 'palm-dining-chair', x: 30, y: 62 },
      { productId: 'halo-floor-lamp', x: 84, y: 40 },
    ],
  },
  {
    id: 'executive-office',
    name: { en: 'Executive Office', ar: 'المكتب التنفيذي' },
    description: {
      en: 'Leather, walnut and quiet authority for decisions that matter.',
      ar: 'جلد وجوز وهدوء يفرض حضوره — لقرارات مهمة.',
    },
    image: img('1497366754035-f200968a6e72', 2000),
    products: ['majlis-executive-desk', 'aria-office-chair', 'crescent-sideboard'],
    hotspots: [
      { productId: 'majlis-executive-desk', x: 52, y: 64 },
      { productId: 'aria-office-chair', x: 66, y: 56 },
      { productId: 'crescent-sideboard', x: 16, y: 50 },
    ],
  },
  {
    id: 'outdoor-lounge',
    name: { en: 'Outdoor Lounge', ar: 'الجلسة الخارجية' },
    description: {
      en: 'Teak, rope and firelight under an open sky.',
      ar: 'ساج وحبال وضوء نار تحت سماء مفتوحة.',
    },
    image: img('1600585154340-be6161a56a0c', 2000),
    products: ['vista-lounge-chair', 'oasis-fire-table', 'dune-wool-rug'],
    hotspots: [
      { productId: 'vista-lounge-chair', x: 38, y: 62 },
      { productId: 'oasis-fire-table', x: 58, y: 76 },
      { productId: 'dune-wool-rug', x: 76, y: 86 },
    ],
  },
]

export const getProduct = (id) => PRODUCTS.find((p) => p.id === id)

export const OPTION_LABEL_KEYS = {
  fabric: 'fabric', leather: 'leather', wood: 'wood', marble: 'marble',
  metal: 'metal', legs: 'legs', size: 'size', layout: 'layout',
}

export function defaultConfig(product) {
  const cfg = {}
  for (const [key, opts] of Object.entries(product.options || {})) cfg[key] = opts[0].id
  return cfg
}

export function priceOf(product, config) {
  let price = product.price
  for (const [key, optId] of Object.entries(config || {})) {
    const opt = (product.options?.[key] || []).find((o) => o.id === optId)
    if (opt) price += opt.delta || 0
  }
  return price
}

export function configSummary(product, config, lang) {
  return Object.entries(config || {})
    .map(([key, optId]) => {
      const opt = (product.options?.[key] || []).find((o) => o.id === optId)
      return opt ? opt[lang] || opt.en : null
    })
    .filter(Boolean)
    .join(' · ')
}
