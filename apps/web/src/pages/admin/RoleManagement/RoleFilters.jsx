import { useState } from 'react';
import Icon from '../../../components/icon';
import '../../../assets/styles/RoleFilters.css';

const ROLE_FILTER_OPTIONS = [
  { label: 'All',    value: 'all'    },
  { label: 'System', value: 'system' },
  { label: 'Custom', value: 'custom' },
];

const CLIENT_FILTER_OPTIONS = [
  { label: 'All',          value: 'all'          },
  { label: 'Confidential', value: 'confidential' },
  { label: 'Public',       value: 'public'       },
  { label: 'Machine',      value: 'machine'      },
];

export default function RoleFilters({
  mode = "roles",
  searchValue = "",
  onSearch,
  filterValue = "all",
  onFilter,
  exportData = [],
  exportFileName = "export",
}) {
  const [open, setOpen] = useState(false);

  const placeholder = mode === "clients"
    ? "Filter by client name or ID..."
    : "Filter by role name...";

  const filterOptions = mode === "clients" ? CLIENT_FILTER_OPTIONS : ROLE_FILTER_OPTIONS;

  const handleExport = () => {
    if (exportData.length === 0) return;

    const csvContent = "data:text/csv;charset=utf-8,"
      + exportData.map(row => Object.values(row).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${exportFileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="role-filters-wrapper">
      <div className="role-filters-search-wrapper">
        <Icon.Search size={16} className="role-filters-search-icon" />
        <input
          type="text"
          placeholder={placeholder}
          className="role-filters-search-input"
          value={searchValue}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="role-filters-controls">
        <div className="role-filters-dropdown-wrapper">
          <button
            onClick={() => setOpen(prev => !prev)}
            className="role-filters-toggle-btn"
          >
            <Icon.Filter size={16} />
            Filters
          </button>

          {open && (
            <>
              <div className="role-filters-backdrop" onClick={() => setOpen(false)} />
              <div className="role-filters-dropdown">
                <p className="role-filters-dropdown-label">Filter by Type</p>
                {filterOptions.map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => { onFilter(value); setOpen(false); }}
                    className={`role-filters-option-btn ${filterValue === value ? 'active' : ''}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button className="role-filters-export-btn" onClick={handleExport}>
          <Icon.Download size={16} />
          Export CSV
        </button>
      </div>
    </div>
  );
}