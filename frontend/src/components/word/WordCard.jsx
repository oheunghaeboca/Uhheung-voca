import styled from 'styled-components';
import Card from '../ui/Card.jsx';
import WordTag from './WordTag.jsx';
import PronounceButton from './PronounceButton.jsx';
import BookmarkToggle from './BookmarkToggle.jsx';

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[3]};
`;

const WordInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  min-width: 0;
`;

const English = styled.span`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Korean = styled.span`
  font-size: ${({ theme }) => theme.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Tags = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing[3]} 0;
`;

const ExampleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

const ExampleEn = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  font-style: italic;
  margin: 0;

  &::before {
    content: '"';
  }
  &::after {
    content: '"';
  }
`;

const ExampleKo = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.muted};
  margin: 0;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  flex-shrink: 0;
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: transparent;
  color: ${({ theme, $danger }) => $danger ? theme.colors.error : theme.colors.text.muted};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transition.fast}, color ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme, $danger }) => $danger ? '#FEE2E2' : theme.colors.primary[50]};
    color: ${({ theme, $danger }) => $danger ? theme.colors.error : theme.colors.primary[500]};
  }
`;

function EditIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

const hasExample = (word) => word?.example && word.example.trim() !== '';

export default function WordCard({ word, bookmarked, onEdit, onDelete }) {
  return (
    <Card>
      <Row>
        <WordInfo>
          <English>{word?.english}</English>
          <Korean>{word?.korean}</Korean>
          <Tags>
            {word?.level && <WordTag kind="level" value={word.level} />}
            {word?.type && <WordTag kind="type" value={word.type} />}
          </Tags>
        </WordInfo>
        <Actions>
          <PronounceButton text={word?.english} label="미국" />
          <PronounceButton text={word?.english} lang="en-GB" label="영국" />
          <BookmarkToggle wordId={word?.wordId ?? word?.id} bookmarked={bookmarked} />
          {onEdit && (
            <IconButton type="button" title="수정" onClick={() => onEdit(word)}>
              <EditIcon />
            </IconButton>
          )}
          {onDelete && (
            <IconButton type="button" title="삭제" $danger onClick={() => onDelete(word)}>
              <DeleteIcon />
            </IconButton>
          )}
        </Actions>
      </Row>
      {hasExample(word) && (
        <>
          <Divider />
          <ExampleBlock>
            <ExampleEn>{word.example}</ExampleEn>
            {word.exampleTranslation && (
              <ExampleKo>{word.exampleTranslation}</ExampleKo>
            )}
          </ExampleBlock>
        </>
      )}
    </Card>
  );
}