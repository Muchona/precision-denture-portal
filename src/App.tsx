import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PendingApproval from './pages/PendingApproval';
import AdminDashboard from './pages/AdminDashboard';
import AdminClients from './pages/AdminClients';
import AdminSettings from './pages/AdminSettings';
import NewOrder from './pages/NewOrder';
import Settings from './pages/Settings';

import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Products from './pages/public/Products';
import Contact from './pages/public/Contact';
import Gallery from './pages/public/Gallery';


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }
    
    setIsAuthenticated(true);
    
    const { data } = await supabase.from('profiles').select('status').eq('id', session.user.id).single();
    if (data) {
      setStatus(data.status);
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (status === 'pending') return <Navigate to="/pending-approval" replace />;
  
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user.email) {
      const email = session.user.email.toLowerCase();
      if (email === 'info@precisiondental.ie' || email === 'pmg000@hotmail.com') {
        setIsAdmin(true);
      }
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (!isAdmin) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Toaster 
          position="bottom-right" 
          toastOptions={{ 
            style: { background: '#ffffff', color: '#1e293b', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
            success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
          }} 
        />
      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Route>
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/clients" 
          element={
            <AdminRoute>
              <AdminClients />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          } 
        />

        {/* Client Routes */}
        <Route 
          path="/pending-approval" 
          element={<PendingApproval />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/new-order" 
          element={
            <ProtectedRoute>
              <NewOrder />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
      </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
