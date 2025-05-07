
import React from 'react';
import { GroceryProvider } from '@/context/GroceryContext';
import Header from '@/components/Header';
import GroceryList from '@/components/GroceryList';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <GroceryProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navigation />
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4 max-w-3xl bg-white rounded-xl shadow-sm p-6 md:p-8">
            <style>
              {`
              @keyframes highlight {
                0% { background-color: rgba(155, 135, 245, 0.1); }
                50% { background-color: rgba(155, 135, 245, 0.3); }
                100% { background-color: rgba(155, 135, 245, 0.1); }
              }
              .highlight-form {
                animation: highlight 1s ease-in-out;
              }
              `}
            </style>
            <Header />
            <GroceryList />
          </div>
        </main>
        <Footer />
      </div>
    </GroceryProvider>
  );
};

export default Index;
