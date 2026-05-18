import { apiClient } from './client';

export const bookmarksApi = {
  list: (userId) => apiClient.get('/bookmarks', { params: { userId } }).then((r) => r.data),
  toggle: (wordId, userId) => apiClient.post(`/bookmarks/${wordId}`, null, { params: { userId } }).then((r) => r.data),
};