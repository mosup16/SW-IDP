import { useState } from 'react';
import { Shield, Eye, Contact, Edit ,UserCircle,LayoutGrid, ShieldCheck } from 'lucide-react';
import CreateNewRoleModal from '../modals/CreateNewRoleModal/CreateNewRoleModal';
import DeleteRoleModal from '../modals/DeleteRoleModal/DeleteRoleModal';
import RoleHeader from './RoleHeader';
import RoleFilters from './RoleFilters';
import RoleTable from './RoleTable';
import '../../../assets/styles/RoleManagment.css';

const INITIAL_ROLES = [
  {
    id: '1',
    name: 'Global Administrator',
    description: 'Full system access and configuration rights.',
    assignedUsers: 3,
    icon: Shield,
    iconBgColor: 'var(--badge-active-bg)',
    iconColor: 'var(--badge-active-text)',
  },
  {
    id: '2',
    name: 'Policy Editor',
    description: 'Can create and modify access policies but cannot assign roles.',
    assignedUsers: 12,
    icon: ShieldCheck,
    iconBgColor: 'var(--sidebar-bg)',
    iconBorderColor: 'var(--border)',
    iconColor: 'var(--text-muted)',
  },
  {
    id: '3',
    name: 'Auditor',
    description: 'Read-only access to all system logs and configurations.',
    assignedUsers: 8,
    icon: Eye,
    iconBgColor: 'var(--sidebar-bg)',
    iconBorderColor: 'var(--border)',
    iconColor: 'var(--text-muted)',
  },
  {
    id: '4',
    name: 'Support Desk',
    description: 'Can view user profiles and reset MFA tokens.',
    assignedUsers: 45,
    icon: Contact,
    iconBgColor: 'var(--sidebar-bg)',
    iconBorderColor: 'var(--border)',
    iconColor: 'var(--text-muted)',
  },
];

export default function RoleManagement() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsCreateModalOpen(true);
  };

  const handleDelete = (role) => {
    setSelectedRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleCreateClick = () => {
    setSelectedRole(null);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="role-management">
      <RoleHeader onCreateClick={handleCreateClick} />

      <div className="role-management__card mt-4">
        <RoleFilters />
        <RoleTable
          roles={INITIAL_ROLES}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

    

      {isCreateModalOpen && (
        <CreateNewRoleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          role={selectedRole}
        />
      )}
      {isDeleteModalOpen && selectedRole && (
        <DeleteRoleModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          roleName={selectedRole.name}
          userCount={selectedRole.assignedUsers}
        />
      )}
    </div>
  );
}