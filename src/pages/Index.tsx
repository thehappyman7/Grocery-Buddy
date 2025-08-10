
import React from 'react';
import { GroceryProvider } from '@/context/GroceryContext';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import ItemTyperTab from '@/components/ItemTyperTab';

const Index = () => {
  return (
    <GroceryProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-muted/20 via-background to-accent/10">
        <Navigation />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 max-w-4xl bg-background/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6 md:p-8">
            <Header />
            
            {/* Direct grocery list without tabs */}
            <div className="mt-6">
              <ItemTyperTab />
            </div>
          </div>
        </main>
      </div>
    </GroceryProvider>
  );
};

export default Index;
