import React, { useState } from 'react';
import AddGroceryForm from '@/components/AddGroceryForm';
import GroceryList from '@/components/GroceryList';
import PreferencesSetup from './PreferencesSetup';
import DynamicCategoryBrowser from './DynamicCategoryBrowser';
import { usePreferences } from '@/context/PreferencesContext';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ItemTyperTab = () => {
  const [showAddForm, setShowAddForm] = useState(true);
  const { preferences, setPreferences, isPreferencesSet } = usePreferences();
  const [showPreferences, setShowPreferences] = useState(!isPreferencesSet);

  const toggleAddForm = () => {
    setShowAddForm(!showAddForm);
  };

  const handlePreferencesSet = (country: string, cuisines: string[], isVegetarian: boolean, budget?: number) => {
    const newPreferences = { country, cuisines, isVegetarian, budget };
    setPreferences(newPreferences);
    setShowPreferences(false);
  };

  const handleChangePreferences = () => {
    setShowPreferences(true);
  };

  return (
    <div className="space-y-8">
      <style>
        {`
        @keyframes highlight {
          0% { background-color: rgba(155, 135, 245, 0.1); }
          50% { background-color: rgba(155, 135, 245, 0.3); }
          100% { background-color: rgba(155, 135, 245, 0.1); }
        }
        .highlight-form {
          animation: highlight 1s ease-in-out;
        }
        `}
      </style>
      
      {/* Manual Add Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Add New Items</h2>
          <Button
            onClick={toggleAddForm}
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-primary to-primary text-white border-0 hover:from-primary/80 hover:to-primary/80 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
          >
            {showAddForm ? (
              <>
                <X className="h-4 w-4" /> Hide Form
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" /> Show Form
              </>
            )}
          </Button>
        </div>
        
        {showAddForm && <AddGroceryForm />}
      </div>

      <Separator className="my-8" />

      {/* Browse by Category Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Browse by Category</h2>
        <p className="text-sm text-muted-foreground">
          Or select items from personalized categories based on your preferences
        </p>
        
        {showPreferences || !preferences ? (
          <PreferencesSetup 
            onPreferencesSet={handlePreferencesSet}
            isChangingPreferences={!!preferences}
          />
        ) : (
          <DynamicCategoryBrowser
            country={preferences.country}
            cuisines={preferences.cuisines}
            isVegetarian={preferences.isVegetarian}
            budget={preferences.budget}
            onChangePreferences={handleChangePreferences}
          />
        )}
      </div>

      <Separator className="my-8" />

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

export default ItemTyperTab;