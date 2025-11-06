-- Add price column to grocery_items table
ALTER TABLE grocery_items 
ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2) DEFAULT 0.00;