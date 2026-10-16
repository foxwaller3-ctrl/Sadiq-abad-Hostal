import { mockStore } from './mockStore.ts';
import type { Notice } from '../types/index.ts';
import { isNoticeActive } from '../utils/helpers.ts';

export const noticesService = {
  async getActive(): Promise<Notice[]> {
    await mockStore.delay();
    return mockStore.notices.filter((n) => isNoticeActive(n));
  },

  async getAll(): Promise<Notice[]> {
    await mockStore.delay();
    return [...mockStore.notices];
  },

  async create(data: Omit<Notice, 'id'>): Promise<Notice> {
    await mockStore.delay();
    const item: Notice = {
      ...data,
      id: `notice-${Date.now()}`
    };
    mockStore.notices.push(item);
    mockStore.notify();
    return { ...item };
  },

  async update(id: string, patch: Partial<Notice>): Promise<Notice> {
    await mockStore.delay();
    const index = mockStore.notices.findIndex((n) => n.id === id);
    if (index === -1) throw new Error('Notice not found');
    mockStore.notices[index] = { ...mockStore.notices[index], ...patch };
    mockStore.notify();
    return { ...mockStore.notices[index] };
  },

  async remove(id: string): Promise<void> {
    await mockStore.delay();
    mockStore.notices = mockStore.notices.filter((n) => n.id !== id);
    mockStore.notify();
  }
};
