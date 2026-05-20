package com.uhheung.voca.mission.controller;

import com.uhheung.voca.common.exception.ApiException;
import com.uhheung.voca.common.exception.ErrorCode;
import com.uhheung.voca.mission.dto.MissionResponse;
import com.uhheung.voca.mission.service.MissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/missions")
@RequiredArgsConstructor
public class MissionController {

    private final MissionService missionService;

    // 인증된 사용자의 오늘 미션 현황을 조회한다 (PBI-12).
    @GetMapping("/today")
    public ResponseEntity<MissionResponse> todayMission(Authentication authentication) {
        String username = resolveUsername(authentication);
        return ResponseEntity.ok(missionService.todayMission(username));
    }

    // Authentication 이 null 이거나 username 이 비어있으면 401 매핑 예외를 던진다.
    private String resolveUsername(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        }
        return authentication.getName();
    }
}
