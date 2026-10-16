import { mockStore } from './mockStore.ts';
import type { GalleryItem } from '../types/index.ts';

export const galleryService = {
  async getPublished(): Promise<GalleryItem[]> {
    await mockStore.delay();
    return mockStore.gallery
      .filter((g) => g.is_published)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getAll(): Promise<GalleryItem[]> {
    await mockStore.delay();
    return [...mockStore.gallery].sort((a, b) => a.sort_order - b.sort_order);
  },

  async create(data: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    await mockStore.delay();
    const item: GalleryItem = {
      ...data,
      id: `gal-${Date.now()}`
    };
    mockStore.gallery.push(item);
    mockStore.notify();
    return { ...item };
  },

  async update(id: string, patch: Partial<GalleryItem>): Promise<GalleryItem> {
    await mockStore.delay();
    const index = mockStore.gallery.findIndex((g) => g.id === id);
    if (index === -1) throw new Error('Gallery item not found');
    mockStore.gallery[index] = { ...mockStore.gallery[index], ...patch };
    mockStore.notify();
    return { ...mockStore.gallery[index] };
  },

  async remove(id: string): Promise<void> {
    await mockStore.delay();
    mockStore.gallery = mockStore.gallery.filter((g) => g.id !== id);
    mockStore.notify();
  }
};
