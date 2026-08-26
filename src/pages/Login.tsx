import { useState } from 'react';
import { Mail, Lock, ArrowRight, User, Building, Briefcase, Phone, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            business_name: businessName.trim(),
            job_role: jobRole.trim(),
            phone: phone.trim()
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Registration successful! You are now pending approval.');
        // Clear sensitive fields
        setPassword('');
        setConfirmPassword('');
        // If they auto-login after signup, they will be caught by the App.tsx router and sent to /pending-approval
        if (data.session) {
           navigate('/pending-approval');
        }
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setMessage(null);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-surface-dark flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-surface-card border-r border-white/5 items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 to-surface-dark/80 z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/20 rounded-full blur-[100px]"></div>
        
        <div className="relative z-10 p-16 flex flex-col items-center text-center">
          <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center mb-8">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(34,197,94,0.6)]" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">Monaghan Denture</h1>
          <p className="text-lg text-gray-400 max-w-md leading-relaxed">
            The next-generation CAM portal. Upload, verify, and track your dental manufacturing orders with unprecedented speed.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className={`w-full ${isSignUp ? 'max-w-2xl' : 'max-w-md'} apple-glass p-8 rounded-3xl transition-all duration-500`}>
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-gray-400">{isSignUp ? 'Register your clinic for access' : 'Sign in to access your dashboard'}</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-lg text-sm text-center">
                {message}
              </div>
            )}

            {isSignUp ? (
              // Sign Up Form Fields (Grid Layout)
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="John" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-500" />
                    </div>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Doe" required />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-300">Business / Clinic Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-500" />
                    </div>
                    <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Precision Dental Clinic" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Job Role</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-gray-500" />
                    </div>
                    <input type="text" value={jobRole} onChange={(e) => setJobRole(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="Lead Prosthodontist" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-500" />
                    </div>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="+353 12 345 678" required />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="doctor@clinic.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-12 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="••••••••" required minLength={6} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-11 pr-12 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="••••••••" required minLength={6} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors">
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Sign In Form Fields
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="doctor@clinic.com" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-300">Password</label>
                    <a href="#" className="text-sm text-primary-500 hover:text-primary-400 transition-colors">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-12 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50" placeholder="••••••••" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-white transition-colors">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${isSignUp ? 'mt-8' : ''}`}
            >
              {loading ? (isSignUp ? 'Registering...' : 'Signing In...') : (isSignUp ? 'Register' : 'Sign In')}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={resetForm} 
                className="text-primary-500 font-medium hover:text-primary-400 transition-colors"
              >
                {isSignUp ? 'Sign In' : 'Request Access'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
