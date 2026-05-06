package com.uhheung.voca.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

/**
 * API 에러 코드의 단일 출처(Single Source of Truth).
 *
 * 각 항목은 세 가지를 한 곳에 묶는다:
 *   - HTTP status (클라이언트가 보는 wire-level 결과)
 *   - 머신 가독 코드 (프론트엔드가 분기 조건으로 쓸 안정적 문자열)
 *   - 기본 사용자용 메시지 (한국어)
 *
 * 새 에러 추가 절차: 여기에 항목을 추가하고, 서비스 계층에서 {@code new ApiException(...)}
 * 을 던진다. 글로벌 핸들러가 자동으로 JSON 응답으로 변환한다.
 *
 * 네이밍 컨벤션: SCREAMING_SNAKE_CASE. {@code code} 필드는 enum 이름과 동일하게 두어
 * 클라이언트 매칭이 단순하도록 한다.
 */
@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    /** bean-validation 일반 실패. 핸들러가 실패한 필드 이름을 메시지에 끼워넣는다. */
    INVALID_INPUT(HttpStatus.BAD_REQUEST, "VALIDATION_FAILED", "입력값이 올바르지 않습니다."),

    /** 보호된 엔드포인트인데 토큰이 없거나 유효하지 않음. */
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "UNAUTHORIZED", "인증이 필요합니다."),

    /** 로그인 실패. "사용자 없음" 과 "비밀번호 불일치" 모두 같은 메시지를 사용해
     *  username 열거 공격을 막는다. */
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS", "아이디 또는 비밀번호가 올바르지 않습니다."),

    /** 토큰 서명 불일치 / 만료 / 구조 깨짐. */
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "INVALID_TOKEN", "유효하지 않은 토큰입니다."),

    /** 리프레시 토큰이 없거나, 만료/폐기됨. 어떤 사유든 메시지는 동일하게. */
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED, "INVALID_REFRESH_TOKEN", "유효하지 않은 리프레시 토큰입니다."),

    /** 인증은 됐지만 필요한 role 이 없음. */
    FORBIDDEN(HttpStatus.FORBIDDEN, "FORBIDDEN", "권한이 없습니다."),

    /** 리소스 조회 실패. */
    NOT_FOUND(HttpStatus.NOT_FOUND, "NOT_FOUND", "리소스를 찾을 수 없습니다."),
<<<<<<< HEAD
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", "존재하지 않는 사용자입니다."),
    WORD_NOT_FOUND(HttpStatus.NOT_FOUND, "WORD_NOT_FOUND", "존재하지 않는 단어입니다."),
=======

        /** 이미 존재하는 username 으로 회원가입 시도. */
        >>>>>>> origin/feat/auth
    DUPLICATE_USERNAME(HttpStatus.CONFLICT, "DUPLICATE_USERNAME", "이미 존재하는 username 입니다."),

    /** 예상치 못한 서버 에러. 실제 원인은 로그에 남기고 응답에는 일반 메시지만. */
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", "서버 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String code;
    private final String message;
}
