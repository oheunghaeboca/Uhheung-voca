package com.uhheung.voca.mission.domain;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

// 데일리 미션의 세 가지 유형. description / target 메타는 API 응답에 그대로 노출된다.
@Getter
@RequiredArgsConstructor
public enum MissionType {

    STUDY_WORDS("오늘의 단어 20개 학습하기", 20),
    TAKE_QUIZ("퀴즈 1회 응시하기", 1),
    SCORE_70("퀴즈 정답률 70% 이상 달성하기", 70);

    private final String description;
    private final int target;
}
