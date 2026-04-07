import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { IntegrationProvider } from "@/contexts/IntegrationContext";
import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Activity from "./pages/Activity";
import Chat from "./pages/Chat";
import Nutrition from "./pages/Nutrition";
import Integrations from "./pages/Integrations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <IntegrationProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <div className="flex-1 md:ml-[72px] flex flex-col pb-16 md:pb-0">
              <AppHeader />
              <main className="flex-1 px-4 md:px-8 pb-6">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/integrations" element={<Integrations />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </IntegrationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
