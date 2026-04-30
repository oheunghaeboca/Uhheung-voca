import styled from 'styled-components';

const Bar = styled.div`
  display: flex; gap: ${({ theme }) => theme.spacing[2]};
`;

export default function RankingFilterBar({ filters, onChange }) {
  // TODO: type / period 토글 — Vibe Coding 시 채울 것
  return (
    <Bar>
      <select value={filters?.period ?? 'WEEKLY'} onChange={(e) => onChange?.({ ...filters, period: e.target.value })}>
        <option value="WEEKLY">주간</option>
        <option value="MONTHLY">월간</option>
        <option value="ALL">전체</option>
      </select>
    </Bar>
  );
}
