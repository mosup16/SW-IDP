import { apiClient } from './apiClient';

export const authService = {
  me: async () => apiClient.get('/api/identity/api/v1/sessions/me/identity').catch(() => null),

  signIn: async (creds) => apiClient.post('/api/identity/login', creds),

  register: async (creds) => apiClient.post('/api/identity/register', creds),

  signOut: async () => apiClient.post('/api/identity/api/v1/sessions/revoke-all').catch(() => {}),

  updatePassword: async ({ currentPassword, newPassword }) =>
    apiClient.patch('/api/identity/api/v1/me/password', { currentPassword, newPassword }),
};
