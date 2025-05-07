
import React from 'react';
import GroceryItem from './GroceryItem';
import { GroceryItem as GroceryItemType } from '@/context/GroceryContext';

interface CategoryGroupProps {
  category: string;
  items: GroceryItemType[];
}

const CategoryGroup: React.FC<CategoryGroupProps> = ({ category, items }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">{category}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <GroceryItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default CategoryGroup;
