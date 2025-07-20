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
    items: ['Rice (Basmati)', 'Rice (Jasmine)', 'Wheat Flour', 'Quinoa', 'Oats', 'Barley'],
    color: 'grocery-orange'
  },
  {
    name: 'Pulses',
    items: ['Toor Dal', 'Chana Dal', 'Moong Dal', 'Masoor Dal', 'Urad Dal', 'Rajma', 'Chickpeas'],
    color: 'grocery-green'
  },
  {
    name: 'Vegetables',
    items: ['Onions', 'Tomatoes', 'Potatoes', 'Carrots', 'Spinach', 'Cauliflower', 'Broccoli'],
    color: 'grocery-green'
  },
  {
    name: 'Fruits',
    items: ['Apples', 'Bananas', 'Oranges', 'Mangoes', 'Grapes', 'Strawberries', 'Lemons'],
    color: 'grocery-orange'
  },
  {
    name: 'Dairy',
    items: ['Milk', 'Yogurt', 'Cheese', 'Butter', 'Cream', 'Paneer'],
    color: 'grocery-blue'
  },
  {
    name: 'Spices',
    items: ['Turmeric', 'Cumin', 'Coriander', 'Red Chili', 'Garam Masala', 'Cardamom', 'Cinnamon'],
    color: 'grocery-purple'
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
      <Card className="border-border bg-card shadow-lg">
        <CardHeader className="bg-primary rounded-t-lg">
          <CardTitle className="text-lg text-primary-foreground flex items-center gap-2">
            Browse by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div>
            <label className="text-sm font-medium mb-2 block text-primary">Select a Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-border hover:border-primary transition-colors">
                <SelectValue placeholder="Choose a category..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-xl z-50 rounded-lg">
                {allCategoryNames.map((categoryName) => (
                  <SelectItem key={categoryName} value={categoryName} className="hover:bg-accent">
                    {categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCategoryData && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <h3 className="font-semibold mb-4 text-primary">
                Items in {selectedCategory} ({selectedCategoryData.items.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {selectedCategoryData.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-4 border-2 border-border bg-muted/30 rounded-xl hover:border-primary/40 hover:shadow-md transition-all duration-200"
                  >
                    <span className="text-sm font-medium">{item}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAddItem(item)}
                      className="ml-2 bg-primary hover:bg-primary/80 text-primary-foreground border-0 shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!selectedCategory && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-medium">Select a category above to browse available items</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cart View Section - Using original first tab design */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-primary border-b pb-2">
          Your Cart
        </h2>
        <GroceryList />
      </div>
    </div>
  );
};

export default BrowseByCategoryTab;