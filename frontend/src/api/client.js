import axios from 'axios';

/**
 * 단일 axios 인스턴스.
 *
 * baseURL 전략: 기본값 '/api'.
 *  - 개발 환경에서는 vite proxy 가 '/api/*' 를 백엔드(localhost:8080)로 전달.
 *  - 프로덕션에서는 reverse proxy 가 같은 경로 규약을 처리하면 된다.
 *  - 예외적으로 다른 백엔드를 가리키고 싶다면 .env.local 에 VITE_API_BASE_URL 을 둔다.
 *    (.env.local 은 .gitignore 대상)
 *
 * 토큰 저장 전략 (현재):
 *  - localStorage('voca.accessToken') 단순 보관.
 *  - 단점: XSS 발생 시 탈취 가능. 학습 단계에서는 단순함을 우선.
 *  - TODO: 백엔드가 httpOnly 쿠키 또는 refresh token 을 정식 지원하면 그쪽으로 전환.
 *
 * 인터셉터:
 *  - request: 토큰이 있으면 Authorization: Bearer 헤더 자동 첨부.
 *  - response: 401 발생 시 토큰을 폐기하고 'auth:logout' 커스텀 이벤트를 디스패치.
 *    AuthContext 가 그 이벤트를 받아 상태를 'guest' 로 바꾸면, ProtectedRoute 가
 *    자동으로 /login 으로 리다이렉트한다. (window.location 으로 hard reload 하지 않음 —
 *    React state 가 보존되어 사용자 입력 등 작업이 덜 깨진다.)
 */
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const TOKEN_KEY = 'voca.accessToken';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// 모든 요청에 access token 자동 첨부.
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 → 토큰 폐기 + 커스텀 이벤트. AuthContext 가 듣고 후속 처리.
apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      tokenStore.clear();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    return Promise.reject(err);
  },
);
