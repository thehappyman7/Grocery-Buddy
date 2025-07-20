import React from 'react';
import { useGrocery } from '@/context/GroceryContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface Recipe {
  name: string;
  ingredients: string[];
}

const recipes: Recipe[] = [
  // International Dishes
  {
    name: "Pasta",
    ingredients: ["pasta", "tomatoes", "onions", "garlic", "olive oil", "cheese"]
  },
  {
    name: "Omelette",
    ingredients: ["eggs", "milk", "butter", "salt", "pepper"]
  },
  {
    name: "Garden Salad",
    ingredients: ["lettuce", "tomatoes", "cucumbers", "carrots", "olive oil"]
  },
  {
    name: "Fried Rice",
    ingredients: ["rice", "eggs", "soy sauce", "vegetables", "oil"]
  },
  {
    name: "Chicken Sandwich",
    ingredients: ["bread", "chicken", "lettuce", "tomatoes", "mayonnaise"]
  },
  {
    name: "Vegetable Soup",
    ingredients: ["broth", "carrots", "onions", "celery", "potatoes"]
  },
  {
    name: "Pancakes",
    ingredients: ["flour", "eggs", "milk", "sugar", "butter"]
  },
  {
    name: "Grilled Cheese",
    ingredients: ["bread", "cheese", "butter"]
  },
  {
    name: "Pizza Margherita",
    ingredients: ["pizza dough", "tomato sauce", "mozzarella", "basil", "olive oil"]
  },
  {
    name: "Caesar Salad",
    ingredients: ["lettuce", "parmesan", "croutons", "anchovy", "olive oil", "lemon"]
  },
  {
    name: "Avocado Toast",
    ingredients: ["bread", "avocado", "salt", "pepper", "lemon"]
  },
  {
    name: "Greek Salad",
    ingredients: ["tomatoes", "cucumbers", "olives", "feta cheese", "olive oil", "oregano"]
  },
  {
    name: "Tacos",
    ingredients: ["tortillas", "chicken", "onions", "cilantro", "lime", "cheese"]
  },
  {
    name: "Stir Fry",
    ingredients: ["vegetables", "soy sauce", "garlic", "ginger", "oil", "rice"]
  },
  
  // North Indian Dishes
  {
    name: "Dal Tadka",
    ingredients: ["dal", "turmeric", "cumin", "onions", "tomatoes", "garlic", "ginger", "ghee"]
  },
  {
    name: "Rajma (Kidney Bean Curry)",
    ingredients: ["kidney beans", "onions", "tomatoes", "ginger", "garlic", "cumin", "coriander", "garam masala"]
  },
  {
    name: "Aloo Gobi",
    ingredients: ["potatoes", "cauliflower", "onions", "turmeric", "cumin", "coriander", "ginger", "garlic"]
  },
  {
    name: "Chicken Curry",
    ingredients: ["chicken", "onions", "tomatoes", "ginger", "garlic", "turmeric", "coriander", "garam masala", "oil"]
  },
  {
    name: "Paneer Butter Masala",
    ingredients: ["paneer", "tomatoes", "cream", "butter", "onions", "ginger", "garlic", "garam masala"]
  },
  {
    name: "Chole (Chickpea Curry)",
    ingredients: ["chickpeas", "onions", "tomatoes", "ginger", "garlic", "cumin", "coriander", "garam masala"]
  },
  {
    name: "Palak Paneer",
    ingredients: ["spinach", "paneer", "onions", "tomatoes", "ginger", "garlic", "cream", "garam masala"]
  },
  {
    name: "Biryani",
    ingredients: ["rice", "chicken", "onions", "yogurt", "ginger", "garlic", "saffron", "ghee", "garam masala"]
  },
  
  // South Indian Dishes
  {
    name: "Sambar",
    ingredients: ["dal", "vegetables", "tamarind", "sambar powder", "turmeric", "curry leaves", "mustard seeds"]
  },
  {
    name: "Rasam",
    ingredients: ["dal", "tomatoes", "tamarind", "rasam powder", "curry leaves", "mustard seeds", "asafoetida"]
  },
  {
    name: "Dosa",
    ingredients: ["rice", "dal", "fenugreek seeds", "salt"]
  },
  {
    name: "Idli",
    ingredients: ["rice", "dal", "fenugreek seeds", "salt"]
  },
  {
    name: "Coconut Rice",
    ingredients: ["rice", "coconut", "curry leaves", "mustard seeds", "dal", "ginger", "green chili"]
  },
  {
    name: "Upma",
    ingredients: ["semolina", "onions", "curry leaves", "mustard seeds", "dal", "ginger", "green chili"]
  },
  {
    name: "Medu Vada",
    ingredients: ["dal", "ginger", "green chili", "curry leaves", "asafoetida", "salt", "oil"]
  },
  
  // Gujarati Dishes
  {
    name: "Dhokla",
    ingredients: ["gram flour", "yogurt", "ginger", "green chili", "turmeric", "mustard seeds", "curry leaves"]
  },
  {
    name: "Khichdi",
    ingredients: ["rice", "dal", "turmeric", "cumin", "asafoetida", "ginger", "ghee"]
  },
  {
    name: "Thepla",
    ingredients: ["wheat flour", "fenugreek leaves", "turmeric", "cumin", "coriander", "ginger", "green chili"]
  },
  {
    name: "Undhiyu",
    ingredients: ["vegetables", "green beans", "potatoes", "sweet potato", "ginger", "garlic", "coconut", "coriander"]
  },
  {
    name: "Gujarati Dal",
    ingredients: ["dal", "jaggery", "tamarind", "turmeric", "asafoetida", "ginger", "green chili", "curry leaves"]
  },
  
  // Bengali Dishes
  {
    name: "Fish Curry (Macher Jhol)",
    ingredients: ["fish", "potatoes", "onions", "tomatoes", "ginger", "garlic", "turmeric", "cumin", "mustard oil"]
  },
  {
    name: "Aloo Posto",
    ingredients: ["potatoes", "poppy seeds", "mustard oil", "turmeric", "salt", "green chili"]
  },
  {
    name: "Dal Bhaat",
    ingredients: ["rice", "dal", "turmeric", "cumin", "onions", "garlic", "ginger", "mustard oil"]
  },
  {
    name: "Shukto",
    ingredients: ["vegetables", "bitter gourd", "bottle gourd", "ginger", "cumin", "mustard seeds", "mustard oil"]
  },
  {
    name: "Mishti Doi",
    ingredients: ["milk", "jaggery", "yogurt"]
  },
  
  // Simple 2-3 Ingredient Dishes
  {
    name: "Rice and Dal",
    ingredients: ["rice", "dal"]
  },
  {
    name: "Bread Omelette",
    ingredients: ["bread", "eggs"]
  },
  {
    name: "Milk Tea",
    ingredients: ["milk", "tea", "sugar"]
  },
  {
    name: "Simple Khichdi",
    ingredients: ["rice", "dal", "turmeric"]
  },
  {
    name: "Butter Rice",
    ingredients: ["rice", "butter", "salt"]
  },
  {
    name: "Scrambled Eggs",
    ingredients: ["eggs", "salt", "pepper"]
  },
  {
    name: "Bread and Butter",
    ingredients: ["bread", "butter"]
  },
  {
    name: "Rice with Ghee",
    ingredients: ["rice", "ghee", "salt"]
  },
  {
    name: "Simple Pasta",
    ingredients: ["pasta", "olive oil", "salt"]
  },
  {
    name: "Toast",
    ingredients: ["bread"]
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