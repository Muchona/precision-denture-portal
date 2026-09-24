import { Link, Outlet } from 'react-router-dom';
import { LogIn, Menu, X, LayoutDashboard, MapPin, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import logoFooter from '../assets/logo-footer2.png';
import { supabase } from '../lib/supabase';
import Footer from '../components/Footer';

export default function PublicLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check real session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Check mock session
      const mockUser = localStorage.getItem('mock_user');
      
      if (session || mockUser) {
        setIsLoggedIn(true);
        
        // Determine admin status
        if (mockUser === 'admin') {
          setIsAdmin(true);
        } else if (session?.user?.email === 'info@precisiondental.ie' || session?.user?.email === 'pmg000@hotmail.com') {
          setIsAdmin(true);
        }
      }
    };
    
    checkAuth();
  }, []);

  const dashboardRoute = isAdmin ? '/admin' : '/dashboard';

  return (
    <div className="min-h-screen flex flex-col bg-surface-dark text-slate-800">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
              <img src={logo} alt="Precision Dental Services Logo" className="h-16 w-auto object-contain" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Home</Link>
              <Link to="/about" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">About Us</Link>
              <Link to="/products" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Products & Prices</Link>
              <Link to="/gallery" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Gallery</Link>
              <Link to="/contact" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">Contact</Link>
              
              {isLoggedIn ? (
                <Link 
                  to={dashboardRoute}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-all shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4 text-primary-600" />
                  My Account
                </Link>
              ) : (
                <Link 
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium rounded-lg transition-all shadow-md shadow-primary-500/20"
                >
                  <LogIn className="w-4 h-4" />
                  Order Online
                </Link>
              )}
            </nav>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md">
            <div className="flex flex-col px-4 pt-2 pb-6 space-y-2">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 rounded-lg">Home</Link>
              <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 rounded-lg">About Us</Link>
              <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 rounded-lg">Products & Prices</Link>
              <Link to="/gallery" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 rounded-lg">Gallery</Link>
              <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-primary-600 rounded-lg">Contact</Link>
              <div className="pt-4 pb-2 px-4">
                {isLoggedIn ? (
                  <Link 
                    to={dashboardRoute}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-slate-100 border border-slate-200 text-slate-700 text-base font-bold rounded-lg shadow-sm"
                  >
                    <LayoutDashboard className="w-5 h-5 text-primary-600" />
                    My Account
                  </Link>
                ) : (
                  <Link 
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 bg-primary-600 text-white text-base font-medium rounded-lg"
                  >
                    <LogIn className="w-5 h-5" />
                    Order Online (Portal Login)
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
