
import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import LoginDialog from './LoginDialog';
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
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-grocery-purple/10 rounded-full">
                <ShoppingCart className="h-8 w-8 text-grocery-purple" />
              </div>
              <span className="text-2xl font-bold font-primary text-gray-800 tracking-tight">GroceryBuddy</span>
            </div>
          </div>
        </div>
      </nav>

      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </>
  );
};

export default Navigation;
