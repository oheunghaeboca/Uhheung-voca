package com.uhheung.voca.quiz.controller;

import com.uhheung.voca.quiz.service.QuizService;
import com.uhheung.voca.quiz.dto.QuizResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    // GET /api/quizzes?type=MEANING_TO_WORD 또는 ?type=WORD_TO_MEANING
    @GetMapping
    public ResponseEntity<QuizResponseDto> getQuiz(
            @RequestParam(defaultValue = "MEANING_TO_WORD") String type) {
        return ResponseEntity.ok(quizService.generateQuiz(type));
    }
}