import React, { useState } from 'react';
import { recipeDatabase, Recipe } from '@/data/recipeDatabase';
import RecipeCard from './RecipeCard';
import RecipeFilters, { RecipeFilters as Filters } from './RecipeFilters';
import RecipeDrawer from './RecipeDrawer';
import { usePreferences } from '@/context/PreferencesContext';

const QuickMealsTab: React.FC = () => {
  const { preferences } = usePreferences();
  const [filters, setFilters] = useState<Filters>({
    isVegetarian: preferences?.isVegetarian || false,
    cuisine: 'all',
    budget: 200
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

  // Filter recipes for quick meals (under 30 minutes)
  const quickMeals = recipeDatabase
    .filter(recipe => recipe.cookingTime <= 30)
    .filter(recipe => !filters.isVegetarian || isRecipeVegetarian(recipe))
    .filter(recipe => filters.cuisine === 'all' || recipe.cuisine === filters.cuisine)
    .sort((a, b) => a.cookingTime - b.cookingTime);

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

      {quickMeals.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No quick meals found with your current filters. Try adjusting your preferences.
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