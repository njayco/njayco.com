import { useDesktopStore } from '@/store/use-desktop-store';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useGetDivisions } from '@/hooks/use-music-hooks';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';

type LucideIcons = typeof Icons;
function getDivisionIcon(name?: string): LucideIcon {
  if (!name) return Icons.Folder;
  const toPascalCase = (s: string) => s.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const key = toPascalCase(name) as keyof LucideIcons;
  const icon = Icons[key];
  if (icon && typeof icon === 'function') return icon as LucideIcon;
  return Icons.Folder;
}

type FormView = 'cards' | 'admin-login' | 'user-login' | 'signup';

const API_BASE = `${import.meta.env.BASE_URL}api`;

export default function LoginScreen() {
  const { setUser, setAuth } = useDesktopStore();
  const { data: divisions } = useGetDivisions();
  const [view, setView] = useState<FormView>('cards');

  const handleGuest = () => {
    setUser('guest');
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

        <div className="bg-slate-100 p-6 md:p-12 flex flex-col items-center min-h-[280px]">
          <AnimatePresence mode="wait">
            {view === 'cards' && (
              <motion.div
                key="cards"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <h2 className="text-lg md:text-2xl text-slate-800 mb-6 md:mb-10 font-medium text-center">To begin, tap your user account</h2>
                <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-8 w-full">
                  <UserCard 
                    name="Administrator" 
                    desc="Manage System Settings" 
                    img="admin-avatar.png"
                    onClick={() => setView('admin-login')} 
                  />
                  <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                  <UserCard 
                    name="Log In" 
                    desc="Access Your Workspace" 
                    img="user-avatar.png"
                    onClick={() => setView('user-login')} 
                  />
                  <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                  <UserCard 
                    name="Sign Up" 
                    desc="Create New Account" 
                    img="user-avatar.png"
                    onClick={() => setView('signup')} 
                  />
                  <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
                  <UserCard 
                    name="New Guest" 
                    desc="Create Temporary Session" 
                    img="guest-avatar.png"
                    onClick={handleGuest} 
                  />
                </div>
              </motion.div>
            )}
            {view === 'admin-login' && (
              <motion.div
                key="admin-login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-sm"
              >
                <AdminLoginForm onBack={() => setView('cards')} onSuccess={(token, user) => setAuth(token, user, 'admin')} />
              </motion.div>
            )}
            {view === 'user-login' && (
              <motion.div
                key="user-login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-sm"
              >
                <UserLoginForm onBack={() => setView('cards')} onSuccess={(token, user) => setAuth(token, user, 'user')} />
              </motion.div>
            )}
            {view === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-sm"
              >
                <SignUpForm onBack={() => setView('cards')} onSuccess={(token, user) => setAuth(token, user, 'user')} />
              </motion.div>
            )}
          </AnimatePresence>
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
      className="flex items-center gap-4 p-3 md:p-4 rounded-xl hover:bg-white active:bg-white hover:shadow-lg active:shadow-lg transition-all border border-transparent hover:border-slate-200 active:border-slate-200 group text-left w-full md:w-48"
    >
      <div className="w-12 h-12 md:w-16 md:h-16 rounded bg-white border-2 border-slate-300 shadow-sm overflow-hidden group-hover:border-blue-400 group-active:border-blue-400 transition-colors shrink-0">
        <img src={`${import.meta.env.BASE_URL}images/${img}`} className="w-full h-full object-cover" alt={name} />
      </div>
      <div>
        <div className="text-base md:text-lg font-bold text-slate-800 group-hover:text-blue-600 group-active:text-blue-600 transition-colors">{name}</div>
        <div className="text-xs text-slate-500 mt-0.5 md:mt-1">{desc}</div>
      </div>
    </button>
  );
}

function FormBackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-4">
      <Icons.ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
}

function FormInput({ label, type = "text", value, onChange, placeholder, autoFocus }: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
}

function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="mb-3 p-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
      <Icons.AlertCircle className="w-4 h-4 shrink-0" />
      {message}
    </div>
  );
}

function AdminLoginForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: (token: string, user: any) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      onSuccess(data.token, data.user);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormBackButton onClick={onBack} />
      <h2 className="text-xl font-bold text-slate-800 mb-1">Administrator Login</h2>
      <p className="text-sm text-slate-500 mb-4">Enter admin credentials to continue</p>
      <FormError message={error} />
      <FormInput label="Username" value={username} onChange={setUsername} placeholder="njayco" autoFocus />
      <FormInput label="Password" type="password" value={password} onChange={setPassword} />
      <button type="submit" disabled={loading} className="w-full mt-2 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

function UserLoginForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: (token: string, user: any) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      onSuccess(data.token, data.user);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormBackButton onClick={onBack} />
      <h2 className="text-xl font-bold text-slate-800 mb-1">Log In</h2>
      <p className="text-sm text-slate-500 mb-4">Enter your credentials to access your workspace</p>
      <FormError message={error} />
      <FormInput label="Username" value={username} onChange={setUsername} autoFocus />
      <FormInput label="Password" type="password" value={password} onChange={setPassword} />
      <button type="submit" disabled={loading} className="w-full mt-2 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}

function SignUpForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: (token: string, user: any) => void }) {
  const [userType, setUserType] = useState<'client' | 'contractor' | 'employee'>('client');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirmPassword, userType }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Sign up failed');
        return;
      }
      onSuccess(data.token, data.user);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: 'client' as const, label: 'New Client', icon: Icons.User },
    { value: 'contractor' as const, label: 'Contractor', icon: Icons.Wrench },
    { value: 'employee' as const, label: 'Employee', icon: Icons.Briefcase },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <FormBackButton onClick={onBack} />
      <h2 className="text-xl font-bold text-slate-800 mb-1">Sign Up</h2>
      <p className="text-sm text-slate-500 mb-4">Create a new account</p>
      <FormError message={error} />
      
      <div className="mb-3">
        <label className="block text-sm font-medium text-slate-700 mb-1">Account Type</label>
        <div className="grid grid-cols-3 gap-2">
          {typeOptions.map(opt => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setUserType(opt.value)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs font-medium transition-colors ${
                  userType === opt.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <FormInput label="Username" value={username} onChange={setUsername} autoFocus />
      <FormInput label="Email" type="email" value={email} onChange={setEmail} />
      <FormInput label="Password" type="password" value={password} onChange={setPassword} />
      <FormInput label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} />
      <button type="submit" disabled={loading} className="w-full mt-2 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  );
}
