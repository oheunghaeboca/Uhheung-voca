import GreetingHeader from '../../components/dashboard/GreetingHeader.jsx';
import TodayMissionCard from '../../components/dashboard/TodayMissionCard.jsx';
import QuickAccessButtons from '../../components/dashboard/QuickAccessButtons.jsx';

export default function DashboardPage() {
  // TODO: 미션 / 주간 점수 / 월간 출석 데이터 패칭 — Vibe Coding 시 채울 것
  return (
    <div>
      <GreetingHeader />
      <TodayMissionCard />
      <QuickAccessButtons />
    </div>
  );
}
