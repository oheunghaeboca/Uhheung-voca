import styled from 'styled-components';

const Bar = styled.div`
  display: flex; gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export default function WordFilterBar({ filters, onChange }) {
  // TODO: level / type / keyword 필터 — Vibe Coding 시 채울 것
  return (
    <Bar>
      <input
        placeholder="검색어"
        value={filters?.keyword ?? ''}
        onChange={(e) => onChange?.({ ...filters, keyword: e.target.value })}
      />
    </Bar>
  );
}
