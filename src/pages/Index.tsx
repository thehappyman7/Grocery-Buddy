
import React from 'react';
import { GroceryProvider } from '@/context/GroceryContext';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import ItemTyperTab from '@/components/ItemTyperTab';
import WhatCanICookTab from '@/components/WhatCanICookTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  return (
    <GroceryProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-muted/20 via-background to-accent/10 overflow-x-hidden">
        <Navigation />
        <main className="flex-grow py-4 sm:py-8 w-full">
          <div className="container mx-auto px-3 sm:px-4 max-w-4xl bg-background/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-border p-4 sm:p-6 md:p-8 overflow-x-hidden">
            <Header />
            
            <Tabs defaultValue="add-items" className="mt-4 sm:mt-6">
              <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-lg sm:rounded-xl h-auto">
                <TabsTrigger 
                  value="add-items" 
                  className="rounded-md sm:rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md font-medium text-xs sm:text-sm py-2 sm:py-2.5"
                >
                  Add Items
                </TabsTrigger>
                <TabsTrigger 
                  value="what-can-i-cook" 
                  className="rounded-md sm:rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md font-medium text-xs sm:text-sm py-2 sm:py-2.5"
                >
                  Chef Mode
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="add-items" className="mt-4 sm:mt-6">
                <ItemTyperTab />
              </TabsContent>
              
              <TabsContent value="what-can-i-cook" className="mt-4 sm:mt-6">
                <WhatCanICookTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </GroceryProvider>
  );
};

export default Index;
