import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDesktopStore } from "./store/use-desktop-store";
import BootScreen from "./pages/BootScreen";
import LoginScreen from "./pages/LoginScreen";
import Desktop from "./pages/Desktop";
import { useState } from "react";

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
  // Session-level flag: tracks whether boot was already shown this page load.
  // When alwaysShowStartup is on, we show boot on every page load, but only once
  // per session — BootScreen sets this to true when it finishes.
  const [bootDoneThisSession, setBootDoneThisSession] = useState(false);
  
  const shouldShowBoot = !visited || (alwaysShowStartup && !bootDoneThisSession);
  
  if (shouldShowBoot) {
    return <BootScreen onDone={() => setBootDoneThisSession(true)} />;
  }
  if (!user) return <LoginScreen />;
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
