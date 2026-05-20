package com.uhheung.voca.quiz.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record QuizResultResponse(
        Long id,
        String quizType,
        int totalQuestions,
        int correctCount,
        BigDecimal score,
        LocalDateTime submittedAt
) {}
