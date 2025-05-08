
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';

// Define the grocery item type
export interface GroceryItem {
  id: number;
  name: string;
  category: string;
  selected: boolean;
  quantity: string;
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
  allItemsSelected: boolean;
  removeItemsByCategory: (category: string) => void;
  deleteAllItems: () => void;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export const GroceryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
        console.error("Error parsing grocery items from localStorage:", error);
        return initialGroceryItems;
      }
    }
    // Otherwise return the initial empty array
    return initialGroceryItems;
  });

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('groceryItems', JSON.stringify(groceryItems));
  }, [groceryItems]);

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
    // Allow adding items from any category
    const newId = groceryItems.length > 0 ? Math.max(...groceryItems.map(item => item.id)) + 1 : 1;
    const newItem = {
      id: newId,
      name,
      category,
      selected: false,
      quantity: ''
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
