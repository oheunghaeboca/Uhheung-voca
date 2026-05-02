import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';

const H = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export default function GreetingHeader() {
  const { user } = useAuth();
  return <H>안녕하세요, {user?.nickname ?? '회원'}님 👋</H>;
}
