import * as Icons from 'lucide-react';
import { useDesktopStore, type WindowType } from '@/store/use-desktop-store';
import { useState, useRef, useEffect } from 'react';

type LucideIcons = typeof Icons;

function resolveIcon(iconType: string): React.ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }> {
  const toPascalCase = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const key = toPascalCase(iconType) as keyof LucideIcons;
  const icon = Icons[key];
  if (icon && typeof icon === 'function') return icon as React.ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }>;
  const fallback = Icons[iconType as keyof LucideIcons];
  if (fallback && typeof fallback === 'function') return fallback as React.ComponentType<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }>;
  return Icons.Folder;
}

interface DesktopIconProps {
  id: string;
  name: string;
  iconType: string;
  windowType: WindowType;
  iconColor?: string;
  slug?: string;
  data?: Record<string, unknown>;
}

interface ContextMenuItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  separator?: boolean;
}

function IconBadge({ slug, iconType, iconColor }: { slug: string; iconType: string; iconColor: string }) {
  const IconComponent = resolveIcon(iconType);
  const bg = iconColor || '#2563EB';
  const shine = <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent pointer-events-none rounded-2xl" />;

  if (slug === 'my-njayco') {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: '#1D4ED8' }}>
        {shine}
        <span className="text-white font-black text-2xl tracking-tight relative z-10">NJ</span>
      </div>
    );
  }

  if (slug === 'uv-empire') {
    return (
      <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg relative overflow-hidden gap-0.5" style={{ background: '#111827' }}>
        {shine}
        <span className="text-white font-black text-sm tracking-widest relative z-10">UV</span>
        <span className="text-white/80 font-semibold relative z-10" style={{ fontSize: '7px', letterSpacing: '0.18em' }}>EMPIRE</span>
      </div>
    );
  }

  if (slug === 'denoko' || slug === 'denoko-taxi') {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: '#111827' }}>
        {shine}
        <span className="text-white font-bold text-xs tracking-wider relative z-10">Denoko</span>
      </div>
    );
  }

  if (slug === 'uv-music-group') {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: '#0F0F0F' }}>
        {shine}
        <Icons.Disc3 className="w-8 h-8 relative z-10" style={{ color: '#DC2626' }} strokeWidth={1.5} />
      </div>
    );
  }

  if (slug === 'wax-radio') {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: bg }}>
        {shine}
        <Icons.Disc3 className="w-8 h-8 text-white relative z-10" strokeWidth={1.5} />
      </div>
    );
  }

  if (slug === 'phone-msgr') {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: '#22C55E' }}>
        {shine}
        <Icons.Phone className="w-8 h-8 text-white relative z-10" strokeWidth={2} />
      </div>
    );
  }

  if (slug === 'greet-me') {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-100 pointer-events-none rounded-2xl" />
        <Icons.Handshake className="w-8 h-8 relative z-10" style={{ color: '#2563EB' }} strokeWidth={1.5} />
      </div>
    );
  }

  if (slug === 'ysup-inc' || slug === 'ysup-campus') {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: bg }}>
        {shine}
        <Icons.GraduationCap className="w-8 h-8 text-white relative z-10" strokeWidth={1.5} />
      </div>
    );
  }

  if (slug === 'investor-info') {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-100 pointer-events-none rounded-2xl" />
        <Icons.BarChart2 className="w-8 h-8 relative z-10" style={{ color: '#16A34A' }} strokeWidth={1.5} />
      </div>
    );
  }

  if (slug === 'contact') {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: '#F3F4F6' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-white to-slate-100 pointer-events-none rounded-2xl" />
        <Icons.UserCircle2 className="w-8 h-8 relative z-10" style={{ color: '#374151' }} strokeWidth={1.5} />
      </div>
    );
  }

  if (slug === 'about-najee') {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: bg }}>
        {shine}
        <Icons.User className="w-8 h-8 text-white relative z-10" strokeWidth={1.5} />
      </div>
    );
  }

  if (slug === 'njayco-corporate') {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: bg }}>
        {shine}
        <Icons.Building2 className="w-8 h-8 text-white relative z-10" strokeWidth={1.5} />
      </div>
    );
  }

  if (slug === 'recycle-bin') {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: '#1a1a2e' }}>
        {shine}
        <img
          src={`${import.meta.env.BASE_URL}images/njayco-logo.png`}
          alt="NJAYCO"
          className="w-10 h-10 object-contain relative z-10"
        />
      </div>
    );
  }

  if (slug === 'admin-panel' || slug === '') {
    return (
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: '#374151' }}>
        {shine}
        <Icons.Settings className="w-8 h-8 text-white relative z-10" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden" style={{ background: bg }}>
      {shine}
      <IconComponent className="w-8 h-8 text-white relative z-10" strokeWidth={1.5} />
    </div>
  );
}

export function DesktopIcon({ id, name, iconType, windowType, iconColor, slug = '', data }: DesktopIconProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const contextRef = useRef<HTMLDivElement>(null);
  const openWindow = useDesktopStore(s => s.openWindow);

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

  const effectiveSlug = slug || id;

  return (
    <>
      <div
        className={`
          w-20 flex flex-col items-center justify-start gap-1.5 p-2 rounded-lg
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
        <IconBadge slug={effectiveSlug} iconType={iconType} iconColor={iconColor || '#2563EB'} />
        <span className="text-white text-[11px] font-semibold text-center leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] line-clamp-2 w-full">
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
