
import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-grocery-purple" />
            <span className="text-xl font-semibold text-gray-800">GroceryBuddy</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-grocery-purple transition-colors">Home</Link>
            <Link to="/" className="text-gray-700 hover:text-grocery-purple transition-colors">Categories</Link>
            <Link to="/" className="text-gray-700 hover:text-grocery-purple transition-colors">Recipe Ideas</Link>
            <Link to="/" className="text-gray-700 hover:text-grocery-purple transition-colors">About</Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              className="hidden md:flex border-grocery-purple text-grocery-purple hover:bg-grocery-purple-light"
            >
              Sign In
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="hidden md:flex bg-grocery-purple hover:bg-grocery-purple/90"
            >
              Get Started
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-gray-700"
              aria-label="Menu"
            >
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
