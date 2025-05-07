
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'sonner';

// Define the grocery item type
export interface GroceryItem {
  id: number;
  name: string;
  category: string;
  selected: boolean;
  quantity: string;
}

// Sample grocery items (to be replaced later)
const sampleGroceryItems: GroceryItem[] = [
  { id: 1, name: 'Milk', category: 'Dairy', selected: false, quantity: '' },
  { id: 2, name: 'Eggs', category: 'Dairy', selected: false, quantity: '' },
  { id: 3, name: 'Bread', category: 'Bakery', selected: false, quantity: '' },
  { id: 4, name: 'Apples', category: 'Fruits', selected: false, quantity: '' },
  { id: 5, name: 'Bananas', category: 'Fruits', selected: false, quantity: '' },
  { id: 6, name: 'Chicken', category: 'Meat', selected: false, quantity: '' },
  { id: 7, name: 'Rice', category: 'Grains', selected: false, quantity: '' },
  { id: 8, name: 'Pasta', category: 'Grains', selected: false, quantity: '' },
  { id: 9, name: 'Tomatoes', category: 'Vegetables', selected: false, quantity: '' },
  { id: 10, name: 'Onions', category: 'Vegetables', selected: false, quantity: '' },
];

interface GroceryContextType {
  groceryItems: GroceryItem[];
  toggleItemSelection: (id: number) => void;
  updateQuantity: (id: number, quantity: string) => void;
  selectedItemsCount: number;
  clearAllSelections: () => void;
}

const GroceryContext = createContext<GroceryContextType | undefined>(undefined);

export const GroceryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>(sampleGroceryItems);

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

  const selectedItemsCount = groceryItems.filter(item => item.selected).length;

  return (
    <GroceryContext.Provider
      value={{
        groceryItems,
        toggleItemSelection,
        updateQuantity,
        selectedItemsCount,
        clearAllSelections
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
