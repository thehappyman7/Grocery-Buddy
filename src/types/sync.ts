export interface SyncableItem {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  device_id?: string;
  is_deleted: boolean;
}

export interface GroceryItemDB extends SyncableItem {
  name: string;
  category: string;
  selected: boolean;
  quantity: string;
  local_id?: number;
}

export interface PantryItemDB extends SyncableItem {
  name: string;
  category: string;
  quantity: string;
  expiry_date?: string;
}

export interface SavedRecipeDB extends SyncableItem {
  recipe_id: string;
  recipe_name: string;
  recipe_data: any;
  is_custom: boolean;
}

export interface SyncMetadata {
  id: string;
  user_id: string;
  table_name: string;
  record_id: string;
  last_sync_at: string;
  version: number;
  device_id: string;
  conflict_resolution_needed: boolean;
}

export interface ConflictItem {
  localItem: any;
  remoteItem: any;
  tableName: string;
  conflictType: 'update' | 'delete';
}