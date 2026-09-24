import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
  // Temporarily bypassing security so you can view the dashboard 
  // without fighting the Supabase email rate limit or auth errors!
  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  // Temporarily bypassing security so you can view the dashboard 
  // without fighting the Supabase email rate limit!
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
