package com.uhheung.voca.quizresult.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record QuizResultDetailResponse(
        Long quizResultId,
        String quizType,
        Integer totalQuestions,
        Integer correctCount,
        BigDecimal score,
        LocalDateTime submittedAt,
        List<Item> details
) {
    public record Item(
            Long wordId,
            String english,
            String korean,
            Integer questionNumber,
            String userAnswer,
            String correctAnswer,
            Boolean isCorrect
    ) {
    }
}
