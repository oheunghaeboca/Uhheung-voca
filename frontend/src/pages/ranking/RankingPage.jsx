import { useEffect, useState } from 'react';
import RankingFilterBar from '../../components/ranking/RankingFilterBar.jsx';
import RankingList from '../../components/ranking/RankingList.jsx';
import { rankingApi } from '../../api/ranking';
import { useAuth } from '../../hooks/useAuth';

export default function RankingPage() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ period: 'WEEKLY', size: 20 });
  const [items, setItems] = useState([]);

  useEffect(() => {
    rankingApi.list(filters).then((res) => setItems(res?.items ?? res ?? []));
  }, [filters.period, filters.type, filters.size]);

  return (
    <div>
      <h1>랭킹</h1>
      <RankingFilterBar filters={filters} onChange={setFilters} />
      <RankingList items={items} myUserId={user?.userId} />
    </div>
  );
}
