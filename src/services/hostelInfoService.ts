import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { HostelInfo } from '../types/index.ts';
import { asRow } from './serviceHelpers.ts';

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
          const row = asRow<HostelInfo>(data, 'Hostel information');
          
          // Determine effective logo:
          // 1. Supabase database logo_url if non-empty
          // 2. Local admin override logo_url if non-empty
          // 3. Fallback default official logo
          let effectiveLogo = row.logo_url?.trim() || localOverride?.logo_url?.trim() || DEFAULT_HOSTEL_LOGO;

          const merged: HostelInfo = {
            ...mockStore.hostelInfo,
            ...row,
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
    const fallbackLogo = localOverride?.logo_url?.trim() || mockStore.hostelInfo.logo_url?.trim() || DEFAULT_HOSTEL_LOGO;
    mockStore.hostelInfo = {
      ...mockStore.hostelInfo,
      ...(localOverride || {}),
      logo_url: fallbackLogo
    };
    return { ...mockStore.hostelInfo };
  },

  async update(patch: Partial<HostelInfo>): Promise<HostelInfo> {
    const updatedTimestamp = new Date().toISOString();
    const cleanPatch = { ...patch, updated_at: updatedTimestamp };

    // 1. Instantly update mock store & local storage cache
    mockStore.hostelInfo = {
      ...mockStore.hostelInfo,
      ...cleanPatch
    };
    try {
      localStorage.setItem(HOSTEL_INFO_LOCAL_KEY, JSON.stringify(mockStore.hostelInfo));
    } catch {
      // ignore localStorage quota error
    }

    // 2. Persist to Supabase if client is initialized
    if (supabase) {
      const { id: _id, updated_at: _updatedAt, ...safePatch } = cleanPatch;
      try {
        const { data, error } = await supabase
          .from('hostel_info')
          .update(safePatch)
          .eq('id', 1)
          .select('*')
          .maybeSingle();

        if (!error && data) {
          const result = asRow<HostelInfo>(data, 'Updated hostel information');
          mockStore.hostelInfo = { ...mockStore.hostelInfo, ...result };
          try {
            localStorage.setItem(HOSTEL_INFO_LOCAL_KEY, JSON.stringify(mockStore.hostelInfo));
          } catch {
            // ignore
          }
        } else if (error) {
          console.warn('Supabase update error (RLS or permissions):', error.message);
        }
      } catch (err) {
        console.warn('Supabase update failed, continuing with local store:', err);
      }
    }

    // 3. Broadcast update to all listening components
    mockStore.notify();
    return { ...mockStore.hostelInfo };
  }
};
