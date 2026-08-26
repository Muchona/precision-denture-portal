import { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { Check, X, Building, Phone, MapPin, CreditCard, Edit2, Save, Package, Calendar, ChevronRight, Hash, Eye, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { notify } from '../lib/notify';

export default function AdminClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [clientOrders, setClientOrders] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<any | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchClientOrders(selectedClient.id);
      setEditForm(selectedClient);
      setIsEditing(false);
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
      
      // If a client is selected, update their details too
      if (selectedClient && data) {
        const updatedClient = data.find(c => c.id === selectedClient.id);
        if (updatedClient) setSelectedClient(updatedClient);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchClientOrders = async (userId: string) => {
    setIsLoadingOrders(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClientOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleApprove = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const { error } = await supabase.from('profiles').update({ status: 'approved' }).eq('id', id);
    if (error) {
      notify.error('Failed to approve client: ' + error.message);
    } else {
      notify.success('Client approved');
      fetchClients();
    }
  };

  const handleReject = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const { error } = await supabase.from('profiles').update({ status: 'rejected' }).eq('id', id);
    if (error) {
      notify.error('Failed to reject client: ' + error.message);
    } else {
      notify.success('Client rejected');
      fetchClients();
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          business_name: editForm.business_name,
          first_name: editForm.first_name,
          last_name: editForm.last_name,
          phone: editForm.phone,
          address_line1: editForm.address_line1,
          city: editForm.city,
          postal_code: editForm.postal_code,
          vat_number: editForm.vat_number,
        })
        .eq('id', selectedClient.id);

      if (error) throw error;
      notify.success('Client profile updated successfully');
      setIsEditing(false);
      fetchClients();
    } catch (error: any) {
      notify.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col font-sans">
      <AdminNavbar />
      
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-white mb-2">Client Management</h1>
            <p className="text-gray-400">Review and approve clinic registrations before they can submit orders.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map(client => (
              <div 
                key={client.id} 
                onClick={() => setSelectedClient(client)}
                className="apple-glass p-6 rounded-3xl border border-white/10 flex flex-col cursor-pointer hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1 hover:border-primary-500/30 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] group relative overflow-hidden"
              >
                {/* Highlight active client */}
                {selectedClient?.id === client.id && (
                  <div className="absolute inset-0 bg-primary-500/5 border-2 border-primary-500 rounded-3xl z-10 pointer-events-none"></div>
                )}
                
                <div className="flex items-start justify-between mb-4 relative z-20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center border border-primary-500/20 group-hover:bg-primary-500/20 transition-colors">
                      <Building className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-primary-400 transition-colors">{client.business_name || 'No Business Name'}</h3>
                      <p className="text-xs text-gray-500">Joined {new Date(client.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-6 flex-1 relative z-20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Status</span>
                    {client.status === 'approved' ? (
                      <span className="px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Approved
                      </span>
                    ) : client.status === 'rejected' ? (
                      <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Rejected
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <UserIcon className="w-4 h-4" />
                    {client.first_name} {client.last_name}
                  </div>
                </div>

                {client.status === 'pending' && (
                  <div className="flex gap-3 mt-auto pt-4 border-t border-white/5 relative z-20">
                    <button 
                      onClick={(e) => handleApprove(client.id, e)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-xl text-sm font-bold transition-colors border border-green-500/30"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button 
                      onClick={(e) => handleReject(client.id, e)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-surface-dark hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-xl text-sm font-bold transition-colors border border-white/10 hover:border-red-500/30"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                {client.status !== 'pending' && (
                  <div className="mt-auto pt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 relative z-20">
                    <span className="text-primary-500 text-sm font-medium flex items-center cursor-pointer hover:text-primary-400 transition-colors">
                      View Details <ChevronRight className="w-4 h-4 ml-1" />
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setClientToDelete(client);
                      }}
                      title="Suspend Client"
                      className="w-8 h-8 rounded-lg bg-surface-dark border border-white/10 hover:border-red-500/50 hover:bg-red-500/20 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Slide-over / Modal for Client Details */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedClient(null)}
          ></div>
          
          {/* Panel */}
          <div className="relative w-full max-w-2xl bg-surface-dark h-full shadow-2xl border-l border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0 overflow-y-auto">
            
            {/* Header */}
            <div className="sticky top-0 z-10 apple-glass px-8 py-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">{selectedClient.business_name || 'Unnamed Clinic'}</h2>
                <p className="text-gray-400 text-sm">Client ID: {selectedClient.id.substring(0,8)}</p>
              </div>
              <button 
                onClick={() => setSelectedClient(null)}
                className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 flex-1 space-y-10">
              
              {/* Profile Details Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary-500" /> Clinic Profile
                  </h3>
                  {!isEditing ? (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm(selectedClient);
                        }}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Form Fields */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Business Name</label>
                      {isEditing ? (
                        <input type="text" value={editForm.business_name || ''} onChange={e => setEditForm({...editForm, business_name: e.target.value})} className="w-full bg-surface-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary-500 focus:outline-none" />
                      ) : (
                        <p className="text-white font-medium">{selectedClient.business_name || '-'}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Contact Person</label>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <input type="text" placeholder="First" value={editForm.first_name || ''} onChange={e => setEditForm({...editForm, first_name: e.target.value})} className="w-1/2 bg-surface-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary-500 focus:outline-none" />
                          <input type="text" placeholder="Last" value={editForm.last_name || ''} onChange={e => setEditForm({...editForm, last_name: e.target.value})} className="w-1/2 bg-surface-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary-500 focus:outline-none" />
                        </div>
                      ) : (
                        <p className="text-white font-medium flex items-center gap-2"><UserIcon className="w-4 h-4 text-gray-400" /> {selectedClient.first_name} {selectedClient.last_name}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Phone</label>
                      {isEditing ? (
                        <input type="text" value={editForm.phone || ''} onChange={e => setEditForm({...editForm, phone: e.target.value})} className="w-full bg-surface-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary-500 focus:outline-none" />
                      ) : (
                        <p className="text-white font-medium flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {selectedClient.phone || '-'}</p>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Status</label>
                      <div className="pt-1">
                        {selectedClient.status === 'approved' ? (
                          <span className="px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold uppercase tracking-wider">Approved</span>
                        ) : selectedClient.status === 'rejected' ? (
                          <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-bold uppercase tracking-wider">Rejected</span>
                        ) : (
                          <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">Pending</span>
                        )}
                        {isEditing && (
                           <div className="mt-2 flex gap-2">
                             <button onClick={() => handleApprove(selectedClient.id)} className="text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 px-2 py-1 rounded transition-colors">Approve</button>
                             <button onClick={() => handleReject(selectedClient.id)} className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 px-2 py-1 rounded transition-colors">Reject/Suspend</button>
                           </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1 sm:col-span-2 pt-4 border-t border-white/5">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Street Address</label>
                      {isEditing ? (
                        <input type="text" value={editForm.address_line1 || ''} onChange={e => setEditForm({...editForm, address_line1: e.target.value})} className="w-full bg-surface-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary-500 focus:outline-none" />
                      ) : (
                        <p className="text-white font-medium flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {selectedClient.address_line1 || 'No address provided'}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">City / County</label>
                      {isEditing ? (
                        <input type="text" value={editForm.city || ''} onChange={e => setEditForm({...editForm, city: e.target.value})} className="w-full bg-surface-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary-500 focus:outline-none" />
                      ) : (
                        <p className="text-white font-medium">{selectedClient.city || '-'}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Eircode</label>
                      {isEditing ? (
                        <input type="text" value={editForm.postal_code || ''} onChange={e => setEditForm({...editForm, postal_code: e.target.value})} className="w-full bg-surface-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary-500 focus:outline-none" />
                      ) : (
                        <p className="text-white font-medium">{selectedClient.postal_code || '-'}</p>
                      )}
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">VAT Number</label>
                      {isEditing ? (
                        <input type="text" value={editForm.vat_number || ''} onChange={e => setEditForm({...editForm, vat_number: e.target.value})} className="w-full bg-surface-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-primary-500 focus:outline-none" />
                      ) : (
                        <p className="text-white font-medium flex items-center gap-2"><CreditCard className="w-4 h-4 text-gray-400" /> {selectedClient.vat_number || 'No VAT provided'}</p>
                      )}
                    </div>

                  </div>
                </div>
              </section>

              {/* Order History Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary-500" /> Order History
                  </h3>
                  <div className="px-3 py-1 bg-white/5 rounded-lg text-sm text-gray-400 font-medium">
                    {clientOrders.length} Orders
                  </div>
                </div>

                <div className="space-y-3">
                  {isLoadingOrders ? (
                    <div className="py-8 text-center text-gray-500 text-sm">Loading orders...</div>
                  ) : clientOrders.length === 0 ? (
                    <div className="py-12 bg-black/20 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                      <Package className="w-12 h-12 text-gray-600 mb-4" />
                      <p className="text-gray-400">This client hasn't placed any orders yet.</p>
                    </div>
                  ) : (
                    clientOrders.map(order => (
                      <div key={order.id} className="bg-surface-dark border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                            <Hash className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-white font-medium">Ref: {order.patient_reference}</h4>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                order.status === 'completed' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                order.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              }`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(order.created_at).toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{order.material}</span>
                            </div>
                          </div>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-primary-500/20 transition-all">
                              <Eye className="w-4 h-4" />
                           </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {clientToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setClientToDelete(null)}></div>
          <div className="relative bg-surface-card border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-2">Suspend Client?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to suspend <strong>{clientToDelete.business_name}</strong>? They will immediately lose access to their dashboard.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setClientToDelete(null)}
                className="flex-1 px-4 py-2 bg-surface-dark border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleReject(clientToDelete.id);
                  setClientToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                Yes, Suspend Client
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function UserIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
