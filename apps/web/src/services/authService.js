import { apiClient } from './apiClient';

export const authService = {
  me: async () => {
    const sessions = await apiClient.get('/api/identity/api/v1/sessions/me').catch(() => null);
    if (!sessions?.length) return null;
    const identity = sessions[0].identity;
    return { identityId: identity.id, email: identity.email };
  },

  signIn: async (creds) => apiClient.post('/api/identity/login', creds),

  register: async (creds) => apiClient.post('/api/identity/register', creds),

  signOut: async () => apiClient.post('/api/identity/api/v1/sessions/revoke-all').catch(() => {}),

  updatePassword: async ({ currentPassword, newPassword }) =>
    apiClient.patch('/api/identity/api/v1/me/password', { currentPassword, newPassword }),
};
