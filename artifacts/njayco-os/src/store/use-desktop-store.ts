import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WindowType = 'browser' | 'notepad' | 'music' | 'explorer' | 'admin' | 'custom' | 'company';

export interface WindowState {
  id: string;
  title: string;
  windowType: WindowType;
  data?: any;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface DesktopStore {
  visited: boolean;
  user: 'admin' | 'user' | 'guest' | null;
  windows: WindowState[];
  nextZIndex: number;
  activeWindowId: string | null;
  startMenuOpen: boolean;
  
  setVisited: (v: boolean) => void;
  setUser: (u: 'admin' | 'user' | 'guest' | null) => void;
  setStartMenuOpen: (v: boolean) => void;
  
  openWindow: (win: Omit<WindowState, 'isMinimized' | 'isMaximized' | 'zIndex'>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  closeAllWindows: () => void;
}

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set, get) => ({
      visited: false,
      user: null,
      windows: [],
      nextZIndex: 10,
      activeWindowId: null,
      startMenuOpen: false,

      setVisited: (visited) => set({ visited }),
      setUser: (user) => set({ user }),
      setStartMenuOpen: (startMenuOpen) => set({ startMenuOpen }),

      openWindow: (win) => {
        const state = get();
        const existing = state.windows.find(w => w.id === win.id);
        if (existing) {
          state.focusWindow(win.id);
          if (existing.isMinimized) {
            set(s => ({
              windows: s.windows.map(w => w.id === win.id ? { ...w, isMinimized: false } : w)
            }));
          }
          return;
        }
        
        const newZ = state.nextZIndex + 1;
        set(s => ({
          windows: [...s.windows, {
            ...win,
            isMinimized: false,
            isMaximized: false,
            zIndex: newZ
          }],
          nextZIndex: newZ,
          activeWindowId: win.id,
          startMenuOpen: false
        }));
      },

      closeWindow: (id) => set(s => ({
        windows: s.windows.filter(w => w.id !== id),
        activeWindowId: s.activeWindowId === id ? null : s.activeWindowId
      })),

      minimizeWindow: (id) => set(s => ({
        windows: s.windows.map(w => w.id === id ? { ...w, isMinimized: true } : w),
        activeWindowId: s.activeWindowId === id ? null : s.activeWindowId
      })),

      maximizeWindow: (id) => set(s => {
        const win = s.windows.find(w => w.id === id);
        if (!win) return s;
        
        const isMax = !win.isMaximized;
        return {
          windows: s.windows.map(w => w.id === id ? { ...w, isMaximized: isMax, isMinimized: false, zIndex: s.nextZIndex + 1 } : w),
          nextZIndex: s.nextZIndex + 1,
          activeWindowId: id
        };
      }),

      focusWindow: (id) => {
        const state = get();
        if (state.activeWindowId === id) return;
        const newZ = state.nextZIndex + 1;
        set(s => ({
          windows: s.windows.map(w => w.id === id ? { ...w, zIndex: newZ, isMinimized: false } : w),
          nextZIndex: newZ,
          activeWindowId: id,
          startMenuOpen: false
        }));
      },
      
      closeAllWindows: () => set({ windows: [], activeWindowId: null })
    }),
    {
      name: 'njayco-os-storage',
      partialize: (state) => ({ visited: state.visited, user: state.user })
    }
  )
);
