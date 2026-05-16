import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/auth';
import { tokenStore } from '../api/client';

/**
 * 인증 상태/액션을 트리에 공급하는 컨텍스트.
 *
 * 상태 머신 (status):
 *   - 'loading' : 초기 부팅 중. 토큰이 있으면 me() 응답을 기다린다.
 *   - 'authed'  : 인증 완료. user 객체 사용 가능.
 *   - 'guest'   : 비인증 상태(토큰 없음 또는 me() 실패).
 *   ('idle' 은 reserved — 현재 흐름에서는 사용하지 않음.)
 *
 * 액션:
 *   - login(creds)  : 자격증명 검증 → 토큰 저장 → user 세팅 → status='authed'
 *   - signup(form)  : 회원가입 후 자동 로그인까지 (1회 호출로 가입+진입)
 *   - logout()      : 토큰 폐기 + user/null + status='guest' (라우터가 알아서 /login 으로)
 *
 * 자동 로그아웃:
 *   - axios response 인터셉터가 401 발생 시 'auth:logout' 이벤트를 디스패치한다.
 *   - 여기서 그 이벤트를 받아 logout() 을 호출 → status='guest' →
 *     ProtectedRoute 가 다음 렌더에서 /login 으로 리다이렉트.
 *
 * AuthProvider 가 RouterProvider 의 부모이므로 useNavigate 는 여기서 쓸 수 없다.
 * 그래서 명시적으로 navigate 를 호출하지 않고, 상태만 바꿔 라우팅이 자연스레
 * 따라오게 한다.
 */
// react-refresh 룰은 한 파일에 컴포넌트와 컨텍스트 객체를 같이 export 하면 경고하지만,
// 이 프로젝트 패턴(ToastContext 등)과 동일성 유지를 위해 한 파일에 둔다.
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  // 부팅 시 1회: 토큰이 있으면 me() 로 검증, 실패 시 토큰 폐기.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = tokenStore.get();
      if (!token) {
        if (!cancelled) setStatus('guest');
        return;
      }
      try {
        const me = await authApi.me();
        if (!cancelled) {
          setUser(me);
          setStatus('authed');
        }
      } catch {
        // 토큰이 만료/위조 등으로 거절되면 폐기. 401 인터셉터도 같은 일을 하지만
        // 여기서 한 번 더 명시적으로 처리해 동시성 윈도우를 줄인다.
        tokenStore.clear();
        if (!cancelled) {
          setUser(null);
          setStatus('guest');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async ({ username, password }) => {
    const res = await authApi.login({ username, password });
    tokenStore.set(res.accessToken);
    // 백엔드 응답이 user 객체를 nest 한 형태({ user: {...} })라 그것을 우선 사용.
    // 호환성을 위해 평면 필드로 들어오는 경우도 허용.
    setUser(res.user ?? {
      id: res.userId,
      username: res.username,
      nickname: res.nickname,
      role: res.role,
    });
    setStatus('authed');
    return res;
  }, []);

  const signup = useCallback(async ({ username, password, nickname }) => {
    // 가입 즉시 자동 로그인. 가입 성공 후 별도 화면 전환 없이 대시보드로 보내려는 의도.
    await authApi.signup({ username, password, nickname });
    return login({ username, password });
  }, [login]);

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
    setStatus('guest');
  }, []);

  // axios 인터셉터가 발행한 'auth:logout' 이벤트를 듣고 자동 로그아웃 처리.
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:logout', handler);
    return () => window.removeEventListener('auth:logout', handler);
  }, [logout]);

  // value 객체를 useMemo 로 안정화 — 리렌더마다 새 객체가 만들어지지 않게.
  const value = useMemo(
    () => ({
      user,
      status,
      isAuthenticated: status === 'authed',
      isAdmin: user?.role === 'ADMIN',
      loading: status === 'loading',
      login,
      signup,
      logout,
    }),
    [user, status, login, signup, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
