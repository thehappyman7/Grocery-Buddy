
import React from 'react';
import GroceryItem from './GroceryItem';
import { GroceryItem as GroceryItemType } from '@/context/GroceryContext';

interface CategoryGroupProps {
  category: string;
  items: GroceryItemType[];
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({ category, items }) => {
  return (
    <div className="mb-6 overflow-x-hidden">
      <h3 className="text-base sm:text-lg font-semibold mb-3 text-primary border-b pb-2 truncate">{category}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <GroceryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CategoryGroup;
