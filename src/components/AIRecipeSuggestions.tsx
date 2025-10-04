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

const AIRecipeSuggestions: React.FC<AIRecipeSuggestionsProps> = ({ selectedIngredients, isVegetarian = false }) => {
  const { groceryItems } = useGrocery();
  const { preferences } = usePreferences();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      if (selectedIngredients.length === 0) {
        setRecipes([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: functionError } = await supabase.functions.invoke('generate-recipes', {
          body: {
            type: 'ingredients',
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
        console.error('Error fetching AI recipes:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate recipes');
        toast.error('Failed to generate recipes. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedIngredients, preferences?.isVegetarian, preferences?.cuisines, preferences?.budget]);

  const handleViewRecipe = (recipe: any) => {
    setSelectedRecipe(recipe);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedRecipe(null);
  };

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

  if (isLoading) {
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

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ChefHat className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Oops! Something went wrong</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (recipes.length === 0) {
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

  return (
    <>
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            🍳 AI-Generated Recipes ({recipes.length})
          </h3>
          <p className="text-muted-foreground">
            Based on your {selectedIngredients.length} selected ingredients
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              badgeText="AI Match"
              badgeIcon="🤖"
              onViewDetails={handleViewRecipe}
            />
          ))}
        </div>
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