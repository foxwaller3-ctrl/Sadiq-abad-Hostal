import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { Rule } from '../types/index.ts';
import { asRow, asRows, stripSystemFields, throwIfSupabaseError } from './serviceHelpers.ts';

export const rulesService = {
  async getPublished(): Promise<Rule[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('rules')
        .select('*')
        .eq('is_published', true)
        .order('sort_order');
      throwIfSupabaseError(error);
      return asRows<Rule>(data);
    }
    await mockStore.delay();
    return mockStore.rules.filter((r) => r.is_published).sort((a, b) => a.sort_order - b.sort_order);
  },

  async getAll(): Promise<Rule[]> {
    if (supabase) {
      const { data, error } = await supabase.from('rules').select('*').order('sort_order');
      throwIfSupabaseError(error);
      return asRows<Rule>(data);
    }
    await mockStore.delay();
    return [...mockStore.rules].sort((a, b) => a.sort_order - b.sort_order);
  },

  async create(data: Omit<Rule, 'id'> & { id?: string }): Promise<Rule> {
    const cleanData = stripSystemFields(data);
    if (supabase) {
      const { data: created, error } = await supabase
        .from('rules')
        .insert(cleanData)
        .select('*')
        .single();
      throwIfSupabaseError(error);
      mockStore.notify();
      return asRow<Rule>(created, 'Created rule');
    }
    await mockStore.delay();
    const item: Rule = { ...cleanData, id: 'rule-' + Date.now() };
    mockStore.rules.push(item);
    mockStore.notify();
    return { ...item };
  },

  async update(id: string, patch: Partial<Rule>): Promise<Rule> {
    const safePatch = stripSystemFields(patch);
    if (supabase) {
      const { data, error } = await supabase
        .from('rules')
        .update(safePatch)
        .eq('id', id)
        .select('*')
        .single();
      throwIfSupabaseError(error);
      mockStore.notify();
      return asRow<Rule>(data, 'Updated rule');
    }
    await mockStore.delay();
    const index = mockStore.rules.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Rule not found');
    mockStore.rules[index] = { ...mockStore.rules[index], ...safePatch };
    mockStore.notify();
    return { ...mockStore.rules[index] };
  },

  async remove(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('rules').delete().eq('id', id);
      throwIfSupabaseError(error);
      mockStore.notify();
      return;
    }
    await mockStore.delay();
    mockStore.rules = mockStore.rules.filter((r) => r.id !== id);
    mockStore.notify();
  }
};
