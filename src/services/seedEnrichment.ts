import {
  initialHostelInfo,
  initialSiteSettings,
  initialRooms,
  initialFacilities,
  initialMessPlans,
  initialMessMenu,
  initialFaqs,
  initialGallery,
  initialReviews
} from '../data/mock/mockData.ts';
import type {
  HostelInfo,
  SiteSettings,
  Room,
  Facility,
  MessPlan,
  MessMenuDay,
  Faq,
  GalleryItem,
  Review
} from '../types/index.ts';
import { getRoomImages } from '../utils/helpers.ts';

function isPlaceholderText(val: string | null | undefined, markers: string[]): boolean {
  if (!val || !val.trim()) return true;
  const lower = val.trim().toLowerCase();
  return markers.some((m) => lower.includes(m.toLowerCase()));
}

/**
 * Enriches factory placeholder fields from 06_seed.sql in hostel_info while preserving all real admin edits.
 */
export function enrichHostelInfo(row: HostelInfo): HostelInfo {
  const isDefaultPhone = isPlaceholderText(row.phone, ['0300-0000000']);
  const isDefaultWhatsapp = isPlaceholderText(row.whatsapp, ['0300-0000000']);
  const isDefaultEmail = isPlaceholderText(row.email, ['info@example.com']);
  const isDefaultAddrEn = isPlaceholderText(row.address_en, ['[complete hostel address]']);
  const isDefaultAddrUr = isPlaceholderText(row.address_ur, [
    '[ہاسٹل کا مکمل پتہ]',
    'مکمل پتہ درج کریں'
  ]);
  const isDefaultAboutEn = isPlaceholderText(row.about_en, [
    'a comfortable hostel option for students and professionals in sadiqabad.',
    'a disciplined, comfortable hostel for students and working guests in sadiqabad.'
  ]);
  const isDefaultAboutUr = isPlaceholderText(row.about_ur, [
    'صادق آباد میں طلبہ اور ملازمت پیشہ افراد کے لیے ایک آرام دہ ہاسٹل۔'
  ]);
  const isDefaultTaglineEn =
    !row.tagline_en?.trim() ||
    row.tagline_en.trim() === 'Safe, Clean & Comfortable Hostel in Sadiqabad';
  const isDefaultTaglineUr =
    !row.tagline_ur?.trim() ||
    row.tagline_ur.trim() === 'صادق آباد میں محفوظ، صاف ستھرا اور آرام دہ ہاسٹل';
  const isDefaultHoursEn =
    !row.office_hours_en?.trim() || row.office_hours_en.trim() === '9:00 AM – 9:00 PM';
  const isDefaultHoursUr =
    !row.office_hours_ur?.trim() || row.office_hours_ur.trim() === 'صبح 9:00 تا رات 9:00';

  return {
    ...row,
    tagline_en: isDefaultTaglineEn ? initialHostelInfo.tagline_en : row.tagline_en,
    tagline_ur: isDefaultTaglineUr ? initialHostelInfo.tagline_ur : row.tagline_ur,
    about_en: isDefaultAboutEn ? initialHostelInfo.about_en : row.about_en,
    about_ur: isDefaultAboutUr ? initialHostelInfo.about_ur : row.about_ur,
    phone: isDefaultPhone ? initialHostelInfo.phone : row.phone,
    whatsapp: isDefaultWhatsapp ? initialHostelInfo.whatsapp : row.whatsapp,
    email: isDefaultEmail ? initialHostelInfo.email : row.email,
    address_en: isDefaultAddrEn ? initialHostelInfo.address_en : row.address_en,
    address_ur: isDefaultAddrUr ? initialHostelInfo.address_ur : row.address_ur,
    map_embed_url: row.map_embed_url?.trim() || initialHostelInfo.map_embed_url,
    latitude: row.latitude ?? initialHostelInfo.latitude,
    longitude: row.longitude ?? initialHostelInfo.longitude,
    office_hours_en: isDefaultHoursEn ? initialHostelInfo.office_hours_en : row.office_hours_en,
    office_hours_ur: isDefaultHoursUr ? initialHostelInfo.office_hours_ur : row.office_hours_ur,
    logo_url: row.logo_url?.trim() || initialHostelInfo.logo_url
  };
}

/**
 * Enriches site_settings if untouched 06_seed.sql factory defaults exist.
 */
export function enrichSiteSettings(row: SiteSettings): SiteSettings {
  const factoryTitles = new Set([
    'Student Hostel in Sadiqabad – Rooms, Mess & WiFi',
    'Sadiqabad Student Hostel – Rooms, Mess, WiFi & Security'
  ]);
  const factoryDescs = new Set([
    'Check hostel rooms, facilities, mess details and contact information in Sadiqabad.',
    'Affordable, secure hostel in Sadiqabad with furnished rooms, mess, WiFi and CCTV.'
  ]);
  const isFactoryTitle = !row.seo_title_en?.trim() || factoryTitles.has(row.seo_title_en.trim());
  const isFactoryDesc =
    !row.seo_description_en?.trim() || factoryDescs.has(row.seo_description_en.trim());

  return {
    ...row,
    seo_title_en: isFactoryTitle ? initialSiteSettings.seo_title_en : row.seo_title_en,
    seo_title_ur:
      !row.seo_title_ur?.trim() ||
      row.seo_title_ur.trim() === 'صادق آباد میں اسٹوڈنٹ ہاسٹل – کمرے، میس اور وائی فائی'
        ? initialSiteSettings.seo_title_ur
        : row.seo_title_ur,
    seo_description_en: isFactoryDesc
      ? initialSiteSettings.seo_description_en
      : row.seo_description_en,
    seo_description_ur:
      !row.seo_description_ur?.trim() ||
      row.seo_description_ur.trim() ===
        'صادق آباد میں ہاسٹل کے کمرے، سہولیات، میس اور رابطے کی معلومات دیکھیں۔'
        ? initialSiteSettings.seo_description_ur
        : row.seo_description_ur
  };
}

/**
 * Enriches untouched 06_seed.sql rooms (where image_urls is empty and created_at === updated_at)
 * with realistic student-friendly pricing, available beds, and distinct room photos, while preserving
 * 100% of any admin-created, admin-edited, or admin-deleted rooms in Supabase.
 */
export function enrichRooms(rows: Room[]): Room[] {
  const seedBySlug = new Map(initialRooms.map((r) => [r.slug, r]));

  const enriched = rows.map((row) => {
    const curated = seedBySlug.get(row.slug);
    const hasNoCustomImages = !row.image_urls || row.image_urls.length === 0;
    const isUntouchedSeedRow =
      Boolean(curated) &&
      hasNoCustomImages &&
      Boolean(row.created_at) &&
      row.created_at === row.updated_at;

    if (isUntouchedSeedRow && curated) {
      return {
        ...curated,
        id: row.id,
        slug: row.slug,
        is_published: row.is_published,
        created_at: row.created_at,
        updated_at: row.updated_at
      };
    }

    return {
      ...row,
      features: Array.isArray(row.features) ? row.features : [],
      image_urls: getRoomImages(row)
    };
  });

  return enriched.sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Enriches untouched 06_seed.sql facilities that lack icon_url or have placeholder disclaimers.
 */
export function enrichFacilities(rows: Facility[]): Facility[] {
  const bySortOrder = new Map(initialFacilities.map((f) => [f.sort_order, f]));
  const placeholderMarkers = [
    'if installed',
    'to be confirmed by management',
    'where available',
    'when available',
    'depend on the selected room',
    'may be available',
    'must be confirmed before arrival',
    'vary by room type',
    'internet access for everyday study and work.',
    'filtered water access for residents.',
    'backup arrangements during power outages.'
  ];

  return rows
    .map((row) => {
      const curated = bySortOrder.get(row.sort_order);
      const needsIcon = !row.icon_url || !row.icon_url.trim();
      const hasPlaceholderDesc = isPlaceholderText(row.description_en, placeholderMarkers);

      if (curated && (needsIcon || hasPlaceholderDesc)) {
        return {
          ...row,
          title_en: hasPlaceholderDesc ? curated.title_en : row.title_en,
          title_ur: hasPlaceholderDesc ? curated.title_ur : row.title_ur,
          description_en: hasPlaceholderDesc ? curated.description_en : row.description_en,
          description_ur: hasPlaceholderDesc ? curated.description_ur : row.description_ur,
          icon_url: needsIcon ? curated.icon_url : row.icon_url
        };
      }
      return {
        ...row,
        icon_url: row.icon_url?.trim() || 'sparkles'
      };
    })
    .sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Enriches untouched factory mess plans while preserving any admin edits.
 */
export function enrichMessPlans(rows: MessPlan[]): MessPlan[] {
  const bySort = new Map(initialMessPlans.map((p) => [p.sort_order, p]));
  const factoryDescriptions = new Set([
    'Breakfast, lunch and dinner.',
    'Any two meals daily.',
    'Breakfast and dinner.',
    'Mess is optional.',
    'Room rent only; mess is optional.'
  ]);

  return rows
    .map((row) => {
      const curated = bySort.get(row.sort_order);
      if (curated && factoryDescriptions.has((row.description_en || '').trim())) {
        return {
          ...curated,
          id: row.id,
          is_active: row.is_active
        };
      }
      return row;
    })
    .sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Enriches untouched 06_seed.sql mess_menu rows (e.g. "Special Breakfast") while preserving admin edits.
 */
export function enrichMessMenu(rows: MessMenuDay[]): MessMenuDay[] {
  if (rows.length === 0) return [...initialMessMenu];
  const byDay = new Map(initialMessMenu.map((d) => [d.day_of_week, d]));
  const factoryBreakfasts = new Set([
    'Special Breakfast',
    'Paratha + Chai',
    'Anda + Paratha',
    'Halwa Puri'
  ]);
  const factoryLunches = new Set([
    'Special Lunch',
    'Daal Chawal',
    'Chicken Karahi + Roti',
    'Sabzi + Roti',
    'Daal Chana + Roti',
    'Chicken Pulao',
    'Kadhi Chawal'
  ]);

  return rows
    .map((row) => {
      const curated = byDay.get(row.day_of_week);
      const isFactoryRow =
        curated &&
        factoryBreakfasts.has((row.breakfast_en || '').trim()) &&
        factoryLunches.has((row.lunch_en || '').trim());
      if (isFactoryRow && curated) {
        return {
          ...curated,
          id: row.id
        };
      }
      return row;
    })
    .sort((a, b) => a.day_of_week - b.day_of_week);
}

/**
 * Enriches FAQs that still contain "sample" or "confirm with management" placeholder text from 06_seed.sql.
 */
export function enrichFaqs(rows: Faq[]): Faq[] {
  const bySort = new Map(initialFaqs.map((f) => [f.sort_order, f]));
  const placeholderMarkers = [
    'sample',
    'confirm current options',
    'confirm current availability',
    'confirm the actual policy',
    'ask management about actual equipment'
  ];

  return rows
    .map((row) => {
      const curated = bySort.get(row.sort_order);
      if (curated && isPlaceholderText(row.answer_en, placeholderMarkers)) {
        return {
          ...curated,
          id: row.id,
          is_published: row.is_published
        };
      }
      return row;
    })
    .sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Provides curated hostel gallery items when Supabase gallery_items table has not yet been seeded,
 * while immediately switching to live Supabase items once the admin uploads or syncs photos.
 */
export function enrichGallery(rows: GalleryItem[]): GalleryItem[] {
  if (rows.length > 0) {
    return [...rows].sort((a, b) => a.sort_order - b.sort_order);
  }
  return [...initialGallery].sort((a, b) => a.sort_order - b.sort_order);
}

/**
 * Provides curated student & parent reviews when Supabase reviews table is empty,
 * switching to live Supabase reviews once populated by admin.
 */
export function enrichReviews(rows: Review[]): Review[] {
  if (rows.length > 0) {
    return [...rows];
  }
  return [...initialReviews];
}
