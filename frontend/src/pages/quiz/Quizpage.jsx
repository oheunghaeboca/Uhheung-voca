import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { quizApi } from "../../api/quiz";
import { AuthContext } from "../../contexts/AuthContext";

export default function QuizPage() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [quizType, setQuizType] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!quizType) return;
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/quizzes?type=${quizType}`);
        setQuestions(res.data.questions);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizType]);

  const handleSelect = (option) => {
    setSelected(option);
    const isCorrect = option === questions[current].correctAnswer;
    setResults(prev => {
      const updated = [...prev];
      updated[current] = {
        prompt: questions[current].prompt,
        correctAnswer: questions[current].correctAnswer,
        chosen: option,
        correct: isCorrect,
      };
      return updated;
    });
  };

  const handleNext = async () => {
    if (!selected) return;
    if (current + 1 >= questions.length) {
      const finalResults = [...results];
      finalResults[current] = {
        prompt: questions[current].prompt,
        correctAnswer: questions[current].correctAnswer,
        chosen: selected,
        correct: selected === questions[current].correctAnswer,
      };
      const correctCount = finalResults.filter(r => r.correct).length;
      try {
        const saved = await quizApi.saveResult({
          userId: user?.id,
          quizType: quizType,
          totalQuestions: questions.length,
          correctCount: correctCount,
          score: Math.round(correctCount / questions.length * 100),
          details: questions.map((q, i) => ({
            wordId: q.wordId,
            questionNumber: q.questionNumber,
            userAnswer: finalResults[i]?.chosen ?? "",
            correctAnswer: q.correctAnswer,
            isCorrect: finalResults[i]?.correct ?? false,
          }))
        });
        navigate(`/quiz/results/${saved.quizResultId}`);
      } catch {
        setDone(true);
      }
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  };

  const reset = () => {
    setQuizType(null);
    setQuestions([]);
    setCurrent(0);
    setSelected(null);
    setResults([]);
    setDone(false);
  };

  if (!quizType) {
    return (
        <div style={{ minHeight: "100vh", background: "#fff", padding: 16 }}>
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
              <button onClick={() => window.history.back()} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#666" }}>
                ← 나가기
              </button>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: "bold", color: "#FF6B35" }}>
                🐯 퀴즈
              </div>
              <div style={{ width: 60 }} />
            </div>

            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: "32px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <h2 style={{ textAlign: "center", fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>퀴즈 유형 선택</h2>
              <p style={{ textAlign: "center", color: "#999", marginBottom: 32, fontSize: 14 }}>원하는 퀴즈 유형을 선택하세요</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div onClick={() => setQuizType("MEANING_TO_WORD")}
                     style={{ border: "2px solid #e5e7eb", borderRadius: 12, padding: "24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}
                     onMouseEnter={e => e.currentTarget.style.borderColor = "#FF6B35"}
                     onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: "#fff5f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: "bold", color: "#FF6B35" }}>한</div>
                  <span style={{ color: "#999", fontSize: 18 }}>→</span>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: "bold", color: "#3b82f6" }}>A</div>
                  <div style={{ marginLeft: 8 }}>
                    <div style={{ fontWeight: "bold", marginBottom: 4 }}>뜻 보고 영어 맞히기</div>
                    <div style={{ fontSize: 13, color: "#999" }}>한국어 뜻을 보고 영어 단어를 선택합니다</div>
                  </div>
                </div>

                <div onClick={() => setQuizType("WORD_TO_MEANING")}
                     style={{ border: "2px solid #e5e7eb", borderRadius: 12, padding: "24px", cursor: "pointer", display: "flex", alignItems: "center", gap: 16 }}
                     onMouseEnter={e => e.currentTarget.style.borderColor = "#FF6B35"}
                     onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: "bold", color: "#3b82f6" }}>A</div>
                  <span style={{ color: "#999", fontSize: 18 }}>→</span>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: "#fff5f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: "bold", color: "#FF6B35" }}>한</div>
                  <div style={{ marginLeft: 8 }}>
                    <div style={{ fontWeight: "bold", marginBottom: 4 }}>영어 보고 뜻 맞히기</div>
                    <div style={{ fontSize: 13, color: "#999" }}>영어 단어를 보고 한국어 뜻을 선택합니다</div>
                  </div>
                </div>
              </div>
              <p style={{ textAlign: "center", fontSize: 13, color: "#999", marginTop: 24 }}>총 20문제가 출제됩니다</p>
            </div>
          </div>
        </div>
    );
  }

  if (loading) return (
      <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", color: "#999" }}>
        로딩 중...
      </div>
  );

  if (done) {
    const score = results.filter(r => r.correct).length;
    return (
        <div style={{ minHeight: "100vh", background: "#fff", padding: 16 }}>
          <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center", paddingTop: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🐯</div>
            <h2 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8 }}>퀴즈 완료!</h2>
            <p style={{ fontSize: 48, fontWeight: "bold", color: "#FF6B35", margin: "16px 0" }}>
              {Math.round(score / results.length * 100)}점
            </p>
            <p style={{ color: "#666", marginBottom: 32 }}>{results.length}문제 중 {score}문제 정답</p>
            <button onClick={reset} style={{ width: "100%", maxWidth: 400, padding: 16, background: "#FF6B35", color: "white", border: "none", borderRadius: 12, fontSize: 16, fontWeight: "bold", cursor: "pointer" }}>
              다시 풀기
            </button>
          </div>
        </div>
    );
  }

  if (!questions.length) return <p>단어 데이터가 없습니다.</p>;

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
      <div style={{ minHeight: "100vh", background: "#fff", padding: 16 }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <button onClick={reset} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#666" }}>
              ← 나가기
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: "bold", color: "#FF6B35" }}>
              🐯 퀴즈
              <span style={{ background: "#fff5f2", color: "#FF6B35", fontSize: 12, padding: "2px 8px", borderRadius: 20, fontWeight: "normal" }}>
                            {quizType === "MEANING_TO_WORD" ? "한→영" : "영→한"}
                        </span>
            </div>
            <div style={{ fontSize: 14, color: "#666" }}>
              <span style={{ fontWeight: "bold", color: "#333" }}>{current + 1}</span> / {questions.length}
            </div>
          </div>

          <div style={{ width: "100%", height: 8, background: "#f1f3f5", borderRadius: 4, marginBottom: 32 }}>
            <div style={{ height: "100%", background: "#FF6B35", borderRadius: 4, width: `${progress}%`, transition: "width 0.3s" }} />
          </div>

          <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#999", marginBottom: 16 }}>
              {quizType === "MEANING_TO_WORD" ? "다음 뜻에 해당하는 영단어는?" : "다음 영단어의 뜻은?"}
            </p>
            <h2 style={{ fontSize: 32, fontWeight: "bold", color: "#FF6B35", margin: 0 }}>{q.prompt}</h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
              {q.choices.map((opt, index) => (
                  <button key={opt} onClick={() => handleSelect(opt)}
                          style={{
                            display: "flex", alignItems: "center", gap: 12,
                            width: "100%", padding: "16px 20px",
                            border: `2px solid ${selected === opt ? "#FF6B35" : "#e5e7eb"}`,
                            borderRadius: 12,
                            background: selected === opt ? "#fff5f2" : "white",
                            cursor: "pointer", fontSize: 16, textAlign: "left",
                            transition: "all 0.2s"
                          }}>
                                <span style={{
                                  width: 32, height: 32, borderRadius: "50%",
                                  background: selected === opt ? "#FF6B35" : "#f1f3f5",
                                  color: selected === opt ? "white" : "#666",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: 14, fontWeight: "bold", flexShrink: 0
                                }}>{index + 1}</span>
                    {opt}
                  </button>
              ))}
            </div>
          </div>

          <button onClick={handleNext} disabled={!selected}
                  style={{
                    width: "100%", padding: 16,
                    background: selected ? "#FF6B35" : "#ccc",
                    color: "white", border: "none", borderRadius: 12,
                    fontSize: 16, fontWeight: "bold",
                    cursor: selected ? "pointer" : "not-allowed"
                  }}>
            {current + 1 >= questions.length ? "결과 보기" : "다음 문제"}
          </button>
        </div>
      </div>
  );
}