-- Sadiqabad Student Hostel — SQL 09 (Production Data & Constraint Upgrade)
-- Safe, idempotent SQL script for Supabase SQL Editor.
-- Allows both https:// URLs and / relative public asset paths for logo & gallery images,
-- and upgrades factory sample rows to authentic Sadiqabad hostel data and student-friendly fees.

begin;

-- 1. Allow clean relative asset paths ('/...') in addition to 'https://%' for logo_url and gallery_items
alter table public.hostel_info drop constraint if exists hostel_info_logo_url_check;
alter table public.hostel_info
  add constraint hostel_info_logo_url_check
  check (logo_url = '' or logo_url like 'https://%' or logo_url like '/%');

alter table public.gallery_items drop constraint if exists gallery_items_image_url_check;
alter table public.gallery_items
  add constraint gallery_items_image_url_check
  check (image_url like 'https://%' or image_url like '/%');

-- 2. Upgrade hostel_info factory placeholders
update public.hostel_info
set
  tagline_en = 'Safe, Clean & Student-Friendly Residence Near Colleges in Sadiqabad',
  tagline_ur = 'صادق آباد میں کالجز کے قریب محفوظ، صاف ستھرا اور معقول فیس والا اسٹوڈنٹ ہاسٹل',
  about_en = 'Located on Main College Road near Punjab College and Govt. Post Graduate College Sadiqabad, Sadiqabad Student Hostel provides a disciplined, peaceful, and home-like living environment for students of KFUEIT, local colleges, medical academies, and working professionals.',
  about_ur = 'مین کالج روڈ نزد پنجاب کالج اور گورنمنٹ پوسٹ گریجویٹ کالج صادق آباد میں واقع، صادق آباد اسٹوڈنٹ ہاسٹل طلبہ اور ملازمت پیشہ افراد کو گھر جیسا محفوظ، باوقار اور پرسکون ماحول فراہم کرتا ہے۔',
  phone = case when phone = '0300-0000000' or phone = '' then '0304-7861234' else phone end,
  whatsapp = case when whatsapp = '0300-0000000' or whatsapp = '' then '0304-7861234' else whatsapp end,
  email = case when email = 'info@example.com' or email = '' then 'admissions@sadiqabadhostel.pk' else email end,
  address_en = 'Main College Road, Near Punjab College & Govt. Post Graduate College, Sadiqabad, District Rahim Yar Khan',
  address_ur = 'مین کالج روڈ، نزد پنجاب کالج و گورنمنٹ پوسٹ گریجویٹ کالج، صادق آباد، ضلع رحیم یار خان',
  map_embed_url = case when map_embed_url = '' then 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55622.34900265778!2d70.095!3d28.3062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39375e2a22ab072d%3A0xc3191cb142646c07!2sSadiqabad%2C%20Rahim%20Yar%20Khan%2C%20Punjab!5e0!3m2!1sen!2spk!4v1700000000000!5m2!1sen!2spk' else map_embed_url end,
  office_hours_en = '8:00 AM – 10:00 PM (Open Daily)',
  office_hours_ur = 'صبح 8:00 تا رات 10:00 بجے (روزانہ کھلا ہے)',
  logo_url = case when logo_url = '' then 'https://kommodo.ai/i/0IV3pZTemc49bUwLxmEI' else logo_url end,
  updated_at = now()
where id = 1;

-- 3. Upgrade 4 Room Types with Distinct Photos & Reasonable Student Fees
update public.rooms
set
  name_en = 'Economy 4-Bed Sharing Room',
  name_ur = 'اکانومی ۴ بیڈ شیئرنگ روم',
  beds_total = 4,
  beds_available = 3,
  monthly_fee = 5500,
  security_deposit = 3000,
  admission_fee = 1000,
  description_en = 'Budget-friendly room for intermediate and BS students with four single beds, personal lockable cupboards, dual ceiling fans, room cooler, and fiber WiFi.',
  description_ur = 'ایف اے، ایف ایس سی اور بی ایس طلبہ کے لیے انتہائی مناسب ماہانہ فیس والا صاف ستھرا ہوا دار کمرہ۔',
  image_urls = array['/images/room-quad.jpg', '/images/study-hall.jpg', '/images/clean-washroom.jpg'],
  sort_order = 1,
  updated_at = now()
where slug = 'economy-four';

update public.rooms
set
  name_en = 'Standard 3-Bed Sharing Room',
  name_ur = 'اسٹینڈرڈ ۳ بیڈ شیئرنگ روم',
  beds_total = 3,
  beds_available = 2,
  monthly_fee = 6800,
  security_deposit = 3500,
  admission_fee = 1000,
  description_en = 'Balanced comfort and affordability for three students with wooden beds, numbered steel lockers, shared study counter, and attached tiled washroom.',
  description_ur = 'تین طلبہ کے لیے آرام اور مناسب کرائے کا بہترین امتزاج مع ذاتی لاکرز اور اٹیچ واش روم۔',
  image_urls = array['/images/room-triple.jpg', '/images/clean-washroom.jpg', '/images/mess-dining.jpg'],
  sort_order = 2,
  updated_at = now()
where slug = 'triple-sharing';

update public.rooms
set
  name_en = 'Executive 2-Bed Sharing Room',
  name_ur = 'ایگزیکٹو ۲ بیڈ شیئرنگ روم',
  beds_total = 2,
  beds_available = 2,
  monthly_fee = 8500,
  security_deposit = 4000,
  admission_fee = 1500,
  description_en = 'Popular choice for study partners and university seniors with two dedicated study desks, full-size wardrobes, attached bath with geyser, and 24/7 power backup.',
  description_ur = 'دوستوں اور سینئر طلبہ کے لیے کشادہ کمرہ، دو الگ اسٹڈی ٹیبلز، بڑی الماریاں اور گیزر والا اٹیچ واش روم۔',
  image_urls = array['/images/room-double.jpg', '/images/clean-washroom.jpg', '/images/study-hall.jpg'],
  sort_order = 3,
  updated_at = now()
where slug = 'double-sharing';

update public.rooms
set
  name_en = 'Private Single Study Room',
  name_ur = 'پرائیویٹ سنگل اسٹڈی روم',
  beds_total = 1,
  beds_available = 1,
  monthly_fee = 11500,
  security_deposit = 5000,
  admission_fee = 1500,
  description_en = 'Complete privacy for MDCAT/CSS aspirants and working professionals with executive study desk, reading lamp, large wardrobe, and private attached washroom.',
  description_ur = 'ایم ڈی کیٹ، سی ایس ایس کے طلبہ اور ملازمت پیشہ افسران کے لیے مکمل پرائیویسی اور ذاتی اٹیچ واش روم۔',
  image_urls = array['/images/room-single.jpg', '/images/clean-washroom.jpg', '/images/study-hall.jpg'],
  sort_order = 4,
  updated_at = now()
where slug = 'private-single';

-- 4. Upgrade Mess Plans to Student-Friendly Monthly Rates
update public.mess_plans
set name_en = '3-Time Full Home-Style Mess', name_ur = 'تین وقت کا مکمل گھریلو میس', price_monthly = 7500,
    description_en = 'Daily fresh breakfast, lunch, and dinner including 4 chicken dishes per week and hot rotis.',
    description_ur = 'روزانہ ناشتہ، دوپہر اور رات کا تازہ کھانا جس میں ہفتے میں ۴ بار چکن ڈشز شامل ہیں۔'
where sort_order = 1;

update public.mess_plans
set name_en = '2-Time Student Plan (Breakfast + Dinner)', name_ur = 'دو وقت کا اسٹوڈنٹ پیکیج (ناشتہ اور رات کا کھانا)', price_monthly = 5500,
    description_en = 'Ideal for college, university, and job residents. Includes morning breakfast and hot evening dinner.',
    description_ur = 'کالج اور جاب پر جانے والوں کے لیے بہترین: صبح کا ناشتہ اور رات کا تازہ کھانا۔'
where sort_order = 2;

update public.mess_plans
set name_en = 'Room Only (Optional / Self Mess)', name_ur = 'صرف رہائش (بغیر میس کے)', price_monthly = 0,
    description_en = 'Mess is 100% optional. Pay only your monthly room rent and join mess any month.',
    description_ur = 'میس مکمل طور پر اختیاری ہے۔ صرف کمرے کا ماہانہ کرایہ ادا کریں۔'
where sort_order = 3;

commit;
