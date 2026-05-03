import { BrowserRouter, Routes, Route,Navigate, Outlet  } from 'react-router-dom';
import AuditLogs from './pages/admin/AuditLogs/AuditLogs';
import ClientConfiguration from './pages/admin/ClientConfiguration/ClientConfiguration';
import ClientManagement from './pages/admin/ClientManagement/ClientManagement';
import IdentityManagement from './pages/admin/IdentityManagement/IdentityManagement';
import RoleManagement from './pages/admin/RoleManagement/RoleManagement';
import RoleForm from './pages/admin/RoleForm/RoleForm';
import SystemSettingd from './pages/admin/SystemSettings/SystemSettings';
import Login from './pages/auth/Login/Login';
import Register from './pages/auth/Register/Register';
import UserProfile from './pages/profile/UserProfile/UserProfile';
import UserSessionTab from './pages/profile/UserSessionTab/UserSessionTab';
import './index.css';
export default function App() {
  return (
    <>
    <BrowserRouter>
       <Routes>
        <Route path="/" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="userProfile" element={<UserProfile />} />
        <Route path="userSessionTab" element={<UserSessionTab />} />
        <Route path="clients" element={<ClientManagement />} />
        <Route path="clientConfiguration" element={<ClientConfiguration />} />
        <Route path="roles" element={<RoleManagement />} />
        <Route path="roleForm" element={<RoleForm />} />
        <Route path="identities" element={<IdentityManagement />} />    
        <Route path="auditLogs" element={<AuditLogs />} />
        <Route path="systemSettings" element={<SystemSettingd />} />


      
       </Routes>
    </BrowserRouter>
    </>
     
  );
}
