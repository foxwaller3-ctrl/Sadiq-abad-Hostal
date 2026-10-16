import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.ts';

const projectUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

export const isSupabaseConfigured = Boolean(
  projectUrl &&
  publishableKey &&
  !projectUrl.includes('YOUR_PROJECT_REF') &&
  !publishableKey.includes('REPLACE_ME')
);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(projectUrl as string, publishableKey as string, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        persistSession: true
      }
    })
  : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in the app environment, then rebuild.'
    );
  }
  return supabase;
}
