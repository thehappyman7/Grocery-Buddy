
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
  loginWithGoogle: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load user data from localStorage on initial render
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('groceryAppUser');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
        return null;
      }
    }
    return null;
  });

  const isAuthenticated = user !== null;

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('groceryAppUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('groceryAppUser');
    }
  }, [user]);

  const login = (email: string) => {
    // This is a mock implementation
    const newUser: User = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      name: email.split('@')[0],
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=9b87f5&color=fff`
    };
    
    setUser(newUser);
    toast.success('Successfully logged in!');
  };

  const loginWithGoogle = () => {
    // This is a mock implementation of Google login
    const mockGoogleUser: User = {
      id: `google-${Math.random().toString(36).substring(2, 9)}`,
      name: 'Google User',
      email: 'user@gmail.com',
      avatar: `https://ui-avatars.com/api/?name=Google+User&background=9b87f5&color=fff`
    };
    
    setUser(mockGoogleUser);
    toast.success('Successfully logged in with Google!');
  };

  const logout = () => {
    setUser(null);
    toast.info('You have been logged out');
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
