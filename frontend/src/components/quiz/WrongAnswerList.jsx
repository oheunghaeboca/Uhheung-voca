import EmptyState from '../ui/EmptyState.jsx';

export default function WrongAnswerList({ items = [] }) {
  if (!items.length) return <EmptyState message="오답이 없습니다 🎉" />;
  return (
    <ul>
      {items.map((it, i) => (
        <li key={i}>{it.english} → {it.correctAnswer} (제출: {it.userAnswer || '-'})</li>
      ))}
    </ul>
  );
}
