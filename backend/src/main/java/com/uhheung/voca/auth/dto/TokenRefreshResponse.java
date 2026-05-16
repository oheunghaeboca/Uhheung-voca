package com.uhheung.voca.auth.dto;

/**
 * POST /api/auth/refresh 의 응답.
 *
 * 로그인 응답({@link AuthResponse})과 달리 user 객체는 포함하지 않는다 — 클라이언트는
 * 처음 로그인 시 받은 사용자 정보를 그대로 쓰면 되고, 매 refresh 마다 사용자 정보를
 * 다시 내려보낼 이유가 없다 (전송량 / 노출 면적 절약).
 *
 * 회전(rotation) 결과:
 *  - accessToken         : 새로 서명된 JWT
 *  - refreshToken        : 새로 발급된 raw 토큰 (이전 토큰은 서버에서 revoke 됨)
 *  - expiresIn           : access 토큰 유효시간(초)
 *  - refreshExpiresIn    : refresh 토큰 유효시간(초)
 */
public record TokenRefreshResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        long refreshExpiresIn
) {
    public static TokenRefreshResponse bearer(
            String accessToken,
            String refreshToken,
            long accessExpiresInSeconds,
            long refreshExpiresInSeconds
    ) {
        return new TokenRefreshResponse(
                accessToken, refreshToken, "Bearer",
                accessExpiresInSeconds, refreshExpiresInSeconds
        );
    }
}
