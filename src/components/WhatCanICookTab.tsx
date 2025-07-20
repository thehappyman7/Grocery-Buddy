import React from 'react';
import { useGrocery } from '@/context/GroceryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface Recipe {
  name: string;
  ingredients: string[];
}

const recipes: Recipe[] = [
  {
    name: "Pasta",
    ingredients: ["Pasta", "Tomatoes", "Onions", "Garlic", "Olive Oil", "Cheese"]
  },
  {
    name: "Omelette",
    ingredients: ["Eggs", "Milk", "Butter", "Salt", "Pepper"]
  },
  {
    name: "Garden Salad",
    ingredients: ["Lettuce", "Tomatoes", "Cucumbers", "Carrots", "Olive Oil"]
  },
  {
    name: "Fried Rice",
    ingredients: ["Rice", "Eggs", "Soy Sauce", "Vegetables", "Oil"]
  },
  {
    name: "Chicken Sandwich",
    ingredients: ["Bread", "Chicken", "Lettuce", "Tomatoes", "Mayonnaise"]
  },
  {
    name: "Vegetable Soup",
    ingredients: ["Broth", "Carrots", "Onions", "Celery", "Potatoes"]
  },
  {
    name: "Pancakes",
    ingredients: ["Flour", "Eggs", "Milk", "Sugar", "Butter"]
  },
  {
    name: "Grilled Cheese",
    ingredients: ["Bread", "Cheese", "Butter"]
  }
];

const WhatCanICookTab: React.FC = () => {
  const { groceryItems } = useGrocery();
  
  // Get all grocery item names (normalize to lowercase for comparison)
  const availableIngredients = groceryItems.map(item => item.name.toLowerCase());
  
  // Calculate recipe matches
  const recipeAnalysis = recipes.map(recipe => {
    const requiredIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
    const availableFromRecipe = requiredIngredients.filter(ingredient => 
      availableIngredients.some(available => 
        available.includes(ingredient) || ingredient.includes(available)
      )
    );
    const missingFromRecipe = requiredIngredients.filter(ingredient => 
      !availableIngredients.some(available => 
        available.includes(ingredient) || ingredient.includes(available)
      )
    );
    
    return {
      ...recipe,
      availableIngredients: availableFromRecipe,
      missingIngredients: missingFromRecipe,
      matchPercentage: (availableFromRecipe.length / requiredIngredients.length) * 100
    };
  });
  
  // Sort by match percentage (highest first)
  const sortedRecipes = recipeAnalysis.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">What Can I Cook?</h2>
        <p className="text-muted-foreground">
          Here are recipes you can make with your current groceries
        </p>
      </div>
      
      {groceryItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Add some groceries to your list to see what you can cook!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedRecipes.map((recipe, index) => (
            <Card key={index} className="transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-foreground">{recipe.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      {Math.round(recipe.matchPercentage)}% match
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recipe.availableIngredients.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Available ingredients
                    </h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground ml-6">
                      {recipe.availableIngredients.map((ingredient, i) => (
                        <li key={i} className="capitalize">{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {recipe.missingIngredients.length > 0 && (
                  <div>
                    <h4 className="font-medium text-destructive mb-2 flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Missing ingredients
                    </h4>
                    <ul className="list-disc list-inside text-sm text-muted-foreground ml-6">
                      {recipe.missingIngredients.map((ingredient, i) => (
                        <li key={i} className="capitalize">{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {recipe.missingIngredients.length === 0 && (
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <p className="text-green-700 dark:text-green-300 font-medium text-sm">
                      🎉 You have everything needed to make this recipe!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhatCanICookTab;