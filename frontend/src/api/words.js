import { apiClient } from './client';

export const wordsApi = {
  list: (params) => apiClient.get('/words', { params }).then((r) => r.data),
  get: (id) => apiClient.get(`/words/${id}`).then((r) => r.data),
  daily: () => apiClient.get('/words/daily').then((r) => r.data),
  create: (body) => apiClient.post('/admin/words', body).then((r) => r.data),
  update: (id, body) => apiClient.patch(`/admin/words/${id}`, body).then((r) => r.data),
  remove: (id) => apiClient.delete(`/admin/words/${id}`).then((r) => r.data),
};