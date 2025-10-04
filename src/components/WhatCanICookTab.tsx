import React, { useState } from 'react';
import AIIngredientsSelector from './AIIngredientsSelector';
import AIRecipeSuggestions from './AIRecipeSuggestions';
import { useGrocery } from '@/context/GroceryContext';
import { usePreferences } from '@/context/PreferencesContext';

const WhatCanICookTab: React.FC = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const { groceryItems } = useGrocery();
  const { preferences } = usePreferences();
  
  const isVegetarian = preferences?.isVegetarian || false;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">AI Chef Mode</h2>
        <p className="text-sm sm:text-base text-muted-foreground px-2">
          Get personalized recipes based on your ingredients - quick meals, seasonal favorites, and trending dishes
        </p>
      </div>
      
      <div className="text-center px-2">
        <p className="text-sm sm:text-base text-muted-foreground">
          Select ingredients from your grocery list to get personalized recipe suggestions
        </p>
        {groceryItems.length === 0 && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
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
    </div>
  );
};

export default WhatCanICookTab;