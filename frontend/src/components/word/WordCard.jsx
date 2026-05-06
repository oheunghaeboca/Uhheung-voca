import styled from 'styled-components';
import Card from '../ui/Card.jsx';
import WordTag from './WordTag.jsx';
import PronounceButton from './PronounceButton.jsx';
import BookmarkToggle from './BookmarkToggle.jsx';

const Row = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
`;
const Tags = styled.div` display: flex; gap: ${({ theme }) => theme.spacing[2]}; `;

export default function WordCard({ word, bookmarked }) {
  return (
    <Card>
      <Row>
        <div>
          <strong>{word?.english}</strong> — {word?.korean}
          <Tags>
            {word?.level && <WordTag kind="level" value={word.level} />}
            {word?.type && <WordTag kind="type" value={word.type} />}
          </Tags>
        </div>
        <Row>
          <PronounceButton text={word?.english} />
          <BookmarkToggle wordId={word?.id} bookmarked={bookmarked} />
        </Row>
      </Row>
    </Card>
  );
}
