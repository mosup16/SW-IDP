import { apiClient } from './apiClient';

export const oauthService = {
  listClients: async () => apiClient.get('/api/oauth/clients'),

  getClient: async (clientId) => apiClient.get(`/api/oauth/clients/${clientId}`),

  createClient: async (data) => apiClient.post('/api/oauth/clients', data),

  updateClient: async (clientId, data) => apiClient.put(`/api/oauth/clients/${clientId}`, data),

  deleteClient: async (clientId) => apiClient.delete(`/api/oauth/clients/${clientId}`),

  rotateSecret: async (clientId, newSecret) =>
    apiClient.post(`/api/oauth/clients/${clientId}/rotate-secret`, { newSecret }),
};
