import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, File as FileIcon, CheckCircle } from 'lucide-react';
import STLViewer from '../components/STLViewer';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';
import { notify } from '../lib/notify';

export default function NewOrder() {
  const navigate = useNavigate();
  const [patientRef, setPatientRef] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedShade, setSelectedShade] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedTeeth, setSelectedTeeth] = useState<number[]>([]);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [selectedDelivery, setSelectedDelivery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [postcode, setPostcode] = useState('');

  const materials = ['Zirconia', 'E.max', 'PMMA', 'Titanium', 'Cobalt Chrome'];
  const shades = ['A1', 'A2', 'A3', 'A3.5', 'B1', 'B2', 'B3', 'C1', 'C2', 'D2', 'Bleach'];

  const toggleTooth = (tooth: number) => {
    setSelectedTeeth(prev => 
      prev.includes(tooth) ? prev.filter(t => t !== tooth) : [...prev, tooth]
    );
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (name: string) => {
    setFiles(files.filter(f => f.name !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      notify.error("Please upload at least one CAM file.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        notify.error("You must be logged in to submit an order.");
        setIsSubmitting(false);
        return;
      }

      // 1. Upload Files to Storage
      const uploadedFileUrls: string[] = [];
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${session.user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('cam-files')
          .upload(filePath, file);
          
        if (uploadError) {
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }
        
        uploadedFileUrls.push(filePath);
      }

      // 2. Save Order to Database
      const { error: insertError } = await supabase.from('orders').insert({
        client_id: session.user.id,
        company_name: companyName,
        contact_name: contactName,
        contact_phone: contactPhone,
        postcode: postcode,
        patient_ref: patientRef,
        material: selectedMaterial,
        shade: selectedShade,
        teeth: selectedTeeth,
        delivery_method: selectedDelivery,
        file_urls: uploadedFileUrls,
        status: 'Pending'
      });

      if (insertError) {
        throw new Error(`Failed to create order: ${insertError.message}`);
      }

      notify.success('Order submitted successfully!');
      navigate('/dashboard');
      
    } catch (error: any) {
      notify.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col font-sans text-gray-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 auto-rows-fr">
            
            {/* Section 1: Clinic & Order Details */}
            <section className="apple-glass p-8 rounded-3xl flex flex-col order-1">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600/20 text-primary-500 text-sm">1</span>
                Order Details
              </h2>
              
              {/* Clinic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-white/5 flex-1">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name *</label>
                  <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} required className="w-full px-3 py-2 bg-surface-dark border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" placeholder="e.g. Acme Dental" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Name *</label>
                  <input type="text" value={contactName} onChange={e => setContactName(e.target.value)} required className="w-full px-3 py-2 bg-surface-dark border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" placeholder="Full Name" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Phone *</label>
                  <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} required className="w-full px-3 py-2 bg-surface-dark border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" placeholder="Phone Number" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Postcode *</label>
                  <input type="text" value={postcode} onChange={e => setPostcode(e.target.value)} required className="w-full px-3 py-2 bg-surface-dark border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500 transition-colors" placeholder="Postcode" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Your reference <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={patientRef}
                  onChange={(e) => setPatientRef(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all"
                  placeholder="e.g. Test / #12345"
                />
              </div>
            </section>

            {/* Section 3: Material & Shade (Put as order 2 on desktop to be next to Section 1) */}
            <section className="apple-glass p-8 rounded-3xl flex flex-col order-3 lg:order-2">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600/20 text-primary-500 text-sm">3</span>
                Manufacturing Details
              </h2>
              
              <div className="space-y-8 flex-1 flex flex-col justify-center">
                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-3">Select Material <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {materials.map(mat => (
                      <button
                        key={mat}
                        type="button"
                        onClick={() => setSelectedMaterial(mat)}
                        className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between ${selectedMaterial === mat ? 'border-primary-500 bg-primary-500/10 text-white' : 'border-white/10 bg-surface-dark text-gray-400 hover:border-white/30 hover:text-gray-200'}`}
                      >
                        {mat}
                        {selectedMaterial === mat && <CheckCircle className="w-4 h-4 text-primary-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-400 block mb-3">Select Shade (Optional)</label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {shades.map(shade => (
                      <button
                        key={shade}
                        type="button"
                        onClick={() => setSelectedShade(shade)}
                        className={`py-2 text-center rounded-lg border text-sm font-medium transition-all ${selectedShade === shade ? 'border-primary-500 bg-primary-500/10 text-white' : 'border-white/10 bg-surface-dark text-gray-400 hover:border-white/30 hover:text-gray-200'}`}
                      >
                        {shade}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: File Upload */}
            <section className="apple-glass p-8 rounded-3xl flex flex-col order-2 lg:order-3">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600/20 text-primary-500 text-sm">2</span>
                Upload CAM Files
              </h2>
              <p className="text-sm text-gray-400 mb-4">Supported formats: .STL, .OBJ, .ZIP, .DCM, .constructioninfo</p>
              
              <div 
                className={`flex-1 flex flex-col justify-center relative border-2 border-dashed rounded-2xl p-8 text-center transition-all min-h-[200px] ${dragActive ? 'border-primary-500 bg-primary-500/5' : 'border-white/10 hover:border-primary-500/50 hover:bg-white/[0.02]'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center pointer-events-none">
                  <div className="w-16 h-16 bg-surface-dark rounded-full flex items-center justify-center mb-4">
                    <UploadCloud className={`w-8 h-8 ${dragActive ? 'text-primary-500' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-lg font-medium text-white mb-1">Drag and drop files here</p>
                  <p className="text-sm text-gray-500">or click to browse from your computer</p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-medium text-white mb-3">Attached Files ({files.length})</h3>
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-surface-dark rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <FileIcon className="w-5 h-5 text-primary-500" />
                        <div>
                          <p className="text-sm font-medium text-white">{f.name}</p>
                          <p className="text-xs text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(f.name.toLowerCase().endsWith('.stl') || f.name.toLowerCase().endsWith('.obj')) && (
                          <button 
                            type="button" 
                            onClick={() => setPreviewFile(f)}
                            className="text-xs font-bold text-primary-400 px-4 py-1.5 bg-primary-400/10 rounded-lg transition-all duration-300 hover:bg-primary-500 hover:text-white hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]"
                          >
                            Preview
                          </button>
                        )}
                        <button 
                          type="button" 
                          onClick={() => removeFile(f.name)}
                          className="text-xs text-red-400 hover:text-red-300 px-3 py-1 bg-red-400/10 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Section 4: Teeth Selection */}
            <section className="apple-glass p-8 rounded-3xl flex flex-col order-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600/20 text-primary-500 text-sm">4</span>
                  Teeth Selection
                </h2>
                {selectedTeeth.length > 0 && (
                  <span className="text-xs font-medium bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full">
                    {selectedTeeth.length} selected
                  </span>
                )}
              </div>
              
              <div className="flex-1 flex flex-col gap-6 justify-center max-w-md mx-auto w-full">
                <div className="grid grid-cols-8 gap-1 sm:gap-2">
                  {[...Array(16)].map((_, i) => {
                    const toothNum = i + 1;
                    const isSelected = selectedTeeth.includes(toothNum);
                    return (
                      <button
                        key={toothNum}
                        type="button"
                        onClick={() => toggleTooth(toothNum)}
                        className={`w-full aspect-[3/4] rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center ${
                          isSelected 
                            ? 'bg-primary-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)] transform -translate-y-1' 
                            : 'bg-surface-dark border border-white/10 text-gray-400 hover:border-primary-500/50 hover:text-white'
                        }`}
                      >
                        {toothNum}
                      </button>
                    );
                  })}
                </div>
                
                <div className="grid grid-cols-8 gap-1 sm:gap-2">
                  {[...Array(16)].map((_, i) => {
                    const toothNum = i + 17;
                    const isSelected = selectedTeeth.includes(toothNum);
                    return (
                      <button
                        key={toothNum}
                        type="button"
                        onClick={() => toggleTooth(toothNum)}
                        className={`w-full aspect-[3/4] rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center ${
                          isSelected 
                            ? 'bg-primary-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)] transform -translate-y-1' 
                            : 'bg-surface-dark border border-white/10 text-gray-400 hover:border-primary-500/50 hover:text-white'
                        }`}
                      >
                        {toothNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* Section 5: Delivery Options */}
          <section className="apple-glass p-6 sm:p-8 rounded-3xl flex flex-col">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600/20 text-primary-500 text-sm">5</span>
              Delivery Options
            </h2>
            <div className="space-y-2 max-w-md">
              <label className="text-sm font-medium text-gray-300">Select shipping <span className="text-red-500">*</span></label>
              <select 
                value={selectedDelivery}
                onChange={(e) => setSelectedDelivery(e.target.value)}
                required
                className="w-full px-4 py-3 bg-surface-dark border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all cursor-pointer"
              >
                <option value="" disabled>Choose delivery method...</option>
                <option value="An Post Standard Delivery">An Post Standard Delivery</option>
                <option value="An Post Express (Next Day)">An Post Express (Next Day)</option>
                <option value="DPD Courier Delivery">DPD Courier Delivery</option>
              </select>
            </div>
          </section>

          {/* Submit Action */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || files.length === 0 || !patientRef || !selectedMaterial || !companyName || !contactName || !contactPhone || !postcode || !selectedDelivery}
              className="flex items-center gap-2 py-4 px-10 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-[0_0_20px_rgba(22,163,74,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isSubmitting ? 'Uploading Files...' : 'Submit Order'}
            </button>
          </div>
        </form>
      </main>

      {/* 3D Viewer Overlay */}
      {previewFile && (
        <STLViewer 
          file={previewFile} 
          onClose={() => setPreviewFile(null)} 
        />
      )}
    </div>
  );
}
