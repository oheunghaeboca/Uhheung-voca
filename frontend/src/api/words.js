import { apiClient } from './client';

export const wordsApi = {
  list: (params) => apiClient.get('/api/words', { params }).then((r) => r.data),
  get: (id) => apiClient.get(`/api/words/${id}`).then((r) => r.data),
  create: (body) => apiClient.post('/api/words', body).then((r) => r.data),
  update: (id, body) => apiClient.put(`/api/words/${id}`, body).then((r) => r.data),
  remove: (id) => apiClient.delete(`/api/words/${id}`).then((r) => r.data),
  daily: () => apiClient.get('/api/words/daily').then((r) => r.data),
};
