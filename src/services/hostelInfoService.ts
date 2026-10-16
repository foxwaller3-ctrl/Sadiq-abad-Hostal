import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { HostelInfo } from '../types/index.ts';
import { asRow, throwIfSupabaseError } from './serviceHelpers.ts';

export const hostelInfoService = {
  async get(): Promise<HostelInfo> {
    if (supabase) {
      const { data, error } = await supabase.from('hostel_info').select('*').eq('id', 1).single();
      throwIfSupabaseError(error);
      return asRow<HostelInfo>(data, 'Hostel information');
    }
    await mockStore.delay();
    return { ...mockStore.hostelInfo };
  },

  async update(patch: Partial<HostelInfo>): Promise<HostelInfo> {
    if (supabase) {
      const { id: _id, updated_at: _updatedAt, ...safePatch } = patch;
      const { data, error } = await supabase
        .from('hostel_info')
        .update(safePatch)
        .eq('id', 1)
        .select('*')
        .single();
      throwIfSupabaseError(error);
      return asRow<HostelInfo>(data, 'Updated hostel information');
    }
    await mockStore.delay();
    mockStore.hostelInfo = { ...mockStore.hostelInfo, ...patch, updated_at: new Date().toISOString() };
    mockStore.notify();
    return { ...mockStore.hostelInfo };
  }
};
