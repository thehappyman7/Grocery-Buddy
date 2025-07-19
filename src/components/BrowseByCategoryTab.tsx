import React, { useState } from 'react';
import { useGrocery } from '@/context/GroceryContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GroceryList from './GroceryList';

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Browse by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category..." />
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
            <GroceryList />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrowseByCategoryTab;