import { LogOut, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function PendingApproval() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md apple-glass p-10 rounded-3xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-400"></div>
        
        <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(234,179,8,0.2)] border border-yellow-500/20">
          <Clock className="w-10 h-10 text-yellow-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">Account Pending</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Thanks for registering! Your account is currently pending approval by Precision Dental Services. You will receive an email notification once your account has been reviewed and approved.
        </p>
        
        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 w-full py-3 bg-surface-dark border border-white/10 text-white rounded-xl font-medium hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          <LogOut className="w-4 h-4 text-gray-400" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
