package com.uhheung.voca.bookmark.service;

import com.uhheung.voca.bookmark.entity.Bookmark;
import com.uhheung.voca.bookmark.repository.BookmarkRepository;
import com.uhheung.voca.word.entity.Word;
import com.uhheung.voca.word.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final WordRepository wordRepository;

    @Transactional(readOnly = true)
    public List<Word> list(Long userId) {
        List<Bookmark> bookmarks = bookmarkRepository.findAll().stream()
                .filter(b -> b.getUserId().equals(userId))
                .toList();
        List<Long> wordIds = bookmarks.stream().map(Bookmark::getWordId).toList();
        return wordRepository.findAllById(wordIds);
    }

    public boolean toggle(Long userId, Long wordId) {
        Optional<Bookmark> existing = bookmarkRepository.findByUserIdAndWordId(userId, wordId);
        if (existing.isPresent()) {
            bookmarkRepository.delete(existing.get());
            return false;
        } else {
            bookmarkRepository.save(Bookmark.builder().userId(userId).wordId(wordId).build());
            return true;
        }
    }
}