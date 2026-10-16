import { mockStore } from './mockStore.ts';
import type { AuthSession } from '../types/index.ts';

const SESSION_STORAGE_KEY = 'hostel_admin_session';

export const authService = {
  async getSession(): Promise<AuthSession> {
    await mockStore.delay(20);
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return { user: null };
  },

  async login(email: string, password?: string): Promise<AuthSession> {
    await mockStore.delay(100);
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid admin email address.');
    }
    // Simple UI mock session for Stage A
    const session: AuthSession = {
      user: {
        id: 'admin-user-1',
        email: email.trim(),
        role: 'admin'
      }
    };
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }
    return session;
  },

  async logout(): Promise<void> {
    await mockStore.delay(20);
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
};
