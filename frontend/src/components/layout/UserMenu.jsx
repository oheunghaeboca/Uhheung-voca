import styled from 'styled-components';
import { useAuth } from '../../hooks/useAuth';

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export default function UserMenu() {
  const { user, logout } = useAuth();
  // TODO: 드롭다운(내 정보 / 로그아웃) — Vibe Coding 시 채울 것
  return (
    <Wrap>
      <span>{user?.nickname}</span>
      <button type="button" onClick={logout}>로그아웃</button>
    </Wrap>
  );
}
