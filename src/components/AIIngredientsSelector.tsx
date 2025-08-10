import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, X, ShoppingCart } from 'lucide-react';
import { useGrocery } from '@/context/GroceryContext';
import { ingredientDatabase, findIngredientMatches, getIngredientsByOrigin } from '@/data/ingredientDatabase';

interface AIIngredientsSelectorProps {
  selectedIngredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
}

const AIIngredientsSelector: React.FC<AIIngredientsSelectorProps> = ({
  selectedIngredients,
  onIngredientsChange
}) => {
  const { groceryItems } = useGrocery();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('grocery');

  // Get ingredients from grocery list
  const groceryIngredients = groceryItems.map(item => item.name);

  // Search results from ingredient database
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    return findIngredientMatches(searchTerm).slice(0, 20);
  }, [searchTerm]);

  // Get ingredients by origin for tabs
  const indianIngredients = useMemo(() => getIngredientsByOrigin('Indian'), []);
  const internationalIngredients = useMemo(() => getIngredientsByOrigin('International'), []);
  const universalIngredients = useMemo(() => getIngredientsByOrigin('Universal'), []);

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
          <Search className="h-5 w-5" />
          Select Ingredients for Recipe Suggestions
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

        {/* Search Bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search ingredients (e.g., turmeric, avocado, pasta)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {searchResults.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {searchResults.map((ingredient, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-2 hover:bg-primary/10"
                  onClick={() => addIngredient(ingredient.name)}
                  disabled={selectedIngredients.includes(ingredient.name.toLowerCase())}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  <div className="text-left">
                    <div className="capitalize text-sm">{ingredient.name}</div>
                    <div className="text-xs text-muted-foreground">{ingredient.origin}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Ingredient Sources */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="grocery">
              <ShoppingCart className="h-4 w-4 mr-1" />
              My Groceries
            </TabsTrigger>
            <TabsTrigger value="indian">Indian</TabsTrigger>
            <TabsTrigger value="international">International</TabsTrigger>
            <TabsTrigger value="universal">Universal</TabsTrigger>
          </TabsList>

          <TabsContent value="grocery" className="space-y-3">
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
          </TabsContent>

          <TabsContent value="indian" className="space-y-3">
            <h4 className="font-medium text-foreground">Indian Ingredients</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
              {indianIngredients.map((ingredient, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-2 hover:bg-primary/10"
                  onClick={() => addIngredient(ingredient.name)}
                  disabled={selectedIngredients.includes(ingredient.name.toLowerCase())}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  <div className="text-left">
                    <div className="capitalize text-sm">{ingredient.name}</div>
                    <div className="text-xs text-muted-foreground">{ingredient.category}</div>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="international" className="space-y-3">
            <h4 className="font-medium text-foreground">International Ingredients</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
              {internationalIngredients.map((ingredient, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-2 hover:bg-primary/10"
                  onClick={() => addIngredient(ingredient.name)}
                  disabled={selectedIngredients.includes(ingredient.name.toLowerCase())}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  <div className="text-left">
                    <div className="capitalize text-sm">{ingredient.name}</div>
                    <div className="text-xs text-muted-foreground">{ingredient.category}</div>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="universal" className="space-y-3">
            <h4 className="font-medium text-foreground">Universal Ingredients</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
              {universalIngredients.map((ingredient, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="justify-start h-auto p-2 hover:bg-primary/10"
                  onClick={() => addIngredient(ingredient.name)}
                  disabled={selectedIngredients.includes(ingredient.name.toLowerCase())}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  <div className="text-left">
                    <div className="capitalize text-sm">{ingredient.name}</div>
                    <div className="text-xs text-muted-foreground">{ingredient.category}</div>
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AIIngredientsSelector;