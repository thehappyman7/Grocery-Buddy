import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, ShoppingCart } from 'lucide-react';
import { Recipe } from '@/data/recipeDatabase';
import { useGrocery } from '@/context/GroceryContext';
import { toast } from 'sonner';

interface RecipeCardProps {
  recipe: Recipe & {
    matchedIngredients?: number;
    extraIngredientsNeeded?: number;
  };
  badgeText?: string;
  badgeIcon?: string;
  onViewDetails: (recipe: Recipe) => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, badgeText, badgeIcon, onViewDetails }) => {
  const { groceryItems, addItem } = useGrocery();

  const getCuisineIcon = (cuisine: string) => {
    switch (cuisine) {
      case 'Indian': return '🇮🇳';
      case 'International': return '🌍';
      case 'Fusion': return '🔥';
      default: return '🍽️';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleAddMissingIngredients = () => {
    const currentItemNames = groceryItems.map(item => item.name.toLowerCase());
    const missingIngredients = recipe.ingredients.filter(
      ingredient => !currentItemNames.includes(ingredient.toLowerCase())
    );

    if (missingIngredients.length === 0) {
      toast.info('All ingredients are already in your grocery list!');
      return;
    }

    missingIngredients.forEach(ingredient => {
      addItem(ingredient, 'Recipe Ingredients');
    });
    toast.success(`Added ${missingIngredients.length} ingredients to your grocery list!`);
  };

  return (
    <Card className="transition-all hover:shadow-md cursor-pointer group h-full flex flex-col">
      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-t-lg flex items-center justify-center text-3xl sm:text-4xl">
        {getCuisineIcon(recipe.cuisine)}
      </div>
      
      <CardHeader className="pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base sm:text-lg leading-tight line-clamp-2 flex-1" onClick={() => onViewDetails(recipe)}>
            {recipe.name}
          </CardTitle>
          <div className="flex flex-col gap-1 shrink-0">
            {badgeText && (
              <Badge variant="secondary" className="text-[10px] sm:text-xs whitespace-nowrap">
                {badgeIcon} {badgeText}
              </Badge>
            )}
            {recipe.matchedIngredients !== undefined && recipe.matchedIngredients > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800 text-[10px] sm:text-xs whitespace-nowrap">
                ✓ {recipe.matchedIngredients}
              </Badge>
            )}
            {recipe.extraIngredientsNeeded !== undefined && recipe.extraIngredientsNeeded > 0 && (
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800 text-[10px] sm:text-xs whitespace-nowrap">
                +{recipe.extraIngredientsNeeded}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{recipe.cookingTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{recipe.servings}</span>
          </div>
          <Badge className={`${getDifficultyColor(recipe.difficulty)} text-[10px] sm:text-xs`} variant="outline">
            {recipe.difficulty}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 px-3 sm:px-6 pb-3 sm:pb-6 flex-1 flex flex-col">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 flex-1">{recipe.description}</p>
        
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <Badge variant="outline" className="text-[10px] sm:text-xs">
            {recipe.cuisine}
          </Badge>
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleAddMissingIngredients();
            }}
            className="text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3"
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            <span className="hidden xs:inline">Add to Cart</span>
            <span className="xs:hidden">Add</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;