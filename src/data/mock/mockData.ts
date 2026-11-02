import type {
  HostelInfo,
  SiteSettings,
  Room,
  Facility,
  MessPlan,
  MessMenuDay,
  GalleryItem,
  Rule,
  Faq,
  Review,
  Notice,
  Inquiry,
  BedAllocation
} from '../../types/index.ts';

export const SADIQABAD_MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55622.34900265778!2d70.095!3d28.3062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39375e2a22ab072d%3A0xc3191cb142646c07!2sSadiqabad%2C%20Rahim%20Yar%20Khan%2C%20Punjab!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk';

export const initialHostelInfo: HostelInfo = {
  id: 1,
  name_en: 'Sadiqabad Student Hostel',
  name_ur: 'صادق آباد اسٹوڈنٹ ہاسٹل',
  tagline_en: 'Safe, Clean & Student-Friendly Residence Near Colleges in Sadiqabad',
  tagline_ur: 'صادق آباد میں کالجز کے قریب محفوظ، صاف ستھرا اور معقول فیس والا اسٹوڈنٹ ہاسٹل',
  about_en:
    'Located on Main College Road near Punjab College and Govt. Post Graduate College Sadiqabad, Sadiqabad Student Hostel provides a disciplined, peaceful, and home-like living environment for students of KFUEIT, local colleges, medical academies, and working professionals. Every room includes orthopedic mattresses, study desks, high-speed fiber internet, RO purified drinking water, 24/7 CCTV surveillance, and automatic UPS/generator backup with honest, student-friendly monthly fees.',
  about_ur:
    'مین کالج روڈ نزد پنجاب کالج اور گورنمنٹ پوسٹ گریجویٹ کالج صادق آباد میں واقع، صادق آباد اسٹوڈنٹ ہاسٹل خواجہ فرید یونیورسٹی، مقامی کالجز، میڈیکل اکیڈمیز کے طلبہ اور ملازمت پیشہ افراد کو گھر جیسا محفوظ، باوقار اور پرسکون ماحول فراہم کرتا ہے۔ مناسب ماہانہ فیس میں آرام دہ بیڈز، اسٹڈی ٹیبلز، تیز رفتار فائبر انٹرنیٹ، آر او فلٹر پانی، ۲۴ گھنٹے سی سی ٹی وی سیکیورٹی اور جنریٹر و یو پی ایس بیک اپ شامل ہیں۔',
  phone: '0304-7861234',
  whatsapp: '0304-7861234',
  email: 'admissions@sadiqabadhostel.pk',
  address_en:
    'Main College Road, Near Punjab College & Govt. Post Graduate College, Sadiqabad, District Rahim Yar Khan',
  address_ur:
    'مین کالج روڈ، نزد پنجاب کالج و گورنمنٹ پوسٹ گریجویٹ کالج، صادق آباد، ضلع رحیم یار خان',
  map_embed_url: SADIQABAD_MAP_EMBED_URL,
  latitude: 28.3062,
  longitude: 70.1302,
  office_hours_en: '8:00 AM – 10:00 PM (Open Daily)',
  office_hours_ur: 'صبح 8:00 تا رات 10:00 بجے (روزانہ کھلا ہے)',
  social_links: {
    facebook: 'https://facebook.com/sadiqabadstudenthostel',
    instagram: 'https://instagram.com/sadiqabadstudenthostel'
  },
  logo_url: 'https://kommodo.ai/i/0IV3pZTemc49bUwLxmEI',
  hostel_type: 'boys'
};

export const initialSiteSettings: SiteSettings = {
  id: 1,
  seo_title_en: 'Sadiqabad Student Hostel – Furnished Rooms from Rs. 5,500/mo, Mess & WiFi',
  seo_title_ur: 'صادق آباد اسٹوڈنٹ ہاسٹل – ۵,۵۰۰ روپے ماہانہ سے فرنشڈ کمرے، میس اور وائی فائی',
  seo_description_en:
    'Book affordable, clean student hostel rooms in Sadiqabad starting from Rs. 5,500/month. Includes fiber WiFi, UPS/generator backup, RO water, optional home-style mess, and 24/7 security near Punjab College.',
  seo_description_ur:
    'صادق آباد میں پنجاب کالج کے قریب ۵,۵۰۰ روپے ماہانہ سے صاف ستھرے فرنشڈ ہاسٹل کمرے، گھر جیسا تازہ میس، فائبر وائی فائی اور ۲۴ گھنٹے سیکیورٹی۔ آج ہی اپنی سیٹ بک کروائیں۔',
  default_language: 'en',
  whatsapp_message_template_en:
    'Assalam o Alaikum, I visited the Sadiqabad Student Hostel website and want to check room availability and fee details.',
  whatsapp_message_template_ur:
    'السلام علیکم، میں نے صادق آباد اسٹوڈنٹ ہاسٹل کی ویب سائٹ دیکھی ہے اور کمرے کی دستیابی اور فیس کی تفصیلات معلوم کرنا چاہتا ہوں۔'
};

export const initialRooms: Room[] = [
  {
    id: 'room-quad-economy',
    slug: 'economy-four',
    name_en: 'Economy 4-Bed Sharing Room',
    name_ur: 'اکانومی ۴ بیڈ شیئرنگ روم',
    room_type: 'quad',
    beds_total: 4,
    beds_available: 2,
    monthly_fee: 5500,
    security_deposit: 3000,
    admission_fee: 1000,
    description_en:
      'Our most budget-friendly room designed for intermediate and BS students looking for clean, comfortable living at an easy monthly rent. Spacious cross-ventilated layout with four sturdy single beds, individual lockable cupboards, twin ceiling fans, room cooler, and full access to the quiet study hall.',
    description_ur:
      'ایف اے، ایف ایس سی اور بی ایس طلبہ کے لیے انتہائی مناسب اور کم ماہانہ فیس والا صاف ستھرا ہوا دار کمرہ۔ چار مضبوط سنگل بیڈز، ہر طالب علم کے لیے الگ تالے والی الماری، دو پنکھے، روم کولر اور اسٹڈی ہال کی مکمل سہولت شامل ہے۔',
    features: [
      { en: '4 Single Beds with Mattresses', ur: 'چار سنگل بیڈز مع آرام دہ گدے' },
      { en: 'Individual Lockable Cupboards', ur: 'ہر طالب علم کے لیے ذاتی لاکر و الماری' },
      { en: 'High-Speed Fiber WiFi & UPS Backup', ur: 'تیز رفتار فائبر وائی فائی اور یو پی ایس بیک اپ' },
      { en: 'Room Cooler & Dual Ceiling Fans', ur: 'روم کولر اور دو سیلنگ فینز' },
      { en: 'Daily Room & Washroom Cleaning', ur: 'کمرے اور واش روم کی روزانہ صفائی' },
      { en: 'Free RO Purified Drinking Water', ur: 'آر او فلٹر شدہ ٹھنڈا پینے کا پانی' }
    ],
    image_urls: [
      '/images/room-quad.jpg',
      '/images/study-hall.jpg',
      '/images/clean-washroom.jpg'
    ],
    is_published: true,
    sort_order: 1
  },
  {
    id: 'room-triple-standard',
    slug: 'triple-sharing',
    name_en: 'Standard 3-Bed Sharing Room',
    name_ur: 'اسٹینڈرڈ ۳ بیڈ شیئرنگ روم',
    room_type: 'triple',
    beds_total: 3,
    beds_available: 1,
    monthly_fee: 6800,
    security_deposit: 3500,
    admission_fee: 1000,
    description_en:
      'Balanced comfort and affordability for three students. Features three neat wooden single beds with fresh bedding, personal steel lockers, a long shared study desk with laptop charging sockets, bright natural daylight, and attached tiled washroom.',
    description_ur:
      'تین طلبہ کے لیے آرام اور مناسب کرائے کا بہترین امتزاج۔ تین لکڑی کے بیڈز، ذاتی اسٹیل لاکرز، لیپ ٹاپ چارجنگ پوائنٹس کے ساتھ لمبا اسٹڈی کاؤنٹر، روشن کھڑکی اور ملحقہ صاف ستھرا واش روم۔',
    features: [
      { en: '3 Wooden Beds + Orthopedic Mattresses', ur: 'تین لکڑی کے بیڈز مع معیاری گدے' },
      { en: 'Long Study Desk & Laptop Sockets', ur: 'اسٹڈی کاؤنٹر اور لیپ ٹاپ چارجنگ ساکٹس' },
      { en: '3 Personal Numbered Lockers', ur: 'تین ذاتی نمبر والے لاکرز' },
      { en: 'Attached Modern Tiled Washroom', ur: 'ملحقہ ٹائلز والا صاف واش روم' },
      { en: 'Fiber WiFi + Generator Backup', ur: 'فائبر وائی فائی اور جنریٹر بیک اپ' }
    ],
    image_urls: [
      '/images/room-triple.jpg',
      '/images/clean-washroom.jpg',
      '/images/mess-dining.jpg'
    ],
    is_published: true,
    sort_order: 2
  },
  {
    id: 'room-double-executive',
    slug: 'double-sharing',
    name_en: 'Executive 2-Bed Sharing Room',
    name_ur: 'ایگزیکٹو ۲ بیڈ شیئرنگ روم',
    room_type: 'double',
    beds_total: 2,
    beds_available: 1,
    monthly_fee: 8500,
    security_deposit: 4000,
    admission_fee: 1500,
    description_en:
      'Our most popular choice for study partners, university seniors, and job holders. Offers generous floor space, two independent study desks with ergonomic chairs, full-height wooden wardrobes, attached washroom with winter hot-water geyser, and uninterrupted power backup.',
    description_ur:
      'دوستوں، یونیورسٹی کے سینئر طلبہ اور ملازمت پیشہ افراد کے لیے سب سے مقبول انتخاب۔ کشادہ کمرہ، دو الگ اسٹڈی ٹیبلز مع آرام دہ کرسیاں، بڑی لکڑی کی الماریاں، گرم پانی کے گیزر والا اٹیچ واش روم اور مکمل بجلی بیک اپ۔',
    features: [
      { en: '2 Separate Wooden Beds & Nightstand', ur: 'دو علیحدہ لکڑی کے بیڈز اور سائیڈ ٹیبل' },
      { en: '2 Dedicated Study Desks & Chairs', ur: 'دو الگ اسٹڈی ٹیبلز اور کرسیاں' },
      { en: 'Full-Size Wooden Wardrobes', ur: 'دو بڑی لکڑی کی الماریاں' },
      { en: 'Attached Bath with Hot Water Geyser', ur: 'گیزر کے ساتھ اٹیچ واش روم' },
      { en: 'High-Speed WiFi & 24/7 Power Backup', ur: 'ہائی اسپیڈ وائی فائی اور ۲۴ گھنٹے بجلی بیک اپ' }
    ],
    image_urls: [
      '/images/room-double.jpg',
      '/images/clean-washroom.jpg',
      '/images/study-hall.jpg'
    ],
    is_published: true,
    sort_order: 3
  },
  {
    id: 'room-single-private',
    slug: 'private-single',
    name_en: 'Private Single Study Room',
    name_ur: 'پرائیویٹ سنگل اسٹڈی روم',
    room_type: 'single',
    beds_total: 2,
    beds_available: 1,
    monthly_fee: 11500,
    security_deposit: 5000,
    admission_fee: 1500,
    description_en:
      'Complete peace and privacy for MDCAT/CSS aspirants, final-year university students, and bank/corporate officers. Furnished with a premium single bed, executive study desk with reading lamp, tall wooden wardrobe, private attached bathroom, and quiet corner placement.',
    description_ur:
      'ایم ڈی کیٹ، سی ایس ایس کے طلبہ، فائنل ایئر اسٹوڈنٹس اور بینک و کارپوریٹ افسران کے لیے مکمل پرائیویسی اور سکون۔ سنگل بیڈ، ریڈنگ لیمپ والا ایگزیکٹو اسٹڈی ڈیسک، بڑی الماری اور ذاتی اٹیچ واش روم۔',
    features: [
      { en: '100% Private Room (Single Occupant)', ur: 'مکمل ذاتی کمرہ (صرف ایک فرد کے لیے)' },
      { en: 'Executive Study Desk, Lamp & Chair', ur: 'ایگزیکٹو اسٹڈی ٹیبل، لیمپ اور آرام دہ کرسی' },
      { en: 'Private Attached Tiled Washroom', ur: 'ذاتی اٹیچ ٹائلز والا واش روم مع گیزر' },
      { en: 'Large Lockable Wooden Wardrobe', ur: 'بڑی تالے والی لکڑی کی الماری' },
      { en: 'Priority Fiber WiFi & UPS Backup', ur: 'تیز فائبر انٹرنیٹ اور بلا تعطل بجلی بیک اپ' }
    ],
    image_urls: [
      '/images/room-single.jpg',
      '/images/clean-washroom.jpg',
      '/images/study-hall.jpg'
    ],
    is_published: true,
    sort_order: 4
  }
];

export const initialFacilities: Facility[] = [
  {
    id: 'fac-1',
    title_en: 'High-Speed Fiber WiFi',
    title_ur: 'تیز رفتار فائبر آپٹک وائی فائی',
    description_en:
      'Dual-router PTCL Flash Fiber internet on every floor for lag-free online lectures, coding, and exam prep.',
    description_ur:
      'آن لائن کلاسز، اسائنمنٹس اور امتحانات کی تیاری کے لیے ہر منزل پر تیز رفتار فائبر آپٹک وائی فائی۔',
    icon_url: 'wifi',
    is_published: true,
    sort_order: 1
  },
  {
    id: 'fac-2',
    title_en: 'RO Purified Drinking Water',
    title_ur: 'آر او فلٹر شدہ ٹھنڈا پانی',
    description_en:
      'In-house multi-stage RO filtration plant with electric water coolers providing clean drinking water 24/7.',
    description_ur:
      'پینے کے صاف، میٹھے اور ٹھنڈے پانی کے لیے آر او فلٹریشن پلانٹ اور واٹر کولرز ہمہ وقت دستیاب۔',
    icon_url: 'droplet',
    is_published: true,
    sort_order: 2
  },
  {
    id: 'fac-3',
    title_en: 'Automatic UPS & Generator Backup',
    title_ur: 'خودکار یو پی ایس اور جنریٹر بیک اپ',
    description_en:
      'Solar-assisted UPS and standby generator keep lights, ceiling fans, and WiFi running during MEPCO outages.',
    description_ur:
      'لوڈ شیڈنگ کے دوران پنکھے، لائٹس اور انٹرنیٹ بلا تعطل جاری رکھنے کے لیے خودکار یو پی ایس اور جنریٹر۔',
    icon_url: 'zap',
    is_published: true,
    sort_order: 3
  },
  {
    id: 'fac-4',
    title_en: 'Hot Water Geysers in Winter',
    title_ur: 'سردیوں میں گرم پانی کے گیزرز',
    description_en:
      'Electric and gas water heaters installed in washrooms for comfortable morning routines from November to February.',
    description_ur:
      'سردیوں کے موسم میں صبح سویرے کالج اور آفس جانے والوں کے لیے واش رومز میں گرم پانی کی سہولت۔',
    icon_url: 'flame',
    is_published: true,
    sort_order: 4
  },
  {
    id: 'fac-5',
    title_en: 'Air Coolers & Ceiling Fans',
    title_ur: 'روم کولرز اور سیلنگ فینز',
    description_en:
      'Every room is fitted with high-RPM ceiling fans and summer desert air coolers suited for Sadiqabad summers.',
    description_ur:
      'صادق آباد کی گرمی کے پیش نظر ہر کمرے میں تیز ہوا دینے والے پنکھے اور ٹھنڈے روم کولرز کا انتظام۔',
    icon_url: 'wind',
    is_published: true,
    sort_order: 5
  },
  {
    id: 'fac-6',
    title_en: 'Home-Style 3-Time Hygienic Mess',
    title_ur: 'گھر جیسا تازہ اور صاف ۳ وقت کا میس',
    description_en:
      'Freshly cooked breakfast, lunch, and dinner served hot in our spotless dining hall using quality spices and halal meat.',
    description_ur:
      'معیاری مصالحہ جات، تازہ سبزیوں اور حلال گوشت سے تیار کردہ گرما گرم کھانا صاف ستھرے ڈائننگ ہال میں۔',
    icon_url: 'utensils',
    is_published: true,
    sort_order: 6
  },
  {
    id: 'fac-7',
    title_en: 'Laundry & Ironing Station',
    title_ur: 'واشنگ مشین اور استری کی سہولت',
    description_en:
      'Self-service washing machines, sunlit rooftop drying lines, and dedicated ironing tables on each floor.',
    description_ur:
      'کپڑے دھونے کے لیے واشنگ مشینز، دھوپ میں سکھانے کی کھلی جگہ اور ہر فلور پر استری ٹیبل موجود۔',
    icon_url: 'shirt',
    is_published: true,
    sort_order: 7
  },
  {
    id: 'fac-8',
    title_en: 'Quiet Study & Library Hall',
    title_ur: 'پرسکون اسٹڈی اور لائبریری ہال',
    description_en:
      'Dedicated distraction-free reading room with individual study tables, bright LED lighting, and laptop power sockets.',
    description_ur:
      'رات دیر تک یکسوئی سے پڑھنے کے لیے خاموش اسٹڈی روم جہاں الگ میز، روشن لائٹس اور چارجنگ پوائنٹس ہیں۔',
    icon_url: 'book-open',
    is_published: true,
    sort_order: 8
  },
  {
    id: 'fac-9',
    title_en: '24/7 HD CCTV Monitoring',
    title_ur: '۲۴ گھنٹے ایچ ڈی سی سی ٹی وی نگرانی',
    description_en:
      'Night-vision HD cameras covering the main gate, bike parking, reception lounge, and every floor corridor.',
    description_ur:
      'مین گیٹ، بائیک پارکنگ، ریسیپشن اور تمام راہداریوں میں ۲۴ گھنٹے ریکارڈنگ والے سی سی ٹی وی کیمرے۔',
    icon_url: 'video',
    is_published: true,
    sort_order: 9
  },
  {
    id: 'fac-10',
    title_en: 'Resident Warden & Gate Guard',
    title_ur: 'رہائشی وارڈن اور ۲۴ گھنٹے گارڈ',
    description_en:
      'Full-time resident warden and uniformed gatekeeper maintaining visitor logs, discipline, and emergency support.',
    description_ur:
      'ہمہ وقت موجود رہائشی وارڈن اور تربیت یافتہ سیکیورٹی گارڈ جو انٹری رجسٹر اور ڈسپلن کی نگرانی کرتے ہیں۔',
    icon_url: 'shield-check',
    is_published: true,
    sort_order: 10
  },
  {
    id: 'fac-11',
    title_en: 'Indoor Bike & Cycle Parking',
    title_ur: 'محفوظ انڈور موٹر سائیکل پارکنگ',
    description_en:
      'Covered, gated ground-floor parking area inside the boundary wall to keep motorcycles and bicycles safe.',
    description_ur:
      'طلبہ اور ملازمین کی موٹر سائیکلوں کو دھوپ اور چوری سے محفوظ رکھنے کے لیے چاردیواری کے اندر چھت والی پارکنگ۔',
    icon_url: 'bike',
    is_published: true,
    sort_order: 11
  },
  {
    id: 'fac-12',
    title_en: 'Daily Housekeeping & Sanitation',
    title_ur: 'روزانہ صفائی اور جراثیم کش سینیٹائزیشن',
    description_en:
      'Dedicated cleaning staff sweeps rooms, corridors, and bathrooms every morning with phenyl and disinfectant.',
    description_ur:
      'صفائی کا عملہ روزانہ صبح کمروں، برآمدوں اور واش رومز کی فینائل اور جراثیم کش محلول سے صفائی کرتا ہے۔',
    icon_url: 'sparkles',
    is_published: true,
    sort_order: 12
  },
  {
    id: 'fac-13',
    title_en: 'Fully Furnished Comfortable Rooms',
    title_ur: 'مکمل فرنشڈ اور ہوا دار کمرے',
    description_en:
      'Every room comes ready with wooden beds, orthopedic mattresses, study desks, chairs, and personal lockable cupboards.',
    description_ur:
      'ہر کمرے میں لکڑی کے مضبوط بیڈز، آرام دہ گدے، اسٹڈی ٹیبل، کرسیاں اور ذاتی لاکر والی الماریاں موجود ہیں۔',
    icon_url: 'bed',
    is_published: true,
    sort_order: 13
  }
];

export const initialMessPlans: MessPlan[] = [
  {
    id: 'mess-1',
    name_en: '3-Time Full Home-Style Mess',
    name_ur: 'تین وقت کا مکمل گھریلو میس',
    price_monthly: 7500,
    description_en:
      'Daily fresh breakfast, lunch, and dinner including 4 chicken dishes per week (Karahi, Biryani, Pulao, Qorma) and hot tandoori rotis.',
    description_ur:
      'روزانہ ناشتہ، دوپہر اور رات کا تازہ کھانا جس میں ہفتے میں ۴ بار چکن ڈشز (بریانی، کڑاہی، پلاؤ، قورمہ) اور گرم روٹیاں شامل ہیں۔',
    is_active: true,
    sort_order: 1
  },
  {
    id: 'mess-2',
    name_en: '2-Time Student Plan (Breakfast + Dinner)',
    name_ur: 'دو وقت کا اسٹوڈنٹ پیکیج (ناشتہ اور رات کا کھانا)',
    price_monthly: 5500,
    description_en:
      'Designed for college, university, and job residents who stay on campus at midday. Includes full morning breakfast and hot evening dinner.',
    description_ur:
      'صبح کالج، یونیورسٹی یا جاب پر جانے والوں کے لیے بہترین اور کم خرچ پیکیج: صبح کا بھرپور ناشتہ اور رات کا تازہ کھانا۔',
    is_active: true,
    sort_order: 2
  },
  {
    id: 'mess-3',
    name_en: 'Room Only (Optional / Self Mess)',
    name_ur: 'صرف رہائش (بغیر میس کے)',
    price_monthly: 0,
    description_en:
      'Mess is 100% optional. Pay only your monthly room rent and manage your own meals or join the mess later any month.',
    description_ur:
      'میس کی سہولت مکمل طور پر اختیاری ہے۔ آپ صرف کمرے کا ماہانہ کرایہ ادا کریں اور جب چاہیں میس شروع یا بند کروا لیں۔',
    is_active: true,
    sort_order: 3
  }
];

export const initialMessMenu: MessMenuDay[] = [
  {
    id: 'menu-1',
    day_of_week: 1,
    breakfast_en: 'Crispy Paratha, Omelette / Half-Fry Egg & Karak Milk Tea',
    breakfast_ur: 'خستہ پراٹھا، آملیٹ / ہاف فرائی انڈا اور کڑک دودھ پتی چائے',
    lunch_en: 'Yellow Daal Tadka with Steamed Basmati Rice, Salad & Pickle',
    lunch_ur: 'تڑکے والی دال چاول مع تازہ سلاد اور اچار',
    dinner_en: 'Chicken Aloo Shorba / Aloo Gobi, Hot Rotis & Mint Raita',
    dinner_ur: 'چکن آلو شوربہ / آلو گوبھی، گرما گرم روٹیاں اور پودینہ رائتہ'
  },
  {
    id: 'menu-2',
    day_of_week: 2,
    breakfast_en: 'Lahori Chana Masala, Fresh Paratha & Hot Tea',
    breakfast_ur: 'لاہوری چنا مصالحہ، تازہ پراٹھا اور گرما گرم چائے',
    lunch_en: 'Seasonal Mix Sabzi with Fresh Chapati & Yogurt Raita',
    lunch_ur: 'موسمی مکس سبزی مع تازہ چپاتی اور رائتہ',
    dinner_en: 'Special Chicken Karahi, Tandoori Rotis & Fresh Green Salad',
    dinner_ur: 'اسپیشل چکن کڑاہی، تندوری روٹیاں اور تازہ سلاد'
  },
  {
    id: 'menu-3',
    day_of_week: 3,
    breakfast_en: 'Aloo Wala Paratha, Fresh Dahi (Yogurt) & Elaichi Tea',
    breakfast_ur: 'آلو والا پراٹھا، تازہ دہی اور الائچی چائے',
    lunch_en: 'Shahi Daal Mash Fry, Hot Rotis & Onion Lemon Salad',
    lunch_ur: 'شاہی فرائی دال ماش، گرم روٹیاں اور پیاز لیموں سلاد',
    dinner_en: 'Karachi Style Chicken Biryani with Zeera Raita & Salad',
    dinner_ur: 'کراچی اسٹائل چکن بریانی مع زیرہ رائتہ اور سلاد'
  },
  {
    id: 'menu-4',
    day_of_week: 4,
    breakfast_en: 'Paratha, Boiled / Fried Egg & Karak Chai',
    breakfast_ur: 'پراٹھا، ابلا یا فرائی انڈا اور کڑک چائے',
    lunch_en: 'Kari Pakora with Boiled White Rice & Green Chutney',
    lunch_ur: 'کڑھی پکوڑا مع ابلے سفید چاول اور ہری چٹنی',
    dinner_en: 'Minced Aloo Qeema Masala with Fresh Tandoori Rotis',
    dinner_ur: 'لذیذ آلو قیمہ مصالحہ اور گرما گرم تندوری روٹیاں'
  },
  {
    id: 'menu-5',
    day_of_week: 5,
    breakfast_en: 'Friday Special Egg Bhurji, Paratha & Milk Tea',
    breakfast_ur: 'جمعہ اسپیشل انڈا کھگینہ، پراٹھا اور دودھ پتی چائے',
    lunch_en: 'Jummah Special Chicken Yakhni Pulao, Shami Kabab & Raita',
    lunch_ur: 'جمعہ اسپیشل چکن یخنی پلاؤ، شامی کباب، رائتہ اور سلاد',
    dinner_en: 'Daal Chana Fry with Desi Ghee Tarka & Hot Rotis',
    dinner_ur: 'دیسی گھی کے تڑکے والی دال چنا اور گرم روٹیاں'
  },
  {
    id: 'menu-6',
    day_of_week: 6,
    breakfast_en: 'Lachha Paratha, Chana Gravy & Hot Tea',
    breakfast_ur: 'لچھا پراٹھا، چنے کا سالن اور گرم چائے',
    lunch_en: 'White Lobia / Rajma Masala with Steamed Rice & Salad',
    lunch_ur: 'سفید لوبیا مصالحہ مع ابلے چاول اور سلاد',
    dinner_en: 'Degi Chicken Qorma with Fresh Naan / Roti & Raita',
    dinner_ur: 'دیگی چکن قورمہ مع گرم نان / روٹی اور رائتہ'
  },
  {
    id: 'menu-0',
    day_of_week: 0,
    breakfast_en: 'Sunday Special Halwa Puri, Chana Bhaji & Sweet Lassi / Tea',
    breakfast_ur: 'اتوار اسپیشل حلوہ پوری، چنے بھاجی اور میٹھی لسی / چائے',
    lunch_en: 'Light Daal Moong Masoor with Jeera Rice & Pickle',
    lunch_ur: 'ہلکی پھلکی دال مونگ مسور مع زیرہ رائس اور اچار',
    dinner_en: 'Chicken Palak / Kofta Curry with Hot Rotis & Kheer Dessert',
    dinner_ur: 'چکن پالک / کوفتہ کری مع گرم روٹیاں اور میٹھی کھیر'
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    category: 'building',
    image_url: '/images/hero-hostel.jpg',
    caption_en: 'Front courtyard and three-story main building of Sadiqabad Student Hostel',
    caption_ur: 'صادق آباد اسٹوڈنٹ ہاسٹل کی تین منزلہ عمارت اور سرسبز لان کا بیرونی منظر',
    is_published: true,
    sort_order: 1
  },
  {
    id: 'gal-2',
    category: 'rooms',
    image_url: '/images/room-single.jpg',
    caption_en: 'Private Single Study Room with dedicated wooden desk, reading lamp, and wardrobe',
    caption_ur: 'پرائیویٹ سنگل اسٹڈی روم مع اسٹڈی ڈیسک، ریڈنگ لیمپ اور بڑی الماری',
    is_published: true,
    sort_order: 2
  },
  {
    id: 'gal-3',
    category: 'rooms',
    image_url: '/images/room-double.jpg',
    caption_en: 'Executive 2-Bed Sharing Room with separate beds, wardrobes, and twin study stations',
    caption_ur: 'ایگزیکٹو ڈبل شیئرنگ روم مع الگ بیڈز، الماریاں اور دو اسٹڈی ڈیسک',
    is_published: true,
    sort_order: 3
  },
  {
    id: 'gal-4',
    category: 'rooms',
    image_url: '/images/room-triple.jpg',
    caption_en: 'Well-ventilated 3-Bed Sharing Room with personal numbered lockers and study counter',
    caption_ur: 'ہوا دار ۳ بیڈ شیئرنگ روم مع ذاتی نمبر والے لاکرز اور اسٹڈی کاؤنٹر',
    is_published: true,
    sort_order: 4
  },
  {
    id: 'gal-5',
    category: 'rooms',
    image_url: '/images/room-quad.jpg',
    caption_en: 'Economy 4-Bed Sharing Room — spacious, spotless, and easy on a student budget',
    caption_ur: 'اکانومی ۴ بیڈ شیئرنگ روم — کشادہ، صاف ستھرا اور طلبہ کے بجٹ کے عین مطابق',
    is_published: true,
    sort_order: 5
  },
  {
    id: 'gal-6',
    category: 'mess',
    image_url: '/images/mess-dining.jpg',
    caption_en: 'Hygienic resident dining hall serving fresh home-style meals three times daily',
    caption_ur: 'صاف ستھرا ڈائننگ ہال جہاں روزانہ تین وقت تازہ گھریلو کھانا پیش کیا جاتا ہے',
    is_published: true,
    sort_order: 6
  },
  {
    id: 'gal-7',
    category: 'study_area',
    image_url: '/images/study-hall.jpg',
    caption_en: 'Dedicated quiet study hall and library equipped with laptop sockets and fiber WiFi',
    caption_ur: 'خاموش اور روشن اسٹڈی ہال مع لیپ ٹاپ چارجنگ ساکٹس اور فائبر وائی فائی',
    is_published: true,
    sort_order: 7
  },
  {
    id: 'gal-8',
    category: 'bathrooms',
    image_url: '/images/clean-washroom.jpg',
    caption_en: 'Modern ceramic-tiled washroom with winter hot-water geyser and daily sanitation',
    caption_ur: 'جدید ٹائلز والا صاف واش روم مع سردیوں کے لیے گرم پانی کا گیزر',
    is_published: true,
    sort_order: 8
  }
];

export const initialRules: Rule[] = [
  {
    id: 'rule-1',
    text_en:
      'Main gate closes strictly at 10:00 PM. Late entry for academy classes or travel requires prior notice to the resident warden.',
    text_ur:
      'مین گیٹ رات ۱۰:۰۰ بجے بند ہو جاتا ہے۔ اکیڈمی یا سفر کی وجہ سے تاخیر کی صورت میں وارڈن کو پیشگی اطلاع دینا لازمی ہے۔',
    is_published: true,
    sort_order: 1
  },
  {
    id: 'rule-2',
    text_en:
      'Visitors and parents are welcomed in the ground-floor reception lounge between 9:00 AM and 8:00 PM after entry in the gate register.',
    text_ur:
      'والدین اور مہمانوں سے ملاقات صبح ۹:۰۰ سے شام ۸:۰۰ بجے تک گراؤنڈ فلور ریسیپشن لاؤنج میں گیٹ رجسٹر میں اندراج کے بعد کی جا سکتی ہے۔',
    is_published: true,
    sort_order: 2
  },
  {
    id: 'rule-3',
    text_en:
      'Smoking, vapes, naswar, gutka, and all intoxicants are 100% prohibited inside rooms, washrooms, and hostel premises.',
    text_ur:
      'ہاسٹل کی حدود، کمروں اور واش رومز میں سگریٹ نوشی، ویپ، نسوار، گٹکا اور ہر قسم کے نشے پر مکمل پابندی ہے۔',
    is_published: true,
    sort_order: 3
  },
  {
    id: 'rule-4',
    text_en:
      'Quiet study hours start at 9:30 PM daily. Loud music, speakerphone calls in corridors, or disturbing roommates is strictly disallowed.',
    text_ur:
      'روزانہ رات ۹:۳۰ بجے کے بعد خاموشی کے اوقات شروع ہو جاتے ہیں۔ اونچی آواز میں میوزک یا راہداری میں شور منع ہے۔',
    is_published: true,
    sort_order: 4
  },
  {
    id: 'rule-5',
    text_en:
      'Monthly room rent and chosen mess plan dues must be paid between the 1st and 7th of each month against an official receipt.',
    text_ur:
      'ماہانہ کمرے کا کرایہ اور منتخب کردہ میس فیس ہر مہینے کی یکم سے ۷ تاریخ کے درمیان جمع کروا کر باقاعدہ رسید حاصل کریں۔',
    is_published: true,
    sort_order: 5
  },
  {
    id: 'rule-6',
    text_en:
      'Heavy heating coils, electric stoves, or unauthorized room alterations are not allowed for fire and electrical safety.',
    text_ur:
      'آگ اور شارٹ سرکٹ سے بچاؤ کے لیے کمرے میں الیکٹرک چولہا، راڈ یا ہیوی ہیٹر لگانے کی اجازت نہیں ہے۔',
    is_published: true,
    sort_order: 6
  },
  {
    id: 'rule-7',
    text_en:
      'A minimum 15-day advance notice is required before vacating a seat in order to claim your 100% security deposit refund.',
    text_ur:
      'قابل واپسی سیکیورٹی ڈپازٹ مکمل واپس لینے کے لیے کمرہ چھوڑنے سے کم از کم ۱۵ دن پہلے مطلع کرنا ضروری ہے۔',
    is_published: true,
    sort_order: 7
  },
  {
    id: 'rule-8',
    text_en:
      'Every resident must submit a CNIC / B-Form copy, parent/guardian contact number, and college card or job employment proof at admission.',
    text_ur:
      'داخلے کے وقت شناختی کارڈ یا بے فارم کی کاپی، والد یا سرپرست کا فون نمبر اور کالج کارڈ جمع کروانا لازمی ہے۔',
    is_published: true,
    sort_order: 8
  }
];

export const initialFaqs: Faq[] = [
  {
    id: 'faq-1',
    question_en: 'What documents are required at the time of admission?',
    question_ur: 'ہاسٹل میں داخلے کے وقت کون سے کاغذات درکار ہوتے ہیں؟',
    answer_en:
      'Bring 1 copy of the student CNIC or B-Form, 1 copy of father/guardian CNIC, 2 passport-size photographs, and your college admission slip, university card, or job ID card.',
    answer_ur:
      'طالب علم کے شناختی کارڈ یا بے فارم کی کاپی، والد یا سرپرست کے شناختی کارڈ کی کاپی، ۲ پاسپورٹ سائز تصاویر اور کالج سلپ یا اسٹوڈنٹ/جاب کارڈ ساتھ لائیں۔',
    is_published: true,
    sort_order: 1
  },
  {
    id: 'faq-2',
    question_en: 'Are WiFi, water, and UPS/generator backup included in the monthly rent?',
    question_ur: 'کیا وائی فائی، فلٹر پانی اور بجلی بیک اپ ماہانہ فیس میں شامل ہیں؟',
    answer_en:
      'Yes! High-speed fiber WiFi, RO drinking water, daily room cleaning, regular electricity (fans & lights), and UPS/generator backup are all included in the listed monthly room rent with no hidden charges.',
    answer_ur:
      'جی ہاں! فائبر وائی فائی، آر او فلٹر پانی، روزانہ صفائی، پنکھے و لائٹس کی بجلی اور یو پی ایس/جنریٹر بیک اپ ماہانہ کرائے میں شامل ہیں، کوئی پوشیدہ چارجز نہیں۔',
    is_published: true,
    sort_order: 2
  },
  {
    id: 'faq-3',
    question_en: 'Is the hostel mess mandatory, or can I book a room without mess?',
    question_ur: 'کیا میس کا کھانا لینا لازمی ہے یا صرف کمرہ بھی مل سکتا ہے؟',
    answer_en:
      'Mess is completely optional. You can choose our 3-Time Plan (Rs. 7,500/mo), 2-Time Student Plan (Rs. 5,500/mo), or Room Only (Rs. 0 mess fee) and change your plan at the start of any month.',
    answer_ur:
      'میس بالکل اختیاری ہے۔ آپ ۳ وقت کا کھانا (۷,۵۰۰ روپے)، ۲ وقت کا اسٹوڈنٹ پیکیج (۵,۵۰۰ روپے) یا بغیر میس صرف کمرہ منتخب کر سکتے ہیں۔',
    is_published: true,
    sort_order: 3
  },
  {
    id: 'faq-4',
    question_en: 'How does the refundable security deposit work?',
    question_ur: 'سیکیورٹی ڈپازٹ کی واپسی کا طریقہ کار کیا ہے؟',
    answer_en:
      'Your security deposit (Rs. 3,000 to Rs. 5,000 depending on room type) is 100% refundable on checkout when you inform the office 15 days in advance and hand over your room key and locker in good condition.',
    answer_ur:
      'کمرے کے مطابق لی گئی سیکیورٹی (۳,۰۰۰ تا ۵,۰۰۰ روپے) ۱۵ دن پہلے اطلاع دے کر کمرہ اور لاکر درست حالت میں واپس کرنے پر سو فیصد واپس کر دی جاتی ہے۔',
    is_published: true,
    sort_order: 4
  },
  {
    id: 'faq-5',
    question_en: 'How far is the hostel from Punjab College, Govt. College, and KFUEIT bus route?',
    question_ur: 'ہاسٹل پنجاب کالج، گورنمنٹ کالج اور خواجہ فرید یونیورسٹی بس روٹ سے کتنا قریب ہے؟',
    answer_en:
      'We are right on Main College Road — a 3 to 5 minute walk to Punjab College, Superior/KIPS academies, and Govt. Post Graduate College Sadiqabad, and a 2-minute walk from the KFUEIT university bus pickup point.',
    answer_ur:
      'ہاسٹل مین کالج روڈ پر واقع ہے جہاں سے پنجاب کالج، گورنمنٹ پوسٹ گریجویٹ کالج اور اکیڈمیز صرف ۳ سے ۵ منٹ پیدل فاصلے پر ہیں، اور خواجہ فرید یونیورسٹی بس اسٹاپ ۲ منٹ کی دوری پر ہے۔',
    is_published: true,
    sort_order: 5
  },
  {
    id: 'faq-6',
    question_en: 'Can two or three classmates reserve beds together in the same room?',
    question_ur: 'کیا دو یا تین کلاس فیلوز ایک ہی کمرے میں اکٹھے سیٹ بک کروا سکتے ہیں؟',
    answer_en:
      'Yes! Mention your classmates’ names in the booking inquiry form or on WhatsApp, and our warden will allocate adjacent beds in the same Double, Triple, or 4-Sharing room.',
    answer_ur:
      'جی بالکل! بکنگ فارم یا واٹس ایپ پر اپنے دوستوں کے نام بتا دیں، وارڈن آپ کو ایک ہی ڈبل، ٹرپل یا ۴ شیئرنگ کمرے میں اکٹھی سیٹیں الاٹ کر دیں گے۔',
    is_published: true,
    sort_order: 6
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    name: 'M. Huzaifa · FSc, Punjab College Sadiqabad',
    rating: 5,
    comment_en:
      'Moved here from Kandhkot for my 1st year studies. Punjab College is a 4-minute walk away, rooms are cleaned every morning, and the quiet study hall helped me score 91% in board exams.',
    comment_ur:
      'میں کندھ کوٹ سے ایف ایس سی کے لیے یہاں آیا تھا۔ پنجاب کالج صرف ۴ منٹ پیدل فاصلے پر ہے، کمرے روزانہ صاف ہوتے ہیں اور خاموش اسٹڈی ہال کی بدولت میرے امتحانات شاندار ہوئے۔',
    is_visible: true,
    created_at: '2026-09-18T12:00:00Z'
  },
  {
    id: 'rev-2',
    name: 'Tariq Mehmood · Parent from Ahmadpur Lama',
    rating: 5,
    comment_en:
      'As a father, security and discipline were my biggest concerns. The 10 PM gate rule, CCTV cameras, and polite resident warden gave our family complete peace of mind at a very reasonable monthly fee.',
    comment_ur:
      'بحیثیت والد سیکیورٹی اور ماحول میری سب سے بڑی ترجیح تھی۔ رات ۱۰ بجے گیٹ کی پابندی، سی سی ٹی وی کیمرے اور وارڈن کے تعاون سے ہمیں مکمل اطمینان ملا۔',
    is_visible: true,
    created_at: '2026-08-24T10:30:00Z'
  },
  {
    id: 'rev-3',
    name: 'Usama Rasheed · BS Computer Science, KFUEIT',
    rating: 5,
    comment_en:
      'The university bus stop is right down the road, and the fiber WiFi plus UPS backup never let me miss an online lab submission. The 2-time student mess plan saves me a lot of money every month.',
    comment_ur:
      'یونیورسٹی بس اسٹاپ بالکل قریب ہے اور فائبر وائی فائی و یو پی ایس بیک اپ کی وجہ سے آن لائن اسائنمنٹس میں کبھی مسئلہ نہیں بنا۔ دو وقت والا میس پیکیج بہت مناسب ہے۔',
    is_visible: true,
    created_at: '2026-07-15T14:15:00Z'
  },
  {
    id: 'rev-4',
    name: 'Salman Akram · Branch Operations Officer, Meezan Bank',
    rating: 5,
    comment_en:
      'I booked the Private Single Study Room after my posting in Sadiqabad. Spotless attached washroom with hot water geyser in winter, secure bike parking, and genuinely home-like dinner.',
    comment_ur:
      'صادق آباد پوسٹنگ کے بعد میں نے پرائیویٹ سنگل روم لیا۔ اٹیچ واش روم میں گیزر، محفوظ بائیک پارکنگ اور رات کا گھر جیسا کھانا لاجواب ہے۔',
    is_visible: true,
    created_at: '2026-06-11T09:00:00Z'
  }
];

export const initialNotices: Notice[] = [
  {
    id: 'notice-1',
    text_en:
      'Admissions Open for New Session 2026–27! Economy 4-Sharing from Rs. 5,500/mo & Executive Double Rooms available near Punjab College Sadiqabad.',
    text_ur:
      'نئے تعلیمی سیشن ۲۰۲۶–۲۷ کے داخلے جاری ہیں! پنجاب کالج کے قریب ۵,۵۰۰ روپے ماہانہ سے صاف فرنشڈ کمرے دستیاب ہیں۔',
    starts_at: new Date(Date.now() - 86400000).toISOString(),
    ends_at: new Date(Date.now() + 90 * 86400000).toISOString(),
    is_active: true
  }
];

export const initialInquiries: Inquiry[] = [
  {
    id: 'inq-1',
    name: 'Hafiz Anas Raza',
    phone: '0301-7458921',
    room_type: 'double',
    wants_mess: true,
    move_in_date: '2026-11-10',
    category: 'student',
    message:
      '1st year Pre-Engineering student at Punjab College Sadiqabad. Looking for 2 beds in Executive Double Sharing with my classmate.',
    status: 'new',
    admin_notes: 'Call after 3 PM once college classes finish.',
    source_lang: 'en',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'inq-2',
    name: 'Muhammad Zubair',
    phone: '0345-8823419',
    room_type: 'single',
    wants_mess: true,
    move_in_date: '2026-11-15',
    category: 'job',
    message: 'Pharmacist at THQ Hospital Sadiqabad. Need Private Single Study Room with bike parking.',
    status: 'contacted',
    admin_notes: 'Shared location pin on WhatsApp. Visiting hostel this evening at 6 PM.',
    source_lang: 'ur',
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];

export const initialBedAllocations: BedAllocation[] = [
  {
    id: 'bed-alloc-1',
    room_id: 'room-quad-economy',
    room_slug: 'economy-four',
    bed_number: 1,
    unit_label: 'Room 101',
    status: 'occupied',
    resident_name: 'Muhammad Huzaifa',
    resident_phone: '0301-7458921',
    cnic_or_id: '31304-8821943-1',
    resident_category: 'student',
    institution_or_workplace: 'Punjab College Sadiqabad (FSc Pre-Med)',
    check_in_date: '2026-09-01',
    duration_value: 10,
    duration_unit: 'months',
    check_out_date: '2027-07-01',
    agreed_rent: 5500,
    security_deposit: 3000,
    payment_status: 'paid',
    notes: 'Regular 1st year board session student; 2-time mess plan active.'
  },
  {
    id: 'bed-alloc-2',
    room_id: 'room-quad-economy',
    room_slug: 'economy-four',
    bed_number: 2,
    unit_label: 'Room 101',
    status: 'occupied',
    resident_name: 'Danish Raza',
    resident_phone: '0306-4419283',
    cnic_or_id: '31304-5519082-7',
    resident_category: 'student',
    institution_or_workplace: 'KIPS Academy Sadiqabad (MDCAT Prep)',
    check_in_date: '2026-10-15',
    duration_value: 45,
    duration_unit: 'days',
    check_out_date: '2026-11-29',
    agreed_rent: 5500,
    security_deposit: 3000,
    payment_status: 'paid',
    notes: 'Short-term 45-day MDCAT entry test session.'
  },
  {
    id: 'bed-alloc-3',
    room_id: 'room-triple-standard',
    room_slug: 'triple-sharing',
    bed_number: 1,
    unit_label: 'Room 102',
    status: 'occupied',
    resident_name: 'Usama Rasheed',
    resident_phone: '0312-6638910',
    cnic_or_id: 'KFUEIT-BSCS-23',
    resident_category: 'student',
    institution_or_workplace: 'KFUEIT Rahim Yar Khan (BS Computer Science)',
    check_in_date: '2026-09-05',
    duration_value: 6,
    duration_unit: 'months',
    check_out_date: '2027-03-05',
    agreed_rent: 6800,
    security_deposit: 3500,
    payment_status: 'paid',
    notes: 'Fall semester booking; uses university shuttle point.'
  },
  {
    id: 'bed-alloc-4',
    room_id: 'room-triple-standard',
    room_slug: 'triple-sharing',
    bed_number: 2,
    unit_label: 'Room 102',
    status: 'occupied',
    resident_name: 'Ahsanullah Mahar',
    resident_phone: '0333-7291045',
    cnic_or_id: '45102-9930124-3',
    resident_category: 'student',
    institution_or_workplace: 'Govt. Post Graduate College Sadiqabad',
    check_in_date: '2026-10-22',
    duration_value: 20,
    duration_unit: 'days',
    check_out_date: '2026-11-11',
    agreed_rent: 4800,
    security_deposit: 2000,
    payment_status: 'partial',
    notes: '20-day annual examination stay; balance Rs. 1,500 due this week.'
  },
  {
    id: 'bed-alloc-5',
    room_id: 'room-double-executive',
    room_slug: 'double-sharing',
    bed_number: 1,
    unit_label: 'Room 201',
    status: 'occupied',
    resident_name: 'Hafiz Talha Mahmood',
    resident_phone: '0300-8745129',
    cnic_or_id: '31303-6412098-5',
    resident_category: 'job_holder',
    institution_or_workplace: 'Fauji Fertilizer Company (FFC Goth Machhi)',
    check_in_date: '2026-08-01',
    duration_value: 6,
    duration_unit: 'months',
    check_out_date: '2027-02-01',
    agreed_rent: 8500,
    security_deposit: 4000,
    payment_status: 'pending',
    notes: 'Junior trainee engineer; November monthly rent due before 7th.'
  },
  {
    id: 'bed-alloc-6',
    room_id: 'room-single-private',
    room_slug: 'private-single',
    bed_number: 1,
    unit_label: 'Room 202',
    status: 'occupied',
    resident_name: 'Salman Akram',
    resident_phone: '0321-5582901',
    cnic_or_id: '31304-2190443-9',
    resident_category: 'job_holder',
    institution_or_workplace: 'Meezan Bank Sadiqabad Branch',
    check_in_date: '2026-06-15',
    duration_value: 12,
    duration_unit: 'months',
    check_out_date: '2027-06-15',
    agreed_rent: 11500,
    security_deposit: 5000,
    payment_status: 'paid',
    notes: 'Branch operations officer; indoor motorcycle parking slot #3.'
  }
];

