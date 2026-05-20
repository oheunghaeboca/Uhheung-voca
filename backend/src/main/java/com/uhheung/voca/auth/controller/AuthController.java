package com.uhheung.voca.auth.controller;

import com.uhheung.voca.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // TODO: POST /api/auth/signup
    // TODO: POST /api/auth/login
    // TODO: GET  /api/auth/me  (인증 필요)
    // TODO: POST /api/auth/logout
}
