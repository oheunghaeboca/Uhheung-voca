import { useEffect, useState } from 'react';
import QuizResultRow from '../../components/quiz/QuizResultRow.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { quizApi } from '../../api/quiz';

export default function QuizResultListPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    quizApi.results().then((res) => setItems(res?.items ?? res?.content ?? []));
  }, []);

  if (!items.length) return <EmptyState message="퀴즈 기록이 없습니다." />;
  return (
    <ul>{items.map((row) => <li key={row.id}><QuizResultRow row={row} /></li>)}</ul>
  );
}
