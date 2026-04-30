import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary[500]};
  animation: ${spin} 0.8s linear infinite;
`;

export default Spinner;
