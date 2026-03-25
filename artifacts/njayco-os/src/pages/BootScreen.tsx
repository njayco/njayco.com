import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDesktopStore } from '@/store/use-desktop-store';

interface BootScreenProps {
  onDone?: () => void;
}

export default function BootScreen({ onDone }: BootScreenProps) {
  const setVisited = useDesktopStore(s => s.setVisited);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisited(true);
      onDone?.();
    }, 4500);
    return () => clearTimeout(timer);
  }, [setVisited, onDone]);

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden cursor-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="w-48 h-48 mb-8 relative">
          {/* Logo glow effect */}
          <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
          <img 
            src={`${import.meta.env.BASE_URL}images/njayco-logo.png`} 
            alt="NJAYCO Logo" 
            className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" 
          />
        </div>
        
        <h1 className="text-white text-4xl font-display font-light tracking-widest mb-12">
          NJAYCO <span className="font-bold">OS</span>
        </h1>
        
        {/* Windows XP style loading bar */}
        <div className="w-64 h-5 border-2 border-white/20 rounded p-0.5 relative overflow-hidden bg-white/5">
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute inset-y-0.5 w-1/3 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          />
        </div>
        
        <div className="mt-8 text-white/50 font-mono text-xs tracking-widest uppercase">
          Booting the System...
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-8 text-white/30 font-mono text-[10px]">
        NJAYCO OS Startup | Version 1.0 (Build 983)
      </div>
      <div className="absolute bottom-8 right-8 text-white/30 font-mono text-[10px]">
        © 2024 NJAYCO, Inc.
      </div>
    </div>
  );
}
