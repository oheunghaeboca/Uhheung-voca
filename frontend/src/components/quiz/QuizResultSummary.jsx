export default function QuizResultSummary({ result }) {
    if (!result) return null;
    const percentage = Math.round(result.score);
    const passed = percentage >= 70;

    return (
        <div style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🐯</div>
                <h2 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 4 }}>퀴즈 완료!</h2>
            </div>

            <div style={{ background: "white", border: "1px solid #e5e7eb", borderRadius: 16, padding: 32, marginBottom: 24, textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                <p style={{ fontSize: 13, color: "#999", marginBottom: 8 }}>정답률</p>
                <p style={{ fontSize: 56, fontWeight: "bold", color: passed ? "#10b981" : "#FF6B35", margin: "0 0 8px" }}>{percentage}%</p>
                <p style={{ color: "#666", fontSize: 16 }}>
                    {result.totalQuestions}문제 중 <strong>{result.correctCount}문제</strong> 정답
                </p>
                {passed
                    ? <p style={{ marginTop: 12, color: "#10b981", fontWeight: "bold" }}>✅ 출석 인정!</p>
                    : <p style={{ marginTop: 12, color: "#999", fontSize: 13 }}>70% 이상 맞추면 출석이 인정됩니다</p>
                }
            </div>
        </div>
    );
}