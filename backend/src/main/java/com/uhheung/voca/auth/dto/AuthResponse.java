package com.uhheung.voca.auth.dto;

/**
 * POST /api/auth/login 의 응답.
 *
 * 형태:
 *   {
 *     "accessToken":      "eyJhbGc...",
 *     "refreshToken":     "abc123...",
 *     "tokenType":        "Bearer",
 *     "expiresIn":        3600,
 *     "refreshExpiresIn": 1209600,
 *     "user": { "id":1, "username":"...", "nickname":"...", "role":"USER" }
 *   }
 *
 * "expiresIn" 을 초 단위로 두는 이유: OAuth2 / RFC 6749 의 관례. 프론트엔드가
 * (Date.now() + expiresIn * 1000) 로 절대 만료 시각을 계산해 재로그인 시점을 결정하기 쉽다.
 *
 * accessToken 은 짧은 수명(1h)이라 매 요청에 사용해도 부담 적고, 만료 시 refreshToken 으로
 * 새로 발급받을 수 있다. refreshToken 은 길고(14d) 한 번 쓰면 회전된다 — 한 번 사용된
 * refreshToken 을 다시 쓰면 401 + INVALID_REFRESH_TOKEN 이 떨어진다.
 *
 * user 객체를 중첩한 이유: 토큰 데이터와 사용자 신원 데이터를 분리해두면, refresh
 * 응답({@link TokenRefreshResponse})은 user 없이 토큰만 내려보낼 수 있어 깔끔하다.
 */
public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresIn,
        long refreshExpiresIn,
        UserSummary user
) {
    /** 편의 팩토리. tokenType 은 항상 "Bearer". */
    public static AuthResponse bearer(
            String accessToken,
            String refreshToken,
            long accessExpiresInSeconds,
            long refreshExpiresInSeconds,
            UserSummary user
    ) {
        return new AuthResponse(
                accessToken, refreshToken, "Bearer",
                accessExpiresInSeconds, refreshExpiresInSeconds, user
        );
    }
}
