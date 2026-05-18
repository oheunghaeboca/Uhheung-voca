import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { dashboardApi } from '../../api/dashboard';

export default function MyPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        if (!user?.id) return;
        const now = new Date();
        dashboardApi.summary(user.id).then(setSummary).catch(console.error);
        dashboardApi.attendance(user.id, now.getFullYear(), now.getMonth() + 1)
            .then(setAttendance).catch(console.error);
    }, [user?.id]);

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    const attendedSet = new Set(attendance.filter((a) => a.attended).map((a) => a.date));
    const attendanceDays = attendedSet.size;
    const averageScore = summary?.averageScore != null ? Number(summary.averageScore) : 0;
    const totalQuizzes = summary?.totalQuizzes ?? 0;
    const currentStreak = summary?.currentStreak ?? 0;

    const weekDays = ['월','화','수','목','금','토','일'];
    const todayDow = now.getDay();
    const weekAttended = weekDays.map((_, i) => {
        const diff = i - (todayDow === 0 ? 6 : todayDow - 1);
        const d = new Date(now);
        d.setDate(now.getDate() + diff);
        const str = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        return { label: weekDays[i], attended: attendedSet.has(str), future: diff > 0 };
    });

    const badges = [
        { icon: '🔥', title: `${currentStreak}일 연속 출석`, desc: currentStreak >= 7 ? '달성!' : `${currentStreak}/7일`, done: currentStreak >= 7 },
        { icon: '🏆', title: '정답률 80%+', desc: averageScore >= 80 ? '달성!' : `${averageScore.toFixed(0)}%/80%`, done: averageScore >= 80 },
        { icon: '📚', title: '퀴즈 10회', desc: totalQuizzes >= 10 ? '달성!' : `${totalQuizzes}/10회`, done: totalQuizzes >= 10 },
        { icon: '🔒', title: '30일 연속 출석', desc: `${currentStreak}/30일`, done: currentStreak >= 30 },
    ];

    return (
        <Page>
            <TopBar>
                <BackBtn onClick={() => navigate('/dashboard')}>← 돌아가기</BackBtn>
                <PageTitle>🐯 마이페이지</PageTitle>
                <div />
            </TopBar>

            {/* 프로필 */}
            <Section>
                <SectionHeader>
                    <SectionIcon>👤</SectionIcon>
                    <div>
                        <SectionTitle>프로필 정보</SectionTitle>
                        <SectionSub>나의 계정 정보를 확인하세요.</SectionSub>
                    </div>
                </SectionHeader>
                <ProfileRow>
                    <Avatar>{(user?.nickname || user?.username || '?')[0].toUpperCase()}</Avatar>
                    <ProfileInfo>
                        <ProfileName>{user?.nickname || user?.username}</ProfileName>
                        <ProfileRole>{user?.role === 'ADMIN' ? '관리자' : '일반 사용자'}</ProfileRole>
                    </ProfileInfo>
                </ProfileRow>
            </Section>

            {/* 학습 통계 */}
            <Section>
                <SectionHeader>
                    <SectionIcon>🏆</SectionIcon>
                    <div>
                        <SectionTitle>학습 통계</SectionTitle>
                        <SectionSub>나의 학습 현황을 확인해보세요.</SectionSub>
                    </div>
                </SectionHeader>

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

                <WeekTitle>이번 주 출석 현황</WeekTitle>
                <WeekRow>
                    {weekAttended.map((w, i) => (
                        <WeekItem key={i}>
                            <WeekCircle $attended={w.attended} $future={w.future}>
                                {w.attended ? '✓' : w.label}
                            </WeekCircle>
                            <WeekLabel>{w.label}</WeekLabel>
                        </WeekItem>
                    ))}
                </WeekRow>

                <ProgressSection>
                    <ProgressRow>
                        <ProgressLabel>이달 출석</ProgressLabel>
                        <ProgressCount>{attendanceDays} / {daysInMonth}일</ProgressCount>
                    </ProgressRow>
                    <ProgressTrack>
                        <ProgressFill $pct={Math.round(attendanceDays / daysInMonth * 100)} $color="#F6841F" />
                    </ProgressTrack>
                    <ProgressRow style={{ marginTop: 16 }}>
                        <ProgressLabel>완료한 퀴즈</ProgressLabel>
                        <ProgressCount>{totalQuizzes}회</ProgressCount>
                    </ProgressRow>
                    <ProgressTrack>
                        <ProgressFill $pct={Math.min(totalQuizzes * 2, 100)} $color="#F6841F" />
                    </ProgressTrack>
                </ProgressSection>
            </Section>

            {/* 달성 현황 */}
            <Section>
                <SectionHeader>
                    <SectionIcon>🔥</SectionIcon>
                    <div>
                        <SectionTitle>달성 현황</SectionTitle>
                        <SectionSub>학습 목표를 달성하고 뱃지를 획득하세요.</SectionSub>
                    </div>
                </SectionHeader>
                <BadgeGrid>
                    {badges.map((b, i) => (
                        <BadgeCard key={i} $done={b.done}>
                            <BadgeIcon>{b.done ? b.icon : '🔒'}</BadgeIcon>
                            <BadgeTitle $done={b.done}>{b.title}</BadgeTitle>
                            <BadgeDesc $done={b.done}>{b.desc}</BadgeDesc>
                        </BadgeCard>
                    ))}
                </BadgeGrid>
            </Section>
        </Page>
    );
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const Page = styled.div`
  max-width: 900px; margin: 0 auto; padding: 32px 24px;
  display: flex; flex-direction: column; gap: 24px;
  animation: ${fadeUp} .4s ease;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
`;
const TopBar = styled.div`
  display: flex; align-items: center; justify-content: space-between;
`;
const BackBtn = styled.button`
  background: none; border: 1.5px solid #F6D8B8;
  border-radius: 10px; padding: 7px 14px;
  font-size: 13px; font-weight: 600; color: #B0926A; cursor: pointer;
  &:hover { border-color: #F6841F; color: #F6841F; }
`;
const PageTitle = styled.h1`font-size: 20px; font-weight: 800; color: #2D1B0E;`;
const Section = styled.div`
  background: #fff; border: 1.5px solid #F6D8B8;
  border-radius: 20px; padding: 28px;
  box-shadow: 0 2px 8px rgba(216,106,12,0.07);
`;
const SectionHeader = styled.div`display: flex; align-items: center; gap: 12px; margin-bottom: 24px;`;
const SectionIcon = styled.div`font-size: 22px;`;
const SectionTitle = styled.h2`font-size: 18px; font-weight: 800; color: #2D1B0E; margin: 0;`;
const SectionSub = styled.p`font-size: 13px; color: #B07040; margin: 2px 0 0;`;

const ProfileRow = styled.div`display: flex; align-items: center; gap: 16px;`;
const Avatar = styled.div`
  width: 56px; height: 56px; border-radius: 50%;
  background: linear-gradient(135deg, #F6841F, #D86A0C);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; font-weight: 800; color: #fff;
`;
const ProfileInfo = styled.div``;
const ProfileName = styled.div`font-size: 18px; font-weight: 800; color: #2D1B0E;`;
const ProfileRole = styled.div`font-size: 13px; color: #B07040; margin-top: 4px;`;

const StatsGrid = styled.div`
  display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 28px;
  @media (max-width: 600px) { grid-template-columns: repeat(2,1fr); }
`;
const StatCard = styled.div`
  background: ${({ $bg }) => $bg ?? '#FFF8F2'};
  border-radius: 14px; padding: 20px 12px; text-align: center;
`;
const StatEmoji = styled.div`font-size: 22px; margin-bottom: 8px;`;
const StatValue = styled.div`font-size: 26px; font-weight: 800; color: ${({ $color }) => $color ?? '#F6841F'}; margin-bottom: 4px;`;
const StatLabel = styled.div`font-size: 12px; color: #B07040; font-weight: 600;`;

const WeekTitle = styled.h3`font-size: 14px; font-weight: 700; color: #2D1B0E; margin-bottom: 14px;`;
const WeekRow = styled.div`display: flex; gap: 12px; margin-bottom: 24px;`;
const WeekItem = styled.div`display: flex; flex-direction: column; align-items: center; gap: 6px;`;
const WeekCircle = styled.div`
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700;
  background: ${({ $attended, $future }) => $attended ? '#F6841F' : $future ? '#F8F8F8' : '#F0F0F0'};
  color: ${({ $attended }) => $attended ? '#fff' : '#999'};
`;
const WeekLabel = styled.div`font-size: 12px; color: #B07040;`;
const ProgressSection = styled.div``;
const ProgressRow = styled.div`display: flex; justify-content: space-between; margin-bottom: 6px;`;
const ProgressLabel = styled.span`font-size: 13px; color: #2D1B0E; font-weight: 600;`;
const ProgressCount = styled.span`font-size: 13px; color: #B07040;`;
const ProgressTrack = styled.div`height: 8px; background: #FFF0DC; border-radius: 9999px; overflow: hidden;`;
const ProgressFill = styled.div`
  height: 100%; width: ${({ $pct }) => $pct}%;
  background: ${({ $color }) => $color}; border-radius: 9999px; transition: width .6s ease;
`;
const BadgeGrid = styled.div`
  display: grid; grid-template-columns: repeat(4,1fr); gap: 12px;
  @media (max-width: 600px) { grid-template-columns: repeat(2,1fr); }
`;
const BadgeCard = styled.div`
  background: ${({ $done }) => $done ? '#FFF8F2' : '#F8F8F8'};
  border: 1.5px solid ${({ $done }) => $done ? '#F6D8B8' : '#E8E8E8'};
  border-radius: 14px; padding: 20px 12px; text-align: center;
`;
const BadgeIcon = styled.div`font-size: 28px; margin-bottom: 8px;`;
const BadgeTitle = styled.div`font-size: 13px; font-weight: 700; color: ${({ $done }) => $done ? '#2D1B0E' : '#999'}; margin-bottom: 4px;`;
const BadgeDesc = styled.div`font-size: 12px; color: ${({ $done }) => $done ? '#F6841F' : '#bbb'}; font-weight: 600;`;