import type { Lang } from '../types/index.ts';

/**
 * Validates Pakistani phone numbers:
 * Accepts formats like 03001234567, 0300-1234567, 0300 1234567, +923001234567, +92 300 1234567
 */
export function validatePakistaniPhone(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = phone.trim();
  const regex = /^(\+92\s*|0)3[0-9]{2}[- ]?[0-9]{7}$/;
  return regex.test(cleanPhone);
}

/**
 * Formats Pakistani Rupee amounts: e.g. Rs. 15,000
 */
export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('en-PK').format(amount);
  return `Rs. ${formatted}`;
}

/**
 * Calculates availability status based on beds available:
 * > 2 beds => 'available'
 * 1-2 beds => 'limited'
 * 0 beds   => 'full'
 */
export function getAvailabilityStatus(bedsAvailable: number): 'available' | 'limited' | 'full' {
  if (bedsAvailable <= 0) return 'full';
  if (bedsAvailable <= 2) return 'limited';
  return 'available';
}

/**
 * Safely picks the localized field value with English fallback
 */
export function pickLang<T extends Record<string, any>>(
  item: T | null | undefined,
  baseField: string,
  lang: Lang
): string {
  if (!item) return '';
  const langKey = `${baseField}_${lang}`;
  const enKey = `${baseField}_en`;

  if (item[langKey] && typeof item[langKey] === 'string' && item[langKey].trim() !== '') {
    return item[langKey];
  }
  if (item[enKey] && typeof item[enKey] === 'string') {
    return item[enKey];
  }
  return '';
}

/**
 * Returns human-readable day names (0 = Sunday ... 6 = Saturday)
 */
export function getDayName(dayIndex: number, lang: Lang): string {
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysUr = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];
  const idx = Math.max(0, Math.min(6, dayIndex));
  return lang === 'ur' ? daysUr[idx] : daysEn[idx];
}

/**
 * Returns WhatsApp chat link with prefilled URL-encoded message
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  // Clean phone number to digits only (e.g. 03001234567 -> 923001234567)
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '92' + cleaned.substring(1);
  }
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

/**
 * Checks whether a notice is currently active within date range
 */
export function isNoticeActive(notice: { is_active: boolean; starts_at: string; ends_at: string }): boolean {
  if (!notice.is_active) return false;
  const now = new Date().getTime();
  const start = new Date(notice.starts_at).getTime();
  const end = new Date(notice.ends_at).getTime();
  return now >= start && now <= end;
}
