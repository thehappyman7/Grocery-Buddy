import React, { useState } from 'react';
import { useGrocery } from '@/context/GroceryContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import GroceryList from './GroceryList';

const PREDEFINED_CATEGORIES = [
  {
    name: 'Grains',
    items: ['Rice (Basmati)', 'Rice (Jasmine)', 'Wheat Flour', 'Quinoa', 'Oats', 'Barley']
  },
  {
    name: 'Pulses',
    items: ['Toor Dal', 'Chana Dal', 'Moong Dal', 'Masoor Dal', 'Urad Dal', 'Rajma', 'Chickpeas']
  },
  {
    name: 'Vegetables',
    items: ['Onions', 'Tomatoes', 'Potatoes', 'Carrots', 'Spinach', 'Cauliflower', 'Broccoli']
  },
  {
    name: 'Fruits',
    items: ['Apples', 'Bananas', 'Oranges', 'Mangoes', 'Grapes', 'Strawberries', 'Lemons']
  },
  {
    name: 'Dairy',
    items: ['Milk', 'Yogurt', 'Cheese', 'Butter', 'Cream', 'Paneer']
  },
  {
    name: 'Spices',
    items: ['Turmeric', 'Cumin', 'Coriander', 'Red Chili', 'Garam Masala', 'Cardamom', 'Cinnamon']
  }
];

const BrowseByCategoryTab = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { addItem, groceryItems } = useGrocery();

  // Get all unique categories from grocery items and predefined categories
  const existingCategories = Array.from(new Set(groceryItems.map(item => item.category)));
  const allCategoryNames = Array.from(new Set([
    ...PREDEFINED_CATEGORIES.map(cat => cat.name),
    ...existingCategories
  ]));

  // Get items for selected category
  const selectedCategoryData = selectedCategory ? PREDEFINED_CATEGORIES.find(cat => cat.name === selectedCategory) : null;

  const handleAddItem = (itemName: string) => {
    addItem(itemName, selectedCategory);
  };

  return (
    <div className="space-y-6">
      {/* Category Browser Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Browse by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select a Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a category..." />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-lg z-50">
                {allCategoryNames.map((categoryName) => (
                  <SelectItem key={categoryName} value={categoryName}>
                    {categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCategoryData && (
            <div>
              <h3 className="font-medium mb-3">
                Items in {selectedCategory} ({selectedCategoryData.items.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {selectedCategoryData.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{item}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddItem(item)}
                      className="ml-2"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!selectedCategory && (
            <div className="text-center py-8 text-muted-foreground">
              Select a category above to browse available items
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cart View Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Cart</CardTitle>
        </CardHeader>
        <CardContent>
          <GroceryList />
        </CardContent>
      </Card>
    </div>
  );
};

export default BrowseByCategoryTab;