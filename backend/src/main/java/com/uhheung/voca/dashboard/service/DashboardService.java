package com.uhheung.voca.dashboard.service;

import com.uhheung.voca.attendance.repository.AttendanceRepository;
import com.uhheung.voca.quiz.repository.QuizResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final QuizResultRepository quizResultRepository;
    private final AttendanceRepository attendanceRepository;

    // TODO: summary(userId) → DashboardSummaryResponse
    // TODO: attendance(userId, year, month) → 월별 출석 그리드 데이터
}
