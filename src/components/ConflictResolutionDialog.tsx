import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSync } from '@/context/SyncContext';
import { Smartphone, Cloud } from 'lucide-react';

const ConflictResolutionDialog: React.FC = () => {
  const { conflictItems, resolveConflict, clearConflicts } = useSync();
  
  if (conflictItems.length === 0) return null;

  const currentConflict = conflictItems[0];

  return (
    <Dialog open={conflictItems.length > 0} onOpenChange={() => clearConflicts()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Sync Conflict Detected</DialogTitle>
          <DialogDescription>
            The same item was modified on multiple devices. Choose which version to keep:
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Local Version */}
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Smartphone className="h-4 w-4" />
                This Device
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <strong>Name:</strong> {currentConflict.localItem.name}
              </div>
              <div className="text-sm">
                <strong>Category:</strong> {currentConflict.localItem.category}
              </div>
              {currentConflict.localItem.quantity && (
                <div className="text-sm">
                  <strong>Quantity:</strong> {currentConflict.localItem.quantity}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Modified: {new Date(currentConflict.localItem.updated_at || Date.now()).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {/* Remote Version */}
          <Card className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Cloud className="h-4 w-4" />
                Cloud Version
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <strong>Name:</strong> {currentConflict.remoteItem.name}
              </div>
              <div className="text-sm">
                <strong>Category:</strong> {currentConflict.remoteItem.category}
              </div>
              {currentConflict.remoteItem.quantity && (
                <div className="text-sm">
                  <strong>Quantity:</strong> {currentConflict.remoteItem.quantity}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                Modified: {new Date(currentConflict.remoteItem.updated_at).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => resolveConflict(currentConflict.localItem.id, 'local')}
            className="flex items-center gap-2"
          >
            <Smartphone className="h-4 w-4" />
            Keep This Device
          </Button>
          <Button
            onClick={() => resolveConflict(currentConflict.localItem.id, 'remote')}
            className="flex items-center gap-2"
          >
            <Cloud className="h-4 w-4" />
            Keep Cloud Version
          </Button>
        </DialogFooter>
        
        {conflictItems.length > 1 && (
          <div className="text-xs text-muted-foreground text-center">
            {conflictItems.length - 1} more conflict(s) remaining
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConflictResolutionDialog;