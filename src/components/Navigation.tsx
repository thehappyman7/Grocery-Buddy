
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import LoginDialog from './LoginDialog';
import DarkModeToggle from './DarkModeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navigation: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  
  return (
    <>
      <nav className="bg-gradient-to-r from-white to-grocery-purple-light shadow-lg border-b border-grocery-purple/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-grocery-purple/10 rounded-full">
                <ShoppingCart className="h-8 w-8 text-grocery-purple" />
              </div>
              <span className="text-2xl font-bold font-primary text-gray-800 tracking-tight">GroceryBuddy</span>
            </div>
            
            <div className="flex items-center gap-4">
              <DarkModeToggle />
              {!isAuthenticated ? (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="bg-gradient-to-r from-grocery-purple to-grocery-blue text-white border-0 hover:from-grocery-purple/90 hover:to-grocery-blue/90 shadow-md hover:shadow-lg transition-all duration-200 rounded-full px-6 font-medium"
                  onClick={() => setLoginDialogOpen(true)}
                >
                  Sign In
                </Button>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-grocery-purple/10">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.avatar} alt={user?.name} />
                        <AvatarFallback className="bg-gradient-to-r from-grocery-purple to-grocery-blue text-white font-medium">
                          {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 border-grocery-purple/20 shadow-lg" align="end" forceMount>
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50"
                      onClick={logout}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </nav>

      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
};

export default Navigation;
