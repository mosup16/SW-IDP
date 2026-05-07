import { useState } from 'react';
import Icon from '../../../components/icon';
import '../../../assets/styles/RoleFilters.css';

const FILTER_OPTIONS = [
  { label: 'All roles',    icon: Icon.Infinity },
  { label: 'System roles', icon: Icon.Shield   },
  { label: 'Custom roles', icon: Icon.Filter   },
];

export default function RoleFilters() {
  const [open, setOpen]         = useState(false);
  const [selected, setSelected] = useState('All roles');

  const handleSelect = (label) => {
    setSelected(label);
    setOpen(false);
  };

  return (
    <div className="role-filters-wrapper">

      {/* Search */}
      <div className="role-filters-search-wrapper">
        <Icon.Search
          size={15}
          className="role-filters-search-icon"
        />
        <input
          type="text"
          placeholder="Filter by role name..."
          className="role-filters-search-input"
        />
      </div>

      <div className="role-filters-controls">

        {/* Filters button + dropdown */}
        <div className="role-filters-dropdown-wrapper">
          <button
            onClick={() => setOpen(prev => !prev)}
            className="role-filters-toggle-btn"
          >
            <Icon.Filter size={15} />
            Filters
          </button>

          {open && (
            <>
              {/* backdrop */}
              <div
                className="role-filters-backdrop"
                onClick={() => setOpen(false)}
              />

              {/* dropdown */}
              <div className="role-filters-dropdown">
                <p className="role-filters-dropdown-label">
                  Filter by Tier
                </p>

                {FILTER_OPTIONS.map(({ label, icon: OptionIcon }) => (
                  <button
                    key={label}
                    onClick={() => handleSelect(label)}
                    className="role-filters-option-btn"
                  >
                    <OptionIcon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Export CSV */}
        <button className="role-filters-export-btn">
          <Icon.Download size={15} />
          Export CSV
        </button>

      </div>
    </div>
  );
}