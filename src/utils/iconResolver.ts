export type SemanticIconKey =
  | 'wifi'
  | 'droplet'
  | 'droplets'
  | 'zap'
  | 'battery-charging'
  | 'flame'
  | 'wind'
  | 'utensils'
  | 'coffee'
  | 'shirt'
  | 'book-open'
  | 'lamp-desk'
  | 'video'
  | 'shield-check'
  | 'bike'
  | 'sparkles'
  | 'bed'
  | 'bed-single'
  | 'lock'
  | 'bath'
  | 'wallet'
  | 'clock'
  | 'users'
  | 'ban'
  | 'volume-x'
  | 'id-card'
  | 'heart-pulse'
  | 'compass'
  | 'graduation-cap'
  | 'calendar-check'
  | 'check-circle';

/**
 * Pure semantic icon resolver for English and Urdu hostel amenities, room features, and rules.
 */
export function resolveAmenityIconKey(rawText: string | null | undefined): SemanticIconKey {
  if (!rawText) return 'check-circle';
  const text = rawText.trim().toLowerCase();
  if (!text) return 'check-circle';

  // Exact known keys first
  const exactKeys = new Set<SemanticIconKey>([
    'wifi',
    'droplet',
    'droplets',
    'zap',
    'battery-charging',
    'flame',
    'wind',
    'utensils',
    'coffee',
    'shirt',
    'book-open',
    'lamp-desk',
    'video',
    'shield-check',
    'bike',
    'sparkles',
    'bed',
    'bed-single',
    'lock',
    'bath',
    'wallet',
    'clock',
    'users',
    'ban',
    'volume-x',
    'id-card',
    'heart-pulse',
    'compass',
    'graduation-cap',
    'calendar-check',
    'check-circle'
  ]);
  if (exactKeys.has(text as SemanticIconKey)) {
    return text as SemanticIconKey;
  }

  // WiFi & Internet (prioritize if primary topic is wifi/internet)
  if (
    text.includes('wifi') ||
    text.includes('wi-fi') ||
    text.includes('internet') ||
    text.includes('fiber') ||
    text.includes('وائی فائی') ||
    text.includes('انٹرنیٹ') ||
    text.includes('فائبر')
  ) {
    return 'wifi';
  }

  // Geyser / Hot water (check before generic water/washroom)
  if (
    text.includes('geyser') ||
    text.includes('hot water') ||
    text.includes('hot-water') ||
    text.includes('winter') ||
    text.includes('گیزر') ||
    text.includes('گرم پانی')
  ) {
    return 'flame';
  }

  // Washroom / Attached bath
  if (
    text.includes('washroom') ||
    text.includes('bathroom') ||
    text.includes('attached bath') ||
    text.includes('tiled') ||
    text.includes('واش روم') ||
    text.includes('باتھ روم')
  ) {
    return 'bath';
  }

  // Drinking water / RO filtration
  if (
    text.includes('water') ||
    text.includes('ro ') ||
    text.startsWith('ro ') ||
    text.includes('drinking') ||
    text.includes('purified') ||
    text.includes('پانی') ||
    text.includes('آر او') ||
    text.includes('فلٹر')
  ) {
    return 'droplets';
  }

  // Lockers, wardrobes, cupboards
  if (
    text.includes('locker') ||
    text.includes('cupboard') ||
    text.includes('wardrobe') ||
    text.includes('lockable') ||
    text.includes('لاکر') ||
    text.includes('الماری') ||
    text.includes('تالے')
  ) {
    return 'lock';
  }

  // Study desk, table, lamp, library
  if (
    text.includes('study') ||
    text.includes('desk') ||
    text.includes('lamp') ||
    text.includes('library') ||
    text.includes('reading') ||
    text.includes('اسٹڈی') ||
    text.includes('ٹیبل') ||
    text.includes('لیمپ') ||
    text.includes('لائبریری') ||
    text.includes('مطالع')
  ) {
    return 'lamp-desk';
  }

  // Single private room / single occupant
  if (
    text.includes('private room') ||
    text.includes('single occupant') ||
    text.includes('100% private') ||
    text.includes('ذاتی کمرہ') ||
    text.includes('ایک فرد')
  ) {
    return 'bed-single';
  }

  // Beds & mattresses
  if (
    text.includes('bed') ||
    text.includes('mattress') ||
    text.includes('furnished') ||
    text.includes('بیڈ') ||
    text.includes('گدے') ||
    text.includes('گدا') ||
    text.includes('فرنشڈ')
  ) {
    return 'bed';
  }

  // Cooling, fans, ventilation
  if (
    text.includes('cooler') ||
    text.includes('fan') ||
    text.includes('air ') ||
    text.includes('ventilat') ||
    text.includes('کولر') ||
    text.includes('پنکھ') ||
    text.includes('ہوا دار')
  ) {
    return 'wind';
  }

  // Power, UPS, generator, sockets
  if (
    text.includes('ups') ||
    text.includes('generator') ||
    text.includes('power') ||
    text.includes('backup') ||
    text.includes('socket') ||
    text.includes('solar') ||
    text.includes('electric') ||
    text.includes('یو پی ایس') ||
    text.includes('جنریٹر') ||
    text.includes('بجلی')
  ) {
    return 'zap';
  }

  // Cleaning & housekeeping
  if (
    text.includes('clean') ||
    text.includes('housekeeping') ||
    text.includes('sanit') ||
    text.includes('صفائی') ||
    text.includes('جراثیم')
  ) {
    return 'sparkles';
  }

  // Mess & dining
  if (
    text.includes('mess') ||
    text.includes('meal') ||
    text.includes('dining') ||
    text.includes('food') ||
    text.includes('breakfast') ||
    text.includes('dinner') ||
    text.includes('میس') ||
    text.includes('کھانا') ||
    text.includes('ناشتہ')
  ) {
    return 'utensils';
  }

  // Laundry & ironing
  if (
    text.includes('laundry') ||
    text.includes('washing') ||
    text.includes('iron') ||
    text.includes('واشنگ') ||
    text.includes('استری') ||
    text.includes('دھلائی')
  ) {
    return 'shirt';
  }

  // CCTV & cameras
  if (
    text.includes('cctv') ||
    text.includes('camera') ||
    text.includes('surveillance') ||
    text.includes('سی سی ٹی وی') ||
    text.includes('کیمر')
  ) {
    return 'video';
  }

  // Security, guard, warden
  if (
    text.includes('security') ||
    text.includes('guard') ||
    text.includes('warden') ||
    text.includes('safe') ||
    text.includes('سیکیورٹی') ||
    text.includes('گارڈ') ||
    text.includes('وارڈن') ||
    text.includes('محفوظ')
  ) {
    return 'shield-check';
  }

  // Bike & cycle parking
  if (
    text.includes('parking') ||
    text.includes('bike') ||
    text.includes('cycle') ||
    text.includes('پارکنگ') ||
    text.includes('موٹر سائیکل')
  ) {
    return 'bike';
  }

  // Medical / hospital
  if (
    text.includes('hospital') ||
    text.includes('medical') ||
    text.includes('first aid') ||
    text.includes('ہسپتال') ||
    text.includes('طبی')
  ) {
    return 'heart-pulse';
  }

  // Prayer / mosque
  if (
    text.includes('prayer') ||
    text.includes('mosque') ||
    text.includes('namaz') ||
    text.includes('نماز') ||
    text.includes('مسجد')
  ) {
    return 'compass';
  }

  return 'check-circle';
}

/**
 * Resolves contextual icon keys for hostel code-of-conduct rules.
 */
export function resolveRuleIconKey(rawText: string | null | undefined): SemanticIconKey {
  if (!rawText) return 'shield-check';
  const text = rawText.trim().toLowerCase();

  if (text.includes('smoking') || text.includes('prohibited') || text.includes('intoxicant') || text.includes('سگریٹ') || text.includes('پابندی') || text.includes('ممنوع')) {
    return 'ban';
  }
  if (text.includes('quiet') || text.includes('noise') || text.includes('loud') || text.includes('خاموشی') || text.includes('شور')) {
    return 'volume-x';
  }
  if (text.includes('visitor') || text.includes('parent') || text.includes('guest') || text.includes('مہمان') || text.includes('والدین')) {
    return 'users';
  }
  if (text.includes('cnic') || text.includes('b-form') || text.includes('document') || text.includes('شناختی کارڈ') || text.includes('کاغذات')) {
    return 'id-card';
  }
  if (text.includes('rent') || text.includes('dues') || text.includes('receipt') || text.includes('fee') || text.includes('کرایہ') || text.includes('فیس')) {
    return 'wallet';
  }
  if (text.includes('15-day') || text.includes('advance notice') || text.includes('vacating') || text.includes('پیشگی') || text.includes('چھوڑنے')) {
    return 'calendar-check';
  }
  if (text.includes('gate') || text.includes('10:00') || text.includes('return by') || text.includes('گیٹ') || text.includes('رات')) {
    return 'clock';
  }
  if (text.includes('electric') || text.includes('stove') || text.includes('heater') || text.includes('شارٹ سرکٹ') || text.includes('چولہا')) {
    return 'zap';
  }

  return 'shield-check';
}
