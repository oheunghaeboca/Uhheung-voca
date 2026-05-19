import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import TodayWordsCard from '../../components/dashboard/TodayWordsCard';

const MOCK = {
  attendanceDays: 22,
  progress: {
    words: { done: 48, total: 100 },
    quiz:  { done: 6,  total: 10  },
  },
  cards: [
    { title: '단어 학습',  desc: '오늘의 단어를 학습하세요',   icon: '📖', path: '/flashcard' },
    { title: '퀴즈 풀기',  desc: 'TOEIC 유형 퀴즈를 풀어요', icon: '✏️', path: '/quiz'      },
    { title: '오답 노트',  desc: '틀린 단어를 다시 복습해요', icon: '🔖', path: '/wrong-notes' },
  ],
  stats: [
    { label: '학습 단어', value: '48개', icon: '📚' },
    { label: '퀴즈 점수', value: '85점', icon: '🎯' },
    { label: '연속 출석', value: '7일',  icon: '🔥' },
    { label: '북마크',   value: '12개', icon: '⭐' },
  ],
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { attendanceDays, progress, cards, stats } = MOCK;

  // 닉네임 우선, 없으면 username, 둘 다 없으면 빈 문자열.
  const displayName = user?.nickname || user?.username || '';

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const wordPct = Math.round((progress.words.done / progress.words.total) * 100);
  const quizPct = Math.round((progress.quiz.done  / progress.quiz.total)  * 100);

  return (
    <Page>
      <TigerBg />

      <Header>
        <Logo>🐯 어흥해보카</Logo>
        <HeaderCenter>
          <AttendBadge>🏆 {attendanceDays}일 출석</AttendBadge>
          <Greeting>안녕하세요, <strong>{displayName}</strong>님!</Greeting>
        </HeaderCenter>
        <HeaderBtns>
          <OutlineBtn onClick={handleLogout}>로그아웃</OutlineBtn>
        </HeaderBtns>
      </Header>

      <Content>
        <ProgressCard>
          <SectionTitle>오늘의 학습 목표</SectionTitle>
          {[
            { label: '단어 학습', done: progress.words.done, total: progress.words.total, unit: '개', pct: wordPct },
            { label: '퀴즈',     done: progress.quiz.done,  total: progress.quiz.total,  unit: '회', pct: quizPct },
          ].map((p) => (
            <ProgItem key={p.label}>
              <ProgLabel><span>{p.label}</span><span>{p.done} / {p.total}{p.unit}</span></ProgLabel>
              <ProgTrack><ProgFill $pct={p.pct} /></ProgTrack>
            </ProgItem>
          ))}
        </ProgressCard>

        <TodayWordsCard />

        <Banner>
          <BannerLeft>
            <BannerTitle>TOEIC 단어<br />지금 바로 시작하세요!</BannerTitle>
            <BannerSub>매일 꾸준히 단어를 학습하고 목표 점수를 달성해보세요.</BannerSub>
            <StartBtn onClick={() => navigate('/flashcard')}>단어 학습 시작 →</StartBtn>
          </BannerLeft>
          <BannerTiger>🐯</BannerTiger>
        </Banner>

        <SectionTitle style={{ marginBottom: 16 }}>학습 메뉴</SectionTitle>
        <CardGrid>
          {cards.map((c, i) => (
            <MenuCard key={c.title} $idx={i} onClick={() => navigate(c.path)}>
              <MenuIcon>{c.icon}</MenuIcon>
              <MenuTitle>{c.title}</MenuTitle>
              <MenuDesc>{c.desc}</MenuDesc>
              <MenuArrow>→</MenuArrow>
            </MenuCard>
          ))}
        </CardGrid>

        <SectionTitle style={{ margin: '32px 0 16px' }}>나의 학습 현황</SectionTitle>
        <StatsGrid>
          {stats.map((s) => (
            <StatCard key={s.label}>
              <StatIcon>{s.icon}</StatIcon>
              <StatValue>{s.value}</StatValue>
              <StatLabel>{s.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </Content>
    </Page>
  );
}

/* ── Keyframes ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ── Layout ── */
const Page = styled.div`
  min-height: 100vh;
  background: #FFF8F2;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
  position: relative;
`;

const TigerBg = styled.div``;

/* ── Header ── */
const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 200;
  background: rgba(255, 248, 242, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1.5px solid #F6D8B8;
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #D86A0C;
`;

const HeaderCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
`;

const AttendBadge = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #D86A0C;
  background: #FFE4C4;
  border: 1px solid #F6D8B8;
  border-radius: 9999px;
  padding: 2px 12px;
`;

const Greeting = styled.p`
  font-size: 13px;
  color: #B07040;
  strong { color: #2D1B0E; }
`;

const HeaderBtns = styled.div`display: flex; gap: 8px;`;

const OutlineBtn = styled.button`
  background: none;
  border: 1.5px solid #F6D8B8;
  font-size: 13px;
  color: #B07040;
  cursor: pointer;
  padding: 6px 14px;
  border-radius: 8px;
  transition: border-color .15s, color .15s;
  &:hover { border-color: #F6841F; color: #F6841F; }
`;

/* ── Content ── */
const Content = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px;
  position: relative;
  z-index: 1;
  animation: ${fadeUp} .4s ease;
`;

const SectionTitle = styled.h2`
  font-size: 17px;
  font-weight: 800;
  color: #2D1B0E;
`;

/* ── Progress ── */
const ProgressCard = styled.div`
  background: #fff;
  border: 1.5px solid #F6D8B8;
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(216, 106, 12, 0.07);

  ${SectionTitle} { margin-bottom: 16px; }
`;

const ProgItem = styled.div`& + & { margin-top: 14px; }`;

const ProgLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #B07040;
  margin-bottom: 6px;
`;

const ProgTrack = styled.div`
  height: 10px;
  background: #FFF0DC;
  border-radius: 9999px;
  overflow: hidden;
`;

const ProgFill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: linear-gradient(90deg, #F6841F, #FFB347);
  border-radius: 9999px;
  transition: width .6s ease;
`;

/* ── Banner ── */
const Banner = styled.section`
  background: linear-gradient(135deg, #F6841F 0%, #D86A0C 100%);
  border-radius: 22px;
  padding: 40px 48px;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8px 24px rgba(216, 106, 12, 0.22);
`;

const BannerLeft = styled.div`flex: 1;`;

const BannerTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #fff;
  line-height: 1.35;
  margin-bottom: 10px;
`;

const BannerSub = styled.p`
  font-size: 14px;
  color: rgba(255,255,255,.82);
  margin-bottom: 22px;
`;

const StartBtn = styled.button`
  background: #fff;
  color: #D86A0C;
  font-size: 15px;
  font-weight: 800;
  border: none;
  border-radius: 12px;
  padding: 12px 28px;
  cursor: pointer;
  transition: transform .15s, box-shadow .15s;
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.15); }
`;

const BannerTiger = styled.div`
  font-size: 96px;
  line-height: 1;
  transform: scaleX(-1);
  filter: drop-shadow(0 4px 8px rgba(0,0,0,.15));
`;

/* ── 학습 메뉴 카드 ── */
const CARD_BG = ['#FFF3E0', '#FFE8D2', '#FFDFC4'];

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const MenuCard = styled.div`
  background: ${({ $idx }) => CARD_BG[$idx] ?? '#FFF3E0'};
  border: 1.5px solid #F6D8B8;
  border-radius: 18px;
  padding: 28px 22px;
  cursor: pointer;
  position: relative;
  transition: transform .2s, box-shadow .2s;
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 14px 32px rgba(216, 106, 12, 0.16);
  }
`;

const MenuIcon  = styled.div`font-size: 34px; margin-bottom: 10px;`;
const MenuTitle = styled.h3`font-size: 16px; font-weight: 800; color: #2D1B0E; margin-bottom: 5px;`;
const MenuDesc  = styled.p`font-size: 13px; color: #B07040; line-height: 1.5;`;

const MenuArrow = styled.span`
  position: absolute;
  bottom: 20px;
  right: 22px;
  font-size: 18px;
  color: #F6841F;
  opacity: .6;
`;

/* ── 통계 ── */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
`;

const StatCard = styled.div`
  background: #fff;
  border: 1.5px solid #F6D8B8;
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(216, 106, 12, 0.07);
`;

const StatIcon  = styled.div`font-size: 24px; margin-bottom: 8px;`;
const StatValue = styled.div`font-size: 20px; font-weight: 800; color: #F6841F; margin-bottom: 4px;`;
const StatLabel = styled.div`font-size: 12px; color: #B0926A; font-weight: 600;`;
