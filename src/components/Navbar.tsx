import { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo.png';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, User, Settings, ChevronDown, Menu, X } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>('');
  const [profile, setProfile] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  return (
    <nav className="w-full bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <Link to="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
          <img src={logo} alt="Precision Dental Services Logo" className="h-12 sm:h-16 w-auto object-contain" />
        </Link>
      </div>
      
      <div className="flex items-center gap-4 sm:gap-6 relative" ref={dropdownRef}>
        {/* Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 mr-4 border-r border-slate-200 pr-6">
          <Link to="/dashboard" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">Dashboard</Link>
          <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Website</Link>
          <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">About Us</Link>
          <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Products</Link>
          <Link to="/gallery" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Gallery</Link>
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
              <User className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <div className="text-sm text-slate-700 hidden sm:flex flex-col items-start font-medium text-left">
            <span>{profile?.first_name ? `${profile.first_name} ${profile.last_name}` : (userEmail?.split('@')[0] || 'My Account')}</span>
            <span className="text-xs text-slate-500 font-normal">{profile?.business_name || 'Dentist'}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 z-50">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
              <p className="text-sm font-bold text-slate-900 truncate">{profile?.first_name ? `${profile.first_name} ${profile.last_name}` : userEmail}</p>
              <p className="text-xs text-slate-500 mt-1">{userEmail}</p>
            </div>
            <div className="p-2">
              <Link 
                to="/settings"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Clinic Details
              </Link>
              <div className="my-1 border-t border-slate-100"></div>
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-xl lg:hidden z-40 animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 flex flex-col">
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 text-slate-900 font-bold border-b border-slate-100">Dashboard</Link>
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 text-slate-600 hover:bg-slate-50 border-b border-slate-100">Website Home</Link>
            <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 text-slate-600 hover:bg-slate-50 border-b border-slate-100">About Us</Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 text-slate-600 hover:bg-slate-50 border-b border-slate-100">Products & Prices</Link>
            <Link to="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 text-slate-600 hover:bg-slate-50 border-b border-slate-100">Gallery</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-4 text-slate-600 hover:bg-slate-50">Contact Us</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
