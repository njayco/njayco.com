import { useDesktopStore, type WindowType } from '@/store/use-desktop-store';
import { useGetDivisions } from '@/hooks/use-music-hooks';
import * as Icons from 'lucide-react';
import { MobileTaskbar } from './MobileTaskbar';
import { MobileStartMenu } from './MobileStartMenu';
import { MobileWindowPanel } from './MobileWindowPanel';
import { IconBadge } from '../desktop/DesktopIcon';

export default function MobileDesktop() {
  const { windows, activeWindowId, openWindow, closeAllWindows, startMenuOpen, setStartMenuOpen } = useDesktopStore();
  const { data: divisions, isLoading } = useGetDivisions();
  const activeWindow = windows.find(w => w.id === activeWindowId);

  const handleOpenApp = (id: string, name: string, windowType: WindowType, data?: Record<string, unknown>) => {
    closeAllWindows();
    openWindow({ id, title: name, windowType, data });
    setStartMenuOpen(false);
  };

  const handleStartPress = () => {
    setStartMenuOpen(!startMenuOpen);
  };

  return (
    <div className="h-[100dvh] w-screen overflow-hidden relative select-none flex flex-col">
      <img
        src={`${import.meta.env.BASE_URL}images/xp-wallpaper.png`}
        alt="Wallpaper"
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />

      <div className="flex-1 overflow-y-auto overscroll-contain z-10 pb-14">
        <div className="p-4 pt-6">
          <div className="grid grid-cols-3 gap-3">
            {isLoading ? (
              <div className="col-span-3 text-white/70 text-sm p-4 flex items-center gap-2 drop-shadow-md justify-center">
                <Icons.Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </div>
            ) : (
              divisions?.map(div => (
                <button
                  key={div.id}
                  onClick={() => handleOpenApp(
                    `div-${div.id}`,
                    div.name,
                    (div.windowType as WindowType) || 'browser',
                    { url: div.websiteUrl, content: div.notepadContent, division: div }
                  )}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl active:bg-white/20 transition-colors"
                >
                  <IconBadge
                    slug={div.slug}
                    iconType={div.iconType || 'Folder'}
                    iconColor={div.iconColor || '#2563EB'}
                  />
                  <span className="text-white text-[10px] font-semibold text-center leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] line-clamp-2 w-full">
                    {div.name}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {activeWindow && <MobileWindowPanel window={activeWindow} />}

      {startMenuOpen && (
        <MobileStartMenu onClose={() => setStartMenuOpen(false)} />
      )}

      <MobileTaskbar
        onStartPress={handleStartPress}
        startMenuOpen={startMenuOpen}
      />
    </div>
  );
}
