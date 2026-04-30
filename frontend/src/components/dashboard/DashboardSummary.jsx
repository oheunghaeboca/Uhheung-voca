import Card from '../ui/Card.jsx';

export default function DashboardSummary({ summary }) {
  if (!summary) return null;
  return (
    <Card>
      <h3>종합</h3>
      <p>총 퀴즈: {summary.totalQuizzes}</p>
      <p>평균 점수: {String(summary.averageScore)}</p>
      <p>학습 단어: {summary.totalWordsStudied}</p>
      <p>연속 출석: {summary.currentStreak}일</p>
    </Card>
  );
}
