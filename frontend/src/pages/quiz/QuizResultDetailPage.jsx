import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizResultSummary from '../../components/quiz/QuizResultSummary.jsx';
import WrongAnswerList from '../../components/quiz/WrongAnswerList.jsx';
import { quizApi } from '../../api/quiz';

export default function QuizResultDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div style={{ textAlign: "center", padding: 40, color: "#999" }}>불러오는 중...</div>;
  if (error) return <div role="alert" style={{ textAlign: "center", padding: 40, color: "#ef4444" }}>{error}</div>;
  if (!data) return null;

  const wrongAnswers = (data.details ?? []).filter((d) => !d.isCorrect);

  return (
      <div>
        <QuizResultSummary result={data} />
        <WrongAnswerList items={wrongAnswers} />

        {/* 버튼 영역 */}
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 40px", display: "flex", flexDirection: "column", gap: 12 }}>
          <button
              onClick={() => navigate('/quiz')}
              style={{ width: "100%", padding: 16, background: "#FF6B35", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: "bold", cursor: "pointer" }}>
            다시 풀기
          </button>
          <button
              onClick={() => navigate('/dashboard')}
              style={{ width: "100%", padding: 16, background: "white", color: "#374151", border: "2px solid #e5e7eb", borderRadius: 12, fontSize: 16, fontWeight: "bold", cursor: "pointer" }}>
            홈으로
          </button>
        </div>
      </div>
  );
}