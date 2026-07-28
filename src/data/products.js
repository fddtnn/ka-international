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
  { id: 'fabrics', image: img('1534639077088-d702bcf685e7') },
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
    id: 'dune-wool-rug',
    name: { en: 'Dune Wool Rug', ar: 'سجادة ديون الصوفية' },
    category: 'fabrics',
    price: 3400,
    modelType: 'rug',
    description: {
      en: 'Hand-knotted New Zealand wool in tonal desert gradients. Each piece unique.',
      ar: 'صوف نيوزيلندي معقود يدويًا بتدرجات صحراوية. كل قطعة فريدة.',
    },
    materials: { en: '100% wool, cotton warp', ar: 'صوف ١٠٠٪، سدى قطني' },
    dims: { en: '300 × 200 cm', ar: '٣٠٠ × ٢٠٠ سم' },
    options: { fabric: FABRICS },
    images: [img('1564444247765-a377a8bfd0b8'), img('1528458909336-e7a0adfed0a5')],
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
    id: 'atelier-boucle-upholstery',
    name: { en: 'Atelier Bouclé Upholstery', ar: 'قماش أتيليه بوكليه' },
    category: 'fabrics',
    price: 620,
    modelType: 'rug',
    badge: 'new',
    description: {
      en: 'Dense Belgian bouclé woven for high-traffic upholstery. Sold by the running metre, 140 cm wide.',
      ar: 'بوكليه بلجيكي كثيف منسوج لتنجيد الاستخدام المكثف. يُباع بالمتر الطولي، بعرض ١٤٠ سم.',
    },
    materials: { en: '68% wool, 32% cotton, 40k Martindale', ar: 'صوف ٦٨٪، قطن ٣٢٪، ٤٠ ألف مارتينديل' },
    dims: { en: 'Width 140 cm — priced per metre', ar: 'العرض ١٤٠ سم — السعر للمتر' },
    options: { fabric: FABRICS },
    images: [img('1528458909336-e7a0adfed0a5'), img('1534639077088-d702bcf685e7')],
    rating: 4.9, reviewCount: 18,
  },
  {
    id: 'sahara-linen-drape',
    name: { en: 'Sahara Linen Drape', ar: 'ستائر صحارى الكتانية' },
    category: 'fabrics',
    price: 480,
    modelType: 'rug',
    description: {
      en: 'Stone-washed Belgian linen that filters desert light without shutting it out. Made to measure.',
      ar: 'كتان بلجيكي مغسول بالحجر يُرشِّح ضوء الصحراء دون أن يحجبه. يُفصَّل حسب المقاس.',
    },
    materials: { en: '100% Belgian linen, lead-weighted hem', ar: 'كتان بلجيكي ١٠٠٪، حاشية مثقّلة' },
    dims: { en: 'Width 300 cm — priced per metre', ar: 'العرض ٣٠٠ سم — السعر للمتر' },
    options: { fabric: FABRICS },
    images: [img('1594734415578-00fc9540929b'), img('1528458909336-e7a0adfed0a5')],
    rating: 4.7, reviewCount: 12,
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
    products: ['meridian-sofa', 'atlas-armchair', 'oasis-coffee-table', 'crescent-sideboard'],
    hotspots: [
      { productId: 'meridian-sofa', x: 42, y: 62 },
      { productId: 'atlas-armchair', x: 74, y: 58 },
      { productId: 'oasis-coffee-table', x: 55, y: 78 },
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
    products: ['dune-bed', 'mirage-nightstand', 'dune-wool-rug'],
    hotspots: [
      { productId: 'dune-bed', x: 50, y: 60 },
      { productId: 'mirage-nightstand', x: 78, y: 66 },
      { productId: 'dune-wool-rug', x: 40, y: 88 },
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
    products: ['sahara-dining-table', 'palm-dining-chair'],
    hotspots: [
      { productId: 'sahara-dining-table', x: 50, y: 66 },
      { productId: 'palm-dining-chair', x: 30, y: 62 },
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
