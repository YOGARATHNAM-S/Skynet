import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { useAuth } from "./hooks/use-auth";

const queryClient = new QueryClient();

function AppRoutes() {
  const { appUser, loading, signIn, signUp, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!appUser) {
    return <AuthPage onSignIn={signIn} onSignUp={signUp} />;
  }

  return (
    <BrowserRouter basename="/Skynet">
      <Routes>
        <Route path="/" element={<Index appUser={appUser} onSignOut={signOut} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppRoutes />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
