
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useDeviceId } from '@/hooks/useDeviceId';

// Define the grocery item type
export interface GroceryItem {
  id: number;
  name: string;
  category: string;
  selected: boolean;
  quantity: string;
  price: number;
}

// Generate consistent price based on item name (same item = same price)
const generateConsistentPrice = (itemName: string): number => {
  let hash = 0;
  for (let i = 0; i < itemName.length; i++) {
    hash = ((hash << 5) - hash) + itemName.charCodeAt(i);
    hash = hash & hash;
  }
  // Generate price between $2-12 based on hash
  const price = 2 + (Math.abs(hash) % 1000) / 100;
  return Math.round(price * 100) / 100;
}

// Initial empty grocery items array
const initialGroceryItems: GroceryItem[] = [];

interface GroceryContextType {
  groceryItems: GroceryItem[];
  toggleItemSelection: (id: number) => void;
  updateQuantity: (id: number, quantity: string) => void;
  selectedItemsCount: number;
  clearAllSelections: () => void;
  addItem: (name: string, category: string) => void;
  deleteItem: (id: number) => void;
  allItemsSelected: boolean;
  removeItemsByCategory: (category: string) => void;
  deleteAllItems: () => void;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export const GroceryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const deviceId = useDeviceId();
  
  // Load items from localStorage on initial render
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(() => {
    // Try to get the items from localStorage
    const savedItems = localStorage.getItem('groceryItems');
    // If there are items saved in localStorage, parse and return them
    if (savedItems) {
      try {
        const parsedItems = JSON.parse(savedItems);
        // No longer filtering out any categories
        return parsedItems;
      } catch (error) {
        return initialGroceryItems;
      }
    }
    // Otherwise return the initial empty array
    return initialGroceryItems;
  });

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('groceryItems', JSON.stringify(groceryItems));
    
    // Sync to cloud if authenticated and online
    if (isAuthenticated && user && deviceId && navigator.onLine) {
      syncToCloud();
    }
  }, [groceryItems, isAuthenticated, user, deviceId]);

  // Listen for real-time changes from other devices
  useEffect(() => {
    const handleGroceryItemsChanged = () => {
      loadFromCloud();
    };

    window.addEventListener('groceryItemsChanged', handleGroceryItemsChanged);
    return () => window.removeEventListener('groceryItemsChanged', handleGroceryItemsChanged);
  }, []);

  const syncToCloud = async () => {
    if (!user || !deviceId) return;

    try {
      // Simple sync: just ensure all local items exist in cloud
      for (const item of groceryItems) {
        const { error } = await supabase
          .from('grocery_items')
          .upsert({
            user_id: user.id,
            name: item.name,
            category: item.category,
            selected: item.selected,
            quantity: item.quantity || '',
            price: item.price,
            local_id: item.id,
            device_id: deviceId,
            is_deleted: false
          }, {
            onConflict: 'user_id,local_id'
          });

        if (error) {
          console.error('Sync error:', error);
        }
      }
    } catch (error) {
      console.error('Cloud sync failed:', error);
    }
  };

  const loadFromCloud = async () => {
    if (!user || !isAuthenticated) return;

    try {
      const { data, error } = await supabase
        .from('grocery_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false);

      if (error) throw error;

      if (data && data.length > 0) {
        const cloudItems: GroceryItem[] = data.map(item => ({
          id: item.local_id || parseInt(item.id) || 0,
          name: item.name,
          category: item.category,
          selected: item.selected,
          quantity: item.quantity || '',
          price: item.price || generateConsistentPrice(item.name)
        }));

        setGroceryItems(cloudItems);
      }
    } catch (error) {
      // Silent error handling
    }
  };

  // Load from cloud when user logs in, reset when logged out
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFromCloud();
    } else if (!isAuthenticated) {
      // Clear grocery items when user logs out
      setGroceryItems([]);
    }
  }, [isAuthenticated, user]);

  const toggleItemSelection = (id: number) => {
    setGroceryItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const updateQuantity = (id: number, quantity: string) => {
    setGroceryItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearAllSelections = () => {
    setGroceryItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: false, quantity: '' }))
    );
    toast.success('All selections cleared!');
  };

  const addItem = (name: string, category: string) => {
    // Check for duplicates
    const existingItem = groceryItems.find(item => 
      item.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingItem) {
      toast.info(`${name} is already in your grocery list!`);
      return;
    }
    
    // Allow adding items from any category
    const newId = groceryItems.length > 0 ? Math.max(...groceryItems.map(item => item.id)) + 1 : 1;
    const newItem = {
      id: newId,
      name,
      category,
      selected: false,
      quantity: '',
      price: generateConsistentPrice(name)
    };
    
    setGroceryItems(prevItems => [...prevItems, newItem]);
    toast.success(`${name} added to your grocery list!`);
  };

  const removeItemsByCategory = (category: string) => {
    const previousCount = groceryItems.filter(item => item.category.toLowerCase() === category.toLowerCase()).length;
    
    if (previousCount === 0) {
      toast.info(`No items found with category "${category}"`);
      return;
    }
    
    setGroceryItems(prevItems => 
      prevItems.filter(item => item.category.toLowerCase() !== category.toLowerCase())
    );
    
    toast.success(`Removed ${previousCount} item(s) with category "${category}"`);
  };

  const deleteItem = (id: number) => {
    const item = groceryItems.find(item => item.id === id);
    if (!item) return;
    
    setGroceryItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success(`Removed ${item.name} from your grocery list`);
  };

  const deleteAllItems = () => {
    if (groceryItems.length === 0) {
      toast.info('No items to delete');
      return;
    }
    
    const itemCount = groceryItems.length;
    setGroceryItems([]);
    toast.success(`Deleted all ${itemCount} items from your grocery list`);
  };

  const selectedItemsCount = groceryItems.filter(item => item.selected).length;
  const allItemsSelected = groceryItems.length > 0 && selectedItemsCount === groceryItems.length;

  return (
    <GroceryContext.Provider
      value={{
        groceryItems,
        toggleItemSelection,
        updateQuantity,
        selectedItemsCount,
        clearAllSelections,
        addItem,
        deleteItem,
        allItemsSelected,
        removeItemsByCategory,
        deleteAllItems
      }}
    >
      {children}
    </GroceryContext.Provider>
  );
};

export const useGrocery = () => {
  const context = useContext(GroceryContext);
  if (context === undefined) {
    throw new Error('useGrocery must be used within a GroceryProvider');
  }
  return context;
};
