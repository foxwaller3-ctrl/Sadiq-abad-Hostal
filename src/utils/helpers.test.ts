import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePakistaniPhone,
  normalizePakistaniPhoneForDb,
  formatCurrency,
  getAvailabilityStatus,
  pickLang,
  getDayName,
  isNoticeActive,
  normalizeImageUrl,
  slugifyRoomName,
  ensureUniqueSlug,
  extractMapEmbedUrl,
  getRoomImages,
  getRoomPrimaryImage
} from './helpers.ts';
import {
  enrichHostelInfo,
  enrichRooms,
  enrichFacilities,
  enrichFaqs
} from '../services/seedEnrichment.ts';
import { stripSystemFields } from '../services/serviceHelpers.ts';
import type { HostelInfo, Room, Facility, Faq } from '../types/index.ts';

const POSTGRES_PHONE_REGEX = /^(\+92|0)3[0-9]{2}[- ]?[0-9]{7}$/;

test('validatePakistaniPhone recognizes valid Pakistani formats', () => {
  assert.equal(validatePakistaniPhone('03001234567'), true);
  assert.equal(validatePakistaniPhone('0300-1234567'), true);
  assert.equal(validatePakistaniPhone('+923001234567'), true);
  assert.equal(validatePakistaniPhone('+92 300 1234567'), true);
  assert.equal(validatePakistaniPhone('0345-9876543'), true);
  assert.equal(validatePakistaniPhone('0312 3456789'), true);
});

test('validatePakistaniPhone rejects invalid numbers', () => {
  assert.equal(validatePakistaniPhone(''), false);
  assert.equal(validatePakistaniPhone('12345'), false);
  assert.equal(validatePakistaniPhone('04231234567'), false);
  assert.equal(validatePakistaniPhone('02001234567'), false);
  assert.equal(validatePakistaniPhone('not-a-number'), false);
});

test('normalizePakistaniPhoneForDb always outputs format matching PostgreSQL CHECK constraint', () => {
  const inputs = [
    '03001234567',
    '0300-1234567',
    '0300 1234567',
    '+923001234567',
    '+92 304 7861234',
    '+92-312-9876543'
  ];
  for (const input of inputs) {
    const normalized = normalizePakistaniPhoneForDb(input);
    assert.equal(
      POSTGRES_PHONE_REGEX.test(normalized),
      true,
      `Expected "${normalized}" (from "${input}") to match Postgres phone CHECK`
    );
  }
});

test('formatCurrency formats PKR amounts with thousand separator', () => {
  assert.equal(formatCurrency(11500), 'Rs. 11,500');
  assert.equal(formatCurrency(0), 'Rs. 0');
  assert.equal(formatCurrency(5500), 'Rs. 5,500');
});

test('getAvailabilityStatus returns correct status category', () => {
  assert.equal(getAvailabilityStatus(0), 'full');
  assert.equal(getAvailabilityStatus(-1), 'full');
  assert.equal(getAvailabilityStatus(1), 'limited');
  assert.equal(getAvailabilityStatus(2), 'limited');
  assert.equal(getAvailabilityStatus(3), 'available');
  assert.equal(getAvailabilityStatus(10), 'available');
});

test('pickLang retrieves correct localized field with fallback', () => {
  const item = {
    name_en: 'Single Room',
    name_ur: 'سنگل روم',
    tagline_en: 'Only English Tagline',
    tagline_ur: ''
  };

  assert.equal(pickLang(item, 'name', 'en'), 'Single Room');
  assert.equal(pickLang(item, 'name', 'ur'), 'سنگل روم');
  assert.equal(pickLang(item, 'tagline', 'ur'), 'Only English Tagline');
});

test('getDayName returns localized days correctly', () => {
  assert.equal(getDayName(1, 'en'), 'Monday');
  assert.equal(getDayName(1, 'ur'), 'پیر');
  assert.equal(getDayName(5, 'en'), 'Friday');
  assert.equal(getDayName(5, 'ur'), 'جمعہ');
  assert.equal(getDayName(0, 'en'), 'Sunday');
  assert.equal(getDayName(0, 'ur'), 'اتوار');
});

test('isNoticeActive tests range validity', () => {
  const pastNotice = {
    is_active: true,
    starts_at: '2020-01-01T00:00:00Z',
    ends_at: '2020-02-01T00:00:00Z'
  };
  assert.equal(isNoticeActive(pastNotice), false);

  const currentNotice = {
    is_active: true,
    starts_at: new Date(Date.now() - 3600000).toISOString(),
    ends_at: new Date(Date.now() + 3600000).toISOString()
  };
  assert.equal(isNoticeActive(currentNotice), true);
  assert.equal(isNoticeActive({ ...currentNotice, is_active: false }), false);
});

test('normalizeImageUrl resolves Kommodo share links to /logo.png and trims URLs', () => {
  assert.equal(normalizeImageUrl('https://kommodo.ai/i/0IV3pZTemc49bUwLxmEI'), '/logo.png');
  assert.equal(normalizeImageUrl(' https://kommodo.ai/i/0IV3pZTemc49bUwLxmEI  '), '/logo.png');
  assert.equal(normalizeImageUrl('https://example.com/custom-logo.png'), 'https://example.com/custom-logo.png');
  assert.equal(normalizeImageUrl(''), '');
  assert.equal(normalizeImageUrl(null), '');
});

test('slugifyRoomName and ensureUniqueSlug generate collision-free slugs', () => {
  assert.equal(slugifyRoomName('VIP 2-Sharing AC Room!'), 'vip-2-sharing-ac-room');
  assert.equal(
    ensureUniqueSlug('Double Sharing Room', ['double-sharing-room', 'double-sharing-room-2']),
    'double-sharing-room-3'
  );
  assert.equal(ensureUniqueSlug('New Executive Suite', ['single-room']), 'new-executive-suite');
});

test('extractMapEmbedUrl handles raw URLs, full iframe snippets, and invalid URLs safely', () => {
  const validUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d123';
  assert.equal(extractMapEmbedUrl(validUrl), validUrl);
  assert.equal(
    extractMapEmbedUrl(`<iframe src="${validUrl}" width="600" height="450"></iframe>`),
    validUrl
  );
  assert.equal(extractMapEmbedUrl('https://maps.app.goo.gl/xyz'), '');
  assert.equal(extractMapEmbedUrl(''), '');
});

test('getRoomImages assigns distinct default photos per room_type and strips Unsplash URLs', () => {
  const singleImgs = getRoomImages({ room_type: 'single', image_urls: [] });
  const doubleImgs = getRoomImages({ room_type: 'double', image_urls: [] });
  const tripleImgs = getRoomImages({ room_type: 'triple', image_urls: [] });
  const quadImgs = getRoomImages({
    room_type: 'quad',
    image_urls: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5']
  });

  assert.equal(singleImgs[0], '/images/room-single.jpg');
  assert.equal(doubleImgs[0], '/images/room-double.jpg');
  assert.equal(tripleImgs[0], '/images/room-triple.jpg');
  assert.equal(quadImgs[0], '/images/room-quad.jpg');
  assert.notEqual(singleImgs[0], doubleImgs[0]);
  assert.notEqual(doubleImgs[0], tripleImgs[0]);
  assert.notEqual(tripleImgs[0], quadImgs[0]);

  const customImg = getRoomPrimaryImage({
    room_type: 'single',
    image_urls: ['https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/custom.jpg']
  });
  assert.equal(
    customImg,
    'https://zyuteumppyrazhswtext.supabase.co/storage/v1/object/public/hostel-media/custom.jpg'
  );
});

test('stripSystemFields removes id, created_at, and updated_at so Supabase generates valid UUIDs', () => {
  const cleaned = stripSystemFields({
    id: '',
    name_en: 'Custom Room',
    created_at: '2026-01-01',
    updated_at: '2026-01-01'
  });
  assert.equal('id' in cleaned, false);
  assert.equal('created_at' in cleaned, false);
  assert.equal('updated_at' in cleaned, false);
  assert.equal(cleaned.name_en, 'Custom Room');
});

test('seedEnrichment replaces 06_seed.sql placeholders while preserving real Admin edits', () => {
  const rawInfo: HostelInfo = {
    id: 1,
    name_en: 'My Custom Hostel Name',
    name_ur: 'میرا کسٹم ہاسٹل',
    tagline_en: 'Safe, Clean & Comfortable Hostel in Sadiqabad',
    tagline_ur: 'صادق آباد میں محفوظ، صاف ستھرا اور آرام دہ ہاسٹل',
    about_en: 'A comfortable hostel option for students and professionals in Sadiqabad.',
    about_ur: 'صادق آباد میں طلبہ اور ملازمت پیشہ افراد کے لیے ایک آرام دہ ہاسٹل۔',
    phone: '0300-0000000',
    whatsapp: '0300-0000000',
    email: 'info@example.com',
    address_en: '[Complete hostel address], Sadiqabad, Punjab',
    address_ur: '[ہاسٹل کا مکمل پتہ]، صادق آباد، پنجاب',
    map_embed_url: '',
    office_hours_en: '9:00 AM – 9:00 PM',
    office_hours_ur: 'صبح 9:00 تا رات 9:00',
    social_links: {},
    logo_url: '',
    hostel_type: 'boys'
  };

  const enrichedInfo = enrichHostelInfo(rawInfo);
  assert.equal(enrichedInfo.name_en, 'My Custom Hostel Name');
  assert.equal(enrichedInfo.phone.includes('0300-0000000'), false);
  assert.equal(enrichedInfo.address_en.includes('[Complete hostel address]'), false);

  // Untouched seed room vs Admin-edited room
  const roomsInput: Room[] = [
    {
      id: 'uuid-1',
      slug: 'private-single',
      name_en: 'Private Single Room',
      name_ur: 'سنگل روم',
      room_type: 'single',
      beds_total: 1,
      beds_available: 1,
      monthly_fee: 15000,
      security_deposit: 5000,
      admission_fee: 2000,
      description_en: 'Factory desc',
      description_ur: '',
      features: [],
      image_urls: [],
      is_published: true,
      sort_order: 1,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'uuid-custom',
      slug: 'deluxe-ac-room',
      name_en: 'Admin Custom Deluxe Room',
      name_ur: 'ایڈمن کسٹم روم',
      room_type: 'double',
      beds_total: 4,
      beds_available: 3,
      monthly_fee: 9200,
      security_deposit: 4000,
      admission_fee: 1000,
      description_en: 'Edited by Admin',
      description_ur: 'ایڈمن کی تفصیل',
      features: [{ en: 'Split AC', ur: 'اے سی' }],
      image_urls: ['https://example.com/admin-room.jpg'],
      is_published: true,
      sort_order: 5,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-02T00:00:00Z'
    }
  ];

  const enrichedRooms = enrichRooms(roomsInput);
  const single = enrichedRooms.find((r) => r.slug === 'private-single')!;
  const custom = enrichedRooms.find((r) => r.slug === 'deluxe-ac-room')!;

  assert.equal(single.monthly_fee, 11500);
  assert.equal(single.image_urls[0], '/images/room-single.jpg');
  assert.equal(custom.name_en, 'Admin Custom Deluxe Room');
  assert.equal(custom.monthly_fee, 9200);
  assert.equal(custom.image_urls[0], 'https://example.com/admin-room.jpg');

  // Facility placeholder replacement
  const facInput: Facility[] = [
    {
      id: 'f-1',
      title_en: 'CCTV Security',
      title_ur: 'سی سی ٹی وی',
      description_en: 'Camera monitoring if installed at the property.',
      description_ur: '',
      icon_url: '',
      is_published: true,
      sort_order: 9
    }
  ];
  const enrichedFacs = enrichFacilities(facInput);
  assert.equal(enrichedFacs[0].description_en.includes('if installed'), false);
  assert.equal(Boolean(enrichedFacs[0].icon_url), true);

  // FAQ sample replacement
  const faqInput: Faq[] = [
    {
      id: 'faq-1',
      question_en: 'Is security refundable?',
      question_ur: '',
      answer_en: 'The sample fee note says security is refundable.',
      answer_ur: '',
      is_published: true,
      sort_order: 2
    }
  ];
  const enrichedFaqs = enrichFaqs(faqInput);
  assert.equal(enrichedFaqs[0].answer_en.toLowerCase().includes('sample'), false);
});
