import { apiClient } from './client';

export const rankingApi = {
  list: (params) => apiClient.get('/ranking', { params }).then((r) => r.data),
};
