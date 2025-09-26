import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, ShoppingCart, Star, X } from 'lucide-react';
import { Recipe } from '@/data/recipeDatabase';
import { useGrocery } from '@/context/GroceryContext';
import { useRecipes } from '@/context/RecipeContext';
import { toast } from 'sonner';

interface RecipeDrawerProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

const RecipeDrawer: React.FC<RecipeDrawerProps> = ({ recipe, isOpen, onClose }) => {
  const { groceryItems, addItem } = useGrocery();
  const { saveRecipe, isRecipeSaved } = useRecipes();
  const [isAddingIngredients, setIsAddingIngredients] = useState(false);

  if (!recipe) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCuisineIcon = (cuisine: string) => {
    switch (cuisine) {
      case 'Indian': return '🇮🇳';
      case 'International': return '🌍';
      case 'Fusion': return '🔥';
      default: return '🍽️';
    }
  };

  const handleSaveRecipe = () => {
    saveRecipe(recipe.id, recipe.name, recipe, false);
    toast.success('Recipe saved to your collection!');
  };

  const handleAddMissingIngredients = async () => {
    setIsAddingIngredients(true);
    const currentItemNames = groceryItems.map(item => item.name.toLowerCase());
    const missingIngredients = recipe.ingredients.filter(
      ingredient => !currentItemNames.includes(ingredient.toLowerCase())
    );

    if (missingIngredients.length === 0) {
      toast.info('All ingredients are already in your grocery list!');
      setIsAddingIngredients(false);
      return;
    }

    missingIngredients.forEach(ingredient => {
      addItem(ingredient, 'Recipe Ingredients');
    });
    toast.success(`Added ${missingIngredients.length} ingredients to your grocery list!`);
    setIsAddingIngredients(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DrawerTitle className="flex items-center gap-2 text-xl">
                <span className="text-2xl">{getCuisineIcon(recipe.cuisine)}</span>
                {recipe.name}
              </DrawerTitle>
              <DrawerDescription className="mt-2">
                {recipe.description}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{recipe.cookingTime} minutes</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
            <Badge className={getDifficultyColor(recipe.difficulty)}>
              {recipe.difficulty}
            </Badge>
            <Badge variant="outline">
              {recipe.cuisine}
            </Badge>
          </div>

          {recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {recipe.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </DrawerHeader>

        <div className="px-4 pb-4 space-y-6 overflow-y-auto flex-1">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Ingredients ({recipe.ingredients.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                  <span className="text-sm">{ingredient}</span>
                </div>
              ))}
            </div>
          </div>

          {recipe.instructions && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3">Cooking Steps</h3>
                <div className="space-y-3">
                  {recipe.instructions.map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <p className="text-sm text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DrawerFooter>
          <div className="flex gap-2">
            <Button 
              onClick={handleSaveRecipe}
              variant="outline"
              className="flex-1"
              disabled={isRecipeSaved(recipe.id)}
            >
              <Star className="h-4 w-4 mr-2" />
              {isRecipeSaved(recipe.id) ? 'Saved' : 'Save Recipe'}
            </Button>
            <Button 
              onClick={handleAddMissingIngredients}
              className="flex-1"
              disabled={isAddingIngredients}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAddingIngredients ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RecipeDrawer;