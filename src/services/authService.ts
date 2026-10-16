import { supabase, isSupabaseConfigured } from './supabaseClient.ts';
import type { AuthSession } from '../types/index.ts';
import { throwIfSupabaseError } from './serviceHelpers.ts';

function noSession(): AuthSession {
  return { user: null };
}

async function adminSessionFor(user: { id: string; email?: string }): Promise<AuthSession> {
  if (!supabase) return noSession();
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  throwIfSupabaseError(error);
  if (profile?.role !== 'admin') {
    await supabase.auth.signOut();
    throw new Error('This account is not authorized to access the hostel admin panel.');
  }
  return { user: { id: user.id, email: user.email ?? '', role: 'admin' } };
}

export const authService = {
  async getSession(): Promise<AuthSession> {
    if (!supabase) return noSession();
    const { data, error } = await supabase.auth.getSession();
    throwIfSupabaseError(error);
    const user = data.session?.user;
    if (!user) return noSession();
    try {
      return await adminSessionFor({ id: user.id, email: user.email });
    } catch {
      await supabase.auth.signOut();
      return noSession();
    }
  },

  async login(email: string, password?: string): Promise<AuthSession> {
    if (!isSupabaseConfigured || !supabase) {
      throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY before admin login.');
    }
    if (!email || !email.includes('@')) throw new Error('Please enter a valid admin email address.');
    if (!password) throw new Error('Please enter your password.');
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Login did not return a user.');
    try {
      return await adminSessionFor({ id: data.user.id, email: data.user.email });
    } catch (error) {
      await supabase.auth.signOut();
      throw error;
    }
  },

  async logout(): Promise<void> {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    throwIfSupabaseError(error);
  },

  async requestPasswordReset(email: string): Promise<void> {
    if (!supabase) throw new Error('Supabase is not configured.');
    if (!email || !email.includes('@')) throw new Error('Please enter a valid admin email address first.');
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + '/admin/reset-password'
    });
    throwIfSupabaseError(error);
  },

  async updatePassword(password: string): Promise<void> {
    if (!supabase) throw new Error('Supabase is not configured.');
    if (password.length < 10) throw new Error('Password must be at least 10 characters long.');
    const { error } = await supabase.auth.updateUser({ password });
    throwIfSupabaseError(error);
  }
};
