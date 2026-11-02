import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { SiteSettings } from '../types/index.ts';
import { asRow, throwIfSupabaseError } from './serviceHelpers.ts';
import { enrichSiteSettings } from './seedEnrichment.ts';

export const settingsService = {
  async get(): Promise<SiteSettings> {
    if (supabase) {
      const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).single();
      throwIfSupabaseError(error);
      const enriched = enrichSiteSettings(asRow<SiteSettings>(data, 'Site settings'));
      mockStore.siteSettings = enriched;
      return enriched;
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
      const updated = asRow<SiteSettings>(data, 'Updated site settings');
      mockStore.siteSettings = updated;
      mockStore.notify();
      return updated;
    }
    await mockStore.delay();
    mockStore.siteSettings = { ...mockStore.siteSettings, ...patch, updated_at: new Date().toISOString() };
    mockStore.notify();
    return { ...mockStore.siteSettings };
  }
};
