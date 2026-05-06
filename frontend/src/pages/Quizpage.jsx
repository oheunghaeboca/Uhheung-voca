import { useState, useEffect } from "react";
import axios from "axios";

export default function QuizPage() {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [results, setResults] = useState([]);
    const [done, setDone] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/quizzes")
            .then(res => setQuestions(res.data.questions))
            .finally(() => setLoading(false));
    }, []);

    const handleSelect = (option) => {
        if (selected !== null) return;
        const isCorrect = option === questions[current].correctAnswer;
        setSelected(option);
        setResults(prev => [...prev, {
            prompt: questions[current].prompt,
            correctAnswer: questions[current].correctAnswer,
            chosen: option,
            correct: isCorrect,
        }]);
    };

    const handleNext = () => {
        if (current + 1 >= questions.length) {
            setDone(true);
        } else {
            setCurrent(c => c + 1);
            setSelected(null);
        }
    };

    if (loading) return <p>문제 불러오는 중...</p>;

    if (done) {
        const score = results.filter(r => r.correct).length;
        return (
            <div>
                <h2>결과: {score} / {results.length}문제</h2>
                <p>정답률: {Math.round(score / results.length * 100)}%</p>
                <button onClick={() => window.location.reload()}>다시 풀기</button>
            </div>
        );
    }

    if (!questions.length) return <p>단어 데이터가 없습니다.</p>;

    const q = questions[current];
    return (
        <div>
            <p>{current + 1} / {questions.length}</p>
            <h2>{q.prompt}</h2>
            <div>
                {q.choices.map(opt => (
                    <button key={opt} onClick={() => handleSelect(opt)}>
                        {opt}
                    </button>
                ))}
            </div>
            {selected && (
                <button onClick={handleNext}>
                    {current + 1 >= questions.length ? "결과 보기" : "다음 문제"}
                </button>
            )}
        </div>
    );
}