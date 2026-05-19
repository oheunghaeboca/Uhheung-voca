import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { missionsApi } from '../../api/missions';

// 오늘의 데일리 미션 위젯 (PBI-12).
// 백엔드 응답 형식 (API_명세서 7-1): { date, missions: [...], allCompleted, attendanceGranted }
// 미션 3개 (STUDY_WORDS / TAKE_QUIZ / SCORE_70) 의 진행률을 progress bar 로 표시.
// allCompleted && attendanceGranted 면 "출석 인정!" 배지를 함께 보여준다.
export default function TodayMissionCard() {
  const [state, setState] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    let mounted = true;
    missionsApi
      .today()
      .then((data) => {
        if (mounted) setState({ loading: false, error: null, data });
      })
      .catch((err) => {
        if (mounted) setState({ loading: false, error: err, data: null });
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card>
      <Header>
        <SectionTitle>오늘의 미션</SectionTitle>
        {state.data?.attendanceGranted && <Badge>🏅 오늘 출석 인정!</Badge>}
      </Header>

      {state.loading && <Status>불러오는 중…</Status>}
      {state.error && <StatusError>미션 정보를 불러오지 못했습니다.</StatusError>}
      {state.data && (
        <List>
          {state.data.missions.map((m) => (
            <MissionRow key={m.missionType}>
              <Top>
                <Label>
                  {m.isCompleted && <Check>✔︎</Check>}
                  {m.description}
                </Label>
                <Score>
                  {m.current} / {m.target}
                </Score>
              </Top>
              <Track>
                <Fill $pct={Math.min(100, (m.current / m.target) * 100)} $done={m.isCompleted} />
              </Track>
            </MissionRow>
          ))}
        </List>
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
  align-items: center;
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

const Badge = styled.span`
  font-size: 12px;
  font-weight: 800;
  color: #16A34A;
  background: #E8F5EE;
  border: 1px solid #BFE6CD;
  border-radius: 9999px;
  padding: 4px 12px;
`;

const Status = styled.div`
  font-size: 13px;
  color: #B07040;
  padding: 8px 4px;
`;

const StatusError = styled(Status)`
  color: #DC2626;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const MissionRow = styled.div``;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 13px;
  color: #5C3A1A;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const Check = styled.span`
  display: inline-flex;
  width: 18px;
  height: 18px;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  background: #16A34A;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
`;

const Score = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #B07040;
`;

const Track = styled.div`
  height: 10px;
  background: #FFF0DC;
  border-radius: 9999px;
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $done }) => ($done ? 'linear-gradient(90deg, #22C55E, #16A34A)' : 'linear-gradient(90deg, #F6841F, #FFB347)')};
  border-radius: 9999px;
  transition: width .6s ease;
`;
