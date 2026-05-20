import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LoginForm from '../../components/auth/LoginForm.jsx';
import { useAuth } from '../../hooks/useAuth';

const Wrap = styled.main`
  display: grid; place-items: center; min-height: 100%;
  padding: ${({ theme }) => theme.spacing[10]};
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (form) => {
    // TODO: 에러 토스트 — Vibe Coding 시 채울 것
    await login(form);
    navigate('/dashboard', { replace: true });
  };

  return (
    <Wrap>
      <h1>어흥해보카</h1>
      <LoginForm onSubmit={handleSubmit} />
    </Wrap>
  );
}
