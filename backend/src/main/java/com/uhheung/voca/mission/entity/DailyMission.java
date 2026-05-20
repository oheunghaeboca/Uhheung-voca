package com.uhheung.voca.mission.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 사용자별 일자별 데일리 미션 진척 상태.
 *
 * <p>같은 (user_id, date) 에 대해 단 한 행만 존재함을 UNIQUE 제약으로 강제한다 (정책 P1).
 * 진척 갱신은 {@link #updateProgress} 한 메서드를 통해서만 일어나며,
 * 출석 자동 부여는 {@link #markAttendanceGranted} 로 한 방향으로만 전이한다 (정책 P2).
 */
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

    // 오늘의 통계 결과로 진척 필드를 덮어쓴다. read-on-demand 호출마다 같은 결과로 수렴한다.
    public void updateProgress(int wordsStudied, int quizzesTaken, BigDecimal highestScore) {
        this.wordsStudied = wordsStudied;
        this.quizzesTaken = quizzesTaken;
        this.highestScore = highestScore;
    }

    // 세 미션이 모두 충족되면 호출되어 완료 플래그를 켠다. 한 번 켜진 뒤로 해제되지 않는다.
    public void markCompleted() {
        this.isCompleted = true;
    }

    // 출석이 실제 INSERT 된 시점에 호출. 두 번 호출되어도 결과 동일 (멱등).
    public void markAttendanceGranted() {
        this.attendanceGranted = true;
    }
}
