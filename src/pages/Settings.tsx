import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Save, Building2, User, Phone, UploadCloud, MapPin, CreditCard, Lock, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { notify } from '../lib/notify';

export default function Settings() {
  const [businessName, setBusinessName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [vatNumber, setVatNumber] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data && !error) {
      setBusinessName(data.business_name || '');
      setFirstName(data.first_name || '');
      setLastName(data.last_name || '');
      setPhone(data.phone || '');
      setAddressLine1(data.address_line1 || '');
      setCity(data.city || '');
      setPostalCode(data.postal_code || '');
      setVatNumber(data.vat_number || '');
      setAvatarUrl(data.avatar_url || null);
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

      // Upload to avatars bucket
      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      const newAvatarUrl = data.publicUrl;

      // Update profile
      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: newAvatarUrl }).eq('id', user.id);
      if (updateError) throw updateError;

      setAvatarUrl(newAvatarUrl);
      notify.success('Profile picture updated successfully!');
      
      // Force a reload so the navbar picks it up instantly
      setTimeout(() => window.location.reload(), 1500);
    } catch (error: any) {
      notify.error(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate Irish mobile number (08X or +3538X followed by 7 digits)
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const isValidIrishMobile = /^(?:\+3538\d{8}|08\d{8})$/.test(cleanPhone);
    
    if (!isValidIrishMobile) {
      notify.error('Please enter a valid 10-digit Irish mobile number (e.g., 089 123 4567)');
      return;
    }

    setIsSaving(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not logged in');

      const { error } = await supabase.from('profiles').update({
        business_name: businessName,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        address_line1: addressLine1,
        city: city,
        postal_code: postalCode,
        vat_number: vatNumber
      }).eq('id', user.id);

      if (error) throw error;
      
      notify.success('Clinic details saved successfully!');
      // Force a reload so the navbar picks up the name change
      setTimeout(() => window.location.reload(), 1500);
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
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-slate-800 mb-3">Clinic Details</h1>
          <p className="text-slate-500 text-lg">Manage your dental practice information. These details will automatically fill when placing new orders.</p>
        </div>

        <div className="apple-glass rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-primary-400"></div>

          <form onSubmit={handleSave} className="p-8 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-10 pb-10 border-b border-slate-200">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-dark shadow-[0_0_20px_rgba(34,197,94,0.1)] bg-white flex items-center justify-center relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-slate-500" />
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
                <p className="text-sm text-slate-500 mt-1 mb-3">Upload a high-res image. Max size 2MB.</p>
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors border border-slate-200"
                >
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/10 rounded-full flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-500" />
              </div>
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Clinic/Company Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Building2 className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                      placeholder="e.g. City Center Dental"
                    />
                  </div>
                </div>

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
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                      placeholder="e.g. Jane"
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
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                      placeholder="e.g. Smith"
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
                      required
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                      placeholder="e.g. 089 123 4567"
                    />
                  </div>
                </div>

                <div className="space-y-3 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Street Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                      placeholder="e.g. 123 Dental Way"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">City / County</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                      placeholder="e.g. Dublin"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Eircode</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                      placeholder="e.g. D01 X2Y3"
                    />
                  </div>
                </div>

                <div className="space-y-3 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">VAT Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-slate-500" />
                    </div>
                    <input
                      type="text"
                      value={vatNumber}
                      onChange={(e) => setVatNumber(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm"
                      placeholder="e.g. IE1234567T"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">Your details are securely stored and encrypted.</p>
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
                      placeholder="e.g. doctor@clinic.com"
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
