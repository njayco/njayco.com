import { Rnd } from 'react-rnd';
import { useDesktopStore, WindowState } from '@/store/use-desktop-store';
import * as Icons from 'lucide-react';
import { useState } from 'react';
import { BrowserApp } from '../apps/BrowserApp';
import { NotepadApp } from '../apps/NotepadApp';
import { MusicApp } from '../apps/MusicApp';
import { ExplorerApp } from '../apps/ExplorerApp';
import { AdminApp } from '../apps/AdminApp';
import { CompanyInfoApp } from '../apps/CompanyInfoApp';

export function WindowWrapper({ window: win }: { window: WindowState }) {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, activeWindowId } = useDesktopStore();
  const isActive = activeWindowId === win.id;
  
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [position, setPosition] = useState({ x: Math.random() * 100 + 50, y: Math.random() * 100 + 50 });

  if (win.isMinimized) return null;

  const renderContent = () => {
    switch (win.windowType) {
      case 'browser': return <BrowserApp data={win.data} />;
      case 'notepad': return <NotepadApp data={win.data} />;
      case 'music': return <MusicApp />;
      case 'explorer': return <ExplorerApp />;
      case 'admin': return <AdminApp />;
      case 'company': return <CompanyInfoApp data={win.data} />;
      case 'custom': return <CompanyInfoApp data={win.data} />;
      default: return <div className="p-4 bg-white h-full">Unknown application type.</div>;
    }
  };

  return (
    <Rnd
      size={win.isMaximized ? { width: '100%', height: 'calc(100vh - 40px)' } : size}
      position={win.isMaximized ? { x: 0, y: 0 } : position}
      onDragStop={(e, d) => !win.isMaximized && setPosition({ x: d.x, y: d.y })}
      onResizeStop={(e, dir, ref, delta, pos) => {
        if (!win.isMaximized) {
          setSize({ width: parseInt(ref.style.width), height: parseInt(ref.style.height) });
          setPosition(pos);
        }
      }}
      disableDragging={win.isMaximized}
      enableResizing={!win.isMaximized}
      minWidth={400}
      minHeight={300}
      bounds="parent"
      style={{ zIndex: win.zIndex }}
      onMouseDown={() => focusWindow(win.id)}
      className="absolute flex flex-col"
    >
      <div className={`
        w-full h-full flex flex-col bg-slate-50 overflow-hidden xp-window-shadow rounded-t-lg
        ${isActive ? 'opacity-100' : 'opacity-95 grayscale-[20%]'}
        transition-opacity duration-100
      `}>
        
        {/* Title Bar */}
        <div 
          className={`
            h-8 flex items-center justify-between px-2 cursor-move select-none rounded-t-md
            ${isActive ? 'xp-titlebar-gradient' : 'bg-gradient-to-r from-slate-500 to-slate-400'}
          `}
          onDoubleClick={() => maximizeWindow(win.id)}
        >
          <div className="flex items-center gap-2 overflow-hidden text-white">
            <Icons.Monitor className="w-4 h-4 shrink-0" />
            <span className="text-sm font-bold font-sans tracking-wide truncate drop-shadow-sm">{win.title}</span>
          </div>
          
          <div className="flex items-center gap-1 shrink-0 ml-4">
            <button 
              onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
              className="w-6 h-6 bg-blue-100 hover:bg-blue-200 rounded-sm border border-white/40 flex items-center justify-center text-blue-900 shadow-sm"
            >
              <Icons.Minus className="w-4 h-4" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); maximizeWindow(win.id); }}
              className="w-6 h-6 bg-blue-100 hover:bg-blue-200 rounded-sm border border-white/40 flex items-center justify-center text-blue-900 shadow-sm"
            >
              {win.isMaximized ? <Icons.Copy className="w-3.5 h-3.5" /> : <Icons.Square className="w-3.5 h-3.5" />}
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
              className="w-6 h-6 bg-red-500 hover:bg-red-600 rounded-sm border border-red-300 flex items-center justify-center text-white shadow-sm"
            >
              <Icons.X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Window Content */}
        <div className="flex-1 overflow-hidden relative border-x-2 border-b-2 border-blue-600/30">
          {renderContent()}
          {/* Invisible overlay when not focused to prevent iframe stealing events */}
          {!isActive && win.windowType === 'browser' && (
            <div className="absolute inset-0 z-10" />
          )}
        </div>
      </div>
    </Rnd>
  );
}
