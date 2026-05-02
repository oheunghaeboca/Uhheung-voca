package com.uhheung.voca.auth.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

/**
 * 리프레시 토큰의 DB 표현.
 *
 * raw 토큰 자체는 절대 저장하지 않고, SHA-256 해시(64자 hex)만 보관한다.
 * raw 토큰은 발급 시점에 응답 본문으로 1회 내보내고 폐기 — 클라이언트가 분실하면
 * 다시 로그인하는 수밖에 없다. 이 설계 덕분에 DB 가 통째로 유출되어도 공격자는
 * 토큰을 그대로 사용할 수 없다 (해시는 단방향 함수라 복원 불가).
 *
 * 상태 전이:
 *   - 발급 직후    : revokedAt = null, expiresAt = now + 14일
 *   - rotation 후 : revokedAt = 회전 시각  (한 번 사용된 refresh 는 다시 못 씀)
 *   - 만료        : expiresAt < now  (revokedAt 여부 무관하게 무효)
 *   - 로그아웃    : revokedAt = 로그아웃 시각
 */
@Getter
@Entity
@Table(name = "refresh_tokens")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 원본 토큰의 SHA-256 해시(hex 64자). 원본 토큰은 어디에도 저장하지 않는다. */
    // SHA-256 hex 는 길이가 항상 정확히 64자라 CHAR 로 고정한다 (V2 마이그레이션과 일치).
    @Column(name = "token_hash", nullable = false, unique = true, length = 64, columnDefinition = "CHAR(64)")
    private String tokenHash;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    /** null 이면 활성. 한 번 회전되거나 로그아웃되면 null 이 아닌 시각으로 채워진다. */
    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder
    private RefreshToken(Long userId, String tokenHash, LocalDateTime expiresAt) {
        this.userId = userId;
        this.tokenHash = tokenHash;
        this.expiresAt = expiresAt;
    }

    /** 폐기되지 않았고 아직 만료되지 않은 토큰만 활성으로 본다. */
    public boolean isActive(LocalDateTime now) {
        return revokedAt == null && expiresAt.isAfter(now);
    }

    /** 로그아웃 또는 회전(rotation) 시 호출되어 토큰을 비활성화한다. */
    public void revoke() {
        if (this.revokedAt == null) {
            this.revokedAt = LocalDateTime.now();
        }
    }
}
