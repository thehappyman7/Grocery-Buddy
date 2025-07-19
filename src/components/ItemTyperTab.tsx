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
          className="border-grocery-purple text-grocery-purple hover:bg-grocery-purple-light flex items-center gap-2"
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
      <GroceryList />
    </div>
  );
};

export default ItemTyperTab;