import EmptyState from '../ui/EmptyState.jsx';

export default function WrongNoteList({ items = [] }) {
  if (!items.length) return <EmptyState message="오답이 없습니다." />;
  return (
    <ul>
      {items.map((it) => (
        <li key={it.wordId}>
          {it.english} — {it.korean} (오답 {it.wrongCount}회)
        </li>
      ))}
    </ul>
  );
}
