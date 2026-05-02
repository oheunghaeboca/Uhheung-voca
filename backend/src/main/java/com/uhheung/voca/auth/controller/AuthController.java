package com.uhheung.voca.auth.controller;

import com.uhheung.voca.auth.dto.AuthResponse;
import com.uhheung.voca.auth.dto.LoginRequest;
import com.uhheung.voca.auth.dto.MeResponse;
import com.uhheung.voca.auth.dto.RefreshRequest;
import com.uhheung.voca.auth.dto.SignupRequest;
import com.uhheung.voca.auth.dto.TokenRefreshResponse;
import com.uhheung.voca.auth.dto.UserSummary;
import com.uhheung.voca.auth.service.AuthService;
import com.uhheung.voca.common.exception.ApiException;
import com.uhheung.voca.common.exception.ErrorCode;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 인증 관련 HTTP 진입점.
 *
 * 엔드포인트 계약:
 *   POST /api/auth/signup    → 201 Created      (공개)
 *   POST /api/auth/login     → 200 OK           (공개, access + refresh 발급)
 *   POST /api/auth/refresh   → 200 OK           (공개, refresh 회전)
 *   POST /api/auth/logout    → 204 No Content   (공개, idempotent)
 *   GET  /api/auth/me        → 200 OK           (Bearer 토큰 필요)
 *
 * /refresh 와 /logout 이 공개인 이유:
 *  - /refresh 는 access 가 만료된 상태에서 호출하는 곳이라 access 인증을 요구할 수 없다.
 *  - /logout 은 idempotent — 익명 호출도 그냥 받고 매칭되면 폐기, 아니면 무시.
 *
 * 컨트롤러는 의도적으로 얇게 — HTTP 매핑/검증만 하고 비즈니스 로직은 모두 AuthService.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /** 회원가입. 성공 201 + UserSummary. 검증 실패 400, 중복 409. */
    @PostMapping("/signup")
    public ResponseEntity<UserSummary> signup(@Valid @RequestBody SignupRequest req) {
        UserSummary body = authService.signup(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    /** 로그인. 성공 200 + access/refresh 토큰. 인증 실패 401(동일 메시지). */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    /**
     * 리프레시 토큰 회전. 성공 200 + 새 access/refresh.
     * 기존 refresh 는 즉시 폐기되므로 재호출 시 401.
     */
    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponse> refresh(@Valid @RequestBody RefreshRequest req) {
        return ResponseEntity.ok(authService.refresh(req.refreshToken()));
    }

    /**
     * 로그아웃. 들어온 refresh 토큰을 폐기. 항상 204.
     * 이 엔드포인트만으로는 access 토큰을 무효화하지 못한다 — JWT 자체는 stateless 라
     * 만료 시점까지 유효. 클라이언트는 access 토큰도 로컬에서 폐기해야 한다.
     */
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@Valid @RequestBody RefreshRequest req) {
        authService.logout(req.refreshToken());
        return ResponseEntity.noContent().build();
    }

    /**
     * 현재 인증된 사용자 정보. JwtAuthenticationFilter 가 채운 Authentication 을 사용.
     */
    @GetMapping("/me")
    public ResponseEntity<MeResponse> me(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ApiException(ErrorCode.UNAUTHORIZED);
        }
        return ResponseEntity.ok(authService.me(authentication.getName()));
    }
}
