package com.uhheung.voca.word.controller;

import com.uhheung.voca.word.dto.WordCreateRequest;
import com.uhheung.voca.word.dto.WordResponse;
import com.uhheung.voca.word.dto.WordUpdateRequest;
import com.uhheung.voca.word.service.WordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// [개발 임시] 현재 SecurityConfig의 .anyRequest().permitAll() 로 인증 없이 접근 가능.
// JWT 도입 후 처리 방법 (둘 중 하나 선택):
//   방법 A — SecurityConfig에서 경로 수준으로 제어:
//     .requestMatchers("/api/admin/**").hasRole("ADMIN")
//   방법 B — 메서드 수준으로 제어 (@EnableMethodSecurity 활성화 필요):
//     각 핸들러에 @PreAuthorize("hasRole('ADMIN')") 추가
@RestController
@RequestMapping("/api/admin/words")
@RequiredArgsConstructor
public class AdminWordController {

    private final WordService wordService;

    @PostMapping
    public ResponseEntity<WordResponse> createWord(@Valid @RequestBody WordCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(wordService.create(req));
    }

    @PatchMapping("/{wordId}")
    public ResponseEntity<WordResponse> updateWord(
            @PathVariable Long wordId,
            @RequestBody WordUpdateRequest req) {
        return ResponseEntity.ok(wordService.update(wordId, req));
    }

    @DeleteMapping("/{wordId}")
    public ResponseEntity<Void> deleteWord(@PathVariable Long wordId) {
        wordService.delete(wordId);
        return ResponseEntity.noContent().build();
    }
}
