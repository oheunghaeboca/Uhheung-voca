package com.uhheung.voca.quiz.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Table(name = "quiz_result_details")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuizResultDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quiz_result_id", nullable = false)
    private Long quizResultId;

    @Column(name = "word_id", nullable = false)
    private Long wordId;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    @Column(name = "user_answer", length = 50)
    private String userAnswer;

    @Column(name = "correct_answer", nullable = false, length = 50)
    private String correctAnswer;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect;

    @Builder
    private QuizResultDetail(Long quizResultId, Long wordId, Integer questionNumber,
                             String userAnswer, String correctAnswer, Boolean isCorrect) {
        this.quizResultId = quizResultId;
        this.wordId = wordId;
        this.questionNumber = questionNumber;
        this.userAnswer = userAnswer;
        this.correctAnswer = correctAnswer;
        this.isCorrect = isCorrect;
    }
}
