import type {
  BedAllocation,
  BedRosterItem,
  BedStatus,
  Lang,
  Room,
  StayDurationUnit
} from '../types/index.ts';
import { formatCurrency, validatePakistaniPhone } from './helpers.ts';

function parseIsoDateParts(isoDate: string): { year: number; month: number; day: number } | null {
  const trimmed = (isoDate || '').trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return { year, month, day };
}

function formatIsoDateParts(year: number, month: number, day: number): string {
  const y = String(year).padStart(4, '0');
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayIsoDate(): string {
  const now = new Date();
  return formatIsoDateParts(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/**
 * Computes exact checkout / expiry ISO date (`YYYY-MM-DD`) given check-in date and duration in days or months.
 * Uses pure UTC calendar arithmetic so local timezone offsets never shift dates.
 */
export function computeCheckOutDate(
  checkInDate: string,
  durationValue: number,
  durationUnit: StayDurationUnit
): string {
  const parts = parseIsoDateParts(checkInDate);
  if (!parts) return '';
  const safeValue = Math.max(1, Math.round(Number(durationValue) || 1));

  if (durationUnit === 'days') {
    const utcMs = Date.UTC(parts.year, parts.month - 1, parts.day + safeValue);
    const out = new Date(utcMs);
    return formatIsoDateParts(out.getUTCFullYear(), out.getUTCMonth() + 1, out.getUTCDate());
  }

  // Months addition with end-of-month clamping (e.g., Jan 31 + 1 month -> Feb 28/29)
  const totalMonths = parts.year * 12 + (parts.month - 1) + safeValue;
  const targetYear = Math.floor(totalMonths / 12);
  const targetMonthIndex = totalMonths % 12; // 0..11
  const maxDayInTargetMonth = new Date(Date.UTC(targetYear, targetMonthIndex + 1, 0)).getUTCDate();
  const clampedDay = Math.min(parts.day, maxDayInTargetMonth);
  return formatIsoDateParts(targetYear, targetMonthIndex + 1, clampedDay);
}

/**
 * Formats stay duration clearly in English or Urdu (e.g. "6 Months", "45 Days", "6 ماہ", "45 دن").
 */
export function formatStayDuration(
  durationValue: number,
  durationUnit: StayDurationUnit,
  lang: Lang = 'en'
): string {
  const safeVal = Math.max(1, Math.round(Number(durationValue) || 1));
  if (lang === 'ur') {
    return durationUnit === 'days' ? `${safeVal} دن` : `${safeVal} ماہ`;
  }
  if (durationUnit === 'days') {
    return safeVal === 1 ? '1 Day' : `${safeVal} Days`;
  }
  return safeVal === 1 ? '1 Month' : `${safeVal} Months`;
}

/**
 * Formats an ISO date (`YYYY-MM-DD`) to human-readable `01 Sep 2026`.
 */
export function formatDisplayDate(isoDate: string | null | undefined): string {
  if (!isoDate) return '—';
  const parts = parseIsoDateParts(isoDate);
  if (!parts) return isoDate;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayStr = String(parts.day).padStart(2, '0');
  return `${dayStr} ${months[parts.month - 1]} ${parts.year}`;
}

export interface StayRemainingInfo {
  daysLeft: number;
  state: 'active' | 'expiring_soon' | 'expired';
  labelEn: string;
  labelUr: string;
}

/**
 * Calculates remaining stay days between referenceIsoDate (default today) and checkOutDate.
 */
export function getStayRemainingInfo(
  checkOutDate: string | null | undefined,
  referenceIsoDate: string = getTodayIsoDate()
): StayRemainingInfo | null {
  if (!checkOutDate) return null;
  const outParts = parseIsoDateParts(checkOutDate);
  const refParts = parseIsoDateParts(referenceIsoDate);
  if (!outParts || !refParts) return null;

  const outUtc = Date.UTC(outParts.year, outParts.month - 1, outParts.day);
  const refUtc = Date.UTC(refParts.year, refParts.month - 1, refParts.day);
  const daysLeft = Math.round((outUtc - refUtc) / 86400000);

  if (daysLeft < 0) {
    const overdue = Math.abs(daysLeft);
    return {
      daysLeft,
      state: 'expired',
      labelEn: `${overdue}d overdue`,
      labelUr: `${overdue} دن زائد المیعاد`
    };
  }
  if (daysLeft === 0) {
    return {
      daysLeft: 0,
      state: 'expiring_soon',
      labelEn: 'Ends today',
      labelUr: 'آج مدت مکمل'
    };
  }
  if (daysLeft <= 7) {
    return {
      daysLeft,
      state: 'expiring_soon',
      labelEn: `${daysLeft}d remaining`,
      labelUr: `${daysLeft} دن باقی`
    };
  }
  return {
    daysLeft,
    state: 'active',
    labelEn: `${daysLeft}d remaining`,
    labelUr: `${daysLeft} دن باقی`
  };
}

/**
 * Generates default floor/door unit label for a room when none is customized.
 */
export function defaultUnitLabelForRoom(room: Pick<Room, 'sort_order' | 'room_type'>, index = 0): string {
  const order = room.sort_order || index + 1;
  const floor = order <= 2 ? 1 : 2;
  const door = ((order - 1) % 2) + 1;
  return `Room ${floor}0${door}`;
}

/**
 * Builds the complete bed-by-bed roster across all rooms (`1..room.beds_total` for each room).
 * Matches allocations by either `room_id` OR `room_slug` so both Supabase UUIDs and local seed IDs align seamlessly.
 */
export function buildCompleteBedRoster(
  rooms: Room[],
  allocations: BedAllocation[]
): BedRosterItem[] {
  const sortedRooms = [...rooms].sort((a, b) => a.sort_order - b.sort_order);
  const roster: BedRosterItem[] = [];

  sortedRooms.forEach((room, roomIdx) => {
    const totalBeds = Math.max(1, Number(room.beds_total) || 1);
    const fallbackUnit = defaultUnitLabelForRoom(room, roomIdx);

    for (let bedNum = 1; bedNum <= totalBeds; bedNum += 1) {
      const match = allocations.find(
        (a) =>
          a.bed_number === bedNum &&
          (a.room_id === room.id || (Boolean(a.room_slug) && a.room_slug === room.slug))
      );

      const status: BedStatus = match ? match.status : 'vacant';
      const activeAlloc = match && status !== 'vacant' ? match : null;

      roster.push({
        key: `${room.id}-bed-${bedNum}`,
        room,
        bed_number: bedNum,
        unit_label: match?.unit_label?.trim() || fallbackUnit,
        allocation: activeAlloc,
        status
      });
    }
  });

  return roster;
}

export interface BedReportSummary {
  totalBeds: number;
  occupiedBeds: number;
  reservedBeds: number;
  vacantBeds: number;
  maintenanceBeds: number;
  occupancyRate: number;
  expectedMonthlyRevenue: number;
  paidCount: number;
  pendingCount: number;
}

export function computeBedReportSummary(roster: BedRosterItem[]): BedReportSummary {
  const totalBeds = roster.length;
  let occupiedBeds = 0;
  let reservedBeds = 0;
  let vacantBeds = 0;
  let maintenanceBeds = 0;
  let expectedMonthlyRevenue = 0;
  let paidCount = 0;
  let pendingCount = 0;

  for (const item of roster) {
    if (item.status === 'occupied') {
      occupiedBeds += 1;
      if (item.allocation) {
        expectedMonthlyRevenue += Number(item.allocation.agreed_rent) || 0;
        if (item.allocation.payment_status === 'paid') paidCount += 1;
        else pendingCount += 1;
      }
    } else if (item.status === 'reserved') {
      reservedBeds += 1;
      if (item.allocation) {
        expectedMonthlyRevenue += Number(item.allocation.agreed_rent) || 0;
        if (item.allocation.payment_status === 'paid') paidCount += 1;
        else pendingCount += 1;
      }
    } else if (item.status === 'maintenance') {
      maintenanceBeds += 1;
    } else {
      vacantBeds += 1;
    }
  }

  const activeAllocated = occupiedBeds + reservedBeds;
  const occupancyRate = totalBeds > 0 ? Math.round((activeAllocated / totalBeds) * 100) : 0;

  return {
    totalBeds,
    occupiedBeds,
    reservedBeds,
    vacantBeds,
    maintenanceBeds,
    occupancyRate,
    expectedMonthlyRevenue,
    paidCount,
    pendingCount
  };
}

/**
 * Validates bed allocation form input before saving.
 * Never bypasses required resident name or Pakistani phone validation when status is occupied or reserved.
 */
export function validateBedAllocationInput(input: Partial<BedAllocation>): Record<string, string> {
  const errors: Record<string, string> = {};
  const status = input.status || 'occupied';

  if (!input.room_id) {
    errors.room_id = 'Please select a room.';
  }
  if (!input.bed_number || input.bed_number < 1) {
    errors.bed_number = 'Bed number must be 1 or higher.';
  }

  if (status === 'occupied' || status === 'reserved') {
    const name = (input.resident_name || '').trim();
    if (name.length < 2) {
      errors.resident_name = 'Resident full name is required (minimum 2 characters).';
    }

    const phone = (input.resident_phone || '').trim();
    if (!phone) {
      errors.resident_phone = 'Resident mobile / WhatsApp number is required.';
    } else if (!validatePakistaniPhone(phone)) {
      errors.resident_phone =
        'Enter a valid Pakistani mobile number (e.g. 0304-7861234 or +92 304 7861234).';
    }

    if (!input.check_in_date || !parseIsoDateParts(input.check_in_date)) {
      errors.check_in_date = 'Please choose a valid check-in / allotment date.';
    }

    const dur = Number(input.duration_value);
    if (!Number.isFinite(dur) || dur < 1 || dur > 3650) {
      errors.duration_value = 'Stay duration must be at least 1 day or month.';
    }
  }

  if (input.agreed_rent !== undefined && Number(input.agreed_rent) < 0) {
    errors.agreed_rent = 'Rent cannot be negative.';
  }

  return errors;
}

function escapeCsvCell(val: string | number | null | undefined): string {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates UTF-8 BOM CSV string of the bed roster for Excel / Google Sheets export.
 */
export function generateBedReportCsv(roster: BedRosterItem[]): string {
  const headers = [
    'Unit / Door',
    'Room Category',
    'Bed #',
    'Status',
    'Resident Name (Kis Ny)',
    'Mobile / WhatsApp',
    'CNIC / Roll ID',
    'Category',
    'College / Workplace',
    'Check-In Date (Kab)',
    'Stay Duration',
    'Check-Out Date',
    'Agreed Rent (PKR)',
    'Security Deposit (PKR)',
    'Fee Status',
    'Remarks'
  ];

  const rows = roster.map((item) => {
    const a = item.allocation;
    return [
      item.unit_label,
      item.room.name_en,
      `Bed #${item.bed_number}`,
      item.status.toUpperCase(),
      a ? a.resident_name : 'Vacant',
      a ? a.resident_phone : '',
      a?.cnic_or_id || '',
      a ? (a.resident_category === 'job_holder' ? 'Job Holder' : 'Student') : '',
      a?.institution_or_workplace || '',
      a ? a.check_in_date : '',
      a ? formatStayDuration(a.duration_value, a.duration_unit, 'en') : '',
      a ? a.check_out_date : '',
      a ? a.agreed_rent : item.room.monthly_fee,
      a ? a.security_deposit : item.room.security_deposit,
      a ? a.payment_status.toUpperCase() : '',
      a?.notes || ''
    ]
      .map(escapeCsvCell)
      .join(',');
  });

  return `\uFEFF${[headers.map(escapeCsvCell).join(','), ...rows].join('\n')}`;
}

/**
 * Builds clean shareable summary text for WhatsApp / Email / Clipboard alongside the PDF report.
 */
export function buildShareableReportText(
  summary: BedReportSummary,
  roster: BedRosterItem[],
  hostelName = 'Sadiqabad Student Hostel'
): string {
  const today = formatDisplayDate(getTodayIsoDate());
  const occupiedLines = roster
    .filter((r) => r.allocation && (r.status === 'occupied' || r.status === 'reserved'))
    .map((r) => {
      const a = r.allocation!;
      const dur = formatStayDuration(a.duration_value, a.duration_unit, 'en');
      return `• ${r.unit_label} (Bed #${r.bed_number} - ${r.room.name_en}): ${a.resident_name} | In: ${formatDisplayDate(a.check_in_date)} | Stay: ${dur} | ${formatCurrency(a.agreed_rent)} (${a.payment_status.toUpperCase()})`;
    });

  return [
    `${hostelName} — All Beds & Resident Report (${today})`,
    `Total Beds: ${summary.totalBeds} | Occupied: ${summary.occupiedBeds} | Reserved: ${summary.reservedBeds} | Vacant: ${summary.vacantBeds} (${summary.occupancyRate}% Occupancy)`,
    `Active Rent Roll: ${formatCurrency(summary.expectedMonthlyRevenue)} | Paid: ${summary.paidCount} | Pending/Partial: ${summary.pendingCount}`,
    '',
    occupiedLines.length > 0 ? 'Current Residents:' : 'No beds currently occupied.',
    ...occupiedLines
  ].join('\n');
}
