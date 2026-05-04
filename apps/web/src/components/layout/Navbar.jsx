import { useState, useRef, useEffect } from 'react';
import { Bell, HelpCircle, UserCircle, Settings, LogOut } from 'lucide-react';
import './Navbar.css';

/**
 * Navbar — horizontal top bar rendered only for authenticated admin users.
 *
 * Props:
 *  userName   — display name shown in the avatar dropdown. Default: 'Admin'
 *  onNavigate — (href: string) => void  — same router bridge as Sidebar
 *  onSignOut  — () => void
 */
export default function Navbar({ userName = 'Admin', onNavigate, onSignOut }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    function handleOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  function navigate(href) {
    setDropdownOpen(false);
    onNavigate?.(href);
  }

  function signOut() {
    setDropdownOpen(false);
    onSignOut?.();
  }

  return (
    <header className="navbar">
      {/* Spacer — brand lives in sidebar */}
      <div className="navbar__spacer" />

      {/* Icon actions */}
      <div className="navbar__actions">
        <button
          className="navbar__icon-btn"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>

        <button
          className="navbar__icon-btn"
          title="Help"
          aria-label="Help"
        >
          <HelpCircle size={20} />
        </button>

        {/* Avatar + dropdown */}
        <div className="navbar__avatar-wrap" ref={dropdownRef}>
          <button
            className="navbar__avatar"
            onClick={() => setDropdownOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
            aria-label="User menu"
          >
            {initials}
          </button>

          {dropdownOpen && (
            <div className="navbar__dropdown" role="menu">
              {/* User label */}
              <div className="navbar__dropdown-label">
                {userName.toUpperCase()}
              </div>

              <button
                className="navbar__dropdown-item"
                role="menuitem"
                onClick={() => navigate('userProfile')}
              >
                <UserCircle size={18} className="navbar__dropdown-icon" />
                My Profile
              </button>

              <button
                className="navbar__dropdown-item"
                role="menuitem"
                onClick={() => navigate('systemSettings')}
              >
                <Settings size={18} className="navbar__dropdown-icon" />
                Settings
              </button>

              <div className="navbar__dropdown-divider" />

              <button
                className="navbar__dropdown-item navbar__dropdown-item--danger"
                role="menuitem"
                onClick={signOut}
              >
                <LogOut size={18} className="navbar__dropdown-icon" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}