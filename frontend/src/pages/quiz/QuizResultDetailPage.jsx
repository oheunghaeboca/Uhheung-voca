import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QuizResultSummary from '../../components/quiz/QuizResultSummary.jsx';
import WrongAnswerList from '../../components/quiz/WrongAnswerList.jsx';
import { quizApi } from '../../api/quiz';

export default function QuizResultDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    quizApi
      .result(id)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err?.response?.status;
        setError(status === 404 ? '해당 퀴즈 결과를 찾을 수 없습니다.' : '결과를 불러오지 못했습니다.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div>불러오는 중...</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!data) return null;

  // Backend returns full per-question list in `details`; UI shows wrong ones only.
  const wrongAnswers = (data.details ?? []).filter((d) => !d.isCorrect);

  return (
    <div>
      <QuizResultSummary result={data} />
      <WrongAnswerList items={wrongAnswers} />
    </div>
  );
}