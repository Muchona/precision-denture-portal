import React, { useState, useEffect } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import { Download, ChevronDown, Calendar, Search, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { notify } from '../lib/notify';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles (
            business_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching global orders:', error);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (error) {
      notify.error('Failed to update status: ' + error.message);
      fetchOrders();
    } else {
      notify.success('Status updated to ' + newStatus);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      notify.success('Order deleted successfully');
      fetchOrders();
    } catch (error: any) {
      notify.error('Failed to delete order: ' + error.message);
    }
  };

  const handleDownloadFiles = async (fileUrls: string[]) => {
    if (!fileUrls || fileUrls.length === 0) {
      notify.error('No files attached to this order.');
      return;
    }

    for (const path of fileUrls) {
      const { data, error } = await supabase.storage.from('cam-files').download(path);
      if (error) {
        console.error('Error downloading file:', error);
        notify.error('Failed to download file: ' + path);
        continue;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = path.split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const filteredOrders = orders.filter(order => 
    (order.profiles?.business_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (order.patient_ref || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-dark flex flex-col">
      <AdminNavbar />
      
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Global Orders</h1>
              <p className="text-gray-400">Manage all incoming manufacturing requests.</p>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by clinic, ref, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-surface-card border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 w-full md:w-80"
              />
            </div>
          </div>

          <div className="apple-glass rounded-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-xs uppercase tracking-wider text-gray-400 font-bold">
                    <th className="p-4 pl-6">Order ID</th>
                    <th className="p-4">Clinic</th>
                    <th className="p-4">Patient Ref</th>
                    <th className="p-4">Material</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-gray-400">
                        No orders found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <React.Fragment key={order.id}>
                        <tr 
                          onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                          className="hover:bg-white/5 transition-colors cursor-pointer group"
                        >
                          <td className="p-4 pl-6 font-medium text-white">
                            <div className="flex items-center gap-3">
                              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${expandedOrderId === order.id ? 'rotate-180 text-primary-500' : 'group-hover:text-primary-400'}`} />
                              {order.id.split('-')[0].toUpperCase()}
                            </div>
                          </td>
                          <td className="p-4 text-gray-300">{order.profiles?.business_name || 'Unknown Clinic'}</td>
                          <td className="p-4 text-gray-300">{order.patient_ref}</td>
                          <td className="p-4 text-gray-300">{order.material}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.created_at).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="p-4" onClick={e => e.stopPropagation()}>
                            <div className="relative group/status inline-block">
                              <select 
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className={`appearance-none outline-none cursor-pointer pr-8 pl-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                                  order.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20' :
                                  order.status === 'In Production' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20' :
                                  'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20'
                                }`}
                              >
                                <option value="Pending" className="bg-surface-dark text-white">Pending</option>
                                <option value="In Production" className="bg-surface-dark text-white">In Production</option>
                                <option value="Completed" className="bg-surface-dark text-white">Completed</option>
                              </select>
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <ChevronDown className="w-3 h-3 text-current opacity-70" />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 pr-6" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={() => handleDownloadFiles(order.file_urls)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-primary-500/20"
                              >
                                <Download className="w-4 h-4" />
                                Files
                              </button>
                              <button 
                                onClick={() => setOrderToDelete(order)}
                                title="Delete Order"
                                className="w-8 h-8 rounded-lg border border-transparent hover:border-red-500/50 hover:bg-red-500/10 flex items-center justify-center text-gray-500 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        
                        {/* Expanded Details Row */}
                        {expandedOrderId === order.id && (
                          <tr className="bg-black/20 border-b border-white/5">
                            <td colSpan={7} className="p-0">
                              <div className="p-6 pl-14 animate-in slide-in-from-top-2 fade-in duration-200">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                  
                                  {/* Notes Section */}
                                  <div className="md:col-span-2 bg-surface-dark p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Message from Client</p>
                                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{order.notes || 'No additional notes provided.'}</p>
                                  </div>
                                  
                                  {/* Manufacturing Details */}
                                  <div className="bg-surface-dark p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Manufacturing</p>
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Shade:</span>
                                        <span className="text-white font-medium">{order.shade || 'N/A'}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Delivery:</span>
                                        <span className="text-white font-medium text-right">{order.delivery_method || 'N/A'}</span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Teeth Section */}
                                  <div className="bg-surface-dark p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Teeth Selected</p>
                                    <div className="flex flex-wrap gap-2">
                                      {order.teeth && order.teeth.length > 0 ? (
                                        order.teeth.map((t: number) => (
                                          <span key={t} className="px-2 py-1 bg-primary-500/10 border border-primary-500/20 text-primary-400 rounded text-xs font-bold">
                                            {t}
                                          </span>
                                        ))
                                      ) : (
                                        <span className="text-sm text-gray-500">None selected</span>
                                      )}
                                    </div>
                                  </div>
                                  
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </main>

      {/* Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOrderToDelete(null)}></div>
          <div className="relative bg-surface-card border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-2">Delete Order?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to permanently delete order <strong>{orderToDelete.id.split('-')[0].toUpperCase()}</strong> from {orderToDelete.profiles?.business_name}? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setOrderToDelete(null)}
                className="flex-1 px-4 py-2 bg-surface-dark border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleDeleteOrder(orderToDelete.id);
                  setOrderToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-medium transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                Yes, Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
