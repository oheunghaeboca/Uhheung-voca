package com.uhheung.voca.auth.security;

import com.uhheung.voca.user.entity.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

/**
 * HS256 액세스 토큰을 발급하고 검증하는 컴포넌트.
 *
 * 설계 메모:
 *  - HS256 은 하나의 공유 비밀키로 서명과 검증을 모두 수행한다. 따라서 이 시크릿은
 *    절대 서버 밖으로 나가면 안 되고, 로그에도 찍지 않는다.
 *  - 시크릿은 {@code jwt.secret} 프로퍼티에서 읽어온다. application.yml 에는
 *    placeholder({@code ${JWT_SECRET:}}) 만 있고, 실제 값은 application-local.yml
 *    (gitignore 대상) 또는 환경변수 JWT_SECRET 에 둔다.
 *  - {@link #init()} 가 부팅 시 1회 실행되어 시크릿이 비어있거나 32바이트 미만이면
 *    부팅 자체를 실패시킨다 (fail-fast). 약한 기본값으로 조용히 부팅되면 소스코드를
 *    읽을 수 있는 누구든 토큰을 위조할 수 있게 되므로, 일부러 부팅을 막는다.
 *  - 토큰 claim 은 최소한만 담는다: subject = username, 그리고 uid / role.
 *    민감정보(비밀번호, 이메일 등)는 claim 에 넣으면 안 됨 — JWT payload 는
 *    암호화가 아니라 단순 base64 인코딩이라 누구든 디코딩해서 볼 수 있다.
 */
@Slf4j
@Component
public class JwtTokenProvider {

    private final String secret;
    private final long validityMs;
    private SecretKey signingKey;

    public JwtTokenProvider(
            @Value("${jwt.secret:}") String secret,
            @Value("${jwt.access-token-validity-ms:3600000}") long validityMs
    ) {
        this.secret = secret;
        this.validityMs = validityMs;
    }

    /**
     * 시크릿을 검증하고, 매 서명/검증마다 사용할 {@link SecretKey} 를 미리 만들어둔다.
     *
     * 왜 fail-fast 인가?
     *  - 시크릿이 비어있으면 (a) 첫 요청에서 갑자기 죽거나, (b) 추측 가능한 기본값으로
     *    조용히 동작하게 된다. 둘 다 부팅 실패보다 나쁘다. 예외 메시지에 어떤 프로퍼티를
     *    설정해야 하는지 정확히 알려주는 것이 운영자에게 친절하다.
     *  - HS256 은 최소 256비트(=32바이트) 키를 요구한다. jjwt 0.12 가 자체 검증을
     *    하긴 하지만, 여기서 먼저 잡아야 메시지가 명확하다.
     */
    @PostConstruct
    void init() {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException(
                    "jwt.secret 가 비어있습니다. 환경변수 JWT_SECRET 또는 application-local.yml 의 jwt.secret 을 설정하세요."
            );
        }
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException(
                    "jwt.secret 은 HS256 요구사항에 따라 최소 32바이트(=base64 44자) 이상이어야 합니다."
            );
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * 주어진 사용자 정보로 서명된 JWT 를 생성한다.
     *
     * Claim 구성:
     *  - sub  (subject) : username — 필터에서 SecurityContext 의 principal 로 사용
     *  - uid            : 숫자 user id — 서비스 계층 조회에 편리
     *  - role           : "USER" / "ADMIN" — 필터가 "ROLE_USER" / "ROLE_ADMIN"
     *                     authority 로 변환해 SecurityContext 에 저장
     *  - iat / exp      : 발급 시각 / 만료 시각 (epoch 초)
     *
     * 토큰 자체는 어디에도 로깅하지 않는다. 호출 측 서비스가 INFO 로그로 username 만 남긴다.
     */
    public String createToken(String username, Long userId, Role role) {
        Instant now = Instant.now();
        Instant exp = now.plusMillis(validityMs);
        return Jwts.builder()
                .subject(username)
                .claim("uid", userId)
                .claim("role", role.name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(signingKey)
                .compact();
    }

    /**
     * 토큰 서명과 만료를 검증하고 claim 을 돌려준다.
     *
     * 실패 시 {@link io.jsonwebtoken.JwtException} 의 하위 예외가 발생:
     *  - {@code ExpiredJwtException}    — 만료됨
     *  - {@code SignatureException}     — 서명 불일치 (위/변조)
     *  - {@code MalformedJwtException}  — JWT 구조가 깨짐
     *  - {@code UnsupportedJwtException} / {@code IllegalArgumentException}
     *
     * 호출자(필터)가 부모 {@code JwtException} 을 잡아 SecurityContext 를 비우고
     * 요청은 그대로 진행시킨다. 글로벌 핸들러도 같은 예외를 잡아 401 응답을 만든다.
     */
    public Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /** 토큰 유효 시간(초). 응답 DTO 의 {@code expiresIn} 필드용. */
    public long getValiditySeconds() {
        return validityMs / 1000L;
    }
}
