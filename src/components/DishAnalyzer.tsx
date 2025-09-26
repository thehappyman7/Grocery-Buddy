import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import IngredientButton from '@/components/ui/ingredient-button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ChefHat, Utensils, Loader2, ShoppingCart, Check } from 'lucide-react';
import { useGrocery } from '@/context/GroceryContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AnalyzedDish {
  name: string;
  ingredients: string[];
  instructions?: string[];
  servings?: number;
  cookingTime?: number;
  difficulty?: string;
}

const DishAnalyzer: React.FC = () => {
  const [dishName, setDishName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedDish, setAnalyzedDish] = useState<AnalyzedDish | null>(null);
  const [pendingIngredients, setPendingIngredients] = useState<string[]>([]);
  const { groceryItems, addItem } = useGrocery();

  const analyzeDish = async (input: string) => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-dish', {
        body: { input, type: 'dish' }
      });

      if (error) throw error;

      // Check if the response contains an error message
      if (data.error) {
        toast.error(data.error);
        return;
      }

      setAnalyzedDish(data);
      toast.success('Successfully analyzed dish!');
    } catch (error) {
      console.error('Error analyzing:', error);
      toast.error('Failed to analyze dish');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;
    analyzeDish(dishName.trim());
  };

  const simplifyIngredientName = (ingredient: string): string => {
    // Remove quantities, units, and preparation details
    return ingredient
      .toLowerCase()
      .replace(/^\d+(\.\d+)?\s*(cups?|tbsp|tsp|lbs?|oz|grams?|ml|liters?|cloves?|slices?|pieces?|medium|large|small|whole|fresh|dried|chopped|diced|minced|grated|sliced|crushed|ground|cooked|raw|organic|extra|virgin|kosher|sea|black|white|green|red|yellow)\s*/gi, '')
      .replace(/\s*\([^)]*\)/g, '') // Remove anything in parentheses
      .replace(/,.*$/, '') // Remove everything after first comma
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .trim();
  };

  const getMissingIngredients = () => {
    if (!analyzedDish) return [];
    const currentItemNames = groceryItems.map(item => item.name.toLowerCase());
    return analyzedDish.ingredients
      .map(simplifyIngredientName)
      .filter(ingredient => ingredient && !currentItemNames.includes(ingredient.toLowerCase()));
  };

  const getAvailableIngredients = () => {
    if (!analyzedDish) return [];
    const currentItemNames = groceryItems.map(item => item.name.toLowerCase());
    return analyzedDish.ingredients
      .map(simplifyIngredientName)
      .filter(ingredient => ingredient && currentItemNames.includes(ingredient.toLowerCase()));
  };

  const handleAddMissingIngredients = () => {
    const missing = getMissingIngredients();
    if (missing.length === 0) {
      toast.info('No missing ingredients to add!');
      return;
    }
    setPendingIngredients(missing);
  };

  const confirmAddIngredients = () => {
    let addedCount = 0;
    pendingIngredients.forEach(ingredient => {
      if (ingredient.trim()) {
        addItem(ingredient.trim(), 'Recipe Ingredients');
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      toast.success(`Added ${addedCount} ingredient${addedCount !== 1 ? 's' : ''} to your grocery list!`);
    }
    setPendingIngredients([]);
  };

  const resetAnalysis = () => {
    setAnalyzedDish(null);
    setDishName('');
    setPendingIngredients([]);
  };

  if (!analyzedDish) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Analyze Dish
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDishSubmit} className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                Enter the name of a dish to get its ingredient list and recipe
              </p>
              <Input
                type="text"
                placeholder="e.g., Butter Chicken, Pasta Carbonara, Chocolate Cake..."
                value={dishName}
                onChange={(e) => setDishName(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              disabled={!dishName.trim() || isAnalyzing}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing Dish...
                </>
              ) : (
                <>
                  <Utensils className="h-4 w-4 mr-2" />
                  Analyze Dish
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  const missingIngredients = getMissingIngredients();
  const availableIngredients = getAvailableIngredients();
  const allIngredientsAvailable = missingIngredients.length === 0 && availableIngredients.length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              {analyzedDish.name}
            </span>
            <Button variant="outline" size="sm" onClick={resetAnalysis}>
              Analyze Another Dish
            </Button>
          </CardTitle>
          {(analyzedDish.servings || analyzedDish.cookingTime || analyzedDish.difficulty) && (
            <div className="flex flex-wrap gap-2 mt-2">
              {analyzedDish.servings && (
                <Badge variant="secondary">Serves {analyzedDish.servings}</Badge>
              )}
              {analyzedDish.cookingTime && (
                <Badge variant="secondary">{analyzedDish.cookingTime} mins</Badge>
              )}
              {analyzedDish.difficulty && (
                <Badge variant="secondary">{analyzedDish.difficulty}</Badge>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {allIngredientsAvailable && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <Check className="h-5 w-5" />
                <span className="font-medium">Perfect! You have all the ingredients!</span>
              </div>
              <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                You're ready to cook this dish right now.
              </p>
            </div>
          )}

          {availableIngredients.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center gap-2">
                <Check className="h-4 w-4" />
                Available in your cart ({availableIngredients.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableIngredients.map((ingredient, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {missingIngredients.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Missing ingredients ({missingIngredients.length})
                </h3>
                <div className="flex gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" onClick={handleAddMissingIngredients}>
                        Add All to Cart
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Add ingredients to cart?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will add the following {missingIngredients.length} ingredient{missingIngredients.length !== 1 ? 's' : ''} to your grocery list:
                          <div className="mt-2 p-3 bg-muted rounded-md">
                            <div className="flex flex-wrap gap-1">
                              {missingIngredients.map((ingredient, index) => (
                                <span key={index} className="text-sm">
                                  {ingredient}{index < missingIngredients.length - 1 ? ', ' : ''}
                                </span>
                              ))}
                            </div>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmAddIngredients}>
                          Add to Cart
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {missingIngredients.map((ingredient, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="flex-1">{ingredient}</span>
                    <IngredientButton
                      variant="add"
                      itemName={ingredient}
                      onAction={() => {
                        addItem(ingredient, 'Recipe Ingredients');
                        toast.success(`Added ${ingredient} to cart!`);
                      }}
                      size="sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {analyzedDish.instructions && analyzedDish.instructions.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Recipe Instructions
              </h3>
              <div className="space-y-3">
                {analyzedDish.instructions.map((step, index) => (
                  <div key={index} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DishAnalyzer;