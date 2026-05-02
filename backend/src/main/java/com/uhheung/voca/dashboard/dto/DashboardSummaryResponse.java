package com.uhheung.voca.dashboard.dto;

import java.math.BigDecimal;

public record DashboardSummaryResponse(
        int totalQuizzes,
        BigDecimal averageScore,
        int totalWordsStudied,
        int currentStreak
) {}
