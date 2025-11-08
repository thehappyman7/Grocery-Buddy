
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useGrocery, GroceryItem as GroceryItemType } from '@/context/GroceryContext';
import IngredientButton from '@/components/ui/ingredient-button';
import { cn } from '@/lib/utils';

interface GroceryItemProps {
  item: GroceryItemType;
}

const GroceryItem: React.FC<GroceryItemProps> = ({ item }) => {
  const { toggleItemSelection, updateQuantity, deleteItem } = useGrocery();

  return (
    <div 
      className={cn(
        "flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg transition-all duration-200 mb-2 gap-3",
        item.selected ? "border-primary bg-muted" : "border-border hover:border-primary"
      )}
    >
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <Checkbox 
          checked={item.selected}
          onCheckedChange={() => toggleItemSelection(item.id)}
          className={cn(
            "h-5 w-5 border-2 transition-colors shrink-0",
            item.selected ? "border-primary data-[state=checked]:bg-primary" : "border-muted-foreground"
          )}
        />
        <span className={cn(
          "font-medium transition-all truncate",
          item.selected ? "text-primary" : "text-foreground"
        )}>
          {item.name}
        </span>
        <span className="text-xs sm:text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">
          {item.category}
        </span>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex-1 sm:flex-initial sm:w-24">
          <Input
            type="text"
            placeholder="Qty"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, e.target.value)}
            className={cn(
              "text-center h-8 w-full",
              item.selected ? "border-primary" : "border-border"
            )}
          />
        </div>
        <IngredientButton
          variant="delete"
          itemName={item.name}
          onAction={() => deleteItem(item.id)}
          size="sm"
        />
      </div>
    </div>
  );
};

export default GroceryItem;
