import '../../../assets/styles/RoleHeader.css';
import Icon from '../../../components/icon';

export default function RoleHeader({ onCreateClick, canWrite = true }) {
  return (
    <div className="role-header">
      <div>
        <h1 className="role-header__title">Role Management</h1>
        <p className="role-header__subtitle">
          Manage Role-Based Access Control (RBAC) by defining roles, assigning
          permissions, and managing identity associations across the organization.
        </p>
      </div>

      {canWrite && (
        <button className="role-header__btn" onClick={onCreateClick}>
          <Icon.Add size={17} />
          Create New Role
        </button>
      )}
    </div>
  );
}