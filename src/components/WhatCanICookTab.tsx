import React, { useState } from 'react';
import AIIngredientsSelector from './AIIngredientsSelector';
import AIRecipeSuggestions from './AIRecipeSuggestions';

const WhatCanICookTab: React.FC = () => {
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">AI Chef Mode</h2>
        <p className="text-muted-foreground">
          Select ingredients and get personalized recipe suggestions powered by our comprehensive database
        </p>
      </div>
      
      <AIIngredientsSelector 
        selectedIngredients={selectedIngredients}
        onIngredientsChange={setSelectedIngredients}
      />
      
      <AIRecipeSuggestions selectedIngredients={selectedIngredients} />
    </div>
  );
};

export default WhatCanICookTab;