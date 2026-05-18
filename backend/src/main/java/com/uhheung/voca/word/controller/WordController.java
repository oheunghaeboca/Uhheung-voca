package com.uhheung.voca.word.controller;

import com.uhheung.voca.word.dto.WordResponse;
import com.uhheung.voca.word.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;

    // 단어 목록을 조회한다.
    @GetMapping
    public ResponseEntity<List<WordResponse>> getWords(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size
    ) {
        return ResponseEntity.ok(wordService.findAll());
    }

    // 오늘의 단어 20개를 조회한다. (/{wordId} 보다 먼저 선언해야 literal 경로 우선 매칭)
    @GetMapping("/daily")
    public ResponseEntity<List<WordResponse>> getDailyWords() {
        return ResponseEntity.ok(wordService.getDailyWords());
    }

    // 단어 상세 정보를 조회한다.
    @GetMapping("/{wordId}")
    public ResponseEntity<WordResponse> getWord(@PathVariable Long wordId) {
        return ResponseEntity.ok(wordService.findById(wordId));
    }
}