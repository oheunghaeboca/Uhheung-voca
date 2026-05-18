import { apiClient } from './client';

export const dashboardApi = {
  summary: (userId) => apiClient.get('/dashboard', { params: { userId } }).then((r) => r.data),
  attendance: (userId, year, month) =>
      apiClient.get('/dashboard/attendance', { params: { userId, year, month } }).then((r) => r.data),
};