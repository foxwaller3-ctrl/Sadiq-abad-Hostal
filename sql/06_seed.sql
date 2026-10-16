-- Sadiqabad Student Hostel — SQL 06
-- Sample data only. Replace placeholder contact details, fees, menu, rules and
-- notice with owner-approved content before going live. No fake reviews or
-- placeholder gallery images are seeded.

insert into public.hostel_info
(id, name_en, name_ur, tagline_en, tagline_ur, about_en, about_ur, phone, whatsapp,
 email, address_en, address_ur, office_hours_en, office_hours_ur, hostel_type)
values
(1, 'Sadiqabad Student Hostel', 'صادق آباد اسٹوڈنٹ ہاسٹل',
 'Safe, Clean & Comfortable Hostel in Sadiqabad', 'صادق آباد میں محفوظ، صاف ستھرا اور آرام دہ ہاسٹل',
 'A comfortable hostel option for students and professionals in Sadiqabad.',
 'صادق آباد میں طلبہ اور ملازمت پیشہ افراد کے لیے ایک آرام دہ ہاسٹل۔',
 '0300-0000000', '0300-0000000', 'info@example.com',
 '[Complete hostel address], Sadiqabad, Punjab', '[ہاسٹل کا مکمل پتہ]، صادق آباد، پنجاب',
 '9:00 AM – 9:00 PM', 'صبح 9:00 تا رات 9:00', 'boys')
on conflict (id) do nothing;

insert into public.site_settings
(id, seo_title_en, seo_title_ur, seo_description_en, seo_description_ur,
 default_language, whatsapp_message_template_en, whatsapp_message_template_ur)
values
(1, 'Student Hostel in Sadiqabad – Rooms, Mess & WiFi',
 'صادق آباد میں اسٹوڈنٹ ہاسٹل – کمرے، میس اور وائی فائی',
 'Check hostel rooms, facilities, mess details and contact information in Sadiqabad.',
 'صادق آباد میں ہاسٹل کے کمرے، سہولیات، میس اور رابطے کی معلومات دیکھیں۔',
 'en', 'Assalam o Alaikum, I would like to inquire about the hostel.',
 'السلام علیکم، میں ہاسٹل کے بارے میں معلومات لینا چاہتا ہوں۔')
on conflict (id) do nothing;

-- Fixed the source-spec conflict: available beds cannot exceed beds_total.
insert into public.rooms
(slug, name_en, name_ur, room_type, beds_total, beds_available, monthly_fee,
 security_deposit, admission_fee, description_en, description_ur, features, sort_order)
values
('private-single', 'Private Single Room', 'پرائیویٹ سنگل روم', 'single', 1, 1, 15000, 5000, 2000,
 'A private room for one person.', 'ایک فرد کے لیے علیحدہ کمرہ۔',
 '[{"en":"Furnished bed + mattress","ur":"فرنشڈ بیڈ اور گدا"},{"en":"Wardrobe","ur":"الماری"},{"en":"Study table & chair","ur":"اسٹڈی ٹیبل اور کرسی"},{"en":"WiFi","ur":"وائی فائی"}]'::jsonb, 1),
('double-sharing', 'Double Sharing', 'ڈبل شیئرنگ', 'double', 2, 2, 9000, 5000, 2000,
 'A comfortable room shared by two.', 'دو افراد کے لیے آرام دہ مشترکہ کمرہ۔',
 '[{"en":"Furnished beds","ur":"فرنشڈ بیڈ"},{"en":"Wardrobe","ur":"الماری"},{"en":"Fan / Cooler","ur":"پنکھا / کولر"},{"en":"WiFi","ur":"وائی فائی"}]'::jsonb, 2),
('triple-sharing', 'Triple Sharing', 'ٹرپل شیئرنگ', 'triple', 3, 1, 7500, 5000, 2000,
 'A room shared by three residents.', 'تین رہائشیوں کے لیے مشترکہ کمرہ۔',
 '[{"en":"Furnished beds","ur":"فرنشڈ بیڈ"},{"en":"Study table","ur":"اسٹڈی ٹیبل"},{"en":"Fan / Cooler","ur":"پنکھا / کولر"},{"en":"WiFi","ur":"وائی فائی"}]'::jsonb, 3),
('economy-four', 'Economy Four Sharing', 'اکانومی فور شیئرنگ', 'quad', 4, 0, 6000, 5000, 2000,
 'A budget-friendly room shared by four residents.', 'چار رہائشیوں کے لیے کم خرچ مشترکہ کمرہ۔',
 '[{"en":"Beds + mattress","ur":"بیڈ اور گدا"},{"en":"Common bathroom","ur":"مشترکہ باتھ روم"},{"en":"Fan","ur":"پنکھا"},{"en":"WiFi","ur":"وائی فائی"}]'::jsonb, 4)
on conflict (slug) do nothing;

insert into public.mess_plans (name_en, name_ur, price_monthly, description_en, description_ur, sort_order)
select v.name_en, v.name_ur, v.price_monthly, v.description_en, v.description_ur, v.sort_order
from (values
 ('3 Time Meal', 'تین وقت کا کھانا', 9000, 'Breakfast, lunch and dinner.', 'ناشتہ، دوپہر اور رات کا کھانا۔', 1),
 ('2 Time Meal', 'دو وقت کا کھانا', 6500, 'Any two meals daily.', 'روزانہ کوئی بھی دو وقت کا کھانا۔', 2),
 ('No Mess', 'بغیر میس', 0, 'Mess is optional.', 'میس اختیاری ہے۔', 3)
) as v(name_en, name_ur, price_monthly, description_en, description_ur, sort_order)
where not exists (select 1 from public.mess_plans p where p.name_en = v.name_en);

-- day_of_week: 0 = Sunday ... 6 = Saturday, like JavaScript Date.getDay().
insert into public.mess_menu
(day_of_week, breakfast_en, breakfast_ur, lunch_en, lunch_ur, dinner_en, dinner_ur)
values
(0, 'Special Breakfast', 'خصوصی ناشتہ', 'Special Lunch', 'خصوصی دوپہر کا کھانا', 'Daal + Roti', 'دال اور روٹی'),
(1, 'Paratha + Chai', 'پراٹھا اور چائے', 'Daal Chawal', 'دال چاول', 'Aloo Gobi + Roti', 'آلو گوبھی اور روٹی'),
(2, 'Anda + Paratha', 'انڈا اور پراٹھا', 'Chicken Karahi + Roti', 'چکن کڑاہی اور روٹی', 'Daal Mash + Roti', 'دال ماش اور روٹی'),
(3, 'Halwa Puri', 'حلوہ پوری', 'Sabzi + Roti', 'سبزی اور روٹی', 'Biryani', 'بریانی'),
(4, 'Paratha + Chai', 'پراٹھا اور چائے', 'Daal Chana + Roti', 'دال چنا اور روٹی', 'Aloo Qeema + Roti', 'آلو قیمہ اور روٹی'),
(5, 'Anda + Paratha', 'انڈا اور پراٹھا', 'Chicken Pulao', 'چکن پلاؤ', 'Sabzi + Roti', 'سبزی اور روٹی'),
(6, 'Paratha + Chai', 'پراٹھا اور چائے', 'Kadhi Chawal', 'کڑھی چاول', 'Chicken + Roti', 'چکن اور روٹی')
on conflict (day_of_week) do nothing;

insert into public.facilities (title_en, title_ur, description_en, description_ur, sort_order)
select v.title_en, v.title_ur, v.description_en, v.description_ur, v.sort_order
from (values
 ('High-speed WiFi', 'تیز رفتار وائی فائی', 'Internet access for everyday study and work.', 'پڑھائی اور روزمرہ کام کے لیے انٹرنیٹ۔', 1),
 ('Filtered Drinking Water', 'فلٹر شدہ پینے کا پانی', 'Filtered water access for residents.', 'رہائشیوں کے لیے فلٹر شدہ پانی۔', 2),
 ('Electricity Backup', 'بجلی کا متبادل انتظام', 'Backup arrangements during power outages.', 'بجلی بند ہونے پر متبادل انتظام۔', 3),
 ('Geyser / Hot Water', 'گیزر / گرم پانی', 'Hot-water facility where available.', 'دستیابی کے مطابق گرم پانی کی سہولت۔', 4),
 ('Cooling Options', 'پنکھا / کولر / اے سی', 'Cooling options depend on the selected room.', 'کولنگ کی سہولت منتخب کمرے کے مطابق۔', 5),
 ('Mess', 'میس', 'Optional meal plans may be available.', 'اختیاری کھانے کے منصوبے دستیاب ہو سکتے ہیں۔', 6),
 ('Laundry', 'کپڑوں کی دھلائی', 'Laundry arrangement details to be confirmed by management.', 'لانڈری کی تفصیل انتظامیہ سے معلوم کریں۔', 7),
 ('Study Area', 'مطالعے کی جگہ', 'A place for quiet study when available.', 'دستیابی کے مطابق خاموشی سے پڑھنے کی جگہ۔', 8),
 ('CCTV', 'سی سی ٹی وی', 'CCTV coverage in designated common areas, if installed.', 'اگر نصب ہو تو مخصوص مشترکہ جگہوں میں سی سی ٹی وی۔', 9),
 ('Security Guard', 'سیکیورٹی گارڈ', 'Security arrangements to be confirmed by management.', 'سیکیورٹی کے انتظامات انتظامیہ سے معلوم کریں۔', 10),
 ('Parking', 'پارکنگ', 'Parking availability must be confirmed before arrival.', 'آنے سے پہلے پارکنگ کی دستیابی معلوم کریں۔', 11),
 ('Daily Cleaning', 'روزانہ صفائی', 'Cleaning schedule to be confirmed by management.', 'صفائی کا شیڈول انتظامیہ سے معلوم کریں۔', 12),
 ('Furnished Rooms', 'فرنشڈ کمرے', 'Room furnishings vary by room type.', 'کمرے کا فرنیچر کمرے کی قسم کے مطابق مختلف ہو سکتا ہے۔', 13)
) as v(title_en, title_ur, description_en, description_ur, sort_order)
where not exists (select 1 from public.facilities f where f.title_en = v.title_en);

insert into public.rules (text_en, text_ur, sort_order)
select v.text_en, v.text_ur, v.sort_order
from (values
 ('Residents should return by 10:00 PM unless management has approved otherwise.', 'انتظامیہ کی اجازت کے بغیر رہائشی رات 10 بجے تک واپس آ جائیں۔', 1),
 ('Visitors are allowed only in the designated area and during approved hours.', 'مہمانوں سے ملاقات صرف مقررہ جگہ اور وقت پر کی جا سکتی ہے۔', 2),
 ('Intoxicants and smoking are prohibited on hostel premises.', 'ہاسٹل میں نشہ آور اشیا اور سگریٹ نوشی ممنوع ہیں۔', 3),
 ('Noise, disturbances and fighting are not allowed, especially at night.', 'شور، بد نظمی اور لڑائی جھگڑا منع ہے، خاص طور پر رات کے وقت۔', 4),
 ('Residents may be charged for damage to hostel property.', 'ہاسٹل کی املاک کو نقصان پہنچانے پر جرمانہ ہو سکتا ہے۔', 5),
 ('High-power electrical appliances require prior permission.', 'زیادہ بجلی استعمال کرنے والے آلات کے لیے پیشگی اجازت ضروری ہے۔', 6),
 ('Monthly fees must be paid within the announced due period.', 'ماہانہ فیس مقررہ مدت کے اندر جمع کروانا ضروری ہے۔', 7),
 ('Management decisions on hostel operations must be followed.', 'ہاسٹل کے انتظامی معاملات میں انتظامیہ کے فیصلوں پر عمل کرنا ضروری ہے۔', 8)
) as v(text_en, text_ur, sort_order)
where not exists (select 1 from public.rules r where r.text_en = v.text_en);

insert into public.faqs (question_en, question_ur, answer_en, answer_ur, sort_order)
select v.question_en, v.question_ur, v.answer_en, v.answer_ur, v.sort_order
from (values
 ('How do I apply for admission?', 'داخلے کے لیے کیسے درخواست دوں؟', 'Send an inquiry through the website or contact the owner to confirm availability, fees and required documents.', 'ویب سائٹ پر انکوائری بھیجیں یا دستیابی، فیس اور مطلوبہ دستاویزات کی تصدیق کے لیے مالک سے رابطہ کریں۔', 1),
 ('Is the mess compulsory?', 'کیا میس لازمی ہے؟', 'The sample plan treats mess as optional. Confirm current options and prices with management.', 'نمونہ منصوبے کے مطابق میس اختیاری ہے۔ موجودہ سہولت اور قیمت انتظامیہ سے معلوم کریں۔', 2),
 ('Is WiFi included?', 'کیا وائی فائی شامل ہے؟', 'WiFi is listed as a sample facility. Confirm current availability and any conditions with management.', 'وائی فائی نمونہ سہولت کے طور پر درج ہے۔ موجودہ دستیابی اور شرائط انتظامیہ سے معلوم کریں۔', 3),
 ('Is the security deposit refundable?', 'کیا سیکیورٹی ڈپازٹ واپس ہوتا ہے؟', 'The sample fee note says the deposit may be returned at checkout after deductions for damage. Confirm the actual policy before admission.', 'نمونہ ہدایت کے مطابق نقصان کی کٹوتی کے بعد ڈپازٹ واپسی ممکن ہے۔ داخلے سے پہلے اصل پالیسی کی تصدیق کریں۔', 4),
 ('Are visitors allowed?', 'کیا مہمان آ سکتے ہیں؟', 'Visitors must follow the hostel rules and designated visiting times and areas.', 'مہمانوں کو ہاسٹل کے قواعد، مقررہ اوقات اور جگہ کی پابندی کرنا ہوگی۔', 5),
 ('Is backup power available?', 'کیا بجلی کا بیک اپ موجود ہے؟', 'Backup power is listed as a sample facility. Ask management about actual equipment and coverage.', 'بجلی کا بیک اپ نمونہ سہولت کے طور پر درج ہے۔ اصل انتظامات کے بارے میں انتظامیہ سے پوچھیں۔', 6)
) as v(question_en, question_ur, answer_en, answer_ur, sort_order)
where not exists (select 1 from public.faqs f where f.question_en = v.question_en);

insert into public.notices (text_en, text_ur, starts_at, ends_at, is_active)
select 'Admissions open – limited seats available', 'داخلے جاری ہیں – نشستیں محدود ہیں',
       now(), now() + interval '30 days', true
where not exists (select 1 from public.notices n
                  where n.text_en = 'Admissions open – limited seats available');
