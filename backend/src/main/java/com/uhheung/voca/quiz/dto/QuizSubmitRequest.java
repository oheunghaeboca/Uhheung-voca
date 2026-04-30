package com.uhheung.voca.quiz.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record QuizSubmitRequest(
        @NotEmpty List<Answer> answers
) {
    public record Answer(
            Long wordId,
            int questionNumber,
            String userAnswer
    ) {}
}
