
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
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h1 className="text-3xl font-bold text-primary">My Grocery List</h1>
          </div>
          <p className="text-muted-foreground">Select items you need and add quantities for your shopping trip.</p>
        </div>
        
        <div className="flex items-center gap-3 self-start md:self-center">
          {selectedItemsCount > 0 && (
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              {selectedItemsCount} selected
            </span>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAllSelections}
            className="border-primary text-primary hover:bg-muted"
          >
            Clear All
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" /> Delete All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete all grocery items?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all items from your grocery list. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
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
