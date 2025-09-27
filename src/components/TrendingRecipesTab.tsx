import React, { useState, useEffect } from 'react';
import { Recipe } from '@/data/recipeDatabase';
import RecipeCard from './RecipeCard';
import RecipeFilters, { RecipeFilters as Filters } from './RecipeFilters';
import RecipeDrawer from './RecipeDrawer';
import { usePreferences } from '@/context/PreferencesContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const TrendingRecipesTab: React.FC = () => {
  const { preferences } = usePreferences();
  const [filters, setFilters] = useState<Filters>({
    isVegetarian: preferences?.isVegetarian || false,
    cuisine: 'all',
    budget: 300
  });
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [trendingRecipes, setTrendingRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch trending recipes from Gemini API
  const fetchTrendingRecipes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-recipes', {
        body: {
          type: 'trending',
          filters: filters
        }
      });

      if (error) throw error;
      
      setTrendingRecipes(data.recipes || []);
    } catch (error) {
      console.error('Error fetching trending recipes:', error);
      toast.error('Failed to load trending recipes. Please try again.');
      setTrendingRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingRecipes();
  }, [filters]);

  const handleViewDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDrawerOpen(true);
  };

  const getPopularityLabel = (index: number) => {
    if (index === 0) return '#1 Trending';
    if (index < 3) return 'Top 3';
    if (index < 6) return 'Hot Now';
    return 'Popular Today';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          🔥 Trending Recipes
        </h3>
        <p className="text-muted-foreground">
          Most popular recipes everyone's cooking right now
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
      ) : trendingRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No trending recipes found. Please try again or adjust your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trendingRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              badgeText={getPopularityLabel(index)}
              badgeIcon="🔥"
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

export default TrendingRecipesTab;