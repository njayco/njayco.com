import { useState, useEffect } from 'react';
import { useDesktopStore } from '@/store/use-desktop-store';
import * as Icons from 'lucide-react';
import { StartMenu } from './StartMenu';

export function Taskbar() {
  const { windows, activeWindowId, focusWindow, startMenuOpen, setStartMenuOpen } = useDesktopStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 h-10 xp-taskbar-gradient flex items-center justify-between z-[9999] border-t border-blue-400/50 shadow-[0_-2px_5px_rgba(0,0,0,0.3)]">
        
        {/* Left side: Start Button & Apps */}
        <div className="flex h-full items-center flex-1 overflow-hidden">
          <button 
            onClick={() => setStartMenuOpen(!startMenuOpen)}
            className={`
              xp-start-button h-full px-4 rounded-r-2xl flex items-center gap-2 
              text-white font-display italic font-bold tracking-wider text-lg
              transition-all active:translate-y-px
              ${startMenuOpen ? 'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] bg-gradient-to-b from-[#2e8a36] to-[#1e5a23]' : ''}
            `}
          >
            <Icons.Monitor className="w-5 h-5" />
            N Start
          </button>
          
          <div className="flex-1 flex gap-1 px-2 h-full items-center overflow-x-auto">
            {windows.map(win => (
              <button
                key={win.id}
                onClick={() => focusWindow(win.id)}
                className={`
                  flex items-center gap-2 px-3 h-8 min-w-[120px] max-w-[180px] rounded-sm truncate text-white text-sm
                  transition-all duration-100
                  ${activeWindowId === win.id 
                    ? 'xp-taskbar-item active text-white/90' 
                    : 'xp-taskbar-item hover:brightness-110'}
                `}
              >
                <Icons.AppWindow className="w-4 h-4 shrink-0 opacity-80" />
                <span className="truncate">{win.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right side: System Tray */}
        <div className="h-full px-4 bg-gradient-to-b from-blue-400 to-blue-600 border-l border-blue-300/50 flex items-center gap-3 shadow-[inset_1px_0_0_rgba(0,0,0,0.2)]">
          <Icons.ShieldCheck className="w-4 h-4 text-white/80" />
          <Icons.Volume2 className="w-4 h-4 text-white/80" />
          <Icons.Wifi className="w-4 h-4 text-white/80" />
          <span className="text-white text-xs font-sans font-medium tracking-wide">
            {formatTime(time)}
          </span>
        </div>
      </div>
      
      {startMenuOpen && <StartMenu />}
    </>
  );
}
