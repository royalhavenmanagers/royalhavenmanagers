import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  !SUPABASE_URL.includes('your-project')
);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

// Auth helper functions with fallback support
export const authApi = {
  signIn: async (email, password) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });
      if (error) throw error;
      return data;
    }
    throw new Error('Supabase client is not configured.');
  },

  signOut: async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    }
  },

  resetPassword: async (email) => {
    if (supabase) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/portal#reset-password`
      });
      if (error) throw error;
      return data;
    }
    throw new Error('Supabase client is not configured.');
  },

  updatePassword: async (newPassword) => {
    if (supabase) {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return data;
    }
    throw new Error('Supabase client is not configured.');
  },

  getCurrentSession: async () => {
    if (supabase) {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    }
    return null;
  }
};
