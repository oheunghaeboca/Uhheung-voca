package com.uhheung.voca.auth.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtTokenProvider {

    private final String secret;
    private final long expirationMs;

    public JwtTokenProvider(
            @Value("${voca.jwt.secret:CHANGE_ME_IN_application-local_yml}") String secret,
            @Value("${voca.jwt.expiration-ms:3600000}") long expirationMs
    ) {
        this.secret = secret;
        this.expirationMs = expirationMs;
    }

    // TODO: createToken(userId, role) — jjwt 0.12.6
    // TODO: getUserIdFromToken(token)
    // TODO: validateToken(token)
}
