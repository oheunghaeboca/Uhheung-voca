import styled from 'styled-components';
import BookmarkRow from './BookmarkRow.jsx';
import EmptyState from '../ui/EmptyState.jsx';

const Stack = styled.div`
  display: flex; flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export default function BookmarkList({ items = [] }) {
  if (!items.length) return <EmptyState message="아직 북마크가 없습니다." />;
  return (
    <Stack>
      {items.map((w) => <BookmarkRow key={w.id} word={w} />)}
    </Stack>
  );
}
