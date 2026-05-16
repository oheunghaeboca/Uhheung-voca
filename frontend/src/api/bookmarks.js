import { apiClient } from './client';

export const bookmarksApi = {
  list: (params) => apiClient.get('/bookmarks', { params }).then((r) => r.data),
  toggle: (wordId) => apiClient.post(`/bookmarks/${wordId}`).then((r) => r.data),
};
