import { useState, useEffect, useMemo } from 'react';
import CreateNewRoleModal from '../modals/CreateNewRoleModal/CreateNewRoleModal';
import DeleteRoleModal from '../modals/DeleteRoleModal/DeleteRoleModal';
import RoleHeader from './RoleHeader';
import RoleFilters from './RoleFilters';
import RoleTable from './RoleTable';
import { useAuth } from '../../../hooks/useAuth';
import { adminService } from '../../../services/adminService';
import '../../../assets/styles/RoleManagment.css';

export default function RoleManagement() {
  const { hasAuthority } = useAuth();
  const canWrite = hasAuthority('roles.write');
  const [roles, setRoles]                         = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [search, setSearch]                       = useState('');
  const [filter, setFilter]                       = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole]           = useState(null);

  async function load() {
    setLoading(true);
    try {
      const data = await adminService.listRoles();
      setRoles(Array.isArray(data) ? data : []);
    } catch {
      setRoles([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filteredRoles = useMemo(() => {
    return roles.filter(role => {
      const matchesSearch =
        role.name.toLowerCase().includes(search.toLowerCase()) ||
        (role.description ?? '').toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || role.type?.toLowerCase() === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [roles, search, filter]);

  const exportData = filteredRoles.map(({ name, description, type, createdAt }) => ({
    Name: name,
    Description: description,
    Type: type,
    'Created At': createdAt,
  }));

  const handleEdit   = (role) => { setSelectedRole(role); setIsCreateModalOpen(true); };
  const handleDelete = (role) => { setSelectedRole(role); setIsDeleteModalOpen(true); };
  const handleCreate = ()     => { setSelectedRole(null); setIsCreateModalOpen(true); };

  const handleConfirmDelete = async () => {
    try {
      await adminService.deleteRole(selectedRole.id);
      setRoles(prev => prev.filter(r => r.id !== selectedRole.id));
    } catch { /* keep state */ }
    setIsDeleteModalOpen(false);
    setSelectedRole(null);
  };

  const handleSaveRole = async (roleData, isEdit) => {
    try {
      const payload = {
        name: roleData.name,
        description: roleData.description,
        type: roleData.type,
        permissionCodes: roleData.permissionCodes ?? [],
      };
      if (isEdit) {
        await adminService.updateRole(roleData.id, payload);
      } else {
        await adminService.createRole({ ...payload, type: 'CUSTOM' });
      }
      await load();
    } catch { /* keep state */ }
    setIsCreateModalOpen(false);
  };

  return (
    <div className="role-management">
      <RoleHeader onCreateClick={canWrite ? handleCreate : undefined} canWrite={canWrite} />

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

        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            Loading…
          </div>
        ) : (
          <RoleTable
            roles={filteredRoles}
            onEdit={canWrite ? handleEdit : undefined}
            onDelete={canWrite ? handleDelete : undefined}
            canWrite={canWrite}
          />
        )}

        {!loading && filteredRoles.length === 0 && (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
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
          userCount={0}
          onDelete={handleConfirmDelete}
        />
      )}
    </div>
  );
}
