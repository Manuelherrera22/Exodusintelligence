import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const SupabaseAuthContext = createContext({});

export const useAuth = () => useContext(SupabaseAuthContext);

export const SupabaseAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const { data, error } = await supabase.auth.getSession();
      if (mounted) {
        if (error) {
          console.error('Error getting session:', error);
        }
        setSession(data.session);
        setUser(data.session?.user ?? null);
        setLoading(false);
      }
    }

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (mounted) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
        }
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUp = async (email, password, options = {}) => {
    return supabase.auth.signUp({ email, password, options });
  };

  const signOut = async () => {
    return supabase.auth.signOut();
  };

  const isProfileComplete = async (userId) => {
    if (!userId) return false;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
           // No profile exists yet, this might happen immediately after sign up
           return false;
        }
        throw error;
      }
      return !!data?.onboarding_completed;
    } catch (e) {
      console.error('Error checking profile completion:', e);
      return false;
    }
  };

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    isProfileComplete
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {!loading && children}
    </SupabaseAuthContext.Provider>
  );
};
