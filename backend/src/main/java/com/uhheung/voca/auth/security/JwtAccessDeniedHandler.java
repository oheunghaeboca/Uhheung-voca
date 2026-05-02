package com.uhheung.voca.auth.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.uhheung.voca.common.dto.ErrorResponse;
import com.uhheung.voca.common.exception.ErrorCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * "인증은 됐지만 권한(role)이 부족할 때" 동작하는 핸들러.
 *
 * {@link JwtAuthenticationEntryPoint} 와 차이:
 *  - EntryPoint   → 401 Unauthorized   (토큰 없음/유효하지 않음)
 *  - 이 핸들러     → 403 Forbidden      (토큰은 유효한데 role 부족)
 *
 * 지금은 "authenticated" 만 요구하는 엔드포인트뿐이라 이 핸들러는 발동하지 않는다.
 * 추후 @PreAuthorize("hasRole('ADMIN')") 같은 매처를 추가하면 그때 401/403 응답
 * 일관성을 그대로 유지하기 위해 미리 wiring 만 해둔 것.
 */
@Component
@RequiredArgsConstructor
public class JwtAccessDeniedHandler implements AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    @Override
    public void handle(
            HttpServletRequest request,
            HttpServletResponse response,
            AccessDeniedException accessDeniedException
    ) throws IOException {
        ErrorCode ec = ErrorCode.FORBIDDEN;
        ErrorResponse body = ErrorResponse.of(ec.getStatus().value(), ec.getCode(), ec.getMessage());
        response.setStatus(ec.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }
}
