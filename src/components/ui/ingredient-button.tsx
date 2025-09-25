import React from 'react';
import { Button } from './button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './alert-dialog';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IngredientButtonProps {
  variant: 'add' | 'delete';
  itemName: string;
  onAction: () => void;
  disabled?: boolean;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showConfirmation?: boolean;
}

const IngredientButton: React.FC<IngredientButtonProps> = ({
  variant,
  itemName,
  onAction,
  disabled = false,
  size = 'sm',
  className,
  showConfirmation = variant === 'delete'
}) => {
  const isAdd = variant === 'add';
  
  const buttonContent = (
    <Button
      size={size}
      variant={isAdd ? 'default' : 'destructive'}
      onClick={showConfirmation ? undefined : onAction}
      disabled={disabled}
      className={cn(
        isAdd ? 
          'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200' :
          'bg-destructive hover:bg-destructive/90 text-destructive-foreground',
        className
      )}
    >
      {isAdd ? (
        <>
          <Plus className="h-3 w-3 mr-1" />
          Add
        </>
      ) : (
        <>
          <Trash2 className="h-3 w-3 mr-1" />
          Delete
        </>
      )}
    </Button>
  );

  if (showConfirmation && !isAdd) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          {buttonContent}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemName}" from your grocery list? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onAction} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return buttonContent;
};

export default IngredientButton;