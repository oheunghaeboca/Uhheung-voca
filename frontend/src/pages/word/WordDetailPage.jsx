import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WordDetailCard from '../../components/word/WordDetailCard.jsx';
import PronounceButton from '../../components/word/PronounceButton.jsx';
import BookmarkToggle from '../../components/word/BookmarkToggle.jsx';
import { useWord } from '../../hooks/useWord';
import { wordsApi } from '../../api/words';

export default function WordDetailPage() {
  const { id } = useParams();
  const { data: word } = useWord(id);

  // 단어 상세 진입을 학습 이벤트로 기록한다 (PBI-12 STUDY_WORDS 미션).
  // 단어 데이터가 로드된 뒤에 한 번만 호출하여 잘못된 id 로 인한 404 호출을 피한다.
  useEffect(() => {
    if (!word?.id) return;
    wordsApi.view(word.id).catch(() => {
      // 미션 카운트 실패는 UX 차단 사유가 아니다 — 조용히 흘려보낸다.
    });
  }, [word?.id]);

  return (
    <div>
      <WordDetailCard word={word} />
      {word && (
        <>
          <PronounceButton text={word.english} label="미국" />
          <PronounceButton text={word.english} lang="en-GB" label="영국" />
          <BookmarkToggle wordId={word.id} bookmarked={word.bookmarked} />
        </>
      )}
    </div>
  );
}
