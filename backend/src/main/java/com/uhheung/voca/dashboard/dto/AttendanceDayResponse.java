package com.uhheung.voca.dashboard.dto;

import java.time.LocalDate;

public record AttendanceDayResponse(
        LocalDate date,
        boolean attended
) {}