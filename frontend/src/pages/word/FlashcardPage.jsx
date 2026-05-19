import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { wordsApi } from '../../api/words';
import { useSpeech } from '../../hooks/useSpeech';

const LEVELS = [
  {
    key: 'BASIC',
    label: '기초',
    desc: '필수 기초 단어 집중 학습',
    bg: '#FFF3E0',
    card: '#FFFBF5',
    accent: '#F59E0B',
    border: '#FFD97A',
    icon: '🌿',
  },
  {
    key: 'FREQUENT',
    label: '빈출',
    desc: '자주 출제되는 핵심 단어',
    bg: '#FFF0DC',
    card: '#FFFAF5',
    accent: '#F6841F',
    border: '#FFBC80',
    icon: '🐯',
  },
  {
    key: 'ADVANCED',
    label: '고급',
    desc: '고득점을 위한 심화 단어',
    bg: '#FFE8D2',
    card: '#FFF7F0',
    accent: '#D86A0C',
    border: '#F6A86B',
    icon: '🔥',
  },
];

const SESSION_SIZE = 20;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

const DAILY_CONFIG = {
  key: 'DAILY',
  label: '오늘의 학습',
  bg: '#FFFAF5',
  card: '#FFFBF5',
  accent: '#F6841F',
  border: '#FFBC80',
  icon: '🐯',
};

export default function FlashcardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { supported: speechSupported, speak } = useSpeech();
  const preloadedWords = location.state?.words ?? [];
  const [words, setWords]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [sessionWords, setSessionWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning]   = useState(false);
  const [finished, setFinished]         = useState(false);
  const [typeFilter, setTypeFilter]     = useState(null); // null=전체, 'LC', 'RC'

  const displayWords = typeFilter
    ? sessionWords.filter((w) => w.type === typeFilter)
    : sessionWords;

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
    setCurrentIndex(0);
    setShowMeaning(false);
  };

  useEffect(() => {
    if (preloadedWords.length > 0) {
      setSessionWords(preloadedWords);
      setSelectedLevel('DAILY');
      setLoading(false);
      return;
    }
    wordsApi.list()
      .then(setWords)
      .catch(() => setError('단어를 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  const startSession = (levelKey) => {
    if (levelKey === 'DAILY') {
      setSessionWords(preloadedWords);
      setCurrentIndex(0);
      setShowMeaning(false);
      setFinished(false);
      setTypeFilter(null);
      return;
    }
    const filtered = shuffle(words.filter((w) => w.level === levelKey)).slice(0, SESSION_SIZE);
    setSessionWords(filtered);
    setSelectedLevel(levelKey);
    setCurrentIndex(0);
    setShowMeaning(false);
    setFinished(false);
    setTypeFilter(null);
  };

  const resetToSelect = () => {
    if (preloadedWords.length > 0) {
      navigate('/dashboard');
      return;
    }
    setSelectedLevel(null);
    setSessionWords([]);
    setCurrentIndex(0);
    setShowMeaning(false);
    setFinished(false);
    setTypeFilter(null);
  };

  const goNext = () => { setCurrentIndex((i) => Math.min(i + 1, displayWords.length - 1)); setShowMeaning(false); };
  const goPrev = () => { setCurrentIndex((i) => Math.max(i - 1, 0)); setShowMeaning(false); };

  if (loading) return <FullCenter>🐯 단어를 불러오는 중...</FullCenter>;
  if (error)   return <FullCenter $error>{error}</FullCenter>;

  /* ── 레벨 선택 ── */
  if (!selectedLevel) {
    return (
      <Page>
        <TigerBg />
        <SelectWrap>
          <SelectTopBar>
            <BackBtn onClick={() => navigate('/dashboard')}>← 메인으로</BackBtn>
          </SelectTopBar>
          <Logo>🐯</Logo>
          <SelectTitle>어흥해보카 단어장</SelectTitle>
          <SelectSub>학습할 레벨을 선택하세요</SelectSub>

          <LevelGrid>
            {LEVELS.map((lv) => {
              const total = words.filter((w) => w.level === lv.key).length;
              const count = Math.min(SESSION_SIZE, total);
              return (
                <LevelCard key={lv.key} $bg={lv.bg} $border={lv.border} onClick={() => startSession(lv.key)}>
                  <LvIcon>{lv.icon}</LvIcon>
                  <LvLabel $accent={lv.accent}>{lv.label}</LvLabel>
                  <LvKey>{lv.key}</LvKey>
                  <LvDesc>{lv.desc}</LvDesc>
                  <LvBtn $accent={lv.accent}>학습 시작 →</LvBtn>
                </LevelCard>
              );
            })}
          </LevelGrid>
        </SelectWrap>
      </Page>
    );
  }

  /* ── 학습 ── */
  const lv      = LEVELS.find((l) => l.key === selectedLevel) ?? DAILY_CONFIG;
  const current = displayWords[currentIndex];
  const isLast  = currentIndex === displayWords.length - 1;
  const pct     = displayWords.length > 0 ? ((currentIndex + 1) / displayWords.length) * 100 : 0;

  return (
    <Page>
      <TigerBg />
      <StudyWrap>
        <TopBar>
          <BackBtn onClick={resetToSelect}>{selectedLevel === 'DAILY' ? '← 대시보드' : '← 레벨 선택'}</BackBtn>
          <TopMeta>
            <TopBadge $accent={lv.accent}>{lv.icon} {lv.label}</TopBadge>
            <TopCount>{displayWords.length > 0 ? currentIndex + 1 : 0} / {displayWords.length}</TopCount>
          </TopMeta>
          <Spacer />
        </TopBar>

        <TypeTabs>
          {[{ label: '전체', value: null }, { label: 'LC', value: 'LC' }, { label: 'RC', value: 'RC' }].map(({ label, value }) => (
            <TypeTab
              key={label}
              $active={typeFilter === value}
              $accent={lv.accent}
              onClick={() => handleTypeFilter(value)}
            >
              {label}
              <TypeTabCount $active={typeFilter === value} $accent={lv.accent}>
                {value ? sessionWords.filter((w) => w.type === value).length : sessionWords.length}
              </TypeTabCount>
            </TypeTab>
          ))}
        </TypeTabs>

        <ProgTrack>
          <ProgFill $pct={pct} $accent={lv.accent} />
        </ProgTrack>

        {displayWords.length === 0 ? (
          <EmptyFilter>해당 유형의 단어가 없습니다.</EmptyFilter>
        ) : (
          <>
            <Card $bg={lv.card} $border={lv.border} $expanded={showMeaning}>
              <Front>
                <Badges>
                  <TypeTag $type={current.type}>{current.type}</TypeTag>
                  {current.part && <PartTag>{current.part}</PartTag>}
                </Badges>
                <Word>{current.english}</Word>
                {speechSupported && (
                  <SpeakBtns>
                    <SpeakBtn
                      $accent={lv.accent}
                      type="button"
                      aria-label="미국 발음 듣기"
                      onClick={() => speak(current.english, 'en-US')}
                    >
                      🔊 미국
                    </SpeakBtn>
                    <SpeakBtn
                      $accent={lv.accent}
                      type="button"
                      aria-label="영국 발음 듣기"
                      onClick={() => speak(current.english, 'en-GB')}
                    >
                      🔊 영국
                    </SpeakBtn>
                  </SpeakBtns>
                )}
                {!showMeaning && (
                  <RevealBtn $accent={lv.accent} onClick={() => setShowMeaning(true)}>
                    뜻 보기 ▼
                  </RevealBtn>
                )}
              </Front>

              {showMeaning && (
                <Back>
                  <HDivider $accent={lv.accent} />
                  <Meaning>{current.korean}</Meaning>
                  {current.example && (
                    <ExBox $accent={lv.accent}>
                      <ExEn>"{current.example}"</ExEn>
                      {current.exampleTranslation && <ExKo>{current.exampleTranslation}</ExKo>}
                    </ExBox>
                  )}
                </Back>
              )}
            </Card>

            {finished ? (
              <DoneBox>
                <DoneTiger>🐯</DoneTiger>
                <DoneMsg>{sessionWords.length}개 학습 완료!</DoneMsg>
                <DoneSub>어흥~ 잘 했어요!</DoneSub>
                <DoneMotivation>꾸준히 하면 반드시 목표 점수에 도달할 수 있어요. 오늘도 수고했어요!</DoneMotivation>
                <DoneBtns>
                  <DoneRetry $accent={lv.accent} onClick={() => startSession(selectedLevel)}>다시 학습하기</DoneRetry>
                  <DoneQuiz onClick={() => navigate('/quiz', { state: { words: sessionWords } })}>퀴즈 풀러가기 →</DoneQuiz>
                </DoneBtns>
                <DoneOther onClick={resetToSelect}>{selectedLevel === 'DAILY' ? '대시보드로 돌아가기' : '다른 레벨 선택'}</DoneOther>
              </DoneBox>
            ) : (
              <Nav>
                <NavBtn onClick={goPrev} disabled={currentIndex === 0}>← 이전</NavBtn>
                <Dots>
                  {displayWords
                    .slice(Math.max(0, currentIndex - 2), Math.min(displayWords.length, currentIndex + 3))
                    .map((_, i) => {
                      const idx = Math.max(0, currentIndex - 2) + i;
                      return <Dot key={idx} $active={idx === currentIndex} $accent={lv.accent} />;
                    })}
                </Dots>
                {isLast && showMeaning ? (
                  <NavBtn onClick={() => {
                    sessionStorage.setItem('quiz.sessionWords', JSON.stringify(sessionWords));
                    setFinished(true);
                  }}>완료</NavBtn>
                ) : (
                  <NavBtn onClick={goNext} disabled={isLast}>다음 →</NavBtn>
                )}
              </Nav>
            )}
          </>
        )}
      </StudyWrap>
    </Page>
  );
}

/* ────── keyframes ────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const tigStripe = keyframes`
  0%   { background-position: 0 0; }
  100% { background-position: 60px 60px; }
`;

/* ────── Layout ────── */
const Page = styled.div`
  min-height: 100vh;
  background: #FFF8F2;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  position: relative;
  overflow: hidden;
`;

/* 배경 호랑이 줄무늬 */
const TigerBg = styled.div``;

const SelectWrap = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px 60px;
  width: 100%;
  max-width: 900px;
`;

const StudyWrap = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 24px 60px;
  width: 100%;
  max-width: 680px;
`;

/* ────── 레벨 선택 ────── */
const SelectTopBar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
`;

const Logo = styled.div`font-size: 56px; margin-bottom: 8px;`;

const SelectTitle = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #1F2933;
  margin-bottom: 6px;
`;

const SelectSub = styled.p`
  font-size: 15px;
  color: #9AA5B1;
  margin-bottom: 40px;
`;

const LevelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;

const LevelCard = styled.div`
  background: ${({ $bg }) => $bg};
  border: 2px solid ${({ $border }) => $border};
  border-radius: 22px;
  padding: 32px 24px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-7px);
    box-shadow: 0 18px 40px rgba(246, 132, 31, 0.18);
  }
`;

const LvIcon  = styled.div`font-size: 42px;`;
const LvLabel = styled.h2`font-size: 22px; font-weight: 800; color: ${({ $accent }) => $accent};`;
const LvKey   = styled.span`font-size: 11px; font-weight: 700; color: #B0926A; letter-spacing: .08em;`;
const LvDesc  = styled.p`font-size: 13px; color: #7A6550; line-height: 1.5; margin-top: 4px;`;
const LvMeta  = styled.p`font-size: 13px; font-weight: 700; color: ${({ $accent }) => $accent};`;

const LvBtn = styled.button`
  margin-top: 10px;
  width: 100%;
  background: ${({ $accent }) => $accent};
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 11px 0;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity .15s, transform .1s;
  &:hover { opacity: .88; transform: scale(1.02); }
`;

/* ────── 학습 상단 ────── */
const TopBar = styled.div`
  width: 100%;
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
  transition: border-color .15s, color .15s;
  &:hover { border-color: #F6841F; color: #F6841F; }
`;

const TopMeta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
`;

const TopBadge = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ $accent }) => $accent};
`;

const TopCount = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #B0926A;
`;

const Spacer = styled.div`width: 88px;`;

/* ────── LC/RC 분류 탭 ────── */
const TypeTabs = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
  width: 100%;
  justify-content: center;
`;

const TypeTab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 16px;
  border-radius: 9999px;
  border: 1.5px solid ${({ $active, $accent }) => $active ? $accent : '#F6D8B8'};
  background: ${({ $active, $accent }) => $active ? $accent : '#fff'};
  color: ${({ $active }) => $active ? '#fff' : '#B0926A'};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s ease;
  &:hover {
    border-color: ${({ $accent }) => $accent};
    color: ${({ $active, $accent }) => $active ? '#fff' : $accent};
  }
`;

const TypeTabCount = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 9999px;
  background: ${({ $active }) => $active ? 'rgba(255,255,255,0.25)' : '#FFF3E0'};
  color: ${({ $active, $accent }) => $active ? '#fff' : $accent};
`;

const EmptyFilter = styled.div`
  margin-top: 40px;
  font-size: 15px;
  color: #B0926A;
  font-weight: 600;
  text-align: center;
`;

/* ────── 진행 바 ────── */
const ProgTrack = styled.div`
  width: 100%;
  height: 7px;
  background: #FFE4C4;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 28px;
`;

const ProgFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: linear-gradient(90deg, ${({ $accent }) => $accent}, #FFB347);
  border-radius: 9999px;
  transition: width .4s ease;
`;

/* ────── 카드 ────── */
const Card = styled.div`
  width: 100%;
  background: ${({ $bg }) => $bg};
  border: 2px solid ${({ $border }) => $border};
  border-radius: 26px;
  padding: 40px 36px;
  box-shadow: 0 8px 32px rgba(216, 106, 12, 0.10);
  min-height: ${({ $expanded }) => ($expanded ? '340px' : '240px')};
  transition: min-height .35s ease;
`;

const Front = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`;

const Badges = styled.div`display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;`;

const TypeTag = styled.span`
  font-size: 11px;
  font-weight: 700;
  padding: 3px 11px;
  border-radius: 9999px;
  background: ${({ $type }) => ($type === 'LC' ? '#FEF3C7' : '#FFF0DC')};
  color: ${({ $type }) => ($type === 'LC' ? '#D97706' : '#D86A0C')};
`;

const PartTag = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 3px 11px;
  border-radius: 9999px;
  background: #FFF0DC;
  color: #B07040;
`;

const Word = styled.h2`
  font-size: 44px;
  font-weight: 800;
  color: #2D1B0E;
  letter-spacing: -.5px;
  text-align: center;
`;

const RevealBtn = styled.button`
  margin-top: 4px;
  background: ${({ $accent }) => $accent}20;
  color: ${({ $accent }) => $accent};
  border: 1.5px solid ${({ $accent }) => $accent}55;
  border-radius: 12px;
  padding: 10px 30px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s;
  &:hover { background: ${({ $accent }) => $accent}35; }
`;

const SpeakBtns = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`;

const SpeakBtn = styled.button`
  background: ${({ $accent }) => $accent}14;
  color: ${({ $accent }) => $accent};
  border: 1.5px solid ${({ $accent }) => $accent}40;
  border-radius: 10px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background .15s, transform .1s;
  &:hover { background: ${({ $accent }) => $accent}28; transform: scale(1.04); }
  &:active { transform: scale(0.97); }
`;

const Back = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  animation: ${fadeUp} .35s ease;
`;

const HDivider = styled.hr`
  width: 100%;
  border: none;
  border-top: 2px solid ${({ $accent }) => $accent}33;
  margin: 12px 0 0;
`;

const Meaning = styled.p`
  font-size: 30px;
  font-weight: 800;
  color: #2D1B0E;
  text-align: center;
`;

const ExBox = styled.div`
  background: #FFF3E0;
  border-left: 4px solid ${({ $accent }) => $accent};
  border-radius: 10px;
  padding: 14px 20px;
  width: 100%;
`;

const ExEn = styled.p`font-size: 14px; color: #3D2B18; font-style: italic; line-height: 1.7;`;
const ExKo = styled.p`font-size: 13px; color: #B07040; margin-top: 6px; line-height: 1.6;`;

/* ────── 네비게이션 ────── */
const Nav = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
`;

const NavBtn = styled.button`
  background: #fff;
  color: #F6841F;
  border: 2px solid #F6841F;
  border-radius: 12px;
  padding: 11px 26px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s, transform .1s;
  &:disabled { background: #FFF3E0; color: #C8A882; border-color: #F6D8B8; cursor: default; }
  &:hover:not(:disabled) { background: #FFF4E6; transform: scale(1.03); }
`;

const Dots = styled.div`display: flex; gap: 6px; align-items: center;`;

const Dot = styled.div`
  width: ${({ $active }) => ($active ? '22px' : '8px')};
  height: 8px;
  border-radius: 9999px;
  background: ${({ $active, $accent }) => ($active ? $accent : '#F6D8B8')};
  transition: all .25s ease;
`;

/* ────── 완료 ────── */
const DoneBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
  animation: ${fadeUp} .4s ease;
`;

const DoneTiger      = styled.div`font-size: 64px;`;
const DoneMsg        = styled.p`font-size: 22px; font-weight: 800; color: #2D1B0E;`;
const DoneSub        = styled.p`font-size: 15px; color: #B07040;`;
const DoneMotivation = styled.p`font-size: 14px; color: #B07040; text-align: center; line-height: 1.6; max-width: 320px; background: #FFF3E0; border-radius: 12px; padding: 12px 20px;`;

const DoneBtns  = styled.div`display: flex; gap: 10px; margin-top: 8px; flex-wrap: wrap; justify-content: center;`;

const DoneRetry = styled.button`
  background: ${({ $accent }) => $accent};
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity .15s;
  &:hover { opacity: .88; }
`;

const DoneQuiz = styled.button`
  background: #fff;
  color: #F6841F;
  border: 2px solid #F6841F;
  border-radius: 12px;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background .15s, color .15s;
  &:hover { background: #FFF4E6; }
`;

const DoneOther = styled.button`
  background: transparent;
  color: #B0926A;
  border: none;
  border-radius: 12px;
  padding: 8px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color .15s;
  &:hover { color: #F6841F; }
`;

const FullCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 16px;
  color: ${({ $error }) => ($error ? '#DC2626' : '#B07040')};
  font-family: 'Pretendard', sans-serif;
  background: #FFF8F2;
`;