
import React from 'react';
import { GroceryProvider } from '@/context/GroceryContext';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ItemTyperTab from '@/components/ItemTyperTab';
import BrowseByCategoryTab from '@/components/BrowseByCategoryTab';
import AddItemsToCategoriesTab from '@/components/AddItemsToCategoriesTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  return (
    <GroceryProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 max-w-4xl bg-white rounded-xl shadow-sm p-6 md:p-8">
            <Header />
            
            <Tabs defaultValue="item-typer" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="item-typer">Item Typer</TabsTrigger>
                <TabsTrigger value="browse-category">Browse by Category</TabsTrigger>
                <TabsTrigger value="add-items">Add Items to Categories</TabsTrigger>
              </TabsList>
              
              <TabsContent value="item-typer" className="mt-6">
                <ItemTyperTab />
              </TabsContent>
              
              <TabsContent value="browse-category" className="mt-6">
                <BrowseByCategoryTab />
              </TabsContent>
              
              <TabsContent value="add-items" className="mt-6">
                <AddItemsToCategoriesTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <Footer />
      </div>
    </GroceryProvider>
  );
};

export default Index;
