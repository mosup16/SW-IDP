import {
  UserCircle,
  LayoutGrid,
  Users,
  ShieldCheck,
  ScrollText,
  Settings,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Sidebar from '../../components/layout/Sidebar';
import Navbar from '../../components/layout/Navbar';
import '../../assets/styles/AdminLayout.css';
import { Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { href: '/userProfile',    label: 'User Profile',    icon: <UserCircle  size={18} /> },
  { href: '/clients',        label: 'Clients',         icon: <LayoutGrid  size={18} /> },
  { href: '/identities',     label: 'Identities',      icon: <Users       size={18} /> },
  { href: '/roles',          label: 'Roles',           icon: <ShieldCheck size={18} /> },
  { href: '/audit-logs',     label: 'Audit Logs',      icon: <ScrollText  size={18} /> },
  { href: '/systemSettings', label: 'System Settings', icon: <Settings    size={18} /> },
  { href: '/logout',         label: 'Sign Out',        icon: <LogOut      size={18} /> },
];

export default function AdminLayout() {
  const { signOut, currentUser } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <div className="admin-layout">
      <Sidebar items={NAV_ITEMS} onSignOut={handleSignOut} />

      <div className="admin-layout__main">
        <Navbar
          userName={currentUser?.email ?? 'Admin'}
          onNavigate={navigate}
          onSignOut={handleSignOut}
        />
        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
