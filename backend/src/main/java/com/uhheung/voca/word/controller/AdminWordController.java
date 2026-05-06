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

@RestController
@RequestMapping("/api/admin/words")
@RequiredArgsConstructor
public class AdminWordController {

    private final WordService wordService;

    // 단어를 생성한다.
    @PostMapping
    public ResponseEntity<WordResponse> createWord(@Valid @RequestBody WordCreateRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(wordService.create(req));
    }

    // 단어를 수정한다.
    @PatchMapping("/{wordId}")
    public ResponseEntity<WordResponse> updateWord(
            @PathVariable Long wordId,
            @Valid @RequestBody WordUpdateRequest req
    ) {
        return ResponseEntity.ok(wordService.update(wordId, req));
    }

    // 단어를 삭제한다.
    @DeleteMapping("/{wordId}")
    public ResponseEntity<Void> deleteWord(@PathVariable Long wordId) {
        wordService.delete(wordId);
        return ResponseEntity.noContent().build();
    }
}