package com.uhheung.voca.quizresult.controller;

import com.uhheung.voca.quizresult.dto.QuizResultSaveRequest;
import com.uhheung.voca.quizresult.dto.QuizResultSaveResponse;
import com.uhheung.voca.quizresult.service.QuizResultService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quiz-results")
@RequiredArgsConstructor
public class QuizResultController {

    private final QuizResultService quizResultService;

    // 퀴즈 결과 및 문항별 상세 결과를 저장한다.
    @PostMapping
    public ResponseEntity<QuizResultSaveResponse> save(@Valid @RequestBody QuizResultSaveRequest request) {
        QuizResultSaveResponse response = quizResultService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}