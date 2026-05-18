import styled from 'styled-components';
import { useBookmarkToggle } from '../../hooks/useBookmarkToggle';

const Btn = styled.button`
  background: none; border: none; font-size: 20px; cursor: pointer;
  color: ${({ $active }) => $active ? '#F6841F' : '#D4B896'};
  transition: color .15s, transform .15s;
  &:hover { color: #F6841F; transform: scale(1.2); }
  &:disabled { cursor: default; }
`;

export default function BookmarkToggle({ wordId, bookmarked, onToggle }) {
  const { toggle, pending } = useBookmarkToggle();
  return (
      <Btn
          type="button"
          $active={bookmarked}
          disabled={pending}
          onClick={() => toggle(wordId, () => onToggle?.(wordId))}
      >
        {bookmarked ? '★' : '☆'}
      </Btn>
  );
}