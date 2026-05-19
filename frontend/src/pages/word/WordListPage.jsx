import { useState } from 'react';
import styled from 'styled-components';
import WordFilterBar from '../../components/word/WordFilterBar.jsx';
import WordList from '../../components/word/WordList.jsx';
import WordFormModal from '../../components/word/WordFormModal.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { useWords } from '../../hooks/useWords';
import { useAuth } from '../../hooks/useAuth';
import { wordsApi } from '../../api/words';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const AddButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.inverse};
  background: ${({ theme }) => theme.colors.primary[500]};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }
`;

const StatusText = styled.p`
  color: ${({ theme, $error }) => $error ? theme.colors.error : theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSize.sm};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

const LevelTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const LevelTab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 18px;
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1.5px solid ${({ $active, theme }) => $active ? theme.colors.primary[500] : theme.colors.border};
  background: ${({ $active, theme }) => $active ? theme.colors.primary[500] : theme.colors.surface};
  color: ${({ $active, theme }) => $active ? theme.colors.text.inverse : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    color: ${({ $active, theme }) => $active ? theme.colors.text.inverse : theme.colors.primary[500]};
  }
`;

const LevelTabCount = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $active, theme }) => $active ? 'rgba(255,255,255,0.25)' : theme.colors.primary[50]};
  color: ${({ $active, theme }) => $active ? theme.colors.text.inverse : theme.colors.primary[600]};
`;

const LEVEL_TABS = [
  { label: '전체', value: null },
  { label: '기초', value: 'BASIC' },
  { label: '빈출', value: 'FREQUENT' },
  { label: '고급', value: 'ADVANCED' },
];

export default function WordListPage() {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState({ page: 1, size: 20 });
  const [version, setVersion] = useState(0);
  const [modal, setModal] = useState({ open: false, word: null });
  const [levelFilter, setLevelFilter] = useState(null);

  // version을 filters에 포함해 CRUD 후 자동 재조회
  const { data, loading, error } = useWords({ ...filters, _v: version });

  const allWords = Array.isArray(data) ? data : data?.items ?? data?.content ?? [];
  const words = levelFilter ? allWords.filter((w) => w.level === levelFilter) : allWords;
  const totalPages = Array.isArray(data) ? 1 : data?.totalPages ?? 1;

  const refresh = () => setVersion((v) => v + 1);
  const openAdd = () => setModal({ open: true, word: null });
  const openEdit = (word) => setModal({ open: true, word });
  const closeModal = () => setModal({ open: false, word: null });

  const handleSave = async (form) => {
    if (modal.word) {
      const id = modal.word.wordId ?? modal.word.id;
      await wordsApi.update(id, form);
    } else {
      await wordsApi.create(form);
    }
    refresh();
  };

  const handleDelete = async (word) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const id = word.wordId ?? word.id;
    try {
      await wordsApi.remove(id);
      refresh();
    } catch {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <Header>
        <PageTitle>단어 목록</PageTitle>
        {isAdmin && <AddButton onClick={openAdd}>+ 단어 추가</AddButton>}
      </Header>
      <LevelTabs>
        {LEVEL_TABS.map(({ label, value }) => (
          <LevelTab
            key={label}
            $active={levelFilter === value}
            onClick={() => { setLevelFilter(value); setFilters((f) => ({ ...f, page: 1 })); }}
          >
            {label}
            <LevelTabCount $active={levelFilter === value}>
              {value ? allWords.filter((w) => w.level === value).length : allWords.length}
            </LevelTabCount>
          </LevelTab>
        ))}
      </LevelTabs>
      <WordFilterBar filters={filters} onChange={(f) => setFilters({ ...f, page: 1 })} />
      {loading && <StatusText>불러오는 중...</StatusText>}
      {error && <StatusText $error>단어 목록을 불러오지 못했습니다.</StatusText>}
      <WordList
        items={words}
        onEdit={isAdmin ? openEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
      />
      <Pagination
        page={filters.page}
        totalPages={totalPages}
        onChange={(page) => setFilters((f) => ({ ...f, page }))}
      />
      {isAdmin && modal.open && (
        <WordFormModal word={modal.word} onSave={handleSave} onClose={closeModal} />
      )}
    </div>
  );
}
