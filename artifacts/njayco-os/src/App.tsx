import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDesktopStore } from "./store/use-desktop-store";
import BootScreen from "./pages/BootScreen";
import LoginScreen from "./pages/LoginScreen";
import Desktop from "./pages/Desktop";

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
  
  if (!visited || alwaysShowStartup) return <BootScreen />;
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
