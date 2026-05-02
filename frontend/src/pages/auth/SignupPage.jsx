import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SignupForm from '../../components/auth/SignupForm.jsx';
import { authApi } from '../../api/auth';

const Wrap = styled.main`
  display: grid; place-items: center; min-height: 100%;
  padding: ${({ theme }) => theme.spacing[10]};
`;

export default function SignupPage() {
  const navigate = useNavigate();

  const handleSubmit = async (form) => {
    // TODO: 에러 토스트, 중복 username 처리 — Vibe Coding 시 채울 것
    await authApi.signup(form);
    navigate('/login', { replace: true });
  };

  return (
    <Wrap>
      <h1>회원가입</h1>
      <SignupForm onSubmit={handleSubmit} />
    </Wrap>
  );
}
