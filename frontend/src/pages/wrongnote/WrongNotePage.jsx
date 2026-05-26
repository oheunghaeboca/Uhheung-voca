import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import WrongNoteList from '../../components/wrongnote/WrongNoteList.jsx';
import { wrongNotesApi } from '../../api/wrongNotes';
import { useAuth } from '../../hooks/useAuth';

export default function WrongNotePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    wrongNotesApi.list(user.id)
      .then((res) => setItems(res ?? []))
      .catch(() => setError('오답 노트를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleRetest = () => {
    if (!items.length) return;
    // QuizPage 는 location.state.words 형태(객체 배열)를 기대한다. wordId → id 로 매핑.
    // 단어가 4개 미만이면 QuizPage 가 보기 부족으로 일반 퀴즈 API 폴백 — 자연스러운 동작.
    const words = items.map((it) => ({
      id: it.wordId,
      english: it.english,
      korean: it.korean,
    }));
    navigate('/quiz', { state: { words, source: 'wrong-note' } });
  };

  const totalWrong = items.reduce((acc, it) => acc + Number(it.wrongCount ?? 0), 0);

  return (
    <Page>
      <Header>
        <BackBtn onClick={() => navigate('/dashboard')}>← 메인으로</BackBtn>
        <Title>📒 오답 노트</Title>
        <Spacer />
      </Header>

      <Content>
        <SummaryRow>
          <SummaryCard $bg="#FFF3E0">
            <SummaryLabel>오답 단어</SummaryLabel>
            <SummaryValue $color="#F6841F">{items.length}개</SummaryValue>
          </SummaryCard>
          <SummaryCard $bg="#FEF2F2">
            <SummaryLabel>누적 오답</SummaryLabel>
            <SummaryValue $color="#DC2626">{totalWrong}회</SummaryValue>
          </SummaryCard>
          <RetestBtn
            onClick={handleRetest}
            disabled={!items.length}
            title={!items.length ? '오답이 없습니다' : '오답 단어로 재테스트'}
          >
            🔁 재테스트 시작
          </RetestBtn>
        </SummaryRow>

        {loading && <CenterMsg>불러오는 중…</CenterMsg>}
        {error && <CenterMsg $error>{error}</CenterMsg>}
        {!loading && !error && <WrongNoteList items={items} />}
      </Content>
    </Page>
  );
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`
  min-height: 100vh; background: #FFF8F2;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
`;

const Header = styled.header`
  position: sticky; top: 0; z-index: 200;
  background: rgba(255,248,242,0.92); backdrop-filter: blur(8px);
  border-bottom: 1.5px solid #F6D8B8;
  padding: 0 32px; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
`;

const BackBtn = styled.button`
  background: #fff; border: 1.5px solid #F6D8B8; border-radius: 10px;
  padding: 7px 14px; font-size: 13px; font-weight: 600; color: #B0926A; cursor: pointer;
  &:hover { border-color: #F6841F; color: #F6841F; }
`;

const Title = styled.h1`
  font-size: 20px; font-weight: 800; color: #2D1B0E;
`;

const Spacer = styled.div`width: 88px;`;

const Content = styled.main`
  max-width: 900px; margin: 0 auto; padding: 32px 24px;
  animation: ${fadeUp} .4s ease;
`;

const SummaryRow = styled.div`
  display: flex; align-items: stretch; gap: 12px; margin-bottom: 24px;
  flex-wrap: wrap;
`;

const SummaryCard = styled.div`
  flex: 1 1 140px;
  background: ${({ $bg }) => $bg ?? '#FFF8F2'};
  border-radius: 14px; padding: 16px 18px;
  display: flex; flex-direction: column; gap: 4px;
`;

const SummaryLabel = styled.div`font-size: 12px; color: #B07040; font-weight: 600;`;
const SummaryValue = styled.div`
  font-size: 22px; font-weight: 800;
  color: ${({ $color }) => $color ?? '#2D1B0E'};
`;

const RetestBtn = styled.button`
  flex: 0 0 auto;
  background: #F6841F; color: #fff; border: none; border-radius: 12px;
  padding: 0 22px; font-size: 14px; font-weight: 700; cursor: pointer;
  transition: opacity .15s, transform .15s;
  &:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
  &:disabled { background: #F6D8B8; color: #fff; cursor: not-allowed; }
`;

const CenterMsg = styled.div`
  text-align: center; padding: 40px 16px;
  color: ${({ $error }) => ($error ? '#DC2626' : '#B07040')};
  font-size: 14px;
`;
