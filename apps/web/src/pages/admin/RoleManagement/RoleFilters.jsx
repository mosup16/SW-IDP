import Icon from '../../../components/icon';

export default function RoleFilters() {
  return (
    <div className="d-flex justify-content-between align-items-center px-3 py-3">
      
      <div className="position-relative" style={{ width: '450px' }}>
        <Icon.Search
          size={15}
          className="position-absolute"
          style={{
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-placeholder)',
            zIndex: 1,
          }}
        />

        <input
          type="text"
          placeholder="Filter by role name..."
          className="form-control border-0 shadow-none"
          style={{
            paddingLeft: '36px',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            background: 'var(--input-bg)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
            color: 'var(--text-body)',
          }}
        />
      </div>
      <div className="d-flex align-items-center gap-2">

        <button
          className="btn d-flex align-items-center gap-2 fw-semibold"
          style={{
            background: 'var(--badge-default-bg)',
            color: 'var(--text-label)',
            borderRadius: '0.5rem',
            fontSize: '0.85rem',
            padding: '0.45rem 0.9rem',
            transition: '0.3s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--badge-disabled-bg)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--badge-default-bg)';
          }}
        >
          <Icon.Filter size={15} />
          Filters
        </button>

        <button
          className="btn d-flex align-items-center gap-2 fw-semibold"
          style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '0.85rem',
            padding: '0.45rem 0.9rem',
            transition: '0.3s',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgb(235, 235, 235)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
          }}
        >
          <Icon.Download size={15} />
          Export CSV
        </button>

      </div>
    </div>
  );
}