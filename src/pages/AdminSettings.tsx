import { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { Save, User, Phone, Mail, Lock, UploadCloud } from 'lucide-react';
import { useRef } from 'react';
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setAvatarUrl(data.avatar_url || null);
      }
      setEmail(user.email || '');
    }
  };

  
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      setIsUploading(true);
      const file = e.target.files[0];
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const newAvatarUrl = data.publicUrl;

      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: newAvatarUrl }).eq('id', user.id);
      if (updateError) throw updateError;

      setAvatarUrl(newAvatarUrl);
      notify.success('Profile picture updated successfully!');
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      notify.error(error.message);
    } finally {
      setIsUploading(false);
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
              <h1 className="text-2xl font-bold text-slate-800 mb-1">Admin Settings</h1>
              <p className="text-sm text-slate-500">Manage your administrative profile and security credentials.</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="p-8 sm:p-10">
            
            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              Personal Details
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-200">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-md bg-white flex items-center justify-center relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-400" />
                  )}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <UploadCloud className="w-6 h-6 text-white mb-1" />
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-800">Profile Picture</h3>
                <p className="text-sm text-slate-500 mt-1 mb-3">Upload a professional photo for your admin profile.</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm disabled:opacity-50"
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </div>


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
