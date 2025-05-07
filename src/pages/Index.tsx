
import React from 'react';
import { GroceryProvider } from '@/context/GroceryContext';
import Header from '@/components/Header';
import GroceryList from '@/components/GroceryList';
import AddGroceryForm from '@/components/AddGroceryForm';

const Index = () => {
  return (
    <GroceryProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-3xl bg-white rounded-xl shadow-sm p-6 md:p-8">
          <Header />
          <AddGroceryForm />
          <GroceryList />
        </div>
      </div>
    </GroceryProvider>
  );
};

export default Index;
