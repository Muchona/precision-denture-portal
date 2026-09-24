import { Link } from 'react-router-dom';
import { Plus, FileText, Search, Package, Clock, CheckCircle, X, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { notify } from '../lib/notify';

export default function Dashboard() {
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<any | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('client_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPastOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
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

  const activeOrders = pastOrders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
  const completedOrders = pastOrders.filter(o => o.status === 'Completed').length;
  const totalFiles = pastOrders.reduce((sum, o) => sum + (o.file_urls ? o.file_urls.length : 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">My Orders</h1>
            <p className="text-slate-500">Track and manage your dental manufacturing requests.</p>
          </div>
          <Link
            to="/new-order"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-primary-600 hover:bg-primary-500 text-white font-medium rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-primary-500/30"
          >
            <Plus className="w-5 h-5" />
            New Order
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white shadow-sm border border-slate-200 p-6 rounded-2xl flex items-center justify-between transition-transform hover:-translate-y-1 duration-300">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Active Orders</p>
              <h3 className="text-3xl font-bold text-slate-900">{activeOrders}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-500" />
            </div>
          </div>
          <div className="bg-white shadow-sm border border-slate-200 p-6 rounded-2xl flex items-center justify-between transition-transform hover:-translate-y-1 duration-300">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Completed</p>
              <h3 className="text-3xl font-bold text-slate-900">{completedOrders}</h3>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-primary-600" />
            </div>
          </div>
          <div className="bg-white shadow-sm border border-slate-200 p-6 rounded-2xl flex items-center justify-between transition-transform hover:-translate-y-1 duration-300">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total Files Uploaded</p>
              <h3 className="text-3xl font-bold text-slate-900">{totalFiles}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Filters & Search (Static for now) */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all text-sm shadow-sm"
              placeholder="Search by patient reference..."
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white shadow-sm border border-slate-200 rounded-2xl overflow-hidden">
          {pastOrders.length === 0 ? (
            <div className="p-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-primary-50 to-primary-100 rounded-full flex items-center justify-center mb-6 border border-primary-100">
                <Package className="w-10 h-10 text-primary-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Welcome to your new digital lab.</h2>
              <p className="text-slate-500 max-w-2xl mx-auto mb-12 text-lg">
                Experience seamless 3D manufacturing. Upload your CAM files, select materials, and track your orders in real-time.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto mb-12 text-left">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative overflow-hidden group hover:border-primary-300 transition-colors">
                  <div className="text-primary-600 font-black text-6xl absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">1</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Upload Files</h3>
                  <p className="text-sm text-slate-500">Drag and drop your .STL or .OBJ scans directly into our secure 3D viewer.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative overflow-hidden group hover:border-primary-300 transition-colors">
                  <div className="text-primary-600 font-black text-6xl absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">2</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Specify Details</h3>
                  <p className="text-sm text-slate-500">Choose from premium materials like Zirconia or E.max and select specific teeth.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 relative overflow-hidden group hover:border-primary-300 transition-colors">
                  <div className="text-primary-600 font-black text-6xl absolute -top-4 -right-4 opacity-5 group-hover:opacity-10 transition-opacity">3</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">We Manufacture</h3>
                  <p className="text-sm text-slate-500">Our state-of-the-art lab processes your order and ships it directly to your clinic.</p>
                </div>
              </div>

              <Link
                to="/new-order"
                className="inline-flex items-center gap-3 py-4 px-10 bg-primary-600 hover:bg-primary-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-primary-500/30 text-lg"
              >
                <Plus className="w-6 h-6" />
                Start First Order
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-sm font-medium text-slate-500">
                    <th className="p-4 pl-6">Order ID</th>
                    <th className="p-4">Patient Ref</th>
                    <th className="p-4">Date Submitted</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pastOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 text-slate-900 font-bold">{order.id.split('-')[0].toUpperCase()}</td>
                      <td className="p-4 text-slate-600 font-medium">{order.patient_ref}</td>
                      <td className="p-4 text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Completed' ? 'bg-green-100 text-green-700 border border-green-200' :
                          order.status === 'In Production' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors cursor-pointer"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => setOrderToDelete(order)}
                            title="Delete Order"
                            className="w-8 h-8 rounded-lg border border-transparent hover:border-red-200 hover:bg-red-50 flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-900 transition-colors bg-slate-100 p-2 rounded-full hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Order ID</p>
                  <p className="text-sm font-bold text-slate-900">{selectedOrder.id.split('-')[0].toUpperCase()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Patient Ref</p>
                  <p className="text-sm font-bold text-slate-900">{selectedOrder.patient_ref}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Material</p>
                  <p className="text-sm font-medium text-slate-900">{selectedOrder.material || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Shade</p>
                  <p className="text-sm font-medium text-slate-900">{selectedOrder.shade || 'N/A'}</p>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Teeth Selected</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedOrder.teeth && selectedOrder.teeth.length > 0 ? (
                    selectedOrder.teeth.map((t: number) => (
                      <span key={t} className="px-3 py-1 bg-primary-50 text-primary-700 border border-primary-200 rounded-md text-xs font-bold">
                        {t}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-500">None</span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Delivery Method</p>
                  <p className="text-sm font-medium text-slate-900">{selectedOrder.delivery_method || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Additional Notes</p>
                  <p className="text-sm font-medium text-slate-900 whitespace-pre-wrap">{selectedOrder.notes || 'None'}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setOrderToDelete(null)}></div>
          <div className="relative bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Order?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Are you sure you want to permanently delete order <strong className="text-slate-900">{orderToDelete.id.split('-')[0].toUpperCase()}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setOrderToDelete(null)}
                className="flex-1 px-4 py-2 bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  handleDeleteOrder(orderToDelete.id);
                  setOrderToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm cursor-pointer"
              >
                Yes, Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
