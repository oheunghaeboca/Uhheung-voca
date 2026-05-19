import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { wordsApi } from '../../api/words';

// 오늘의 학습 단어 추천 카드. /api/words/daily 응답을 가로 스크롤 리스트로 보여준다.
// 같은 날 같은 사용자는 동일한 20개 단어를 동일한 순서로 받는다 (백엔드 멱등성 보장).
export default function TodayWordsCard() {
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    let mounted = true;
    wordsApi
      .daily()
      .then((data) => {
        if (mounted) setState({ loading: false, error: null, data });
      })
      .catch((err) => {
        // 401 은 axios 인터셉터가 처리하므로 화면에서는 일반 에러 표시만.
        if (mounted) setState({ loading: false, error: err, data: null });
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card>
      <Header>
        <SectionTitle>오늘의 추천 단어</SectionTitle>
        <Hint>매일 학습 이력이 적은 단어 20개를 골라 드려요</Hint>
      </Header>

      {state.loading && <Status>불러오는 중…</Status>}
      {state.error && <StatusError>추천 단어를 불러오지 못했습니다.</StatusError>}
      {state.data && (
        <Scroll>
          {state.data.words.map((w, i) => (
            <WordCard key={w.wordId}>
              <Index>{String(i + 1).padStart(2, '0')}</Index>
              <English>{w.english}</English>
              <Korean>{w.korean}</Korean>
              <Tags>
                {w.level && <LevelTag>{w.level}</LevelTag>}
                {w.type && <TypeTag>{w.type}</TypeTag>}
              </Tags>
            </WordCard>
          ))}
        </Scroll>
      )}
    </Card>
  );
}

const Card = styled.section`
  background: #fff;
  border: 1.5px solid #F6D8B8;
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(216, 106, 12, 0.07);
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 8px;
`;

const SectionTitle = styled.h2`
  font-size: 17px;
  font-weight: 800;
  color: #2D1B0E;
`;

const Hint = styled.span`
  font-size: 12px;
  color: #B07040;
`;

const Status = styled.div`
  font-size: 13px;
  color: #B07040;
  padding: 12px 4px;
`;

const StatusError = styled(Status)`
  color: #DC2626;
`;

const Scroll = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 8px;

  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-thumb { background: #F6D8B8; border-radius: 9999px; }
`;

const WordCard = styled.article`
  flex: 0 0 auto;
  width: 168px;
  background: #FFF8F2;
  border: 1.5px solid #F6D8B8;
  border-radius: 14px;
  padding: 14px 14px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: transform .15s, box-shadow .15s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 18px rgba(216, 106, 12, 0.14);
  }
`;

const Index = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #F6841F;
  letter-spacing: 0.04em;
`;

const English = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #2D1B0E;
  word-break: break-all;
`;

const Korean = styled.div`
  font-size: 13px;
  color: #5C3A1A;
  min-height: 18px;
`;

const Tags = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 4px;
`;

const LevelTag = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #16A34A;
  background: #E8F5EE;
  border-radius: 9999px;
  padding: 2px 8px;
`;

const TypeTag = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #1E3A5F;
  background: #E2E9F2;
  border-radius: 9999px;
  padding: 2px 8px;
`;
