import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface UserPreferences {
  country: string;
  cuisines: string[];
  isVegetarian: boolean;
  budget?: number;
  defaultStoreLocation?: string;
  favoriteCategories?: string[];
}

interface PreferencesContextType {
  preferences: UserPreferences | null;
  setPreferences: (preferences: UserPreferences) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  isPreferencesSet: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  const [preferences, setPreferencesState] = useState<UserPreferences | null>(() => {
    const savedPreferences = localStorage.getItem('groceryBuddyPreferences');
    if (savedPreferences) {
      try {
        return JSON.parse(savedPreferences);
      } catch (error) {
        console.error("Error parsing preferences from localStorage:", error);
        return null;
      }
    }
    return null;
  });

  // Save to localStorage and sync to cloud when preferences change
  useEffect(() => {
    if (preferences) {
      localStorage.setItem('groceryBuddyPreferences', JSON.stringify(preferences));
      
      if (isAuthenticated && user && navigator.onLine) {
        syncToCloud();
      }
    }
  }, [preferences, isAuthenticated, user]);

  // Load from cloud when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFromCloud();
    }
  }, [isAuthenticated, user]);

  const syncToCloud = async () => {
    if (!user || !preferences) return;

    try {
      // Store preferences in the profiles table as JSONB
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: user.name,
          preferences: preferences
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Preferences sync error:', error);
      }
    } catch (error) {
      console.error('Preferences cloud sync failed:', error);
    }
  };

  const loadFromCloud = async () => {
    if (!user || !isAuthenticated) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('preferences')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.preferences) {
        const cloudPreferences = data.preferences as UserPreferences;
        setPreferencesState(cloudPreferences);
        localStorage.setItem('groceryBuddyPreferences', JSON.stringify(cloudPreferences));
      }
    } catch (error) {
      console.error('Failed to load preferences from cloud:', error);
    }
  };

  const setPreferences = (newPreferences: UserPreferences) => {
    setPreferencesState(newPreferences);
    toast.success('Preferences saved successfully!');
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    if (preferences) {
      const updatedPreferences = { ...preferences, ...updates };
      setPreferencesState(updatedPreferences);
      toast.success('Preferences updated!');
    }
  };

  const isPreferencesSet = preferences !== null;

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        setPreferences,
        updatePreferences,
        isPreferencesSet
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};