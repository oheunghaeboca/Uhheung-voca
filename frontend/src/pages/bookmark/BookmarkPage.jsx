import { useEffect, useState } from 'react';
import BookmarkList from '../../components/bookmark/BookmarkList.jsx';
import { bookmarksApi } from '../../api/bookmarks';

export default function BookmarkPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    bookmarksApi.list().then((res) => setItems(res?.items ?? res?.content ?? res ?? []));
  }, []);
  return (
    <div>
      <h1>북마크</h1>
      <BookmarkList items={items} />
    </div>
  );
}
