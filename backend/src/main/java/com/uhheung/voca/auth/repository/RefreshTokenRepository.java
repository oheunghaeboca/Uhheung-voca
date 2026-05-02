package com.uhheung.voca.auth.repository;

import com.uhheung.voca.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * RefreshToken JPA 리포지토리.
 * 모든 조회는 token_hash 로 한다 — 원본 토큰을 받으면 같은 방식으로 해싱한 뒤 비교.
 */
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByTokenHash(String tokenHash);
}
