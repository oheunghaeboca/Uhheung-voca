package com.uhheung.voca.auth.dto;

public record MeResponse(
        Long userId,
        String username,
        String nickname,
        String role
) {}
