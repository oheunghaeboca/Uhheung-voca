package com.uhheung.voca.quizresult.dto;

import com.uhheung.voca.quiz.entity.QuizResult;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record QuizResultSaveResponse(
        Long quizResultId,
        String quizType,
        Integer totalQuestions,
        Integer correctCount,
        BigDecimal score,
        LocalDateTime submittedAt
) {
    public static QuizResultSaveResponse from(QuizResult quizResult) {
        return new QuizResultSaveResponse(
                quizResult.getId(),
                quizResult.getQuizType(),
                quizResult.getTotalQuestions(),
                quizResult.getCorrectCount(),
                quizResult.getScore(),
                quizResult.getSubmittedAt()
        );
    }
}