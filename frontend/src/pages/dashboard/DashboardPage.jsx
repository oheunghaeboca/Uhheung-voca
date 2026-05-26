import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { dashboardApi } from '../../api/dashboard';
import { rankingApi } from '../../api/ranking';
import { wordsApi } from '../../api/words';
import { bookmarksApi } from '../../api/bookmarks';
import TodayWordsCard from '../../components/dashboard/TodayWordsCard';
import TodayMissionCard from '../../components/dashboard/TodayMissionCard';

// V0 시안의 '등급별 단어 학습' 카드 — green/blue/purple 톤. 클릭 시 단어 목록을 해당 레벨 필터로 진입.
const LEVEL_CARDS = [
  { key: 'BASIC',    title: '토익 필수 어휘',   desc: '기본이 되는 핵심 단어',   icon: '🌿', accent: '#16A34A', bg: '#E8F5EE', border: '#BFE6CD' },
  { key: 'FREQUENT', title: '토익 빈출 어휘',   desc: '자주 출제되는 단어',       icon: '⚡', accent: '#2563EB', bg: '#DBEAFE', border: '#BFDBFE' },
  { key: 'ADVANCED', title: '토익 고득점 어휘', desc: '고급 어휘력을 위한 단어',  icon: '⭐', accent: '#9333EA', bg: '#F3E8FF', border: '#E9D5FF' },
];

const RANK_TABS = [
  { key: 'WEEKLY',  label: '주간' },
  { key: 'MONTHLY', label: '월간' },
  { key: 'ALL',     label: '전체' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const displayName = user?.nickname || user?.username || '';

  const [summary,    setSummary]    = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [ranking,    setRanking]    = useState([]);
  const [rankPeriod, setRankPeriod] = useState('ALL');
  const [allWords,   setAllWords]   = useState([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    if (!user?.id) return;
    const now = new Date();
    dashboardApi.summary(user.id).then(setSummary).catch(console.error);
    dashboardApi
      .attendance(user.id, now.getFullYear(), now.getMonth() + 1)
      .then(setAttendance)
      .catch(console.error);
    bookmarksApi.list(user.id)
      .then((list) => setBookmarkCount(Array.isArray(list) ? list.length : 0))
      .catch(() => {});
  }, [user?.id]);

  useEffect(() => {
    wordsApi.list().then((list) => setAllWords(Array.isArray(list) ? list : [])).catch(() => {});
  }, []);

  useEffect(() => {
    rankingApi.list({ period: rankPeriod, size: 10 }).then(setRanking).catch(console.error);
  }, [rankPeriod]);

  // 레벨별 단어 수 — Level Selection 카드의 카운트 배지.
  const levelCounts = useMemo(() => {
    const acc = { BASIC: 0, FREQUENT: 0, ADVANCED: 0 };
    for (const w of allWords) if (acc[w.level] !== undefined) acc[w.level] += 1;
    return acc;
  }, [allWords]);

  const now = new Date();
  const attendedSet  = new Set(attendance.filter((a) => a.attended).map((a) => a.date));
  const attendanceDays = attendedSet.size;
  const averageScore = summary?.averageScore != null ? Number(summary.averageScore) : 0;
  const currentStreak = summary?.currentStreak ?? 0;
  const totalWords = allWords.length;

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };
  const handleLevelClick = (level) => navigate(`/words?level=${level}`);

  const medal = (rank) => (rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null);

  return (
    <Page>
      <Header>
        <Logo>🐯 어흥해보카</Logo>
        <HeaderCenter>
          <AttendBadge>🏆 {attendanceDays}일 출석</AttendBadge>
          <Greeting>안녕하세요, <strong>{displayName}</strong>님!</Greeting>
        </HeaderCenter>
        <HeaderBtns>
          <OutlineBtn onClick={() => navigate('/mypage')}>마이페이지</OutlineBtn>
          <OutlineBtn onClick={handleLogout}>로그아웃</OutlineBtn>
        </HeaderBtns>
      </Header>

      <Content>
        {/* 0) 환영 배너 — '단어 학습 시작' 은 레벨 선택 화면으로. daily 학습은 아래 TodayWordsCard 에서 진입. */}
        <Banner>
          <BannerLeft>
            <BannerTitle>TOEIC 단어<br />지금 바로 시작하세요!</BannerTitle>
            <BannerSub>매일 꾸준히 단어를 학습하고 목표 점수를 달성해보세요.</BannerSub>
            <BannerBtn onClick={() => navigate('/flashcard')}>단어 학습 시작 →</BannerBtn>
          </BannerLeft>
          <BannerTiger>🐯</BannerTiger>
        </Banner>

        {/* 1) 오늘의 추천 단어 + 학습 시작 — 학습 진입점 */}
        <TodayWordsCard />

        {/* 2) 오늘의 학습 목표 (Daily Goal Progress) */}
        <TodayMissionCard />

        {/* 3) 등급별 단어 학습 — V0 Level Selection */}
        <SectionTitle style={{ margin: '8px 0 16px' }}>등급별 단어 학습</SectionTitle>
        <LevelGrid>
          {LEVEL_CARDS.map((lv) => (
            <LevelCard
              key={lv.key}
              $bg={lv.bg}
              $border={lv.border}
              onClick={() => handleLevelClick(lv.key)}
              role="button"
              tabIndex={0}
            >
              <LvHead>
                <LvIcon $accent={lv.accent} $bg={`${lv.accent}1A`}>{lv.icon}</LvIcon>
              </LvHead>
              <LvTitle>{lv.title}</LvTitle>
              <LvDesc>{lv.desc}</LvDesc>
              <LvFoot>
                <LvCount>{levelCounts[lv.key]}</LvCount>
                <LvUnit>단어</LvUnit>
              </LvFoot>
            </LevelCard>
          ))}
        </LevelGrid>

        {/* 4) 나의 학습 현황 — V0 Stats Overview (5개 카드) */}
        <SectionTitle style={{ margin: '32px 0 16px' }}>나의 학습 현황</SectionTitle>
        <StatsGrid>
          <StatCard $bg="#FFF3E0">
            <StatEmoji>📚</StatEmoji>
            <StatValue $color="#F6841F">{totalWords}</StatValue>
            <StatLabel>전체 단어</StatLabel>
          </StatCard>
          <StatCard $bg="#F0FFF4">
            <StatEmoji>🎯</StatEmoji>
            <StatValue $color="#16A34A">{averageScore.toFixed(1)}%</StatValue>
            <StatLabel>평균 정답률</StatLabel>
          </StatCard>
          <StatCard $bg="#FFF8E1">
            <StatEmoji>🔥</StatEmoji>
            <StatValue $color="#F59E0B">{currentStreak}일</StatValue>
            <StatLabel>연속 출석</StatLabel>
          </StatCard>
          <StatCard $bg="#EFF6FF">
            <StatEmoji>📅</StatEmoji>
            <StatValue $color="#2563EB">{attendanceDays}일</StatValue>
            <StatLabel>이달 출석</StatLabel>
          </StatCard>
          <StatCard $bg="#FFFBEB">
            <StatEmoji>🔖</StatEmoji>
            <StatValue $color="#D97706">{bookmarkCount}</StatValue>
            <StatLabel>북마크</StatLabel>
          </StatCard>
        </StatsGrid>

        {/* 5) 랭킹 */}
        <RankingSection>
          <RankingHeader>
            <div>
              <SectionTitle style={{ margin: 0 }}>🏆 랭킹</SectionTitle>
              <RankingSub>다른 사용자들과 경쟁해보세요!</RankingSub>
            </div>
            <TabGroup>
              {RANK_TABS.map((t) => (
                <TabBtn
                  key={t.key}
                  $active={rankPeriod === t.key}
                  onClick={() => setRankPeriod(t.key)}
                >
                  {t.label}
                </TabBtn>
              ))}
            </TabGroup>
          </RankingHeader>

          {ranking.length === 0 ? (
            <EmptyRank>랭킹 데이터가 없습니다.</EmptyRank>
          ) : (
            <RankList>
              {ranking.map((row) => {
                const m = medal(row.rank);
                const isMe = row.userId === user?.id;
                return (
                  <RankRow key={row.userId} $top={row.rank <= 3} $isMe={isMe}>
                    <RankLeft>
                      <RankBadge $rank={row.rank}>
                        {m ? m : <RankNum>{row.rank}</RankNum>}
                      </RankBadge>
                      <RankName $isMe={isMe}>{row.nickname}{isMe ? ' (나)' : ''}</RankName>
                    </RankLeft>
                    <RankScore $rank={row.rank}>{Number(row.score).toFixed(1)}점</RankScore>
                  </RankRow>
                );
              })}
            </RankList>
          )}
        </RankingSection>
      </Content>
    </Page>
  );
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
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
const Logo = styled.div`font-size: 20px; font-weight: 800; color: #D86A0C;`;
const HeaderCenter = styled.div`display: flex; flex-direction: column; align-items: center; gap: 2px;`;
const AttendBadge = styled.span`
  font-size: 12px; font-weight: 700; color: #D86A0C;
  background: #FFE4C4; border: 1px solid #F6D8B8;
  border-radius: 9999px; padding: 2px 12px;
`;
const Greeting = styled.p`font-size: 13px; color: #B07040; strong { color: #2D1B0E; }`;
const HeaderBtns = styled.div`display: flex; gap: 8px;`;
const OutlineBtn = styled.button`
  background: none; border: 1.5px solid #F6D8B8;
  font-size: 13px; color: #B07040; cursor: pointer;
  padding: 6px 14px; border-radius: 8px;
  &:hover { border-color: #F6841F; color: #F6841F; }
`;

const Content = styled.main`
  max-width: 1100px; margin: 0 auto; padding: 32px 24px;
  animation: ${fadeUp} .4s ease;
`;
const SectionTitle = styled.h2`font-size: 17px; font-weight: 800; color: #2D1B0E;`;

// 환영 배너 — 주황 그라데이션 + 호랑이 일러스트 + '단어 학습 시작' CTA. 클릭은 레벨 선택 화면(/flashcard)으로.
const Banner = styled.section`
  background: linear-gradient(135deg, #F6841F 0%, #D86A0C 100%);
  border-radius: 22px; padding: 40px 48px; margin-bottom: 24px;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 8px 24px rgba(216, 106, 12, 0.22);
`;
const BannerLeft = styled.div`flex: 1;`;
const BannerTitle = styled.h1`
  font-size: 26px; font-weight: 800; color: #fff;
  line-height: 1.35; margin-bottom: 10px;
`;
const BannerSub = styled.p`
  font-size: 14px; color: rgba(255,255,255,.82); margin-bottom: 22px;
`;
const BannerBtn = styled.button`
  background: #fff; color: #D86A0C;
  font-size: 15px; font-weight: 800;
  border: none; border-radius: 12px; padding: 12px 28px; cursor: pointer;
  transition: transform .15s, box-shadow .15s;
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.15); }
`;
const BannerTiger = styled.div`
  font-size: 96px; line-height: 1; transform: scaleX(-1);
`;

// 등급별 단어 학습 카드 (V0 Level Selection)
const LevelGrid = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const LevelCard = styled.div`
  background: ${({ $bg }) => $bg};
  border: 1.5px solid ${({ $border }) => $border};
  border-radius: 18px; padding: 22px;
  cursor: pointer;
  transition: transform .2s, box-shadow .2s;
  display: flex; flex-direction: column; gap: 8px;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.08); }
`;
const LvHead = styled.div`display: flex; align-items: center;`;
const LvIcon = styled.div`
  width: 44px; height: 44px;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 12px;
  background: ${({ $bg }) => $bg};
  color: ${({ $accent }) => $accent};
  font-size: 22px; line-height: 1;
`;
const LvTitle = styled.h3`font-size: 16px; font-weight: 800; color: #2D1B0E; margin-top: 6px;`;
const LvDesc  = styled.p`font-size: 13px; color: #5C3A1A; line-height: 1.5;`;
const LvFoot  = styled.div`display: flex; align-items: baseline; justify-content: space-between; margin-top: 8px;`;
const LvCount = styled.span`font-size: 24px; font-weight: 800; color: #2D1B0E;`;
const LvUnit  = styled.span`font-size: 12px; color: #B07040;`;

// Stats Overview (5개 카드)
const StatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px;
  @media (max-width: 1024px) { grid-template-columns: repeat(3, 1fr); }
  @media (max-width: 640px)  { grid-template-columns: repeat(2, 1fr); }
`;
const StatCard = styled.div`
  background: ${({ $bg }) => $bg ?? '#FFF8F2'};
  border-radius: 14px; padding: 20px 12px; text-align: center;
`;
const StatEmoji = styled.div`font-size: 22px; margin-bottom: 8px; line-height: 1;`;
const StatValue = styled.div`
  font-size: 22px; font-weight: 800;
  color: ${({ $color }) => $color ?? '#F6841F'}; margin-bottom: 4px;
`;
const StatLabel = styled.div`font-size: 12px; color: #B07040; font-weight: 600;`;

// 랭킹 섹션
const RankingSection = styled.div`
  margin-top: 32px; background: #fff;
  border: 1.5px solid #F6D8B8; border-radius: 20px; padding: 28px;
  box-shadow: 0 2px 8px rgba(216,106,12,0.07);
`;
const RankingHeader = styled.div`
  display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;
`;
const RankingSub = styled.p`font-size: 13px; color: #B07040; margin: 4px 0 0;`;
const TabGroup = styled.div`display: flex; gap: 6px;`;
const TabBtn = styled.button`
  padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; cursor: pointer; border: none;
  background: ${({ $active }) => ($active ? '#F6841F' : '#FFF0DC')};
  color: ${({ $active }) => ($active ? '#fff' : '#B07040')};
  transition: background .15s;
`;
const EmptyRank = styled.div`text-align: center; color: #B07040; padding: 32px; font-size: 14px;`;
const RankList = styled.div`display: flex; flex-direction: column; gap: 8px;`;
const RankRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-radius: 12px;
  background: ${({ $top, $isMe }) => ($isMe ? '#FFF3E0' : $top ? '#FFFBF5' : '#FAFAFA')};
  border: 1.5px solid ${({ $isMe }) => ($isMe ? '#F6D8B8' : 'transparent')};
`;
const RankLeft = styled.div`display: flex; align-items: center; gap: 12px;`;
const RankBadge = styled.div`
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; line-height: 1;
  background: ${({ $rank }) => ($rank === 1 ? '#FFF9C4' : $rank === 2 ? '#F5F5F5' : $rank === 3 ? '#FFE8D2' : '#F0F0F0')};
`;
const RankNum = styled.span`font-size: 13px; font-weight: 700; color: #999;`;
const RankName = styled.span`
  font-size: 15px; font-weight: ${({ $isMe }) => ($isMe ? 800 : 500)};
  color: ${({ $isMe }) => ($isMe ? '#D86A0C' : '#2D1B0E')};
`;
const RankScore = styled.span`
  font-size: 15px; font-weight: 700;
  color: ${({ $rank }) => ($rank === 1 ? '#F59E0B' : $rank === 2 ? '#9E9E9E' : $rank === 3 ? '#F6841F' : '#B07040')};
`;
