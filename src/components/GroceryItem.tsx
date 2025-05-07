
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useGrocery, GroceryItem as GroceryItemType } from '@/context/GroceryContext';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface GroceryItemProps {
  item: GroceryItemType;
}

const GroceryItem: React.FC<GroceryItemProps> = ({ item }) => {
  const { toggleItemSelection, updateQuantity, deleteItem } = useGrocery();

  return (
    <div 
      className={cn(
        "flex items-center justify-between p-4 border rounded-lg transition-all duration-200 mb-2",
        item.selected ? "border-grocery-purple bg-grocery-purple-light" : "border-gray-200 hover:border-grocery-green"
      )}
    >
      <div className="flex items-center gap-3">
        <Checkbox 
          checked={item.selected}
          onCheckedChange={() => toggleItemSelection(item.id)}
          className={cn(
            "h-5 w-5 border-2 transition-colors",
            item.selected ? "border-grocery-purple data-[state=checked]:bg-grocery-purple" : "border-gray-300"
          )}
        />
        <span className={cn(
          "font-medium transition-all",
          item.selected ? "text-grocery-purple" : "text-gray-700"
        )}>
          {item.name}
        </span>
        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
          {item.category}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="Qty"
          value={item.quantity}
          onChange={(e) => updateQuantity(item.id, e.target.value)}
          className={cn(
            "text-center h-8 w-24",
            item.selected ? "border-grocery-purple" : "border-gray-200"
          )}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => deleteItem(item.id)} 
          className="hover:bg-red-50 hover:text-red-500 h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default GroceryItem;
