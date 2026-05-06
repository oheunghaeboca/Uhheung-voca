import { apiClient } from './client';

export const bookmarksApi = {
  list: (params) => apiClient.get('/api/bookmarks', { params }).then((r) => r.data),
  toggle: (wordId) => apiClient.post(`/api/bookmarks/${wordId}`).then((r) => r.data),
};
