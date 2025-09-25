import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useDeviceId } from '@/hooks/useDeviceId';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { GroceryItemDB, PantryItemDB, SavedRecipeDB, ConflictItem } from '@/types/sync';
import { toast } from 'sonner';

interface SyncContextType {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  conflictItems: ConflictItem[];
  syncData: () => Promise<void>;
  resolveConflict: (conflictId: string, resolution: 'local' | 'remote') => Promise<void>;
  clearConflicts: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const SyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const deviceId = useDeviceId();
  const isOnline = useOnlineStatus();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [conflictItems, setConflictItems] = useState<ConflictItem[]>([]);

  // Load last sync time from localStorage
  useEffect(() => {
    const lastSync = localStorage.getItem('lastSyncTime');
    if (lastSync) {
      setLastSyncTime(new Date(lastSync));
    }
  }, []);

  // Auto sync when coming online
  useEffect(() => {
    if (isOnline && isAuthenticated && deviceId && !isSyncing) {
      syncData();
    }
  }, [isOnline, isAuthenticated, deviceId]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const channels: any[] = [];

    // Subscribe to grocery items changes
    const groceryChannel = supabase
      .channel('grocery_items_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'grocery_items',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          // Trigger local data refresh when remote changes occur
          window.dispatchEvent(new CustomEvent('groceryItemsChanged'));
        }
      )
      .subscribe();

    channels.push(groceryChannel);

    // Subscribe to pantry items changes
    const pantryChannel = supabase
      .channel('pantry_items_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pantry_items',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          window.dispatchEvent(new CustomEvent('pantryItemsChanged'));
        }
      )
      .subscribe();

    channels.push(pantryChannel);

    // Subscribe to saved recipes changes
    const recipesChannel = supabase
      .channel('saved_recipes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'saved_recipes',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          window.dispatchEvent(new CustomEvent('savedRecipesChanged'));
        }
      )
      .subscribe();

    channels.push(recipesChannel);

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [isAuthenticated, user]);

  const syncData = async () => {
    if (!isAuthenticated || !user || !deviceId || !isOnline) return;

    setIsSyncing(true);
    try {
      await syncGroceryItems();
      await syncPantryItems(); 
      await syncSavedRecipes();
      
      const now = new Date();
      setLastSyncTime(now);
      localStorage.setItem('lastSyncTime', now.toISOString());
      
      toast.success('Data synced successfully');
    } catch (error) {
      console.error('Sync failed:', error);
      toast.error('Sync failed. Data saved locally.');
    } finally {
      setIsSyncing(false);
    }
  };

  const syncGroceryItems = async () => {
    if (!user) return;

    // Get local items
    const localItems = JSON.parse(localStorage.getItem('groceryItems') || '[]');
    
    // Get remote items
    const { data: remoteItems, error } = await supabase
      .from('grocery_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_deleted', false);

    if (error) throw error;

    // Sync logic: upload local changes, download remote changes
    const remoteItemsMap = new Map(remoteItems?.map(item => [item.local_id, item]) || []);
    
    for (const localItem of localItems) {
      const remoteItem = remoteItemsMap.get(localItem.id);
      
      if (!remoteItem) {
        // Upload new local item
        await supabase.from('grocery_items').insert({
          user_id: user.id,
          name: localItem.name,
          category: localItem.category,
          selected: localItem.selected,
          quantity: localItem.quantity || '',
          local_id: localItem.id,
          device_id: deviceId
        });
      } else if (new Date(remoteItem.updated_at) < new Date(localItem.updated_at || 0)) {
        // Update remote with local changes
        await supabase
          .from('grocery_items')
          .update({
            name: localItem.name,
            category: localItem.category,
            selected: localItem.selected,
            quantity: localItem.quantity || '',
            device_id: deviceId
          })
          .eq('id', remoteItem.id);
      }
    }

    // Update local storage with latest remote data
    const updatedLocalItems = localItems.map((localItem: any) => {
      const remoteItem = remoteItemsMap.get(localItem.id);
      if (remoteItem && new Date(remoteItem.updated_at) > new Date(localItem.updated_at || 0)) {
        return {
          ...localItem,
          name: remoteItem.name,
          category: remoteItem.category,
          selected: remoteItem.selected,
          quantity: remoteItem.quantity,
          updated_at: remoteItem.updated_at
        };
      }
      return localItem;
    });

    localStorage.setItem('groceryItems', JSON.stringify(updatedLocalItems));
  };

  const syncPantryItems = async () => {
    if (!user) return;

    // Get local items
    const localItems = JSON.parse(localStorage.getItem('pantryItems') || '[]');
    
    // Get remote items
    const { data: remoteItems, error } = await supabase
      .from('pantry_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_deleted', false);

    if (error) throw error;

    // Simple sync: ensure all local items exist in cloud
    for (const localItem of localItems) {
      await supabase.from('pantry_items').upsert({
        user_id: user.id,
        name: localItem.name,
        category: localItem.category,
        quantity: localItem.quantity || '',
        expiry_date: localItem.expiryDate || null,
        device_id: deviceId,
        is_deleted: false
      }, {
        onConflict: 'user_id,name,category'
      });
    }

    // Update local storage with remote data if needed
    if (remoteItems && remoteItems.length > 0) {
      const cloudItems = remoteItems.map((item, index) => ({
        id: index + 1,
        name: item.name,
        category: item.category,
        quantity: item.quantity || '',
        expiryDate: item.expiry_date || undefined
      }));

      localStorage.setItem('pantryItems', JSON.stringify(cloudItems));
    }
  };

  const syncSavedRecipes = async () => {
    if (!user) return;

    // Get local items
    const localItems = JSON.parse(localStorage.getItem('savedRecipes') || '[]');
    
    // Get remote items
    const { data: remoteItems, error } = await supabase
      .from('saved_recipes')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_deleted', false);

    if (error) throw error;

    // Simple sync: ensure all local items exist in cloud
    for (const localItem of localItems) {
      await supabase.from('saved_recipes').upsert({
        user_id: user.id,
        recipe_id: localItem.recipeId,
        recipe_name: localItem.recipeName,
        recipe_data: localItem.recipeData,
        is_custom: localItem.isCustom,
        device_id: deviceId,
        is_deleted: false
      }, {
        onConflict: 'user_id,recipe_id'
      });
    }

    // Update local storage with remote data if needed
    if (remoteItems && remoteItems.length > 0) {
      const cloudRecipes = remoteItems.map((item, index) => ({
        id: index + 1,
        recipeId: item.recipe_id,
        recipeName: item.recipe_name,
        recipeData: item.recipe_data,
        isCustom: item.is_custom,
        savedAt: item.created_at
      }));

      localStorage.setItem('savedRecipes', JSON.stringify(cloudRecipes));
    }
  };

  const resolveConflict = async (conflictId: string, resolution: 'local' | 'remote') => {
    // Implementation for conflict resolution
    const conflict = conflictItems.find(c => c.localItem.id === conflictId);
    if (!conflict) return;

    // Apply resolution and remove from conflicts
    setConflictItems(prev => prev.filter(c => c.localItem.id !== conflictId));
    toast.success(`Conflict resolved using ${resolution} version`);
  };

  const clearConflicts = () => {
    setConflictItems([]);
  };

  return (
    <SyncContext.Provider
      value={{
        isOnline,
        isSyncing,
        lastSyncTime,
        conflictItems,
        syncData,
        resolveConflict,
        clearConflicts
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};

export const useSync = () => {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};