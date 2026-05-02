package com.uhheung.voca.auth.service;

import com.uhheung.voca.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // TODO: signup(SignupRequest) → User 저장 (BCrypt)
    // TODO: login(LoginRequest) → JWT 발급
    // TODO: me(Long userId) → MeResponse
}
