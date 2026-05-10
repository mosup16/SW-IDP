import { apiClient } from './apiClient';

export const adminService = {
  // Identities
  listIdentities: async () => apiClient.get('/api/identity/api/v1/identities'),
  createIdentity: async (data) => apiClient.post('/api/identity/api/v1/identities', data),
  updateIdentity: async (id, data) => apiClient.put(`/api/identity/api/v1/identities/${id}`, data),
  deleteIdentity: async (id) => apiClient.delete(`/api/identity/api/v1/identities/${id}`),

  // Roles
  listRoles: async () => apiClient.get('/api/identity/roles'),
  createRole: async (data) => apiClient.post('/api/identity/roles', data),
  updateRole: async (id, data) => apiClient.put(`/api/identity/roles/${id}`, data),
  deleteRole: async (id) => apiClient.delete(`/api/identity/roles/${id}`),

  // Identity-Roles
  listIdentityRoles: async (identityId) =>
    apiClient.get(`/api/identity/api/v1/identity-roles/${identityId}/roles`),
  assignRoleToIdentity: async ({ identityId, roleId, assignedBy }) =>
    apiClient.post('/api/identity/api/v1/identity-roles/assign', { identityId, roleId, assignedBy }),
  removeRoleFromIdentity: async ({ identityId, roleId }) =>
    apiClient.delete('/api/identity/api/v1/identity-roles/remove', { identityId, roleId }),

  // Permissions
  listPermissions: async () => apiClient.get('/api/identity/permissions'),

  // Role-Permissions
  listRolePermissions: async (roleId) =>
    apiClient.get(`/api/identity/role-permissions/${roleId}/permissions`),
  assignPermissionToRole: async ({ roleId, permissionId }) =>
    apiClient.post('/api/identity/role-permissions', { roleId, permissionId }),
  removePermissionFromRole: async (roleId, permissionId) =>
    apiClient.delete(`/api/identity/role-permissions/${roleId}/permissions/${permissionId}`),

  // Sessions
  listSessions: async () => apiClient.get('/api/identity/api/v1/sessions/me'),
  revokeSession: async (sessionId) => apiClient.post(`/api/identity/api/v1/sessions/${sessionId}/revoke`),
  revokeAllSessions: async () => apiClient.post('/api/identity/api/v1/sessions/revoke-all'),

  // Audit logs
  listAuditLogs: async ({ from, to, action, status, actorId, page = 0, size = 100 } = {}) => {
    const params = new URLSearchParams();
    if (from)    params.set('from', new Date(from).toISOString());
    if (to)      params.set('to',   new Date(`${to}T23:59:59`).toISOString());
    if (action)  params.set('action', action);
    if (status)  params.set('status', status);
    if (actorId) params.set('actorId', actorId);
    params.set('page', page);
    params.set('size', size);
    return apiClient.get(`/api/admin/audit-logs?${params}`);
  },

  // Settings
  listSettings: async () => apiClient.get('/api/admin/settings'),
  updateSetting: async (key, { value, type, updatedBy }) =>
    apiClient.put(`/api/admin/settings/${key}`, { value, type, UpdatedBy: updatedBy }),
};
