import { useEffect, useState } from 'react';
import WrongNoteList from '../../components/wrongnote/WrongNoteList.jsx';
import RetestButton from '../../components/wrongnote/RetestButton.jsx';
import { wrongNotesApi } from '../../api/wrongNotes';

export default function WrongNotePage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    wrongNotesApi.list().then((res) => setItems(res ?? []));
  }, []);

  const handleRetest = async () => {
    // TODO: 선택한 단어들로 재테스트 시작 → 결과 화면으로 이동 — Vibe Coding 시 채울 것
  };

  return (
    <div>
      <h1>오답노트</h1>
      <RetestButton onClick={handleRetest} />
      <WrongNoteList items={items} />
    </div>
  );
}
