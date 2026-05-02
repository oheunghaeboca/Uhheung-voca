import styled from 'styled-components';
import WordCard from './WordCard.jsx';
import EmptyState from '../ui/EmptyState.jsx';

const Stack = styled.div`
  display: flex; flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export default function WordList({ items = [] }) {
  if (!items.length) return <EmptyState message="단어가 없습니다." />;
  return (
    <Stack>
      {items.map((w) => <WordCard key={w.id} word={w} />)}
    </Stack>
  );
}
