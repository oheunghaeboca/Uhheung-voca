import { useEffect, useState } from 'react';
import DashboardSummary from '../../components/dashboard/DashboardSummary.jsx';
import LevelProgressBars from '../../components/dashboard/LevelProgressBars.jsx';
import WeeklyScoreChart from '../../components/dashboard/WeeklyScoreChart.jsx';
import { dashboardApi } from '../../api/dashboard';

export default function StatsPage() {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    dashboardApi.summary().then(setSummary);
  }, []);
  return (
    <div>
      <h1>통계</h1>
      <DashboardSummary summary={summary} />
      <LevelProgressBars levels={summary?.levels ?? []} />
      <WeeklyScoreChart data={summary?.weekly ?? []} />
    </div>
  );
}
