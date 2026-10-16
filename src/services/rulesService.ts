import { mockStore } from './mockStore.ts';
import type { Rule } from '../types/index.ts';

export const rulesService = {
  async getPublished(): Promise<Rule[]> {
    await mockStore.delay();
    return mockStore.rules
      .filter((r) => r.is_published)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getAll(): Promise<Rule[]> {
    await mockStore.delay();
    return [...mockStore.rules].sort((a, b) => a.sort_order - b.sort_order);
  },

  async create(data: Omit<Rule, 'id'>): Promise<Rule> {
    await mockStore.delay();
    const item: Rule = {
      ...data,
      id: `rule-${Date.now()}`
    };
    mockStore.rules.push(item);
    mockStore.notify();
    return { ...item };
  },

  async update(id: string, patch: Partial<Rule>): Promise<Rule> {
    await mockStore.delay();
    const index = mockStore.rules.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Rule not found');
    mockStore.rules[index] = { ...mockStore.rules[index], ...patch };
    mockStore.notify();
    return { ...mockStore.rules[index] };
  },

  async remove(id: string): Promise<void> {
    await mockStore.delay();
    mockStore.rules = mockStore.rules.filter((r) => r.id !== id);
    mockStore.notify();
  }
};
