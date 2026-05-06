package com.uhheung.voca.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @NotBlank @Size(min = 3, max = 20) String username,
        @NotBlank @Size(min = 6, max = 50) String password,
        @NotBlank @Size(min = 1, max = 20) String nickname
) {}
