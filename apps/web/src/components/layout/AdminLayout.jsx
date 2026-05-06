import {
  UserCircle,
  LayoutGrid,
  Users,
  ShieldCheck,
  ScrollText,
  Settings,
  LogOut,
} from 'lucide-react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './AdminLayout.css';

/**
 * AdminLayout — admin shell: Sidebar (left) + <main> (right).
 *
 * Props:
 *   children — required ReactNode  (rendered inside <main>)
 *
 * Sidebar items — exact order from REQUIREMENTS.md §10:
 *   1. User Profile    /profile
 *   2. Clients         /clients
 *   3. Identities      /identities
 *   4. Roles           /roles
 *   5. Audit Logs      /audit-logs
 *   6. System Settings /settings
 *   7. Sign Out        /logout
 *
 * Active href is hardcoded to '/profile' until issue #3 wires the real router.
 */

const NAV_ITEMS = [
  { href: '/profile',    label: 'User Profile',    icon: <UserCircle  size={18} /> },
  { href: '/clients',    label: 'Clients',         icon: <LayoutGrid  size={18} /> },
  { href: '/identities', label: 'Identities',      icon: <Users       size={18} /> },
  { href: '/roles',      label: 'Roles',           icon: <ShieldCheck size={18} /> },
  { href: '/audit-logs', label: 'Audit Logs',      icon: <ScrollText  size={18} /> },
  { href: '/settings',   label: 'System Settings', icon: <Settings    size={18} /> },
  { href: '/logout',     label: 'Sign Out',        icon: <LogOut      size={18} /> },
];

// TODO #3: replace with useLocation()-derived value once router is wired
const ACTIVE_HREF = '/profile';

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar
        items={NAV_ITEMS}
        activeHref={ACTIVE_HREF}
        onNavigate={(href) => {
          // TODO #3: swap for navigate(href) from useNavigate()
          window.location.href = href;
        }}
      />

      <div className="admin-layout__main">
        <Navbar />
        <main className="admin-layout__content">
          {children}
        </main>
      </div>
    </div>
  );
}