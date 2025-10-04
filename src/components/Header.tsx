
import React from 'react';
import { Button } from "@/components/ui/button";
import { useGrocery } from '@/context/GroceryContext';
import { ShoppingCart, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Header: React.FC = () => {
  const { selectedItemsCount, clearAllSelections, deleteAllItems } = useGrocery();
  
  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-4 mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">My Grocery List</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">Select items you need and add quantities for your shopping trip.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {selectedItemsCount > 0 && (
            <span className="bg-primary text-primary-foreground px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {selectedItemsCount} selected
            </span>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAllSelections}
            className="border-primary text-primary hover:bg-muted text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
          >
            Clear All
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" /> 
                <span className="hidden xs:inline">Delete All</span>
                <span className="xs:hidden">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base sm:text-lg">Delete all grocery items?</AlertDialogTitle>
                <AlertDialogDescription className="text-sm">
                  This will permanently delete all items from your grocery list. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                <AlertDialogCancel className="m-0">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAllItems}>Delete All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  );
};

export default Header;
