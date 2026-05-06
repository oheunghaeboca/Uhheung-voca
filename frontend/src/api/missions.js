import { apiClient } from './client';

export const missionsApi = {
  today: () => apiClient.get('/missions/today').then((r) => r.data),
};
