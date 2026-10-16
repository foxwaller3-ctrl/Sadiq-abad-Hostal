import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { Facility } from '../types/index.ts';
import { asRow, asRows, throwIfSupabaseError } from './serviceHelpers.ts';

export const facilitiesService = {
  async getPublished(): Promise<Facility[]> {
    if (supabase) {
      const { data, error } = await supabase.from('facilities').select('*').eq('is_published', true).order('sort_order');
      throwIfSupabaseError(error);
      return asRows<Facility>(data);
    }
    await mockStore.delay();
    return mockStore.facilities.filter((f) => f.is_published).sort((a, b) => a.sort_order - b.sort_order);
  },

  async getAll(): Promise<Facility[]> {
    if (supabase) {
      const { data, error } = await supabase.from('facilities').select('*').order('sort_order');
      throwIfSupabaseError(error);
      return asRows<Facility>(data);
    }
    await mockStore.delay();
    return [...mockStore.facilities].sort((a, b) => a.sort_order - b.sort_order);
  },

  async create(data: Omit<Facility, 'id'>): Promise<Facility> {
    if (supabase) {
      const { data: created, error } = await supabase.from('facilities').insert(data).select('*').single();
      throwIfSupabaseError(error);
      return asRow<Facility>(created, 'Created facility');
    }
    await mockStore.delay();
    const newFacility: Facility = { ...data, id: 'fac-' + Date.now() };
    mockStore.facilities.push(newFacility);
    mockStore.notify();
    return { ...newFacility };
  },

  async update(id: string, patch: Partial<Facility>): Promise<Facility> {
    if (supabase) {
      const { id: _id, ...safePatch } = patch;
      const { data, error } = await supabase.from('facilities').update(safePatch).eq('id', id).select('*').single();
      throwIfSupabaseError(error);
      return asRow<Facility>(data, 'Updated facility');
    }
    await mockStore.delay();
    const index = mockStore.facilities.findIndex((f) => f.id === id);
    if (index === -1) throw new Error('Facility not found');
    mockStore.facilities[index] = { ...mockStore.facilities[index], ...patch };
    mockStore.notify();
    return { ...mockStore.facilities[index] };
  },

  async remove(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('facilities').delete().eq('id', id);
      throwIfSupabaseError(error);
      return;
    }
    await mockStore.delay();
    mockStore.facilities = mockStore.facilities.filter((f) => f.id !== id);
    mockStore.notify();
  }
};
