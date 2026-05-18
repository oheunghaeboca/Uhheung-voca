package com.uhheung.voca.bookmark.controller;

import com.uhheung.voca.bookmark.service.BookmarkService;
import com.uhheung.voca.word.entity.Word;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    @GetMapping
    public ResponseEntity<List<Word>> list(@RequestParam Long userId) {
        return ResponseEntity.ok(bookmarkService.list(userId));
    }

    @PostMapping("/{wordId}")
    public ResponseEntity<Map<String, Boolean>> toggle(
            @PathVariable Long wordId,
            @RequestParam Long userId) {
        boolean bookmarked = bookmarkService.toggle(userId, wordId);
        return ResponseEntity.ok(Map.of("bookmarked", bookmarked));
    }
}