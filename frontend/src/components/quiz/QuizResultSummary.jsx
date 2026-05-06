import Card from '../ui/Card.jsx';

export default function QuizResultSummary({ result }) {
  if (!result) return null;
  return (
    <Card>
      <h3>결과</h3>
      <p>점수: {String(result.score)}</p>
      <p>정답 {result.correctCount} / {result.totalQuestions}</p>
    </Card>
  );
}
