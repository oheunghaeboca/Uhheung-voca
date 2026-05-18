// 플래시카드 현재 카드의 단어를 학습 이벤트로 기록한다 (PBI-12 STUDY_WORDS 미션).
useEffect(() => {
  const w = sessionWords[currentIndex];
  if (!w?.id) return;
  wordsApi.view(w.id).catch(() => {});
}, [sessionWords, currentIndex]);

useEffect(() => {
  if (!user?.id) return;
  bookmarksApi.list(user.id).then((res) => {
    const items = Array.isArray(res) ? res : [];
    setBookmarked(new Set(items.map((w) => w.id)));
  }).catch(() => {});
}, [user?.id]);

const toggleBookmark = async (wordId) => {
  if (!user?.id) return;
  await bookmarksApi.toggle(wordId, user.id);
  setBookmarked((prev) => {
    const next = new Set(prev);
    next.has(wordId) ? next.delete(wordId) : next.add(wordId);
    return next;
  });
};