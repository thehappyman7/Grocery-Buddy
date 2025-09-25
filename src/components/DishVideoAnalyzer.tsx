import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import IngredientButton from '@/components/ui/ingredient-button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ChefHat, Youtube, Utensils, Loader2, ShoppingCart, Check } from 'lucide-react';
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

const DishVideoAnalyzer: React.FC = () => {
  const [dishName, setDishName] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzedDish, setAnalyzedDish] = useState<AnalyzedDish | null>(null);
  const [pendingIngredients, setPendingIngredients] = useState<string[]>([]);
  const { groceryItems, addItem } = useGrocery();

  const analyzeDish = async (input: string, type: 'dish' | 'video') => {
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-dish', {
        body: { input, type }
      });

      if (error) throw error;

      setAnalyzedDish(data);
      toast.success(`Successfully analyzed ${type === 'dish' ? 'dish' : 'video'}!`);
    } catch (error) {
      console.error('Error analyzing:', error);
      toast.error(`Failed to analyze ${type === 'dish' ? 'dish' : 'video'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName.trim()) return;
    analyzeDish(dishName.trim(), 'dish');
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl.trim()) return;
    analyzeDish(videoUrl.trim(), 'video');
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
    pendingIngredients.forEach(ingredient => {
      addItem(ingredient, 'Recipe Ingredients');
    });
    toast.success(`Added ${pendingIngredients.length} ingredients to your grocery list!`);
    setPendingIngredients([]);
  };

  const resetAnalysis = () => {
    setAnalyzedDish(null);
    setDishName('');
    setVideoUrl('');
  };

  return (
    <div className="space-y-6">
      {!analyzedDish ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="h-5 w-5" />
              Analyze Dish or Video
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="dish" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="dish" className="flex items-center gap-2">
                  <Utensils className="h-4 w-4" />
                  Dish Name
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <Youtube className="h-4 w-4" />
                  YouTube Video
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="dish" className="space-y-4">
                <form onSubmit={handleDishSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Enter dish name
                    </label>
                    <Input
                      value={dishName}
                      onChange={(e) => setDishName(e.target.value)}
                      placeholder="e.g., Butter Chicken, Pasta Carbonara, Biryani..."
                      disabled={isAnalyzing}
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
                        <ChefHat className="h-4 w-4 mr-2" />
                        Analyze Dish
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="video" className="space-y-4">
                <form onSubmit={handleVideoSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      YouTube video URL
                    </label>
                    <Textarea
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      rows={3}
                      disabled={isAnalyzing}
                    />
                    <p className="text-xs text-muted-foreground">
                      Paste any YouTube cooking video link to extract ingredients and recipe
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    disabled={!videoUrl.trim() || isAnalyzing}
                    className="w-full"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing Video...
                      </>
                    ) : (
                      <>
                        <Youtube className="h-4 w-4 mr-2" />
                        Analyze Video
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Analysis Results */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  {analyzedDish.name}
                </CardTitle>
                <Button variant="outline" size="sm" onClick={resetAnalysis}>
                  Analyze Another
                </Button>
              </div>
              {(analyzedDish.servings || analyzedDish.cookingTime || analyzedDish.difficulty) && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {analyzedDish.servings && <span>{analyzedDish.servings} servings</span>}
                  {analyzedDish.cookingTime && <span>{analyzedDish.cookingTime} min</span>}
                  {analyzedDish.difficulty && (
                    <Badge variant="secondary">{analyzedDish.difficulty}</Badge>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Available Ingredients */}
              {getAvailableIngredients().length > 0 && (
                <div>
                  <h4 className="font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Available in your cart ({getAvailableIngredients().length})
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {getAvailableIngredients().map((ingredient, i) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Ingredients */}
              {getMissingIngredients().length > 0 && (
                <div>
                  <h4 className="font-medium text-destructive mb-2 flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Missing ingredients ({getMissingIngredients().length})
                  </h4>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {getMissingIngredients().map((ingredient, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg border">
                          <span className="text-sm font-medium">{ingredient}</span>
                          <IngredientButton
                            variant="add"
                            itemName={ingredient}
                            onAction={() => addItem(ingredient, 'Recipe Ingredients')}
                            size="sm"
                            showConfirmation={false}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          onClick={handleAddMissingIngredients}
                          className="w-full"
                          variant="outline"
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add All Missing Ingredients ({getMissingIngredients().length})
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Add All Ingredients to Cart</AlertDialogTitle>
                          <AlertDialogDescription>
                            Add all missing ingredients to your grocery list for "{analyzedDish.name}"?
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
                          <AlertDialogAction onClick={confirmAddIngredients}>
                            Add All to Cart
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}

              {/* Recipe Instructions */}
              {analyzedDish.instructions && analyzedDish.instructions.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Instructions</h4>
                  <div className="space-y-2">
                    {analyzedDish.instructions.map((step, i) => (
                      <div key={i} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                        <Badge variant="outline" className="flex-shrink-0 h-fit">
                          {i + 1}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Perfect Match Celebration */}
              {getMissingIngredients().length === 0 && analyzedDish.ingredients.length > 0 && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300 font-medium">
                    <span className="text-lg">🎉</span>
                    <span>Perfect! You have everything needed!</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    This recipe is ready to cook with your available ingredients.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DishVideoAnalyzer;