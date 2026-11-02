import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { Review } from '../types/index.ts';
import { asRow, asRows, stripSystemFields, throwIfSupabaseError } from './serviceHelpers.ts';
import { enrichReviews } from './seedEnrichment.ts';

export const reviewsService = {
  async getVisible(): Promise<Review[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_visible', true)
        .order('created_at', { ascending: false });
      throwIfSupabaseError(error);
      const rows = asRows<Review>(data);
      if (rows.length > 0) return rows;
      const { count } = await supabase.from('reviews').select('id', { count: 'exact', head: true });
      if ((count ?? 0) > 0) return [];
      return enrichReviews([]);
    }
    await mockStore.delay();
    return mockStore.reviews
      .filter((r) => r.is_visible)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getAll(): Promise<Review[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });
      throwIfSupabaseError(error);
      return enrichReviews(asRows<Review>(data));
    }
    await mockStore.delay();
    return [...mockStore.reviews].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async create(data: Omit<Review, 'id' | 'created_at'> & { id?: string; created_at?: string }): Promise<Review> {
    const cleanData = stripSystemFields(data);
    cleanData.name = (cleanData.name || '').trim().slice(0, 60);
    cleanData.rating = Math.min(5, Math.max(1, Math.round(Number(cleanData.rating) || 5)));
    if (supabase) {
      const { data: created, error } = await supabase
        .from('reviews')
        .insert(cleanData)
        .select('*')
        .single();
      throwIfSupabaseError(error);
      mockStore.notify();
      return asRow<Review>(created, 'Created review');
    }
    await mockStore.delay();
    const item: Review = { ...cleanData, id: 'rev-' + Date.now(), created_at: new Date().toISOString() };
    mockStore.reviews.push(item);
    mockStore.notify();
    return { ...item };
  },

  async update(id: string, patch: Partial<Review>): Promise<Review> {
    const safePatch = stripSystemFields(patch);
    if (safePatch.name !== undefined) {
      safePatch.name = safePatch.name.trim().slice(0, 60);
    }
    if (safePatch.rating !== undefined) {
      safePatch.rating = Math.min(5, Math.max(1, Math.round(Number(safePatch.rating) || 5)));
    }
    if (supabase && !id.startsWith('rev-')) {
      const { data, error } = await supabase
        .from('reviews')
        .update(safePatch)
        .eq('id', id)
        .select('*')
        .single();
      throwIfSupabaseError(error);
      mockStore.notify();
      return asRow<Review>(data, 'Updated review');
    }
    await mockStore.delay();
    const index = mockStore.reviews.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Review not found');
    mockStore.reviews[index] = { ...mockStore.reviews[index], ...safePatch };
    mockStore.notify();
    return { ...mockStore.reviews[index] };
  },

  async remove(id: string): Promise<void> {
    if (supabase && !id.startsWith('rev-')) {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      throwIfSupabaseError(error);
      mockStore.notify();
      return;
    }
    await mockStore.delay();
    mockStore.reviews = mockStore.reviews.filter((r) => r.id !== id);
    mockStore.notify();
  }
};
