import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Users, Settings } from 'lucide-react';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState<string | null>('');
  const [profile, setProfile] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || '');
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) setProfile(data);
      }
    };
    fetchUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full bg-surface-card border-b border-primary-500/20 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/admin" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 flex items-center justify-center relative">
            <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.5)]">
              <span className="text-[8px] font-bold text-white">A</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white tracking-tight leading-none">Monaghan Denture</span>
            <span className="text-[10px] text-primary-400 font-bold uppercase tracking-widest mt-1">Admin Portal</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Link 
            to="/admin" 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive('/admin') 
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Orders
          </Link>
          <Link 
            to="/admin/clients" 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive('/admin/clients') 
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            Clients
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-6 relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 hover:bg-white/5 py-1.5 px-3 rounded-xl transition-colors border border-transparent hover:border-white/10"
        >
          <div className="w-9 h-9 bg-surface-dark border border-primary-500/30 rounded-full flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-primary-400" />
            )}
          </div>
          <div className="text-sm text-gray-300 hidden sm:flex flex-col items-start font-medium text-left">
            <span>{profile?.first_name ? `${profile.first_name} ${profile.last_name}` : (userEmail?.split('@')[0] || 'Admin')}</span>
            <span className="text-xs text-primary-500 font-bold">System Admin</span>
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-64 apple-glass rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 z-50">
            <div className="px-5 py-4 border-b border-white/5 bg-surface-dark/50">
              <p className="text-sm font-bold text-white truncate">{profile?.first_name ? `${profile.first_name} ${profile.last_name}` : userEmail}</p>
              <p className="text-xs text-primary-400 mt-1">System Admin</p>
            </div>
            <div className="p-2 space-y-1">
              <Link 
                to="/admin/settings"
                className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-white rounded-xl transition-colors flex items-center gap-3"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button 
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors flex items-center gap-3"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
