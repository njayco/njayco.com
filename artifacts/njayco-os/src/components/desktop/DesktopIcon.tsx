import * as Icons from 'lucide-react';
import { useDesktopStore, WindowType } from '@/store/use-desktop-store';
import { useState } from 'react';

interface DesktopIconProps {
  id: string;
  name: string;
  iconType: string;
  windowType: WindowType;
  data?: any;
}

export function DesktopIcon({ id, name, iconType, windowType, data }: DesktopIconProps) {
  const [isFocused, setIsFocused] = useState(false);
  const openWindow = useDesktopStore(s => s.openWindow);
  
  // Dynamically resolve icon from Lucide - handle both PascalCase and lowercase
  const toPascalCase = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const iconKey = toPascalCase(iconType);
  const IconComponent = (Icons as any)[iconKey] || (Icons as any)[iconType] || Icons.Folder;

  const handleDoubleClick = () => {
    openWindow({
      id,
      title: name,
      windowType,
      data
    });
    setIsFocused(false);
  };

  return (
    <div 
      className={`
        w-24 flex flex-col items-center justify-start gap-1 p-2 rounded 
        cursor-pointer transition-all border border-transparent
        ${isFocused ? 'bg-white/20 border-white/30 shadow-sm' : 'hover:bg-white/10 hover:border-white/20'}
      `}
      onClick={(e) => {
        e.stopPropagation();
        setIsFocused(true);
      }}
      onDoubleClick={handleDoubleClick}
    >
      <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/20">
        <IconComponent className="w-7 h-7 text-white drop-shadow-md" strokeWidth={1.5} />
      </div>
      <span className="text-white text-xs font-semibold text-center leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] line-clamp-2">
        {name}
      </span>
    </div>
  );
}
