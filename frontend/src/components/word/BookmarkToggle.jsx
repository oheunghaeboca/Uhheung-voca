import { useBookmarkToggle } from '../../hooks/useBookmarkToggle';

export default function BookmarkToggle({ wordId, bookmarked }) {
  const { toggle, pending } = useBookmarkToggle();
  return (
    <button type="button" disabled={pending} onClick={() => toggle(wordId)}>
      {bookmarked ? '★' : '☆'}
    </button>
  );
}
