import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { Notice } from '../types/index.ts';
import { isNoticeActive } from '../utils/helpers.ts';
import { asRow, asRows, stripSystemFields, throwIfSupabaseError } from './serviceHelpers.ts';

export const noticesService = {
  async getActive(): Promise<Notice[]> {
    if (supabase) {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_active', true)
        .lte('starts_at', now)
        .gte('ends_at', now)
        .order('starts_at', { ascending: false });
      throwIfSupabaseError(error);
      return asRows<Notice>(data);
    }
    await mockStore.delay();
    return mockStore.notices.filter((n) => isNoticeActive(n));
  },

  async getAll(): Promise<Notice[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('starts_at', { ascending: false });
      throwIfSupabaseError(error);
      return asRows<Notice>(data);
    }
    await mockStore.delay();
    return [...mockStore.notices];
  },

  async create(data: Omit<Notice, 'id'> & { id?: string }): Promise<Notice> {
    const cleanData = stripSystemFields(data);
    if (supabase) {
      const { data: created, error } = await supabase
        .from('notices')
        .insert(cleanData)
        .select('*')
        .single();
      throwIfSupabaseError(error);
      mockStore.notify();
      return asRow<Notice>(created, 'Created notice');
    }
    await mockStore.delay();
    const item: Notice = { ...cleanData, id: 'notice-' + Date.now() };
    mockStore.notices.push(item);
    mockStore.notify();
    return { ...item };
  },

  async update(id: string, patch: Partial<Notice>): Promise<Notice> {
    const safePatch = stripSystemFields(patch);
    if (supabase) {
      const { data, error } = await supabase
        .from('notices')
        .update(safePatch)
        .eq('id', id)
        .select('*')
        .single();
      throwIfSupabaseError(error);
      mockStore.notify();
      return asRow<Notice>(data, 'Updated notice');
    }
    await mockStore.delay();
    const index = mockStore.notices.findIndex((n) => n.id === id);
    if (index === -1) throw new Error('Notice not found');
    mockStore.notices[index] = { ...mockStore.notices[index], ...safePatch };
    mockStore.notify();
    return { ...mockStore.notices[index] };
  },

  async remove(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('notices').delete().eq('id', id);
      throwIfSupabaseError(error);
      mockStore.notify();
      return;
    }
    await mockStore.delay();
    mockStore.notices = mockStore.notices.filter((n) => n.id !== id);
    mockStore.notify();
  }
};
