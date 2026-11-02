import {
  initialHostelInfo,
  initialSiteSettings,
  initialRooms,
  initialFacilities,
  initialMessPlans,
  initialMessMenu,
  initialGallery,
  initialRules,
  initialFaqs,
  initialReviews,
  initialBedAllocations
} from '../data/mock/mockData.ts';
import { requireSupabase, supabase } from './supabaseClient.ts';
import { resolveHttpsMediaUrl } from './mediaService.ts';
import { mockStore } from './mockStore.ts';
import { DEFAULT_HOSTEL_LOGO } from './hostelInfoService.ts';
import type { TablesInsert } from '../types/database.ts';

/**
 * Syncs authentic Sadiqabad hostel details, reasonable student room pricing,
 * and distinct high-resolution room & gallery photos directly into Supabase
 * Postgres and the `hostel-media` Storage bucket when invoked by an authenticated Admin.
 */
export async function syncRealisticDataToSupabase(
  onProgress?: (step: string) => void
): Promise<{ summary: string }> {
  if (!supabase) {
    mockStore.hostelInfo = { ...initialHostelInfo };
    mockStore.siteSettings = { ...initialSiteSettings };
    mockStore.rooms = [...initialRooms];
    mockStore.facilities = [...initialFacilities];
    mockStore.messPlans = [...initialMessPlans];
    mockStore.messMenu = [...initialMessMenu];
    mockStore.gallery = [...initialGallery];
    mockStore.rules = [...initialRules];
    mockStore.faqs = [...initialFaqs];
    mockStore.reviews = [...initialReviews];
    mockStore.notify();
    return { summary: 'Local store refreshed with authentic Sadiqabad hostel data and photos.' };
  }

  const client = requireSupabase();
  const { data: sessionData } = await client.auth.getSession();
  if (!sessionData.session) {
    throw new Error('Please sign in to the Admin Portal first so Supabase RLS allows writing data.');
  }

  // 1. Upload local public images to `hostel-media` Storage bucket (cached map so each image uploads once)
  onProgress?.('Uploading high-resolution room & campus photos to Supabase Storage...');
  const assetPaths = [
    '/images/hero-hostel.jpg',
    '/images/room-single.jpg',
    '/images/room-double.jpg',
    '/images/room-triple.jpg',
    '/images/room-quad.jpg',
    '/images/mess-dining.jpg',
    '/images/study-hall.jpg',
    '/images/clean-washroom.jpg'
  ];

  const uploadedUrlMap = new Map<string, string>();
  for (const path of assetPaths) {
    const resolved = await resolveHttpsMediaUrl(path, 'seed-assets');
    uploadedUrlMap.set(path, resolved);
  }

  const mapAssetUrl = (path: string): string => uploadedUrlMap.get(path) || path;

  // 2. Sync hostel_info (id = 1)
  onProgress?.('Updating Hostel Profile, Address, Phone & Official Logo...');
  const { data: existingInfo } = await client.from('hostel_info').select('logo_url').eq('id', 1).maybeSingle();
  const resolvedLogo =
    existingInfo?.logo_url?.startsWith('https://')
      ? existingInfo.logo_url
      : (await resolveHttpsMediaUrl('/logo.png', 'branding')).startsWith('https://')
      ? await resolveHttpsMediaUrl('/logo.png', 'branding')
      : DEFAULT_HOSTEL_LOGO;

  const { error: infoErr } = await client.from('hostel_info').upsert(
    {
      id: 1,
      name_en: initialHostelInfo.name_en,
      name_ur: initialHostelInfo.name_ur,
      tagline_en: initialHostelInfo.tagline_en,
      tagline_ur: initialHostelInfo.tagline_ur,
      about_en: initialHostelInfo.about_en,
      about_ur: initialHostelInfo.about_ur,
      phone: initialHostelInfo.phone,
      whatsapp: initialHostelInfo.whatsapp,
      email: initialHostelInfo.email,
      address_en: initialHostelInfo.address_en,
      address_ur: initialHostelInfo.address_ur,
      map_embed_url: initialHostelInfo.map_embed_url,
      latitude: initialHostelInfo.latitude ?? null,
      longitude: initialHostelInfo.longitude ?? null,
      office_hours_en: initialHostelInfo.office_hours_en,
      office_hours_ur: initialHostelInfo.office_hours_ur,
      social_links: initialHostelInfo.social_links,
      logo_url: resolvedLogo,
      hostel_type: initialHostelInfo.hostel_type
    },
    { onConflict: 'id' }
  );
  if (infoErr) throw new Error(`Hostel Info sync failed: ${infoErr.message}`);

  try {
    localStorage.removeItem('sadiqabad_hostel_info_override');
  } catch {
    // ignore storage errors
  }

  // 3. Sync site_settings (id = 1)
  onProgress?.('Updating SEO titles, meta descriptions & WhatsApp templates...');
  const { error: settingsErr } = await client.from('site_settings').upsert(
    {
      id: 1,
      seo_title_en: initialSiteSettings.seo_title_en,
      seo_title_ur: initialSiteSettings.seo_title_ur,
      seo_description_en: initialSiteSettings.seo_description_en,
      seo_description_ur: initialSiteSettings.seo_description_ur,
      default_language: initialSiteSettings.default_language,
      whatsapp_message_template_en: initialSiteSettings.whatsapp_message_template_en,
      whatsapp_message_template_ur: initialSiteSettings.whatsapp_message_template_ur
    },
    { onConflict: 'id' }
  );
  if (settingsErr) throw new Error(`Site Settings sync failed: ${settingsErr.message}`);

  // 4. Sync Rooms (upsert by slug so existing rooms update with distinct photos & reasonable pricing)
  onProgress?.('Syncing 4 Room Categories with distinct photos & student-friendly pricing...');
  for (const room of initialRooms) {
    const mappedImages = room.image_urls.map(mapAssetUrl);
    const payload: TablesInsert<'rooms'> = {
      slug: room.slug,
      name_en: room.name_en,
      name_ur: room.name_ur,
      room_type: room.room_type,
      beds_total: room.beds_total,
      beds_available: room.beds_available,
      monthly_fee: room.monthly_fee,
      security_deposit: room.security_deposit,
      admission_fee: room.admission_fee,
      description_en: room.description_en,
      description_ur: room.description_ur,
      features: room.features as unknown as TablesInsert<'rooms'>['features'],
      image_urls: mappedImages,
      is_published: true,
      sort_order: room.sort_order
    };
    const { error: roomErr } = await client.from('rooms').upsert(payload, { onConflict: 'slug' });
    if (roomErr) throw new Error(`Room (${room.slug}) sync failed: ${roomErr.message}`);
  }

  // 5. Sync Facilities (update existing by sort_order or insert missing)
  onProgress?.('Updating 13 Hostel Facilities & Icons...');
  const { data: existingFacs } = await client.from('facilities').select('id, sort_order');
  const facBySort = new Map((existingFacs ?? []).map((f) => [f.sort_order, f.id]));
  for (const fac of initialFacilities) {
    const existingId = facBySort.get(fac.sort_order);
    if (existingId) {
      await client
        .from('facilities')
        .update({
          title_en: fac.title_en,
          title_ur: fac.title_ur,
          description_en: fac.description_en,
          description_ur: fac.description_ur,
          icon_url: fac.icon_url,
          is_published: true
        })
        .eq('id', existingId);
    } else {
      await client.from('facilities').insert({
        title_en: fac.title_en,
        title_ur: fac.title_ur,
        description_en: fac.description_en,
        description_ur: fac.description_ur,
        icon_url: fac.icon_url,
        is_published: true,
        sort_order: fac.sort_order
      });
    }
  }

  // 6. Sync Mess Plans & 7-Day Weekly Menu
  onProgress?.('Syncing Mess Plans & 7-Day Dining Menu...');
  const { data: existingPlans } = await client.from('mess_plans').select('id, sort_order');
  const planBySort = new Map((existingPlans ?? []).map((p) => [p.sort_order, p.id]));
  for (const plan of initialMessPlans) {
    const existingId = planBySort.get(plan.sort_order);
    if (existingId) {
      await client
        .from('mess_plans')
        .update({
          name_en: plan.name_en,
          name_ur: plan.name_ur,
          price_monthly: plan.price_monthly,
          description_en: plan.description_en,
          description_ur: plan.description_ur,
          is_active: true
        })
        .eq('id', existingId);
    } else {
      await client.from('mess_plans').insert({
        name_en: plan.name_en,
        name_ur: plan.name_ur,
        price_monthly: plan.price_monthly,
        description_en: plan.description_en,
        description_ur: plan.description_ur,
        is_active: true,
        sort_order: plan.sort_order
      });
    }
  }

  for (const day of initialMessMenu) {
    const { error: menuErr } = await client.from('mess_menu').upsert(
      {
        day_of_week: day.day_of_week,
        breakfast_en: day.breakfast_en,
        breakfast_ur: day.breakfast_ur,
        lunch_en: day.lunch_en,
        lunch_ur: day.lunch_ur,
        dinner_en: day.dinner_en,
        dinner_ur: day.dinner_ur
      },
      { onConflict: 'day_of_week' }
    );
    if (menuErr) throw new Error(`Mess menu day ${day.day_of_week} sync failed: ${menuErr.message}`);
  }

  // 7. Sync Rules & FAQs
  onProgress?.('Updating Hostel Rules & Student FAQs...');
  const { data: existingRules } = await client.from('rules').select('id, sort_order');
  const ruleBySort = new Map((existingRules ?? []).map((r) => [r.sort_order, r.id]));
  for (const rule of initialRules) {
    const existingId = ruleBySort.get(rule.sort_order);
    if (existingId) {
      await client
        .from('rules')
        .update({ text_en: rule.text_en, text_ur: rule.text_ur, is_published: true })
        .eq('id', existingId);
    } else {
      await client.from('rules').insert({
        text_en: rule.text_en,
        text_ur: rule.text_ur,
        is_published: true,
        sort_order: rule.sort_order
      });
    }
  }

  const { data: existingFaqs } = await client.from('faqs').select('id, sort_order');
  const faqBySort = new Map((existingFaqs ?? []).map((f) => [f.sort_order, f.id]));
  for (const faq of initialFaqs) {
    const existingId = faqBySort.get(faq.sort_order);
    if (existingId) {
      await client
        .from('faqs')
        .update({
          question_en: faq.question_en,
          question_ur: faq.question_ur,
          answer_en: faq.answer_en,
          answer_ur: faq.answer_ur,
          is_published: true
        })
        .eq('id', existingId);
    } else {
      await client.from('faqs').insert({
        question_en: faq.question_en,
        question_ur: faq.question_ur,
        answer_en: faq.answer_en,
        answer_ur: faq.answer_ur,
        is_published: true,
        sort_order: faq.sort_order
      });
    }
  }

  // 8. Seed Gallery & Reviews if empty
  onProgress?.('Populating Gallery Photos & Resident Testimonials...');
  const { count: galCount } = await client
    .from('gallery_items')
    .select('id', { count: 'exact', head: true });
  if ((galCount ?? 0) === 0) {
    for (const gal of initialGallery) {
      const httpsImg = mapAssetUrl(gal.image_url);
      if (httpsImg.startsWith('https://')) {
        await client.from('gallery_items').insert({
          category: gal.category,
          image_url: httpsImg,
          caption_en: gal.caption_en,
          caption_ur: gal.caption_ur,
          is_published: true,
          sort_order: gal.sort_order
        });
      }
    }
  }

  const { count: revCount } = await client
    .from('reviews')
    .select('id', { count: 'exact', head: true });
  if ((revCount ?? 0) === 0) {
    for (const rev of initialReviews) {
      await client.from('reviews').insert({
        name: rev.name.slice(0, 60),
        rating: rev.rating,
        comment_en: rev.comment_en,
        comment_ur: rev.comment_ur,
        is_visible: true
      });
    }
  }

  // 9. Sync Bed Allocations if public.bed_allocations table exists
  try {
    const { data: syncedRooms } = await client.from('rooms').select('id, slug');
    const roomIdBySlug = new Map((syncedRooms ?? []).map((r) => [r.slug, r.id]));
    for (const alloc of initialBedAllocations) {
      const targetRoomId = alloc.room_slug ? roomIdBySlug.get(alloc.room_slug) : undefined;
      if (targetRoomId) {
        await client.from('bed_allocations').upsert(
          {
            room_id: targetRoomId,
            room_slug: alloc.room_slug,
            bed_number: alloc.bed_number,
            unit_label: alloc.unit_label || null,
            status: alloc.status,
            resident_name: alloc.resident_name,
            resident_phone: alloc.resident_phone,
            cnic_or_id: alloc.cnic_or_id || null,
            resident_category: alloc.resident_category,
            institution_or_workplace: alloc.institution_or_workplace || null,
            check_in_date: alloc.check_in_date,
            duration_value: alloc.duration_value,
            duration_unit: alloc.duration_unit,
            check_out_date: alloc.check_out_date,
            agreed_rent: alloc.agreed_rent,
            security_deposit: alloc.security_deposit,
            payment_status: alloc.payment_status,
            notes: alloc.notes || null
          },
          { onConflict: 'room_id,bed_number' }
        );
      }
    }
  } catch {
    // Non-fatal if sql/10_bed_allocations.sql has not been applied yet
  }

  mockStore.notify();
  onProgress?.('Complete!');
  return {
    summary:
      'All rooms, photos, prices, mess menu, facilities, FAQs, gallery, and hostel info have been synced to Supabase!'
  };
}
