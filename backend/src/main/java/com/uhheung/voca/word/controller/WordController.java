package com.uhheung.voca.word.controller;

import com.uhheung.voca.word.dto.DailyWordsResponse;
import com.uhheung.voca.word.dto.WordResponse;
import com.uhheung.voca.word.service.DailyWordService;
import com.uhheung.voca.word.service.WordService;
import com.uhheung.voca.word.service.WordStudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;
    private final DailyWordService dailyWordService;
    private final WordStudyService wordStudyService;

    // 단어 목록을 조회한다.
    @GetMapping
    public ResponseEntity<List<WordResponse>> getWords(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size
    ) {
        return ResponseEntity.ok(wordService.findAll());
    }

    // 오늘의 학습 추천 단어 20개를 조회한다. 같은 (userId, 오늘 날짜)는 동일한 시퀀스를 반환한다.
    // /{wordId} 보다 위에 두어 path-variable 변환 충돌(wordId="daily")을 차단한다.
    @GetMapping("/daily")
    public ResponseEntity<DailyWordsResponse> getDailyWords(@RequestParam Long userId) {
        return ResponseEntity.ok(dailyWordService.recommend(userId, LocalDate.now()));
    }

    // 단어 상세 정보를 조회한다.
    @GetMapping("/{wordId}")
    public ResponseEntity<WordResponse> getWord(@PathVariable Long wordId) {
        return ResponseEntity.ok(wordService.findById(wordId));
    }

    // 단어 학습 이벤트 기록 (PBI-12 STUDY_WORDS 미션 트리거). 본문은 비움, 204 응답.
    @PostMapping("/{wordId}/view")
    public ResponseEntity<Void> recordView(
            @PathVariable Long wordId,
            @RequestParam Long userId) {
        wordStudyService.recordView(userId, wordId);
        return ResponseEntity.noContent().build();
    }
}