import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { missionsApi } from '../../api/missions';
import { useToast } from '../../hooks/useToast';

const TOAST_GUARD_KEY = 'voca.lastAttendanceToastDate';

// 오늘의 데일리 미션 위젯 (PBI-12).
// 백엔드 응답 형식 (API_명세서 7-1): { date, missions: [...], allCompleted, attendanceGranted }
// 미션 3개 (STUDY_WORDS / TAKE_QUIZ / SCORE_70) 의 진행률을 progress bar 로 표시한다.
// attendanceGranted=true 면 inline Badge 와 함께 toast 알림을 하루 1회 발사한다.
// window focus 이벤트 시 자동으로 재조회하여 다른 탭/페이지에서 학습한 진척이 즉시 반영되게 한다.
export default function TodayMissionCard() {
  const [state, setState] = useState({ loading: true, error: null, data: null });
  const { show } = useToast();

  const fetchToday = useCallback(() => {
    return missionsApi.today();
  }, []);

  // 응답을 받았을 때 처음 출석이 인정된 순간이면 toast 한 번 발사한다.
  // 같은 날 재방문 시 toast 가 또 뜨지 않도록 localStorage 가드로 하루 1회로 제한한다.
  const handleData = useCallback((data) => {
    setState({ loading: false, error: null, data });
    if (!data?.attendanceGranted || !data?.date) return;
    const last = localStorage.getItem(TOAST_GUARD_KEY);
    if (last === data.date) return;
    show('🏅 오늘 미션 모두 완료! 출석이 인정되었어요.', 'success', 4000);
    localStorage.setItem(TOAST_GUARD_KEY, data.date);
  }, [show]);

  useEffect(() => {
    let mounted = true;
    fetchToday()
      .then((data) => { if (mounted) handleData(data); })
      .catch((err) => { if (mounted) setState({ loading: false, error: err, data: null }); });

    // 다른 탭/페이지에서 단어 학습 또는 퀴즈 제출 후 돌아왔을 때 진척을 즉시 반영.
    const onFocus = () => {
      fetchToday()
        .then((data) => { if (mounted) handleData(data); })
        .catch(() => {});
    };
    window.addEventListener('focus', onFocus);
    return () => {
      mounted = false;
      window.removeEventListener('focus', onFocus);
    };
  }, [fetchToday, handleData]);

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
