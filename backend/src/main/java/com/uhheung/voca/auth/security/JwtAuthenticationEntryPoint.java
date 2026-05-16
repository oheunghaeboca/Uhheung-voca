package com.uhheung.voca.auth.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uhheung.voca.common.dto.ErrorResponse;
import com.uhheung.voca.common.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * "인증되지 않은 상태로 인증이 필요한 리소스에 접근했을 때" 동작하는 EntryPoint.
 *
 * Spring Security 가 익명 요청이 {@code .authenticated()} 엔드포인트에 도달했을 때
 * (예: 토큰 없이 /api/auth/me 호출, 또는 만료/위조 토큰을 들고 와서 필터가
 * SecurityContext 를 비운 직후) {@link #commence} 를 호출한다.
 *
 * 기본 동작은 로그인 페이지로 리다이렉트인데, 우리는 SPA + JSON API 라서
 * 다른 에러들과 동일한 형식의 JSON {@link ErrorResponse} 를 응답한다.
 * 프론트엔드는 단일 에러 포맷만 처리하면 된다.
 *
 * 메시지는 일부러 "인증이 필요합니다." 로 일반화한다 — 토큰이 없는 건지, 만료된 건지,
 * 위조된 건지 정보를 노출하지 않는다.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {
        ErrorCode ec = ErrorCode.UNAUTHORIZED;
        ErrorResponse body = ErrorResponse.of(ec.getStatus().value(), ec.getCode(), ec.getMessage());
        response.setStatus(ec.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
