package com.uhheung.voca.auth.dto;

public record AuthResponse(
        String accessToken,
        String tokenType,
        Long userId,
        String username,
        String nickname,
        String role
) {}
