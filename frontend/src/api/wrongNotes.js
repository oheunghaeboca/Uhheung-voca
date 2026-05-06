import { apiClient } from './client';

export const wrongNotesApi = {
  list: () => apiClient.get('/wrong-notes').then((r) => r.data),
  retest: (body) => apiClient.post('/wrong-notes/retest', body).then((r) => r.data),
};
