package com.uhheung.voca.quiz.controller;

import com.uhheung.voca.quiz.service.QuizService;
import com.uhheung.voca.quiz.dto.QuizQuestionDto;
import com.uhheung.voca.quiz.dto.QuizResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping
    public ResponseEntity<QuizResponseDto> getQuiz() {
        List<QuizQuestionDto> questions = quizService.generateQuiz();
        QuizResponseDto response = QuizResponseDto.builder()
                .quizType("MEANING_TO_WORD")
                .questions(questions)
                .build();
        return ResponseEntity.ok(response);
    }
}