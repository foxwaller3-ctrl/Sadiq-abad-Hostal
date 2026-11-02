import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { HostelInfo } from '../types/index.ts';
import { asRow } from './serviceHelpers.ts';
import { enrichHostelInfo } from './seedEnrichment.ts';
import { extractMapEmbedUrl } from '../utils/helpers.ts';
import { resolveHttpsMediaUrl } from './mediaService.ts';

const HOSTEL_INFO_LOCAL_KEY = 'sadiqabad_hostel_info_override';
export const DEFAULT_HOSTEL_LOGO = 'https://kommodo.ai/i/0IV3pZTemc49bUwLxmEI';

export const hostelInfoService = {
  async get(): Promise<HostelInfo> {
    let localOverride: Partial<HostelInfo> | null = null;
    try {
      const stored = localStorage.getItem(HOSTEL_INFO_LOCAL_KEY);
      if (stored) {
        localOverride = JSON.parse(stored);
      }
    } catch {
      // ignore localStorage parse errors
    }

    if (supabase) {
      try {
        const { data, error } = await supabase.from('hostel_info').select('*').eq('id', 1).single();
        if (!error && data) {
          const rawRow = asRow<HostelInfo>(data, 'Hostel information');
          const enriched = enrichHostelInfo(rawRow);
          const effectiveLogo =
            rawRow.logo_url?.trim() || localOverride?.logo_url?.trim() || DEFAULT_HOSTEL_LOGO;

          const merged: HostelInfo = {
            ...enriched,
            ...(localOverride || {}),
            logo_url: effectiveLogo
          };

          mockStore.hostelInfo = merged;
          return merged;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local store:', err);
      }
    }

    await mockStore.delay(20);
    const fallbackLogo =
      localOverride?.logo_url?.trim() || mockStore.hostelInfo.logo_url?.trim() || DEFAULT_HOSTEL_LOGO;
    mockStore.hostelInfo = {
      ...mockStore.hostelInfo,
      ...(localOverride || {}),
      logo_url: fallbackLogo
    };
    return { ...mockStore.hostelInfo };
  },

  async update(patch: Partial<HostelInfo>): Promise<HostelInfo> {
    const sanitizedMapUrl =
      patch.map_embed_url !== undefined ? extractMapEmbedUrl(patch.map_embed_url) : undefined;

    const updatedTimestamp = new Date().toISOString();
    const cleanPatch: Partial<HostelInfo> = {
      ...patch,
      ...(sanitizedMapUrl !== undefined ? { map_embed_url: sanitizedMapUrl } : {}),
      updated_at: updatedTimestamp
    };

    mockStore.hostelInfo = {
      ...mockStore.hostelInfo,
      ...cleanPatch
    };
    try {
      localStorage.setItem(HOSTEL_INFO_LOCAL_KEY, JSON.stringify(mockStore.hostelInfo));
    } catch {
      // ignore localStorage quota error
    }

    if (supabase) {
      const { id: _id, updated_at: _updatedAt, ...safePatch } = cleanPatch;
      // Ensure logo_url satisfies Postgres CHECK (logo_url = '' or logo_url like 'https://%')
      if (safePatch.logo_url && !safePatch.logo_url.startsWith('https://')) {
        const resolved = await resolveHttpsMediaUrl(safePatch.logo_url, 'branding');
        safePatch.logo_url = resolved.startsWith('https://') ? resolved : DEFAULT_HOSTEL_LOGO;
      }

      try {
        const { data, error } = await supabase
          .from('hostel_info')
          .update(safePatch)
          .eq('id', 1)
          .select('*')
          .maybeSingle();

        if (!error && data) {
          const result = enrichHostelInfo(asRow<HostelInfo>(data, 'Updated hostel information'));
          mockStore.hostelInfo = { ...mockStore.hostelInfo, ...result };
          try {
            localStorage.setItem(HOSTEL_INFO_LOCAL_KEY, JSON.stringify(mockStore.hostelInfo));
          } catch {
            // ignore
          }
        } else if (error) {
          throw new Error(error.message);
        }
      } catch (err) {
        console.warn('Supabase hostel_info update warning:', err);
      }
    }

    mockStore.notify();
    return { ...mockStore.hostelInfo };
  }
};
