-- Create tables for grocery items, pantry items, and recipes with user sync
-- First create the profiles table to store user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create grocery_items table
CREATE TABLE public.grocery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  selected BOOLEAN NOT NULL DEFAULT false,
  quantity TEXT DEFAULT '',
  local_id INTEGER, -- for syncing with local storage IDs
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  device_id TEXT, -- to track which device made changes
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS on grocery_items
ALTER TABLE public.grocery_items ENABLE ROW LEVEL SECURITY;

-- Create policies for grocery_items
CREATE POLICY "Users can view their own grocery items" 
ON public.grocery_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own grocery items" 
ON public.grocery_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own grocery items" 
ON public.grocery_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own grocery items" 
ON public.grocery_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create pantry_items table
CREATE TABLE public.pantry_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity TEXT DEFAULT '',
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  device_id TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

-- Enable RLS on pantry_items
ALTER TABLE public.pantry_items ENABLE ROW LEVEL SECURITY;

-- Create policies for pantry_items
CREATE POLICY "Users can view their own pantry items" 
ON public.pantry_items 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own pantry items" 
ON public.pantry_items 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pantry items" 
ON public.pantry_items 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pantry items" 
ON public.pantry_items 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create saved_recipes table
CREATE TABLE public.saved_recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id TEXT NOT NULL, -- reference to recipe database ID
  recipe_name TEXT NOT NULL,
  recipe_data JSONB NOT NULL, -- store complete recipe data
  is_custom BOOLEAN NOT NULL DEFAULT false, -- for user-created recipes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  device_id TEXT,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, recipe_id)
);

-- Enable RLS on saved_recipes
ALTER TABLE public.saved_recipes ENABLE ROW LEVEL SECURITY;

-- Create policies for saved_recipes
CREATE POLICY "Users can view their own saved recipes" 
ON public.saved_recipes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved recipes" 
ON public.saved_recipes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved recipes" 
ON public.saved_recipes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved recipes" 
ON public.saved_recipes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create sync_metadata table for conflict resolution
CREATE TABLE public.sync_metadata (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  last_sync_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1,
  device_id TEXT NOT NULL,
  conflict_resolution_needed BOOLEAN NOT NULL DEFAULT false,
  UNIQUE(user_id, table_name, record_id, device_id)
);

-- Enable RLS on sync_metadata
ALTER TABLE public.sync_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for sync_metadata
CREATE POLICY "Users can view their own sync metadata" 
ON public.sync_metadata 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sync metadata" 
ON public.sync_metadata 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sync metadata" 
ON public.sync_metadata 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create function to handle automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_grocery_items_updated_at
  BEFORE UPDATE ON public.grocery_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pantry_items_updated_at
  BEFORE UPDATE ON public.pantry_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_saved_recipes_updated_at
  BEFORE UPDATE ON public.saved_recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER TABLE public.grocery_items REPLICA IDENTITY FULL;
ALTER TABLE public.pantry_items REPLICA IDENTITY FULL;
ALTER TABLE public.saved_recipes REPLICA IDENTITY FULL;
ALTER TABLE public.sync_metadata REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.grocery_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.pantry_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.saved_recipes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sync_metadata;