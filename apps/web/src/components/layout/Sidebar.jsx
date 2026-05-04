import BrandMark from '../ui/BrandMark';
import './Sidebar.css';

/**
 * Sidebar — fixed 256-px admin navigation shell.
 *
 * Props:
 *   items      — required  { href: string, label: string, icon: ReactNode }[]
 *   activeHref — required  string  (e.g. '/profile')
 *   onNavigate — required  (href: string) => void
 *
 * All items (including Settings & Sign Out) are passed in via props.
 * AdminLayout owns the item list and order; Sidebar just renders it.
 * The last item whose href is '/logout' receives the danger sign-out style.
 */
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