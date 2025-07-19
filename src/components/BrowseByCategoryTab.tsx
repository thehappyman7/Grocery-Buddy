import React, { useState } from 'react';
import { useGrocery } from '@/context/GroceryContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GroceryItem from './GroceryItem';

const PREDEFINED_CATEGORIES = [
  'Grains',
  'Pulses', 
  'Vegetables',
  'Fruits',
  'Dairy',
  'Spices'
];

const BrowseByCategoryTab = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { groceryItems } = useGrocery();

  // Get all unique categories from grocery items and predefined categories
  const existingCategories = Array.from(new Set(groceryItems.map(item => item.category)));
  const allCategoryNames = Array.from(new Set([
    ...PREDEFINED_CATEGORIES,
    ...existingCategories
  ]));

  // Filter items based on selected category
  const filteredItems = selectedCategory && selectedCategory !== 'all'
    ? groceryItems.filter(item => item.category === selectedCategory)
    : groceryItems;

  const clearCategoryFilter = () => {
    setSelectedCategory('all');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Browse by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Filter by Category (Optional)</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Show all items..." />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                <SelectItem value="all">All Categories</SelectItem>
                {allCategoryNames.map((categoryName) => (
                  <SelectItem key={categoryName} value={categoryName}>
                    {categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">
                {selectedCategory && selectedCategory !== 'all'
                  ? `Items in ${selectedCategory} (${filteredItems.length})`
                  : `All Items (${filteredItems.length})`
                }
              </h3>
              {selectedCategory && selectedCategory !== 'all' && (
                <button 
                  onClick={clearCategoryFilter}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Clear filter
                </button>
              )}
            </div>
            
            {filteredItems.length > 0 ? (
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredItems.map((item) => (
                  <GroceryItem key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                {selectedCategory && selectedCategory !== 'all'
                  ? `No items found in ${selectedCategory} category`
                  : "No items added yet. Add some items in the 'Add Items' tab!"
                }
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrowseByCategoryTab;