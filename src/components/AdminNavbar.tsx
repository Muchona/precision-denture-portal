import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, Users, Settings } from 'lucide-react';
import logo from '../assets/logo.png';

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
    localStorage.removeItem('mock_user');
    await supabase.auth.signOut();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-full bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-8">
        <Link to="/admin" className="flex items-center hover:opacity-80 transition-opacity">
          <div className="flex items-center justify-center relative">
            <img src={logo} alt="Precision Dental Services Logo" className="h-16 w-auto object-contain" />
            <div className="absolute -bottom-1 -right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center shadow-sm border-2 border-white">
              <span className="text-[10px] font-bold text-white">A</span>
            </div>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-2">
          <Link 
            to="/admin" 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive('/admin') 
                ? 'bg-primary-50 text-primary-600 border border-primary-100' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Orders
          </Link>
          <Link 
            to="/admin/clients" 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive('/admin/clients') 
                ? 'bg-primary-50 text-primary-600 border border-primary-100' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
            }`}
          >
            <Users className="w-4 h-4" />
            Clients
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-6 relative" ref={dropdownRef}>
        {/* Public Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 mr-4 border-r border-slate-200 pr-6">
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Website</Link>
          <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">About Us</Link>
          <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Products</Link>
          <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Contact</Link>
        </div>
        
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 hover:bg-slate-50 py-1.5 px-3 rounded-xl transition-colors border border-transparent hover:border-slate-200"
        >
          <div className="w-9 h-9 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-primary-500" />
            )}
          </div>
          <div className="text-sm text-slate-700 hidden sm:flex flex-col items-start font-medium text-left">
            <span>{profile?.first_name ? `${profile.first_name} ${profile.last_name}` : (userEmail?.split('@')[0] || 'Admin')}</span>
            <span className="text-xs text-primary-600 font-bold">System Admin</span>
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 z-50">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
              <p className="text-sm font-bold text-slate-900 truncate">{profile?.first_name ? `${profile.first_name} ${profile.last_name}` : userEmail}</p>
              <p className="text-xs text-slate-500 mt-1">System Admin</p>
            </div>
            <div className="p-2 space-y-1">
              <Link 
                to="/admin/settings"
                className="w-full text-left px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary-600 rounded-xl transition-colors flex items-center gap-3"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Settings
              </Link>
              <button 
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl transition-colors flex items-center gap-3"
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
