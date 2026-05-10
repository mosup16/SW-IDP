import Icon from '../../../components/icon';
import '../../../assets/styles/RoleTable.css';

export default function RoleTable({ roles, onEdit, onDelete }) {
  return (
    <div className="role-table-wrapper">
      <table className="role-table">
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Description</th>
            <th className="col-identities">Assigned Identities</th>
            <th className="col-actions">Actions</th>
          </tr>
        </thead>

        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>
                <div className="role-name-cell">
                  <div className="role-icon-box">
                    <Icon.Shield size={18} />
                  </div>
                  <span className="role-name-text">{role.name}</span>
                </div>
              </td>

              <td>
                <span className="role-description">{role.description ?? '—'}</span>
              </td>

              <td className="col-identities">
                <span className="badge-users">{role.assignedUsers ?? 0} Users</span>
              </td>

              <td className="col-actions">
                <div className="actions-group">
                  <button
                    onClick={() => onEdit(role)}
                    className="btn-action"
                    title="Edit"
                  >
                    <Icon.Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(role)}
                    className="btn-action btn-delete"
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