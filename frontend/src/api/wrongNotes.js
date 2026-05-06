import { apiClient } from './client';

export const wrongNotesApi = {
  list: () => apiClient.get('/api/wrong-notes').then((r) => r.data),
  retest: (body) => apiClient.post('/api/wrong-notes/retest', body).then((r) => r.data),
};
