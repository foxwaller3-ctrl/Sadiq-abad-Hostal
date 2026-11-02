import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { GalleryItem } from '../types/index.ts';
import { asRow, asRows, stripSystemFields, throwIfSupabaseError } from './serviceHelpers.ts';
import { enrichGallery } from './seedEnrichment.ts';
import { resolveHttpsMediaUrl } from './mediaService.ts';

export const galleryService = {
  async getPublished(): Promise<GalleryItem[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');
      throwIfSupabaseError(error);
      const rows = asRows<GalleryItem>(data);
      if (rows.length > 0) return rows;
      // Check if admin has any gallery items at all; if table is completely unseeded, return curated photos
      const { count } = await supabase
        .from('gallery_items')
        .select('id', { count: 'exact', head: true });
      if ((count ?? 0) > 0) return [];
      return enrichGallery([]);
    }
    await mockStore.delay();
    return mockStore.gallery.filter((g) => g.is_published).sort((a, b) => a.sort_order - b.sort_order);
  },

  async getAll(): Promise<GalleryItem[]> {
    if (supabase) {
      const { data, error } = await supabase.from('gallery_items').select('*').order('sort_order');
      throwIfSupabaseError(error);
      return enrichGallery(asRows<GalleryItem>(data));
    }
    await mockStore.delay();
    return [...mockStore.gallery].sort((a, b) => a.sort_order - b.sort_order);
  },

  async create(data: Omit<GalleryItem, 'id'> & { id?: string }): Promise<GalleryItem> {
    const cleanData = stripSystemFields(data);
    if (supabase) {
      const httpsUrl = await resolveHttpsMediaUrl(cleanData.image_url, 'gallery');
      const { data: created, error } = await supabase
        .from('gallery_items')
        .insert({ ...cleanData, image_url: httpsUrl })
        .select('*')
        .single();
      throwIfSupabaseError(error);
      mockStore.notify();
      return asRow<GalleryItem>(created, 'Created gallery item');
    }
    await mockStore.delay();
    const item: GalleryItem = { ...cleanData, id: 'gal-' + Date.now() };
    mockStore.gallery.push(item);
    mockStore.notify();
    return { ...item };
  },

  async update(id: string, patch: Partial<GalleryItem>): Promise<GalleryItem> {
    const safePatch = stripSystemFields(patch);
    if (supabase && !id.startsWith('gal-')) {
      if (safePatch.image_url) {
        safePatch.image_url = await resolveHttpsMediaUrl(safePatch.image_url, 'gallery');
      }
      const { data, error } = await supabase
        .from('gallery_items')
        .update(safePatch)
        .eq('id', id)
        .select('*')
        .single();
      throwIfSupabaseError(error);
      mockStore.notify();
      return asRow<GalleryItem>(data, 'Updated gallery item');
    }
    await mockStore.delay();
    const index = mockStore.gallery.findIndex((g) => g.id === id);
    if (index === -1) throw new Error('Gallery item not found');
    mockStore.gallery[index] = { ...mockStore.gallery[index], ...safePatch };
    mockStore.notify();
    return { ...mockStore.gallery[index] };
  },

  async remove(id: string): Promise<void> {
    if (supabase && !id.startsWith('gal-')) {
      const { error } = await supabase.from('gallery_items').delete().eq('id', id);
      throwIfSupabaseError(error);
      mockStore.notify();
      return;
    }
    await mockStore.delay();
    mockStore.gallery = mockStore.gallery.filter((g) => g.id !== id);
    mockStore.notify();
  }
};
