import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf } from 'lucide-react';

export interface RecipeFilters {
  isVegetarian: boolean;
  cuisine: string;
  budget: number;
}

interface RecipeFiltersProps {
  filters: RecipeFilters;
  onFiltersChange: (filters: RecipeFilters) => void;
}

const RecipeFiltersComponent: React.FC<RecipeFiltersProps> = ({ filters, onFiltersChange }) => {
  const updateFilter = (key: keyof RecipeFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id="vegetarian"
              checked={filters.isVegetarian}
              onCheckedChange={(checked) => updateFilter('isVegetarian', checked)}
            />
            <Label htmlFor="vegetarian" className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-green-600" />
              Vegetarian Only
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="cuisine" className="whitespace-nowrap">Cuisine:</Label>
            <Select value={filters.cuisine} onValueChange={(value) => updateFilter('cuisine', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Cuisines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="International">International</SelectItem>
                <SelectItem value="Fusion">Fusion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-4 min-w-40">
            <Label htmlFor="budget" className="whitespace-nowrap">Budget: ₹{filters.budget}</Label>
            <Slider
              id="budget"
              min={50}
              max={500}
              step={50}
              value={[filters.budget]}
              onValueChange={(value) => updateFilter('budget', value[0])}
              className="flex-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeFiltersComponent;