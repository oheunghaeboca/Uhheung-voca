package com.uhheung.voca.attendance.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Entity
@Table(name = "attendance", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "date"}))
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "is_attended", nullable = false)
    private Boolean isAttended;

    @Column(precision = 5, scale = 2)
    private BigDecimal score;

    @Builder
    private Attendance(Long userId, LocalDate date, Boolean isAttended, BigDecimal score) {
        this.userId = userId;
        this.date = date;
        this.isAttended = isAttended != null ? isAttended : Boolean.FALSE;
        this.score = score;
    }
}
