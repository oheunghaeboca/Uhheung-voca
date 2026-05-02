package com.uhheung.voca.quiz.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "quiz_results")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class QuizResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "quiz_type", nullable = false, length = 20)
    private String quizType;

    @Column(name = "total_questions", nullable = false)
    private Integer totalQuestions;

    @Column(name = "correct_count", nullable = false)
    private Integer correctCount;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal score;

    @CreationTimestamp
    @Column(name = "submitted_at", nullable = false, updatable = false)
    private LocalDateTime submittedAt;

    @Builder
    private QuizResult(Long userId, String quizType, Integer totalQuestions, Integer correctCount, BigDecimal score) {
        this.userId = userId;
        this.quizType = quizType;
        this.totalQuestions = totalQuestions;
        this.correctCount = correctCount;
        this.score = score;
    }
}
