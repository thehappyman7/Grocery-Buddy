import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Check, X, Clock, Users, ChefHat, Globe, Leaf, ShoppingCart } from 'lucide-react';
import { findRecipesByIngredients, RecipeWithMatch } from '@/data/recipeDatabase';
import { useGrocery } from '@/context/GroceryContext';
import { toast } from 'sonner';

interface AIRecipeSuggestionsProps {
  selectedIngredients: string[];
  isVegetarian?: boolean;
}

const AIRecipeSuggestions: React.FC<AIRecipeSuggestionsProps> = ({ selectedIngredients, isVegetarian = false }) => {
  const recipesWithMatches = findRecipesByIngredients(selectedIngredients);
  const { groceryItems, addItem } = useGrocery();
  const [pendingIngredients, setPendingIngredients] = useState<string[]>([]);
  
  // Helper function to check if a recipe is vegetarian
  const isRecipeVegetarian = (recipe: any) => {
    const nonVegIngredients = ['chicken', 'beef', 'pork', 'fish', 'mutton', 'lamb', 'meat', 'anchovy'];
    const nonVegTags = ['non-vegetarian', 'meat', 'fish', 'poultry'];
    
    // Check ingredients
    const hasNonVegIngredients = recipe.ingredients.some((ingredient: string) =>
      nonVegIngredients.some(nonVeg => ingredient.toLowerCase().includes(nonVeg))
    );
    
    // Check tags
    const hasNonVegTags = recipe.tags.some((tag: string) =>
      nonVegTags.some(nonVeg => tag.toLowerCase().includes(nonVeg))
    );
    
    return !hasNonVegIngredients && !hasNonVegTags;
  };

  // Sort by match percentage and then by difficulty (Easy first)
  const sortedRecipes = recipesWithMatches
    .filter(recipe => recipe.matchPercentage > 0)
    .filter(recipe => !isVegetarian || isRecipeVegetarian(recipe))
    .sort((a, b) => {
      if (b.matchPercentage !== a.matchPercentage) {
        return b.matchPercentage - a.matchPercentage;
      }
      const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });

  const getCuisineIcon = (cuisine: string) => {
    switch (cuisine) {
      case 'Indian': return '🇮🇳';
      case 'International': return '🌍';
      case 'Fusion': return '🔥';
      default: return '🍽️';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleAddMissingIngredients = (recipe: RecipeWithMatch) => {
    if (!recipe.missingIngredients || recipe.missingIngredients.length === 0) {
      toast.info('No missing ingredients to add!');
      return;
    }

    // Filter out ingredients that are already in the grocery list
    const currentItemNames = groceryItems.map(item => item.name.toLowerCase());
    const missingNotInCart = recipe.missingIngredients.filter(
      ingredient => !currentItemNames.includes(ingredient.toLowerCase())
    );

    if (missingNotInCart.length === 0) {
      toast.info('All missing ingredients are already in your grocery list!');
      return;
    }

    setPendingIngredients(missingNotInCart);
  };

  const confirmAddIngredients = (recipe: RecipeWithMatch) => {
    pendingIngredients.forEach(ingredient => {
      addItem(ingredient, 'Recipe Ingredients');
    });
    toast.success(`Added ${pendingIngredients.length} ingredients to your grocery list!`);
    setPendingIngredients([]);
  };

  if (selectedIngredients.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ChefHat className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Cook Something Amazing?</h3>
          <p className="text-muted-foreground">
            Select ingredients above to get personalized recipe suggestions powered by our AI chef!
          </p>
        </CardContent>
      </Card>
    );
  }

  if (sortedRecipes.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ChefHat className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Perfect Matches Yet</h3>
          <p className="text-muted-foreground mb-4">
            Try adding more ingredients or search for specific items like "rice", "dal", "pasta", or "eggs"
            {isVegetarian && (
              <span className="block mt-2 text-green-600 dark:text-green-400">
                🌱 Showing only vegetarian recipes - add ingredients like lentils, vegetables, or dairy for better matches
              </span>
            )}
          </p>
          <div className="text-sm text-muted-foreground">
            <p>💡 <strong>Tip:</strong> Even 2-3 basic ingredients can make great simple dishes!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          🍳 AI Recipe Suggestions ({sortedRecipes.length} found)
        </h3>
        <p className="text-muted-foreground">
          Based on your {selectedIngredients.length} selected ingredients
          {isVegetarian && (
            <span className="ml-2 inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs">
              <Leaf className="h-3 w-3" />
              Vegetarian Only
            </span>
          )}
        </p>
      </div>

      <div className="grid gap-4">
        {sortedRecipes.map((recipe, index) => (
          <Card key={recipe.id} className="transition-all hover:shadow-md border-l-4 border-l-primary/20">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span>{getCuisineIcon(recipe.cuisine)}</span>
                  <span className="text-foreground">{recipe.name}</span>
                  {recipe.region && (
                    <Badge variant="outline" className="text-xs">
                      {recipe.region}
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getDifficultyColor(recipe.difficulty)}>
                    {recipe.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {Math.round(recipe.matchPercentage)}% match
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{recipe.cookingTime} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  <span>{recipe.cuisine}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Match Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ingredient Match</span>
                  <span className="font-medium text-foreground">{Math.round(recipe.matchPercentage)}%</span>
                </div>
                <Progress value={recipe.matchPercentage} className="h-2" />
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground">{recipe.description}</p>

              {/* Recipe Tags */}
              {recipe.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {recipe.tags.slice(0, 4).map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {recipe.tags.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{recipe.tags.length - 4} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Available Ingredients */}
              {recipe.matchedIngredients && recipe.matchedIngredients.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Available ingredients ({recipe.matchedIngredients.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {recipe.matchedIngredients.map((ingredient, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Ingredients */}
              {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
                <div>
                  <h4 className="font-medium text-destructive mb-2 flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Missing ingredients ({recipe.missingIngredients.length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {recipe.missingIngredients.map((ingredient, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-destructive/30 text-destructive">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Perfect Match Celebration */}
              {recipe.matchPercentage === 100 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-medium">
                    <span className="text-lg">🎉</span>
                    <span>Perfect match! You have everything needed!</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    This recipe is ready to cook with your available ingredients.
                  </p>
                </div>
              )}

              {/* High Match Encouragement */}
              {recipe.matchPercentage >= 80 && recipe.matchPercentage < 100 && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-blue-700 dark:text-blue-300 font-medium text-sm">
                    ⭐ Great match! Just {recipe.missingIngredients?.length || 0} ingredient{(recipe.missingIngredients?.length || 0) !== 1 ? 's' : ''} away from perfection.
                  </p>
                </div>
              )}

              {/* Add Missing Ingredients Button */}
              {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        onClick={() => handleAddMissingIngredients(recipe)}
                        className="w-full"
                        variant="outline"
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add Missing Ingredients to Cart ({recipe.missingIngredients.length})
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Add Ingredients to Cart</AlertDialogTitle>
                        <AlertDialogDescription>
                          Add these missing ingredients to your grocery list for "{recipe.name}"?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <div className="max-h-40 overflow-y-auto">
                        <div className="space-y-1">
                          {pendingIngredients.map((ingredient, i) => (
                            <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded">
                              <ShoppingCart className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{ingredient}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingIngredients([])}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => confirmAddIngredients(recipe)}>
                          Add to Cart
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIRecipeSuggestions;