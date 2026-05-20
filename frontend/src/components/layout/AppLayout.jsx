import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;
const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[6]} ${({ theme }) => theme.spacing[10]};
`;

export default function AppLayout() {
  return (
    <Shell>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Shell>
  );
}
