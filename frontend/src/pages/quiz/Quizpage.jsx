import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const ACCENT = '#F6841F';

const FALLBACK_DATA = [
  { id: 1, word: 'abundant',  guide: '이 영단어의 뜻으로 알맞은 것은?', choices: ['풍부한',   '부족한',     '겸손한'],      answer: 0 },
  { id: 2, word: 'ambiguous', guide: '이 영단어의 뜻으로 알맞은 것은?', choices: ['명확한',   '모호한',     '거친'],        answer: 1 },
  { id: 3, word: 'concise',   guide: '이 영단어의 뜻으로 알맞은 것은?', choices: ['장황한',   '무관한',     '간결한'],      answer: 2 },
  { id: 4, word: 'diligent',  guide: '이 영단어의 뜻으로 알맞은 것은?', choices: ['부지런한', '게으른',     '교활한'],      answer: 0 },
  { id: 5, word: 'eloquent',  guide: '이 영단어의 뜻으로 알맞은 것은?', choices: ['침묵하는', '말을 잘하는', '소란스러운'], answer: 1 },
];

function buildQuestions(words) {
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.map((word) => {
    const wrongPool = words
      .filter((w) => w.id !== word.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map((w) => w.korean);
    const correctIdx = Math.floor(Math.random() * 3);
    const choices = [...wrongPool];
    choices.splice(correctIdx, 0, word.korean);
    return { id: word.id, word: word.english, guide: '이 영단어의 뜻으로 알맞은 것은?', choices, answer: correctIdx };
  });
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export default function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const makeQuestions = () => {
    const passed = location.state?.words;
    return passed?.length >= 3 ? buildQuestions(passed) : FALLBACK_DATA;
  };

  const [questions, setQuestions] = useState(makeQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  // answers: { [questionIndex]: choiceIndex } — 문제별 선택 답안 저장
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const total    = questions.length;
  const q        = questions[currentIndex];
  const selected = answers[currentIndex] ?? null;
  const pct      = ((currentIndex + 1) / total) * 100;

  // 이미 선택한 답도 다시 클릭해 변경 가능
  const handleSelect = (idx) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: idx }));
  };

  const handleNext = () => {
    if (currentIndex + 1 >= total) {
      setDone(true);
    } else {
      setCurrentIndex((c) => c + 1);
    }
  };

  const handlePrev = () => {
    setCurrentIndex((c) => Math.max(0, c - 1));
  };

  const handleRetry = () => {
    setQuestions(makeQuestions());
    setCurrentIndex(0);
    setAnswers({});
    setDone(false);
  };

  if (done) {
    const score  = questions.filter((q, i) => answers[i] === q.answer).length;
    const wrongs = questions
      .map((q, i) => ({ ...q, userAnswer: answers[i] ?? null }))
      .filter((q) => q.userAnswer !== q.answer);

    return (
      <Page>
        <Container>
          <ResultBox>
            <ResultEmoji>🐯</ResultEmoji>
            <ResultTitle>퀴즈 완료!</ResultTitle>
            <ResultScore>{score} / {total}문제 정답</ResultScore>
            <ResultRate>{Math.round((score / total) * 100)}% 정답률</ResultRate>

            {wrongs.length === 0 ? (
              <PerfectMsg>완벽해요! 모두 맞혔어요 🎉</PerfectMsg>
            ) : (
              <WrongSection>
                <WrongHeader>틀린 문제 ({wrongs.length}개)</WrongHeader>
                {wrongs.map((q) => (
                  <WrongItem key={q.id}>
                    <WrongWord>{q.word}</WrongWord>
                    <WrongAnswerRow>
                      <AnswerBadge $wrong>
                        ✗ {q.userAnswer !== null ? q.choices[q.userAnswer] : '미응답'}
                      </AnswerBadge>
                      <AnswerArrow>→</AnswerArrow>
                      <AnswerBadge>✓ {q.choices[q.answer]}</AnswerBadge>
                    </WrongAnswerRow>
                  </WrongItem>
                ))}
              </WrongSection>
            )}

            <ResultBtns>
              <RetryBtn onClick={handleRetry}>다시 풀기</RetryBtn>
              <BackToStudyBtn onClick={() => navigate('/flashcard')}>단어 학습으로</BackToStudyBtn>
            </ResultBtns>
          </ResultBox>
        </Container>
      </Page>
    );
  }

  return (
    <Page>
      <Container>
        <Header>
          <BackBtn onClick={() => navigate(-1)}>← 뒤로가기</BackBtn>
          <HeaderCenter>
            <HeaderTitle>단어 퀴즈</HeaderTitle>
            <LevelBadge>TOEIC</LevelBadge>
          </HeaderCenter>
          <ProgressText>{currentIndex + 1} / {total}</ProgressText>
        </Header>

        <ProgTrack>
          <ProgFill $pct={pct} />
        </ProgTrack>

        <QuizCard key={q.id}>
          <Guide>{q.guide}</Guide>
          <Word>{q.word}</Word>
          <ChoiceList>
            {q.choices.map((choice, i) => (
              <ChoiceBtn
                key={i}
                type="button"
                $selected={selected === i}
                onClick={() => handleSelect(i)}
              >
                <NumBadge $selected={selected === i}>{i + 1}</NumBadge>
                <ChoiceText>{choice}</ChoiceText>
              </ChoiceBtn>
            ))}
          </ChoiceList>
        </QuizCard>

        <NavRow>
          <PrevBtn onClick={handlePrev} disabled={currentIndex === 0}>
            ← 이전
          </PrevBtn>
          <NextBtn onClick={handleNext} disabled={selected === null}>
            {currentIndex + 1 >= total ? '결과 보기' : '다음 문제 →'}
          </NextBtn>
        </NavRow>
      </Container>
    </Page>
  );
}

/* ── 레이아웃 ── */

const Page = styled.div`
  min-height: 100vh;
  background: #FFF8F2;
  display: flex;
  justify-content: center;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  padding: 0 16px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 448px;
  padding: 28px 0 60px;
  display: flex;
  flex-direction: column;
`;

/* ── 헤더 ── */

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
`;

const BackBtn = styled.button`
  background: #fff;
  border: 1.5px solid #F6D8B8;
  border-radius: 10px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 600;
  color: #B0926A;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color .15s, color .15s;
  &:hover { border-color: ${ACCENT}; color: ${ACCENT}; }
`;

const HeaderCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const HeaderTitle = styled.span`
  font-size: 15px;
  font-weight: 800;
  color: #1F2933;
`;

const LevelBadge = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${ACCENT};
  background: #FFF4E6;
  border: 1px solid #FFD49A;
  border-radius: 9999px;
  padding: 2px 10px;
  letter-spacing: .04em;
`;

const ProgressText = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${ACCENT};
  white-space: nowrap;
`;

/* ── 진행 바 ── */

const ProgTrack = styled.div`
  width: 100%;
  height: 6px;
  background: #FFE4C4;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 24px;
`;

const ProgFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: linear-gradient(90deg, ${ACCENT}, #FFB347);
  border-radius: 9999px;
  transition: width .4s ease;
`;

/* ── 퀴즈 카드 ── */

const QuizCard = styled.div`
  background: #fff;
  border: 1.5px solid #F6D8B8;
  border-radius: 24px;
  padding: 32px 24px 28px;
  box-shadow: 0 6px 28px rgba(216, 106, 12, 0.10);
  animation: ${fadeUp} .3s ease;
`;

const Guide = styled.p`
  font-size: 13px;
  color: #9AA5B1;
  text-align: center;
  margin-bottom: 16px;
`;

const Word = styled.h2`
  font-size: 42px;
  font-weight: 800;
  color: ${ACCENT};
  text-align: center;
  letter-spacing: -.5px;
  margin-bottom: 32px;
`;

const ChoiceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChoiceBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${({ $selected }) => ($selected ? '#FFF4E6' : '#FAFAFA')};
  border: 1.5px solid ${({ $selected }) => ($selected ? ACCENT : '#EDE8E2')};
  border-radius: 14px;
  padding: 14px 18px;
  cursor: pointer;
  transition: background .15s, border-color .15s, transform .1s;
  &:hover {
    background: #FFF4E6;
    border-color: #FFB347;
    transform: translateX(2px);
  }
`;

const NumBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${({ $selected }) => ($selected ? ACCENT : '#F0EBE4')};
  color: ${({ $selected }) => ($selected ? '#fff' : '#B0926A')};
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
  transition: background .15s, color .15s;
`;

const ChoiceText = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #1F2933;
  text-align: left;
`;

/* ── 하단 네비게이션 ── */

const NavRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

const PrevBtn = styled.button`
  background: #fff;
  color: #B0926A;
  border: 1.5px solid #F6D8B8;
  border-radius: 16px;
  padding: 18px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color .15s, color .15s;
  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
  &:hover:not(:disabled) {
    border-color: ${ACCENT};
    color: ${ACCENT};
  }
`;

const NextBtn = styled.button`
  flex: 1;
  background: ${({ disabled }) => (disabled ? '#F6D8B8' : ACCENT)};
  color: ${({ disabled }) => (disabled ? '#C8A882' : '#fff')};
  border: none;
  border-radius: 16px;
  padding: 18px 0;
  font-size: 16px;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  transition: opacity .15s, transform .1s;
  &:hover:not(:disabled) { opacity: .9; transform: translateY(-1px); }
`;

/* ── 결과 화면 ── */

const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 80px;
  animation: ${fadeUp} .4s ease;
`;

const ResultEmoji   = styled.div`font-size: 64px;`;
const ResultTitle   = styled.h2`font-size: 24px; font-weight: 800; color: #1F2933;`;
const ResultScore   = styled.p`font-size: 18px; font-weight: 700; color: ${ACCENT};`;
const ResultRate    = styled.p`font-size: 14px; color: #B07040; background: #FFF3E0; border-radius: 12px; padding: 10px 24px;`;

const ResultBtns = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  margin-top: 8px;
`;

const RetryBtn = styled.button`
  width: 100%;
  background: ${ACCENT};
  color: #fff;
  border: none;
  border-radius: 14px;
  padding: 16px 0;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity .15s;
  &:hover { opacity: .88; }
`;

const BackToStudyBtn = styled.button`
  width: 100%;
  background: #fff;
  color: #B07040;
  border: 2px solid #F6D8B8;
  border-radius: 14px;
  padding: 15px 0;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color .15s, color .15s;
  &:hover { border-color: ${ACCENT}; color: ${ACCENT}; }
`;

/* ── 오답 목록 ── */

const PerfectMsg = styled.p`
  font-size: 15px;
  font-weight: 700;
  color: #16A34A;
  background: #F0FDF4;
  border-radius: 12px;
  padding: 12px 24px;
`;

const WrongSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
`;

const WrongHeader = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #B07040;
  padding-bottom: 8px;
  border-bottom: 1.5px solid #F6D8B8;
`;

const WrongItem = styled.div`
  background: #fff;
  border: 1.5px solid #F6D8B8;
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const WrongWord = styled.span`
  font-size: 18px;
  font-weight: 800;
  color: ${ACCENT};
`;

const WrongAnswerRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

const AnswerBadge = styled.span`
  font-size: 13px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 9999px;
  background: ${({ $wrong }) => ($wrong ? '#FEF2F0' : '#F0FDF4')};
  color: ${({ $wrong }) => ($wrong ? '#DC2626' : '#16A34A')};
`;

const AnswerArrow = styled.span`
  font-size: 13px;
  color: #9AA5B1;
`;
