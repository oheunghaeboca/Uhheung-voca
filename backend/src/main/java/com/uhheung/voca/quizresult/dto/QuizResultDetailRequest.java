package com.uhheung.voca.quizresult.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;

@Getter
public class QuizResultDetailRequest {

    @NotNull(message = "wordId는 필수입니다.")
    @Positive(message = "wordId는 양수여야 합니다.")
    private Long wordId;

    @NotNull(message = "questionNumber는 필수입니다.")
    @Positive(message = "questionNumber는 양수여야 합니다.")
    private Integer questionNumber;

    // 미응답(null) 허용
    private String userAnswer;

    @NotBlank(message = "correctAnswer는 필수입니다.")
    private String correctAnswer;

    @NotNull(message = "isCorrect는 필수입니다.")
    private Boolean isCorrect;
}