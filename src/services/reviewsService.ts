import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { Review } from '../types/index.ts';
import { asRow, asRows, throwIfSupabaseError } from './serviceHelpers.ts';

export const reviewsService = {
  async getVisible(): Promise<Review[]> {
    if (supabase) {
      const { data, error } = await supabase.from('reviews').select('*').eq('is_visible', true).order('created_at', { ascending: false });
      throwIfSupabaseError(error);
      return asRows<Review>(data);
    }
    await mockStore.delay();
    return mockStore.reviews.filter((r) => r.is_visible).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
  async getAll(): Promise<Review[]> {
    if (supabase) {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      throwIfSupabaseError(error);
      return asRows<Review>(data);
    }
    await mockStore.delay();
    return [...mockStore.reviews].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },
  async create(data: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    if (supabase) {
      const { data: created, error } = await supabase.from('reviews').insert(data).select('*').single();
      throwIfSupabaseError(error);
      return asRow<Review>(created, 'Created review');
    }
    await mockStore.delay();
    const item: Review = { ...data, id: 'rev-' + Date.now(), created_at: new Date().toISOString() };
    mockStore.reviews.push(item);
    mockStore.notify();
    return { ...item };
  },
  async update(id: string, patch: Partial<Review>): Promise<Review> {
    if (supabase) {
      const { id: _id, created_at: _createdAt, ...safePatch } = patch;
      const { data, error } = await supabase.from('reviews').update(safePatch).eq('id', id).select('*').single();
      throwIfSupabaseError(error);
      return asRow<Review>(data, 'Updated review');
    }
    await mockStore.delay();
    const index = mockStore.reviews.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Review not found');
    mockStore.reviews[index] = { ...mockStore.reviews[index], ...patch };
    mockStore.notify();
    return { ...mockStore.reviews[index] };
  },
  async remove(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      throwIfSupabaseError(error);
      return;
    }
    await mockStore.delay();
    mockStore.reviews = mockStore.reviews.filter((r) => r.id !== id);
    mockStore.notify();
  }
};
