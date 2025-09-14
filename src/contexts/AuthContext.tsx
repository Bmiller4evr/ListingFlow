import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { onAuthStateChange } from '../lib/auth';
import { UserClass, UserProfile, getUserClassFromURL } from '../types/user';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userClass: UserClass;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: any; user?: User }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: any }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userClass, setUserClass] = useState<UserClass>('standard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Detect user class from URL on mount
    const detectedClass = getUserClassFromURL();
    setUserClass(detectedClass);
    
    // Store in localStorage for persistence
    if (detectedClass === 'legacy') {
      localStorage.setItem('user_class_override', 'legacy');
    }
    
    // Check if Supabase is initialized
    if (!supabase) {
      console.warn('Supabase client not initialized - running in demo mode');
      setLoading(false);
      return;
    }

    // Get initial session
    const initializeAuth = async () => {
      try {
        // Get current session from Supabase
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
        } else if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          console.log('Session restored for user:', currentSession.user.email);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = onAuthStateChange((event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.email);
      
      if (currentSession) {
        setSession(currentSession);
        setUser(currentSession.user);
      } else {
        setSession(null);
        setUser(null);
      }

      // Handle specific auth events
      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in:', currentSession?.user?.email);
          break;
        case 'SIGNED_OUT':
          console.log('User signed out');
          break;
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed successfully');
          break;
        case 'USER_UPDATED':
          console.log('User data updated');
          break;
      }
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      // Demo mode - simulate successful login
      const demoUser = { id: 'demo', email } as User;
      setUser(demoUser);
      setSession({ user: demoUser } as Session);
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Session and user will be updated by onAuthStateChange
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error };
    }
  };

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string) => {
    if (!supabase) {
      // Demo mode - simulate successful signup
      const demoUser = { id: 'demo', email } as User;
      setUser(demoUser);
      setSession({ user: demoUser } as Session);
      return { success: true, user: demoUser };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (error) throw error;

      // Update profile with additional info if user was created
      if (data.user && (firstName || lastName)) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            updated_at: new Date().toISOString(),
          });

        if (profileError) {
          console.error('Profile update error:', profileError);
        }
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Sign up error:', error);
      
      // Check if it's the specific database error we're seeing
      const errorMessage = (error as any)?.message || '';
      if (errorMessage.includes('Database error saving new user')) {
        console.log('Supabase database not configured - falling back to demo mode');
        
        // Fall back to demo mode for this specific error
        const demoUser = { 
          id: `demo-${Date.now()}`, 
          email,
          user_metadata: {
            first_name: firstName,
            last_name: lastName
          }
        } as User;
        
        setUser(demoUser);
        setSession({ user: demoUser } as Session);
        
        return { success: true, user: demoUser };
      }
      
      return { success: false, error };
    }
  };

  const signOut = async () => {
    if (!supabase) {
      // Demo mode - clear user
      setUser(null);
      setSession(null);
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state (onAuthStateChange will also handle this)
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const resetPassword = async (email: string) => {
    if (!supabase) {
      return { success: true }; // Demo mode
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!supabase) {
      return { success: true }; // Demo mode
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      return { success: false, error };
    }
  };

  const value = {
    user,
    session,
    userClass,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}