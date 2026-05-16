import { apiClient } from './client';

export const dashboardApi = {
  summary: () => apiClient.get('/dashboard').then((r) => r.data),
  attendance: (year, month) =>
    apiClient.get('/dashboard/attendance', { params: { year, month } }).then((r) => r.data),
};
