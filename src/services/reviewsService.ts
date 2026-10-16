import { mockStore } from './mockStore.ts';
import type { Review } from '../types/index.ts';

export const reviewsService = {
  async getVisible(): Promise<Review[]> {
    await mockStore.delay();
    return mockStore.reviews
      .filter((r) => r.is_visible)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  async getAll(): Promise<Review[]> {
    await mockStore.delay();
    return [...mockStore.reviews].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async create(data: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    await mockStore.delay();
    const item: Review = {
      ...data,
      id: `rev-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    mockStore.reviews.push(item);
    mockStore.notify();
    return { ...item };
  },

  async update(id: string, patch: Partial<Review>): Promise<Review> {
    await mockStore.delay();
    const index = mockStore.reviews.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Review not found');
    mockStore.reviews[index] = { ...mockStore.reviews[index], ...patch };
    mockStore.notify();
    return { ...mockStore.reviews[index] };
  },

  async remove(id: string): Promise<void> {
    await mockStore.delay();
    mockStore.reviews = mockStore.reviews.filter((r) => r.id !== id);
    mockStore.notify();
  }
};
