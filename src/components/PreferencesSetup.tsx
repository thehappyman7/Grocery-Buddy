import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, Globe, Utensils, Leaf, DollarSign, MapPin, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useGeolocation } from '@/hooks/useGeolocation';
import type { UserLocation } from '@/context/PreferencesContext';

interface PreferencesSetupProps {
  onPreferencesSet: (location: UserLocation, cuisines: string[], isVegetarian: boolean, budget?: number) => void;
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
  const { location: geoLocation, loading: geoLoading, detectLocation } = useGeolocation();
  const [useAutoLocation, setUseAutoLocation] = useState<boolean>(true);
  const [manualCity, setManualCity] = useState<string>('');
  const [manualCountry, setManualCountry] = useState<string>('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [isVegetarian, setIsVegetarian] = useState<boolean>(false);
  const [budget, setBudget] = useState<string>('');

  useEffect(() => {
    if (useAutoLocation && !geoLocation) {
      detectLocation();
    }
  }, [useAutoLocation]);

  const handleCuisineToggle = (cuisine: string) => {
    setSelectedCuisines(prev => 
      prev.includes(cuisine) 
        ? prev.filter(c => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const handleSubmit = () => {
    const location: UserLocation = useAutoLocation && geoLocation
      ? {
          city: geoLocation.city,
          country: geoLocation.country,
          latitude: geoLocation.latitude,
          longitude: geoLocation.longitude,
          isAutoDetected: true
        }
      : {
          city: manualCity || undefined,
          country: manualCountry || undefined,
          isAutoDetected: false
        };

    if (selectedCuisines.length > 0 && (location.country || location.city)) {
      const budgetValue = budget ? parseFloat(budget) : undefined;
      onPreferencesSet(location, selectedCuisines, isVegetarian, budgetValue);
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
          {/* Location Detection */}
          <div>
            <label className="text-sm font-medium mb-3 block text-primary flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Your Location
            </label>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  <div>
                    <label className="text-sm font-medium text-primary">
                      Auto-detect Location
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Use your device's location for regional suggestions
                    </p>
                  </div>
                </div>
                <Switch
                  checked={useAutoLocation}
                  onCheckedChange={setUseAutoLocation}
                />
              </div>

              {useAutoLocation ? (
                <div className="p-4 border rounded-lg bg-accent/10">
                  {geoLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Detecting your location...
                    </div>
                  ) : geoLocation?.error ? (
                    <div className="text-sm text-destructive">
                      {geoLocation.error}. Please enter manually.
                    </div>
                  ) : geoLocation ? (
                    <div className="text-sm">
                      <p className="font-medium text-primary">Detected Location:</p>
                      <p className="text-muted-foreground">
                        {geoLocation.city && `${geoLocation.city}, `}
                        {geoLocation.country}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="space-y-3">
                  <Input
                    placeholder="Enter your city..."
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    className="border-border hover:border-primary transition-colors"
                  />
                  <Select value={manualCountry} onValueChange={setManualCountry}>
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
              )}
            </div>
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
            disabled={selectedCuisines.length === 0 || (useAutoLocation ? !geoLocation || !!geoLocation.error : !manualCountry)}
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