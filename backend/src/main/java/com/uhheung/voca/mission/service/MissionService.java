package com.uhheung.voca.mission.service;

import com.uhheung.voca.mission.repository.DailyMissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MissionService {

    private final DailyMissionRepository dailyMissionRepository;

    // TODO: today(userId) → 오늘 미션 조회/생성
    // TODO: progress 갱신 (단어 학습 / 퀴즈 응시 / 최고점 갱신 → 완료 시 출석 인정)
}
