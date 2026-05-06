package com.uhheung.voca.quiz.dto;

import com.uhheung.voca.quiz.dto.QuizQuestionDto;
import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class QuizResponseDto {
    private String quizType;
    private List<QuizQuestionDto> questions;
}