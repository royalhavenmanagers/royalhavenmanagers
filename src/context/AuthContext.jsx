import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured, authApi } from '../lib/supabaseClient';
import { portalStore } from '../data/portalStore';

const AuthContext = createContext({});

const STORAGE_AUTH_USER = 'royalhaven_portal_current_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      // 1. Check local saved session first
      try {
        const saved = localStorage.getItem(STORAGE_AUTH_USER);
        if (saved && mounted) {
          const parsed = JSON.parse(saved);
          if (parsed.user && parsed.profile) {
            if (parsed.profile.assignedProperties) {
              parsed.profile.assignedProperties = parsed.profile.assignedProperties.filter(
                p => !p.includes('Royal Crest') && !p.includes('Haven Terraces')
              );
            }
            setUser(parsed.user);
            setProfile(parsed.profile);
            setLoading(false);
            return;
          }
        }
      } catch {
        // no-op
      }

      // 2. Check if Supabase session is active
      if (isSupabaseConfigured && supabase) {
        try {
          const session = await authApi.getCurrentSession();
          if (session?.user && mounted) {
            setUser(session.user);
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
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (prof && mounted) setProfile(prof);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
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

    // 1. Verify against real registered property owners
    const registeredOwner = portalStore.validateOwnerCredentials(normalizedEmail, password);
    if (registeredOwner) {
      const activeUser = {
        id: registeredOwner.id,
        email: registeredOwner.email
      };
      const activeProfile = {
        id: registeredOwner.id,
        email: registeredOwner.email,
        full_name: registeredOwner.fullName,
        phone: registeredOwner.phone || '',
        role: 'property_owner',
        bank_name: registeredOwner.bankName || '',
        account_number: registeredOwner.accountNumber || '',
        account_name: registeredOwner.accountName || registeredOwner.fullName,
        assignedProperties: (registeredOwner.assignedProperties || []).filter(p => !p.includes('Royal Crest') && !p.includes('Haven Terraces'))
      };

      setUser(activeUser);
      setProfile(activeProfile);
      localStorage.setItem(
        STORAGE_AUTH_USER,
        JSON.stringify({ user: activeUser, profile: activeProfile })
      );
      setLoading(false);
      return { success: true };
    }

    // 2. Also try Supabase cloud authentication
    try {
      if (isSupabaseConfigured && supabase) {
        const data = await authApi.signIn(normalizedEmail, password);
        if (data?.user) {
          setUser(data.user);
          const { data: prof } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const activeProfile = prof || {
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name || 'Valued Property Owner',
            role: data.user.user_metadata?.role || 'property_owner',
            bank_name: data.user.user_metadata?.bank_name || '',
            account_number: data.user.user_metadata?.account_number || '',
            account_name: data.user.user_metadata?.account_name || '',
            assignedProperties: []
          };
          setProfile(activeProfile);
          localStorage.setItem(
            STORAGE_AUTH_USER,
            JSON.stringify({ user: data.user, profile: activeProfile })
          );
          setLoading(false);
          return { success: true };
        }
      }
    } catch (err) {
      console.warn('Supabase auth sign in notice:', err.message);
    }

    setLoading(false);
    return { 
      success: false, 
      error: 'Invalid email or password. Please verify your credentials or register a new property owner account.' 
    };
  };

  const signup = async ({ email, password, fullName, phone, bankName, accountNumber, accountName }) => {
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    // Check if account already exists
    const existing = portalStore.findOwnerByEmail(normalizedEmail);
    if (existing) {
      setLoading(false);
      return { 
        success: false, 
        error: 'An account with this email address already exists. Please sign in.' 
      };
    }

    const newOwnerId = `owner-${Date.now()}`;
    const newOwnerData = {
      id: newOwnerId,
      fullName: fullName.trim(),
      email: normalizedEmail,
      password: password,
      phone: phone || '',
      bankName: bankName || '',
      accountNumber: accountNumber || '',
      accountName: accountName || fullName.trim(),
      assignedProperties: [],
      createdDate: new Date().toISOString().split('T')[0]
    };

    // Save directly to real verified owner database
    portalStore.addOwner(newOwnerData);

    const activeUser = {
      id: newOwnerId,
      email: normalizedEmail
    };

    const activeProfile = {
      id: newOwnerId,
      email: normalizedEmail,
      full_name: fullName.trim(),
      phone: phone || '',
      role: 'property_owner',
      bank_name: bankName || '',
      account_number: accountNumber || '',
      account_name: accountName || fullName.trim(),
      assignedProperties: []
    };

    // Auto-login user immediately
    setUser(activeUser);
    setProfile(activeProfile);
    localStorage.setItem(
      STORAGE_AUTH_USER,
      JSON.stringify({ user: activeUser, profile: activeProfile })
    );

    // Sync to Supabase in the background if reachable
    if (isSupabaseConfigured && supabase) {
      authApi.signUp(normalizedEmail, password, {
        full_name: fullName.trim(),
        phone,
        role: 'property_owner',
        bank_name: bankName,
        account_number: accountNumber,
        account_name: accountName
      }).catch(err => {
        console.warn('Supabase cloud background sync notice:', err.message);
      });
    }

    setLoading(false);
    return { success: true, autoLogin: true };
  };

  const logout = async () => {
    try {
      if (isSupabaseConfigured && supabase) {
        await authApi.signOut();
      }
    } catch {
      // no-op
    }
    setUser(null);
    setProfile(null);
    localStorage.removeItem(STORAGE_AUTH_USER);
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      role: profile?.role || 'property_owner',
      isAuthenticated: Boolean(user),
      loading,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
