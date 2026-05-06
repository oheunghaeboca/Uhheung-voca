import { apiClient } from './client';

export const rankingApi = {
  list: (params) => apiClient.get('/api/ranking', { params }).then((r) => r.data),
};
