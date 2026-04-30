import styled from 'styled-components';

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(7, 1fr);
  gap: ${({ theme }) => theme.spacing[1]};
`;
const Cell = styled.div`
  aspect-ratio: 1 / 1;
  background: ${({ theme, $on }) => ($on ? theme.colors.primary[500] : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radius.sm};
`;

export default function MonthAttendanceGrid({ days = [] }) {
  // TODO: 월별 출석 그리드 — Vibe Coding 시 채울 것
  return (
    <Grid>
      {days.map((d, i) => <Cell key={i} $on={d.attended} title={d.date} />)}
    </Grid>
  );
}
