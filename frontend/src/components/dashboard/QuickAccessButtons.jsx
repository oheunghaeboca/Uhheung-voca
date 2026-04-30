import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing[3]};
`;

const ITEMS = [
  { to: '/words', label: '단어 학습' },
  { to: '/quiz', label: '퀴즈' },
  { to: '/bookmarks', label: '북마크' },
  { to: '/wrong-notes', label: '오답노트' },
];

export default function QuickAccessButtons() {
  return (
    <Grid>
      {ITEMS.map((it) => <Link key={it.to} to={it.to}>{it.label}</Link>)}
    </Grid>
  );
}
