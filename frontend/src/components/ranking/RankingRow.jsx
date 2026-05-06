export default function RankingRow({ row, isMe = false }) {
  if (!row) return null;
  const medal = row.rank === 1 ? '🥇' : row.rank === 2 ? '🥈' : row.rank === 3 ? '🥉' : `#${row.rank}`;
  return (
    <li style={{ fontWeight: isMe ? 700 : 400 }}>
      {medal} {row.nickname} — {String(row.score)}
    </li>
  );
}
