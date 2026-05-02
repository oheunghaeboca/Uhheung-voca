import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Card from '../../components/ui/Card.jsx';
import LoginForm from '../../components/auth/LoginForm.jsx';
import SignupForm from '../../components/auth/SignupForm.jsx';
import { useAuth } from '../../hooks/useAuth';

/**
 * 로그인/회원가입 카드 페이지.
 *
 * 한 카드 안에서 탭으로 두 폼을 토글한다 — 시안의 login-screen.tsx 와 동일한 형태.
 * 시안의 데모 로그인(학습자/관리자)/admin 동선은 이번 범위에서 제외.
 *
 * 흐름:
 *  - 로그인 성공 → location.state.from 으로 돌려보냄(보호 라우트로 가던 도중 막혔다면
 *    다시 그 경로로). 없으면 /dashboard.
 *  - 회원가입 성공 → AuthContext.signup 이 자동 로그인까지 처리 → /dashboard.
 *  - 실패 → 서버 에러 메시지 우선, 네트워크 오류는 별도 한국어 메시지.
 */
const Wrap = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[50]} 0%,
    ${({ theme }) => theme.colors.bg} 60%
  );
`;

const Shell = styled.div`
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const BackLink = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSize.sm};
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

const StyledCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing[8]};
  box-shadow: ${({ theme }) => theme.shadow.lg};
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Logo = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[600]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.radius.full};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Tabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  background: ${({ theme }) => theme.colors.bg};
  padding: ${({ theme }) => theme.spacing[1]};
  border-radius: ${({ theme }) => theme.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing[5]};
`;

const Tab = styled.button`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: none;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ $active, theme }) => ($active ? theme.colors.surface : 'transparent')};
  color: ${({ $active, theme }) => ($active ? theme.colors.primary[600] : theme.colors.text.secondary)};
  font-weight: ${({ $active, theme }) => ($active ? theme.fontWeight.bold : theme.fontWeight.medium)};
  cursor: pointer;
  box-shadow: ${({ $active, theme }) => ($active ? theme.shadow.sm : 'none')};
  transition: all ${({ theme }) => theme.transition.fast};
`;

// 서버 에러를 사용자용 한국어 메시지로 변환.
function extractErrorMessage(err) {
  if (!err) return '요청 처리 중 오류가 발생했습니다.';
  if (err.message === 'Network Error' || err.code === 'ERR_NETWORK') {
    return '서버에 연결할 수 없습니다. 백엔드가 실행 중인지 확인해주세요.';
  }
  if (err.code === 'ECONNABORTED') {
    return '응답 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.';
  }
  const serverMessage = err.response?.data?.message;
  if (serverMessage) return serverMessage;
  if (err.response?.status === 401) return '아이디 또는 비밀번호가 올바르지 않습니다.';
  return '요청 처리 중 오류가 발생했습니다.';
}

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const switchMode = (next) => {
    setMode(next);
    setServerError('');
  };

  const handleLogin = async (creds) => {
    setServerError('');
    setSubmitting(true);
    try {
      await login(creds);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setServerError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (form) => {
    setServerError('');
    setSubmitting(true);
    try {
      await signup(form);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Wrap>
      <Shell>
        <BackLink type="button" onClick={() => navigate('/')}>← 처음으로</BackLink>
        <StyledCard>
          <Header>
            <Logo>
              <span role="img" aria-label="tiger">🐯</span>
              <span>어흥해보카</span>
            </Logo>
            <Title>{mode === 'login' ? '로그인' : '회원가입'}</Title>
            <Subtitle>
              {mode === 'login'
                ? '계정에 로그인하여 학습을 시작하세요'
                : '새 계정을 만들어 학습을 시작하세요'}
            </Subtitle>
          </Header>

          <Tabs role="tablist">
            <Tab
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              $active={mode === 'login'}
              onClick={() => switchMode('login')}
            >
              로그인
            </Tab>
            <Tab
              type="button"
              role="tab"
              aria-selected={mode === 'signup'}
              $active={mode === 'signup'}
              onClick={() => switchMode('signup')}
            >
              회원가입
            </Tab>
          </Tabs>

          {mode === 'login' ? (
            <LoginForm
              onSubmit={handleLogin}
              submitting={submitting}
              errorMessage={serverError}
            />
          ) : (
            <SignupForm
              onSubmit={handleSignup}
              submitting={submitting}
              errorMessage={serverError}
            />
          )}
        </StyledCard>
      </Shell>
    </Wrap>
  );
}
