import { useCallback, useState } from 'react';
import { bookmarksApi } from '../api/bookmarks';
import { useAuth } from './useAuth';

export function useBookmarkToggle() {
  const { user } = useAuth();
  const [pending, setPending] = useState(false);

  const toggle = useCallback(async (wordId, onSuccess) => {
    if (!user?.id) return;
    setPending(true);
    try {
      await bookmarksApi.toggle(wordId, user.id);
      onSuccess?.();
    } finally {
      setPending(false);
    }
  }, [user?.id]);

  return { toggle, pending };
}