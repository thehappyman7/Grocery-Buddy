import React, { useState, useEffect } from 'react';
import { Recipe } from '@/data/recipeDatabase';
import RecipeCard from './RecipeCard';
import RecipeFilters, { RecipeFilters as Filters } from './RecipeFilters';
import RecipeDrawer from './RecipeDrawer';
import { usePreferences } from '@/context/PreferencesContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const QuickMealsTab: React.FC = () => {
  const { preferences } = usePreferences();
  const [filters, setFilters] = useState<Filters>({
    isVegetarian: preferences?.isVegetarian || false,
    cuisine: 'all',
    budget: 200
  });
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quickMeals, setQuickMeals] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch quick meals from Gemini API
  const fetchQuickMeals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipes', {
        body: {
          type: 'quick',
          filters: filters
        }
      });

      if (error) throw error;
      
      setQuickMeals(data.recipes || []);
    } catch (error) {
      console.error('Error fetching quick meals:', error);
      toast.error('Failed to load quick meals. Please try again.');
      setQuickMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuickMeals();
  }, [filters]);

  const handleViewDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDrawerOpen(true);
  };

  const getTimeLabel = (cookingTime: number) => {
    if (cookingTime <= 10) return 'Super Quick';
    if (cookingTime <= 20) return 'Quick';
    return 'Ready in 30min';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          ⚡ Quick Meals
        </h3>
        <p className="text-muted-foreground">
          Delicious recipes ready in 30 minutes or less
        </p>
      </div>

      <RecipeFilters filters={filters} onFiltersChange={setFilters} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card rounded-lg border p-4 animate-pulse">
              <div className="bg-muted h-32 rounded mb-4"></div>
              <div className="bg-muted h-4 rounded mb-2"></div>
              <div className="bg-muted h-3 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : quickMeals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No quick meals found. Please try again or adjust your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickMeals.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              badgeText={`Ready in ${recipe.cookingTime}min`}
              badgeIcon="⚡"
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      <RecipeDrawer
        recipe={selectedRecipe}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};

export default QuickMealsTab;