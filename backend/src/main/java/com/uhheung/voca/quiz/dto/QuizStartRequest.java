package com.uhheung.voca.quiz.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record QuizStartRequest(
        @NotBlank String quizType,
        @Min(1) int questionCount
) {}
