import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, authApi } from '../lib/supabaseClient';

const AuthContext = createContext({});

const DEMO_OWNER_PROFILE = {
  id: 'demo-owner-uuid',
  email: 'owner@royalhaven.com.ng',
  full_name: 'Chief Babatunde Alabi',
  phone: '+234 803 444 8899',
  role: 'property_owner',
  bank_name: 'Zenith Bank PLC',
  account_number: '1014829301',
  account_name: 'Babatunde Alabi & Sons Ent.',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
};

const STORAGE_AUTH_USER = 'royalhaven_portal_current_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // 1. Check if Supabase session is active
      if (isSupabaseConfigured && supabase) {
        try {
          const session = await authApi.getCurrentSession();
          if (session?.user && mounted) {
            setUser(session.user);
            setIsDemo(false);
            // Fetch profile
            const { data: prof } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (prof && mounted) {
              setProfile(prof);
            } else if (mounted) {
              setProfile({
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || 'Valued Property Owner',
                role: session.user.user_metadata?.role || 'property_owner'
              });
            }
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Supabase session load notice:', err.message);
        }
      }

      // 2. Check local saved session (demo or offline)
      try {
        const saved = localStorage.getItem(STORAGE_AUTH_USER);
        if (saved && mounted) {
          const parsed = JSON.parse(saved);
          setUser(parsed.user);
          setProfile(parsed.profile);
          setIsDemo(Boolean(parsed.isDemo));
        }
      } catch {
        // no-op
      }

      if (mounted) setLoading(false);
    }

    initAuth();

    // Listen to Supabase auth changes
    let subscription = null;
    if (isSupabaseConfigured && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;
        if (session?.user) {
          setUser(session.user);
          setIsDemo(false);
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (prof && mounted) setProfile(prof);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          setIsDemo(false);
          localStorage.removeItem(STORAGE_AUTH_USER);
        }
      });
      subscription = data.subscription;
    }

    return () => {
      mounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    // 1. If user entered demo credentials or offline test
    if (
      normalizedEmail === 'owner@royalhaven.com.ng' || 
      password === 'demo1234' ||
      !isSupabaseConfigured
    ) {
      const mockUser = {
        id: DEMO_OWNER_PROFILE.id,
        email: normalizedEmail || DEMO_OWNER_PROFILE.email
      };
      setUser(mockUser);
      setProfile(DEMO_OWNER_PROFILE);
      setIsDemo(true);
      localStorage.setItem(
        STORAGE_AUTH_USER, 
        JSON.stringify({ user: mockUser, profile: DEMO_OWNER_PROFILE, isDemo: true })
      );
      setLoading(false);
      return { success: true, isDemo: true };
    }

    // 2. Try Supabase cloud authentication
    try {
      const data = await authApi.signIn(normalizedEmail, password);
      if (data?.user) {
        setUser(data.user);
        setIsDemo(false);
        // Fetch profile
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const activeProfile = prof || {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || 'Valued Property Owner',
          role: data.user.user_metadata?.role || 'property_owner'
        };
        setProfile(activeProfile);
        setLoading(false);
        return { success: true, isDemo: false };
      }
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message || 'Invalid credentials' };
    }
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured && !isDemo) {
        await authApi.signOut();
      }
    } catch {
      // no-op
    }
    setUser(null);
    setProfile(null);
    setIsDemo(false);
    localStorage.removeItem(STORAGE_AUTH_USER);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      role: profile?.role || 'property_owner',
      isAuthenticated: Boolean(user),
      isDemo,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
