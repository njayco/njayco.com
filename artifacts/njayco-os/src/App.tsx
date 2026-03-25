import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useDesktopStore } from "./store/use-desktop-store";
import BootScreen from "./pages/BootScreen";
import LoginScreen from "./pages/LoginScreen";
import Desktop from "./pages/Desktop";
import { useState, useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

function MobileFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a246a] to-[#1a5fb4] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 mb-6 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center">
        <svg viewBox="0 0 40 40" className="w-10 h-10 fill-white">
          <rect x="2" y="10" width="36" height="22" rx="3" />
          <rect x="12" y="33" width="16" height="2" />
          <rect x="10" y="35" width="20" height="2" rx="1" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-3">NJAYCO OS</h1>
      <p className="text-white/70 text-sm mb-6 max-w-xs leading-relaxed">
        NJAYCO OS is optimized for desktop and tablet. Please visit on a larger screen for the full experience.
      </p>
      <div className="bg-white/10 border border-white/20 rounded-xl p-5 max-w-xs w-full">
        <p className="text-white/80 text-sm font-semibold mb-3">In the meantime, explore:</p>
        <div className="flex flex-col gap-2">
          <a href="https://njayco.com" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 text-white text-sm transition-colors">
            <span className="text-lg">🌐</span> NJAYCO.com
          </a>
          <a href="https://ysup.co" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-white/10 hover:bg-white/20 rounded-lg px-4 py-3 text-white text-sm transition-colors">
            <span className="text-lg">🚀</span> YsUp, Inc.
          </a>
        </div>
      </div>
      <p className="text-white/30 text-xs mt-6">Best viewed at 1024px width or above</p>
    </div>
  );
}

function OSManager() {
  const { visited, user, alwaysShowStartup } = useDesktopStore();
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  // Session-level flag: tracks whether boot was already shown this page load.
  // When alwaysShowStartup is on, we show boot on every page load, but only once
  // per session — BootScreen sets this to true when it finishes.
  const [bootDoneThisSession, setBootDoneThisSession] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  if (isMobile) return <MobileFallback />;
  
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
