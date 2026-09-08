import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://pspftbflzfkbpndvhike.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzcGZ0YmZsemZrYnBuZHZoaWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNjkzNjQsImV4cCI6MjEwMzk0NTM2NH0.OmVIINkXoqf9bnJQp9TQNfrimOnyOwskhpqIi9QnYm4';

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
  signUp: async (email, password, metadata = {}) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: metadata
        }
      });
      if (error) throw error;
      return data;
    }
    throw new Error('Supabase client is not configured.');
  },

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
