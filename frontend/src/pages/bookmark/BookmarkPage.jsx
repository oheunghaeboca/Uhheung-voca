import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../../hooks/useAuth';
import { bookmarksApi } from '../../api/bookmarks';

export default function BookmarkPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const load = () => {
        if (!user?.id) return;
        bookmarksApi.list(user.id)
            .then((res) => setItems(Array.isArray(res) ? res : []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { load(); }, [user?.id]);

    const handleToggle = async (wordId) => {
        await bookmarksApi.toggle(wordId, user.id);
        load();
    };

    return (
        <Page>
            <Title>⭐ 북마크</Title>
            {loading ? (
                <Empty>불러오는 중...</Empty>
            ) : items.length === 0 ? (
                <EmptyBox>
                    <EmptyIcon>🔖</EmptyIcon>
                    <EmptyText>아직 북마크가 없습니다.</EmptyText>
                    <EmptyBtn onClick={() => navigate('/flashcard')}>단어 학습하러 가기</EmptyBtn>
                </EmptyBox>
            ) : (
                <List>
                    {items.map((w) => (
                        <WordCard key={w.id}>
                            <WordLeft>
                                <WordEn>{w.english}</WordEn>
                                <WordKo>{w.korean}</WordKo>
                                {w.example && <WordEx>"{w.example}"</WordEx>}
                            </WordLeft>
                            <RemoveBtn onClick={() => handleToggle(w.id)}>★</RemoveBtn>
                        </WordCard>
                    ))}
                </List>
            )}
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
const Title = styled.h1`font-size: 22px; font-weight: 800; color: #2D1B0E; margin-bottom: 24px;`;
const Empty = styled.div`text-align: center; color: #B07040; padding: 32px;`;
const EmptyBox = styled.div`display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 60px 0;`;
const EmptyIcon = styled.div`font-size: 48px;`;
const EmptyText = styled.p`font-size: 15px; color: #B07040;`;
const EmptyBtn = styled.button`
  background: #F6841F; color: #fff; border: none;
  border-radius: 12px; padding: 12px 28px;
  font-size: 14px; font-weight: 700; cursor: pointer;
  &:hover { opacity: .88; }
`;
const List = styled.div`display: flex; flex-direction: column; gap: 12px;`;
const WordCard = styled.div`
  background: #fff; border: 1.5px solid #F6D8B8;
  border-radius: 16px; padding: 20px 24px;
  display: flex; align-items: flex-start; justify-content: space-between;
  box-shadow: 0 2px 8px rgba(216,106,12,0.07);
`;
const WordLeft = styled.div`flex: 1;`;
const WordEn = styled.h3`font-size: 18px; font-weight: 800; color: #2D1B0E; margin-bottom: 4px;`;
const WordKo = styled.p`font-size: 14px; color: #B07040; margin-bottom: 6px;`;
const WordEx = styled.p`font-size: 13px; color: #9AA5B1; font-style: italic;`;
const RemoveBtn = styled.button`
  background: none; border: none; font-size: 22px;
  color: #F6841F; cursor: pointer; padding: 0 0 0 16px;
  transition: transform .15s;
  &:hover { transform: scale(1.2); }
`;