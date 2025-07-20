import React, { useState } from 'react';
import AddGroceryForm from '@/components/AddGroceryForm';
import GroceryList from '@/components/GroceryList';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

const ItemTyperTab = () => {
  const [showAddForm, setShowAddForm] = useState(true);

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  return (
    <div className="space-y-6">
      <style>
        {`
        @keyframes highlight {
          0% { background-color: rgba(155, 135, 245, 0.1); }
          50% { background-color: rgba(155, 135, 245, 0.3); }
          100% { background-color: rgba(155, 135, 245, 0.1); }
        }
        .highlight-form {
          animation: highlight 1s ease-in-out;
        }
        `}
      </style>
      
      <div className="flex justify-end">
        <Button
          onClick={toggleAddForm}
          variant="outline"
          size="sm"
          className="bg-gradient-to-r from-primary to-primary text-white border-0 hover:from-primary/80 hover:to-primary/80 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
        >
          {showAddForm ? (
            <>
              <X className="h-4 w-4" /> Hide Add Item
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" /> Show Add Item
            </>
          )}
        </Button>
      </div>
      
      {showAddForm && <AddGroceryForm />}
      
      {/* Cart View Section - Original design */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
          Your Cart
        </h2>
        <GroceryList />
      </div>
    </div>
  );
};

export default ItemTyperTab;