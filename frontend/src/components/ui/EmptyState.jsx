import styled from 'styled-components';

const Wrap = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[10]};
  color: ${({ theme }) => theme.colors.text.muted};
`;

export default function EmptyState({ message = '항목이 없습니다.' }) {
  return <Wrap>{message}</Wrap>;
}
