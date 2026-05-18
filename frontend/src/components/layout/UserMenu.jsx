import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const StreakBadge = styled.div`
  display: flex; align-items: center; gap: 4px;
  background: #FFF3E0; border: 1px solid #F6D8B8;
  border-radius: 9999px; padding: 4px 12px;
  font-size: 13px; font-weight: 700; color: #F6841F;
`;

const Greeting = styled.span`
  font-size: 13px; color: #B07040;
  strong { color: #2D1B0E; font-weight: 700; }
`;

const MyPageBtn = styled.button`
  display: flex; align-items: center; gap: 6px;
  background: none; border: 1.5px solid #F6D8B8;
  border-radius: 8px; padding: 6px 14px;
  font-size: 13px; color: #B07040; cursor: pointer;
  &:hover { border-color: #F6841F; color: #F6841F; }
`;

const LogoutBtn = styled.button`
  display: flex; align-items: center; gap: 6px;
  background: none; border: 1.5px solid #F6D8B8;
  border-radius: 8px; padding: 6px 14px;
  font-size: 13px; color: #B07040; cursor: pointer;
  &:hover { border-color: #F6841F; color: #F6841F; }
`;

export default function UserMenu() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <Wrap>
            <StreakBadge>🔥 연속 출석</StreakBadge>
            <Greeting>안녕하세요, <strong>{user?.nickname || user?.username}</strong>님</Greeting>
            <MyPageBtn onClick={() => navigate('/mypage')}>👤 마이페이지</MyPageBtn>
            <LogoutBtn onClick={() => { logout(); navigate('/login', { replace: true }); }}>
                로그아웃
            </LogoutBtn>
        </Wrap>
    );
}