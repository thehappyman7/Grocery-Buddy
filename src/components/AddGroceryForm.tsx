
import React, { useState } from 'react';
import { useGrocery } from '@/context/GroceryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ListPlus } from 'lucide-react';

const AddGroceryForm: React.FC = () => {
  const { addItem } = useGrocery();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Item name is required');
      return;
    }
    
    if (!category.trim()) {
      setError('Category is required');
      return;
    }
    
    addItem(name, category);
    setName('');
    setCategory('');
    setError('');
  };

  return (
    <div className="bg-grocery-purple-light p-6 rounded-lg mb-8 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <ListPlus className="h-5 w-5" /> Add New Item
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="item-name">Item Name</Label>
            <Input 
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              className="border-gray-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="item-category">Category</Label>
            <Input 
              id="item-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category"
              className="border-gray-300"
            />
          </div>
        </div>
        
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
        
        <Button 
          type="submit" 
          className="bg-grocery-purple hover:bg-grocery-purple-light hover:text-grocery-purple border-grocery-purple text-white"
        >
          Add to List
        </Button>
      </form>
    </div>
  );
};

export default AddGroceryForm;
