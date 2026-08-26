import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import type { Session } from '@supabase/supabase-js';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PendingApproval from './pages/PendingApproval';
import AdminDashboard from './pages/AdminDashboard';
import AdminClients from './pages/AdminClients';
import AdminSettings from './pages/AdminSettings';
import NewOrder from './pages/NewOrder';
import Settings from './pages/Settings';

const ADMIN_EMAILS = ['pmg000@hotmail.com', 'admin@monaghandenture.com'];

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-surface-dark flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div></div>;
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  // Prevent clients from accessing the app if they aren't approved
  // TODO: Replace with real database flag (e.g. profile.is_approved)
  const isApproved = true; 
  if (!isApproved && !ADMIN_EMAILS.includes(session.user.email || '')) {
    return <Navigate to="/pending-approval" replace />;
  }

  // Prevent admins from accidentally using the client dashboard
  if (ADMIN_EMAILS.includes(session.user.email || '')) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  // Temporarily bypassing security so you can view the dashboard 
  // without fighting the Supabase email rate limit!
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Toaster 
        position="bottom-right" 
        toastOptions={{ 
          style: { background: '#1e1e24', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } }
        }} 
      />
      <Routes>
        <Route path="/" element={<Login />} />
        
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
  );
}

export default App;
