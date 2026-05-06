import styled from 'styled-components';

const Bar = styled.footer`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[10]};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;

export default function Footer() {
  return <Bar>© 어흥해보카 — SMU 소공 5조</Bar>;
}
