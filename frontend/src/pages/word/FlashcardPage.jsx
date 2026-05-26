import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { wordsApi } from '../../api/words';
import { bookmarksApi } from '../../api/bookmarks';
import { useAuth } from '../../hooks/useAuth';

const LEVELS = [
  { key: 'BASIC',    label: '기초', desc: '필수 기초 단어 집중 학습', bg: '#FFF3E0', card: '#FFFBF5', accent: '#F59E0B', border: '#FFD97A', icon: '🌿' },
  { key: 'FREQUENT', label: '빈출', desc: '자주 출제되는 핵심 단어', bg: '#FFF0DC', card: '#FFFAF5', accent: '#F6841F', border: '#FFBC80', icon: '🐯' },
  { key: 'ADVANCED', label: '고급', desc: '고득점을 위한 심화 단어', bg: '#FFE8D2', card: '#FFF7F0', accent: '#D86A0C', border: '#F6A86B', icon: '🔥' },
];

// Dashboard 의 '오늘의 학습 시작' 으로 진입한 daily 세션 메타. LEVELS 에 없는 가상 키.
const DAILY_META = {
  key: 'DAILY', label: '오늘의 추천',
  card: '#FFFAF5', accent: '#F6841F', border: '#FFBC80', icon: '🐯',
};

const SESSION_SIZE = 20;
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// Web Speech API 기반 영단어 발음. 동일 페이지에서 단어 목록과도 공유 가능하지만,
// 여기서는 학습 카드 안에서만 호출하므로 컴포넌트 내부에 둔다.
const speak = (text, lang) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!text) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
};

export default function FlashcardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [words, setWords]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [sessionWords, setSessionWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMeaning, setShowMeaning]   = useState(false);
  const [finished, setFinished]         = useState(false);
  const [bookmarked, setBookmarked]     = useState(new Set());

  useEffect(() => {
    wordsApi.list()
        .then(setWords)
        .catch(() => setError('단어를 불러오지 못했습니다.'))
        .finally(() => setLoading(false));
  }, []);

  // Dashboard '오늘의 학습 시작' 으로 진입한 경우: 레벨 선택 우회하고 전달된 20개로 즉시 학습 시작.
  // 새로고침/직접 진입 시 location.state 가 없으면 일반 레벨 선택 흐름.
  useEffect(() => {
    const incoming = location.state;
    if (incoming?.source === 'daily' && Array.isArray(incoming.words) && incoming.words.length > 0) {
      setSessionWords(incoming.words);
      setSelectedLevel('DAILY');
      setCurrentIndex(0);
      setShowMeaning(false);
      setFinished(false);
    }
    // mount 시 1회만 — 학습 중 location 이 바뀔 일 없음.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    bookmarksApi.list(user.id).then((res) => {
      const items = Array.isArray(res) ? res : [];
      setBookmarked(new Set(items.map((w) => w.id)));
    }).catch(() => {});
  }, [user?.id]);

  // PBI-12 STUDY_WORDS 미션: 단어 학습 이벤트 기록. user.id 필요한 컨트롤러로 전달.
  useEffect(() => {
    const w = sessionWords[currentIndex];
    if (!w?.id || !user?.id) return;
    wordsApi.view(w.id, user.id).catch(() => {});
  }, [sessionWords, currentIndex, user?.id]);

  const toggleBookmark = async (wordId) => {
    if (!user?.id) return;
    await bookmarksApi.toggle(wordId, user.id);
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(wordId) ? next.delete(wordId) : next.add(wordId);
      return next;
    });
  };

  const startSession = (levelKey) => {
    const filtered = shuffle(words.filter((w) => w.level === levelKey)).slice(0, SESSION_SIZE);
    setSessionWords(filtered);
    setSelectedLevel(levelKey);
    setCurrentIndex(0);
    setShowMeaning(false);
    setFinished(false);
  };

  const resetToSelect = () => {
    setSelectedLevel(null);
    setSessionWords([]);
    setCurrentIndex(0);
    setShowMeaning(false);
    setFinished(false);
  };

  const goNext = () => {
    setCurrentIndex((i) => Math.min(i + 1, sessionWords.length - 1));
    setShowMeaning(false);
  };

  const goPrev = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
    setShowMeaning(false);
  };

  if (loading) return <FullCenter>🐯 단어를 불러오는 중...</FullCenter>;
  if (error)   return <FullCenter $error>{error}</FullCenter>;

  if (!selectedLevel) {
    return (
        <Page>
          <SelectWrap>
            <SelectTopBar>
              <BackBtn onClick={() => navigate('/dashboard')}>← 메인으로</BackBtn>
            </SelectTopBar>
            <Logo>🐯</Logo>
            <SelectTitle>어흥해보카 단어장</SelectTitle>
            <SelectSub>학습할 레벨을 선택하세요</SelectSub>
            <LevelGrid>
              {LEVELS.map((lv) => (
                  <LevelCard key={lv.key} $bg={lv.bg} $border={lv.border} onClick={() => startSession(lv.key)}>
                    <LvIcon>{lv.icon}</LvIcon>
                    <LvLabel $accent={lv.accent}>{lv.label}</LvLabel>
                    <LvKey>{lv.key}</LvKey>
                    <LvDesc>{lv.desc}</LvDesc>
                    <LvBtn $accent={lv.accent}>학습 시작 →</LvBtn>
                  </LevelCard>
              ))}
            </LevelGrid>
          </SelectWrap>
        </Page>
    );
  }

  const isDaily = selectedLevel === 'DAILY';
  const lv      = isDaily ? DAILY_META : LEVELS.find((l) => l.key === selectedLevel);
  const current = sessionWords[currentIndex];
  const isLast  = currentIndex === sessionWords.length - 1;
  const pct     = ((currentIndex + 1) / sessionWords.length) * 100;
  // daily 진입은 출구도 대시보드. 일반 진입은 레벨 선택 화면으로.
  const handleBack = () => (isDaily ? navigate('/dashboard') : resetToSelect());
  const backLabel  = isDaily ? '← 대시보드' : '← 레벨 선택';

  return (
      <Page>
        <StudyWrap>
          <TopBar>
            <BackBtn onClick={handleBack}>{backLabel}</BackBtn>
            <TopMeta>
              <TopBadge $accent={lv.accent}>
                <TopBadgeIcon>{lv.icon}</TopBadgeIcon>
                <TopBadgeLabel>{lv.label}</TopBadgeLabel>
              </TopBadge>
              <TopCount>{currentIndex + 1} / {sessionWords.length}</TopCount>
            </TopMeta>
            <Spacer />
          </TopBar>

          <ProgTrack>
            <ProgFill $pct={pct} $accent={lv.accent} />
          </ProgTrack>

          <Card $bg={lv.card} $border={lv.border} $expanded={showMeaning}>
            <BookmarkBtn
                $active={bookmarked.has(current.id)}
                onClick={() => toggleBookmark(current.id)}
                aria-label="북마크"
            >
              {bookmarked.has(current.id) ? '★' : '☆'}
            </BookmarkBtn>

            <Front>
              <Badges>
                <TypeTag $type={current.type}>{current.type}</TypeTag>
                {current.part && <PartTag>{current.part}</PartTag>}
              </Badges>

              <Word>{current.english}</Word>

              <Pronounce>
                <PronBtn onClick={() => speak(current.english, 'en-US')} aria-label="미국식 발음">
                  <PronFlag>🇺🇸</PronFlag><PronText>미국</PronText>
                </PronBtn>
                <PronBtn onClick={() => speak(current.english, 'en-GB')} aria-label="영국식 발음">
                  <PronFlag>🇬🇧</PronFlag><PronText>영국</PronText>
                </PronBtn>
              </Pronounce>

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
                        <ExEn>&ldquo;{current.example}&rdquo;</ExEn>
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
                  <DoneRetry
                    $accent={lv.accent}
                    onClick={() => {
                      // daily 세션 재시작 시에는 sessionWords 그대로 리셋, 일반 세션은 레벨 기준 재구성.
                      if (isDaily) {
                        setCurrentIndex(0); setShowMeaning(false); setFinished(false);
                      } else {
                        startSession(selectedLevel);
                      }
                    }}
                  >다시 학습하기</DoneRetry>
                  <DoneQuiz onClick={() => navigate('/quiz', { state: { words: sessionWords } })}>퀴즈 풀러가기 →</DoneQuiz>
                </DoneBtns>
                {/* 학습 완료 후 명확한 마무리 액션 — 양쪽 케이스 모두 대시보드로. */}
                <DoneFinish onClick={() => navigate('/dashboard')}>✓ 학습 마치기</DoneFinish>
                {/* 기존 보조 네비 — daily 면 대시보드, 일반이면 레벨 선택 화면. 학습 중간 이탈 톤의 가벼운 링크. */}
                <DoneOther onClick={handleBack}>{isDaily ? '대시보드로' : '다른 레벨 선택'}</DoneOther>
              </DoneBox>
          ) : (
              <Nav>
                <NavBtn onClick={goPrev} disabled={currentIndex === 0}>← 이전</NavBtn>
                <Dots>
                  {sessionWords
                      .slice(Math.max(0, currentIndex - 2), Math.min(sessionWords.length, currentIndex + 3))
                      .map((_, i) => {
                        const idx = Math.max(0, currentIndex - 2) + i;
                        return <Dot key={idx} $active={idx === currentIndex} $accent={lv.accent} />;
                      })}
                </Dots>
                {isLast && showMeaning ? (
                    <NavBtn onClick={() => setFinished(true)}>완료</NavBtn>
                ) : (
                    <NavBtn onClick={goNext} disabled={isLast}>다음 →</NavBtn>
                )}
              </Nav>
          )}
        </StudyWrap>
      </Page>
  );
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const Page = styled.div`
  min-height: 100vh; background: #FFF8F2;
  display: flex; flex-direction: column; align-items: center;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  position: relative; overflow-x: hidden;
`;
const SelectWrap = styled.div`
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center;
  padding: 48px 24px 60px; width: 100%; max-width: 900px;
`;
const StudyWrap = styled.div`
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center;
  padding: 36px 24px 60px; width: 100%; max-width: 680px;
`;
const SelectTopBar = styled.div`width: 100%; display: flex; align-items: center; margin-bottom: 24px;`;
const Logo = styled.div`font-size: 56px; line-height: 1; margin-bottom: 12px;`;
const SelectTitle = styled.h1`font-size: 28px; font-weight: 800; color: #1F2933; margin-bottom: 6px;`;
const SelectSub = styled.p`font-size: 15px; color: #9AA5B1; margin-bottom: 40px;`;
const LevelGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; width: 100%;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;
const LevelCard = styled.div`
  background: ${({ $bg }) => $bg}; border: 2px solid ${({ $border }) => $border};
  border-radius: 22px; padding: 32px 24px; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover { transform: translateY(-7px); box-shadow: 0 18px 40px rgba(246, 132, 31, 0.18); }
`;
const LvIcon  = styled.div`font-size: 42px; line-height: 1;`;
const LvLabel = styled.h2`font-size: 22px; font-weight: 800; color: ${({ $accent }) => $accent};`;
const LvKey   = styled.span`font-size: 11px; font-weight: 700; color: #B0926A; letter-spacing: .08em;`;
const LvDesc  = styled.p`font-size: 13px; color: #7A6550; line-height: 1.5;`;
const LvBtn   = styled.button`
  margin-top: 6px; width: 100%;
  background: ${({ $accent }) => $accent}; color: #fff;
  border: none; border-radius: 12px; padding: 11px 0;
  font-size: 14px; font-weight: 700; cursor: pointer;
  &:hover { opacity: .88; transform: scale(1.02); }
`;
const TopBar = styled.div`width: 100%; display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;`;
const BackBtn = styled.button`
  background: #fff; border: 1.5px solid #F6D8B8; border-radius: 10px;
  padding: 7px 14px; font-size: 13px; font-weight: 600; color: #B0926A; cursor: pointer;
  &:hover { border-color: #F6841F; color: #F6841F; }
`;
const TopMeta  = styled.div`display: flex; flex-direction: column; align-items: center; gap: 4px;`;
// TopBadge: inline-flex + 명시적 gap 으로 이모지/텍스트 line-height 차이 겹침 차단
const TopBadge = styled.span`
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 15px; font-weight: 700; color: ${({ $accent }) => $accent};
`;
const TopBadgeIcon  = styled.span`font-size: 18px; line-height: 1;`;
const TopBadgeLabel = styled.span`line-height: 1;`;
const TopCount = styled.span`font-size: 13px; font-weight: 600; color: #B0926A;`;
const Spacer   = styled.div`width: 88px;`;
const ProgTrack = styled.div`width: 100%; height: 7px; background: #FFE4C4; border-radius: 9999px; overflow: hidden; margin-bottom: 28px;`;
const ProgFill = styled.div`
  height: 100%; width: ${({ $pct }) => $pct}%;
  background: linear-gradient(90deg, ${({ $accent }) => $accent}, #FFB347);
  border-radius: 9999px; transition: width .4s ease;
`;
// 학습 중인 단어 주변 ±2 dots — Nav 안에 인디케이터로만 사용 (클릭 점프 X).
const Dots = styled.div`display: flex; gap: 6px; align-items: center;`;
const Dot = styled.div`
  width: ${({ $active }) => ($active ? '22px' : '8px')}; height: 8px;
  border-radius: 9999px;
  background: ${({ $active, $accent }) => ($active ? $accent : '#F6D8B8')};
  transition: all .25s ease;
`;
const Card = styled.div`
  position: relative; width: 100%;
  background: ${({ $bg }) => $bg}; border: 2px solid ${({ $border }) => $border};
  border-radius: 26px; padding: 56px 36px 40px;
  box-shadow: 0 8px 32px rgba(216, 106, 12, 0.10);
  min-height: ${({ $expanded }) => ($expanded ? '380px' : '300px')};
  transition: min-height .35s ease;
`;
// 우측 상단 북마크 — 카드 padding-top 을 충분히 줘서 Badges 와 안 겹치게.
const BookmarkBtn = styled.button`
  position: absolute; top: 16px; right: 18px; z-index: 2;
  background: none; border: none; font-size: 26px; cursor: pointer;
  color: ${({ $active }) => $active ? '#F6841F' : '#D4B896'};
  transition: color .15s, transform .15s;
  line-height: 1;
  &:hover { color: #F6841F; transform: scale(1.2); }
`;
const Front   = styled.div`display: flex; flex-direction: column; align-items: center; gap: 16px;`;
const Badges  = styled.div`display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;`;
const TypeTag = styled.span`
  font-size: 11px; font-weight: 700; padding: 3px 11px; border-radius: 9999px;
  background: ${({ $type }) => ($type === 'LC' ? '#FEF3C7' : '#FFF0DC')};
  color: ${({ $type }) => ($type === 'LC' ? '#D97706' : '#D86A0C')};
  line-height: 1.6;
`;
const PartTag = styled.span`
  font-size: 11px; font-weight: 600; padding: 3px 11px; border-radius: 9999px;
  background: #FFF0DC; color: #B07040; line-height: 1.6;
`;
const Word = styled.h2`
  font-size: 44px; font-weight: 800; color: #2D1B0E;
  letter-spacing: -.5px; text-align: center; line-height: 1.2;
  word-break: break-word;
`;
// 발음 버튼 그룹 — 단어 바로 아래에 가로 배치
const Pronounce = styled.div`
  display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;
`;
const PronBtn = styled.button`
  display: inline-flex; align-items: center; gap: 6px;
  background: #fff; border: 1.5px solid #F6D8B8;
  border-radius: 10px; padding: 7px 14px;
  font-size: 13px; font-weight: 700; color: #5C3A1A; cursor: pointer;
  transition: border-color .15s, transform .15s, background .15s;
  &:hover { border-color: #F6841F; background: #FFF8F2; transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;
const PronFlag = styled.span`font-size: 15px; line-height: 1;`;
const PronText = styled.span`line-height: 1;`;
const RevealBtn = styled.button`
  margin-top: 4px;
  background: ${({ $accent }) => $accent}20; color: ${({ $accent }) => $accent};
  border: 1.5px solid ${({ $accent }) => $accent}55; border-radius: 12px;
  padding: 10px 30px; font-size: 14px; font-weight: 700; cursor: pointer;
  &:hover { background: ${({ $accent }) => $accent}35; }
`;
const Back = styled.div`display: flex; flex-direction: column; align-items: center; gap: 16px; animation: ${fadeUp} .35s ease; margin-top: 8px;`;
const HDivider = styled.hr`width: 100%; border: none; border-top: 2px solid ${({ $accent }) => $accent}33; margin: 4px 0 0;`;
const Meaning = styled.p`font-size: 30px; font-weight: 800; color: #2D1B0E; text-align: center; line-height: 1.3;`;
const ExBox   = styled.div`background: #FFF3E0; border-left: 4px solid ${({ $accent }) => $accent}; border-radius: 10px; padding: 14px 20px; width: 100%;`;
const ExEn = styled.p`font-size: 14px; color: #3D2B18; font-style: italic; line-height: 1.7;`;
const ExKo = styled.p`font-size: 13px; color: #B07040; margin-top: 6px; line-height: 1.6;`;
const Nav  = styled.div`
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-top: 24px;
`;
const NavBtn = styled.button`
  background: #fff; color: #F6841F; border: 2px solid #F6841F;
  border-radius: 12px; padding: 11px 26px; font-size: 15px; font-weight: 700; cursor: pointer;
  &:disabled { background: #FFF3E0; color: #C8A882; border-color: #F6D8B8; cursor: default; }
  &:hover:not(:disabled) { background: #FFF4E6; transform: scale(1.03); }
`;
const DoneBox        = styled.div`display: flex; flex-direction: column; align-items: center; gap: 10px; margin-top: 32px; animation: ${fadeUp} .4s ease;`;
const DoneTiger      = styled.div`font-size: 64px; line-height: 1; margin-bottom: 6px;`;
const DoneMsg        = styled.p`font-size: 22px; font-weight: 800; color: #2D1B0E;`;
const DoneSub        = styled.p`font-size: 15px; color: #B07040;`;
const DoneMotivation = styled.p`font-size: 14px; color: #B07040; text-align: center; line-height: 1.6; max-width: 320px; background: #FFF3E0; border-radius: 12px; padding: 12px 20px;`;
const DoneBtns       = styled.div`display: flex; gap: 10px; margin-top: 8px; flex-wrap: wrap; justify-content: center;`;
const DoneRetry      = styled.button`background: ${({ $accent }) => $accent}; color: #fff; border: none; border-radius: 12px; padding: 12px 28px; font-size: 15px; font-weight: 700; cursor: pointer; &:hover { opacity: .88; }`;
const DoneQuiz       = styled.button`background: #fff; color: #F6841F; border: 2px solid #F6841F; border-radius: 12px; padding: 12px 28px; font-size: 15px; font-weight: 700; cursor: pointer; &:hover { background: #FFF4E6; }`;
// 신규 — 학습 완수 톤의 명확한 마무리 액션. outline 버튼, 항상 대시보드로.
const DoneFinish = styled.button`
  background: #fff;
  color: #B07040;
  border: 1.5px solid #F6D8B8;
  border-radius: 12px;
  padding: 10px 24px;
  margin-top: 4px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: border-color .15s, color .15s, transform .15s;
  &:hover { border-color: #F6841F; color: #F6841F; transform: translateY(-1px); }
`;
// 기존 보조 네비 — 밑줄 텍스트, 이탈 톤의 가벼운 링크.
const DoneOther = styled.button`
  background: transparent; color: #B0926A; border: none;
  border-radius: 12px; padding: 8px 20px; font-size: 14px; font-weight: 600;
  cursor: pointer; text-decoration: underline; text-underline-offset: 3px;
  &:hover { color: #F6841F; }
`;
const FullCenter     = styled.div`display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 16px; color: ${({ $error }) => ($error ? '#DC2626' : '#B07040')}; font-family: 'Pretendard', sans-serif; background: #FFF8F2;`;
