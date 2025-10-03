import React, { useState, useEffect } from 'react';
import { Recipe } from '@/data/recipeDatabase';
import RecipeCard from './RecipeCard';
import RecipeFilters, { RecipeFilters as Filters } from './RecipeFilters';
import RecipeDrawer from './RecipeDrawer';
import { usePreferences } from '@/context/PreferencesContext';
import { useGrocery } from '@/context/GroceryContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SeasonalSpecialsTab: React.FC = () => {
  const { preferences } = usePreferences();
  const { groceryItems } = useGrocery();
  const [filters, setFilters] = useState<Filters>({
    isVegetarian: preferences?.isVegetarian || false,
    cuisine: 'all',
    budget: 250
  });
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [seasonalRecipes, setSeasonalRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get current season
  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  };

  const currentSeason = getCurrentSeason();

  // Fetch seasonal recipes from Gemini API
  const fetchSeasonalRecipes = async () => {
    setIsLoading(true);
    try {
      const userIngredients = groceryItems.map(item => item.name);
      
      const { data, error } = await supabase.functions.invoke('generate-recipes', {
        body: {
          type: 'seasonal',
          filters: filters,
          userIngredients: userIngredients
        }
      });

      if (error) throw error;
      
      setSeasonalRecipes(data.recipes || []);
    } catch (error) {
      console.error('Error fetching seasonal recipes:', error);
      toast.error('Failed to load seasonal recipes. Please try again.');
      setSeasonalRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasonalRecipes();
  }, [filters, groceryItems]);

  const handleViewDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsDrawerOpen(true);
  };

  const getSeasonIcon = (season: string) => {
    switch (season) {
      case 'spring': return '🌸';
      case 'summer': return '🍉';
      case 'autumn': return '🍂';
      case 'winter': return '❄️';
      default: return '🌿';
    }
  };

  const getSeasonLabel = (season: string) => {
    return `${season.charAt(0).toUpperCase() + season.slice(1)} Special`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-foreground mb-2">
          🌿 Seasonal Specials
        </h3>
        <p className="text-muted-foreground">
          Perfect recipes for {currentSeason} season {getSeasonIcon(currentSeason)}
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
      ) : seasonalRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No seasonal recipes found. Please try again or adjust your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seasonalRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              badgeText={getSeasonLabel(currentSeason)}
              badgeIcon={getSeasonIcon(currentSeason)}
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

export default SeasonalSpecialsTab;