import { useParams } from 'react-router-dom';
import WordDetailCard from '../../components/word/WordDetailCard.jsx';
import PronounceButton from '../../components/word/PronounceButton.jsx';
import BookmarkToggle from '../../components/word/BookmarkToggle.jsx';
import { useWord } from '../../hooks/useWord';

export default function WordDetailPage() {
  const { id } = useParams();
  const { data: word } = useWord(id);

  return (
    <div>
      <WordDetailCard word={word} />
      {word && (
        <>
          <PronounceButton text={word.english} />
          <BookmarkToggle wordId={word.id} bookmarked={word.bookmarked} />
        </>
      )}
    </div>
  );
}
