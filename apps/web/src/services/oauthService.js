import { apiClient } from './apiClient';

const MOCK = true;

// Seeded OAuth Clients
const mockedClients = [
  {
    id: 'c1',
    clientId: 'marketing-automation',
    name: 'Marketing Automation',
    description: 'Automates email campaigns and lead nurturing',
    clientType: 'CONFIDENTIAL',
    status: 'ACTIVE',
    createdAt: '2026-01-15T10:00:00Z',
    lastUsedAt: '2026-05-05T14:30:00Z',
  },
  {
    id: 'c2',
    clientId: 'data-pipeline',
    name: 'Data Pipeline',
    description: 'Internal ETL and analytics data synchronization',
    clientType: 'CONFIDENTIAL',
    status: 'ACTIVE',
    createdAt: '2026-02-10T09:15:00Z',
    lastUsedAt: '2026-05-06T08:45:00Z',
  },
  {
    id: 'c3',
    clientId: 'mobile-app',
    name: 'Mobile App',
    description: 'Native iOS and Android application for field users',
    clientType: 'PUBLIC',
    status: 'ACTIVE',
    createdAt: '2026-03-01T11:20:00Z',
    lastUsedAt: '2026-05-06T12:10:00Z',
  },
  {
    id: 'c4',
    clientId: 'partner-portal',
    name: 'Partner Portal',
    description: 'External partner dashboard and collaboration platform',
    clientType: 'CONFIDENTIAL',
    status: 'ACTIVE',
    createdAt: '2026-03-20T14:00:00Z',
    lastUsedAt: '2026-04-28T16:55:00Z',
  },
];

// Centralized Redirect URIs (Easy to modify when switching to real API)
const getRedirectURIs = async (clientId) => {
  if (MOCK) {
    // ← You will only modify this part when connecting to real backend
    const mockData = {
      c1: [
        'https://marketing.sovereign.idp/callback',
        'https://app.marketingautomation.com/oauth/callback',
      ],
      c2: [
        'https://internal.datapipeline.sovereign.idp/callback',
      ],
      c3: [
        'myapp://oauth/callback',
        'https://mobile.sovereign.idp/callback',
      ],
      c4: [
        'https://partners.sovereign.idp/auth/callback',
        'https://portal.partnercompany.com/oauth2/callback',
      ],
    };
    return mockData[clientId] || [];
  }

  // Real API call (only this line changes when you remove MOCK)
  return apiClient.get(`/oauth/clients/${clientId}/redirect-uris`);
};

export const oauthService = {
  listClients: async () => 
    MOCK ? mockedClients : apiClient.get('/oauth/clients'),

  getClient: async (clientId) => 
    MOCK 
      ? mockedClients.find(c => c.id === clientId || c.clientId === clientId) 
      : apiClient.get(`/oauth/clients/${clientId}`),

  // ← This is the function you asked for
  getRedirectURIs,

  // Optional: Create / Delete (for future use)
  createClient: async (data) => 
    MOCK 
      ? { ...data, id: `c${Date.now()}`, clientId: data.name?.toLowerCase().replace(/\s+/g, '-'), createdAt: new Date().toISOString() }
      : apiClient.post('/oauth/clients', data),

  deleteClient: async (clientId) => 
    MOCK 
      ? Promise.resolve({ success: true, message: 'Client deleted' }) 
      : apiClient.delete(`/oauth/clients/${clientId}`),
};