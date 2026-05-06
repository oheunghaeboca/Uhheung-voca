import { apiClient } from './client';

export const authApi = {
  signup: (body) => apiClient.post('/api/auth/signup', body).then((r) => r.data),
  login: (body) => apiClient.post('/api/auth/login', body).then((r) => r.data),
  me: () => apiClient.get('/api/auth/me').then((r) => r.data),
  logout: () => apiClient.post('/api/auth/logout').then((r) => r.data),
};
