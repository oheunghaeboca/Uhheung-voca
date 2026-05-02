import { useState } from 'react';
import QuizStartModal from '../../components/quiz/QuizStartModal.jsx';
import QuizPlayView from '../../components/quiz/QuizPlayView.jsx';
import QuizResultView from '../../components/quiz/QuizResultView.jsx';

export default function QuizPage() {
  const [mode, setMode] = useState('start'); // start | play | result
  // TODO: useQuizSession 연동, start/submit API 호출 — Vibe Coding 시 채울 것
  return (
    <div>
      {mode === 'start' && <QuizStartModal open onStart={() => setMode('play')} />}
      {mode === 'play' && <QuizPlayView />}
      {mode === 'result' && <QuizResultView />}
    </div>
  );
}
