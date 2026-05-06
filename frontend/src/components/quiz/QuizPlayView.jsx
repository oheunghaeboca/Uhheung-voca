import QuizQuestion from './QuizQuestion.jsx';
import QuizProgressBar from './QuizProgressBar.jsx';

export default function QuizPlayView({ session }) {
  // TODO: useQuizSession 연동 — Vibe Coding 시 채울 것
  return (
    <div>
      <QuizProgressBar current={session?.currentIndex ?? 0} total={session?.questions?.length ?? 0} />
      <QuizQuestion question={session?.questions?.[session?.currentIndex]} />
    </div>
  );
}
