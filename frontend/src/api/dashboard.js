import { apiClient } from './client';

export const dashboardApi = {
  summary: () => apiClient.get('/api/dashboard').then((r) => r.data),
  attendance: (year, month) =>
    apiClient.get('/api/dashboard/attendance', { params: { year, month } }).then((r) => r.data),
};
