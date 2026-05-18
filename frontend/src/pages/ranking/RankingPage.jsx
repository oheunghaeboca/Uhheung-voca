import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { rankingApi } from '../../api/ranking';
import { useAuth } from '../../hooks/useAuth';

export default function RankingPage() {
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [period, setPeriod] = useState('ALL');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        rankingApi.list({ period, size: 20 })
            .then((res) => setItems(res ?? []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [period]);

    const medal = (rank) => rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

    return (
        <Page>
            <TitleRow>
                <Title>🏆 랭킹</Title>
                <TabGroup>
                    {[{ key: 'WEEKLY', label: '주간' }, { key: 'MONTHLY', label: '월간' }, { key: 'ALL', label: '전체' }].map((t) => (
                        <TabBtn key={t.key} $active={period === t.key} onClick={() => setPeriod(t.key)}>
                            {t.label}
                        </TabBtn>
                    ))}
                </TabGroup>
            </TitleRow>
            <Sub>다른 사용자들과 경쟁해보세요!</Sub>

            <Card>
                {loading ? (
                    <Empty>불러오는 중...</Empty>
                ) : items.length === 0 ? (
                    <Empty>랭킹 데이터가 없습니다.</Empty>
                ) : (
                    <List>
                        {items.map((row) => {
                            const m = medal(row.rank);
                            const isMe = row.userId === user?.id;
                            return (
                                <Row key={row.userId} $top={row.rank <= 3} $isMe={isMe}>
                                    <Left>
                                        <Badge $rank={row.rank}>
                                            {m ? m : <Num>{row.rank}</Num>}
                                        </Badge>
                                        <Name $isMe={isMe}>
                                            {row.nickname}{isMe ? ' 👈 나' : ''}
                                        </Name>
                                    </Left>
                                    <Score $rank={row.rank}>{Number(row.score).toFixed(1)}점</Score>
                                </Row>
                            );
                        })}
                    </List>
                )}
            </Card>
        </Page>
    );
}

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const Page = styled.div`
  max-width: 800px; margin: 0 auto; padding: 32px 24px;
  animation: ${fadeUp} .4s ease;
  font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
`;
const TitleRow = styled.div`display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;`;
const Title = styled.h1`font-size: 22px; font-weight: 800; color: #2D1B0E;`;
const Sub = styled.p`font-size: 13px; color: #B07040; margin-bottom: 24px;`;
const TabGroup = styled.div`display: flex; gap: 6px;`;
const TabBtn = styled.button`
  padding: 6px 16px; border-radius: 9999px;
  font-size: 13px; font-weight: 600; cursor: pointer; border: none;
  background: ${({ $active }) => $active ? '#F6841F' : '#FFF0DC'};
  color: ${({ $active }) => $active ? '#fff' : '#B07040'};
  transition: background .15s;
`;
const Card = styled.div`
  background: #fff; border: 1.5px solid #F6D8B8;
  border-radius: 20px; padding: 24px;
  box-shadow: 0 2px 8px rgba(216,106,12,0.07);
`;
const Empty = styled.div`text-align: center; color: #B07040; padding: 40px; font-size: 14px;`;
const List = styled.div`display: flex; flex-direction: column; gap: 8px;`;
const Row = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-radius: 12px;
  background: ${({ $isMe }) => $isMe ? '#FFF3E0' : ({ $top }) => $top ? '#FFFBF5' : '#FAFAFA'};
  border: 1.5px solid ${({ $isMe }) => $isMe ? '#F6D8B8' : 'transparent'};
`;
const Left = styled.div`display: flex; align-items: center; gap: 12px;`;
const Badge = styled.div`
  width: 38px; height: 38px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; font-size: 22px;
  background: ${({ $rank }) => $rank === 1 ? '#FFF9C4' : $rank === 2 ? '#F5F5F5' : $rank === 3 ? '#FFE8D2' : '#F0F0F0'};
`;
const Num = styled.span`font-size: 13px; font-weight: 700; color: #999;`;
const Name = styled.span`
  font-size: 15px; font-weight: ${({ $isMe }) => $isMe ? 800 : 500};
  color: ${({ $isMe }) => $isMe ? '#D86A0C' : '#2D1B0E'};
`;
const Score = styled.span`
  font-size: 15px; font-weight: 700;
  color: ${({ $rank }) => $rank === 1 ? '#F59E0B' : $rank === 2 ? '#9E9E9E' : $rank === 3 ? '#F6841F' : '#B07040'};
`;