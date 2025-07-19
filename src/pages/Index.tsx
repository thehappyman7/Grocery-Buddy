
import React from 'react';
import { GroceryProvider } from '@/context/GroceryContext';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import ItemTyperTab from '@/components/ItemTyperTab';
import BrowseByCategoryTab from '@/components/BrowseByCategoryTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  return (
    <GroceryProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-grocery-blue-light via-background to-grocery-orange-light">
        <Navigation />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 max-w-4xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 md:p-8">
            <Header />
            
            <Tabs defaultValue="add-items" className="mt-6">
              <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-grocery-purple-light to-grocery-blue-light p-1 rounded-xl">
                <TabsTrigger value="add-items" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-grocery-purple data-[state=active]:shadow-md font-medium">
                  🛒 Add Items
                </TabsTrigger>
                <TabsTrigger value="browse-category" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-grocery-blue data-[state=active]:shadow-md font-medium">
                  🔍 Browse by Category
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="add-items" className="mt-6">
                <ItemTyperTab />
              </TabsContent>
              
              <TabsContent value="browse-category" className="mt-6">
                <BrowseByCategoryTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </GroceryProvider>
  );
};

export default Index;
