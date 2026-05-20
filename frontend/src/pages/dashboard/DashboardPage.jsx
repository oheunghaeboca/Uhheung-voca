import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { dashboardApi } from '../../api/dashboard';
import { rankingApi } from '../../api/ranking';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const displayName = user?.nickname || user?.username || '';

  const [summary, setSummary] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [rankPeriod, setRankPeriod] = useState('ALL');

  useEffect(() => {
    if (!user?.id) return;
    const now = new Date();
    dashboardApi.summary(user.id).then(setSummary).catch(console.error);
    dashboardApi.attendance(user.id, now.getFullYear(), now.getMonth() + 1)
        .then(setAttendance).catch(console.error);
  }, [user?.id]);

  useEffect(() => {
    rankingApi.list({ period: rankPeriod, size: 10 }).then(setRanking).catch(console.error);
  }, [rankPeriod]);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const attendedSet = new Set(attendance.filter((a) => a.attended).map((a) => a.date));
  const attendanceDays = attendedSet.size;
  const averageScore = summary?.averageScore != null ? Number(summary.averageScore) : 0;
  const totalQuizzes = summary?.totalQuizzes ?? 0;
  const currentStreak = summary?.currentStreak ?? 0;

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  const cards = [
    { title: '단어 학습', desc: '오늘의 단어를 학습하세요', icon: '📖', path: '/flashcard' },
    { title: '퀴즈 풀기', desc: 'TOEIC 유형 퀴즈를 풀어요', icon: '✏️', path: '/quiz' },
    { title: '오답 노트', desc: '틀린 단어를 다시 복습해요', icon: '🔖', path: '/wrong-notes' },
  ];

  const medal = (rank) => rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

  return (
      <Page>
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
          {/* 배너 */}
          <Banner>
            <BannerLeft>
              <BannerTitle>TOEIC 단어<br />지금 바로 시작하세요!</BannerTitle>
              <BannerSub>매일 꾸준히 단어를 학습하고 목표 점수를 달성해보세요.</BannerSub>
              <StartBtn onClick={() => navigate('/flashcard')}>단어 학습 시작 →</StartBtn>
            </BannerLeft>
            <BannerTiger>🐯</BannerTiger>
          </Banner>

          {/* 통계 */}
          <SectionTitle style={{ marginBottom: 16 }}>나의 학습 현황</SectionTitle>
          <StatsGrid>
            <StatCard $bg="#FFF3E0">
              <StatEmoji>🔥</StatEmoji>
              <StatValue $color="#F6841F">{currentStreak}일</StatValue>
              <StatLabel>연속 출석</StatLabel>
            </StatCard>
            <StatCard $bg="#F0FFF4">
              <StatEmoji>🏆</StatEmoji>
              <StatValue $color="#4CAF50">{averageScore.toFixed(1)}점</StatValue>
              <StatLabel>평균 점수</StatLabel>
            </StatCard>
            <StatCard $bg="#EFF6FF">
              <StatEmoji>📅</StatEmoji>
              <StatValue $color="#2196F3">{attendanceDays}일</StatValue>
              <StatLabel>이달 출석</StatLabel>
            </StatCard>
            <StatCard $bg="#FFFBEB">
              <StatEmoji>✏️</StatEmoji>
              <StatValue $color="#F59E0B">{totalQuizzes}회</StatValue>
              <StatLabel>완료한 퀴즈</StatLabel>
            </StatCard>
          </StatsGrid>

          {/* 학습 메뉴 */}
          <SectionTitle style={{ margin: '32px 0 16px' }}>학습 메뉴</SectionTitle>
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

          {/* 랭킹 */}
          <RankingSection>
            <RankingHeader>
              <div>
                <SectionTitle style={{ margin: 0 }}>🏆 랭킹</SectionTitle>
                <RankingSub>다른 사용자들과 경쟁해보세요!</RankingSub>
              </div>
              <TabGroup>
                {[
                  { key: 'WEEKLY', label: '주간' },
                  { key: 'MONTHLY', label: '월간' },
                  { key: 'ALL', label: '전체' },
                ].map((t) => (
                    <TabBtn key={t.key} $active={rankPeriod === t.key} onClick={() => setRankPeriod(t.key)}>
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
const Banner = styled.section`
  background: linear-gradient(135deg, #F6841F 0%, #D86A0C 100%);
  border-radius: 22px; padding: 40px 48px; margin-bottom: 32px;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 8px 24px rgba(216,106,12,0.22);
`;
const BannerLeft = styled.div`flex: 1;`;
const BannerTitle = styled.h1`font-size: 26px; font-weight: 800; color: #fff; line-height: 1.35; margin-bottom: 10px;`;
const BannerSub = styled.p`font-size: 14px; color: rgba(255,255,255,.82); margin-bottom: 22px;`;
const StartBtn = styled.button`
  background: #fff; color: #D86A0C; font-size: 15px; font-weight: 800;
  border: none; border-radius: 12px; padding: 12px 28px; cursor: pointer;
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.15); }
`;
const BannerTiger = styled.div`font-size: 96px; line-height: 1; transform: scaleX(-1);`;

const StatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(4,1fr); gap: 12px;
  @media (max-width: 768px) { grid-template-columns: repeat(2,1fr); }
`;
const StatCard = styled.div`
  background: ${({ $bg }) => $bg ?? '#FFF8F2'};
  border-radius: 14px; padding: 20px 12px; text-align: center;
`;
const StatEmoji = styled.div`font-size: 22px; margin-bottom: 8px;`;
const StatValue = styled.div`
  font-size: 26px; font-weight: 800;
  color: ${({ $color }) => $color ?? '#F6841F'}; margin-bottom: 4px;
`;
const StatLabel = styled.div`font-size: 12px; color: #B07040; font-weight: 600;`;

const CARD_BG = ['#FFF3E0', '#FFE8D2', '#FFDFC4'];
const CardGrid = styled.div`
  display: grid; grid-template-columns: repeat(3,1fr); gap: 16px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;
const MenuCard = styled.div`
  background: ${({ $idx }) => CARD_BG[$idx] ?? '#FFF3E0'};
  border: 1.5px solid #F6D8B8; border-radius: 18px;
  padding: 28px 22px; cursor: pointer; position: relative;
  transition: transform .2s, box-shadow .2s;
  &:hover { transform: translateY(-6px); box-shadow: 0 14px 32px rgba(216,106,12,0.16); }
`;
const MenuIcon  = styled.div`font-size: 34px; margin-bottom: 10px;`;
const MenuTitle = styled.h3`font-size: 16px; font-weight: 800; color: #2D1B0E; margin-bottom: 5px;`;
const MenuDesc  = styled.p`font-size: 13px; color: #B07040; line-height: 1.5;`;
const MenuArrow = styled.span`
  position: absolute; bottom: 20px; right: 22px;
  font-size: 18px; color: #F6841F; opacity: .6;
`;

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
  background: ${({ $active }) => $active ? '#F6841F' : '#FFF0DC'};
  color: ${({ $active }) => $active ? '#fff' : '#B07040'};
  transition: background .15s;
`;
const EmptyRank = styled.div`text-align: center; color: #B07040; padding: 32px; font-size: 14px;`;
const RankList = styled.div`display: flex; flex-direction: column; gap: 8px;`;
const RankRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 16px; border-radius: 12px;
  background: ${({ $top, $isMe }) => $isMe ? '#FFF3E0' : $top ? '#FFFBF5' : '#FAFAFA'};
  border: 1.5px solid ${({ $isMe }) => $isMe ? '#F6D8B8' : 'transparent'};
`;
const RankLeft = styled.div`display: flex; align-items: center; gap: 12px;`;
const RankBadge = styled.div`
  width: 36px; height: 36px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  background: ${({ $rank }) => $rank === 1 ? '#FFF9C4' : $rank === 2 ? '#F5F5F5' : $rank === 3 ? '#FFE8D2' : '#F0F0F0'};
`;
const RankNum = styled.span`font-size: 13px; font-weight: 700; color: #999;`;
const RankName = styled.span`
  font-size: 15px; font-weight: ${({ $isMe }) => $isMe ? 800 : 500};
  color: ${({ $isMe }) => $isMe ? '#D86A0C' : '#2D1B0E'};
`;
const RankScore = styled.span`
  font-size: 15px; font-weight: 700;
  color: ${({ $rank }) => $rank === 1 ? '#F59E0B' : $rank === 2 ? '#9E9E9E' : $rank === 3 ? '#F6841F' : '#B07040'};
`;