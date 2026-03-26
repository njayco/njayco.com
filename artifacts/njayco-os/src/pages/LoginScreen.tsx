import { useDesktopStore } from '@/store/use-desktop-store';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useGetDivisions } from '@/hooks/use-music-hooks';
import type { LucideIcon } from 'lucide-react';

type LucideIcons = typeof Icons;
function getDivisionIcon(name?: string): LucideIcon {
  if (!name) return Icons.Folder;
  const toPascalCase = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const key = toPascalCase(name) as keyof LucideIcons;
  const icon = Icons[key];
  if (icon && typeof icon === 'function') return icon as LucideIcon;
  return Icons.Folder;
}

export default function LoginScreen() {
  const setUser = useDesktopStore(s => s.setUser);
  const { data: divisions } = useGetDivisions();

  const handleLogin = (role: 'admin' | 'user' | 'guest') => {
    setUser(role);
  };

  return (
    <div className="h-[100dvh] w-screen relative flex items-center justify-center overflow-hidden font-sans">
      <div className="absolute inset-0 bg-blue-900 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/50 to-blue-900/90 mix-blend-overlay" />
        <img 
          src={`${import.meta.env.BASE_URL}images/xp-wallpaper.png`} 
          alt="Wallpaper" 
          className="w-full h-full object-cover opacity-40 blur-sm scale-105" 
        />
      </div>

      {divisions && divisions.length > 0 && (
        <div className="hidden md:block absolute left-0 top-0 h-full w-48 z-5 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent" />
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div className="relative z-10 flex flex-col gap-3 p-6 pt-16 opacity-60">
            {divisions.slice(0, 14).map((div, i) => {
              const DivIcon = getDivisionIcon(div.iconType);
              return (
                <motion.div
                  key={div.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <DivIcon className="w-4 h-4 text-white/80" />
                  </div>
                  <span className="text-white/60 text-xs font-medium truncate">{div.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {divisions && divisions.length > 7 && (
        <div className="hidden md:block absolute right-0 top-0 h-full w-48 z-5 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-blue-900/80 to-transparent" />
          <div className="absolute inset-0 backdrop-blur-sm" />
          <div className="relative z-10 flex flex-col gap-3 p-6 pt-16 opacity-50 items-end">
            {divisions.slice(14, 22).map((div, i) => {
              const DivIcon = getDivisionIcon(div.iconType);
              return (
                <motion.div
                  key={div.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.3, duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-white/60 text-xs font-medium truncate">{div.name}</span>
                  <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                    <DivIcon className="w-4 h-4 text-white/80" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl mx-4 bg-gradient-to-b from-[#003399] to-[#001f5c] rounded-xl shadow-2xl overflow-hidden border border-blue-400/30"
      >
        <div className="h-16 md:h-24 bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-between px-4 md:px-8 border-b border-blue-400/30">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full p-1 shadow-lg shrink-0">
              <img src={`${import.meta.env.BASE_URL}images/njayco-logo.png`} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-white text-xl md:text-3xl font-display italic font-bold drop-shadow-md">NJAYCO OS</h1>
          </div>
          <div className="hidden sm:block text-blue-200/80 font-mono text-sm">CORPORATE EDITION</div>
        </div>

        <div className="bg-slate-100 p-6 md:p-12 flex flex-col items-center">
          <h2 className="text-lg md:text-2xl text-slate-800 mb-6 md:mb-10 font-medium text-center">To begin, tap your user account</h2>
          
          <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-12 w-full">
            <UserCard 
              name="Administrator" 
              desc="Manage System Settings" 
              img="admin-avatar.png"
              onClick={() => handleLogin('admin')} 
            />
            
            <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
            
            <UserCard 
              name="Log In" 
              desc="Access Your Workspace" 
              img="user-avatar.png"
              onClick={() => handleLogin('user')} 
            />
            
            <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
            
            <UserCard 
              name="New Guest" 
              desc="Create Temporary Session" 
              img="guest-avatar.png"
              onClick={() => handleLogin('guest')} 
            />
          </div>
        </div>

        <div className="h-12 md:h-16 bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-between px-4 md:px-8 border-t border-blue-400/30">
          <div className="flex gap-4 md:gap-6">
            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <div className="w-6 h-6 rounded bg-red-500 border border-white/30 flex items-center justify-center shadow-inner"><Icons.Power className="w-3 h-3" /></div>
              <span className="text-xs md:text-sm font-medium">Turn Off</span>
            </button>
            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <div className="w-6 h-6 rounded bg-green-500 border border-white/30 flex items-center justify-center shadow-inner"><Icons.RefreshCcw className="w-3 h-3" /></div>
              <span className="text-xs md:text-sm font-medium">Restart</span>
            </button>
          </div>
          {divisions && (
            <div className="text-blue-200/60 text-[10px] md:text-xs font-mono">
              {divisions.length} division{divisions.length !== 1 ? 's' : ''} loaded
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function UserCard({ name, desc, img, onClick }: { name: string, desc: string, img: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-4 p-3 md:p-4 rounded-xl hover:bg-white active:bg-white hover:shadow-lg active:shadow-lg transition-all border border-transparent hover:border-slate-200 active:border-slate-200 group text-left w-full md:w-64"
    >
      <div className="w-12 h-12 md:w-16 md:h-16 rounded bg-white border-2 border-slate-300 shadow-sm overflow-hidden group-hover:border-blue-400 group-active:border-blue-400 transition-colors shrink-0">
        <img src={`${import.meta.env.BASE_URL}images/${img}`} className="w-full h-full object-cover" alt={name} />
      </div>
      <div>
        <div className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-blue-600 group-active:text-blue-600 transition-colors">{name}</div>
        <div className="text-xs text-slate-500 mt-0.5 md:mt-1">{desc}</div>
      </div>
    </button>
  );
}
