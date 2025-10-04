
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
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-muted/20 via-background to-accent/10">
        <Navigation />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 max-w-4xl bg-background/90 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-6 md:p-8">
            <Header />
            
            <Tabs defaultValue="add-items" className="mt-6">
              <TabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-xl">
                <TabsTrigger value="add-items" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md font-medium">
                  Add Items
                </TabsTrigger>
                <TabsTrigger value="what-can-i-cook" className="rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md font-medium">
                  Chef Mode
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="add-items" className="mt-6">
                <ItemTyperTab />
              </TabsContent>
              
              <TabsContent value="what-can-i-cook" className="mt-6">
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
