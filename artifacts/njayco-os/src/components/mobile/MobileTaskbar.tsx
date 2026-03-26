import { useState, useEffect } from 'react';
import { useDesktopStore } from '@/store/use-desktop-store';
import * as Icons from 'lucide-react';

interface MobileTaskbarProps {
  onStartPress: () => void;
  startMenuOpen: boolean;
}

export function MobileTaskbar({ onStartPress, startMenuOpen }: MobileTaskbarProps) {
  const { windows, activeWindowId } = useDesktopStore();
  const [time, setTime] = useState(new Date());
  const activeWindow = windows.find(w => w.id === activeWindowId);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-12 xp-taskbar-gradient flex items-center justify-between z-[9999] border-t border-blue-400/50 shadow-[0_-2px_5px_rgba(0,0,0,0.3)]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex h-full items-center flex-1 overflow-hidden">
        <button
          onClick={onStartPress}
          className={`
            xp-start-button h-full px-4 rounded-r-2xl flex items-center gap-2 
            text-white font-display italic font-bold tracking-wider text-base
            transition-all active:scale-95
            ${startMenuOpen ? 'shadow-[inset_2px_2px_4px_rgba(0,0,0,0.5)] bg-gradient-to-b from-[#2e8a36] to-[#1e5a23]' : ''}
          `}
        >
          <Icons.Monitor className="w-4 h-4" />
          Start
        </button>

        {activeWindow && (
          <div className="flex-1 flex items-center px-3 overflow-hidden">
            <div className="xp-taskbar-item active flex items-center gap-2 px-3 h-8 rounded-sm text-white text-xs truncate max-w-full">
              <Icons.AppWindow className="w-3 h-3 shrink-0 opacity-80" />
              <span className="truncate">{activeWindow.title}</span>
            </div>
          </div>
        )}
      </div>

      <div className="h-full px-3 bg-gradient-to-b from-blue-400 to-blue-600 border-l border-blue-300/50 flex items-center gap-2 shadow-[inset_1px_0_0_rgba(0,0,0,0.2)]">
        <Icons.Wifi className="w-3 h-3 text-white/80" />
        <span className="text-white text-[11px] font-sans font-medium tracking-wide">
          {formatTime(time)}
        </span>
      </div>
    </div>
  );
}
