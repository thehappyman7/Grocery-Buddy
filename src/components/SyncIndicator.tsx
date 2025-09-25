import React from 'react';
import { Cloud, CloudOff, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useSync } from '@/context/SyncContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const SyncIndicator: React.FC = () => {
  const { isOnline, isSyncing, lastSyncTime, syncData } = useSync();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const formatLastSync = (date: Date | null) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Online/Offline Status */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1">
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isOnline ? 'Connected to internet' : 'Working offline'}
        </TooltipContent>
      </Tooltip>

      {/* Sync Status */}
      {isOnline && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={syncData}
              disabled={isSyncing}
              className="h-8 px-2"
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Cloud className="h-4 w-4" />
              )}
              <span className="text-xs ml-1 hidden sm:inline">
                {isSyncing ? 'Syncing...' : 'Sync'}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-center">
              <div>Last sync: {formatLastSync(lastSyncTime)}</div>
              <div className="text-xs text-muted-foreground">
                Click to sync now
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default SyncIndicator;