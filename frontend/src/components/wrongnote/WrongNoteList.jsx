import styled from 'styled-components';

export default function WrongNoteList({ items = [] }) {
  if (!items.length) {
    return (
      <EmptyBox>
        <EmptyEmoji>🎉</EmptyEmoji>
        <EmptyTitle>오답이 없어요!</EmptyTitle>
        <EmptySub>퀴즈를 풀어 틀린 단어가 자동으로 여기에 모입니다.</EmptySub>
      </EmptyBox>
    );
  }

  return (
    <List>
      {items.map((it) => (
        <Item key={it.wordId}>
          <Main>
            <English>{it.english}</English>
            <Korean>{it.korean}</Korean>
          </Main>
          <Meta>
            <WrongBadge>오답 {Number(it.wrongCount ?? 0)}회</WrongBadge>
            {it.lastWrongAt && <LastAt>마지막 {formatDate(it.lastWrongAt)}</LastAt>}
          </Meta>
        </Item>
      ))}
    </List>
  );
}

// "2026-05-26T13:24:18" → "5/26"
function formatDate(iso) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getMonth() + 1}/${d.getDate()}`;
  } catch {
    return '';
  }
}

const List = styled.ul`
  list-style: none; padding: 0; margin: 0;
  display: flex; flex-direction: column; gap: 10px;
`;

const Item = styled.li`
  background: #fff; border: 1.5px solid #F6D8B8; border-radius: 14px;
  padding: 16px 20px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  transition: transform .15s, box-shadow .15s;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 18px rgba(216,106,12,.10); }
`;

const Main = styled.div`
  display: flex; flex-direction: column; gap: 4px; min-width: 0;
`;
const English = styled.div`
  font-size: 18px; font-weight: 800; color: #2D1B0E;
  word-break: break-all;
`;
const Korean = styled.div`
  font-size: 14px; color: #5C3A1A;
`;

const Meta = styled.div`
  display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
  flex-shrink: 0;
`;
const WrongBadge = styled.span`
  font-size: 12px; font-weight: 700; color: #DC2626;
  background: #FEE2E2; border-radius: 9999px;
  padding: 4px 10px;
`;
const LastAt = styled.span`
  font-size: 11px; color: #B07040;
`;

const EmptyBox = styled.div`
  text-align: center; padding: 48px 24px;
  background: #fff; border: 1.5px dashed #F6D8B8; border-radius: 16px;
`;
const EmptyEmoji = styled.div`font-size: 48px; margin-bottom: 12px;`;
const EmptyTitle = styled.p`font-size: 17px; font-weight: 800; color: #2D1B0E; margin-bottom: 6px;`;
const EmptySub = styled.p`font-size: 13px; color: #B07040;`;
