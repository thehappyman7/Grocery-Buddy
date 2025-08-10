import React, { useState, useEffect } from 'react';
import AIRecipeSuggestions from './AIRecipeSuggestions';
import { useGrocery } from '@/context/GroceryContext';

const WhatCanICookTab: React.FC = () => {
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

  // Extract ingredients from grocery items
  const availableIngredients = groceryItems.map(item => item.name.toLowerCase());

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">AI Chef Mode</h2>
        <p className="text-muted-foreground">
          Get personalized recipe suggestions based on your current pantry items
        </p>
        {groceryItems.length === 0 && (
          <p className="text-sm text-muted-foreground mt-2">
            Add ingredients to your grocery list from "Browse by Category" to see recipe suggestions here
          </p>
        )}
      </div>
      
      <AIRecipeSuggestions 
        selectedIngredients={availableIngredients} 
        isVegetarian={isVegetarian}
      />
    </div>
  );
};

export default WhatCanICookTab;