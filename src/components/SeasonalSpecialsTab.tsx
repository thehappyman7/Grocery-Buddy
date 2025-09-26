import React, { useState } from 'react';
import { recipeDatabase, Recipe } from '@/data/recipeDatabase';
import RecipeCard from './RecipeCard';
import RecipeFilters, { RecipeFilters as Filters } from './RecipeFilters';
import RecipeDrawer from './RecipeDrawer';
import { usePreferences } from '@/context/PreferencesContext';

const SeasonalSpecialsTab: React.FC = () => {
  const { preferences } = usePreferences();
  const [filters, setFilters] = useState<Filters>({
    isVegetarian: preferences?.isVegetarian || false,
    cuisine: 'all',
    budget: 250
  });
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Helper function to check if a recipe is vegetarian
  const isRecipeVegetarian = (recipe: Recipe) => {
    const nonVegIngredients = ['chicken', 'beef', 'pork', 'fish', 'mutton', 'lamb', 'meat', 'anchovy'];
    const nonVegTags = ['non-vegetarian', 'meat', 'fish', 'poultry'];
    
    const hasNonVegIngredients = recipe.ingredients.some(ingredient =>
      nonVegIngredients.some(nonVeg => ingredient.toLowerCase().includes(nonVeg))
    );
    
    const hasNonVegTags = recipe.tags.some(tag =>
      nonVegTags.some(nonVeg => tag.toLowerCase().includes(nonVeg))
    );
    
    return !hasNonVegIngredients && !hasNonVegTags;
  };

  // Get current season
  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 3 && month <= 5) return 'spring';
    if (month >= 6 && month <= 8) return 'summer';
    if (month >= 9 && month <= 11) return 'autumn';
    return 'winter';
  };

  const currentSeason = getCurrentSeason();

  // Helper function to check if recipe is seasonal
  const isSeasonalRecipe = (recipe: Recipe) => {
    const seasonalIngredients = {
      spring: ['spinach', 'peas', 'green chili', 'curry leaves', 'fenugreek leaves'],
      summer: ['tomatoes', 'cucumbers', 'yogurt', 'coconut', 'lemon', 'mint'],
      autumn: ['potatoes', 'cauliflower', 'onions', 'garlic', 'ginger'],
      winter: ['carrots', 'cabbage', 'garam masala', 'ghee', 'milk']
    };

    const seasonalTags = {
      spring: ['fresh', 'green', 'light'],
      summer: ['cooling', 'fresh', 'salad', 'yogurt'],
      autumn: ['comfort food', 'spicy', 'warming'],
      winter: ['rich', 'warming', 'comfort food', 'creamy']
    };

    const currentSeasonIngredients = seasonalIngredients[currentSeason] || [];
    const currentSeasonTags = seasonalTags[currentSeason] || [];

    const hasSeasonalIngredients = recipe.ingredients.some(ingredient =>
      currentSeasonIngredients.some(seasonal => ingredient.toLowerCase().includes(seasonal))
    );

    const hasSeasonalTags = recipe.tags.some(tag =>
      currentSeasonTags.some(seasonal => tag.toLowerCase().includes(seasonal))
    );

    return hasSeasonalIngredients || hasSeasonalTags;
  };

  // Filter seasonal recipes
  const seasonalRecipes = recipeDatabase
    .filter(recipe => isSeasonalRecipe(recipe))
    .filter(recipe => !filters.isVegetarian || isRecipeVegetarian(recipe))
    .filter(recipe => filters.cuisine === 'all' || recipe.cuisine === filters.cuisine)
    .sort((a, b) => {
      // Prioritize by season relevance, then by difficulty
      const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    });

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

      {seasonalRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No seasonal recipes found with your current filters. Try adjusting your preferences.
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