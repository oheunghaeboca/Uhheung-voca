package com.uhheung.voca.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * POST /api/auth/signup 의 요청 본문.
 *
 * 검증 규칙:
 *  - username : 4~20자, ASCII 영문/숫자/언더스코어만.
 *  - password : 8~72자. 상한이 72인 이유는 BCrypt 의 hard limit — 72바이트 초과분은
 *               BCrypt 가 조용히 잘라내므로, 미리 거절해서 혼동을 줄인다.
 *  - nickname : 1~20자. 한글 등 유니코드 허용.
 *
 * @NotBlank 가 필요한 이유: @Size(min=4) 는 null 값을 통과시킨다. @NotBlank 만이
 * null/빈 문자열/공백 문자열을 모두 거절한다.
 */
public record SignupRequest(
        @NotBlank
        @Size(min = 4, max = 20, message = "username은 4~20자여야 합니다.")
        @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "username은 영문/숫자/언더스코어만 허용합니다.")
        String username,

        @NotBlank
        @Size(min = 8, max = 72, message = "password는 8~72자여야 합니다.")
        String password,

        @NotBlank
        @Size(min = 1, max = 20, message = "nickname은 1~20자여야 합니다.")
        String nickname
) {}
