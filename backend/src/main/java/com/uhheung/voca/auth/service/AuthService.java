package com.uhheung.voca.auth.service;

import com.uhheung.voca.auth.dto.AuthResponse;
import com.uhheung.voca.auth.dto.LoginRequest;
import com.uhheung.voca.auth.dto.MeResponse;
import com.uhheung.voca.auth.dto.SignupRequest;
import com.uhheung.voca.auth.dto.TokenRefreshResponse;
import com.uhheung.voca.auth.dto.UserSummary;
import com.uhheung.voca.auth.entity.RefreshToken;
import com.uhheung.voca.auth.security.JwtTokenProvider;
import com.uhheung.voca.common.exception.ApiException;
import com.uhheung.voca.common.exception.ErrorCode;
import com.uhheung.voca.user.entity.Role;
import com.uhheung.voca.user.entity.User;
import com.uhheung.voca.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 인증 비즈니스 로직: 회원가입, 로그인, 토큰 재발급(refresh), 로그아웃, 내 정보 조회.
 *
 * 토큰 모델:
 *  - access token  : 짧은 수명의 JWT (1h). 매 보호된 요청에 사용.
 *  - refresh token : 긴 수명의 opaque random string (14d). access 만료 시 새 access 발급용.
 *    한 번 사용되면 즉시 회전 — 같은 refresh 토큰은 두 번 못 쓴다.
 *
 * 보안 규칙:
 *  - 비밀번호는 BCrypt 로 해싱한 뒤에만 저장. 평문이 엔티티/로그에 절대 닿지 않게.
 *  - 로그인 실패 시 "사용자 없음" 과 "비밀번호 틀림" 을 같은 메시지로 — username 열거 방지.
 *  - refresh 검증 실패도 사유 구분 없이 동일 메시지 — 토큰 분석을 어렵게 한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;

    /**
     * 새 사용자를 등록한다.
     *
     * 흐름:
     *   1. username 중복이면 거절 (409).
     *   2. 비밀번호 BCrypt 해싱(cost=10).
     *   3. role = USER 로 저장. ADMIN 은 회원가입 경로로 만들지 않는다.
     *   4. 비민감 요약 객체로 응답.
     */
    public UserSummary signup(SignupRequest req) {
        if (userRepository.existsByUsername(req.username())) {
            throw new ApiException(ErrorCode.DUPLICATE_USERNAME);
        }
        User user = User.builder()
                .username(req.username())
                .password(passwordEncoder.encode(req.password()))
                .nickname(req.nickname())
                .role(Role.USER)
                .build();
        User saved = userRepository.save(user);
        log.info("회원가입 성공 username={}", saved.getUsername());
        return UserSummary.from(saved);
    }

    /**
     * 자격증명을 검증하고 access + refresh 토큰을 함께 발급한다.
     * 다중 세션 허용 — 폰/노트북 로그인이 서로 영향 주지 않게 기존 refresh 들은 건드리지 않는다.
     */
    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByUsername(req.username())
                .orElseThrow(() -> new BadCredentialsException(ErrorCode.INVALID_CREDENTIALS.getMessage()));
        if (!passwordEncoder.matches(req.password(), user.getPassword())) {
            throw new BadCredentialsException(ErrorCode.INVALID_CREDENTIALS.getMessage());
        }
        String accessToken = jwtTokenProvider.createToken(user.getUsername(), user.getId(), user.getRole());
        var refreshIssued = refreshTokenService.issue(user.getId());
        log.info("로그인 성공 username={}", user.getUsername());
        return AuthResponse.bearer(
                accessToken,
                refreshIssued.rawToken(),
                jwtTokenProvider.getValiditySeconds(),
                refreshTokenService.getValiditySeconds(),
                UserSummary.from(user)
        );
    }

    /**
     * 리프레시 토큰을 받아 새 access + refresh 를 발급한다(회전).
     *
     * 흐름:
     *   1. raw refresh 의 해시로 DB 조회 → 활성 상태 검증.
     *   2. 토큰 소유자(User)를 다시 로드. 그 사이 사용자가 삭제되었다면 401.
     *   3. 기존 refresh 를 revoke 하고 새 refresh 발급(rotation).
     *   4. 새 access 토큰을 서명해 함께 응답.
     */
    public TokenRefreshResponse refresh(String rawRefreshToken) {
        RefreshToken existing = refreshTokenService.verifyAndGet(rawRefreshToken);
        User user = userRepository.findById(existing.getUserId())
                .orElseThrow(() -> new ApiException(ErrorCode.INVALID_REFRESH_TOKEN));
        var newRefresh = refreshTokenService.rotate(existing);
        String newAccess = jwtTokenProvider.createToken(user.getUsername(), user.getId(), user.getRole());
        log.info("토큰 회전 성공 username={}", user.getUsername());
        return TokenRefreshResponse.bearer(
                newAccess,
                newRefresh.rawToken(),
                jwtTokenProvider.getValiditySeconds(),
                refreshTokenService.getValiditySeconds()
        );
    }

    /**
     * 로그아웃. 들어온 refresh 토큰을 폐기한다.
     * 토큰이 없거나 이미 폐기된 경우에도 동일하게 성공으로 처리(idempotent).
     * 다른 디바이스의 세션은 영향받지 않는다.
     */
    public void logout(String rawRefreshToken) {
        refreshTokenService.revoke(rawRefreshToken);
        log.info("로그아웃 처리 완료");
    }

    /**
     * 현재 인증된 사용자의 프로필.
     * username 은 JWT subject 에서 온 값으로 JwtAuthenticationFilter 가 SecurityContext 에 채워둔 것.
     */
    @Transactional(readOnly = true)
    public MeResponse me(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(ErrorCode.UNAUTHORIZED));
        return MeResponse.from(user);
    }
}
