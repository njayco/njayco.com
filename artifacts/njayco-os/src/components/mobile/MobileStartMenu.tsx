import { useDesktopStore, type WindowType } from '@/store/use-desktop-store';
import * as Icons from 'lucide-react';
import { useGetDivisions } from '@/hooks/use-music-hooks';

interface MobileStartMenuProps {
  onClose: () => void;
}

export function MobileStartMenu({ onClose }: MobileStartMenuProps) {
  const { user, setUser, setVisited, openWindow, closeAllWindows, setStartMenuOpen } = useDesktopStore();
  const { data: divisions } = useGetDivisions();

  const handleOpenApp = (id: string, title: string, windowType: WindowType, data?: Record<string, unknown>) => {
    closeAllWindows();
    openWindow({ id, title, windowType, data });
    setStartMenuOpen(false);
    onClose();
  };

  const handleLogoff = () => {
    closeAllWindows();
    setUser(null);
    setStartMenuOpen(false);
    onClose();
  };

  const handleShutdown = () => {
    closeAllWindows();
    setUser(null);
    setVisited(false);
    onClose();
    window.location.reload();
  };

  const quickApps = [
    { id: 'explorer', name: 'My NJAYCO', icon: Icons.Monitor, type: 'explorer' as const },
    { id: 'music-uv', name: 'UV Music Group', icon: Icons.Music, type: 'music' as const },
    { id: 'browser-ie', name: 'Internet Explorer', icon: Icons.Globe, type: 'browser' as const, data: { url: 'https://njayco.com' } },
    { id: 'notepad-new', name: 'Notepad', icon: Icons.FileText, type: 'notepad' as const },
  ];

  return (
    <div className="fixed inset-0 bottom-12 z-[9998] flex flex-col bg-white animate-in slide-in-from-bottom duration-200">
      <div className="xp-titlebar-gradient p-4 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 bg-white/20 rounded-lg border border-white/30 overflow-hidden flex items-center justify-center">
          <img
            src={`${import.meta.env.BASE_URL}images/${user === 'admin' ? 'admin' : user === 'guest' ? 'guest' : 'user'}-avatar.png`}
            className="w-full h-full object-cover"
            alt="User"
          />
        </div>
        <div className="text-white flex-1">
          <div className="text-sm font-semibold capitalize">{user} Account</div>
          <div className="text-xs opacity-70">NJAYCO Pocket OS</div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white active:bg-white/30"
        >
          <Icons.X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="p-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 py-1.5">Quick Launch</div>
          {quickApps.map(app => (
            <button
              key={app.id}
              onClick={() => handleOpenApp(app.id, app.name, app.type, app.data)}
              className="flex items-center gap-3 p-3 w-full active:bg-blue-500 active:text-white rounded-lg transition-colors text-left"
            >
              <app.icon className="w-5 h-5 text-blue-600 shrink-0" />
              <span className="text-sm font-medium text-gray-800">{app.name}</span>
            </button>
          ))}
        </div>

        <div className="h-px bg-gray-200 mx-3" />

        <div className="p-3">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 px-2 py-1.5">
            NJAYCO Divisions
            {!divisions && <span className="ml-2 normal-case text-gray-300">Loading...</span>}
          </div>
          {divisions && divisions.length > 0 ? (
            divisions.map(div => (
              <button
                key={div.id}
                onClick={() => handleOpenApp(
                  `div-${div.id}`,
                  div.name,
                  (div.windowType as WindowType) || 'custom',
                  { url: div.websiteUrl, content: div.notepadContent, division: div }
                )}
                className="flex items-center gap-3 p-3 w-full active:bg-blue-500 active:text-white rounded-lg transition-colors text-left"
              >
                <Icons.Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{div.name}</div>
                  <div className="text-[10px] text-gray-400 capitalize">{div.category}</div>
                </div>
                <Icons.ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
              </button>
            ))
          ) : divisions ? (
            <p className="text-xs text-gray-400 px-2 py-3 italic">No divisions found.</p>
          ) : (
            <div className="flex items-center gap-2 px-2 py-3 text-xs text-gray-400">
              <Icons.Loader2 className="w-3 h-3 animate-spin" /> Loading divisions...
            </div>
          )}
        </div>

        {user === 'admin' && (
          <>
            <div className="h-px bg-gray-200 mx-3" />
            <div className="p-3">
              <button
                onClick={() => handleOpenApp('admin-panel', 'Control Panel', 'admin')}
                className="flex items-center gap-3 p-3 w-full active:bg-blue-500 active:text-white rounded-lg transition-colors text-left"
              >
                <Icons.Settings className="w-5 h-5 text-gray-600 shrink-0" />
                <span className="text-sm font-medium text-gray-800">Control Panel</span>
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-3 flex justify-between border-t border-blue-700/50 shrink-0">
        <button
          onClick={handleLogoff}
          className="flex items-center gap-2 px-4 py-2 active:bg-white/20 rounded-lg transition-colors"
        >
          <Icons.LogOut className="w-4 h-4 text-white" />
          <span className="text-sm text-white font-medium">Log Off</span>
        </button>
        <button
          onClick={handleShutdown}
          className="flex items-center gap-2 px-4 py-2 active:bg-white/20 rounded-lg transition-colors"
        >
          <Icons.Power className="w-4 h-4 text-red-300" />
          <span className="text-sm text-white font-medium">Shut Down</span>
        </button>
      </div>
    </div>
  );
}
