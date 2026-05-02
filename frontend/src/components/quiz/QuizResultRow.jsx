import { Link } from 'react-router-dom';

export default function QuizResultRow({ row }) {
  if (!row) return null;
  return (
    <Link to={`/quiz/results/${row.id}`}>
      {row.submittedAt} · {row.quizType} · {row.correctCount}/{row.totalQuestions}
    </Link>
  );
}
