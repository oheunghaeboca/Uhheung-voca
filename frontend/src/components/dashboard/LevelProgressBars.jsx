import ProgressBar from '../ui/ProgressBar.jsx';

export default function LevelProgressBars({ levels = [] }) {
  return (
    <div>
      {levels.map((lv) => (
        <div key={lv.name}>
          <span>{lv.name}: {lv.progress}%</span>
          <ProgressBar value={lv.progress} />
        </div>
      ))}
    </div>
  );
}
