package com.uhheung.voca.attendance.service;

import com.uhheung.voca.attendance.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    // TODO: grant(userId, date, score) — 미션 완료 시 출석 인정
    // TODO: monthly(userId, year, month) — 월별 출석 조회
}
