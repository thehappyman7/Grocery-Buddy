import React, { useState } from 'react';
import PreferencesSetup from './PreferencesSetup';
import DynamicCategoryBrowser from './DynamicCategoryBrowser';
import GroceryList from './GroceryList';
import { usePreferences } from '@/context/PreferencesContext';

const BrowseByCategoryTab = () => {
  const { preferences, setPreferences, isPreferencesSet } = usePreferences();
  const [showPreferences, setShowPreferences] = useState(!isPreferencesSet);

  const handlePreferencesSet = (country: string, cuisines: string[], isVegetarian: boolean, budget?: number) => {
    const newPreferences = { country, cuisines, isVegetarian, budget };
    setPreferences(newPreferences);
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