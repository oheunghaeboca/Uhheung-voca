package com.uhheung.voca.bookmark.service;

import com.uhheung.voca.bookmark.repository.BookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;

    // TODO: list(userId, pageable)
    // TODO: toggle(userId, wordId) → 옵티미스틱 토글
}
