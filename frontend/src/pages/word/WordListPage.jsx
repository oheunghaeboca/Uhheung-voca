import { useState } from 'react';
import WordFilterBar from '../../components/word/WordFilterBar.jsx';
import WordList from '../../components/word/WordList.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { useWords } from '../../hooks/useWords';

export default function WordListPage() {
  const [filters, setFilters] = useState({ page: 1, size: 20 });
  const { data } = useWords(filters);

  const words = Array.isArray(data) ? data : data?.items ?? data?.content ?? [];
  const totalPages = Array.isArray(data) ? 1 : data?.totalPages ?? 1;

  return (
    <div>
      <h1>단어 목록</h1>
      <WordFilterBar filters={filters} onChange={(f) => setFilters({ ...f, page: 1 })} />
      <WordList items={words} />
      <Pagination
        page={filters.page}
        totalPages={totalPages}
        onChange={(page) => setFilters((f) => ({ ...f, page }))}
      />
    </div>
  );
}
