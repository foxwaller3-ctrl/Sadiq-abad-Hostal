import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeCheckOutDate,
  formatStayDuration,
  getStayRemainingInfo,
  buildCompleteBedRoster,
  computeBedReportSummary,
  validateBedAllocationInput,
  generateBedReportCsv
} from './bedReport.ts';
import { resolveAmenityIconKey, resolveRuleIconKey } from './iconResolver.ts';
import type { BedAllocation, Room } from '../types/index.ts';

const sampleRooms: Room[] = [
  {
    id: 'uuid-quad',
    slug: 'economy-four',
    name_en: 'Economy 4-Bed Sharing Room',
    name_ur: 'اکانومی ۴ بیڈ شیئرنگ روم',
    room_type: 'quad',
    beds_total: 4,
    beds_available: 2,
    monthly_fee: 5500,
    security_deposit: 3000,
    admission_fee: 1000,
    description_en: '',
    description_ur: '',
    features: [],
    image_urls: [],
    is_published: true,
    sort_order: 1
  },
  {
    id: 'uuid-double',
    slug: 'double-sharing',
    name_en: 'Executive 2-Bed Sharing Room',
    name_ur: 'ایگزیکٹو ۲ بیڈ شیئرنگ روم',
    room_type: 'double',
    beds_total: 2,
    beds_available: 1,
    monthly_fee: 8500,
    security_deposit: 4000,
    admission_fee: 1500,
    description_en: '',
    description_ur: '',
    features: [],
    image_urls: [],
    is_published: true,
    sort_order: 2
  }
];

test('computeCheckOutDate handles days and months accurately including month-end clamping', () => {
  assert.equal(computeCheckOutDate('2026-10-15', 45, 'days'), '2026-11-29');
  assert.equal(computeCheckOutDate('2026-09-01', 6, 'months'), '2027-03-01');
  assert.equal(computeCheckOutDate('2026-01-31', 1, 'months'), '2026-02-28');
});

test('formatStayDuration formats both days and months in English and Urdu', () => {
  assert.equal(formatStayDuration(6, 'months', 'en'), '6 Months');
  assert.equal(formatStayDuration(1, 'months', 'en'), '1 Month');
  assert.equal(formatStayDuration(45, 'days', 'en'), '45 Days');
  assert.equal(formatStayDuration(1, 'days', 'en'), '1 Day');
  assert.equal(formatStayDuration(6, 'months', 'ur'), '6 ماہ');
  assert.equal(formatStayDuration(20, 'days', 'ur'), '20 دن');
});

test('getStayRemainingInfo computes active, expiring_soon, and expired states', () => {
  const active = getStayRemainingInfo('2026-12-20', '2026-11-02');
  assert.equal(active?.daysLeft, 48);
  assert.equal(active?.state, 'active');

  const soon = getStayRemainingInfo('2026-11-06', '2026-11-02');
  assert.equal(soon?.daysLeft, 4);
  assert.equal(soon?.state, 'expiring_soon');

  const expired = getStayRemainingInfo('2026-10-30', '2026-11-02');
  assert.equal(expired?.daysLeft, -3);
  assert.equal(expired?.state, 'expired');
});

test('buildCompleteBedRoster and computeBedReportSummary match by room_slug or room_id and fill vacant beds', () => {
  const allocations: BedAllocation[] = [
    {
      id: 'alloc-1',
      room_id: 'legacy-mock-id',
      room_slug: 'economy-four',
      bed_number: 1,
      unit_label: 'Room 101',
      status: 'occupied',
      resident_name: 'Muhammad Huzaifa',
      resident_phone: '0301-7458921',
      resident_category: 'student',
      institution_or_workplace: 'Punjab College Sadiqabad',
      check_in_date: '2026-09-01',
      duration_value: 10,
      duration_unit: 'months',
      check_out_date: '2027-07-01',
      agreed_rent: 5500,
      security_deposit: 3000,
      payment_status: 'paid'
    },
    {
      id: 'alloc-2',
      room_id: 'uuid-double',
      bed_number: 2,
      unit_label: 'Room 102',
      status: 'reserved',
      resident_name: 'Bilal Ahmad',
      resident_phone: '0304-7861234',
      resident_category: 'job_holder',
      institution_or_workplace: 'Meezan Bank',
      check_in_date: '2026-11-05',
      duration_value: 30,
      duration_unit: 'days',
      check_out_date: '2026-12-05',
      agreed_rent: 8500,
      security_deposit: 4000,
      payment_status: 'pending'
    }
  ];

  const roster = buildCompleteBedRoster(sampleRooms, allocations);
  assert.equal(roster.length, 6); // 4 + 2 beds
  assert.equal(roster[0].status, 'occupied');
  assert.equal(roster[0].allocation?.resident_name, 'Muhammad Huzaifa');
  assert.equal(roster[1].status, 'vacant');
  assert.equal(roster[5].status, 'reserved');

  const summary = computeBedReportSummary(roster);
  assert.equal(summary.totalBeds, 6);
  assert.equal(summary.occupiedBeds, 1);
  assert.equal(summary.reservedBeds, 1);
  assert.equal(summary.vacantBeds, 4);
  assert.equal(summary.occupancyRate, 33);
  assert.equal(summary.expectedMonthlyRevenue, 14000);
  assert.equal(summary.paidCount, 1);
  assert.equal(summary.pendingCount, 1);

  const csv = generateBedReportCsv(roster);
  assert.ok(csv.includes('Muhammad Huzaifa'));
  assert.ok(csv.includes('10 Months'));
  assert.ok(csv.includes('30 Days'));
});

test('validateBedAllocationInput enforces required resident name and valid Pakistani phone', () => {
  const badErrors = validateBedAllocationInput({
    room_id: 'uuid-quad',
    bed_number: 1,
    status: 'occupied',
    resident_name: ' ',
    resident_phone: '12345',
    check_in_date: '2026-11-01',
    duration_value: 0
  });
  assert.ok(badErrors.resident_name);
  assert.ok(badErrors.resident_phone);
  assert.ok(badErrors.duration_value);

  const goodErrors = validateBedAllocationInput({
    room_id: 'uuid-quad',
    bed_number: 1,
    status: 'occupied',
    resident_name: 'Usama Rasheed',
    resident_phone: '0304-7861234',
    check_in_date: '2026-11-01',
    duration_value: 6
  });
  assert.equal(Object.keys(goodErrors).length, 0);
});

test('semantic icon resolver maps amenities and rules accurately', () => {
  assert.equal(resolveAmenityIconKey('High-Speed Fiber WiFi & UPS Backup'), 'wifi');
  assert.equal(resolveAmenityIconKey('Attached Bath with Hot Water Geyser'), 'flame');
  assert.equal(resolveAmenityIconKey('Attached Modern Tiled Washroom'), 'bath');
  assert.equal(resolveAmenityIconKey('Individual Lockable Cupboards'), 'lock');
  assert.equal(resolveAmenityIconKey('Executive Study Desk, Lamp & Chair'), 'lamp-desk');
  assert.equal(resolveRuleIconKey('Smoking, vapes, and intoxicants are prohibited'), 'ban');
  assert.equal(resolveRuleIconKey('Main gate closes strictly at 10:00 PM'), 'clock');
});
