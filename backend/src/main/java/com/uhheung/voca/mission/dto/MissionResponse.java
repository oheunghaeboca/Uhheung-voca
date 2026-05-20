package com.uhheung.voca.mission.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record MissionResponse(
        LocalDate date,
        int wordsStudied,
        int quizzesTaken,
        BigDecimal highestScore,
        boolean isCompleted,
        boolean attendanceGranted
) {}
