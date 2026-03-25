import { useDesktopStore } from '@/store/use-desktop-store';
import { DesktopIcon } from '@/components/desktop/DesktopIcon';
import { Taskbar } from '@/components/desktop/Taskbar';
import { WindowWrapper } from '@/components/desktop/WindowWrapper';
import { useGetDivisions } from '@/hooks/use-music-hooks';
import type { WindowType } from '@/store/use-desktop-store';
import * as Icons from 'lucide-react';

export default function Desktop() {
  const { windows, user } = useDesktopStore();
  const { data: divisions, isLoading } = useGetDivisions();
  const isAdmin = user === 'admin';

  // Control Panel only shown to admin users
  const coreIcons = isAdmin
    ? [{ id: 'admin-panel', name: 'Control Panel', iconType: 'Settings', windowType: 'admin' as const }]
    : [];
  
  // Slugs that should never render as regular division window icons
  const hiddenDivisionSlugs = new Set<string>();

  return (
    <div 
      className="h-screen w-screen overflow-hidden relative select-none"
      onClick={() => useDesktopStore.getState().setStartMenuOpen(false)}
    >
      {/* Wallpaper */}
      <img 
        src={`${import.meta.env.BASE_URL}images/xp-wallpaper.png`} 
        alt="Wallpaper" 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none" 
      />
      
      {/* Desktop Grid Area */}
      <div className="absolute inset-0 bottom-10 z-10 p-4 flex flex-col flex-wrap gap-4 content-start items-start">
        {coreIcons.map(icon => (
          <DesktopIcon 
            key={icon.id}
            id={icon.id}
            name={icon.name}
            iconType={icon.iconType}
            windowType={icon.windowType}
          />
        ))}

        {isLoading ? (
          <div className="text-white/70 text-sm p-2 flex items-center gap-2 drop-shadow-md">
            <Icons.Loader2 className="w-4 h-4 animate-spin" /> Loading Divisions...
          </div>
        ) : (
          divisions?.filter(div => !hiddenDivisionSlugs.has(div.slug)).map(div => (
            <DesktopIcon 
              key={div.id}
              id={`div-${div.id}`}
              name={div.name}
              iconType={div.iconType || 'Folder'}
              windowType={(div.windowType as WindowType) || 'browser'}
              data={{ url: div.websiteUrl, content: div.notepadContent, division: div }}
            />
          ))
        )}
      </div>

      {/* Windows Layer */}
      <div className="absolute inset-0 bottom-10 z-20 pointer-events-none">
        {/* pointer-events-none on container so clicks pass through to desktop, 
            WindowWrapper will set pointer-events-auto */}
        {windows.map(win => (
          <div key={win.id} className="pointer-events-auto">
            <WindowWrapper window={win} />
          </div>
        ))}
      </div>

      {/* Taskbar Layer */}
      <Taskbar />
    </div>
  );
}
