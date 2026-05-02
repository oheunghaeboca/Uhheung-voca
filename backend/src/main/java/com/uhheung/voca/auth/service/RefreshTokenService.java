package com.uhheung.voca.auth.service;

import com.uhheung.voca.auth.entity.RefreshToken;
import com.uhheung.voca.auth.repository.RefreshTokenRepository;
import com.uhheung.voca.common.exception.ApiException;
import com.uhheung.voca.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;

/**
 * 리프레시 토큰 발급 / 검증 / 회전 / 폐기를 담당.
 *
 * 보안 요점:
 *  - 원본 토큰은 SecureRandom 으로 32바이트(=256비트) 무작위 생성 후 URL-safe base64 로 인코딩.
 *  - DB 에는 SHA-256 해시(hex 64자)만 저장. 원본 토큰은 응답 1회 후 서버 메모리에서 사라진다.
 *  - 토큰 회전(rotation): refresh 가 사용될 때마다 기존을 revoke 하고 새 토큰을 발급.
 *    한 번 쓴 refresh 는 다시 못 쓰므로, 토큰이 탈취되어도 정상 사용자가 한 번만 회전시키면
 *    공격자의 토큰은 즉시 무효화된다.
 *  - 검증은 항상 "해시 일치 + 활성 상태(미폐기 + 미만료)" 둘 다 본다.
 *
 * 트랜잭션:
 *  - 클래스 레벨 @Transactional 으로 기본은 쓰기 트랜잭션.
 *  - 읽기 전용 메서드는 메서드 레벨에서 readOnly = true 로 덮어쓴다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenService {

    /** 한 번만 만들어 재사용. SecureRandom 은 thread-safe. */
    private static final SecureRandom RANDOM = new SecureRandom();

    /** 256비트 = 무작위 추측 공격에 안전한 길이. */
    private static final int TOKEN_BYTES = 32;

    private final RefreshTokenRepository repository;

    /** 리프레시 토큰 유효기간(ms). 기본 14일. application.yml 에서 덮어쓸 수 있다. */
    @Value("${jwt.refresh-token-validity-ms:1209600000}")
    private long validityMs;

    /**
     * 새 리프레시 토큰을 발급해 DB 에 해시로 저장하고, 원본 문자열을 호출 측에 돌려준다.
     * 호출 측은 이 원본 문자열을 응답 본문에 한 번 실어 보내고 변수에서 삭제해야 한다.
     */
    public IssueResult issue(Long userId) {
        String raw = generateRawToken();
        String hash = sha256Hex(raw);
        LocalDateTime expiresAt = LocalDateTime.now().plus(Duration.ofMillis(validityMs));
        RefreshToken entity = RefreshToken.builder()
                .userId(userId)
                .tokenHash(hash)
                .expiresAt(expiresAt)
                .build();
        repository.save(entity);
        log.info("리프레시 토큰 발급 userId={} expiresAt={}", userId, expiresAt);
        return new IssueResult(raw, expiresAt);
    }

    /**
     * 원본 토큰을 받아 해시 일치 + 활성 상태를 검증하고 엔티티를 돌려준다.
     * 실패 시 INVALID_REFRESH_TOKEN(401). 메시지는 "없음"/"만료"/"폐기됨" 을 구분하지 않는다 —
     * 공격자에게 어디까지 맞췄는지 힌트를 주지 않기 위해.
     */
    @Transactional(readOnly = true)
    public RefreshToken verifyAndGet(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new ApiException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
        String hash = sha256Hex(rawToken);
        RefreshToken entity = repository.findByTokenHash(hash)
                .orElseThrow(() -> new ApiException(ErrorCode.INVALID_REFRESH_TOKEN));
        if (!entity.isActive(LocalDateTime.now())) {
            throw new ApiException(ErrorCode.INVALID_REFRESH_TOKEN);
        }
        return entity;
    }

    /**
     * 토큰 회전. 기존 엔티티를 revoke 하고 같은 user 에 대해 새 토큰을 발급한다.
     * 같은 트랜잭션 안에서 둘 다 일어나므로, revoke 만 되고 발급은 실패하는 일은 없다.
     */
    public IssueResult rotate(RefreshToken existing) {
        existing.revoke();
        return issue(existing.getUserId());
    }

    /**
     * 로그아웃 등에서 호출. 해시가 매칭되면 revoke, 매칭되지 않으면 조용히 무시한다.
     * 존재 여부를 응답으로 흘리지 않기 위함 (logout 은 idempotent 해야 한다).
     */
    public void revoke(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            return;
        }
        String hash = sha256Hex(rawToken);
        repository.findByTokenHash(hash).ifPresent(RefreshToken::revoke);
    }

    /** 응답 DTO 의 refreshExpiresIn 필드용. */
    public long getValiditySeconds() {
        return validityMs / 1000L;
    }

    /** SecureRandom 32바이트 → URL-safe base64(패딩 제거). 길이는 약 43자. */
    private static String generateRawToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    /** SHA-256 해시 후 소문자 hex 64자로 인코딩. */
    private static String sha256Hex(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available on this JVM", e);
        }
    }

    /**
     * 발급 결과. raw 토큰은 호출 측이 응답에 한 번 실은 뒤 폐기해야 한다.
     */
    public record IssueResult(String rawToken, LocalDateTime expiresAt) {}
}
