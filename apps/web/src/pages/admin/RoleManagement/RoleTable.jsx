import Icon from '../../../components/icon';

export default function RoleTable({ roles, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0 w-[1550px]">
        <thead>
          <tr>
            <th
              className="px-4 py-3 border-0"
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                background: 'transparent',
              }}
            >
              Role Name
            </th>
            <th
              className="px-4 py-3 border-0"
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                background: 'transparent',
              }}
            >
              Description
            </th>
            <th
              className="px-4 py-3 border-0 text-center"
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                background: 'transparent',
              }}
            >
              Assigned Identities
            </th>
            <th
              className="px-4 py-3 border-0 text-end"
              style={{
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                background: 'transparent',
              }}
            >
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {roles.map((role, index) => (
            <tr
              key={role.id}
            
              onMouseEnter={e =>
                (e.currentTarget.style.background = 'var(--table-row-hover)')
              }
              onMouseLeave={e =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              <td className="px-4 py-3 border-0">
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-3 border flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: role.iconBgColor,
                      borderColor: role.iconBorderColor,
                      color: role.iconColor,
                    }}
                  >
                    <role.icon size={18} />
                  </div>
                  <span
                    className="fw-bold"
                    style={{ color: 'var(--text-heading)', fontSize: '0.9rem' }}
                  >
                    {role.name}
                  </span>
                </div>
              </td>

              <td className="px-4 py-3 border-0">
                <span
                  style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}
                >
                  {role.description}
                </span>
              </td>

              <td className="px-4 py-3 border-0 text-center">
                <span
                  className="badge rounded-pill fw-semibold"
                  style={{
                    background: 'var( --badge-active-bg)',
                    color: 'var(--badge-active-text)',
                    padding: '0.4em 0.9em',
                    fontSize: '0.8rem',
                    letterSpacing: '0.01em',
                  }}
                >
                  {role.assignedUsers} Users
                </span>
              </td>

              <td className="px-4 py-3 border-0 text-end">
                <div className="d-flex justify-content-end align-items-center gap-1">
                  <button
                    onClick={() => onEdit(role)}
                    className="btn btn-link p-2 shadow-none"
                    style={{ color: 'var(--text-muted)', lineHeight: 1 }}
                    title="Edit"
                  >
                    <Icon.Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(role)}
                    className="btn btn-link p-2 shadow-none hover-danger"
                    style={{ color: 'var(--text-muted)', lineHeight: 1 }}
                    title="Delete"
                  >
                    <Icon.Delete size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}