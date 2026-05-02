import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

const Nav = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing[5]};
`;
const Item = styled(NavLink)`
  color: ${({ theme }) => theme.colors.text.secondary};
  &.active { color: ${({ theme }) => theme.colors.primary[500]}; font-weight: ${({ theme }) => theme.fontWeight.medium}; }
`;

const ITEMS = [
  { to: '/dashboard', label: '대시보드' },
  { to: '/words', label: '단어' },
  { to: '/quiz', label: '퀴즈' },
  { to: '/bookmarks', label: '북마크' },
  { to: '/wrong-notes', label: '오답노트' },
  { to: '/stats', label: '통계' },
  { to: '/ranking', label: '랭킹' },
];

export default function NavMenu() {
  return (
    <Nav>
      {ITEMS.map((it) => <Item key={it.to} to={it.to}>{it.label}</Item>)}
    </Nav>
  );
}
