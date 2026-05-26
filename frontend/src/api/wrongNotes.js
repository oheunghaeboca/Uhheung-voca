import { apiClient } from './client';

export const wrongNotesApi = {
  list: (userId) => apiClient.get('/wrong-notes', { params: { userId } }).then((r) => r.data),
  retest: (body) => apiClient.post('/wrong-notes/retest', body).then((r) => r.data),
};
