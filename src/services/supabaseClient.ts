import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.ts';

// This is the project's publishable browser key, not a secret/service-role key.
// RLS is the security boundary. Build-time env vars can override these defaults.
const DEFAULT_PROJECT_URL = 'https://zyuteumppyrazhswtext.supabase.co';
const DEFAULT_PUBLISHABLE_KEY = 'sb_publishable_3pCujFpAEGY_NyJiG0E2Qg_eckjJLuP';

const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const envKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();

const projectUrl = envUrl && !envUrl.includes('YOUR_PROJECT_REF') ? envUrl : DEFAULT_PROJECT_URL;
const publishableKey = envKey && !envKey.includes('REPLACE_ME') ? envKey : DEFAULT_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(projectUrl && publishableKey);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(projectUrl, publishableKey, {
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
