package com.uhheung.voca.mission.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Entity
@Table(name = "daily_missions", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "date"}))
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class DailyMission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "words_studied", nullable = false)
    private Integer wordsStudied;

    @Column(name = "quizzes_taken", nullable = false)
    private Integer quizzesTaken;

    @Column(name = "highest_score", precision = 5, scale = 2)
    private BigDecimal highestScore;

    @Column(name = "is_completed", nullable = false)
    private Boolean isCompleted;

    @Column(name = "attendance_granted", nullable = false)
    private Boolean attendanceGranted;

    @Builder
    private DailyMission(Long userId, LocalDate date) {
        this.userId = userId;
        this.date = date;
        this.wordsStudied = 0;
        this.quizzesTaken = 0;
        this.highestScore = null;
        this.isCompleted = false;
        this.attendanceGranted = false;
    }
}
