import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePakistaniPhone,
  formatCurrency,
  getAvailabilityStatus,
  pickLang,
  getDayName,
  isNoticeActive
} from './helpers.ts';

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
  assert.equal(validatePakistaniPhone('04231234567'), false); // landline
  assert.equal(validatePakistaniPhone('02001234567'), false);
  assert.equal(validatePakistaniPhone('not-a-number'), false);
});

test('formatCurrency formats PKR amounts with thousand separator', () => {
  assert.equal(formatCurrency(15000), 'Rs. 15,000');
  assert.equal(formatCurrency(0), 'Rs. 0');
  assert.equal(formatCurrency(7500), 'Rs. 7,500');
});

test('getAvailabilityStatus returns correct badge category', () => {
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
  // Fallback to English when Urdu is empty
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

  const futureNotice = {
    is_active: true,
    starts_at: '2030-01-01T00:00:00Z',
    ends_at: '2030-02-01T00:00:00Z'
  };
  assert.equal(isNoticeActive(futureNotice), false);

  const currentNotice = {
    is_active: true,
    starts_at: new Date(Date.now() - 3600000).toISOString(),
    ends_at: new Date(Date.now() + 3600000).toISOString()
  };
  assert.equal(isNoticeActive(currentNotice), true);

  const inactiveNotice = {
    ...currentNotice,
    is_active: false
  };
  assert.equal(isNoticeActive(inactiveNotice), false);
});
