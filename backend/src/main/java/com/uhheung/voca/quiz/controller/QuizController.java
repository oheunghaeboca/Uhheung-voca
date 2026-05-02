package com.uhheung.voca.quiz.controller;

import com.uhheung.voca.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    // TODO: POST /api/quiz/start
    // TODO: POST /api/quiz/submit
    // TODO: GET  /api/quiz/results
    // TODO: GET  /api/quiz/results/{id}
}
