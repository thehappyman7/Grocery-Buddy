
import React from 'react';
import { useGrocery } from '@/context/GroceryContext';
import CategoryGroup from './CategoryGroup';

const GroceryList: React.FC = () => {
  const { groceryItems } = useGrocery();
  
  // Group items by category
  const groupedItems = groceryItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof groceryItems>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([category, items]) => (
        <CategoryGroup key={category} category={category} items={items} />
      ))}
    </div>
  );
};

export default GroceryList;
