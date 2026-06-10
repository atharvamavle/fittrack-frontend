import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { IntegrationProvider } from "@/contexts/IntegrationContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppSidebar from "@/components/layout/AppSidebar";
import AppHeader from "@/components/layout/AppHeader";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import Activity from "./pages/Activity";
import Chat from "./pages/Chat";
import Nutrition from "./pages/Nutrition";
import Integrations from "./pages/Integrations";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protects onboarding — redirects to /login if no session
const ProtectedOnboarding = () => {
  const { session, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
  if (!session) return <Navigate to="/login" replace />;
  return <Onboarding />;
};

// Wrapper: redirects to /login if not authenticated, /onboarding if no profile
const ProtectedLayout = () => {
  const { session, loading } = useAuth();
  const [profileChecked, setProfileChecked] = useState(false);
  const [hasProfile, setHasProfile]         = useState(true);

  useEffect(() => {
    if (!session) return;
    api.getProfile()
      .then(() => { setHasProfile(true); setProfileChecked(true); })
      .catch(() => { setHasProfile(false); setProfileChecked(true); });
  }, [session]);

  if (loading || (session && !profileChecked)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/login" replace />;
  if (!hasProfile) return <Navigate to="/onboarding" replace />;

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex-1 md:ml-[72px] flex flex-col pb-16 md:pb-0">
        <AppHeader />
        <main className="flex-1 px-4 md:px-8 pb-6">
          <Routes>
            <Route path="/"            element={<Index />} />
            <Route path="/analytics"   element={<Analytics />} />
            <Route path="/activity"    element={<Activity />} />
            <Route path="/chat"        element={<Chat />} />
            <Route path="/nutrition"   element={<Nutrition />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/settings"    element={<Settings />} />
            <Route path="*"            element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <IntegrationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login"      element={<Login />} />
              <Route path="/onboarding" element={<ProtectedOnboarding />} />
              <Route path="/*"          element={<ProtectedLayout />} />
            </Routes>
          </BrowserRouter>
        </IntegrationProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
