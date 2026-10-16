import { mockStore } from './mockStore.ts';
import type { Facility } from '../types/index.ts';

export const facilitiesService = {
  async getPublished(): Promise<Facility[]> {
    await mockStore.delay();
    return mockStore.facilities
      .filter((f) => f.is_published)
      .sort((a, b) => a.sort_order - b.sort_order);
  },

  async getAll(): Promise<Facility[]> {
    await mockStore.delay();
    return [...mockStore.facilities].sort((a, b) => a.sort_order - b.sort_order);
  },

  async create(data: Omit<Facility, 'id'>): Promise<Facility> {
    await mockStore.delay();
    const newFacility: Facility = {
      ...data,
      id: `fac-${Date.now()}`
    };
    mockStore.facilities.push(newFacility);
    mockStore.notify();
    return { ...newFacility };
  },

  async update(id: string, patch: Partial<Facility>): Promise<Facility> {
    await mockStore.delay();
    const index = mockStore.facilities.findIndex((f) => f.id === id);
    if (index === -1) throw new Error('Facility not found');
    mockStore.facilities[index] = { ...mockStore.facilities[index], ...patch };
    mockStore.notify();
    return { ...mockStore.facilities[index] };
  },

  async remove(id: string): Promise<void> {
    await mockStore.delay();
    mockStore.facilities = mockStore.facilities.filter((f) => f.id !== id);
    mockStore.notify();
  }
};
