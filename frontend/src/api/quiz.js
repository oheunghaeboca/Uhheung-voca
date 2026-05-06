import { apiClient } from './client';

export const quizApi = {
  start: (body) => apiClient.post('/api/quiz/start', body).then((r) => r.data),
  submit: (body) => apiClient.post('/api/quiz/submit', body).then((r) => r.data),
  results: (params) => apiClient.get('/api/quiz/results', { params }).then((r) => r.data),
  result: (id) => apiClient.get(`/quiz-results/${id}`).then((r) => r.data),
  saveResult: (body) => apiClient.post('/quiz-results', body).then((r) => r.data),
};
