import { useDesktopStore, WindowState } from '@/store/use-desktop-store';
import * as Icons from 'lucide-react';
import { BrowserApp } from '../apps/BrowserApp';
import { NotepadApp } from '../apps/NotepadApp';
import { MusicApp } from '../apps/MusicApp';
import { ExplorerApp } from '../apps/ExplorerApp';
import { AdminApp } from '../apps/AdminApp';
import { CompanyInfoApp } from '../apps/CompanyInfoApp';

export function MobileWindowPanel({ window: win }: { window: WindowState }) {
  const { closeWindow, user } = useDesktopStore();

  const renderContent = () => {
    switch (win.windowType) {
      case 'browser': return <BrowserApp data={win.data} />;
      case 'notepad': return <NotepadApp data={win.data} />;
      case 'music': return <MusicApp />;
      case 'explorer': return <ExplorerApp />;
      case 'admin':
        if (user !== 'admin') {
          return (
            <div className="flex flex-col items-center justify-center h-full gap-4 bg-white text-slate-700 p-8">
              <Icons.ShieldOff className="w-12 h-12 text-red-400" />
              <h3 className="text-lg font-semibold">Access Denied</h3>
              <p className="text-sm text-slate-500 text-center">Administrator access required.</p>
            </div>
          );
        }
        return <AdminApp />;
      case 'company': return <CompanyInfoApp data={win.data} />;
      case 'custom': return <CompanyInfoApp data={win.data} />;
      default: return <div className="p-4 bg-white h-full">Unknown application type.</div>;
    }
  };

  return (
    <div className="fixed inset-0 bottom-12 z-[9998] flex flex-col bg-slate-100">
      <div className="h-10 flex items-center justify-between px-3 select-none shrink-0 xp-titlebar-gradient">
        <div className="flex items-center gap-2 overflow-hidden text-white">
          <Icons.Monitor className="w-4 h-4 shrink-0" />
          <span className="text-sm font-bold font-sans tracking-wide truncate drop-shadow-sm">{win.title}</span>
        </div>
        <button
          onClick={() => closeWindow(win.id)}
          className="w-8 h-8 bg-red-500 hover:bg-red-600 active:bg-red-700 rounded-sm border border-red-300 flex items-center justify-center text-white shadow-sm"
        >
          <Icons.X className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
