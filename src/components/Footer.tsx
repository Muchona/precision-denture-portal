import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import logoFooter from '../assets/logo-footer2.png';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const mockUser = localStorage.getItem('mock_user');
      
      if (session || mockUser) {
        setIsLoggedIn(true);
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
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-6 flex justify-center md:justify-start">
              <img src={logoFooter} alt="Precision Dental Services Logo" className="h-16 sm:h-20 w-auto object-contain" />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Precision Dental Services supports dental laboratories and clinics in the fabrication of high precision prosthetic restorations using state of the art CAD/CAM Technologies.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-white tracking-wide uppercase mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-500 mt-0.5 shrink-0" />
                <a href="https://maps.google.com/?q=37+Glaslough+Street,+Monaghan,+Ireland" target="_blank" rel="noopener noreferrer" className="text-slate-400 text-sm hover:text-primary-400 hover:underline underline-offset-4 decoration-primary-500/50 transition-all">
                  37 Glaslough Street, Monaghan, Co. Monaghan, Ireland, H18A096
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-500 shrink-0" />
                <a href="tel:+353871887583" className="text-slate-400 text-sm hover:text-primary-400 hover:underline underline-offset-4 decoration-primary-500/50 transition-all">
                  087 188 7583
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-500 shrink-0" />
                <a href="mailto:info@precisiondental.ie" className="text-slate-400 text-sm hover:text-primary-400 hover:underline underline-offset-4 decoration-primary-500/50 transition-all">
                  info@precisiondental.ie
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white tracking-wide uppercase mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/products" className="hover:text-primary-400 transition-colors">Products & Pricing</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
              <li>
                {isLoggedIn ? (
                  <Link to={dashboardRoute} className="hover:text-primary-400 transition-colors">My Account</Link>
                ) : (
                  <Link to="/login" className="hover:text-primary-400 transition-colors">Dentist Portal Login</Link>
                )}
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Precision Dental Services. All rights reserved.
          </div>
          <div className="text-xs text-slate-500 flex gap-1 items-center">
            Designed and built by <a href="https://www.onyxandcode.com" className="text-primary-500 hover:text-primary-400 ml-1 font-medium">Onyx & Code</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
