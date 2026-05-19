package com.uhheung.voca.mission.dto;

import java.time.LocalDate;
import java.util.List;

// 오늘의 데일리 미션 응답 DTO. API_명세서 7-1 의 missions 배열 구조를 그대로 반영한다.
public record MissionResponse(
        LocalDate date,
        List<MissionItem> missions,
        boolean allCompleted,
        boolean attendanceGranted
) {}
