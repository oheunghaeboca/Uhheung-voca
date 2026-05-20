import { apiClient } from './client';

export const missionsApi = {
  today: () => apiClient.get('/api/missions/today').then((r) => r.data),
};
