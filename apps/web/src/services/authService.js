import { apiClient } from './apiClient';

const MOCK = true; // flip when identity-service is reachable

const fakeUser = {
  id: 'u1',
  email: 'demo@sovereign.idp',
  displayName: 'Alex Vance',
  role: 'Super Administrator',
};

export const authService = {
  signIn:  async (creds) => MOCK ? fakeUser : apiClient.post('/identity/login', creds),
  signOut: async ()      => MOCK ? null     : apiClient.post('/identity/logout'),
  me:      async ()      => MOCK ? fakeUser : apiClient.get('/identity/me'),
};