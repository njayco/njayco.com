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

function OSManager() {
  const { visited, user, alwaysShowStartup } = useDesktopStore();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [bootDoneThisSession, setBootDoneThisSession] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

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
