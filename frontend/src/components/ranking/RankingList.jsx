import RankingRow from './RankingRow.jsx';
import EmptyState from '../ui/EmptyState.jsx';

export default function RankingList({ items = [], myUserId }) {
  if (!items.length) return <EmptyState message="랭킹 데이터가 없습니다." />;
  return (
    <ol>
      {items.map((row) => (
        <RankingRow key={row.userId} row={row} isMe={row.userId === myUserId} />
      ))}
    </ol>
  );
}
