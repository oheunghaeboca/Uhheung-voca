import styled from 'styled-components';
import { Link } from 'react-router-dom';
import NavMenu from './NavMenu.jsx';
import UserMenu from './UserMenu.jsx';

const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[10]};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.z.sticky};
`;
const Logo = styled(Link)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.primary[500]};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

export default function Header() {
  return (
    <Bar>
      <Logo to="/dashboard">어흥해보카</Logo>
      <NavMenu />
      <UserMenu />
    </Bar>
  );
}
