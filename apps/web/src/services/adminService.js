import { apiClient } from './apiClient';

export const adminService = {
  // Identities
  listIdentities: async () => apiClient.get('/api/identity/api/v1/identities'),
  identityStats: async () => {
    const list = await apiClient.get('/api/identity/api/v1/identities');
    const arr = Array.isArray(list) ? list : (list.content ?? []);
    return { total: arr.length, activeNow: arr.filter(i => i.status === 'ENABLED').length };
  },
  createIdentity: async (data) => apiClient.post('/api/identity/api/v1/identities', data),
  updateIdentity: async (id, data) => apiClient.patch(`/api/identity/api/v1/identities/${id}`, data),
  deleteIdentity: async (id) => apiClient.delete(`/api/identity/api/v1/identities/${id}`),

  // Roles
  listRoles: async () => apiClient.get('/api/identity/roles'),
  listPermissions: async () => apiClient.get('/api/identity/permissions'),
  createRole: async (data) => apiClient.post('/api/identity/roles', data),
  updateRole: async (id, data) => apiClient.put(`/api/identity/roles/${id}`, data),
  deleteRole: async (id) => apiClient.delete(`/api/identity/roles/${id}`),

  // Sessions
  listSessions: async () => apiClient.get('/api/identity/api/v1/sessions/me'),
  revokeSession: async (sessionId) => apiClient.post(`/api/identity/api/v1/sessions/${sessionId}/revoke`),

  // Audit logs
  listAuditLogs: async ({ from, to, action, status, actorId, page = 0, size = 20 } = {}) => {
    const params = new URLSearchParams();
    if (from)    params.set('from', from);
    if (to)      params.set('to', to);
    if (action)  params.set('action', action);
    if (status)  params.set('status', status);
    if (actorId) params.set('actorId', actorId);
    params.set('page', page);
    params.set('size', size);
    return apiClient.get(`/api/admin/audit-logs?${params}`);
  },

  // Settings
  listSettings: async () => apiClient.get('/api/admin/settings'),
  getSetting: async (key) => apiClient.get(`/api/admin/settings/${key}`),
  updateSetting: async (key, value) => apiClient.put(`/api/admin/settings/${key}`, { value }),
};
