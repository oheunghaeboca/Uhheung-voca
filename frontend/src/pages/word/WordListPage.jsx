import { useState } from 'react';
import WordFilterBar from '../../components/word/WordFilterBar.jsx';
import WordList from '../../components/word/WordList.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { useWords } from '../../hooks/useWords';

export default function WordListPage() {
  const [filters, setFilters] = useState({ page: 1, size: 20 });
  const { data } = useWords(filters);

  return (
    <div>
      <h1>단어 목록</h1>
      <WordFilterBar filters={filters} onChange={(f) => setFilters({ ...f, page: 1 })} />
      <WordList items={data?.items ?? data?.content ?? []} />
      <Pagination
        page={filters.page}
        totalPages={data?.totalPages ?? 1}
        onChange={(page) => setFilters((f) => ({ ...f, page }))}
      />
    </div>
  );
}
