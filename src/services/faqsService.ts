import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { Faq } from '../types/index.ts';
import { asRow, asRows, throwIfSupabaseError } from './serviceHelpers.ts';

export const faqsService = {
  async getPublished(): Promise<Faq[]> {
    if (supabase) {
      const { data, error } = await supabase.from('faqs').select('*').eq('is_published', true).order('sort_order');
      throwIfSupabaseError(error);
      return asRows<Faq>(data);
    }
    await mockStore.delay();
    return mockStore.faqs.filter((f) => f.is_published).sort((a, b) => a.sort_order - b.sort_order);
  },
  async getAll(): Promise<Faq[]> {
    if (supabase) {
      const { data, error } = await supabase.from('faqs').select('*').order('sort_order');
      throwIfSupabaseError(error);
      return asRows<Faq>(data);
    }
    await mockStore.delay();
    return [...mockStore.faqs].sort((a, b) => a.sort_order - b.sort_order);
  },
  async create(data: Omit<Faq, 'id'>): Promise<Faq> {
    if (supabase) {
      const { data: created, error } = await supabase.from('faqs').insert(data).select('*').single();
      throwIfSupabaseError(error);
      return asRow<Faq>(created, 'Created FAQ');
    }
    await mockStore.delay();
    const item: Faq = { ...data, id: 'faq-' + Date.now() };
    mockStore.faqs.push(item);
    mockStore.notify();
    return { ...item };
  },
  async update(id: string, patch: Partial<Faq>): Promise<Faq> {
    if (supabase) {
      const { id: _id, ...safePatch } = patch;
      const { data, error } = await supabase.from('faqs').update(safePatch).eq('id', id).select('*').single();
      throwIfSupabaseError(error);
      return asRow<Faq>(data, 'Updated FAQ');
    }
    await mockStore.delay();
    const index = mockStore.faqs.findIndex((f) => f.id === id);
    if (index === -1) throw new Error('FAQ not found');
    mockStore.faqs[index] = { ...mockStore.faqs[index], ...patch };
    mockStore.notify();
    return { ...mockStore.faqs[index] };
  },
  async remove(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      throwIfSupabaseError(error);
      return;
    }
    await mockStore.delay();
    mockStore.faqs = mockStore.faqs.filter((f) => f.id !== id);
    mockStore.notify();
  }
};
