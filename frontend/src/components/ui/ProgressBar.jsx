import styled from 'styled-components';

const Track = styled.div`
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.full};
  overflow: hidden;
`;
const Fill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary[500]};
  width: ${({ $value }) => `${Math.min(Math.max($value, 0), 100)}%`};
  transition: width ${({ theme }) => theme.transition.normal};
`;

export default function ProgressBar({ value = 0 }) {
  return <Track><Fill $value={value} /></Track>;
}
