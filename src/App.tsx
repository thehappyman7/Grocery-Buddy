
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SyncProvider } from "./context/SyncContext";
import { PantryProvider } from "./context/PantryContext";
import { RecipeProvider } from "./context/RecipeContext";
import { PreferencesProvider } from "./context/PreferencesContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ConflictResolutionDialog from "./components/ConflictResolutionDialog";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PreferencesProvider>
          <PantryProvider>
            <RecipeProvider>
              <SyncProvider>
                <Toaster />
                <Sonner />
                <ConflictResolutionDialog />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </SyncProvider>
            </RecipeProvider>
          </PantryProvider>
        </PreferencesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
