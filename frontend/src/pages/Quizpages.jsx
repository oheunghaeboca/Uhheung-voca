import { useState, useEffect } from "react";
import axios from "axios";

export default function QuizPage() {
    const [questions, setQuestions] = useState([]);
    const [current,   setCurrent]   = useState(0);
    const [selected,  setSelected]  = useState(null);
    const [results,   setResults]   = useState([]);
    const [done,      setDone]      = useState(false);
    const [loading,   setLoading]   = useState(true);

    useEffect(() => {
        axios.get("/api/quiz")
            .then(res => setQuestions(res.data))
            .finally(() => setLoading(false));
    }, []);

    const handleSelect = (option) => {
        if (selected !== null) return;
        const isCorrect = option === questions[current].answer;
        setSelected(option);
        setResults(prev => [...prev, {
            meaning: questions[current].meaning,
            answer:  questions[current].answer,
            chosen:  option,
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

    if (loading) return <p style={{ padding: 24 }}>문제 불러오는 중...</p>;

    if (done) {
        const score = results.filter(r => r.correct).length;
        return (
            <div style={{ padding: 24 }}>
                <h2>결과: {score} / {results.length}문제</h2>
                <p>정답률: {Math.round(score / results.length * 100)}%</p>
                <hr />
                <h3>오답 목록</h3>
                {results.filter(r => !r.correct).map((r, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                        <strong>{r.meaning}</strong> →
                        정답: <span style={{ color: "green" }}>{r.answer}</span> /
                        내 답: <span style={{ color: "red" }}>{r.chosen}</span>
                    </div>
                ))}
                <button onClick={() => window.location.reload()}>다시 풀기</button>
            </div>
        );
    }

    const q = questions[current];
    return (
        <div style={{ padding: 24 }}>
            <p style={{ color: "#888" }}>{current + 1} / {questions.length}</p>
            <h2 style={{ margin: "16px 0 24px" }}>{q.meaning}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {q.options.map(opt => {
                    let bg = "#f5f5f5";
                    if (selected) {
                        if (opt === q.answer)       bg = "#d4edda";
                        else if (opt === selected)  bg = "#f8d7da";
                    }
                    return (
                        <button
                            key={opt}
                            onClick={() => handleSelect(opt)}
                            style={{
                                padding: "14px 20px",
                                background: bg,
                                border: "1px solid #ddd",
                                borderRadius: 8,
                                fontSize: 16,
                                cursor: selected ? "default" : "pointer",
                                textAlign: "left",
                            }}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
            {selected && (
                <button
                    onClick={handleNext}
                    style={{
                        marginTop: 24,
                        padding: "12px 32px",
                        background: "#4a90e2",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        fontSize: 16,
                        cursor: "pointer",
                    }}
                >
                    {current + 1 >= questions.length ? "결과 보기" : "다음 문제 →"}
                </button>
            )}
        </div>
    );
}
s