
import React from 'react';
import { Button } from "@/components/ui/button";
import { useGrocery } from '@/context/GroceryContext';
import { PlusCircle } from 'lucide-react';

const Header: React.FC = () => {
  const { selectedItemsCount, clearAllSelections, allItemsSelected } = useGrocery();
  
  // Function to scroll to the Add Item form
  const scrollToAddForm = () => {
    const formElement = document.getElementById('add-grocery-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
      // Add a highlight effect to the form
      formElement.classList.add('highlight-form');
      // Remove highlight after animation
      setTimeout(() => {
        formElement.classList.remove('highlight-form');
      }, 2000);
    }
  };
  
  return (
    <header className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-800">Grocery List</h1>
        <div className="flex items-center gap-3">
          {selectedItemsCount > 0 && (
            <span className="bg-grocery-purple text-white px-3 py-1 rounded-full text-sm font-medium">
              {selectedItemsCount} selected
            </span>
          )}
          {allItemsSelected && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={scrollToAddForm}
              className="border-green-500 text-green-600 hover:bg-green-50 flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" /> Add Another Item
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAllSelections}
            className="border-grocery-purple text-grocery-purple hover:bg-grocery-purple-light"
          >
            Clear All
          </Button>
        </div>
      </div>
      <p className="text-gray-500">Select items you need and add quantities for your shopping trip.</p>
    </header>
  );
};

export default Header;
