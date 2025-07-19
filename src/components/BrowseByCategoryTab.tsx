import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GroceryList from './GroceryList';

const BrowseByCategoryTab = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Browse by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <GroceryList />
        </CardContent>
      </Card>
    </div>
  );
};

export default BrowseByCategoryTab;