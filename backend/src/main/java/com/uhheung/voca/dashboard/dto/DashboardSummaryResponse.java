package com.uhheung.voca.dashboard.dto;

import java.math.BigDecimal;

public record DashboardSummaryResponse(
        long totalQuizzes,
        BigDecimal averageScore,
        int totalAttendance,
        int currentStreak
) {}