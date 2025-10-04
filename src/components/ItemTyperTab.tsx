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
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Add New Items</h2>
          <Button
            onClick={toggleAddForm}
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-primary to-primary text-white border-0 hover:from-primary/80 hover:to-primary/80 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2.5 sm:px-3"
          >
            {showAddForm ? (
              <>
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> 
                <span className="hidden xs:inline">Hide Form</span>
                <span className="xs:hidden">Hide</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> 
                <span className="hidden xs:inline">Show Form</span>
                <span className="xs:hidden">Show</span>
              </>
            )}
          </Button>
        </div>
        
        {showAddForm && <AddGroceryForm />}
      </div>

      <Separator className="my-6 sm:my-8" />

      {/* Browse by Category Section */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">Browse by Category</h2>
        <p className="text-xs sm:text-sm text-muted-foreground">
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

      <Separator className="my-6 sm:my-8" />

      {/* Cart View Section */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-base sm:text-lg font-semibold text-primary border-b pb-2">
          Your Cart
        </h2>
        <GroceryList />
      </div>
    </div>
  );
};

export default ItemTyperTab;