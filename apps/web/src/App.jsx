import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './router/ProtectedRoute';
import RoleProtectedRoute from './router/RoleProtectedRoute';
import AdminLayout from './components/layout/AdminLayout';
import Login from './pages/auth/Login/Login';
import Register from './pages/auth/Register/Register';
import Forbidden from './pages/Forbidden';
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
        <Route path="/forbidden" element={<Forbidden />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/userProfile" element={<UserProfile />} />

            <Route element={<RoleProtectedRoute authority="clients.read" />}>
              <Route path="/clients" element={<ClientManagement />} />
            </Route>
            <Route element={<RoleProtectedRoute authority="clients.write" />}>
              <Route path="/clientConfiguration" element={<ClientConfiguration />} />
            </Route>

            <Route element={<RoleProtectedRoute authority="users.read" />}>
              <Route path="/identities" element={<IdentityManagement />} />
            </Route>

            <Route element={<RoleProtectedRoute authority="roles.read" />}>
              <Route path="/roles" element={<RoleManagement />} />
            </Route>

            <Route element={<RoleProtectedRoute authority="logs.view" />}>
              <Route path="/audit-logs" element={<AuditLogs />} />
            </Route>

            <Route element={<RoleProtectedRoute authority="settings.read" />}>
              <Route path="/systemSettings" element={<SystemSettings />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
