import { useState } from 'react';

export function useQuizSession() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // TODO: start, answer(index, value), next, prev, submit — Vibe Coding 시 채울 것
  return {
    questions, setQuestions,
    answers, setAnswers,
    currentIndex, setCurrentIndex,
  };
}
