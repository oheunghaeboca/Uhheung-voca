package com.uhheung.voca.auth.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * POST /api/auth/login 의 요청 본문.
 *
 * 일부러 길이 제약을 두지 않았다. 구조적으로는 비어있지 않기만 하면 통과시키고,
 * 실제 거절은 AuthService 의 passwordEncoder.matches() 가 한다. 여기에 @Size 를
 * 추가하면 공격자에게 우리 비밀번호 정책에 대한 힌트만 주게 된다.
 */
public record LoginRequest(
        @NotBlank String username,
        @NotBlank String password
) {}
