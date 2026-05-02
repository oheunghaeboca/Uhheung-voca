import styled from 'styled-components';

const Tag = styled.span`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  font-size: ${({ theme }) => theme.fontSize.xs};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme, $bg }) => $bg ?? theme.colors.primary[100]};
  color: ${({ theme, $color }) => $color ?? theme.colors.primary[700]};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

export default function WordTag({ kind, value, children }) {
  // TODO: kind('level' | 'type') + value 별 색 매핑 — Vibe Coding 시 채울 것
  return <Tag>{children ?? value}</Tag>;
}
