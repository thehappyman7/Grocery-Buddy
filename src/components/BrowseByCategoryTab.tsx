import React, { useState, useEffect } from 'react';
import PreferencesSetup from './PreferencesSetup';
import DynamicCategoryBrowser from './DynamicCategoryBrowser';
import GroceryList from './GroceryList';

const BrowseByCategoryTab = () => {
  const [preferences, setPreferences] = useState<{country: string, cuisines: string[], isVegetarian: boolean, budget?: number} | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('groceryBuddyPreferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    } else {
      setShowPreferences(true);
    }
  }, []);

  const handlePreferencesSet = (country: string, cuisines: string[], isVegetarian: boolean, budget?: number) => {
    const newPreferences = { country, cuisines, isVegetarian, budget };
    setPreferences(newPreferences);
    localStorage.setItem('groceryBuddyPreferences', JSON.stringify(newPreferences));
    setShowPreferences(false);
  };

  const handleChangePreferences = () => {
    setShowPreferences(true);
  };

  // Show preferences setup if no preferences or user wants to change them
  if (showPreferences || !preferences) {
    return (
      <div className="space-y-6">
        <PreferencesSetup 
          onPreferencesSet={handlePreferencesSet}
          isChangingPreferences={!!preferences}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Category Browser Section */}
      <DynamicCategoryBrowser
        country={preferences.country}
        cuisines={preferences.cuisines}
        isVegetarian={preferences.isVegetarian}
        budget={preferences.budget}
        onChangePreferences={handleChangePreferences}
      />

      {/* Cart View Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-primary border-b pb-2">
          Your Cart
        </h2>
        <GroceryList />
      </div>
    </div>
  );
};

export default BrowseByCategoryTab;