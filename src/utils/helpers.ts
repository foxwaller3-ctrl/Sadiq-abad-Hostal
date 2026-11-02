import type { Lang, Room, RoomType } from '../types/index.ts';

export const ROOM_TYPE_DEFAULT_IMAGES: Record<RoomType, string> = {
  single: '/images/room-single.jpg',
  double: '/images/room-double.jpg',
  triple: '/images/room-triple.jpg',
  quad: '/images/room-quad.jpg'
};

/**
 * Validates Pakistani phone numbers:
 * Accepts formats like 03001234567, 0300-1234567, 0300 1234567, +923001234567, +92 300 1234567
 */
export function validatePakistaniPhone(phone: string): boolean {
  if (!phone) return false;
  const cleanPhone = phone.trim();
  const regex = /^(\+92[\s-]*|0)3[0-9]{2}[- ]?[0-9]{7}$/;
  return regex.test(cleanPhone);
}

/**
 * Normalizes a valid Pakistani phone number so it strictly satisfies
 * Supabase PostgreSQL CHECK constraint: ^(\+92|0)3[0-9]{2}[- ]?[0-9]{7}$
 */
export function normalizePakistaniPhoneForDb(phone: string): string {
  const trimmed = (phone || '').trim();
  const digitsAndPlus = trimmed.replace(/[^\d+]/g, '');
  if (digitsAndPlus.startsWith('+92') && digitsAndPlus.length === 13) {
    return `${digitsAndPlus.slice(0, 6)}-${digitsAndPlus.slice(6)}`;
  }
  if (digitsAndPlus.startsWith('03') && digitsAndPlus.length === 11) {
    return `${digitsAndPlus.slice(0, 4)}-${digitsAndPlus.slice(4)}`;
  }
  return trimmed.replace(/^\+92\s+/, '+92');
}

/**
 * Formats Pakistani Rupee amounts: e.g. Rs. 8,500
 */
export function formatCurrency(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  const formatted = new Intl.NumberFormat('en-PK').format(safeAmount);
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
  let cleaned = (phone || '').replace(/[^0-9]/g, '');
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

/**
 * Normalizes image URLs:
 * Resolves Kommodo share links (https://kommodo.ai/i/...) to local high-res asset /logo.png
 * and filters out fragile placeholder hosts if any remain.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (trimmed.includes('0IV3pZTemc49bUwLxmEI') || trimmed.includes('kommodo.ai/i/')) {
    return '/logo.png';
  }
  return trimmed;
}

/**
 * Generates a clean URL slug from an English room name
 */
export function slugifyRoomName(name: string, fallbackPrefix = 'room'): string {
  const base = (name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || `${fallbackPrefix}-${Date.now()}`;
}

/**
 * Ensures a slug is unique against existing room slugs
 */
export function ensureUniqueSlug(desiredSlug: string, existingSlugs: string[]): string {
  const clean = slugifyRoomName(desiredSlug);
  const taken = new Set(existingSlugs.map((s) => s.toLowerCase()));
  if (!taken.has(clean)) return clean;
  let counter = 2;
  while (taken.has(`${clean}-${counter}`)) {
    counter += 1;
  }
  return `${clean}-${counter}`;
}

/**
 * Extracts clean Google Maps embed URL even if admin pastes full <iframe src="..."> HTML
 */
export function extractMapEmbedUrl(rawInput: string): string {
  const trimmed = (rawInput || '').trim();
  if (!trimmed) return '';
  const iframeMatch = trimmed.match(/src=["']([^"']+)["']/i);
  const extracted = iframeMatch ? iframeMatch[1].trim() : trimmed;
  if (extracted.startsWith('https://www.google.com/maps/embed')) {
    return extracted;
  }
  return '';
}

/**
 * Returns guaranteed non-empty distinct image list for a room
 */
export function getRoomImages(room: Pick<Room, 'room_type' | 'image_urls'>): string[] {
  const validUrls = (room.image_urls || [])
    .map((u) => normalizeImageUrl(u))
    .filter((u) => Boolean(u) && !u.includes('images.unsplash.com'));
  if (validUrls.length > 0) {
    return validUrls;
  }
  const primary = ROOM_TYPE_DEFAULT_IMAGES[room.room_type] || '/images/room-single.jpg';
  return [primary, '/images/clean-washroom.jpg', '/images/study-hall.jpg'];
}

export function getRoomPrimaryImage(room: Pick<Room, 'room_type' | 'image_urls'>): string {
  return getRoomImages(room)[0];
}
