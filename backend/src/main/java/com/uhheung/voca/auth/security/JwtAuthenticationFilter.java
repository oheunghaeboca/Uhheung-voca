package com.uhheung.voca.auth.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * 모든 요청에서 Bearer 토큰을 검사하고, 유효하면 SecurityContext 에 인증 정보를 채워
 * 컨트롤러나 {@code @PreAuthorize} 가 인증된 사용자를 볼 수 있게 한다.
 *
 * 필터 체인 위치 ({@link com.uhheung.voca.config.SecurityConfig} 에서 설정):
 *   ... → 이 필터 → UsernamePasswordAuthenticationFilter → ...
 * UPAF 앞에 두는 이유는, Spring 의 기본 폼 로그인 필터가 동작하기 전에 토큰으로
 * 인증을 끝내기 위함이다. 폼 로그인은 어차피 disable 했지만, 관례적으로 이 위치가 표준이다.
 *
 * 동작 매트릭스 (의도된 동작):
 *  - Authorization 헤더 없음 / Bearer 형식 아님 → 비인증 상태로 통과.
 *    보호된 엔드포인트라면 EntryPoint 가 401 응답을 만든다.
 *  - Bearer + 유효한 토큰   → SecurityContext 채우고 통과.
 *  - Bearer + 유효하지 않은 토큰 → SecurityContext 비우고(방어적) 통과.
 *    보호된 엔드포인트라면 EntryPoint 가 401 응답을 만든다.
 *  필터 안에서 직접 401 을 던지지 않는 이유는, 공개 엔드포인트(/actuator/health 등)
 *  에 stale 토큰을 들고 와도 정상 동작해야 하기 때문이다.
 *
 * 로깅 정책: 토큰 문자열은 절대 로깅하지 않는다. DEBUG 로 예외 클래스명만 남긴다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String token = resolveToken(request);
        if (StringUtils.hasText(token)) {
            try {
                // 서명 + 만료 검증. 실패하면 JwtException 계열 예외가 던져진다.
                Claims claims = jwtTokenProvider.parseClaims(token);
                String username = claims.getSubject();
                String role = claims.get("role", String.class);
                if (StringUtils.hasText(username) && StringUtils.hasText(role)) {
                    // Spring Security 는 hasRole("USER") 매칭을 위해 "ROLE_" 접두사를 요구한다.
                    // 우리는 enum 이름인 "USER"/"ADMIN" 을 그대로 저장해두고 여기서 prefix 만 붙인다.
                    var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
                    // principal 은 username(String). 토큰 자체로 신원이 증명되었으니
                    // credentials 는 null. 비밀번호를 메모리에 들고있을 이유가 없다.
                    var authentication = new UsernamePasswordAuthenticationToken(username, null, authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (JwtException e) {
                // 토큰이 있긴 한데 유효하지 않음(만료/위조/구조 깨짐).
                // 같은 스레드에서 이전 요청이 남긴 stale 인증 정보가 그대로 보이지 않도록
                // SecurityContext 를 명시적으로 비운다.
                log.debug("JWT 파싱 실패: {}", e.getClass().getSimpleName());
                SecurityContextHolder.clearContext();
            }
        }
        filterChain.doFilter(request, response);
    }

    /**
     * {@code Authorization: Bearer <token>} 헤더에서 raw 토큰만 뽑아낸다.
     * 헤더가 없거나 Bearer 형식이 아니면 null.
     */
    private String resolveToken(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (StringUtils.hasText(header) && header.startsWith(BEARER_PREFIX)) {
            return header.substring(BEARER_PREFIX.length()).trim();
        }
        return null;
    }
}
