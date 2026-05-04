import BrandMark from '../ui/BrandMark';
import './Sidebar.css';


export default function Sidebar({ items, activeHref, onNavigate }) {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar__brand">
        <BrandMark size="sm" />
      </div>

      {/* Nav — all items including Settings & Sign Out */}
      <nav className="sidebar__nav" aria-label="Main navigation">
        {items.map(({ href, label, icon }) => {
          const active = href === activeHref;
          const isSignOut = href === '/logout';

          return (
            <button
              key={href}
              className={[
                'sidebar__item',
                active     ? 'sidebar__item--active'  : '',
                isSignOut  ? 'sidebar__item--signout' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => onNavigate(href)}
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