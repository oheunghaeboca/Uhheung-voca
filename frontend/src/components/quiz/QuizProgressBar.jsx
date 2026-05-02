import ProgressBar from '../ui/ProgressBar.jsx';

export default function QuizProgressBar({ current = 0, total = 0 }) {
  const value = total > 0 ? ((current + 1) / total) * 100 : 0;
  return (
    <div>
      <span>{current + 1} / {total}</span>
      <ProgressBar value={value} />
    </div>
  );
}
