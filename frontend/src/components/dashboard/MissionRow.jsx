import ProgressBar from '../ui/ProgressBar.jsx';

export default function MissionRow({ label, value, target }) {
  const ratio = target > 0 ? Math.min(100, (value / target) * 100) : 0;
  return (
    <div>
      <span>{label}: {value} / {target}</span>
      <ProgressBar value={ratio} />
    </div>
  );
}
