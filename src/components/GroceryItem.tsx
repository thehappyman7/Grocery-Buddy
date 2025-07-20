
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useGrocery, GroceryItem as GroceryItemType } from '@/context/GroceryContext';
import { cn } from '@/lib/utils';

interface GroceryItemProps {
  item: GroceryItemType;
}

const GroceryItem: React.FC<GroceryItemProps> = ({ item }) => {
  const { toggleItemSelection, updateQuantity } = useGrocery();

  return (
    <div 
      className={cn(
        "flex items-center justify-between p-4 border rounded-lg transition-all duration-200 mb-2",
        item.selected ? "border-primary bg-muted" : "border-border hover:border-primary"
      )}
    >
      <div className="flex items-center gap-3">
        <Checkbox 
          checked={item.selected}
          onCheckedChange={() => toggleItemSelection(item.id)}
          className={cn(
            "h-5 w-5 border-2 transition-colors",
            item.selected ? "border-primary data-[state=checked]:bg-primary" : "border-muted-foreground"
          )}
        />
        <span className={cn(
          "font-medium transition-all",
          item.selected ? "text-primary" : "text-foreground"
        )}>
          {item.name}
        </span>
        <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {item.category}
        </span>
      </div>
      <div className="w-24">
        <Input
          type="text"
          placeholder="Qty"
          value={item.quantity}
          onChange={(e) => updateQuantity(item.id, e.target.value)}
          className={cn(
            "text-center h-8",
            item.selected ? "border-primary" : "border-border"
          )}
        />
      </div>
    </div>
  );
};

export default GroceryItem;
