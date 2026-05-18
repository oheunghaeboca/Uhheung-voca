import { useState, useEffect } from 'react';
import styled from 'styled-components';
import WordFilterBar from '../../components/word/WordFilterBar.jsx';
import WordList from '../../components/word/WordList.jsx';
import WordFormModal from '../../components/word/WordFormModal.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
import { useWords } from '../../hooks/useWords';
import { useAuth } from '../../hooks/useAuth';
import { bookmarksApi } from '../../api/bookmarks';
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

export default function WordListPage() {
  const { isAdmin } = useAuth();
  const [filters, setFilters] = useState({ page: 1, size: 20 });
  const [version, setVersion] = useState(0);
  const [modal, setModal] = useState({ open: false, word: null });
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.id) return;
    bookmarksApi.list(user.id).then((res) => {
      const items = Array.isArray(res) ? res : [];
      setBookmarkedIds(new Set(items.map((w) => w.id)));
    }).catch(() => {});
  }, [user?.id]);

  const handleBookmarkToggle = (wordId) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      next.has(wordId) ? next.delete(wordId) : next.add(wordId);
      return next;
    });
  };
  // version을 filters에 포함해 CRUD 후 자동 재조회
  const { data, loading, error } = useWords({ ...filters, _v: version });

  const words = Array.isArray(data) ? data : data?.items ?? data?.content ?? [];
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
      <WordFilterBar filters={filters} onChange={(f) => setFilters({ ...f, page: 1 })} />
      {loading && <StatusText>불러오는 중...</StatusText>}
      {error && <StatusText $error>단어 목록을 불러오지 못했습니다.</StatusText>}
      <WordList
          items={words}
          bookmarkedIds={bookmarkedIds}
          onBookmarkToggle={handleBookmarkToggle}
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
