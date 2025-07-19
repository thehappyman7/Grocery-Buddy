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
    icon: '🌾',
    items: ['Rice (Basmati)', 'Rice (Jasmine)', 'Wheat Flour', 'Quinoa', 'Oats', 'Barley'],
    color: 'grocery-orange'
  },
  {
    name: 'Pulses',
    icon: '🫘',
    items: ['Toor Dal', 'Chana Dal', 'Moong Dal', 'Masoor Dal', 'Urad Dal', 'Rajma', 'Chickpeas'],
    color: 'grocery-green'
  },
  {
    name: 'Vegetables',
    icon: '🥦',
    items: ['Onions', 'Tomatoes', 'Potatoes', 'Carrots', 'Spinach', 'Cauliflower', 'Broccoli'],
    color: 'grocery-green'
  },
  {
    name: 'Fruits',
    icon: '🍎',
    items: ['Apples', 'Bananas', 'Oranges', 'Mangoes', 'Grapes', 'Strawberries', 'Lemons'],
    color: 'grocery-orange'
  },
  {
    name: 'Dairy',
    icon: '🥛',
    items: ['Milk', 'Yogurt', 'Cheese', 'Butter', 'Cream', 'Paneer'],
    color: 'grocery-blue'
  },
  {
    name: 'Spices',
    icon: '🌶️',
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
      <Card className="border-grocery-blue-light bg-gradient-to-r from-grocery-blue-light/30 to-grocery-purple-light/30 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-grocery-blue to-grocery-purple rounded-t-lg">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            🔍 Browse by Category
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div>
            <label className="text-sm font-medium mb-2 block text-grocery-purple">Select a Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-grocery-blue/30 hover:border-grocery-blue transition-colors">
                <SelectValue placeholder="🛍️ Choose a category..." />
              </SelectTrigger>
              <SelectContent className="bg-white border border-grocery-blue/20 shadow-xl z-50 rounded-lg">
                {allCategoryNames.map((categoryName) => {
                  const categoryData = PREDEFINED_CATEGORIES.find(cat => cat.name === categoryName);
                  return (
                    <SelectItem key={categoryName} value={categoryName} className="hover:bg-grocery-blue-light/50">
                      <span className="flex items-center gap-2">
                        {categoryData?.icon} {categoryName}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {selectedCategoryData && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <h3 className="font-semibold mb-4 text-grocery-purple flex items-center gap-2">
                {selectedCategoryData.icon} Items in {selectedCategory} ({selectedCategoryData.items.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {selectedCategoryData.items.map((item) => (
                  <div
                    key={item}
                    className={`flex items-center justify-between p-4 border-2 border-${selectedCategoryData.color}/20 bg-${selectedCategoryData.color}-light/30 rounded-xl hover:border-${selectedCategoryData.color}/40 hover:shadow-md transition-all duration-200`}
                  >
                    <span className="text-sm font-medium">{item}</span>
                    <Button
                      size="sm"
                      onClick={() => handleAddItem(item)}
                      className={`ml-2 bg-${selectedCategoryData.color} hover:bg-${selectedCategoryData.color}/80 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200`}
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
            <div className="text-center py-12 text-grocery-blue/60">
              <div className="text-4xl mb-2">🛒</div>
              <p className="font-medium">Select a category above to browse available items</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cart View Section */}
      <Card className="border-grocery-green-light bg-gradient-to-br from-grocery-green-light/20 to-grocery-orange-light/20 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-grocery-green to-grocery-orange rounded-t-lg">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            🛒 Your Cart
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <GroceryList />
        </CardContent>
      </Card>
    </div>
  );
};

export default BrowseByCategoryTab;