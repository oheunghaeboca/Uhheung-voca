package com.uhheung.voca.config;

import com.uhheung.voca.user.entity.Role;
import com.uhheung.voca.user.entity.User;
import com.uhheung.voca.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * 관리자 계정 부트스트랩.
 *
 * 부팅 시 application-local.yml 의 admin.bootstrap-* 값을 읽어, 해당 username 의 ADMIN 계정이
 * 없으면 생성한다. 코드/마이그레이션에 비밀번호가 박히지 않게 하려는 의도이고, 키가 비어있으면
 * 아무 일도 하지 않으므로 팀원이 yml 에 값을 채우기 전까지는 자동 생성되지 않는다.
 *
 * 정책:
 *  - username 이 이미 존재하면 갱신하지 않음(관리자가 비번을 바꾼 뒤에 env 가 덮어쓰는 사고 방지).
 *  - 비번은 BCrypt 로 해싱해 저장 — 평문이 DB 에 들어가지 않게.
 *  - 한 번에 하나의 admin 계정만 부트스트랩. 추가 admin 은 승격 API 로 만든다(추후).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminBootstrapRunner implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.bootstrap-username:}")
    private String username;

    @Value("${admin.bootstrap-password:}")
    private String password;

    @Value("${admin.bootstrap-nickname:관리자}")
    private String nickname;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            log.info("관리자 부트스트랩 비활성: admin.bootstrap-username/password 미설정");
            return;
        }
        if (userRepository.existsByUsername(username)) {
            log.info("관리자 부트스트랩 건너뜀: username={} 이미 존재", username);
            return;
        }
        User admin = User.builder()
                .username(username)
                .password(passwordEncoder.encode(password))
                .nickname(nickname)
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);
        log.info("관리자 계정 생성: username={} role=ADMIN", username);
    }
}
