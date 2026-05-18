package com.uhheung.voca.dashboard.service;

import com.uhheung.voca.attendance.entity.Attendance;
import com.uhheung.voca.attendance.repository.AttendanceRepository;
import com.uhheung.voca.dashboard.dto.AttendanceDayResponse;
import com.uhheung.voca.dashboard.dto.DashboardSummaryResponse;
import com.uhheung.voca.quiz.repository.QuizResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final QuizResultRepository quizResultRepository;
    private final AttendanceRepository attendanceRepository;

    public DashboardSummaryResponse summary(Long userId) {
        long totalQuizzes = quizResultRepository.countByUserId(userId);
        BigDecimal averageScore = quizResultRepository.findAverageScoreByUserId(userId);
        if (averageScore == null) averageScore = BigDecimal.ZERO;

        List<Attendance> all = attendanceRepository.findByUserIdAndDateBetween(
                userId, LocalDate.of(2000, 1, 1), LocalDate.now());

        int totalAttendance = (int) all.stream().filter(Attendance::getIsAttended).count();
        int currentStreak = calcStreak(all);

        return new DashboardSummaryResponse(totalQuizzes, averageScore, totalAttendance, currentStreak);
    }

    public List<AttendanceDayResponse> attendance(Long userId, int year, int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Attendance> records = attendanceRepository.findByUserIdAndDateBetween(userId, start, end);

        Set<LocalDate> attendedDates = records.stream()
                .filter(Attendance::getIsAttended)
                .map(Attendance::getDate)
                .collect(Collectors.toSet());

        return start.datesUntil(end.plusDays(1))
                .map(date -> new AttendanceDayResponse(date, attendedDates.contains(date)))
                .toList();
    }

    private int calcStreak(List<Attendance> all) {
        Set<LocalDate> attendedDates = all.stream()
                .filter(Attendance::getIsAttended)
                .map(Attendance::getDate)
                .collect(Collectors.toSet());

        int streak = 0;
        LocalDate cursor = LocalDate.now();
        while (attendedDates.contains(cursor)) {
            streak++;
            cursor = cursor.minusDays(1);
        }
        return streak;
    }
}