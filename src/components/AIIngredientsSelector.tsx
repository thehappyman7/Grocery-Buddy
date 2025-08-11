import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, ShoppingCart } from 'lucide-react';
import { useGrocery } from '@/context/GroceryContext';

interface AIIngredientsSelectorProps {
  selectedIngredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
}

const AIIngredientsSelector: React.FC<AIIngredientsSelectorProps> = ({
  selectedIngredients,
  onIngredientsChange
}) => {
  const { groceryItems } = useGrocery();

  // Get ingredients from grocery list
  const groceryIngredients = groceryItems.map(item => item.name);

  const addIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient.toLowerCase())) {
      onIngredientsChange([...selectedIngredients, ingredient.toLowerCase()]);
    }
  };

  const removeIngredient = (ingredient: string) => {
    onIngredientsChange(selectedIngredients.filter(item => item !== ingredient));
  };

  const addFromGroceryList = () => {
    const newIngredients = groceryIngredients
      .filter(item => !selectedIngredients.includes(item.toLowerCase()))
      .map(item => item.toLowerCase());
    onIngredientsChange([...selectedIngredients, ...newIngredients]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Select Ingredients from Your Grocery List
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Ingredients */}
        {selectedIngredients.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Selected Ingredients ({selectedIngredients.length})</h4>
            <div className="flex flex-wrap gap-2">
              {selectedIngredients.map((ingredient, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  <span className="capitalize">{ingredient}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 hover:bg-destructive/20"
                    onClick={() => removeIngredient(ingredient)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Grocery List Items */}
        <div className="space-y-3">
          {groceryIngredients.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-foreground">Your Grocery List ({groceryIngredients.length} items)</h4>
                <Button variant="outline" size="sm" onClick={addFromGroceryList}>
                  Add All
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                {groceryIngredients.map((ingredient, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto p-2 hover:bg-primary/10"
                    onClick={() => addIngredient(ingredient)}
                    disabled={selectedIngredients.includes(ingredient.toLowerCase())}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    <span className="capitalize text-sm">{ingredient}</span>
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No items in your grocery list.</p>
              <p className="text-sm">Add some groceries to see them here!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIIngredientsSelector;