import { useCallback, useState } from 'react';
import { bookmarksApi } from '../api/bookmarks';

export function useBookmarkToggle() {
  const [pending, setPending] = useState(false);

  // TODO: 옵티미스틱 업데이트 + 실패 시 롤백 — Vibe Coding 시 채울 것
  const toggle = useCallback(async (wordId) => {
    setPending(true);
    try {
      return await bookmarksApi.toggle(wordId);
    } finally {
      setPending(false);
    }
  }, []);

  return { toggle, pending };
}
