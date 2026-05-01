import { BrowserRouter, Routes, Route,Navigate, Outlet  } from 'react-router-dom';
import CreateIdentityModal from './pages/admin/modals/CreateIdentityModal';
import DeleteClientPopup from './pages/admin/modals/DeleteClientPopup';
import DeleteRoleModal from './pages/admin/modals/DeleteRoleModal';
import SecretRotationModal from './pages/admin/modals/SecretRotationModal';
import AccessPolicies from './pages/admin/AccessPolicies';
import AuditLogs from './pages/admin/AuditLogs';
import ClientForm from './pages/admin/ClientForm';
import ClientManagement from './pages/admin/ClientManagement';
import IdentityManagement from './pages/admin/IdentityManagement';
import RoleManagement from './pages/admin/RoleManagement';
import RoleForm from './pages/admin/RoleForm';
import SystemSettingd from './pages/admin/SystemSettings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import UserProfile from './pages/profile/UserProfile';
import UserSessionTab from './pages/profile/UserSessionTab';
import './index.css';
export default function App() {
  return (
    <>
    <BrowserRouter>
       <Routes>
        <Route path="/" element=

       </Routes>
    </BrowserRouter>
    </>
     
  );
}
