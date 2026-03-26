import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WindowType = 'browser' | 'notepad' | 'music' | 'explorer' | 'admin' | 'custom' | 'company';

export interface WindowData {
  url?: string | null;
  content?: string | null;
  division?: {
    id?: number;
    name?: string;
    shortDescription?: string;
    fullDescription?: string;
    websiteUrl?: string | null;
    iconType?: string;
    windowType?: string;
    status?: string;
    category?: string;
  };
}

export interface WindowState {
  id: string;
  title: string;
  windowType: WindowType;
  data?: WindowData;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  userType: string;
  role: string;
}

interface DesktopStore {
  visited: boolean;
  user: 'admin' | 'user' | 'guest' | null;
  authToken: string | null;
  authUser: AuthUser | null;
  alwaysShowStartup: boolean;
  windows: WindowState[];
  nextZIndex: number;
  activeWindowId: string | null;
  startMenuOpen: boolean;
  
  setVisited: (v: boolean) => void;
  setUser: (u: 'admin' | 'user' | 'guest' | null) => void;
  setAuth: (token: string, user: AuthUser, role: 'admin' | 'user' | 'guest') => void;
  clearAuth: () => void;
  setAlwaysShowStartup: (v: boolean) => void;
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
      authToken: null,
      authUser: null,
      alwaysShowStartup: false,
      windows: [],
      nextZIndex: 10,
      activeWindowId: null,
      startMenuOpen: false,

      setVisited: (visited) => set({ visited }),
      setUser: (user) => set({ user }),
      setAuth: (authToken, authUser, role) => set({ authToken, authUser, user: role }),
      clearAuth: () => set({ authToken: null, authUser: null, user: null, windows: [], activeWindowId: null }),
      setAlwaysShowStartup: (alwaysShowStartup) => set({ alwaysShowStartup }),
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

      closeWindow: (id) => set(s => {
        const remaining = s.windows.filter(w => w.id !== id);
        let nextActive = s.activeWindowId;
        if (s.activeWindowId === id) {
          const topWindow = remaining
            .filter(w => !w.isMinimized)
            .sort((a, b) => b.zIndex - a.zIndex)[0];
          nextActive = topWindow?.id ?? null;
        }
        return { windows: remaining, activeWindowId: nextActive };
      }),

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
      partialize: (state) => ({
        visited: state.visited,
        user: state.user,
        authToken: state.authToken,
        authUser: state.authUser,
        alwaysShowStartup: state.alwaysShowStartup
      })
    }
  )
);
