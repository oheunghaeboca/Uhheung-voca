package com.uhheung.voca.quizresult.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

@Getter
public class QuizResultSaveRequest {

    @NotNull(message = "userId는 필수입니다.")
    @Positive(message = "userId는 양수여야 합니다.")
    private Long userId;

    @NotBlank(message = "quizType은 필수입니다.")
    private String quizType;

    @NotNull(message = "totalQuestions는 필수입니다.")
    @Positive(message = "totalQuestions는 양수여야 합니다.")
    private Integer totalQuestions;

    @NotNull(message = "correctCount는 필수입니다.")
    @PositiveOrZero(message = "correctCount는 0 이상이어야 합니다.")
    private Integer correctCount;

    @NotNull(message = "score는 필수입니다.")
    @DecimalMin(value = "0.0", message = "score는 0 이상이어야 합니다.")
    private BigDecimal score;

    @NotNull(message = "details는 필수입니다.")
    @Size(min = 1, message = "details는 최소 1개 이상이어야 합니다.")
    private List<@Valid QuizResultDetailRequest> details;
}

