package com.uhheung.voca.quiz.dto;

import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@Builder
public class QuizQuestionDto {
    private Long wordId;
    private int questionNumber;
    private String meaning;
    private List<String> choices;
    private String correctAnswer;
}
