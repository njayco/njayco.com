import { useDesktopStore, type WindowType } from '@/store/use-desktop-store';
import * as Icons from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useGetDivisions } from '@/hooks/use-music-hooks';

interface PinnedApp {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  type: WindowType;
  data?: Record<string, unknown>;
}

const pinnedApps: PinnedApp[] = [
  { id: 'browser-ysup', name: 'YsUp, Inc.', icon: Icons.Rocket, type: 'browser', data: { url: 'https://ysup.co' } },
  { id: 'music-uv', name: 'UV Music Group', icon: Icons.Music, type: 'music' },
  { id: 'notepad-denoko', name: 'Denoko', icon: Icons.FileText, type: 'notepad', data: { content: 'Denoko Concept\n\nA cooperative-style innovation umbrella or future holding platform centered on community, infrastructure, and platforms.' } },
  { id: 'company-info', name: 'About NJAYCO', icon: Icons.Building, type: 'company' },
];

const allPrograms: { id: string; name: string; icon: React.ComponentType<{ className?: string }>; type: WindowType; data?: Record<string, unknown> }[] = [
  { id: 'explorer', name: 'File Explorer', icon: Icons.FolderOpen, type: 'explorer' },
  { id: 'browser-ie', name: 'Internet Explorer', icon: Icons.Globe, type: 'browser', data: { url: 'https://njayco.com' } },
  { id: 'notepad-new', name: 'Notepad', icon: Icons.FileText, type: 'notepad' },
  { id: 'music-uv-2', name: 'UV Music Group', icon: Icons.Music, type: 'music' },
  { id: 'admin-cp', name: 'Control Panel', icon: Icons.Settings, type: 'admin' },
  { id: 'company-about', name: 'About NJAYCO', icon: Icons.Building, type: 'company' },
  { id: 'company-contact', name: 'Contact', icon: Icons.Mail, type: 'custom' },
];

interface StartMenuProps {
  onShowRun: () => void;
  onShowShutdown: () => void;
}

export function StartMenu({ onShowRun, onShowShutdown }: StartMenuProps) {
  const { user, setUser, setStartMenuOpen, openWindow, closeAllWindows } = useDesktopStore();
  const { data: divisions } = useGetDivisions();
  const [showAllPrograms, setShowAllPrograms] = useState(false);

  const handleAppClick = (app: PinnedApp) => {
    openWindow({
      id: app.id,
      title: app.name,
      windowType: app.type,
      data: app.data,
    });
    setStartMenuOpen(false);
  };

  const handleLogoff = () => {
    closeAllWindows();
    setUser(null);
    setStartMenuOpen(false);
  };

  return (
    <div 
      className="absolute bottom-10 left-0 w-96 bg-white xp-window-shadow rounded-tr-lg flex flex-col overflow-hidden z-[9999]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="xp-titlebar-gradient p-3 flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-md border-2 border-white/30 overflow-hidden flex items-center justify-center">
          <img 
            src={`${import.meta.env.BASE_URL}images/${user === 'admin' ? 'admin' : user === 'guest' ? 'guest' : 'user'}-avatar.png`} 
            className="w-full h-full object-cover"
            alt="User" 
          />
        </div>
        <div className="text-white">
          <div className="text-sm font-semibold capitalize">{user} Account</div>
          <div className="text-xs opacity-80">NJAYCO OS</div>
        </div>
      </div>

      {showAllPrograms ? (
        <div className="flex-1 flex flex-col bg-white" style={{ height: 'min(420px, calc(100vh - 200px))' }}>
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border-b border-blue-100">
            <button onClick={() => setShowAllPrograms(false)} className="p-1 hover:bg-blue-100 rounded">
              <Icons.ArrowLeft className="w-4 h-4 text-blue-600" />
            </button>
            <span className="text-sm font-bold text-blue-900">All Programs</span>
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-2 border-b border-gray-100">
              <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 py-1">Applications</div>
              {allPrograms.map(app => (
                <button key={app.id} onClick={() => { openWindow({ id: app.id, title: app.name, windowType: app.type, data: app.data }); setStartMenuOpen(false); }}
                  className="flex items-center gap-3 p-2 w-full hover:bg-primary hover:text-white rounded transition-colors group text-left">
                  <app.icon className="w-5 h-5 text-primary group-hover:text-white shrink-0" />
                  <span className="text-sm text-gray-800 group-hover:text-white">{app.name}</span>
                </button>
              ))}
            </div>
            {divisions && divisions.length > 0 && (
              <div className="p-2">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 py-1">Divisions</div>
                {divisions.map(div => (
                  <button key={div.id} onClick={() => { openWindow({ id: `div-${div.id}`, title: div.name, windowType: (div.windowType as WindowType) || 'custom', data: { url: div.websiteUrl, content: div.notepadContent, division: div } }); setStartMenuOpen(false); }}
                    className="flex items-center gap-3 p-2 w-full hover:bg-primary hover:text-white rounded transition-colors group text-left">
                    <Icons.Building2 className="w-4 h-4 text-primary group-hover:text-white shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-800 group-hover:text-white truncate">{div.name}</div>
                      <div className="text-[10px] text-gray-400 group-hover:text-white/70 capitalize">{div.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
      <>
      {/* Body */}
      <div className="flex bg-white" style={{ height: 'min(420px, calc(100vh - 200px))' }}>
        {/* Left Panel */}
        <div className="w-1/2 p-2 flex flex-col gap-1 border-r border-gray-200">
          {pinnedApps.map((app) => (
            <button 
              key={app.id}
              onClick={() => handleAppClick(app)}
              className="flex items-center gap-3 p-2 hover:bg-primary hover:text-white rounded transition-colors group text-left"
            >
              <app.icon className="w-6 h-6 text-primary group-hover:text-white" />
              <span className="text-sm font-medium text-gray-800 group-hover:text-white">{app.name}</span>
            </button>
          ))}
          
          <div className="mt-auto pt-2 border-t border-gray-100">
            <button onClick={() => setShowAllPrograms(true)} className="flex items-center justify-between w-full p-2 hover:bg-primary hover:text-white rounded transition-colors group">
              <span className="text-sm font-bold text-gray-700 group-hover:text-white">All Programs</span>
              <Icons.ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/2 p-2 bg-blue-50/50 flex flex-col gap-1">
          <button 
            onClick={() => { openWindow({ id: 'explorer', title: 'My NJAYCO', windowType: 'explorer' }); setStartMenuOpen(false); }}
            className="flex items-center gap-3 p-2 hover:bg-blue-100 rounded transition-colors text-left"
          >
            <Icons.Monitor className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">My NJAYCO</span>
          </button>
          
          <button 
            onClick={() => { openWindow({ id: 'explorer-docs', title: 'Documents', windowType: 'explorer' }); setStartMenuOpen(false); }}
            className="flex items-center gap-3 p-2 hover:bg-blue-100 rounded transition-colors text-left"
          >
            <Icons.FolderOpen className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">My Documents</span>
          </button>

          <button 
            onClick={() => { openWindow({ id: 'music-library', title: 'Music Library', windowType: 'music' }); setStartMenuOpen(false); }}
            className="flex items-center gap-3 p-2 hover:bg-blue-100 rounded transition-colors text-left"
          >
            <Icons.Music2 className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">My Music</span>
          </button>

          <button 
            onClick={() => { openWindow({ id: 'browser-search', title: 'Internet Explorer', windowType: 'browser', data: { url: 'https://njayco.com' } }); setStartMenuOpen(false); }}
            className="flex items-center gap-3 p-2 hover:bg-blue-100 rounded transition-colors text-left"
          >
            <Icons.Globe className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Internet</span>
          </button>
          
          {user === 'admin' && (
            <button 
              onClick={() => { openWindow({ id: 'admin', title: 'Control Panel', windowType: 'admin' }); setStartMenuOpen(false); }}
              className="flex items-center gap-3 p-2 hover:bg-blue-100 rounded transition-colors text-left border-t border-blue-200/50 mt-1 pt-2"
            >
              <Icons.Settings className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-blue-900">Control Panel</span>
            </button>
          )}

          <div className="mt-auto pt-2 border-t border-blue-200/50">
            <button 
              onClick={() => { setStartMenuOpen(false); onShowRun(); }}
              className="flex items-center gap-3 p-2 hover:bg-blue-100 rounded transition-colors text-left w-full"
            >
              <Icons.Terminal className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-blue-900">Run...</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-2 flex justify-end gap-2 border-t border-blue-700/50">
        <button 
          onClick={handleLogoff}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/20 rounded transition-colors"
        >
          <Icons.LogOut className="w-4 h-4 text-white" />
          <span className="text-sm text-white font-medium">Log Off</span>
        </button>
        
        <button 
          onClick={() => { setStartMenuOpen(false); onShowShutdown(); }}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/20 rounded transition-colors"
        >
          <Icons.Power className="w-4 h-4 text-red-300" />
          <span className="text-sm text-white font-medium">Shut Down</span>
        </button>
      </div>
      </>
      )}
    </div>
  );
}


interface RunDialogProps {
  open: boolean;
  onClose: () => void;
}

export function RunDialog({ open, onClose }: RunDialogProps) {
  const { openWindow } = useDesktopStore();
  const [runInput, setRunInput] = useState('');

  const handleRun = () => {
    const cmd = runInput.trim().toLowerCase();
    if (!cmd) return;
    onClose();
    setRunInput('');
    if (cmd === 'explorer' || cmd === 'explorer.exe') {
      openWindow({ id: 'explorer', title: 'My NJAYCO', windowType: 'explorer' });
    } else if (cmd === 'notepad' || cmd === 'notepad.exe') {
      openWindow({ id: 'notepad-run', title: 'Notepad', windowType: 'notepad' });
    } else if (cmd === 'music' || cmd === 'winamp') {
      openWindow({ id: 'music-uv', title: 'UV Music Group', windowType: 'music' });
    } else if (cmd === 'control' || cmd === 'control.exe') {
      openWindow({ id: 'admin-panel', title: 'Control Panel', windowType: 'admin' });
    } else if (cmd.startsWith('http://') || cmd.startsWith('https://')) {
      openWindow({ id: `browser-${Date.now()}`, title: cmd, windowType: 'browser', data: { url: cmd } });
    } else {
      openWindow({ id: `browser-${Date.now()}`, title: `Search: ${cmd}`, windowType: 'browser', data: { url: `https://www.google.com/search?q=${encodeURIComponent(cmd)}` } });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[400px] bg-slate-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icons.Terminal className="w-5 h-5" />
            Run
          </DialogTitle>
          <DialogDescription>
            Type the name of a program, folder, or URL, and NJAYCO OS will open it for you.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 w-16 shrink-0">Open:</span>
            <input
              autoFocus
              type="text"
              value={runInput}
              onChange={(e) => setRunInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRun()}
              placeholder="e.g. notepad, explorer, https://..."
              className="flex-1 border border-slate-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <p className="text-xs text-slate-400 mt-2 ml-20">Try: notepad, explorer, music, control, or any URL</p>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleRun}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


interface ShutdownDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ShutdownDialog({ open, onClose }: ShutdownDialogProps) {
  const { setUser, setVisited, closeAllWindows } = useDesktopStore();

  const handleLogoff = () => {
    closeAllWindows();
    setUser(null);
    onClose();
  };

  const handleShutdown = () => {
    closeAllWindows();
    setUser(null);
    setVisited(false);
    window.location.reload();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-slate-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Icons.Power className="text-red-500" />
            Turn off computer
          </DialogTitle>
          <DialogDescription>
            Choose what you want the system to do.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center gap-8 py-6">
          <button onClick={handleLogoff} className="flex flex-col items-center gap-2 hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-lg bg-yellow-400 flex items-center justify-center shadow-md">
              <Icons.LogOut className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700">Log Off</span>
          </button>
          <button onClick={() => window.location.reload()} className="flex flex-col items-center gap-2 hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center shadow-md">
              <Icons.RefreshCcw className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700">Restart</span>
          </button>
          <button onClick={handleShutdown} className="flex flex-col items-center gap-2 hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-lg bg-red-500 flex items-center justify-center shadow-md">
              <Icons.Power className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-medium text-slate-700">Shut Down</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
