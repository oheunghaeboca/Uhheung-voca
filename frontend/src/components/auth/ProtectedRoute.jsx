import { Navigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../hooks/useAuth';

/**
 * 인증이 필요한 라우트를 감싸는 게이트.
 *
 * status 별 동작:
 *   - 'loading' : 부팅 중 me() 응답을 기다린다. 빈 화면 대신 작은 스피너 노출.
 *   - 'authed'  : children 렌더.
 *   - 그 외     : /login 으로 리다이렉트. state.from 으로 원래 가려던 경로를 전달해
 *                 로그인 후 그 경로로 돌려보낼 수 있게 한다.
 */
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const Center = styled.div`
  display: grid;
  place-items: center;
  min-height: 100vh;
  gap: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.text.muted};
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary[500]};
  animation: ${spin} 800ms linear infinite;
`;

export default function ProtectedRoute({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return (
      <Center>
        <Spinner />
        <span>불러오는 중...</span>
      </Center>
    );
  }

  if (status !== 'authed') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
