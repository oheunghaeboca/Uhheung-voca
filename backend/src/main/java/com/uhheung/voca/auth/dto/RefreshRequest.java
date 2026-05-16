package com.uhheung.voca.auth.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * POST /api/auth/refresh 와 POST /api/auth/logout 의 요청 본문.
 * 두 엔드포인트 모두 "어떤 refresh 토큰을 다룰지" 만 받으면 되므로 같은 DTO 를 공유한다.
 */
public record RefreshRequest(
        @NotBlank String refreshToken
) {}
