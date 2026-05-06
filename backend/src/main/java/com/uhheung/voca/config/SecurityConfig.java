package com.uhheung.voca.config;

import com.uhheung.voca.auth.security.JwtAccessDeniedHandler;
import com.uhheung.voca.auth.security.JwtAuthenticationEntryPoint;
import com.uhheung.voca.auth.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security 의 중앙 설정. JWT 기반 stateless 인증 모델을 구성한다.
 *
 *  - CSRF disable               : 쿠키/세션을 쓰지 않으므로 CSRF 위협 모델이 적용 안 됨.
 *  - formLogin / httpBasic off  : Authorization 헤더로만 인증한다.
 *  - SessionCreationPolicy.STATELESS : 매 요청이 자기 JWT 를 들고 와야 한다.
 *                                   서버는 HttpSession 을 절대 만들지 않는다.
 *  - CORS                       : Vite 개발 서버 origin 만 허용.
 *  - 커스텀 401 / 403 핸들러     : API 의 JSON 에러 형식을 일관되게 유지.
 *  - JwtAuthenticationFilter    : UsernamePasswordAuthenticationFilter 앞에 두어
 *                                   인가(authorization) 규칙이 평가되기 전에 SecurityContext
 *                                   가 채워지도록 한다.
 *
 * 공개 엔드포인트 (인증 불필요):
 *   POST /api/auth/signup, POST /api/auth/login, /actuator/health/**, /actuator/info
 *   그리고 모든 CORS preflight(OPTIONS) 요청.
 * 그 외 모든 요청은 유효한 토큰을 요구한다.
 */
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    @Value("${cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 쿠키/세션을 쓰지 않으니 CSRF 보호는 불필요. 켜두면 정상 POST 가 막힌다.
                .csrf(AbstractHttpConfigurer::disable)
                // 아래에서 정의한 CORS 규칙을 모든 요청에 적용.
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 사용하지 않는 로그인 메커니즘 비활성화.
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                // HttpSession 을 만들지 않는다. 인증은 오직 매 요청의 Bearer 토큰으로만.
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // ErrorResponse 형식과 일치하는 JSON 401 / 403 응답을 사용.
                .exceptionHandling(eh -> eh
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(jwtAccessDeniedHandler)
                )
                .authorizeHttpRequests(auth -> auth
                        // CORS preflight 는 인증 없이 항상 통과해야 한다.
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // 인증 진입점 자체에 토큰을 요구할 수는 없다.
                        // refresh: access 만료 상태에서 호출되므로 인증 못 요구.
                        // logout: idempotent — 익명 호출도 그냥 받는다.
                        .requestMatchers(
                                "/api/auth/signup",
                                "/api/auth/login",
                                "/api/auth/refresh",
                                "/api/auth/logout"
                        ).permitAll()
                        // 헬스체크는 LB / k8s probe 가 호출하므로 인증 없이 동작해야 한다.
                        .requestMatchers("/actuator/health/**", "/actuator/info").permitAll()
                        // 그 외 모든 요청은 유효한 JWT 필요.
                        .anyRequest().authenticated()
                )
                // Spring 의 기본 폼 로그인 필터 앞에 JWT 필터를 위치시켜,
                // 인가 검사 전에 SecurityContext 가 채워지도록 한다.
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    /**
     * CORS 규칙.
     *
     * 왜 allowCredentials = false 인가?
     *   프론트엔드는 JWT 를 직접 저장해 Authorization 헤더로 보낸다. 인증에 쿠키를 쓰지
     *   않으므로 브라우저가 cross-origin 요청에 credentials 를 포함할 필요가 없다.
     *   credentials=false 로 두면 와일드카드 origin 금지 같은 엄격한 규칙도 피할 수 있어
     *   설정이 단순해진다.
     *
     * 허용 origin 은 {@code cors.allowed-origins} 프로퍼티(콤마 구분)에서 읽는다.
     * 개발 환경 기본값은 Vite 서버(:5173).
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(Arrays.stream(allowedOrigins.split(",")).map(String::trim).toList());
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
        // 컨트롤러가 응답 헤더로 새 토큰을 돌려주는 경우(아직 미사용)에 대비해 Authorization 노출.
        cfg.setExposedHeaders(List.of("Authorization"));
        cfg.setAllowCredentials(false);
        cfg.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
