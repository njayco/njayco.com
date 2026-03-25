import * as Icons from 'lucide-react';
import { useDesktopStore, type WindowType } from '@/store/use-desktop-store';
import { useState, useRef, useEffect } from 'react';

type LucideIcons = typeof Icons;

function resolveIcon(iconType: string): React.ComponentType<{ className?: string; strokeWidth?: number }> {
  const toPascalCase = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const key = toPascalCase(iconType) as keyof LucideIcons;
  const icon = Icons[key];
  if (icon && typeof icon === 'function') return icon as React.ComponentType<{ className?: string; strokeWidth?: number }>;
  const fallback = Icons[iconType as keyof LucideIcons];
  if (fallback && typeof fallback === 'function') return fallback as React.ComponentType<{ className?: string; strokeWidth?: number }>;
  return Icons.Folder;
}

interface DesktopIconProps {
  id: string;
  name: string;
  iconType: string;
  windowType: WindowType;
  data?: Record<string, unknown>;
}

interface ContextMenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  separator?: boolean;
}

export function DesktopIcon({ id, name, iconType, windowType, data }: DesktopIconProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const contextRef = useRef<HTMLDivElement>(null);
  const openWindow = useDesktopStore(s => s.openWindow);

  const IconComponent = resolveIcon(iconType);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };
    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu]);

  const handleOpen = () => {
    openWindow({ id, title: name, windowType, data });
    setIsFocused(false);
    setContextMenu(null);
  };

  const handleDoubleClick = () => {
    handleOpen();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY });
    setIsFocused(true);
  };

  const menuItems: ContextMenuItem[] = [
    { label: 'Open', icon: Icons.FolderOpen, onClick: handleOpen },
    { label: 'Open in New Window', icon: Icons.ExternalLink, onClick: () => {
      openWindow({ id: `${id}-new-${Date.now()}`, title: name, windowType, data });
      setContextMenu(null);
    }},
    { label: 'Properties', icon: Icons.Info, onClick: () => setContextMenu(null), separator: true },
  ];

  return (
    <>
      <div 
        className={`
          w-24 flex flex-col items-center justify-start gap-1 p-2 rounded 
          cursor-pointer transition-all border border-transparent
          ${isFocused ? 'bg-white/20 border-white/30 shadow-sm' : 'hover:bg-white/10 hover:border-white/20'}
        `}
        onClick={(e) => {
          e.stopPropagation();
          setIsFocused(true);
          setContextMenu(null);
        }}
        onDoubleClick={handleDoubleClick}
        onContextMenu={handleContextMenu}
      >
        <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/20">
          <IconComponent className="w-7 h-7 text-white drop-shadow-md" strokeWidth={1.5} />
        </div>
        <span className="text-white text-xs font-semibold text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2">
          {name}
        </span>
      </div>

      {contextMenu && (
        <div
          ref={contextRef}
          className="fixed bg-white border border-slate-200 rounded shadow-xl z-[10001] py-1 min-w-[180px] text-sm"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          {menuItems.map((item, i) => (
            <div key={i}>
              {item.separator && <div className="h-px bg-slate-200 my-1" />}
              <button
                onClick={item.onClick}
                className={`w-full flex items-center gap-3 px-3 py-1.5 hover:bg-blue-500 hover:text-white transition-colors text-left ${i === 0 ? 'font-semibold' : ''}`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
