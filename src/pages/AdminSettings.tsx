import { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { Save, User, Phone, Mail, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { notify } from '../lib/notify';

export default function AdminSettings() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setPhone(data.phone || '');
      }
      setEmail(user.email || '');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('profiles').update({
        first_name: firstName,
        last_name: lastName,
        phone: phone
      }).eq('id', user.id);

      if (error) throw error;
      
      notify.success('Admin profile saved successfully!');
    } catch (error: any) {
      notify.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecuritySave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSecurity(true);
    
    try {
      const updates: { email?: string, password?: string } = {};
      if (email) updates.email = email;
      if (newPassword) updates.password = newPassword;
      
      if (Object.keys(updates).length > 0) {
        const { error } = await supabase.auth.updateUser(updates);
        if (error) throw error;
      }
      
      notify.success('Security settings updated successfully!');
      setNewPassword(''); // Clear password field after save
    } catch (error: any) {
      notify.error(error.message);
    } finally {
      setIsSavingSecurity(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <AdminNavbar />
      
      <main className="flex-1 p-6 lg:p-10 flex items-center justify-center">
        <div className="w-full max-w-4xl apple-glass rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
          
          <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-slate-100/50">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Admin Settings</h1>
              <p className="text-sm text-slate-500">Manage your administrative profile and security credentials.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-8 sm:p-10">
            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-500" />
              </div>
              Personal Details
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-4">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(22,163,74,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] disabled:opacity-50 disabled:transform-none disabled:shadow-none"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Details'}
              </button>
            </div>
          </form>

          {/* Account Security Form */}
          <form onSubmit={handleSecuritySave} className="p-8 sm:p-10 border-t border-slate-200 bg-slate-100/50">
            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center">
                <Lock className="w-5 h-5 text-red-500" />
              </div>
              Account Security
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      minLength={6}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                      placeholder="Leave blank to keep current"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">Updating your email will require verification.</p>
              <button
                type="submit"
                disabled={isSavingSecurity}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] disabled:opacity-50 disabled:transform-none disabled:shadow-none"
              >
                <Save className="w-5 h-5" />
                {isSavingSecurity ? 'Updating...' : 'Update Security'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
