import React, { useState, useEffect } from 'react';
import { useGrocery } from '@/context/GroceryContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2, Settings } from 'lucide-react';
import { ingredientDatabase, findIngredientMatches } from '@/data/ingredientDatabase';
import { supabase } from '@/integrations/supabase/client';

interface DynamicCategory {
  name: string;
  description: string;
  color: string;
}

interface DynamicCategoryBrowserProps {
  country: string;
  cuisines: string[];
  onChangePreferences: () => void;
}

const DynamicCategoryBrowser: React.FC<DynamicCategoryBrowserProps> = ({ 
  country, 
  cuisines, 
  onChangePreferences 
}) => {
  const [categories, setCategories] = useState<DynamicCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryItems, setCategoryItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useGrocery();

  useEffect(() => {
    generateCategories();
  }, [country, cuisines]);

  useEffect(() => {
    if (selectedCategory) {
      generateCategoryItems(selectedCategory);
    } else {
      setCategoryItems([]);
    }
  }, [selectedCategory]);

  const generateCategories = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('generate-categories', {
        body: { country, cuisines }
      });

      if (error) throw error;

      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error generating categories:', error);
      // Fallback categories if AI fails
      setCategories([
        { name: 'Staples & Grains', description: 'Essential grains and basic ingredients', color: 'grocery-orange' },
        { name: 'Vegetables & Herbs', description: 'Fresh vegetables and herbs', color: 'grocery-green' },
        { name: 'Spices & Seasonings', description: 'Spices and flavor enhancers', color: 'grocery-purple' },
        { name: 'Dairy & Proteins', description: 'Dairy products and protein sources', color: 'grocery-blue' },
        { name: 'Specialty Items', description: 'Regional and specialty ingredients', color: 'grocery-red' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateCategoryItems = async (categoryName: string) => {
    try {
      // Get relevant ingredients from database based on category name and user preferences
      const relevantIngredients = ingredientDatabase.filter(ingredient => {
        const categoryLower = categoryName.toLowerCase();
        const ingredientCategory = ingredient.category.toLowerCase();
        const ingredientName = ingredient.name.toLowerCase();
        
        // Check if ingredient fits the category
        const categoryMatch = 
          categoryLower.includes(ingredientCategory) ||
          ingredientCategory.includes(categoryLower.split(' ')[0]) ||
          (categoryLower.includes('staple') && ['grains', 'pulses'].includes(ingredientCategory)) ||
          (categoryLower.includes('vegetable') && ['vegetables', 'herbs'].includes(ingredientCategory)) ||
          (categoryLower.includes('spice') && ['spices', 'herbs', 'seasonings'].includes(ingredientCategory)) ||
          (categoryLower.includes('dairy') && ['dairy', 'protein'].includes(ingredientCategory)) ||
          (categoryLower.includes('protein') && ['protein', 'dairy'].includes(ingredientCategory));

        // Check if ingredient fits user's cuisine preferences
        const cuisineMatch = cuisines.some(cuisine => {
          if (cuisine === 'Indian' && ingredient.origin === 'Indian') return true;
          if (cuisine !== 'Indian' && ingredient.origin !== 'Indian') return true;
          if (ingredient.origin === 'Universal') return true;
          return false;
        });

        return categoryMatch && cuisineMatch;
      });

      // Limit to 12-15 items per category and capitalize names
      const items = relevantIngredients
        .slice(0, 15)
        .map(ingredient => 
          ingredient.name.charAt(0).toUpperCase() + ingredient.name.slice(1)
        );

      setCategoryItems(items);
    } catch (error) {
      console.error('Error generating category items:', error);
      setCategoryItems([]);
    }
  };

  const handleAddItem = (itemName: string) => {
    addItem(itemName, selectedCategory);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Generating categories for {country} and {cuisines.join(', ')} cuisine...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card shadow-lg">
        <CardHeader className="bg-primary rounded-t-lg">
          <CardTitle className="text-lg text-primary-foreground flex items-center justify-between">
            <span>Browse by Category</span>
            <Button
              variant="secondary"
              size="sm"
              onClick={onChangePreferences}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Settings className="h-4 w-4 mr-1" />
              Change Preferences
            </Button>
          </CardTitle>
          <p className="text-sm text-primary-foreground/80">
            Categories for {country} • {cuisines.join(', ')} cuisine
          </p>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div>
            <label className="text-sm font-medium mb-2 block text-primary">Select a Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="border-border hover:border-primary transition-colors">
                <SelectValue placeholder="Choose a category..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-xl z-50 rounded-lg">
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name} className="hover:bg-accent">
                    <div>
                      <div className="font-medium">{category.name}</div>
                      <div className="text-xs text-muted-foreground">{category.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCategory && categoryItems.length > 0 && (
            <div className="animate-in slide-in-from-top-4 duration-300">
              <h3 className="font-semibold mb-4 text-primary">
                Items in {selectedCategory} ({categoryItems.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                {categoryItems.map((item) => (
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

          {selectedCategory && categoryItems.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p className="font-medium">No items found for this category</p>
              <p className="text-sm">Try selecting a different category</p>
            </div>
          )}

          {!selectedCategory && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="font-medium">Select a category above to browse available items</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DynamicCategoryBrowser;