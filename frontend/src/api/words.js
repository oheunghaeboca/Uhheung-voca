import { apiClient } from './client';

export const wordsApi = {
  list: (params) => apiClient.get('/words', { params }).then((r) => r.data),
  get: (id) => apiClient.get(`/words/${id}`).then((r) => r.data),
  daily: () => apiClient.get('/words/daily').then((r) => r.data),
  // 단어 학습 이벤트 기록 (PBI-12 STUDY_WORDS 미션 트리거). 실패해도 화면 동작은 막지 않는다.
  view: (id) => apiClient.post(`/words/${id}/view`).then((r) => r.data),
  create: (body) => apiClient.post('/admin/words', body).then((r) => r.data),
  update: (id, body) => apiClient.patch(`/admin/words/${id}`, body).then((r) => r.data),
  remove: (id) => apiClient.delete(`/admin/words/${id}`).then((r) => r.data),
};