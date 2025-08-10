import React, { useState, useEffect } from 'react';
import AIIngredientsSelector from './AIIngredientsSelector';
import AIRecipeSuggestions from './AIRecipeSuggestions';
import { useGrocery } from '@/context/GroceryContext';

const WhatCanICookTab: React.FC = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [isVegetarian, setIsVegetarian] = useState<boolean>(false);
  const { groceryItems } = useGrocery();

  // Load vegetarian preference from localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('groceryBuddyPreferences');
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);
      setIsVegetarian(preferences.isVegetarian || false);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">AI Chef Mode</h2>
        <p className="text-muted-foreground">
          Select ingredients from your grocery list or database to get personalized recipe suggestions
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
    </div>
  );
};

export default WhatCanICookTab;