package com.uhheung.voca.common.exception;

import com.uhheung.voca.common.dto.ErrorResponse;
import io.jsonwebtoken.JwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 잡히지 않은 예외를 JSON {@link ErrorResponse} 로 번역하는 단일 지점.
 *
 * 매칭 우선순위는 Spring 이 처리한다 (가장 구체적인 예외 타입이 우선). 새 예외를 추가하려면
 * 여기에 {@code @ExceptionHandler} 메서드만 더하면 된다 — 컨트롤러는 try/catch 가 깔끔하게 없어진다.
 *
 * 로깅 정책:
 *  - validation / BadCredentials / JwtException : ERROR 로 찍지 않는다. 클라이언트 실수
 *    범주라 운영 대시보드를 도배하지 않도록 한다.
 *  - JwtException : WARN 으로 예외 클래스명만 — 토큰 자체는 절대 로깅 X.
 *  - 그 외 미처리 : ERROR 로 풀 스택트레이스. 단, 클라이언트에는 일반 메시지만 보낸다.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 도메인에서 던진 비즈니스 에러는 자기 ErrorCode 를 들고 있으니 그대로 매핑. */
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErrorResponse> handleApi(ApiException e) {
        ErrorCode ec = e.getErrorCode();
        return ResponseEntity.status(ec.getStatus())
                .body(ErrorResponse.of(ec.getStatus().value(), ec.getCode(), e.getMessage()));
    }

    /**
     * @RequestBody + @Valid 의 bean-validation 실패. 첫 번째 실패 필드만 메시지에 노출해서
     * 프론트엔드가 어떤 입력을 강조해야 하는지 알게 한다. 다중 필드 표시가 필요해지면
     * 전체 fieldErrors 를 JSON 배열로 매핑하도록 바꾸면 된다.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .orElse(ErrorCode.INVALID_INPUT.getMessage());
        return ResponseEntity.status(ErrorCode.INVALID_INPUT.getStatus())
                .body(ErrorResponse.of(400, ErrorCode.INVALID_INPUT.getCode(), message));
    }

    /**
     * Spring Security 또는 AuthService 가 던지는 자격증명 실패. 항상 401 + 일반 메시지
     * (INVALID_CREDENTIALS) — username 열거 방지 이유는 AuthService 클래스 주석 참고.
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException e) {
        ErrorCode ec = ErrorCode.INVALID_CREDENTIALS;
        return ResponseEntity.status(ec.getStatus())
                .body(ErrorResponse.of(ec.getStatus().value(), ec.getCode(), ec.getMessage()));
    }

    /**
     * 토큰 관련 실패(만료, 서명 불일치, 구조 깨짐) 모두 여기로 올라온다.
     * 모두 동일하게 401 + INVALID_TOKEN 으로 응답한다. 토큰 문자열은 절대 로깅하지 않고
     * 예외 클래스명만 남겨, 공격자가 로그를 통해 파싱 내부 구조를 추론하지 못하게 한다.
     */
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ErrorResponse> handleJwt(JwtException e) {
        log.warn("JWT 처리 실패: {}", e.getClass().getSimpleName());
        ErrorCode ec = ErrorCode.INVALID_TOKEN;
        return ResponseEntity.status(ec.getStatus())
                .body(ErrorResponse.of(ec.getStatus().value(), ec.getCode(), ec.getMessage()));
    }

    /**
     * 마지막 안전망. 위에서 매칭되지 않은 모든 예외는 일반 500 으로 처리한다.
     * 디버깅용으로 풀 스택트레이스는 로그에 남기지만, 클라이언트에는 일반 메시지만 — 내부
     * 정보(DB 스키마, 파일 경로 등)가 절대 새지 않도록 한다.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.status(ErrorCode.NOT_FOUND.getStatus())
                .body(ErrorResponse.of(404, ErrorCode.NOT_FOUND.getCode(), e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnknown(Exception e) {
        log.error("unhandled exception", e);
        return ResponseEntity.status(ErrorCode.INTERNAL_ERROR.getStatus())
                .body(ErrorResponse.of(500, ErrorCode.INTERNAL_ERROR.getCode(), ErrorCode.INTERNAL_ERROR.getMessage()));
    }
}
