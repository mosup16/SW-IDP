import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './router/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/auth/Login/Login';
import Register from './pages/auth/Register/Register';
import UserProfile from './pages/profile/UserProfile/UserProfile';
import ClientManagement from './pages/admin/ClientManagement/ClientManagement';
import ClientConfiguration from './pages/admin/ClientConfiguration/ClientConfiguration';
import IdentityManagement from './pages/admin/IdentityManagement/IdentityManagement';
import RoleManagement from './pages/admin/RoleManagement/RoleManagement';
import AuditLogs from './pages/admin/AuditLogs/AuditLogs';
import SystemSettings from './pages/admin/SystemSettings/SystemSettings';
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/userProfile"         element={<UserProfile />} />
            <Route path="/clients"             element={<ClientManagement />} />
            <Route path="/clientConfiguration" element={<ClientConfiguration />} />
            <Route path="/identities"          element={<IdentityManagement />} />
            <Route path="/roles"               element={<RoleManagement />} />
            <Route path="/audit-logs"          element={<AuditLogs />} />     {/* Fixed */}
            <Route path="/systemSettings"      element={<SystemSettings />} />
            
           
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}