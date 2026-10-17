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
  Inquiry
} from '../../types/index.ts';

export const initialHostelInfo: HostelInfo = {
  id: 1,
  name_en: 'Sadiqabad Student Hostel',
  name_ur: 'صادق آباد اسٹوڈنٹ ہاسٹل',
  tagline_en: 'Safe, Clean & Comfortable Student Hostel in Sadiqabad',
  tagline_ur: 'صادق آباد میں محفوظ، صاف ستھرا اور پرسکون اسٹوڈنٹ ہاسٹل',
  about_en: 'Established to provide students and young professionals with a disciplined, peaceful, and fully supported environment in Sadiqabad. We combine comfortable furnished lodging with high-speed internet, power backup, and fresh home-style meals, ensuring residents can concentrate on their studies and careers without domestic worries.',
  about_ur: 'صادق آباد میں طلبہ اور ملازمت پیشہ افراد کو ایک باوقار، محفوظ اور مکمل سہولیات سے آراستہ رہائش فراہم کرنے کے لیے قائم کیا گیا۔ ہم آرام دہ فرنشڈ رہائش، تیز ترین انٹرنیٹ، بجلی کے بلا تعطل بیک اپ اور گھر جیسے تازہ کھانے کے ساتھ ایک ایسا ماحول فراہم کرتے ہیں جہاں آپ یکسوئی کے ساتھ اپنے مستقبل پر توجہ مرکوز کر سکیں۔',
  phone: '0300-1234567',
  whatsapp: '0300-1234567',
  email: 'info@sadiqabadhostel.pk',
  address_en: 'Near Punjab College, Kacha Sadiq Road, Sadiqabad, District Rahim Yar Khan, Punjab',
  address_ur: 'پنجاب کالج کے قریب، کچا صادق روڈ، صادق آباد، ضلع رحیم یار خان، پنجاب',
  map_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111244.69800531557!2d70.05267398188164!3d28.307525283457193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39375e2a22ab072d%3A0xc3191cb142646c07!2sSadiqabad%2C%20Rahim%20Yar%20Khan%2C%20Punjab!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s',
  latitude: 28.3075,
  longitude: 70.1265,
  office_hours_en: '9:00 AM – 9:00 PM (Daily)',
  office_hours_ur: 'صبح 9:00 تا رات 9:00 (روزانہ)',
  social_links: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com'
  },
  logo_url: 'https://kommodo.ai/i/0IV3pZTemc49bUwLxmEI',
  hostel_type: 'boys'
};

export const initialSiteSettings: SiteSettings = {
  id: 1,
  seo_title_en: 'Sadiqabad Student Hostel – Rooms, Mess, WiFi & Security',
  seo_title_ur: 'صادق آباد اسٹوڈنٹ ہاسٹل – فرنشڈ کمرے، میس اور وائی فائی',
  seo_description_en: 'Affordable, secure student hostel in Sadiqabad with comfortable furnished rooms, hygienic mess, high-speed WiFi, generator backup, and 24/7 CCTV surveillance.',
  seo_description_ur: 'صادق آباد میں سستے اور محفوظ ہاسٹل کمرے، میس، تیز رفتار وائی فائی اور جنریٹر بیک اپ کے ساتھ۔ فیس دیکھیں اور آج ہی اپنی سیٹ بک کروائیں۔',
  default_language: 'en',
  whatsapp_message_template_en: 'Assalam o Alaikum, I would like to inquire about room availability and fee structure at Sadiqabad Student Hostel.',
  whatsapp_message_template_ur: 'السلام علیکم، میں صادق آباد اسٹوڈنٹ ہاسٹل میں کمرے کی دستیابی اور فیس کے متعلق معلومات لینا چاہتا ہوں۔'
};

export const initialRooms: Room[] = [
  {
    id: 'room-1',
    slug: 'private-single',
    name_en: 'Private Single Room',
    name_ur: 'پرائیویٹ سنگل روم',
    room_type: 'single',
    beds_total: 1,
    beds_available: 2,
    monthly_fee: 15000,
    security_deposit: 5000,
    admission_fee: 2000,
    description_en: 'Exclusive private room designed for complete focus and privacy. Features a comfortable single bed with orthopedic mattress, dedicated wooden study table with lamp, large wardrobe, high-speed fiber WiFi, and window ventilation.',
    description_ur: 'مکمل پرائیویسی اور یکسوئی سے پڑھائی کے خواہشمند طلبہ کے لیے پرائیویٹ سنگل روم۔ آرام دہ بیڈ، معیاری گدا، اسٹڈی ٹیبل مع کرسی، ذاتی الماری، تیز رفتار وائی فائی اور روشن ہوا دار کھڑکی۔',
    features: [
      { en: 'Single Bed + Premium Mattress', ur: 'سنگل بیڈ مع معیاری گدا' },
      { en: 'Dedicated Study Table & Chair', ur: 'ذاتی اسٹڈی ٹیبل اور کرسی' },
      { en: 'Lockable Wooden Wardrobe', ur: 'تالا والی لکڑی کی الماری' },
      { en: 'High-speed Fiber WiFi', ur: 'تیز رفتار فائبر وائی فائی' },
      { en: 'Room Cooler & Ceiling Fan', ur: 'روم کولر اور چھت کا پنکھا' },
      { en: 'Attached / Close Clean Washroom', ur: 'صاف ستھرا واش روم' }
    ],
    image_urls: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ],
    is_published: true,
    sort_order: 1
  },
  {
    id: 'room-2',
    slug: 'double-sharing',
    name_en: 'Double Sharing Room',
    name_ur: 'ڈبل شیئرنگ روم',
    room_type: 'double',
    beds_total: 2,
    beds_available: 4,
    monthly_fee: 9000,
    security_deposit: 5000,
    admission_fee: 2000,
    description_en: 'Well-spaced room for two residents, perfect for friends or study partners. Includes separate individual beds, independent study spaces, twin wardrobes, and excellent cross-ventilation.',
    description_ur: 'دو افراد کے لیے کشادہ اور آرام دہ کمرہ، کلاس فیلوز یا دوستوں کے لیے بہترین انتخاب۔ الگ الگ بیڈز، الگ اسٹڈی ٹیبلز اور ذاتی الماریاں۔',
    features: [
      { en: '2 Individual Beds + Mattresses', ur: 'دو الگ بیڈز مع گدے' },
      { en: 'Dual Study Desks & Chairs', ur: 'دو علیحدہ اسٹڈی ٹیبلز' },
      { en: 'Two Separate Wardrobes', ur: 'دو الگ الماریاں' },
      { en: 'High-speed WiFi Coverage', ur: 'مکمل وائی فائی کوریج' },
      { en: 'Ceiling Fan & Cooler', ur: 'پنکھا اور روم کولر' }
    ],
    image_urls: [
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80'
    ],
    is_published: true,
    sort_order: 2
  },
  {
    id: 'room-3',
    slug: 'triple-sharing',
    name_en: 'Triple Sharing Room',
    name_ur: 'ٹرپل شیئرنگ روم',
    room_type: 'triple',
    beds_total: 3,
    beds_available: 1,
    monthly_fee: 7500,
    security_deposit: 5000,
    admission_fee: 2000,
    description_en: 'Budget-friendly and vibrant room shared among three students. Designed with optimized floor layout, private storage lockers, and shared study corners.',
    description_ur: 'تین طلبہ کے لیے کم خرچ اور آرام دہ کمرہ۔ وسیع جگہ، ذاتی لاکرز اور پرسکون تعلیمی ماحول۔',
    features: [
      { en: '3 Comfortable Beds', ur: 'تین آرام دہ بیڈز' },
      { en: 'Individual Storage Lockers', ur: 'ذاتی الماری و لاکر' },
      { en: 'Study Table Area', ur: 'اسٹڈی کارنر' },
      { en: 'High-speed WiFi', ur: 'ہائی اسپیڈ وائی فائی' },
      { en: 'Daily Cleaning Service', ur: 'روزانہ صفائی کی سہولت' }
    ],
    image_urls: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80'
    ],
    is_published: true,
    sort_order: 3
  },
  {
    id: 'room-4',
    slug: 'economy-four',
    name_en: 'Economy Four Sharing',
    name_ur: 'اکانومی فور شیئرنگ',
    room_type: 'quad',
    beds_total: 4,
    beds_available: 0,
    monthly_fee: 6000,
    security_deposit: 5000,
    admission_fee: 2000,
    description_en: 'Our most affordable student option with complete hostel amenities. Four beds with personal racks and secure storage, offering great value for money.',
    description_ur: 'سب سے کم خرچ اور پائیدار انتخاب جس میں تمام ہاسٹل سہولیات شامل ہیں۔ چار بستر، ذاتی ریک اور محفوظ اسٹوریج۔',
    features: [
      { en: '4 Sturdy Beds + Mattresses', ur: 'چار بیڈز اور گدے' },
      { en: 'Personal Locker Unit', ur: 'پرسنل لاکر' },
      { en: 'Common Study Hall Access', ur: 'اسٹڈی ہال تک رسائی' },
      { en: 'Continuous Water & Electricity', ur: 'پانی اور بجلی کی فراہمی' },
      { en: 'High-speed WiFi', ur: 'وائی فائی سہولت' }
    ],
    image_urls: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'
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
    description_en: 'Seamless high-bandwidth internet connectivity throughout the building for online lectures and research.',
    description_ur: 'آن لائن کلاسز اور ریسرچ کے لیے ہاسٹل کے ہر کونے میں تیز ترین اور مستحکم انٹرنیٹ کنکشن۔',
    icon_url: 'wifi',
    is_published: true,
    sort_order: 1
  },
  {
    id: 'fac-2',
    title_en: 'RO Filter Purified Water',
    title_ur: 'فلٹر شدہ شفاف پینے کا پانی',
    description_en: 'Multi-stage RO water plant ensuring hygienic, cold and clean drinking water 24/7.',
    description_ur: 'حفظان صحت کے مطابق آر او فلٹر سے صاف اور ٹھنڈا پینے کا پانی ہمہ وقت دستیاب۔',
    icon_url: 'droplet',
    is_published: true,
    sort_order: 2
  },
  {
    id: 'fac-3',
    title_en: '24/7 Generator & UPS Backup',
    title_ur: '۲۴ گھنٹے بجلی کا متبادل بیک اپ',
    description_en: 'Heavy-duty automatic generator and UPS systems prevent any interruption during study hours.',
    description_ur: 'لوڈ شیڈنگ سے محفوظ رہنے کے لیے خودکار ہیوی جنریٹر اور یو پی ایس سسٹم۔',
    icon_url: 'zap',
    is_published: true,
    sort_order: 3
  },
  {
    id: 'fac-4',
    title_en: 'Hot Water Geyser in Winter',
    title_ur: 'سردیوں میں گرم پانی (گیزرز)',
    description_en: 'Instant and continuous hot water supply available in all washrooms throughout winter months.',
    description_ur: 'سردیوں کے موسم میں تمام واش رومز میں بروقت گرم پانی کی مسلسل فراہمی۔',
    icon_url: 'flame',
    is_published: true,
    sort_order: 4
  },
  {
    id: 'fac-5',
    title_en: 'Room Coolers & Fans',
    title_ur: 'روم کولرز اور سیلنگ فینز',
    description_en: 'Heavy air coolers and ceiling fans installed in every room to maintain pleasant room temperature in summer.',
    description_ur: 'گرمیوں میں خوشگوار ماحول کے لیے ہر کمرے میں بہترین کولرز اور پنکھوں کا انتظام۔',
    icon_url: 'wind',
    is_published: true,
    sort_order: 5
  },
  {
    id: 'fac-6',
    title_en: 'Fresh 3-Time Hygienic Mess',
    title_ur: 'تازہ اور لذیذ ۳ وقت کا میس',
    description_en: 'Home-style delicious food cooked under clean conditions with fresh roti and balanced nutritional meals.',
    description_ur: 'گھر جیسا ذائقہ دار اور صاف ستھرا کھانا، گرم روٹیاں اور غذائیت سے بھرپور مینو۔',
    icon_url: 'utensils',
    is_published: true,
    sort_order: 6
  },
  {
    id: 'fac-7',
    title_en: 'Laundry & Ironing Area',
    title_ur: 'لانڈری اور استری کی سہولت',
    description_en: 'Automatic washing machines, dedicated cloth drying lines, and iron stations available for residents.',
    description_ur: 'کپڑے دھونے کے لیے خودکار واشنگ مشینز اور استری کے لیے مخصوص جگہ۔',
    icon_url: 'shirt',
    is_published: true,
    sort_order: 7
  },
  {
    id: 'fac-8',
    title_en: 'Dedicated Quiet Study Hall',
    title_ur: 'خاموش اور پرسکون اسٹڈی ہال',
    description_en: 'Separate air-conditioned reading room with power outlets and ergonomic chairs for exam preparation.',
    description_ur: 'امتحانات کی تیاری اور یکسوئی سے پڑھنے کے لیے خاموش اور آرام دہ اسٹڈی ہال۔',
    icon_url: 'book-open',
    is_published: true,
    sort_order: 8
  },
  {
    id: 'fac-9',
    title_en: '24/7 CCTV Surveillance',
    title_ur: '۲۴ گھنٹے سی سی ٹی وی کیمرے',
    description_en: 'Complete camera coverage across corridors, building entrances, and parking lots for maximum security.',
    description_ur: 'مکمل سیکیورٹی کے لیے ہاسٹل کے داخلی راستوں، راہداریوں اور پارکنگ میں کیمرے نصب۔',
    icon_url: 'video',
    is_published: true,
    sort_order: 9
  },
  {
    id: 'fac-10',
    title_en: 'On-Duty Security Guard',
    title_ur: 'ہمہ وقت چوکنا سیکیورٹی گارڈ',
    description_en: 'Trained security staff at main entrance monitoring entry registers and guest protocol.',
    description_ur: 'مین گیٹ پر تربیت یافتہ چوکیدار، جو آنے جانے والوں کے مکمل ریکارڈ کی نگرانی کرتا ہے۔',
    icon_url: 'shield-check',
    is_published: true,
    sort_order: 10
  },
  {
    id: 'fac-11',
    title_en: 'Motorcycle & Cycle Parking',
    title_ur: 'محفوظ موٹر سائیکل پارکنگ',
    description_en: 'Gated indoor parking space to keep student vehicles safe from sun and unauthorized access.',
    description_ur: 'طلبہ کی موٹر سائیکلوں اور بائیکس کے لیے محفوظ اور چھت والی پارکنگ۔',
    icon_url: 'bike',
    is_published: true,
    sort_order: 11
  },
  {
    id: 'fac-12',
    title_en: 'Daily Room & Bath Cleaning',
    title_ur: 'روزانہ صفائی کا باقاعدہ نظام',
    description_en: 'Hostel janitorial staff cleans corridors, washrooms, and rooms daily with disinfectant solutions.',
    description_ur: 'عملہ صفائی روزانہ کمروں، گیلریوں اور واش رومز کی جراثیم کش ادویات سے صفائی کرتا ہے۔',
    icon_url: 'sparkles',
    is_published: true,
    sort_order: 12
  },
  {
    id: 'fac-13',
    title_en: 'Fully Furnished Living',
    title_ur: 'مکمل فرنشڈ کمرے',
    description_en: 'Each student receives a bed, quality mattress, bedsheet, pillow, and personal wardrobe.',
    description_ur: 'ہر رہائشی کو بیڈ، آرام دہ گدا، چادر، تکیہ اور ذاتی تالے والی الماری دی جاتی ہے۔',
    icon_url: 'bed',
    is_published: true,
    sort_order: 13
  }
];

export const initialMessPlans: MessPlan[] = [
  {
    id: 'mess-1',
    name_en: '3 Time Full Meal Plan',
    name_ur: 'تین وقت کا مکمل کھانا',
    price_monthly: 9000,
    description_en: 'Nutritious breakfast, full lunch, and fresh dinner daily with weekly special chicken/biryani meals.',
    description_ur: 'روزانہ تازہ ناشتہ، دوپہر کا کھانا اور رات کا کھانا مع ہفتہ وار سپیشل چکن اور بریانی۔',
    is_active: true,
    sort_order: 1
  },
  {
    id: 'mess-2',
    name_en: '2 Time Flexible Plan',
    name_ur: 'دو وقت کا کھانا',
    price_monthly: 6500,
    description_en: 'Ideal for college students having lunch outside; includes daily breakfast + dinner.',
    description_ur: 'کالج اور اکیڈمی جانے والے طلبہ کے لیے بہترین، ناشتہ اور رات کا گرم کھانا۔',
    is_active: true,
    sort_order: 2
  },
  {
    id: 'mess-3',
    name_en: 'No Mess (Lodging Only)',
    name_ur: 'بغیر میس (صرف رہائش)',
    price_monthly: 0,
    description_en: 'Pay only the room fee. Residents are free to arrange their own meals or eat outside.',
    description_ur: 'میس اختیاری ہے۔ آپ صرف کمرے کا کرایہ ادا کریں اور کھانا اپنی مرضی سے کھائیں۔',
    is_active: true,
    sort_order: 3
  }
];

export const initialMessMenu: MessMenuDay[] = [
  {
    id: 'menu-1',
    day_of_week: 1, // Monday
    breakfast_en: 'Crispy Paratha, Fried Egg / Omelette, Hot Karak Chai',
    breakfast_ur: 'خستہ پراٹھا، فرائی انڈا / آملیٹ، گرما گرم کڑک چائے',
    lunch_en: 'Daal Chawal (Lentil Rice) with Fresh Salad & Pickle',
    lunch_ur: 'دال چاول مع تازہ سلاد اور اچار',
    dinner_en: 'Aloo Gobi Curry, Hot Tandoori Rotis, Raita',
    dinner_ur: 'آلو گوبھی سالن، گرما گرم روٹیاں، رائتہ'
  },
  {
    id: 'menu-2',
    day_of_week: 2, // Tuesday
    breakfast_en: 'Paratha with Chana Masala, Milk Tea',
    breakfast_ur: 'پراٹھا مع چنا سالن، گرما گرم چائے',
    lunch_en: 'Chicken Karahi with Tandoori Roti & Fresh Mint Raita',
    lunch_ur: 'چکن کڑاہی مع تندوری روٹی اور پودینہ رائتہ',
    dinner_en: 'Daal Mash Special, Fresh Salad, Hot Rotis',
    dinner_ur: 'دال ماش اسپیشل، تازہ سلاد، گرم روٹیاں'
  },
  {
    id: 'menu-3',
    day_of_week: 3, // Wednesday
    breakfast_en: 'Halwa Puri with Chana Gravy / Paratha Chai',
    breakfast_ur: 'حلوہ پوری مع چنے سالن / پراٹھا چائے',
    lunch_en: 'Mix Seasonal Sabzi with Fresh Desi Ghee Roti',
    lunch_ur: 'مکس موسمی سبزی مع گرما گرم روٹی',
    dinner_en: 'Special Chicken Biryani with Cold Raita & Salad',
    dinner_ur: 'اسپیشل چکن بریانی مع ٹھنڈا رائتہ اور سلاد'
  },
  {
    id: 'menu-4',
    day_of_week: 4, // Thursday
    breakfast_en: 'Aloo Paratha with Mint Yogurt, Hot Chai',
    breakfast_ur: 'آلو پراٹھا مع دہی، کڑک چائے',
    lunch_en: 'Daal Chana Fry, Boiled Rice / Roti, Green Salad',
    lunch_ur: 'فرائی دال چنا، ابلے چاول / روٹی، ہری سلاد',
    dinner_en: 'Aloo Qeema with Fresh Tandoori Rotis',
    dinner_ur: 'آلو قیمہ مع گرما گرم تندوری روٹیاں'
  },
  {
    id: 'menu-5',
    day_of_week: 5, // Friday
    breakfast_en: 'Fried Egg, Paratha, Special Elaichi Chai',
    breakfast_ur: 'فرائی انڈا، پراٹھا، الائچی والی چائے',
    lunch_en: 'Fragrant Chicken Pulao with Shami Kabab & Raita',
    lunch_ur: 'خوشبودار چکن پلاؤ مع شامی کباب اور رائتہ',
    dinner_en: 'Bhindi Masala / Seasonal Curry with Hot Rotis',
    dinner_ur: 'بھنڈی مصالحہ / موسمی سبزی مع گرم روٹیاں'
  },
  {
    id: 'menu-6',
    day_of_week: 6, // Saturday
    breakfast_en: 'Lachha Paratha, Boiled Egg, Milk Tea',
    breakfast_ur: 'لچھا پراٹھا، ابلا انڈا، دودھ پتی چائے',
    lunch_en: 'Kadhi Pakora with Steamed White Rice',
    lunch_ur: 'کڑھی پکوڑا مع گرم ابلے چاول',
    dinner_en: 'Chicken Qorma Gravy with Hot Tandoori Rotis',
    dinner_ur: 'چکن قورمہ مع تازہ تندوری روٹیاں'
  },
  {
    id: 'menu-0',
    day_of_week: 0, // Sunday
    breakfast_en: 'Sunday Special Halwa Puri / Murgh Chana & Sweet Lassi',
    breakfast_ur: 'اتوار اسپیشل حلوہ پوری / مرغ چنے اور میٹھی لسی',
    lunch_en: 'Special Chef Lunch: Daal Mong / Sabzi with Rice',
    lunch_ur: 'اسپیشل لنچ: دال مونگ / سبزی مع چاول',
    dinner_en: 'Beef / Chicken Curry with Naan or Roti',
    dinner_ur: 'بیف / چکن سالن مع گرم نان یا روٹی'
  }
];

export const initialGallery: GalleryItem[] = [
  {
    id: 'gal-1',
    category: 'rooms',
    image_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
    caption_en: 'Spacious Single Bedroom with study table and wardrobe',
    caption_ur: 'کشادہ سنگل روم مع اسٹڈی ٹیبل اور الماری',
    is_published: true,
    sort_order: 1
  },
  {
    id: 'gal-2',
    category: 'rooms',
    image_url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
    caption_en: 'Double sharing bedroom with individual furniture',
    caption_ur: 'ڈبل شیئرنگ بیڈروم مع ذاتی فرنیچر',
    is_published: true,
    sort_order: 2
  },
  {
    id: 'gal-3',
    category: 'mess',
    image_url: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=800&q=80',
    caption_en: 'Clean, spacious resident dining hall',
    caption_ur: 'صاف ستھرا اور کشادہ ڈائننگ ہال',
    is_published: true,
    sort_order: 3
  },
  {
    id: 'gal-4',
    category: 'mess',
    image_url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
    caption_en: 'Hygienic kitchen with fresh daily food preparation',
    caption_ur: 'حفظان صحت کے اصولوں کے مطابق کچن',
    is_published: true,
    sort_order: 4
  },
  {
    id: 'gal-5',
    category: 'study_area',
    image_url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    caption_en: 'Peaceful reading hall equipped with high-speed WiFi',
    caption_ur: 'پرسکون اسٹڈی ایریا تیز ترین انٹرنیٹ کے ساتھ',
    is_published: true,
    sort_order: 5
  },
  {
    id: 'gal-6',
    category: 'bathrooms',
    image_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    caption_en: 'Modern tiled washrooms with hot water geyser',
    caption_ur: 'جدید ٹائلز والے واش رومز مع گرم پانی کی سہولت',
    is_published: true,
    sort_order: 6
  },
  {
    id: 'gal-7',
    category: 'building',
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    caption_en: 'Secure exterior front of Sadiqabad Student Hostel',
    caption_ur: 'صادق آباد اسٹوڈنٹ ہاسٹل کی محفوظ عمارت کا منظر',
    is_published: true,
    sort_order: 7
  },
  {
    id: 'gal-8',
    category: 'surroundings',
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    caption_en: 'Hostel reception and visitor lounge',
    caption_ur: 'ہاسٹل ریسیپشن اور مہمانوں کے بیٹھنے کا کمرہ',
    is_published: true,
    sort_order: 8
  }
];

export const initialRules: Rule[] = [
  {
    id: 'rule-1',
    text_en: 'Gate closes strictly at 10:00 PM. Late arrival requires prior written permission from parents or guardian.',
    text_ur: 'رات ۱۰:۰۰ بجے گیٹ سختی سے بند کر دیا جاتا ہے۔ تاخیر کی صورت میں والدین یا سرپرست کی پیشگی اجازت لازمی ہے۔',
    is_published: true,
    sort_order: 1
  },
  {
    id: 'rule-2',
    text_en: 'Visitors and guests are only allowed in the designated reception lounge between 4:00 PM and 8:00 PM.',
    text_ur: 'مہمانوں اور ملاقاتیوں کو صرف ریسیپشن لاؤنج میں شام ۴:۰۰ سے ۸:۰۰ بجے کے درمیان ملنے کی اجازت ہے۔',
    is_published: true,
    sort_order: 2
  },
  {
    id: 'rule-3',
    text_en: 'Smoking, pan/gutka, and any form of intoxicants are strictly prohibited on hostel premises.',
    text_ur: 'ہاسٹل کی حدود میں سگریٹ نوشی، پان گٹکا اور کسی بھی قسم کے نشے کا استعمال سخت ممنوع ہے۔',
    is_published: true,
    sort_order: 3
  },
  {
    id: 'rule-4',
    text_en: 'Loud music, shouting, or disruptive behavior is forbidden, especially during night study hours.',
    text_ur: 'ہاسٹل میں شور مچانا، اونچی آواز میں میوزک لگانا یا جھگڑا کرنا منع ہے، خصوصاً پڑھائی کے اوقات میں۔',
    is_published: true,
    sort_order: 4
  },
  {
    id: 'rule-5',
    text_en: 'Any damage caused to hostel furniture, electric fittings, or property will be charged to the resident.',
    text_ur: 'ہاسٹل کے فرنیچر، بجلی کے آلات یا عمارت کو نقصان پہنچانے پر جرمانہ عائد کیا جائے گا۔',
    is_published: true,
    sort_order: 5
  },
  {
    id: 'rule-6',
    text_en: 'High-voltage electric appliances (electric heaters, heavy cooking plates) are not permitted without administration consent.',
    text_ur: 'زیادہ بجلی خرچ کرنے والے آلات (ہیٹر، کوکنگ ہیٹر) انتظامیہ کی اجازت کے بغیر کمرے میں لگانا منع ہے۔',
    is_published: true,
    sort_order: 6
  },
  {
    id: 'rule-7',
    text_en: 'Monthly hostel rent and mess charges must be settled between the 1st and 10th of every calendar month.',
    text_ur: 'ماہانہ ہاسٹل کرایہ اور میس فیس ہر مہینے کی یکم سے ۱۰ تاریخ تک جمع کروانا لازمی ہے۔',
    is_published: true,
    sort_order: 7
  },
  {
    id: 'rule-8',
    text_en: 'Hostel warden and management decisions regarding discipline and hostel welfare will be final.',
    text_ur: 'ڈسپلن اور ہاسٹل کے مفاد کے حوالے سے انتظامیہ اور وارڈن کا فیصلہ حتمی ہوگا۔',
    is_published: true,
    sort_order: 8
  }
];

export const initialFaqs: Faq[] = [
  {
    id: 'faq-1',
    question_en: 'How do I take admission in the hostel?',
    question_ur: 'ہاسٹل میں داخلہ کیسے حاصل کیا جا سکتا ہے؟',
    answer_en: 'You can submit the online inquiry form or visit our office with your CNIC/B-Form copy, 2 passport-size photographs, and college student card/job verification.',
    answer_ur: 'آپ ہماری ویب سائٹ پر آن لائن فارم جمع کروا سکتے ہیں یا اپنے شناختی کارڈ/بے فارم کی کاپی، ۲ پاسپورٹ سائز تصاویر اور اسٹوڈنٹ کارڈ کے ساتھ ہاسٹل تشریف لا سکتے ہیں۔',
    is_published: true,
    sort_order: 1
  },
  {
    id: 'faq-2',
    question_en: 'Is the mess facility mandatory with room booking?',
    question_ur: 'کیا کمرہ لینے کے ساتھ میس کا کھانا لینا لازمی ہے؟',
    answer_en: 'No, mess is completely optional. You can choose the 3-time plan, 2-time plan, or opt for lodging-only without mess.',
    answer_ur: 'نہیں، میس کی سہولت بالکل اختیاری ہے۔ آپ ۳ وقت کا کھانا، ۲ وقت کا کھانا یا بغیر میس صرف کمرہ بھی بک کر سکتے ہیں۔',
    is_published: true,
    sort_order: 2
  },
  {
    id: 'faq-3',
    question_en: 'Are high-speed WiFi and electricity bills included in the monthly rent?',
    question_ur: 'کیا وائی فائی اور بجلی کے بل ماہانہ فیس میں شامل ہیں؟',
    answer_en: 'Yes, high-speed WiFi, regular electricity, generator backup, and water charges are all included in the monthly fee. No extra utility charges.',
    answer_ur: 'جی ہاں، تیز رفتار وائی فائی، عام بجلی، جنریٹر بیک اپ اور پانی کے تمام اخراجات ماہانہ فیس میں پہلے سے شامل ہیں۔ کوئی اضافی یوٹیلیٹی بل نہیں ہے۔',
    is_published: true,
    sort_order: 3
  },
  {
    id: 'faq-4',
    question_en: 'Is the security deposit refundable when leaving?',
    question_ur: 'کیا ہاسٹل چھوڑتے وقت سیکیورٹی ڈپازٹ واپس مل جاتا ہے؟',
    answer_en: 'Yes, the security deposit is 100% refundable upon departure, provided a 15-day prior written notice is given and all dues are cleared.',
    answer_ur: 'جی ہاں، ہاسٹل چھوڑنے سے ۱۵ دن قبل مطلع کرنے اور تمام حساب کتاب بے باق ہونے پر سیکیورٹی ڈپازٹ مکمل واپس کر دی جاتی ہے۔',
    is_published: true,
    sort_order: 4
  },
  {
    id: 'faq-5',
    question_en: 'Can family members or friends stay overnight?',
    question_ur: 'کیا فیملی ممبرز یا دوست رات کو ہاسٹل میں ٹھہر سکتے ہیں؟',
    answer_en: 'For safety reasons, unauthorized overnight guests are not allowed in student rooms. Female family members are not permitted inside resident corridors.',
    answer_ur: 'تمام طلبہ کے تحفظ کی خاطر رات کے وقت کسی غیر متعلقہ شخص کے قیام کی اجازت نہیں ہے۔ خواتین کا کمروں میں داخلہ ممنوع ہے۔',
    is_published: true,
    sort_order: 5
  },
  {
    id: 'faq-6',
    question_en: 'What happens if there is a city power outage or loadshedding?',
    question_ur: 'اگر شہر میں بجلی چلی جائے تو کیا بیک اپ موجود ہے؟',
    answer_en: 'We have an automatic heavy generator and UPS battery setup that immediately powers lights, fans, and WiFi throughout the premises.',
    answer_ur: 'ہمارے پاس فوری فعال ہونے والا جنریٹر اور یو پی ایس سسٹم موجود ہے جو پنکھے، روشنیاں اور وائی فائی بلا تعطل جاری رکھتا ہے۔',
    is_published: true,
    sort_order: 6
  }
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    name: 'Hamza Tariq (Punjab College)',
    rating: 5,
    comment_en: 'Best hostel experience in Sadiqabad! The rooms are clean, high-speed WiFi never drops during online exams, and the mess food is genuinely fresh and hygienic like home.',
    comment_ur: 'صادق آباد میں طلبہ کے لیے بہترین ہاسٹل ہے۔ کمرے صاف ستھرے ہیں، انٹرنیٹ کی اسپیڈ شاندار ہے اور میس کا کھانا بالکل گھر جیسا تازہ ہوتا ہے۔',
    is_visible: true,
    created_at: '2026-09-15T12:00:00Z'
  },
  {
    id: 'rev-2',
    name: 'M. Kashif (Bank Professional)',
    rating: 5,
    comment_en: 'Living here for the past 8 months. Very peaceful atmosphere for working professionals. Power backup works reliably during loadshedding, and warden is very cooperative.',
    comment_ur: 'پچھلے ۸ ماہ سے یہاں مقیم ہوں۔ جاب کرنے والوں کے لیے بہت پرسکون جگہ ہے۔ لوڈ شیڈنگ میں جنریٹر بروقت چلتا ہے اور عملہ بہت تعاون کرنے والا ہے۔',
    is_visible: true,
    created_at: '2026-08-20T10:30:00Z'
  },
  {
    id: 'rev-3',
    name: 'Abdul Rehman (Parent)',
    rating: 5,
    comment_en: 'Enrolled my son here for his college studies. I am very satisfied with the strict gate timing, security guard presence, and disciplined atmosphere.',
    comment_ur: 'میں نے اپنے بیٹے کو کالج کی پڑھائی کے لیے یہاں داخل کروایا ہے۔ وقت کی سختی، سیکیورٹی اور باوقار ماحول دیکھ کر بہت اطمینان ہے۔',
    is_visible: true,
    created_at: '2026-07-12T14:15:00Z'
  },
  {
    id: 'rev-4',
    name: 'Zeeshan Ahmad (Medical Academy)',
    rating: 4,
    comment_en: 'Great study hall and comfortable mattress. Hot water in geysers during winter makes morning routine easy. Highly recommended for students.',
    comment_ur: 'اسٹڈی ہال اور بیڈز بہت آرام دہ ہیں۔ سردیوں میں گرم پانی وقت پر ملتا ہے۔ تمام اسٹوڈنٹس کے لیے بہترین ہاسٹل ہے۔',
    is_visible: true,
    created_at: '2026-06-05T09:00:00Z'
  }
];

export const initialNotices: Notice[] = [
  {
    id: 'notice-1',
    text_en: 'Admissions Open for New Session 2026-2027! Limited single and sharing beds available. Reserve your seat today.',
    text_ur: 'نئے تعلیمی سیشن ۲۰۲۶ کے داخلے جاری ہیں! سنگل اور شیئرنگ کمروں میں محدود نشستیں دستیاب ہیں۔ آج ہی اپنی سیٹ بک کروائیں۔',
    starts_at: new Date(Date.now() - 86400000).toISOString(),
    ends_at: new Date(Date.now() + 30 * 86400000).toISOString(),
    is_active: true
  }
];

export const initialInquiries: Inquiry[] = [
  {
    id: 'inq-1',
    name: 'Usman Ali',
    phone: '0301-7654321',
    room_type: 'single',
    wants_mess: true,
    move_in_date: '2026-11-01',
    category: 'student',
    message: 'I am a 1st year student at Punjab College Sadiqabad, need quiet single room on ground or 1st floor.',
    status: 'new',
    admin_notes: 'Needs call back in evening after 4 PM.',
    source_lang: 'en',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'inq-2',
    name: 'Muhammad Bilal',
    phone: '0345-1122334',
    room_type: 'double',
    wants_mess: true,
    move_in_date: '2026-11-05',
    category: 'job',
    message: 'Working at Habib Bank Sadiqabad Branch. Looking for clean double sharing.',
    status: 'contacted',
    admin_notes: 'Spoke on WhatsApp. Scheduled physical visit for Saturday.',
    source_lang: 'ur',
    created_at: new Date(Date.now() - 86400000).toISOString()
  }
];
