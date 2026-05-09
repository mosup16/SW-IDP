import { useLocation, useNavigate } from 'react-router-dom';
import BrandMark from '../ui/BrandMark';
import '../../assets/styles/Sidebar.css';

export default function Sidebar({ items, onSignOut }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      {}
      <div className="sidebar__brand">
        <BrandMark size="sm" />
      </div>

      {}
      <nav className="sidebar__nav" aria-label="Main navigation">
        {items.map(({ href, label, icon }) => {
          const active = href === pathname;
          const isSignOut = href === '/logout';

          return (
            <button
              key={href}
              className={[
                'sidebar__item',
                active     ? 'sidebar__item--active'  : '',
                isSignOut  ? 'sidebar__item--signout' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => isSignOut ? onSignOut?.() : navigate(href)}
              aria-current={active ? 'page' : undefined}
            >
              <span className="sidebar__item-icon" aria-hidden="true">
                {icon}
              </span>
              <span className="sidebar__item-label">{label}</span>
              {active && (
                <span className="sidebar__active-pill" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}