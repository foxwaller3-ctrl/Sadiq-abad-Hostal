import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { SiteSettings } from '../types/index.ts';
import { asRow, throwIfSupabaseError } from './serviceHelpers.ts';

export const settingsService = {
  async get(): Promise<SiteSettings> {
    if (supabase) {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      throwIfSupabaseError(error);
      return asRow<SiteSettings>(data, 'Site settings');
    }
    await mockStore.delay();
    return { ...mockStore.siteSettings };
  },

  async update(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    if (supabase) {
      const { id: _id, updated_at: _updatedAt, ...safePatch } = patch;
      const { data, error } = await supabase
        .from('site_settings')
        .update(safePatch)
        .eq('id', 1)
        .select('*')
        .single();
      throwIfSupabaseError(error);
      return asRow<SiteSettings>(data, 'Updated site settings');
    }
    await mockStore.delay();
    mockStore.siteSettings = { ...mockStore.siteSettings, ...patch, updated_at: new Date().toISOString() };
    mockStore.notify();
    return { ...mockStore.siteSettings };
  }
};
