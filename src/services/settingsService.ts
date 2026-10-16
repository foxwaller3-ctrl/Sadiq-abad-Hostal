import { mockStore } from './mockStore.ts';
import type { SiteSettings } from '../types/index.ts';

export const settingsService = {
  async get(): Promise<SiteSettings> {
    await mockStore.delay();
    return { ...mockStore.siteSettings };
  },

  async update(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    await mockStore.delay();
    mockStore.siteSettings = {
      ...mockStore.siteSettings,
      ...patch,
      updated_at: new Date().toISOString()
    };
    mockStore.notify();
    return { ...mockStore.siteSettings };
  }
};
