import { useDesktopStore } from '@/store/use-desktop-store';
import * as Icons from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function StartMenu() {
  const { user, setUser, setVisited, setStartMenuOpen, openWindow, closeAllWindows } = useDesktopStore();
  const [showShutdown, setShowShutdown] = useState(false);

  const pinnedApps = [
    { id: 'browser-ysup', name: 'YsUp, Inc.', icon: Icons.Rocket, type: 'browser', data: { url: 'https://ysup.co' } },
    { id: 'music-uv', name: 'UV Music Group', icon: Icons.Music, type: 'music' },
    { id: 'notepad-denoko', name: 'Denoko', icon: Icons.FileText, type: 'notepad', data: { content: 'Denoko Concept\n\nA cooperative-style innovation umbrella or future holding platform centered on community, infrastructure, and platforms.' } },
    { id: 'company-info', name: 'About NJAYCO', icon: Icons.Building, type: 'company' },
  ];

  const handleAppClick = (app: any) => {
    openWindow({
      id: app.id,
      title: app.name,
      windowType: app.type as any,
      data: app.data
    });
    setStartMenuOpen(false);
  };

  const handleLogoff = () => {
    closeAllWindows();
    setUser(null);
  };

  const handleShutdown = () => {
    closeAllWindows();
    setUser(null);
    setVisited(false);
    window.location.reload();
  };

  return (
    <>
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

        {/* Body */}
        <div className="flex bg-white" style={{ height: 'min(384px, calc(100vh - 200px))' }}>
          {/* Left Panel */}
          <div className="w-1/2 p-2 flex flex-col gap-1 border-r border-gray-200">
            {pinnedApps.map((app, i) => (
              <button 
                key={i}
                onClick={() => handleAppClick(app)}
                className="flex items-center gap-3 p-2 hover:bg-primary hover:text-white rounded transition-colors group text-left"
              >
                <app.icon className="w-6 h-6 text-primary group-hover:text-white" />
                <span className="text-sm font-medium text-gray-800 group-hover:text-white">{app.name}</span>
              </button>
            ))}
            
            <div className="mt-auto pt-2 border-t border-gray-100">
              <button className="flex items-center justify-between w-full p-2 hover:bg-primary hover:text-white rounded transition-colors group">
                <span className="text-sm font-bold text-gray-700 group-hover:text-white">All Programs</span>
                <Icons.ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-1/2 p-2 bg-blue-50/50 flex flex-col gap-1">
            <button 
              onClick={() => handleAppClick({ id: 'explorer', name: 'My NJAYCO', type: 'explorer', icon: Icons.Folder })}
              className="flex items-center gap-3 p-2 hover:bg-blue-100 rounded transition-colors text-left"
            >
              <Icons.Folder className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">My NJAYCO</span>
            </button>
            
            <button 
              onClick={() => handleAppClick({ id: 'explorer-docs', name: 'Documents', type: 'explorer', icon: Icons.FileText })}
              className="flex items-center gap-3 p-2 hover:bg-blue-100 rounded transition-colors text-left"
            >
              <Icons.FileText className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Documents</span>
            </button>
            
            {user === 'admin' && (
              <button 
                onClick={() => handleAppClick({ id: 'admin', name: 'Control Panel', type: 'admin', icon: Icons.Settings })}
                className="flex items-center gap-3 p-2 hover:bg-blue-100 rounded transition-colors text-left mt-2 border-t border-blue-200/50 pt-3"
              >
                <Icons.Settings className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-blue-900">Control Panel</span>
              </button>
            )}
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
            onClick={() => { setStartMenuOpen(false); setShowShutdown(true); }}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/20 rounded transition-colors"
          >
            <Icons.Power className="w-4 h-4 text-red-300" />
            <span className="text-sm text-white font-medium">Shut Down</span>
          </button>
        </div>
      </div>

      <Dialog open={showShutdown} onOpenChange={setShowShutdown}>
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
    </>
  );
}
