import React, { useState } from 'react';
import { useGrocery } from '@/context/GroceryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock } from 'lucide-react';

const PREDEFINED_CATEGORIES = ['Grains', 'Pulses', 'Vegetables', 'Fruits', 'Dairy', 'Spices'];

const AddItemsToCategoriesTab = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');
  const [itemName, setItemName] = useState<string>('');
  const [recentlyAdded, setRecentlyAdded] = useState<Array<{name: string, category: string, timestamp: number}>>([]);
  const { addItem } = useGrocery();

  const handleAddItem = () => {
    if (!itemName.trim()) return;
    
    const categoryToUse = newCategory.trim() || selectedCategory;
    if (!categoryToUse) return;

    addItem(itemName.trim(), categoryToUse);
    
    // Add to recently added list
    const newItem = {
      name: itemName.trim(),
      category: categoryToUse,
      timestamp: Date.now()
    };
    
    setRecentlyAdded(prev => [newItem, ...prev.slice(0, 4)]); // Keep only 5 recent items
    
    // Clear inputs
    setItemName('');
    setNewCategory('');
    setSelectedCategory('');
  };

  const categoryToUse = newCategory.trim() || selectedCategory;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Items to Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">Select Existing Category</label>
              <Select 
                value={selectedCategory} 
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setNewCategory(''); // Clear new category when selecting existing
                }}
                disabled={!!newCategory.trim()}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose existing category..." />
                </SelectTrigger>
                <SelectContent>
                  {PREDEFINED_CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              — OR —
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Create New Category</label>
              <Input
                placeholder="Enter new category name..."
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  if (e.target.value.trim()) {
                    setSelectedCategory(''); // Clear existing category when typing new
                  }
                }}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Item Name</label>
              <Input
                placeholder="Enter item name..."
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              />
            </div>

            <Button 
              onClick={handleAddItem}
              disabled={!itemName.trim() || !categoryToUse}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item to {categoryToUse || 'Category'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {recentlyAdded.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recently Added Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentlyAdded.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                  <span className="text-sm">{item.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AddItemsToCategoriesTab;