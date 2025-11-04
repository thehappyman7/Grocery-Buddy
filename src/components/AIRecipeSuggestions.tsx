import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChefHat, Loader2 } from 'lucide-react';
import { useGrocery } from '@/context/GroceryContext';
import { usePreferences } from '@/context/PreferencesContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import RecipeCard from './RecipeCard';
import RecipeDrawer from './RecipeDrawer';

interface AIRecipeSuggestionsProps {
  selectedIngredients: string[];
  isVegetarian?: boolean;
}

interface RecipeSection {
  title: string;
  icon: string;
  recipes: any[];
  isLoading: boolean;
}

const AIRecipeSuggestions: React.FC<AIRecipeSuggestionsProps> = ({ selectedIngredients, isVegetarian = false }) => {
  const { groceryItems } = useGrocery();
  const { preferences } = usePreferences();
  const [quickRecipes, setQuickRecipes] = useState<any[]>([]);
  const [seasonalRecipes, setSeasonalRecipes] = useState<any[]>([]);
  const [trendingRecipes, setTrendingRecipes] = useState<any[]>([]);
  const [loadingQuick, setLoadingQuick] = useState(false);
  const [loadingSeasonal, setLoadingSeasonal] = useState(false);
  const [loadingTrending, setLoadingTrending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const fetchRecipesByType = async (type: 'quick' | 'seasonal' | 'trending', setRecipes: (recipes: any[]) => void, setLoading: (loading: boolean) => void) => {
    setLoading(true);
    try {
      const { data, error: functionError } = await supabase.functions.invoke('generate-recipes', {
        body: {
          type,
          filters: {
            isVegetarian: preferences?.isVegetarian || false,
            cuisine: preferences?.cuisines?.[0] || 'all',
            budget: preferences?.budget || 5
          },
          userIngredients: selectedIngredients,
          excludeRecipeIds: []
        }
      });

      if (functionError) throw functionError;
      if (data?.error) throw new Error(data.error);

      setRecipes(data?.recipes || []);
    } catch (err) {
      toast.error(`Failed to generate ${type} recipes. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedIngredients.length === 0) {
      setQuickRecipes([]);
      setSeasonalRecipes([]);
      setTrendingRecipes([]);
      return;
    }

    setError(null);

    // Fetch all three types of recipes in parallel
    fetchRecipesByType('quick', setQuickRecipes, setLoadingQuick);
    fetchRecipesByType('seasonal', setSeasonalRecipes, setLoadingSeasonal);
    fetchRecipesByType('trending', setTrendingRecipes, setLoadingTrending);
  }, [selectedIngredients, preferences?.isVegetarian, preferences?.cuisines, preferences?.budget]);

  const handleViewRecipe = (recipe: any) => {
    setSelectedRecipe(recipe);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRecipe(null);
  };

  const isAnyLoading = loadingQuick || loadingSeasonal || loadingTrending;
  const hasAnyRecipes = quickRecipes.length > 0 || seasonalRecipes.length > 0 || trendingRecipes.length > 0;

  if (selectedIngredients.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ChefHat className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Ready to Cook Something Amazing?</h3>
          <p className="text-muted-foreground">
            Select ingredients above to get personalized recipe suggestions powered by AI!
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isAnyLoading && !hasAnyRecipes) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Loader2 className="h-16 w-16 mx-auto mb-4 text-primary animate-spin" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Generating Recipes...</h3>
          <p className="text-muted-foreground">
            Our AI chef is creating personalized recipes based on your {selectedIngredients.length} ingredients
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!hasAnyRecipes && !isAnyLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ChefHat className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Recipes Found</h3>
          <p className="text-muted-foreground mb-4">
            Try selecting different ingredients or adjusting your preferences
          </p>
          <div className="text-sm text-muted-foreground">
            <p>💡 <strong>Tip:</strong> Add more ingredients to get better recipe matches!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sections: RecipeSection[] = [
    {
      title: 'Quick Recipes',
      icon: '⚡',
      recipes: quickRecipes,
      isLoading: loadingQuick
    },
    {
      title: 'Seasonal Recipes',
      icon: '🌿',
      recipes: seasonalRecipes,
      isLoading: loadingSeasonal
    },
    {
      title: 'Trending Recipes',
      icon: '🔥',
      recipes: trendingRecipes,
      isLoading: loadingTrending
    }
  ];

  return (
    <>
      <div className="space-y-8">
        {sections.map((section) => (
          section.recipes.length > 0 || section.isLoading ? (
            <div key={section.title} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <span>{section.icon}</span>
                  {section.title}
                  {!section.isLoading && (
                    <span className="text-sm font-normal text-muted-foreground">
                      ({section.recipes.length})
                    </span>
                  )}
                </h3>
                {section.isLoading && (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
              </div>

              {section.isLoading ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <Loader2 className="h-8 w-8 mx-auto mb-2 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading {section.title.toLowerCase()}...</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {section.recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      badgeText={section.title.replace(' Recipes', '')}
                      badgeIcon={section.icon}
                      onViewDetails={handleViewRecipe}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null
        ))}
      </div>

      <RecipeDrawer
        recipe={selectedRecipe}
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
      />
    </>
  );
};

export default AIRecipeSuggestions;