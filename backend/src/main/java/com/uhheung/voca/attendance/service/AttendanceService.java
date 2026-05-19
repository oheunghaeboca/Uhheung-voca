package com.uhheung.voca.attendance.service;

import com.uhheung.voca.attendance.entity.Attendance;
import com.uhheung.voca.attendance.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 출석 부여 서비스.
 *
 * <p>PBI-12 데일리 미션 완료 시점에 호출된다. 출석은 사용자별 일자별 1회만 인정되며,
 * 같은 호출이 동시에 두 번 일어나더라도 {@code attendance(user_id, date)} UNIQUE 제약과
 * {@link #grant} 의 멱등 패턴이 두 번째 INSERT 를 흡수한다 (정책 P2).
 *
 * <p>본 서비스는 호출자가 미션 완료 판정을 끝낸 뒤에만 호출한다는 전제로 동작한다.
 * U-21 (퀴즈 70%+ 단독 자동 출석) 은 별도 PBI 의 호출 경로로 같은 메서드를 재사용한다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    /**
     * 특정 사용자의 특정 일자에 출석을 부여한다.
     * 같은 (user_id, date) 가 이미 존재하면 아무 일도 하지 않는다 (멱등).
     */
    public void grant(Long userId, LocalDate date, BigDecimal score) {
        if (attendanceRepository.findByUserIdAndDate(userId, date).isPresent()) {
            return;
        }
        Attendance attendance = Attendance.builder()
                .userId(userId)
                .date(date)
                .isAttended(Boolean.TRUE)
                .score(score)
                .build();
        try {
            attendanceRepository.save(attendance);
        } catch (DataIntegrityViolationException race) {
            // 동시 호출 두 번째: UNIQUE(user_id, date) 위반. 첫 호출의 결과로 이미 부여된 상태이므로 무시.
            log.debug("attendance UNIQUE 충돌 — 동시 호출 흡수: userId={} date={}", userId, date);
        }
    }
}
