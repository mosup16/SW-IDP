import { useState, useMemo } from 'react';
import { Shield, Eye, Contact, ShieldCheck } from 'lucide-react';
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
    tier: 'system',
    icon: Shield,
    iconBgColor: 'var(--badge-active-bg)',
    iconColor: 'var(--badge-active-text)',
  },
  {
    id: '2',
    name: 'Policy Editor',
    description: 'Can create and modify access policies but cannot assign roles.',
    assignedUsers: 12,
    tier: 'system',
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
    tier: 'system',
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
    tier: 'custom',
    icon: Contact,
    iconBgColor: 'var(--sidebar-bg)',
    iconBorderColor: 'var(--border)',
    iconColor: 'var(--text-muted)',
  },
];

export default function RoleManagement() {
  const [roles, setRoles]                         = useState(INITIAL_ROLES);
  const [search, setSearch]                       = useState('');
  const [filter, setFilter]                       = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole]           = useState(null);

  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      const matchesSearch =
        role.name.toLowerCase().includes(search.toLowerCase()) ||
        role.description.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || role.tier === filter;
      return matchesSearch && matchesFilter;
    });
  }, [roles, search, filter]);


  const exportData = filteredRoles.map(({ name, description, assignedUsers, tier }) => ({
    Name: name,
    Description: description,
    'Assigned Users': assignedUsers,
    Tier: tier,
  }));

  const handleEdit   = (role) => { setSelectedRole(role); setIsCreateModalOpen(true); };
  const handleDelete = (role) => { setSelectedRole(role); setIsDeleteModalOpen(true); };
  const handleCreate = ()     => { setSelectedRole(null); setIsCreateModalOpen(true); };

  const handleConfirmDelete = () => {
    setRoles(prev => prev.filter(r => r.id !== selectedRole.id));
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  };

  const handleSaveRole = (savedRole, isEdit) => {
    if (isEdit) {
      setRoles(prev => prev.map(r => r.id === savedRole.id ? savedRole : r));
    } else {
      setRoles(prev => [...prev, savedRole]);
    }
  };

  return (
    <div className="role-management">
      <RoleHeader onCreateClick={handleCreate} />

      <div className="role-management__card mt-4">
        <RoleFilters
          mode="roles"
          searchValue={search}
          onSearch={setSearch}
          filterValue={filter}
          onFilter={setFilter}
          exportData={exportData}
          exportFileName="roles-export"
        />
        <RoleTable
          roles={filteredRoles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {filteredRoles.length === 0 && (
          <div style={{
            padding: '48px 24px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '14px',
          }}>
            No roles match your search or filter.
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateNewRoleModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          role={selectedRole}
          onSave={handleSaveRole}
        />
      )}

      {isDeleteModalOpen && selectedRole && (
        <DeleteRoleModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          roleName={selectedRole.name}
          userCount={selectedRole.assignedUsers}
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
}