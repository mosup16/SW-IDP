import { apiClient } from './apiClient';

const MOCK = true;

const fakeUser = {
  id: 'u1',
  email: 'admin@sovereign.idp',
  displayName: 'Admin User',
  role: 'Super Administrator',
};

export const authService = {
  me: async () => 
    MOCK ? fakeUser : apiClient.get('/identity/me'),

  signIn: async (creds) => 
    MOCK ? fakeUser : apiClient.post('/identity/login', creds),

  // New register method as requested
  register: async (creds) => 
    MOCK ? fakeUser : apiClient.post('/identity/register', creds),

  signOut: async () => 
    MOCK ? Promise.resolve() : apiClient.post('/identity/logout'),
};