package com.uhheung.voca.auth.dto;

import com.uhheung.voca.user.entity.User;

/**
 * 클라이언트에 응답해도 안전한 {@link User} 의 비민감 뷰.
 * 이 record 에는 password 필드 자체가 없다 — 응답 타입에서 password 를 아예 제거해
 * 실수로 비밀번호 해시가 새는 일을 원천 차단한다.
 *
 * {@link AuthResponse} 의 user 필드와 회원가입 응답 본문 양쪽에서 사용한다.
 */
public record UserSummary(
        Long id,
        String username,
        String nickname,
        String role
) {
    /** Entity → 요약 객체 단일 변환점. */
    public static UserSummary from(User user) {
        return new UserSummary(
                user.getId(),
                user.getUsername(),
                user.getNickname(),
                user.getRole().name()
        );
    }
}
