import { mockStore } from './mockStore.ts';
import type { HostelInfo } from '../types/index.ts';

export const hostelInfoService = {
  async get(): Promise<HostelInfo> {
    await mockStore.delay();
    return { ...mockStore.hostelInfo };
  },

  async update(patch: Partial<HostelInfo>): Promise<HostelInfo> {
    await mockStore.delay();
    mockStore.hostelInfo = {
      ...mockStore.hostelInfo,
      ...patch,
      updated_at: new Date().toISOString()
    };
    mockStore.notify();
    return { ...mockStore.hostelInfo };
  }
};
