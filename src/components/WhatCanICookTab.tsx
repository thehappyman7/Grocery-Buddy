import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIIngredientsSelector from './AIIngredientsSelector';
import AIRecipeSuggestions from './AIRecipeSuggestions';
import DishAnalyzer from './DishAnalyzer';
import QuickMealsTab from './QuickMealsTab';
import TrendingRecipesTab from './TrendingRecipesTab';
import SeasonalSpecialsTab from './SeasonalSpecialsTab';
import { useGrocery } from '@/context/GroceryContext';
import { usePreferences } from '@/context/PreferencesContext';
import { ShoppingCart, ChefHat } from 'lucide-react';

const WhatCanICookTab: React.FC = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const { groceryItems } = useGrocery();
  const { preferences } = usePreferences();
  
  const isVegetarian = preferences?.isVegetarian || false;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">AI Chef Mode</h2>
        <p className="text-muted-foreground">
          Build recipes from your ingredients or analyze dishes for complete ingredient lists
        </p>
      </div>
      
      <Tabs defaultValue="ingredients" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ingredients" className="flex items-center gap-1 text-xs">
            <ShoppingCart className="h-3 w-3" />
            My Ingredients
          </TabsTrigger>
          <TabsTrigger value="quick" className="flex items-center gap-1 text-xs">
            ⚡
            Quick Meals
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-1 text-xs">
            🔥
            Trending
          </TabsTrigger>
          <TabsTrigger value="seasonal" className="flex items-center gap-1 text-xs">
            🌿
            Seasonal
          </TabsTrigger>
          <TabsTrigger value="dish" className="flex items-center gap-1 text-xs">
            <ChefHat className="h-3 w-3" />
            Dish Mode
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="ingredients" className="space-y-6 mt-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Select ingredients from your grocery list to get personalized recipe suggestions
            </p>
            {groceryItems.length === 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                💡 Tip: Add ingredients to your grocery list from "Browse by Category" to quickly select them here
              </p>
            )}
          </div>
          
          <AIIngredientsSelector 
            selectedIngredients={selectedIngredients}
            onIngredientsChange={setSelectedIngredients}
          />
          
          <AIRecipeSuggestions 
            selectedIngredients={selectedIngredients} 
            isVegetarian={isVegetarian}
          />
        </TabsContent>
        
        <TabsContent value="quick" className="space-y-6 mt-6">
          <QuickMealsTab />
        </TabsContent>
        
        <TabsContent value="trending" className="space-y-6 mt-6">
          <TrendingRecipesTab />
        </TabsContent>
        
        <TabsContent value="seasonal" className="space-y-6 mt-6">
          <SeasonalSpecialsTab />
        </TabsContent>
        
        <TabsContent value="dish" className="space-y-6 mt-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              Enter a dish name to extract ingredients and recipes
            </p>
          </div>
          
          <DishAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WhatCanICookTab;