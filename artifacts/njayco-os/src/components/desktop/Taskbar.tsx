import { useState, useEffect, useRef } from 'react';
import { useDesktopStore } from '@/store/use-desktop-store';
import * as Icons from 'lucide-react';
import { StartMenu, RunDialog, ShutdownDialog } from './StartMenu';

export function Taskbar() {
  const { windows, activeWindowId, focusWindow, startMenuOpen, setStartMenuOpen } = useDesktopStore();
  const [time, setTime] = useState(new Date());
  const [volume, setVolume] = useState(80);
  const [showVolume, setShowVolume] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showRun, setShowRun] = useState(false);
  const [showShutdown, setShowShutdown] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (volumeRef.current && !volumeRef.current.contains(e.target as Node)) {
        setShowVolume(false);
      }
    };
    if (showVolume) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showVolume]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const effectiveVolume = isMuted ? 0 : volume;
  const VolumeIcon = effectiveVolume === 0 ? Icons.VolumeX : effectiveVolume < 40 ? Icons.Volume1 : Icons.Volume2;

  return (
    <>
      <div
        className="absolute bottom-0 left-0 right-0 h-10 xp-taskbar-gradient flex items-center justify-between z-[9999] border-t border-blue-400/50 shadow-[0_-2px_5px_rgba(0,0,0,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
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
          
          <div ref={volumeRef} className="relative">
            <button
              onClick={() => setShowVolume(v => !v)}
              onDoubleClick={() => setIsMuted(m => !m)}
              title={`Volume: ${effectiveVolume}% (double-click to mute)`}
              className="flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              <VolumeIcon className="w-4 h-4" />
            </button>

            {showVolume && (
              <div className="absolute bottom-8 right-0 bg-white border border-slate-200 rounded-lg shadow-xl p-3 w-36 z-[10000]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">Volume</span>
                  <span className="text-xs text-slate-500">{effectiveVolume}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setVolume(v);
                    if (v > 0) setIsMuted(false);
                  }}
                  className="w-full h-1.5 accent-blue-600 cursor-pointer"
                />
                <button
                  onClick={() => setIsMuted(m => !m)}
                  className={`mt-2 w-full text-xs py-1 rounded transition-colors ${isMuted ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                >
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
              </div>
            )}
          </div>
          
          <Icons.Wifi className="w-4 h-4 text-white/80" />
          <span className="text-white text-xs font-sans font-medium tracking-wide">
            {formatTime(time)}
          </span>
        </div>
      </div>

      {startMenuOpen && (
        <StartMenu
          onShowRun={() => setShowRun(true)}
          onShowShutdown={() => setShowShutdown(true)}
        />
      )}

      <RunDialog open={showRun} onClose={() => setShowRun(false)} />
      <ShutdownDialog open={showShutdown} onClose={() => setShowShutdown(false)} />
    </>
  );
}
