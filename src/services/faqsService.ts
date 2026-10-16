import { mockStore } from './mockStore.ts';
import type { Faq } from '../types/index.ts';

export const faqsService = {
  async getPublished(): Promise<Faq[]> {
    await mockStore.delay();
    return mockStore.faqs
      .filter((f) => f.is_published)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getAll(): Promise<Faq[]> {
    await mockStore.delay();
    return [...mockStore.faqs].sort((a, b) => a.sort_order - b.sort_order);
  },

  async create(data: Omit<Faq, 'id'>): Promise<Faq> {
    await mockStore.delay();
    const item: Faq = {
      ...data,
      id: `faq-${Date.now()}`
    };
    mockStore.faqs.push(item);
    mockStore.notify();
    return { ...item };
  },

  async update(id: string, patch: Partial<Faq>): Promise<Faq> {
    await mockStore.delay();
    const index = mockStore.faqs.findIndex((f) => f.id === id);
    if (index === -1) throw new Error('FAQ not found');
    mockStore.faqs[index] = { ...mockStore.faqs[index], ...patch };
    mockStore.notify();
    return { ...mockStore.faqs[index] };
  },

  async remove(id: string): Promise<void> {
    await mockStore.delay();
    mockStore.faqs = mockStore.faqs.filter((f) => f.id !== id);
    mockStore.notify();
  }
};
