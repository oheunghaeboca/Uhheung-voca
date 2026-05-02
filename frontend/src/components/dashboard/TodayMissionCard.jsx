import Card from '../ui/Card.jsx';
import MissionRow from './MissionRow.jsx';

export default function TodayMissionCard({ mission }) {
  if (!mission) return null;
  return (
    <Card>
      <h3>오늘의 미션</h3>
      <MissionRow label="단어 학습" value={mission.wordsStudied} target={10} />
      <MissionRow label="퀴즈 응시" value={mission.quizzesTaken} target={1} />
      <MissionRow label="최고 점수" value={Number(mission.highestScore ?? 0)} target={70} />
    </Card>
  );
}
