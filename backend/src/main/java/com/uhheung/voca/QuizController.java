package com.uhheung.voca.quiz;

import com.uhheung.voca.quiz.dto.QuizQuestionDto;
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
    public ResponseEntity<List<QuizQuestionDto>> getQuiz() {
        return ResponseEntity.ok(quizService.generateQuiz());
    }
}
