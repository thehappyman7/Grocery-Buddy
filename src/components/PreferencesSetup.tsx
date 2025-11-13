import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, Globe, Utensils, Leaf, DollarSign } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';

interface PreferencesSetupProps {
  onPreferencesSet: (country: string, cuisines: string[], isVegetarian: boolean, budget?: number) => void;
  isChangingPreferences?: boolean;
}

const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
  'Italy', 'France', 'Spain', 'Germany', 'Japan', 'China', 'Mexico',
  'Brazil', 'Thailand', 'Greece', 'Turkey', 'Other'
];

const CUISINES = [
  'Indian', 'Italian', 'Chinese', 'Mexican', 'Mediterranean',
  'Thai', 'Japanese', 'French', 'Spanish', 'American',
  'Korean', 'Vietnamese', 'Greek', 'Turkish', 'Lebanese',
  'Brazilian', 'German', 'British', 'Moroccan', 'Ethiopian'
];

const PreferencesSetup: React.FC<PreferencesSetupProps> = ({ 
  onPreferencesSet, 
  isChangingPreferences = false 
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [isVegetarian, setIsVegetarian] = useState<boolean>(false);
  const [budget, setBudget] = useState<string>('');

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const handleSubmit = () => {
    if (selectedCountry && selectedCuisines.length > 0) {
      const budgetValue = budget ? parseFloat(budget) : undefined;
      onPreferencesSet(selectedCountry, selectedCuisines, isVegetarian, budgetValue);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border bg-card shadow-lg">
        <CardHeader className="bg-primary rounded-t-lg">
          <CardTitle className="text-lg text-primary-foreground flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {isChangingPreferences ? 'Change Your Preferences' : 'Set Your Preferences'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Country Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block text-primary flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Country or Region
            </label>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="border-border hover:border-primary transition-colors">
                <SelectValue placeholder="Select your country..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-xl z-50 rounded-lg max-h-64">
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country} className="hover:bg-accent">
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cuisine Preferences */}
          <div>
            <label className="text-sm font-medium mb-3 block text-primary flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Preferred Cuisines (Select multiple)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto border rounded-lg p-4 bg-muted/20">
              {CUISINES.map((cuisine) => (
                <div key={cuisine} className="flex items-center space-x-2">
                  <Checkbox
                    id={cuisine}
                    checked={selectedCuisines.includes(cuisine)}
                    onCheckedChange={() => handleCuisineToggle(cuisine)}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <label 
                    htmlFor={cuisine} 
                    className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                  >
                    {cuisine}
                  </label>
                </div>
              ))}
            </div>
            {selectedCuisines.length > 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                Selected: {selectedCuisines.join(', ')}
              </p>
            )}
          </div>

          {/* Vegetarian Mode Toggle */}
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center gap-3">
              <Leaf className="h-5 w-5 text-green-600" />
              <div>
                <label className="text-sm font-medium text-primary">
                  Vegetarian Only
                </label>
                <p className="text-xs text-muted-foreground">
                  Filter out all non-vegetarian ingredients
                </p>
              </div>
            </div>
            <Switch
              checked={isVegetarian}
              onCheckedChange={setIsVegetarian}
              className="data-[state=checked]:bg-green-600"
            />
          </div>

          {/* Budget Entry */}
          <div>
            <label className="text-sm font-medium mb-3 block text-primary flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Weekly Budget (Optional)
            </label>
            <Input
              type="number"
              placeholder="Enter your weekly grocery budget..."
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="border-border hover:border-primary transition-colors"
            />
            <p className="text-xs text-muted-foreground mt-2">
              We'll help you track spending and suggest budget-friendly alternatives
            </p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selectedCountry || selectedCuisines.length === 0}
            className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
          >
            {isChangingPreferences ? 'Update Preferences' : 'Set Preferences & Continue'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PreferencesSetup;