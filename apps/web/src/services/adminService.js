import { apiClient } from './apiClient';

const MOCK = true;

const seededIdentities = [
  { id: 'i1', email: 'alex.vance@sovereign.idp', displayName: 'Alex Vance', status: 'ENABLED',  registeredAt: '2026-01-12T09:30:00Z', lastLoginAt: '2026-04-28T14:18:00Z' },
  { id: 'i2', email: 'maria.lopez@sovereign.idp', displayName: 'Maria Lopez', status: 'ENABLED', registeredAt: '2026-02-03T10:15:00Z', lastLoginAt: '2026-04-27T11:02:00Z' },
  { id: 'i3', email: 'tobias.adler@sovereign.idp', displayName: 'Tobias Adler', status: 'ENABLED', registeredAt: '2026-02-10T08:45:00Z', lastLoginAt: '2026-04-25T09:30:00Z' },
  { id: 'i4', email: 'priya.r@sovereign.idp', displayName: 'Priya R.', status: 'DISABLED',  registeredAt: '2026-01-22T13:00:00Z', lastLoginAt: '2026-03-12T16:00:00Z', disabledAt: '2026-04-01T10:00:00Z' },
  { id: 'i5', email: 'kenji.tanaka@sovereign.idp', displayName: 'Kenji Tanaka', status: 'ENABLED', registeredAt: '2026-03-04T14:20:00Z', lastLoginAt: '2026-04-29T08:00:00Z' },
];

const seededSessions = [
  { id: 's1', identityId: 'u1', deviceLabel: 'MacBook Pro - Safari', userAgent: 'Mozilla/5.0…', ipAddress: '192.168.1.104', location: 'San Francisco, CA', createdAt: '2026-04-29T08:42:00Z', lastActiveAt: '2026-04-29T09:50:00Z', isCurrent: true },
  { id: 's2', identityId: 'u1', deviceLabel: 'iPhone 14 Pro - Native App', userAgent: 'AegisCoreApp/1.2 iOS/17.1', ipAddress: '172.20.10.4',  location: 'San Jose, CA', createdAt: '2026-04-29T07:00:00Z', lastActiveAt: '2026-04-29T07:50:00Z', isCurrent: false },
];

const seededRoles = [
  { id: 'r1', name: 'Super Administrator', description: 'Full access',           type: 'BUILT_IN', identityCount: 1, lastModifiedAt: '2026-01-10T00:00:00Z' },
  { id: 'r2', name: 'Developer',           description: 'API + clients access',  type: 'BUILT_IN', identityCount: 8, lastModifiedAt: '2026-01-10T00:00:00Z' },
  { id: 'r3', name: 'Auditor',             description: 'Read-only audit logs',  type: 'BUILT_IN', identityCount: 3, lastModifiedAt: '2026-01-10T00:00:00Z' },
  { id: 'r4', name: 'Support Tier 1',      description: 'Identity status toggle', type: 'BUILT_IN', identityCount: 5, lastModifiedAt: '2026-01-10T00:00:00Z' },
  { id: 'r5', name: 'Financial Analyst',   description: 'Read financial reports', type: 'CUSTOM',  identityCount: 2, lastModifiedAt: '2026-04-15T11:00:00Z' },
];

const seededPermissions = [
  { id: 'p1', code: 'identity.create', resource: 'identity', action: 'create', description: 'Create new identities' },
  { id: 'p2', code: 'identity.read',   resource: 'identity', action: 'read',   description: 'View identity list' },
];

const seededAuditLogs = [
];

const seededSettings = {
  access_token_ttl_mins:   { key: 'access_token_ttl_mins', value: '60',  type: 'int' },
  refresh_token_ttl_days:  { key: 'refresh_token_ttl_days', value: '30',  type: 'int' },
  password_min_length:     { key: 'password_min_length', value: '12',  type: 'int' },
  password_complexity:     { key: 'password_complexity', value: 'uppercase,number,special', type: 'string' },
  maintenance_mode:        { key: 'maintenance_mode', value: 'false', type: 'bool' },
  primary_color:           { key: 'primary_color', value: '#000000', type: 'string' },
  company_logo_url:        { key: 'company_logo_url', value: '', type: 'image' },
};

export const adminService = {
  listIdentities: async () => MOCK ? seededIdentities : apiClient.get('/identity/admin/identities'),
  identityStats:  async () => MOCK
    ? { total: seededIdentities.length, activeNow: seededIdentities.filter(i => i.status === 'ENABLED').length }
    : apiClient.get('/identity/admin/identities/stats'),

  listRoles:       async () => MOCK ? seededRoles : apiClient.get('/identity/admin/roles'),
  listPermissions: async () => MOCK ? seededPermissions : apiClient.get('/identity/admin/permissions'),

  listSessions:    async () => MOCK ? seededSessions : apiClient.get('/identity/sessions'),

  listAuditLogs:   async (filters) => MOCK ? seededAuditLogs : apiClient.get('/admin/audit-logs', { params: filters }),

  listSettings:    async () => MOCK ? seededSettings : apiClient.get('/admin/settings'),
  getSetting:      async (key) => MOCK ? seededSettings[key] : apiClient.get(`/admin/settings/${key}`),
};