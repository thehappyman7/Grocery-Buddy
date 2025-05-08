
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authUtils';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = user !== null;

  // Check for active session on load
  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error fetching session:', error);
        return;
      }
      
      if (data?.session) {
        const userData = data.session.user;
        setUser({
          id: userData.id,
          name: userData.user_metadata?.full_name || userData.email?.split('@')[0] || 'User',
          email: userData.email || '',
          avatar: userData.user_metadata?.avatar_url || 
                 `https://ui-avatars.com/api/?name=${userData.email?.split('@')[0]}&background=9b87f5&color=fff`
        });
      }
    };
    
    checkSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        const userData = session.user;
        setUser({
          id: userData.id,
          name: userData.user_metadata?.full_name || userData.email?.split('@')[0] || 'User',
          email: userData.email || '',
          avatar: userData.user_metadata?.avatar_url || 
                 `https://ui-avatars.com/api/?name=${userData.email?.split('@')[0]}&background=9b87f5&color=fff`
        });
        toast.success('Successfully logged in!');
      }
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        toast.info('You have been logged out');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string) => {
    try {
      // Clean up existing auth state before login
      cleanupAuthState();
      
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Check your email for the login link!');
    } catch (error) {
      console.error('Error logging in:', error);
      toast.error('Failed to log in. Please try again.');
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Clean up existing auth state before login
      cleanupAuthState();
      
      // Attempt global sign out first to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
        console.log('Sign out before Google login failed:', err);
      }

      // Use the exact origin for redirect
      const redirectUrl = window.location.origin;
      console.log("Using redirect URL:", redirectUrl);

      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account' // Force account selection prompt
          }
        }
      });
      
      if (error) {
        console.error('Google auth error details:', error);
        throw error;
      }
      
      console.log("Google Auth Response:", data);
    } catch (error: any) {
      console.error('Error logging in with Google:', error);
      toast.error(error?.message || 'Failed to log in with Google. Please try again.');
    }
  };

  const logout = async () => {
    try {
      // Clean up existing auth state before logout
      cleanupAuthState();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loginWithGoogle
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
