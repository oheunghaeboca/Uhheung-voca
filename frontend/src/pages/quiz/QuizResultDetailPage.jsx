import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import QuizResultSummary from '../../components/quiz/QuizResultSummary.jsx';
import WrongAnswerList from '../../components/quiz/WrongAnswerList.jsx';
import { quizApi } from '../../api/quiz';

export default function QuizResultDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) return;
    quizApi.result(id).then(setData);
  }, [id]);

  return (
    <div>
      <QuizResultSummary result={data} />
      <WrongAnswerList items={data?.wrongAnswers ?? []} />
    </div>
  );
}
