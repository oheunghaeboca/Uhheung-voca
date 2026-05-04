package com.uhheung.voca.word.dto;

// PATCH 시 null인 필드는 변경하지 않음 (선택적 부분 업데이트)
public record WordUpdateRequest(
        String english,
        String korean,
        String level,
        String part,
        String type,
        String example,
        String exampleTranslation
) {}