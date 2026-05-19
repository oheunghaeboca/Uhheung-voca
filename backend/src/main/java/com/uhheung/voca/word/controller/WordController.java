package com.uhheung.voca.word.controller;

import com.uhheung.voca.common.exception.ApiException;
import com.uhheung.voca.common.exception.ErrorCode;
import com.uhheung.voca.user.entity.User;
import com.uhheung.voca.user.repository.UserRepository;
import com.uhheung.voca.word.dto.DailyWordsResponse;
import com.uhheung.voca.word.dto.WordResponse;
import com.uhheung.voca.word.service.DailyWordService;
import com.uhheung.voca.word.service.WordService;
import com.uhheung.voca.word.service.WordStudyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
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
    private final UserRepository userRepository;

    // 단어 목록을 조회한다.
    @GetMapping
    public ResponseEntity<List<WordResponse>> getWords(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size
    ) {
        return ResponseEntity.ok(wordService.findAll());
    }

    // 오늘의 학습 단어 20개를 조회한다. 같은 날 같은 사용자는 동일한 추천 결과를 받는다.
    @GetMapping("/daily")
    public ResponseEntity<DailyWordsResponse> getDailyWords(Authentication authentication) {
        Long userId = resolveUserId(authentication);
        return ResponseEntity.ok(dailyWordService.recommend(userId, LocalDate.now()));
    }

    // 단어 상세 정보를 조회한다.
    @GetMapping("/{wordId}")
    public ResponseEntity<WordResponse> getWord(@PathVariable Long wordId) {
        return ResponseEntity.ok(wordService.findById(wordId));
    }

    // 단어를 학습한 사건(상세 진입 / 플래시카드 카드 노출 등)을 기록한다.
    // STUDY_WORDS 미션의 current 카운트가 본 호출로 증가한다.
    @PostMapping("/{wordId}/view")
    public ResponseEntity<Void> recordView(@PathVariable Long wordId, Authentication authentication) {
        Long userId = resolveUserId(authentication);
        wordStudyService.recordView(userId, wordId);
        return ResponseEntity.noContent().build();
    }

    // 인증 정보에서 username 을 꺼내 실제 사용자 식별자로 환원한다.
    // Authentication 이 null 이거나 username 이 비어있으면 401 매핑 예외를 던진다 (정책 P4).
    private Long resolveUserId(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        }
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        return user.getId();
    }
}