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
    "id": 1,
    "email": "admissions@sadiqabadhostel.pk",
    "phone": "0304-7861234",
    "name_en": "Sadiqabad Student Hostel",
    "name_ur": "صادق آباد اسٹوڈنٹ ہاسٹل",
    "about_en": "Located on Main College Road near Punjab College and Govt. Post Graduate College Sadiqabad, Sadiqabad Student Hostel provides a disciplined, peaceful, and home-like living environment for students of KFUEIT, local colleges, medical academies, and working professionals. Every room includes orthopedic mattresses, study desks, high-speed fiber internet, RO purified drinking water, 24/7 CCTV surveillance, and automatic UPS/generator backup with honest, student-friendly monthly fees.",
    "about_ur": "مین کالج روڈ نزد پنجاب کالج اور گورنمنٹ پوسٹ گریجویٹ کالج صادق آباد میں واقع، صادق آباد اسٹوڈنٹ ہاسٹل خواجہ فرید یونیورسٹی، مقامی کالجز، میڈیکل اکیڈمیز کے طلبہ اور ملازمت پیشہ افراد کو گھر جیسا محفوظ، باوقار اور پرسکون ماحول فراہم کرتا ہے۔ مناسب ماہانہ فیس میں آرام دہ بیڈز، اسٹڈی ٹیبلز، تیز رفتار فائبر انٹرنیٹ، آر او فلٹر پانی، ۲۴ گھنٹے سی سی ٹی وی سیکیورٹی اور جنریٹر و یو پی ایس بیک اپ شامل ہیں۔",
    "latitude": 28.3062,
    "logo_url": "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/branding/3a37fa6f-a1b8-4ade-b133-8bdae1197d9d.png",
    "whatsapp": "0304-7861234",
    "longitude": 70.1302,
    "address_en": "Main College Road, Near Punjab College & Govt. Post Graduate College, Sadiqabad, District Rahim Yar Khan",
    "address_ur": "مین کالج روڈ، نزد پنجاب کالج و گورنمنٹ پوسٹ گریجویٹ کالج، صادق آباد، ضلع رحیم یار خان",
    "tagline_en": "Safe, Clean & Student-Friendly Residence Near Colleges in Sadiqabad",
    "tagline_ur": "صادق آباد میں کالجز کے قریب محفوظ، صاف ستھرا اور معقول فیس والا اسٹوڈنٹ ہاسٹل",
    "updated_at": "2026-11-02T18:31:35.373027+00:00",
    "hostel_type": "boys",
    "social_links": {
      "facebook": "https://facebook.com/sadiqabadstudenthostel",
      "instagram": "https://instagram.com/sadiqabadstudenthostel"
    },
    "map_embed_url": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55622.34900265778!2d70.095!3d28.3062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39375e2a22ab072d%3A0xc3191cb142646c07!2sSadiqabad%2C%20Rahim%20Yar%20Khan%2C%20Punjab!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk",
    "office_hours_en": "8:00 AM – 10:00 PM (Open Daily)",
    "office_hours_ur": "صبح 8:00 تا رات 10:00 بجے (روزانہ کھلا ہے)"
  };
export const initialSiteSettings: SiteSettings = {
    "id": 1,
    "updated_at": "2026-11-02T18:31:35.576588+00:00",
    "seo_title_en": "Sadiqabad Student Hostel – Furnished Rooms from Rs. 5,500/mo, Mess & WiFi",
    "seo_title_ur": "صادق آباد اسٹوڈنٹ ہاسٹل – ۵,۵۰۰ روپے ماہانہ سے فرنشڈ کمرے، میس اور وائی فائی",
    "default_language": "en",
    "seo_description_en": "Book affordable, clean student hostel rooms in Sadiqabad starting from Rs. 5,500/month. Includes fiber WiFi, UPS/generator backup, RO water, optional home-style mess, and 24/7 security near Punjab College.",
    "seo_description_ur": "صادق آباد میں پنجاب کالج کے قریب ۵,۵۰۰ روپے ماہانہ سے صاف ستھرے فرنشڈ ہاسٹل کمرے، گھر جیسا تازہ میس، فائبر وائی فائی اور ۲۴ گھنٹے سیکیورٹی۔ آج ہی اپنی سیٹ بک کروائیں۔",
    "whatsapp_message_template_en": "Assalam o Alaikum, I visited the Sadiqabad Student Hostel website and want to check room availability and fee details.",
    "whatsapp_message_template_ur": "السلام علیکم، میں نے صادق آباد اسٹوڈنٹ ہاسٹل کی ویب سائٹ دیکھی ہے اور کمرے کی دستیابی اور فیس کی تفصیلات معلوم کرنا چاہتا ہوں۔"
  };
export const initialRooms: Room[] = [
    {
      "id": "151bc66f-e0d1-47b9-8b1e-63d9422c445d",
      "slug": "economy-four",
      "name_en": "Economy 4-Bed Sharing Room",
      "name_ur": "اکانومی ۴ بیڈ شیئرنگ روم",
      "features": [
        {
          "en": "4 Single Beds with Mattresses",
          "ur": "چار سنگل بیڈز مع آرام دہ گدے"
        },
        {
          "en": "Individual Lockable Cupboards",
          "ur": "ہر طالب علم کے لیے ذاتی لاکر و الماری"
        },
        {
          "en": "High-Speed Fiber WiFi & UPS Backup",
          "ur": "تیز رفتار فائبر وائی فائی اور یو پی ایس بیک اپ"
        },
        {
          "en": "Room Cooler & Dual Ceiling Fans",
          "ur": "روم کولر اور دو سیلنگ فینز"
        },
        {
          "en": "Daily Room & Washroom Cleaning",
          "ur": "کمرے اور واش روم کی روزانہ صفائی"
        },
        {
          "en": "Free RO Purified Drinking Water",
          "ur": "آر او فلٹر شدہ ٹھنڈا پینے کا پانی"
        }
      ],
      "room_type": "quad",
      "beds_total": 4,
      "created_at": "2026-10-16T18:58:59.417556+00:00",
      "image_urls": [
        "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/8b111e71-bf2f-4531-8346-e1ebca259ee8.jpg",
        "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/77f40cde-dca1-484c-8bc6-a4d0519c2f06.jpg",
        "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/cbbb6568-ed0c-425d-8694-164c403cc109.jpg"
      ],
      "sort_order": 1,
      "updated_at": "2026-11-02T18:31:35.757056+00:00",
      "monthly_fee": 5500,
      "is_published": true,
      "admission_fee": 1000,
      "beds_available": 2,
      "description_en": "Our most budget-friendly room designed for intermediate and BS students looking for clean, comfortable living at an easy monthly rent. Spacious cross-ventilated layout with four sturdy single beds, individual lockable cupboards, twin ceiling fans, room cooler, and full access to the quiet study hall.",
      "description_ur": "ایف اے، ایف ایس سی اور بی ایس طلبہ کے لیے انتہائی مناسب اور کم ماہانہ فیس والا صاف ستھرا ہوا دار کمرہ۔ چار مضبوط سنگل بیڈز، ہر طالب علم کے لیے الگ تالے والی الماری، دو پنکھے، روم کولر اور اسٹڈی ہال کی مکمل سہولت شامل ہے۔",
      "security_deposit": 3000
    },
    {
      "id": "44b36b30-129f-43a9-919b-bcdb59b8f209",
      "slug": "triple-sharing",
      "name_en": "Standard 3-Bed Sharing Room",
      "name_ur": "اسٹینڈرڈ ۳ بیڈ شیئرنگ روم",
      "features": [
        {
          "en": "3 Wooden Beds + Orthopedic Mattresses",
          "ur": "تین لکڑی کے بیڈز مع معیاری گدے"
        },
        {
          "en": "Long Study Desk & Laptop Sockets",
          "ur": "اسٹڈی کاؤنٹر اور لیپ ٹاپ چارجنگ ساکٹس"
        },
        {
          "en": "3 Personal Numbered Lockers",
          "ur": "تین ذاتی نمبر والے لاکرز"
        },
        {
          "en": "Attached Modern Tiled Washroom",
          "ur": "ملحقہ ٹائلز والا صاف واش روم"
        },
        {
          "en": "Fiber WiFi + Generator Backup",
          "ur": "فائبر وائی فائی اور جنریٹر بیک اپ"
        }
      ],
      "room_type": "triple",
      "beds_total": 3,
      "created_at": "2026-10-16T18:58:59.417556+00:00",
      "image_urls": [
        "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/74dcafda-2f06-468d-a377-1dee0cd4a5de.jpg",
        "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/cbbb6568-ed0c-425d-8694-164c403cc109.jpg",
        "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/a4d93b7d-68f4-4a4d-86d5-89b7a0427f5a.jpg"
      ],
      "sort_order": 2,
      "updated_at": "2026-11-02T18:31:35.948566+00:00",
      "monthly_fee": 6800,
      "is_published": true,
      "admission_fee": 1000,
      "beds_available": 1,
      "description_en": "Balanced comfort and affordability for three students. Features three neat wooden single beds with fresh bedding, personal steel lockers, a long shared study desk with laptop charging sockets, bright natural daylight, and attached tiled washroom.",
      "description_ur": "تین طلبہ کے لیے آرام اور مناسب کرائے کا بہترین امتزاج۔ تین لکڑی کے بیڈز، ذاتی اسٹیل لاکرز، لیپ ٹاپ چارجنگ پوائنٹس کے ساتھ لمبا اسٹڈی کاؤنٹر، روشن کھڑکی اور ملحقہ صاف ستھرا واش روم۔",
      "security_deposit": 3500
    },
    {
      "id": "f2835d5a-911f-4be6-9895-4939674970a0",
      "slug": "double-sharing",
      "name_en": "Executive 2-Bed Sharing Room",
      "name_ur": "ایگزیکٹو ۲ بیڈ شیئرنگ روم",
      "features": [
        {
          "en": "2 Separate Wooden Beds & Nightstand",
          "ur": "دو علیحدہ لکڑی کے بیڈز اور سائیڈ ٹیبل"
        },
        {
          "en": "2 Dedicated Study Desks & Chairs",
          "ur": "دو الگ اسٹڈی ٹیبلز اور کرسیاں"
        },
        {
          "en": "Full-Size Wooden Wardrobes",
          "ur": "دو بڑی لکڑی کی الماریاں"
        },
        {
          "en": "Attached Bath with Hot Water Geyser",
          "ur": "گیزر کے ساتھ اٹیچ واش روم"
        },
        {
          "en": "High-Speed WiFi & 24/7 Power Backup",
          "ur": "ہائی اسپیڈ وائی فائی اور ۲۴ گھنٹے بجلی بیک اپ"
        }
      ],
      "room_type": "double",
      "beds_total": 2,
      "created_at": "2026-10-16T18:58:59.417556+00:00",
      "image_urls": [
        "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/7da1651e-d122-4be3-bfe1-5a9ae9ba75f5.jpg",
        "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/cbbb6568-ed0c-425d-8694-164c403cc109.jpg",
        "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/77f40cde-dca1-484c-8bc6-a4d0519c2f06.jpg"
      ],
      "sort_order": 3,
      "updated_at": "2026-11-02T18:31:36.161733+00:00",
      "monthly_fee": 8500,
      "is_published": true,
      "admission_fee": 1500,
      "beds_available": 1,
      "description_en": "Our most popular choice for study partners, university seniors, and job holders. Offers generous floor space, two independent study desks with ergonomic chairs, full-height wooden wardrobes, attached washroom with winter hot-water geyser, and uninterrupted power backup.",
      "description_ur": "دوستوں، یونیورسٹی کے سینئر طلبہ اور ملازمت پیشہ افراد کے لیے سب سے مقبول انتخاب۔ کشادہ کمرہ، دو الگ اسٹڈی ٹیبلز مع آرام دہ کرسیاں، بڑی لکڑی کی الماریاں، گرم پانی کے گیزر والا اٹیچ واش روم اور مکمل بجلی بیک اپ۔",
      "security_deposit": 4000
    },
    {
      "id": "9e8b3c38-f95b-4899-bd10-c3ee4b86d6d5",
      "slug": "private-single",
      "name_en": "Private Single Study Room",
      "name_ur": "پرائیویٹ سنگل اسٹڈی روم",
      "features": [
        {
          "en": "100% Private Room (Single Occupant)",
          "ur": "مکمل ذاتی کمرہ (صرف ایک فرد کے لیے)"
        },
        {
          "en": "Executive Study Desk, Lamp & Chair",
          "ur": "ایگزیکٹو اسٹڈی ٹیبل، لیمپ اور آرام دہ کرسی"
        },
        {
          "en": "Private Attached Tiled Washroom",
          "ur": "ذاتی اٹیچ ٹائلز والا واش روم مع گیزر"
        },
        {
          "en": "Large Lockable Wooden Wardrobe",
          "ur": "بڑی تالے والی لکڑی کی الماری"
        },
        {
          "en": "Priority Fiber WiFi & UPS Backup",
          "ur": "تیز فائبر انٹرنیٹ اور بلا تعطل بجلی بیک اپ"
        }
      ],
      "room_type": "single",
      "beds_total": 2,
      "created_at": "2026-10-16T18:58:59.417556+00:00",
      "image_urls": [
        "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/51a6274d-1479-464d-a797-579d34cb3f37.jpg",
        "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/cbbb6568-ed0c-425d-8694-164c403cc109.jpg",
        "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/77f40cde-dca1-484c-8bc6-a4d0519c2f06.jpg"
      ],
      "sort_order": 4,
      "updated_at": "2026-11-02T18:31:36.358731+00:00",
      "monthly_fee": 11500,
      "is_published": true,
      "admission_fee": 1500,
      "beds_available": 1,
      "description_en": "Complete peace and privacy for MDCAT/CSS aspirants, final-year university students, and bank/corporate officers. Furnished with a premium single bed, executive study desk with reading lamp, tall wooden wardrobe, private attached bathroom, and quiet corner placement.",
      "description_ur": "ایم ڈی کیٹ، سی ایس ایس کے طلبہ، فائنل ایئر اسٹوڈنٹس اور بینک و کارپوریٹ افسران کے لیے مکمل پرائیویسی اور سکون۔ سنگل بیڈ، ریڈنگ لیمپ والا ایگزیکٹو اسٹڈی ڈیسک، بڑی الماری اور ذاتی اٹیچ واش روم۔",
      "security_deposit": 5000
    }
  ];
export const initialFacilities: Facility[] = [
    {
      "id": "7f9c2a9f-5395-47aa-bc3e-b78ad54d4cf7",
      "icon_url": "wifi",
      "title_en": "High-Speed Fiber WiFi",
      "title_ur": "تیز رفتار فائبر آپٹک وائی فائی",
      "sort_order": 1,
      "is_published": true,
      "description_en": "Dual-router PTCL Flash Fiber internet on every floor for lag-free online lectures, coding, and exam prep.",
      "description_ur": "آن لائن کلاسز، اسائنمنٹس اور امتحانات کی تیاری کے لیے ہر منزل پر تیز رفتار فائبر آپٹک وائی فائی۔"
    },
    {
      "id": "5eee51a2-0750-46d7-ba2c-abcb11f2d0ae",
      "icon_url": "droplet",
      "title_en": "RO Purified Drinking Water",
      "title_ur": "آر او فلٹر شدہ ٹھنڈا پانی",
      "sort_order": 2,
      "is_published": true,
      "description_en": "In-house multi-stage RO filtration plant with electric water coolers providing clean drinking water 24/7.",
      "description_ur": "پینے کے صاف، میٹھے اور ٹھنڈے پانی کے لیے آر او فلٹریشن پلانٹ اور واٹر کولرز ہمہ وقت دستیاب۔"
    },
    {
      "id": "74009ec1-c974-4605-810f-72d0fd82a3ca",
      "icon_url": "zap",
      "title_en": "Automatic UPS & Generator Backup",
      "title_ur": "خودکار یو پی ایس اور جنریٹر بیک اپ",
      "sort_order": 3,
      "is_published": true,
      "description_en": "Solar-assisted UPS and standby generator keep lights, ceiling fans, and WiFi running during MEPCO outages.",
      "description_ur": "لوڈ شیڈنگ کے دوران پنکھے، لائٹس اور انٹرنیٹ بلا تعطل جاری رکھنے کے لیے خودکار یو پی ایس اور جنریٹر۔"
    },
    {
      "id": "ee817663-9412-4c52-be8e-4fa92c17cc26",
      "icon_url": "flame",
      "title_en": "Hot Water Geysers in Winter",
      "title_ur": "سردیوں میں گرم پانی کے گیزرز",
      "sort_order": 4,
      "is_published": true,
      "description_en": "Electric and gas water heaters installed in washrooms for comfortable morning routines from November to February.",
      "description_ur": "سردیوں کے موسم میں صبح سویرے کالج اور آفس جانے والوں کے لیے واش رومز میں گرم پانی کی سہولت۔"
    },
    {
      "id": "987cbbfd-8cbc-4df0-9119-3696f9ea4cad",
      "icon_url": "wind",
      "title_en": "Air Coolers & Ceiling Fans",
      "title_ur": "روم کولرز اور سیلنگ فینز",
      "sort_order": 5,
      "is_published": true,
      "description_en": "Every room is fitted with high-RPM ceiling fans and summer desert air coolers suited for Sadiqabad summers.",
      "description_ur": "صادق آباد کی گرمی کے پیش نظر ہر کمرے میں تیز ہوا دینے والے پنکھے اور ٹھنڈے روم کولرز کا انتظام۔"
    },
    {
      "id": "f0ee0557-7b0c-4f90-941b-cfb1e6a9fb03",
      "icon_url": "utensils",
      "title_en": "Home-Style 3-Time Hygienic Mess",
      "title_ur": "گھر جیسا تازہ اور صاف ۳ وقت کا میس",
      "sort_order": 6,
      "is_published": true,
      "description_en": "Freshly cooked breakfast, lunch, and dinner served hot in our spotless dining hall using quality spices and halal meat.",
      "description_ur": "معیاری مصالحہ جات، تازہ سبزیوں اور حلال گوشت سے تیار کردہ گرما گرم کھانا صاف ستھرے ڈائننگ ہال میں۔"
    },
    {
      "id": "15e7a15b-7f10-4027-9f3f-aba4342626b3",
      "icon_url": "shirt",
      "title_en": "Laundry & Ironing Station",
      "title_ur": "واشنگ مشین اور استری کی سہولت",
      "sort_order": 7,
      "is_published": true,
      "description_en": "Self-service washing machines, sunlit rooftop drying lines, and dedicated ironing tables on each floor.",
      "description_ur": "کپڑے دھونے کے لیے واشنگ مشینز، دھوپ میں سکھانے کی کھلی جگہ اور ہر فلور پر استری ٹیبل موجود۔"
    },
    {
      "id": "32cb0f74-58fd-4c94-8d2b-047d00aac8e6",
      "icon_url": "book-open",
      "title_en": "Quiet Study & Library Hall",
      "title_ur": "پرسکون اسٹڈی اور لائبریری ہال",
      "sort_order": 8,
      "is_published": true,
      "description_en": "Dedicated distraction-free reading room with individual study tables, bright LED lighting, and laptop power sockets.",
      "description_ur": "رات دیر تک یکسوئی سے پڑھنے کے لیے خاموش اسٹڈی روم جہاں الگ میز، روشن لائٹس اور چارجنگ پوائنٹس ہیں۔"
    },
    {
      "id": "e6243d3f-6227-4a98-b02f-09c094f2a2c4",
      "icon_url": "video",
      "title_en": "24/7 HD CCTV Monitoring",
      "title_ur": "۲۴ گھنٹے ایچ ڈی سی سی ٹی وی نگرانی",
      "sort_order": 9,
      "is_published": true,
      "description_en": "Night-vision HD cameras covering the main gate, bike parking, reception lounge, and every floor corridor.",
      "description_ur": "مین گیٹ، بائیک پارکنگ، ریسیپشن اور تمام راہداریوں میں ۲۴ گھنٹے ریکارڈنگ والے سی سی ٹی وی کیمرے۔"
    },
    {
      "id": "b70a6526-333a-49d3-b0f0-c408bdb7ed68",
      "icon_url": "shield-check",
      "title_en": "Resident Warden & Gate Guard",
      "title_ur": "رہائشی وارڈن اور ۲۴ گھنٹے گارڈ",
      "sort_order": 10,
      "is_published": true,
      "description_en": "Full-time resident warden and uniformed gatekeeper maintaining visitor logs, discipline, and emergency support.",
      "description_ur": "ہمہ وقت موجود رہائشی وارڈن اور تربیت یافتہ سیکیورٹی گارڈ جو انٹری رجسٹر اور ڈسپلن کی نگرانی کرتے ہیں۔"
    },
    {
      "id": "d3d2b428-c9c2-4e8a-83a9-0ee831766756",
      "icon_url": "bike",
      "title_en": "Indoor Bike & Cycle Parking",
      "title_ur": "محفوظ انڈور موٹر سائیکل پارکنگ",
      "sort_order": 11,
      "is_published": true,
      "description_en": "Covered, gated ground-floor parking area inside the boundary wall to keep motorcycles and bicycles safe.",
      "description_ur": "طلبہ اور ملازمین کی موٹر سائیکلوں کو دھوپ اور چوری سے محفوظ رکھنے کے لیے چاردیواری کے اندر چھت والی پارکنگ۔"
    },
    {
      "id": "2d77623f-c7e2-4cee-99d0-ed0a4a5ea313",
      "icon_url": "sparkles",
      "title_en": "Daily Housekeeping & Sanitation",
      "title_ur": "روزانہ صفائی اور جراثیم کش سینیٹائزیشن",
      "sort_order": 12,
      "is_published": true,
      "description_en": "Dedicated cleaning staff sweeps rooms, corridors, and bathrooms every morning with phenyl and disinfectant.",
      "description_ur": "صفائی کا عملہ روزانہ صبح کمروں، برآمدوں اور واش رومز کی فینائل اور جراثیم کش محلول سے صفائی کرتا ہے۔"
    },
    {
      "id": "c99e2a23-5ae1-4c9a-abe2-7f47dec05b40",
      "icon_url": "bed",
      "title_en": "Fully Furnished Comfortable Rooms",
      "title_ur": "مکمل فرنشڈ اور ہوا دار کمرے",
      "sort_order": 13,
      "is_published": true,
      "description_en": "Every room comes ready with wooden beds, orthopedic mattresses, study desks, chairs, and personal lockable cupboards.",
      "description_ur": "ہر کمرے میں لکڑی کے مضبوط بیڈز، آرام دہ گدے، اسٹڈی ٹیبل، کرسیاں اور ذاتی لاکر والی الماریاں موجود ہیں۔"
    }
  ];
export const initialMessPlans: MessPlan[] = [
    {
      "id": "7d85b115-a3fb-4c20-b194-52faa43d3726",
      "name_en": "3-Time Full Home-Style Mess",
      "name_ur": "تین وقت کا مکمل گھریلو میس",
      "is_active": true,
      "sort_order": 1,
      "price_monthly": 7500,
      "description_en": "Daily fresh breakfast, lunch, and dinner including 4 chicken dishes per week (Karahi, Biryani, Pulao, Qorma) and hot tandoori rotis.",
      "description_ur": "روزانہ ناشتہ، دوپہر اور رات کا تازہ کھانا جس میں ہفتے میں ۴ بار چکن ڈشز (بریانی، کڑاہی، پلاؤ، قورمہ) اور گرم روٹیاں شامل ہیں۔"
    },
    {
      "id": "c29cfb58-d6e5-4d6f-8f77-10c32eb3f168",
      "name_en": "2-Time Student Plan (Breakfast + Dinner)",
      "name_ur": "دو وقت کا اسٹوڈنٹ پیکیج (ناشتہ اور رات کا کھانا)",
      "is_active": true,
      "sort_order": 2,
      "price_monthly": 5500,
      "description_en": "Designed for college, university, and job residents who stay on campus at midday. Includes full morning breakfast and hot evening dinner.",
      "description_ur": "صبح کالج، یونیورسٹی یا جاب پر جانے والوں کے لیے بہترین اور کم خرچ پیکیج: صبح کا بھرپور ناشتہ اور رات کا تازہ کھانا۔"
    },
    {
      "id": "46098399-daf0-46d6-8095-ebf9d34911b9",
      "name_en": "Room Only (Optional / Self Mess)",
      "name_ur": "صرف رہائش (بغیر میس کے)",
      "is_active": true,
      "sort_order": 3,
      "price_monthly": 0,
      "description_en": "Mess is 100% optional. Pay only your monthly room rent and manage your own meals or join the mess later any month.",
      "description_ur": "میس کی سہولت مکمل طور پر اختیاری ہے۔ آپ صرف کمرے کا ماہانہ کرایہ ادا کریں اور جب چاہیں میس شروع یا بند کروا لیں۔"
    }
  ];
export const initialMessMenu: MessMenuDay[] = [
    {
      "id": "9898b862-9424-45a7-9e51-66d895055c51",
      "lunch_en": "Light Daal Moong Masoor with Jeera Rice & Pickle",
      "lunch_ur": "ہلکی پھلکی دال مونگ مسور مع زیرہ رائس اور اچار",
      "dinner_en": "Chicken Palak / Kofta Curry with Hot Rotis & Kheer Dessert",
      "dinner_ur": "چکن پالک / کوفتہ کری مع گرم روٹیاں اور میٹھی کھیر",
      "day_of_week": 0,
      "breakfast_en": "Sunday Special Halwa Puri, Chana Bhaji & Sweet Lassi / Tea",
      "breakfast_ur": "اتوار اسپیشل حلوہ پوری، چنے بھاجی اور میٹھی لسی / چائے"
    },
    {
      "id": "904c8808-9903-48ab-a85b-8a515e680ba4",
      "lunch_en": "Yellow Daal Tadka with Steamed Basmati Rice, Salad & Pickle",
      "lunch_ur": "تڑکے والی دال چاول مع تازہ سلاد اور اچار",
      "dinner_en": "Chicken Aloo Shorba / Aloo Gobi, Hot Rotis & Mint Raita",
      "dinner_ur": "چکن آلو شوربہ / آلو گوبھی، گرما گرم روٹیاں اور پودینہ رائتہ",
      "day_of_week": 1,
      "breakfast_en": "Crispy Paratha, Omelette / Half-Fry Egg & Karak Milk Tea",
      "breakfast_ur": "خستہ پراٹھا، آملیٹ / ہاف فرائی انڈا اور کڑک دودھ پتی چائے"
    },
    {
      "id": "2066c778-2865-48a7-97c8-d3df67e59918",
      "lunch_en": "Seasonal Mix Sabzi with Fresh Chapati & Yogurt Raita",
      "lunch_ur": "موسمی مکس سبزی مع تازہ چپاتی اور رائتہ",
      "dinner_en": "Special Chicken Karahi, Tandoori Rotis & Fresh Green Salad",
      "dinner_ur": "اسپیشل چکن کڑاہی، تندوری روٹیاں اور تازہ سلاد",
      "day_of_week": 2,
      "breakfast_en": "Lahori Chana Masala, Fresh Paratha & Hot Tea",
      "breakfast_ur": "لاہوری چنا مصالحہ، تازہ پراٹھا اور گرما گرم چائے"
    },
    {
      "id": "0d1bb946-f2bc-4fe4-bc9a-a83d5e413825",
      "lunch_en": "Shahi Daal Mash Fry, Hot Rotis & Onion Lemon Salad",
      "lunch_ur": "شاہی فرائی دال ماش، گرم روٹیاں اور پیاز لیموں سلاد",
      "dinner_en": "Karachi Style Chicken Biryani with Zeera Raita & Salad",
      "dinner_ur": "کراچی اسٹائل چکن بریانی مع زیرہ رائتہ اور سلاد",
      "day_of_week": 3,
      "breakfast_en": "Aloo Wala Paratha, Fresh Dahi (Yogurt) & Elaichi Tea",
      "breakfast_ur": "آلو والا پراٹھا، تازہ دہی اور الائچی چائے"
    },
    {
      "id": "c4c11217-ca01-4b47-8e5f-08c06e2b2a43",
      "lunch_en": "Kari Pakora with Boiled White Rice & Green Chutney",
      "lunch_ur": "کڑھی پکوڑا مع ابلے سفید چاول اور ہری چٹنی",
      "dinner_en": "Minced Aloo Qeema Masala with Fresh Tandoori Rotis",
      "dinner_ur": "لذیذ آلو قیمہ مصالحہ اور گرما گرم تندوری روٹیاں",
      "day_of_week": 4,
      "breakfast_en": "Paratha, Boiled / Fried Egg & Karak Chai",
      "breakfast_ur": "پراٹھا، ابلا یا فرائی انڈا اور کڑک چائے"
    },
    {
      "id": "25dabb4e-84f7-4def-aec0-c4f01f9c88da",
      "lunch_en": "Jummah Special Chicken Yakhni Pulao, Shami Kabab & Raita",
      "lunch_ur": "جمعہ اسپیشل چکن یخنی پلاؤ، شامی کباب، رائتہ اور سلاد",
      "dinner_en": "Daal Chana Fry with Desi Ghee Tarka & Hot Rotis",
      "dinner_ur": "دیسی گھی کے تڑکے والی دال چنا اور گرم روٹیاں",
      "day_of_week": 5,
      "breakfast_en": "Friday Special Egg Bhurji, Paratha & Milk Tea",
      "breakfast_ur": "جمعہ اسپیشل انڈا کھگینہ، پراٹھا اور دودھ پتی چائے"
    },
    {
      "id": "dea22b23-12fa-4611-afd9-fd0b1e6919c7",
      "lunch_en": "White Lobia / Rajma Masala with Steamed Rice & Salad",
      "lunch_ur": "سفید لوبیا مصالحہ مع ابلے چاول اور سلاد",
      "dinner_en": "Degi Chicken Qorma with Fresh Naan / Roti & Raita",
      "dinner_ur": "دیگی چکن قورمہ مع گرم نان / روٹی اور رائتہ",
      "day_of_week": 6,
      "breakfast_en": "Lachha Paratha, Chana Gravy & Hot Tea",
      "breakfast_ur": "لچھا پراٹھا، چنے کا سالن اور گرم چائے"
    }
  ];
export const initialGallery: GalleryItem[] = [
    {
      "id": "4a1e234b-ed36-4fd4-bb4b-0d8ab3b1d87d",
      "category": "building",
      "image_url": "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/cefb9fdc-a969-475e-bbf2-84f82c8fb173.jpg",
      "caption_en": "Front courtyard and three-story main building of Sadiqabad Student Hostel",
      "caption_ur": "صادق آباد اسٹوڈنٹ ہاسٹل کی تین منزلہ عمارت اور سرسبز لان کا بیرونی منظر",
      "sort_order": 1,
      "is_published": true
    },
    {
      "id": "7ad50d7d-3297-492d-9964-7af4f7a8c914",
      "category": "rooms",
      "image_url": "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/51a6274d-1479-464d-a797-579d34cb3f37.jpg",
      "caption_en": "Private Single Study Room with dedicated wooden desk, reading lamp, and wardrobe",
      "caption_ur": "پرائیویٹ سنگل اسٹڈی روم مع اسٹڈی ڈیسک، ریڈنگ لیمپ اور بڑی الماری",
      "sort_order": 2,
      "is_published": true
    },
    {
      "id": "f46bedd6-e3f7-4954-8bd7-9ba742af4dfd",
      "category": "rooms",
      "image_url": "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/7da1651e-d122-4be3-bfe1-5a9ae9ba75f5.jpg",
      "caption_en": "Executive 2-Bed Sharing Room with separate beds, wardrobes, and twin study stations",
      "caption_ur": "ایگزیکٹو ڈبل شیئرنگ روم مع الگ بیڈز، الماریاں اور دو اسٹڈی ڈیسک",
      "sort_order": 3,
      "is_published": true
    },
    {
      "id": "28dfe409-9c3a-4c98-abcd-36716ad85f07",
      "category": "rooms",
      "image_url": "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/74dcafda-2f06-468d-a377-1dee0cd4a5de.jpg",
      "caption_en": "Well-ventilated 3-Bed Sharing Room with personal numbered lockers and study counter",
      "caption_ur": "ہوا دار ۳ بیڈ شیئرنگ روم مع ذاتی نمبر والے لاکرز اور اسٹڈی کاؤنٹر",
      "sort_order": 4,
      "is_published": true
    },
    {
      "id": "4bdfeaa2-ced9-4625-9456-3eb686471391",
      "category": "rooms",
      "image_url": "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/8b111e71-bf2f-4531-8346-e1ebca259ee8.jpg",
      "caption_en": "Economy 4-Bed Sharing Room — spacious, spotless, and easy on a student budget",
      "caption_ur": "اکانومی ۴ بیڈ شیئرنگ روم — کشادہ، صاف ستھرا اور طلبہ کے بجٹ کے عین مطابق",
      "sort_order": 5,
      "is_published": true
    },
    {
      "id": "ef0cb620-67c2-4439-8642-d2671da3b694",
      "category": "mess",
      "image_url": "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/a4d93b7d-68f4-4a4d-86d5-89b7a0427f5a.jpg",
      "caption_en": "Hygienic resident dining hall serving fresh home-style meals three times daily",
      "caption_ur": "صاف ستھرا ڈائننگ ہال جہاں روزانہ تین وقت تازہ گھریلو کھانا پیش کیا جاتا ہے",
      "sort_order": 6,
      "is_published": true
    },
    {
      "id": "ccc5f7c8-9b94-408a-9471-4aaf44b00c9e",
      "category": "study_area",
      "image_url": "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/77f40cde-dca1-484c-8bc6-a4d0519c2f06.jpg",
      "caption_en": "Dedicated quiet study hall and library equipped with laptop sockets and fiber WiFi",
      "caption_ur": "خاموش اور روشن اسٹڈی ہال مع لیپ ٹاپ چارجنگ ساکٹس اور فائبر وائی فائی",
      "sort_order": 7,
      "is_published": true
    },
    {
      "id": "90dfc36b-b9f0-445e-8975-27d6c413b122",
      "category": "bathrooms",
      "image_url": "https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/seed-assets/cbbb6568-ed0c-425d-8694-164c403cc109.jpg",
      "caption_en": "Modern ceramic-tiled washroom with winter hot-water geyser and daily sanitation",
      "caption_ur": "جدید ٹائلز والا صاف واش روم مع سردیوں کے لیے گرم پانی کا گیزر",
      "sort_order": 8,
      "is_published": true
    }
  ];
export const initialRules: Rule[] = [
    {
      "id": "2dc6c8dd-235d-40ef-84d1-dcb15cb0b1e1",
      "text_en": "Main gate closes strictly at 10:00 PM. Late entry for academy classes or travel requires prior notice to the resident warden.",
      "text_ur": "مین گیٹ رات ۱۰:۰۰ بجے بند ہو جاتا ہے۔ اکیڈمی یا سفر کی وجہ سے تاخیر کی صورت میں وارڈن کو پیشگی اطلاع دینا لازمی ہے۔",
      "sort_order": 1,
      "is_published": true
    },
    {
      "id": "9bf8f981-a096-44a0-8f6e-144d290520b5",
      "text_en": "Visitors and parents are welcomed in the ground-floor reception lounge between 9:00 AM and 8:00 PM after entry in the gate register.",
      "text_ur": "والدین اور مہمانوں سے ملاقات صبح ۹:۰۰ سے شام ۸:۰۰ بجے تک گراؤنڈ فلور ریسیپشن لاؤنج میں گیٹ رجسٹر میں اندراج کے بعد کی جا سکتی ہے۔",
      "sort_order": 2,
      "is_published": true
    },
    {
      "id": "1788ac86-6c8a-48ef-9f9b-507b423dcbdf",
      "text_en": "Smoking, vapes, naswar, gutka, and all intoxicants are 100% prohibited inside rooms, washrooms, and hostel premises.",
      "text_ur": "ہاسٹل کی حدود، کمروں اور واش رومز میں سگریٹ نوشی، ویپ، نسوار، گٹکا اور ہر قسم کے نشے پر مکمل پابندی ہے۔",
      "sort_order": 3,
      "is_published": true
    },
    {
      "id": "e35a0915-1faf-4ce5-8559-5c42d3fa393d",
      "text_en": "Quiet study hours start at 9:30 PM daily. Loud music, speakerphone calls in corridors, or disturbing roommates is strictly disallowed.",
      "text_ur": "روزانہ رات ۹:۳۰ بجے کے بعد خاموشی کے اوقات شروع ہو جاتے ہیں۔ اونچی آواز میں میوزک یا راہداری میں شور منع ہے۔",
      "sort_order": 4,
      "is_published": true
    },
    {
      "id": "a210bbcc-11ce-4585-bb8a-45924208d9d9",
      "text_en": "Monthly room rent and chosen mess plan dues must be paid between the 1st and 7th of each month against an official receipt.",
      "text_ur": "ماہانہ کمرے کا کرایہ اور منتخب کردہ میس فیس ہر مہینے کی یکم سے ۷ تاریخ کے درمیان جمع کروا کر باقاعدہ رسید حاصل کریں۔",
      "sort_order": 5,
      "is_published": true
    },
    {
      "id": "df0bb9fa-227a-450a-80a4-04f4e56c6728",
      "text_en": "Heavy heating coils, electric stoves, or unauthorized room alterations are not allowed for fire and electrical safety.",
      "text_ur": "آگ اور شارٹ سرکٹ سے بچاؤ کے لیے کمرے میں الیکٹرک چولہا، راڈ یا ہیوی ہیٹر لگانے کی اجازت نہیں ہے۔",
      "sort_order": 6,
      "is_published": true
    },
    {
      "id": "4a9f9568-d8ad-4a7a-adad-4db9fa43aabe",
      "text_en": "A minimum 15-day advance notice is required before vacating a seat in order to claim your 100% security deposit refund.",
      "text_ur": "قابل واپسی سیکیورٹی ڈپازٹ مکمل واپس لینے کے لیے کمرہ چھوڑنے سے کم از کم ۱۵ دن پہلے مطلع کرنا ضروری ہے۔",
      "sort_order": 7,
      "is_published": true
    },
    {
      "id": "1c5a4184-da16-4393-8564-e93abeab0b2a",
      "text_en": "Every resident must submit a CNIC / B-Form copy, parent/guardian contact number, and college card or job employment proof at admission.",
      "text_ur": "داخلے کے وقت شناختی کارڈ یا بے فارم کی کاپی، والد یا سرپرست کا فون نمبر اور کالج کارڈ جمع کروانا لازمی ہے۔",
      "sort_order": 8,
      "is_published": true
    }
  ];
export const initialFaqs: Faq[] = [
    {
      "id": "6a1407d1-89e8-488a-bac3-5a4f139d76be",
      "answer_en": "Bring 1 copy of the student CNIC or B-Form, 1 copy of father/guardian CNIC, 2 passport-size photographs, and your college admission slip, university card, or job ID card.",
      "answer_ur": "طالب علم کے شناختی کارڈ یا بے فارم کی کاپی، والد یا سرپرست کے شناختی کارڈ کی کاپی، ۲ پاسپورٹ سائز تصاویر اور کالج سلپ یا اسٹوڈنٹ/جاب کارڈ ساتھ لائیں۔",
      "sort_order": 1,
      "question_en": "What documents are required at the time of admission?",
      "question_ur": "ہاسٹل میں داخلے کے وقت کون سے کاغذات درکار ہوتے ہیں؟",
      "is_published": true
    },
    {
      "id": "20599f7b-4553-4ef9-bf35-585e3e0a09d7",
      "answer_en": "Yes! High-speed fiber WiFi, RO drinking water, daily room cleaning, regular electricity (fans & lights), and UPS/generator backup are all included in the listed monthly room rent with no hidden charges.",
      "answer_ur": "جی ہاں! فائبر وائی فائی، آر او فلٹر پانی، روزانہ صفائی، پنکھے و لائٹس کی بجلی اور یو پی ایس/جنریٹر بیک اپ ماہانہ کرائے میں شامل ہیں، کوئی پوشیدہ چارجز نہیں۔",
      "sort_order": 2,
      "question_en": "Are WiFi, water, and UPS/generator backup included in the monthly rent?",
      "question_ur": "کیا وائی فائی، فلٹر پانی اور بجلی بیک اپ ماہانہ فیس میں شامل ہیں؟",
      "is_published": true
    },
    {
      "id": "b710d7fe-390b-4272-9724-729874d0b53e",
      "answer_en": "Mess is completely optional. You can choose our 3-Time Plan (Rs. 7,500/mo), 2-Time Student Plan (Rs. 5,500/mo), or Room Only (Rs. 0 mess fee) and change your plan at the start of any month.",
      "answer_ur": "میس بالکل اختیاری ہے۔ آپ ۳ وقت کا کھانا (۷,۵۰۰ روپے)، ۲ وقت کا اسٹوڈنٹ پیکیج (۵,۵۰۰ روپے) یا بغیر میس صرف کمرہ منتخب کر سکتے ہیں۔",
      "sort_order": 3,
      "question_en": "Is the hostel mess mandatory, or can I book a room without mess?",
      "question_ur": "کیا میس کا کھانا لینا لازمی ہے یا صرف کمرہ بھی مل سکتا ہے؟",
      "is_published": true
    },
    {
      "id": "a38db6a1-71b8-4225-bca7-5d8a291591da",
      "answer_en": "Your security deposit (Rs. 3,000 to Rs. 5,000 depending on room type) is 100% refundable on checkout when you inform the office 15 days in advance and hand over your room key and locker in good condition.",
      "answer_ur": "کمرے کے مطابق لی گئی سیکیورٹی (۳,۰۰۰ تا ۵,۰۰۰ روپے) ۱۵ دن پہلے اطلاع دے کر کمرہ اور لاکر درست حالت میں واپس کرنے پر سو فیصد واپس کر دی جاتی ہے۔",
      "sort_order": 4,
      "question_en": "How does the refundable security deposit work?",
      "question_ur": "سیکیورٹی ڈپازٹ کی واپسی کا طریقہ کار کیا ہے؟",
      "is_published": true
    },
    {
      "id": "d36befcc-abda-4c56-a730-81a4930aeda8",
      "answer_en": "We are right on Main College Road — a 3 to 5 minute walk to Punjab College, Superior/KIPS academies, and Govt. Post Graduate College Sadiqabad, and a 2-minute walk from the KFUEIT university bus pickup point.",
      "answer_ur": "ہاسٹل مین کالج روڈ پر واقع ہے جہاں سے پنجاب کالج، گورنمنٹ پوسٹ گریجویٹ کالج اور اکیڈمیز صرف ۳ سے ۵ منٹ پیدل فاصلے پر ہیں، اور خواجہ فرید یونیورسٹی بس اسٹاپ ۲ منٹ کی دوری پر ہے۔",
      "sort_order": 5,
      "question_en": "How far is the hostel from Punjab College, Govt. College, and KFUEIT bus route?",
      "question_ur": "ہاسٹل پنجاب کالج، گورنمنٹ کالج اور خواجہ فرید یونیورسٹی بس روٹ سے کتنا قریب ہے؟",
      "is_published": true
    },
    {
      "id": "73b3d010-86ae-44c0-a88a-1153859db256",
      "answer_en": "Yes! Mention your classmates’ names in the booking inquiry form or on WhatsApp, and our warden will allocate adjacent beds in the same Double, Triple, or 4-Sharing room.",
      "answer_ur": "جی بالکل! بکنگ فارم یا واٹس ایپ پر اپنے دوستوں کے نام بتا دیں، وارڈن آپ کو ایک ہی ڈبل، ٹرپل یا ۴ شیئرنگ کمرے میں اکٹھی سیٹیں الاٹ کر دیں گے۔",
      "sort_order": 6,
      "question_en": "Can two or three classmates reserve beds together in the same room?",
      "question_ur": "کیا دو یا تین کلاس فیلوز ایک ہی کمرے میں اکٹھے سیٹ بک کروا سکتے ہیں؟",
      "is_published": true
    }
  ];
export const initialReviews: Review[] = [
    {
      "id": "1f8cb5a4-1e6e-451e-8843-a19bc88948d4",
      "name": "Salman Akram · Branch Operations Officer, Meezan Bank",
      "rating": 5,
      "comment_en": "I booked the Private Single Study Room after my posting in Sadiqabad. Spotless attached washroom with hot water geyser in winter, secure bike parking, and genuinely home-like dinner.",
      "comment_ur": "صادق آباد پوسٹنگ کے بعد میں نے پرائیویٹ سنگل روم لیا۔ اٹیچ واش روم میں گیزر، محفوظ بائیک پارکنگ اور رات کا گھر جیسا کھانا لاجواب ہے۔",
      "created_at": "2026-11-02T18:31:47.11162+00:00",
      "is_visible": true
    },
    {
      "id": "b5a4242c-b22c-43f7-b229-2ca9461669c7",
      "name": "Usama Rasheed · BS Computer Science, KFUEIT",
      "rating": 5,
      "comment_en": "The university bus stop is right down the road, and the fiber WiFi plus UPS backup never let me miss an online lab submission. The 2-time student mess plan saves me a lot of money every month.",
      "comment_ur": "یونیورسٹی بس اسٹاپ بالکل قریب ہے اور فائبر وائی فائی و یو پی ایس بیک اپ کی وجہ سے آن لائن اسائنمنٹس میں کبھی مسئلہ نہیں بنا۔ دو وقت والا میس پیکیج بہت مناسب ہے۔",
      "created_at": "2026-11-02T18:31:46.916482+00:00",
      "is_visible": true
    },
    {
      "id": "e7a91b2d-3c7e-47f0-838b-f3436b635a6f",
      "name": "Tariq Mehmood · Parent from Ahmadpur Lama",
      "rating": 5,
      "comment_en": "As a father, security and discipline were my biggest concerns. The 10 PM gate rule, CCTV cameras, and polite resident warden gave our family complete peace of mind at a very reasonable monthly fee.",
      "comment_ur": "بحیثیت والد سیکیورٹی اور ماحول میری سب سے بڑی ترجیح تھی۔ رات ۱۰ بجے گیٹ کی پابندی، سی سی ٹی وی کیمرے اور وارڈن کے تعاون سے ہمیں مکمل اطمینان ملا۔",
      "created_at": "2026-11-02T18:31:46.70174+00:00",
      "is_visible": true
    },
    {
      "id": "be1b688e-4b93-4043-b805-f309e4e9de7f",
      "name": "M. Huzaifa · FSc, Punjab College Sadiqabad",
      "rating": 5,
      "comment_en": "Moved here from Kandhkot for my 1st year studies. Punjab College is a 4-minute walk away, rooms are cleaned every morning, and the quiet study hall helped me score 91% in board exams.",
      "comment_ur": "میں کندھ کوٹ سے ایف ایس سی کے لیے یہاں آیا تھا۔ پنجاب کالج صرف ۴ منٹ پیدل فاصلے پر ہے، کمرے روزانہ صاف ہوتے ہیں اور خاموش اسٹڈی ہال کی بدولت میرے امتحانات شاندار ہوئے۔",
      "created_at": "2026-11-02T18:31:46.533346+00:00",
      "is_visible": true
    }
  ];
export const initialNotices: Notice[] = [
    {
      "id": "08b7dbec-208a-45af-a6bd-0df5d2a2c302",
      "ends_at": "2026-11-15T18:58:59.417556+00:00",
      "text_en": "Admissions open – limited seats available",
      "text_ur": "داخلے جاری ہیں – نشستیں محدود ہیں",
      "is_active": true,
      "starts_at": "2026-10-16T18:58:59.417556+00:00"
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
