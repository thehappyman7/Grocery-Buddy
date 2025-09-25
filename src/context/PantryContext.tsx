import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useDeviceId } from '@/hooks/useDeviceId';

export interface PantryItem {
  id: number;
  name: string;
  category: string;
  quantity: string;
  expiryDate?: string;
}

interface PantryContextType {
  pantryItems: PantryItem[];
  addItem: (name: string, category: string, quantity: string, expiryDate?: string) => void;
  updateItem: (id: number, updates: Partial<PantryItem>) => void;
  removeItem: (id: number) => void;
  clearAll: () => void;
}

const PantryContext = createContext<PantryContextType | undefined>(undefined);

export const PantryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const deviceId = useDeviceId();
  
  const [pantryItems, setPantryItems] = useState<PantryItem[]>(() => {
    const savedItems = localStorage.getItem('pantryItems');
    if (savedItems) {
      try {
        return JSON.parse(savedItems);
      } catch (error) {
        console.error("Error parsing pantry items from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage and sync to cloud when items change
  useEffect(() => {
    localStorage.setItem('pantryItems', JSON.stringify(pantryItems));
    
    if (isAuthenticated && user && deviceId && navigator.onLine) {
      syncToCloud();
    }
  }, [pantryItems, isAuthenticated, user, deviceId]);

  // Listen for real-time changes
  useEffect(() => {
    const handlePantryItemsChanged = () => {
      loadFromCloud();
    };

    window.addEventListener('pantryItemsChanged', handlePantryItemsChanged);
    return () => window.removeEventListener('pantryItemsChanged', handlePantryItemsChanged);
  }, []);

  // Load from cloud when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFromCloud();
    }
  }, [isAuthenticated, user]);

  const syncToCloud = async () => {
    if (!user || !deviceId) return;

    try {
      for (const item of pantryItems) {
        const { error } = await supabase
          .from('pantry_items')
          .upsert({
            user_id: user.id,
            name: item.name,
            category: item.category,
            quantity: item.quantity || '',
            expiry_date: item.expiryDate || null,
            device_id: deviceId,
            is_deleted: false
          }, {
            onConflict: 'user_id,name,category'
          });

        if (error) {
          console.error('Pantry sync error:', error);
        }
      }
    } catch (error) {
      console.error('Pantry cloud sync failed:', error);
    }
  };

  const loadFromCloud = async () => {
    if (!user || !isAuthenticated) return;

    try {
      const { data, error } = await supabase
        .from('pantry_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false);

      if (error) throw error;

      if (data && data.length > 0) {
        const cloudItems: PantryItem[] = data.map((item, index) => ({
          id: index + 1,
          name: item.name,
          category: item.category,
          quantity: item.quantity || '',
          expiryDate: item.expiry_date || undefined
        }));

        setPantryItems(cloudItems);
      }
    } catch (error) {
      console.error('Failed to load pantry from cloud:', error);
    }
  };

  const addItem = (name: string, category: string, quantity: string, expiryDate?: string) => {
    const newId = pantryItems.length > 0 ? Math.max(...pantryItems.map(item => item.id)) + 1 : 1;
    const newItem: PantryItem = {
      id: newId,
      name,
      category,
      quantity,
      expiryDate
    };
    
    setPantryItems(prev => [...prev, newItem]);
    toast.success(`${name} added to pantry!`);
  };

  const updateItem = (id: number, updates: Partial<PantryItem>) => {
    setPantryItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const removeItem = (id: number) => {
    const item = pantryItems.find(item => item.id === id);
    setPantryItems(prev => prev.filter(item => item.id !== id));
    if (item) {
      toast.success(`${item.name} removed from pantry`);
    }
  };

  const clearAll = () => {
    const itemCount = pantryItems.length;
    setPantryItems([]);
    toast.success(`Cleared ${itemCount} items from pantry`);
  };

  return (
    <PantryContext.Provider
      value={{
        pantryItems,
        addItem,
        updateItem,
        removeItem,
        clearAll
      }}
    >
      {children}
    </PantryContext.Provider>
  );
};

export const usePantry = () => {
  const context = useContext(PantryContext);
  if (context === undefined) {
    throw new Error('usePantry must be used within a PantryProvider');
  }
  return context;
};