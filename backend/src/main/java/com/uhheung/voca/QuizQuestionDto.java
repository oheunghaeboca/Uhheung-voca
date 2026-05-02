package com.uhheung.voca.quiz.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class QuizQuestionDto {
    private Long wordId;
    private String meaning;
    private List<String> options;
    private String answer;
}