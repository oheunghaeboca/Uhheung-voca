import { apiClient } from './client';

/**
 * 인증 API 호출 모듈.
 *
 * 호출 경로는 baseURL '/api' 와 합쳐져 최종적으로 '/api/auth/...' 가 된다.
 * 페이지/컨텍스트는 axios 를 직접 import 하지 말고 이 모듈을 거치게 한다.
 */
export const authApi = {
  // 회원가입. 성공 시 { id, username, nickname, role } 반환 (201).
  signup: (body) =>
    apiClient.post('/auth/signup', body).then((r) => r.data),

  // 로그인. 성공 시 access/refresh 토큰 + user 객체 반환 (200).
  login: (body) =>
    apiClient.post('/auth/login', body).then((r) => r.data),

  // 현재 사용자 정보. Authorization 헤더 필요 (200).
  me: () =>
    apiClient.get('/auth/me').then((r) => r.data),

  // 로그아웃 (refresh token 폐기). 이번 범위에서는 사용하지 않으므로
  // 호출자는 보통 tokenStore.clear() 만으로 충분하다.
  logout: (body) =>
    apiClient.post('/auth/logout', body).then((r) => r.data),
};
