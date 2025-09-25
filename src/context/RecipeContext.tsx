import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useDeviceId } from '@/hooks/useDeviceId';

export interface SavedRecipe {
  id: number;
  recipeId: string;
  recipeName: string;
  recipeData: any;
  isCustom: boolean;
  savedAt: string;
}

interface RecipeContextType {
  savedRecipes: SavedRecipe[];
  saveRecipe: (recipeId: string, recipeName: string, recipeData: any, isCustom?: boolean) => void;
  removeRecipe: (id: number) => void;
  clearAll: () => void;
  isRecipeSaved: (recipeId: string) => boolean;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const deviceId = useDeviceId();
  
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>(() => {
    const savedItems = localStorage.getItem('savedRecipes');
    if (savedItems) {
      try {
        return JSON.parse(savedItems);
      } catch (error) {
        console.error("Error parsing saved recipes from localStorage:", error);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage and sync to cloud when recipes change
  useEffect(() => {
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    
    if (isAuthenticated && user && deviceId && navigator.onLine) {
      syncToCloud();
    }
  }, [savedRecipes, isAuthenticated, user, deviceId]);

  // Listen for real-time changes
  useEffect(() => {
    const handleSavedRecipesChanged = () => {
      loadFromCloud();
    };

    window.addEventListener('savedRecipesChanged', handleSavedRecipesChanged);
    return () => window.removeEventListener('savedRecipesChanged', handleSavedRecipesChanged);
  }, []);

  // Load from cloud when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadFromCloud();
    }
  }, [isAuthenticated, user]);

  const syncToCloud = async () => {
    if (!user || !deviceId) return;

    try {
      for (const recipe of savedRecipes) {
        const { error } = await supabase
          .from('saved_recipes')
          .upsert({
            user_id: user.id,
            recipe_id: recipe.recipeId,
            recipe_name: recipe.recipeName,
            recipe_data: recipe.recipeData,
            is_custom: recipe.isCustom,
            device_id: deviceId,
            is_deleted: false
          }, {
            onConflict: 'user_id,recipe_id'
          });

        if (error) {
          console.error('Recipe sync error:', error);
        }
      }
    } catch (error) {
      console.error('Recipe cloud sync failed:', error);
    }
  };

  const loadFromCloud = async () => {
    if (!user || !isAuthenticated) return;

    try {
      const { data, error } = await supabase
        .from('saved_recipes')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const cloudRecipes: SavedRecipe[] = data.map((item, index) => ({
          id: index + 1,
          recipeId: item.recipe_id,
          recipeName: item.recipe_name,
          recipeData: item.recipe_data,
          isCustom: item.is_custom,
          savedAt: item.created_at
        }));

        setSavedRecipes(cloudRecipes);
      }
    } catch (error) {
      console.error('Failed to load saved recipes from cloud:', error);
    }
  };

  const saveRecipe = (recipeId: string, recipeName: string, recipeData: any, isCustom: boolean = false) => {
    // Check if recipe already saved
    if (savedRecipes.some(recipe => recipe.recipeId === recipeId)) {
      toast.info('Recipe already saved!');
      return;
    }

    const newId = savedRecipes.length > 0 ? Math.max(...savedRecipes.map(recipe => recipe.id)) + 1 : 1;
    const newRecipe: SavedRecipe = {
      id: newId,
      recipeId,
      recipeName,
      recipeData,
      isCustom,
      savedAt: new Date().toISOString()
    };
    
    setSavedRecipes(prev => [newRecipe, ...prev]);
    toast.success(`${recipeName} saved to your recipes!`);
  };

  const removeRecipe = (id: number) => {
    const recipe = savedRecipes.find(recipe => recipe.id === id);
    setSavedRecipes(prev => prev.filter(recipe => recipe.id !== id));
    if (recipe) {
      toast.success(`${recipe.recipeName} removed from saved recipes`);
    }
  };

  const clearAll = () => {
    const recipeCount = savedRecipes.length;
    setSavedRecipes([]);
    toast.success(`Cleared ${recipeCount} saved recipes`);
  };

  const isRecipeSaved = (recipeId: string) => {
    return savedRecipes.some(recipe => recipe.recipeId === recipeId);
  };

  return (
    <RecipeContext.Provider
      value={{
        savedRecipes,
        saveRecipe,
        removeRecipe,
        clearAll,
        isRecipeSaved
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error('useRecipes must be used within a RecipeProvider');
  }
  return context;
};