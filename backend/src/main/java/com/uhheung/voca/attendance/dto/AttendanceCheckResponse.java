package com.uhheung.voca.attendance.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record AttendanceCheckResponse(
        Long userId,
        LocalDate date,
        Boolean granted,
        BigDecimal score,
        String message
) {
}