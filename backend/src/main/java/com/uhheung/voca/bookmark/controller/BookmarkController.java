package com.uhheung.voca.bookmark.controller;

import com.uhheung.voca.bookmark.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    // TODO: GET /api/bookmarks
    // TODO: POST /api/bookmarks/toggle (또는 POST /api/bookmarks/{wordId})
}
