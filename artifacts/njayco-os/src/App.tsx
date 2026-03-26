import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDesktopStore } from "./store/use-desktop-store";
import BootScreen from "./pages/BootScreen";
import LoginScreen from "./pages/LoginScreen";
import Desktop from "./pages/Desktop";
import MobileDesktop from "./components/mobile/MobileDesktop";
import { useState, useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function useSessionRestore() {
  const { authToken, setAuth, clearAuth } = useDesktopStore();
  const [restoring, setRestoring] = useState(!!authToken);

  useEffect(() => {
    if (!authToken) {
      setRestoring(false);
      return;
    }
    fetch(`${import.meta.env.BASE_URL}api/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then(res => {
        if (!res.ok) throw new Error('Invalid session');
        return res.json();
      })
      .then(data => {
        const role = data.user.role === 'admin' ? 'admin' as const : 'user' as const;
        setAuth(authToken, data.user, role);
      })
      .catch(() => {
        clearAuth();
      })
      .finally(() => {
        setRestoring(false);
      });
  }, []);

  return restoring;
}

function OSManager() {
  const { visited, user, alwaysShowStartup } = useDesktopStore();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [bootDoneThisSession, setBootDoneThisSession] = useState(false);
  const restoring = useSessionRestore();

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  if (restoring) {
    return (
      <div className="h-[100dvh] w-screen flex items-center justify-center bg-blue-900">
        <div className="text-white text-lg">Restoring session...</div>
      </div>
    );
  }

  const shouldShowBoot = !visited || (alwaysShowStartup && !bootDoneThisSession);

  if (shouldShowBoot) {
    return <BootScreen onDone={() => setBootDoneThisSession(true)} />;
  }
  if (!user) return <LoginScreen />;

  if (isMobile) return <MobileDesktop />;
  return <Desktop />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
            <Route path="/" component={OSManager} />
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
