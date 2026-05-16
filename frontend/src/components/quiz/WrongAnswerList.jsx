import EmptyState from '../ui/EmptyState.jsx';

export default function WrongAnswerList({ items = [] }) {
  if (!items.length) return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>
        <EmptyState message="오답이 없습니다 🎉" />
      </div>
  );

  return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 24px" }}>
        <h3 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 16 }}>오답 목록</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map((it, i) => (
              <div key={i} style={{
                border: "1px solid #fecdd3", borderRadius: 12, padding: "16px 20px",
                background: "#fff1f2", display: "flex", alignItems: "center", gap: 16
              }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fecdd3", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  ❌
                </div>
                <div>
                  <p style={{ fontWeight: "bold", marginBottom: 4, color: "#1f2937" }}>{it.correctAnswer}</p>
                  <p style={{ fontSize: 13, color: "#ef4444" }}>내 답: {it.userAnswer || "-"}</p>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
}