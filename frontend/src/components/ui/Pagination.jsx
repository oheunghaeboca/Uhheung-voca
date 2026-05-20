import styled from 'styled-components';

const Wrap = styled.div`
  display: flex; gap: ${({ theme }) => theme.spacing[2]};
  justify-content: center; align-items: center;
`;

export default function Pagination({ page, totalPages, onChange }) {
  // TODO: 1..N 번호 + 이전/다음 — Vibe Coding 시 채울 것
  return (
    <Wrap>
      <button type="button" disabled={page <= 1} onClick={() => onChange?.(page - 1)}>이전</button>
      <span>{page} / {totalPages}</span>
      <button type="button" disabled={page >= totalPages} onClick={() => onChange?.(page + 1)}>다음</button>
    </Wrap>
  );
}
