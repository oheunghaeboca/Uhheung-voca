package com.uhheung.voca.attendance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AttendanceResponse(
        Long id,
        Long userId,
        LocalDate date,
        Boolean isAttended,
        BigDecimal score
) {
}