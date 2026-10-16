import { mockStore } from './mockStore.ts';
import type { MessPlan, MessMenuDay } from '../types/index.ts';

export const messService = {
  async getPlans(): Promise<MessPlan[]> {
    await mockStore.delay();
    return mockStore.messPlans
      .filter((p) => p.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getAllPlans(): Promise<MessPlan[]> {
    await mockStore.delay();
    return [...mockStore.messPlans].sort((a, b) => a.sort_order - b.sort_order);
  },

  async createPlan(data: Omit<MessPlan, 'id'>): Promise<MessPlan> {
    await mockStore.delay();
    const newPlan: MessPlan = {
      ...data,
      id: `mess-${Date.now()}`
    };
    mockStore.messPlans.push(newPlan);
    mockStore.notify();
    return { ...newPlan };
  },

  async updatePlan(id: string, patch: Partial<MessPlan>): Promise<MessPlan> {
    await mockStore.delay();
    const index = mockStore.messPlans.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Plan not found');
    mockStore.messPlans[index] = { ...mockStore.messPlans[index], ...patch };
    mockStore.notify();
    return { ...mockStore.messPlans[index] };
  },

  async removePlan(id: string): Promise<void> {
    await mockStore.delay();
    mockStore.messPlans = mockStore.messPlans.filter((p) => p.id !== id);
    mockStore.notify();
  },

  async getMenu(): Promise<MessMenuDay[]> {
    await mockStore.delay();
    return [...mockStore.messMenu].sort((a, b) => a.day_of_week - b.day_of_week);
  },

  async updateMenuDay(dayOfWeek: number, patch: Partial<MessMenuDay>): Promise<MessMenuDay> {
    await mockStore.delay();
    const index = mockStore.messMenu.findIndex((m) => m.day_of_week === dayOfWeek);
    if (index === -1) throw new Error('Menu day not found');
    mockStore.messMenu[index] = { ...mockStore.messMenu[index], ...patch };
    mockStore.notify();
    return { ...mockStore.messMenu[index] };
  }
};
