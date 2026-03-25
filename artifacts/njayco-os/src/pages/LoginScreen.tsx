import { useDesktopStore } from '@/store/use-desktop-store';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

export default function LoginScreen() {
  const setUser = useDesktopStore(s => s.setUser);

  const handleLogin = (role: 'admin' | 'user' | 'guest') => {
    setUser(role);
  };

  return (
    <div className="h-screen w-screen relative flex items-center justify-center overflow-hidden font-sans">
      {/* Background */}
      <div className="absolute inset-0 bg-blue-900 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/50 to-blue-900/90 mix-blend-overlay" />
        <img 
          src={`${import.meta.env.BASE_URL}images/xp-wallpaper.png`} 
          alt="Wallpaper" 
          className="w-full h-full object-cover opacity-40 blur-sm scale-105" 
        />
      </div>

      {/* Main Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-4xl bg-gradient-to-b from-[#003399] to-[#001f5c] rounded-xl shadow-2xl overflow-hidden border border-blue-400/30"
      >
        {/* Header line */}
        <div className="h-24 bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-between px-8 border-b border-blue-400/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full p-1 shadow-lg">
              <img src={`${import.meta.env.BASE_URL}images/njayco-logo.png`} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-white text-3xl font-display italic font-bold drop-shadow-md">NJAYCO OS</h1>
          </div>
          <div className="text-blue-200/80 font-mono text-sm">CORPORATE EDITION</div>
        </div>

        {/* User Selection Area */}
        <div className="bg-slate-100 p-12 flex flex-col items-center">
          <h2 className="text-2xl text-slate-800 mb-10 font-medium">To begin, click your user account</h2>
          
          <div className="flex justify-center gap-12 w-full">
            <UserCard 
              name="Administrator" 
              desc="Manage System Settings" 
              img="admin-avatar.png"
              onClick={() => handleLogin('admin')} 
            />
            
            <div className="w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
            
            <UserCard 
              name="Log In" 
              desc="Access Your Workspace" 
              img="user-avatar.png"
              onClick={() => handleLogin('user')} 
            />
            
            <div className="w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
            
            <UserCard 
              name="New Guest" 
              desc="Create Temporary Session" 
              img="guest-avatar.png"
              onClick={() => handleLogin('guest')} 
            />
          </div>
        </div>

        {/* Footer */}
        <div className="h-16 bg-gradient-to-r from-blue-800 to-blue-600 flex items-center justify-between px-8 border-t border-blue-400/30">
          <div className="flex gap-6">
            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <div className="w-6 h-6 rounded bg-red-500 border border-white/30 flex items-center justify-center shadow-inner"><Icons.Power className="w-3 h-3" /></div>
              <span className="text-sm font-medium">Turn Off Computer</span>
            </button>
            <button className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <div className="w-6 h-6 rounded bg-green-500 border border-white/30 flex items-center justify-center shadow-inner"><Icons.RefreshCcw className="w-3 h-3" /></div>
              <span className="text-sm font-medium">Restart</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function UserCard({ name, desc, img, onClick }: { name: string, desc: string, img: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-4 p-4 rounded-xl hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-200 group text-left w-64"
    >
      <div className="w-16 h-16 rounded bg-white border-2 border-slate-300 shadow-sm overflow-hidden group-hover:border-blue-400 transition-colors">
        <img src={`${import.meta.env.BASE_URL}images/${img}`} className="w-full h-full object-cover" alt={name} />
      </div>
      <div>
        <div className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{name}</div>
        <div className="text-xs text-slate-500 mt-1">{desc}</div>
      </div>
    </button>
  );
}
