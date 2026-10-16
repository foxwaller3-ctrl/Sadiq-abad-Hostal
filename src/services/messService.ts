import { mockStore } from './mockStore.ts';
import { supabase } from './supabaseClient.ts';
import type { MessPlan, MessMenuDay } from '../types/index.ts';
import { asRow, asRows, throwIfSupabaseError } from './serviceHelpers.ts';

export const messService = {
  async getPlans(): Promise<MessPlan[]> {
    if (supabase) {
      const { data, error } = await supabase.from('mess_plans').select('*').eq('is_active', true).order('sort_order');
      throwIfSupabaseError(error);
      return asRows<MessPlan>(data);
    }
    await mockStore.delay();
    return mockStore.messPlans.filter((p) => p.is_active).sort((a, b) => a.sort_order - b.sort_order);
  },

  async getAllPlans(): Promise<MessPlan[]> {
    if (supabase) {
      const { data, error } = await supabase.from('mess_plans').select('*').order('sort_order');
      throwIfSupabaseError(error);
      return asRows<MessPlan>(data);
    }
    await mockStore.delay();
    return [...mockStore.messPlans].sort((a, b) => a.sort_order - b.sort_order);
  },

  async createPlan(data: Omit<MessPlan, 'id'>): Promise<MessPlan> {
    if (supabase) {
      const { data: created, error } = await supabase.from('mess_plans').insert(data).select('*').single();
      throwIfSupabaseError(error);
      return asRow<MessPlan>(created, 'Created mess plan');
    }
    await mockStore.delay();
    const newPlan: MessPlan = { ...data, id: 'mess-' + Date.now() };
    mockStore.messPlans.push(newPlan);
    mockStore.notify();
    return { ...newPlan };
  },

  async updatePlan(id: string, patch: Partial<MessPlan>): Promise<MessPlan> {
    if (supabase) {
      const { id: _id, ...safePatch } = patch;
      const { data, error } = await supabase.from('mess_plans').update(safePatch).eq('id', id).select('*').single();
      throwIfSupabaseError(error);
      return asRow<MessPlan>(data, 'Updated mess plan');
    }
    await mockStore.delay();
    const index = mockStore.messPlans.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Plan not found');
    mockStore.messPlans[index] = { ...mockStore.messPlans[index], ...patch };
    mockStore.notify();
    return { ...mockStore.messPlans[index] };
  },

  async removePlan(id: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('mess_plans').delete().eq('id', id);
      throwIfSupabaseError(error);
      return;
    }
    await mockStore.delay();
    mockStore.messPlans = mockStore.messPlans.filter((p) => p.id !== id);
    mockStore.notify();
  },

  async getMenu(): Promise<MessMenuDay[]> {
    if (supabase) {
      const { data, error } = await supabase.from('mess_menu').select('*').order('day_of_week');
      throwIfSupabaseError(error);
      return asRows<MessMenuDay>(data);
    }
    await mockStore.delay();
    return [...mockStore.messMenu].sort((a, b) => a.day_of_week - b.day_of_week);
  },

  async updateMenuDay(dayOfWeek: number, patch: Partial<MessMenuDay>): Promise<MessMenuDay> {
    if (supabase) {
      const { id: _id, ...safePatch } = patch;
      const { data, error } = await supabase.from('mess_menu').update(safePatch).eq('day_of_week', dayOfWeek).select('*').single();
      throwIfSupabaseError(error);
      return asRow<MessMenuDay>(data, 'Updated menu day');
    }
    await mockStore.delay();
    const index = mockStore.messMenu.findIndex((m) => m.day_of_week === dayOfWeek);
    if (index === -1) throw new Error('Menu day not found');
    mockStore.messMenu[index] = { ...mockStore.messMenu[index], ...patch };
    mockStore.notify();
    return { ...mockStore.messMenu[index] };
  }
};
