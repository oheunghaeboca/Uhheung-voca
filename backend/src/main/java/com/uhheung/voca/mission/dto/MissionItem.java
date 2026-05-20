package com.uhheung.voca.mission.dto;

// 데일리 미션 응답의 개별 미션 항목.
public record MissionItem(
        String missionType,
        String description,
        int target,
        int current,
        boolean isCompleted
) {}
