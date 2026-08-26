import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, Settings, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
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

  return (
    <nav className="w-full bg-surface-card border-b border-white/5 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Monaghan Denture</span>
      </Link>
      
      <div className="flex items-center gap-6 relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 hover:bg-white/5 py-1.5 px-3 rounded-xl transition-colors border border-transparent hover:border-white/10"
        >
          <div className="w-9 h-9 bg-surface-dark border border-white/10 rounded-full flex items-center justify-center overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <div className="text-sm text-gray-300 hidden sm:flex flex-col items-start font-medium text-left">
            <span>{profile?.first_name ? `${profile.first_name} ${profile.last_name}` : (userEmail?.split('@')[0] || 'My Account')}</span>
            <span className="text-xs text-gray-500 font-normal">{profile?.business_name || 'Dentist'}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-64 apple-glass rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 z-50">
            <div className="px-5 py-4 border-b border-white/5 bg-surface-dark/50">
              <p className="text-sm font-bold text-white truncate">{profile?.first_name ? `${profile.first_name} ${profile.last_name}` : userEmail}</p>
              <p className="text-xs text-primary-400 mt-1">{userEmail}</p>
            </div>
            <div className="p-2">
              <Link 
                to="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                Clinic Details
              </Link>
              <div className="my-1 border-t border-white/5"></div>
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-colors"
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
