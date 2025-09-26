import React, { useState } from 'react';
import { recipeDatabase, Recipe } from '@/data/recipeDatabase';
import RecipeCard from './RecipeCard';
import RecipeFilters, { RecipeFilters as Filters } from './RecipeFilters';
import RecipeDrawer from './RecipeDrawer';
import { usePreferences } from '@/context/PreferencesContext';

const TrendingRecipesTab: React.FC = () => {
  const { preferences } = usePreferences();
  const [filters, setFilters] = useState<Filters>({
    isVegetarian: preferences?.isVegetarian || false,
    cuisine: 'all',
    budget: 300
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

  // Helper function to calculate popularity score
  const getPopularityScore = (recipe: Recipe) => {
    // Simulate popularity based on tags, difficulty, and cooking time
    let score = 0;
    
    // Popular tags add to score
    const popularTags = ['quick', 'comfort food', 'popular', 'breakfast', 'restaurant style'];
    score += recipe.tags.filter(tag => popularTags.includes(tag)).length * 10;
    
    // Easy recipes are more popular
    if (recipe.difficulty === 'Easy') score += 15;
    if (recipe.difficulty === 'Medium') score += 10;
    
    // Quick recipes are trendy
    if (recipe.cookingTime <= 30) score += 10;
    
    // Indian cuisine bonus (popular in our database)
    if (recipe.cuisine === 'Indian') score += 5;
    
    // Add some randomness for variety
    score += Math.random() * 10;
    
    return score;
  };

  // Filter and sort trending recipes
  const trendingRecipes = recipeDatabase
    .filter(recipe => !filters.isVegetarian || isRecipeVegetarian(recipe))
    .filter(recipe => filters.cuisine === 'all' || recipe.cuisine === filters.cuisine)
    .map(recipe => ({ ...recipe, popularityScore: getPopularityScore(recipe) }))
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 12); // Show top 12 trending recipes

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

      {trendingRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No trending recipes found with your current filters. Try adjusting your preferences.
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