import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { GalleryItem } from '../types/index.ts';
import { asRow, asRows, throwIfSupabaseError } from './serviceHelpers.ts';

export const galleryService = {
  async getPublished(): Promise<GalleryItem[]> {
    if (supabase) {
      const { data, error } = await supabase.from('gallery_items').select('*').eq('is_published', true).order('sort_order');
      throwIfSupabaseError(error);
      return asRows<GalleryItem>(data);
    }
    await mockStore.delay();
    return mockStore.gallery.filter((g) => g.is_published).sort((a, b) => a.sort_order - b.sort_order);
  },
  async getAll(): Promise<GalleryItem[]> {
    if (supabase) {
      const { data, error } = await supabase.from('gallery_items').select('*').order('sort_order');
      throwIfSupabaseError(error);
      return asRows<GalleryItem>(data);
    }
    await mockStore.delay();
    return [...mockStore.gallery].sort((a, b) => a.sort_order - b.sort_order);
  },
  async create(data: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    if (supabase) {
      const { data: created, error } = await supabase.from('gallery_items').insert(data).select('*').single();
      throwIfSupabaseError(error);
      return asRow<GalleryItem>(created, 'Created gallery item');
    }
    await mockStore.delay();
    const item: GalleryItem = { ...data, id: 'gal-' + Date.now() };
    mockStore.gallery.push(item);
    mockStore.notify();
    return { ...item };
  },
  async update(id: string, patch: Partial<GalleryItem>): Promise<GalleryItem> {
    if (supabase) {
      const { id: _id, ...safePatch } = patch;
      const { data, error } = await supabase.from('gallery_items').update(safePatch).eq('id', id).select('*').single();
      throwIfSupabaseError(error);
      return asRow<GalleryItem>(data, 'Updated gallery item');
    }
    await mockStore.delay();
    const index = mockStore.gallery.findIndex((g) => g.id === id);
    if (index === -1) throw new Error('Gallery item not found');
    mockStore.gallery[index] = { ...mockStore.gallery[index], ...patch };
    mockStore.notify();
    return { ...mockStore.gallery[index] };
  },
  async remove(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('gallery_items').delete().eq('id', id);
      throwIfSupabaseError(error);
      return;
    }
    await mockStore.delay();
    mockStore.gallery = mockStore.gallery.filter((g) => g.id !== id);
    mockStore.notify();
  }
};
