package com.uhheung.voca.auth.dto;

import com.uhheung.voca.user.entity.User;

/**
 * GET /api/auth/me 의 응답.
 * {@link UserSummary} 와 필드는 같지만 별도 타입으로 둔 이유는, /me 가 향후 독립적으로
 * 진화할 수 있도록 하기 위함이다 (lastLoginAt, level, settings 등 추가 시 로그인 응답과
 * 결합하지 않도록).
 */
public record MeResponse(
        Long id,
        String username,
        String nickname,
        String role
) {
    public static MeResponse from(User user) {
        return new MeResponse(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getRole().name()
        );
    }
}
