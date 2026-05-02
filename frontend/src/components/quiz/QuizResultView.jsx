import QuizResultSummary from './QuizResultSummary.jsx';
import WrongAnswerList from './WrongAnswerList.jsx';

export default function QuizResultView({ result }) {
  if (!result) return null;
  return (
    <div>
      <QuizResultSummary result={result} />
      <WrongAnswerList items={result.wrongAnswers ?? []} />
    </div>
  );
}
