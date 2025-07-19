
import React, { useState } from 'react';
import { useGrocery } from '@/context/GroceryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ListPlus } from 'lucide-react';
import { toast } from 'sonner';

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
    toast.success(`${name} added to your grocery list!`);
  };

  return (
    <div id="add-grocery-form" className="bg-gradient-to-r from-grocery-purple-light/60 to-grocery-blue-light/60 p-6 rounded-xl mb-8 shadow-lg border border-grocery-purple/20 transition-all duration-300">
      <h2 className="text-xl font-semibold mb-4 text-grocery-purple flex items-center gap-2">
        <ListPlus className="h-5 w-5" /> ✨ Add New Item
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="item-name" className="text-grocery-purple font-medium">🏷️ Item Name</Label>
            <Input 
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name..."
              className="border-grocery-purple/30 focus:border-grocery-purple shadow-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="item-category" className="text-grocery-blue font-medium">📂 Category</Label>
            <Input 
              id="item-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter category..."
              className="border-grocery-blue/30 focus:border-grocery-blue shadow-sm"
            />
          </div>
        </div>
        
        {error && (
          <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{error}</p>
        )}
        
        <Button 
          type="submit" 
          className="bg-gradient-to-r from-grocery-purple to-grocery-blue hover:from-grocery-purple/80 hover:to-grocery-blue/80 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200 w-full md:w-auto"
        >
          <ListPlus className="h-4 w-4 mr-2" />
          Add to List ✨
        </Button>
      </form>
    </div>
  );
};

export default AddGroceryForm;
