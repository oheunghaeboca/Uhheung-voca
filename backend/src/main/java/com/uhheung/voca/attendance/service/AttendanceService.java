package com.uhheung.voca.attendance.service;

import com.uhheung.voca.attendance.dto.AttendanceCheckResponse;
import com.uhheung.voca.attendance.dto.AttendanceResponse;
import com.uhheung.voca.attendance.entity.Attendance;
import com.uhheung.voca.attendance.repository.AttendanceRepository;
import com.uhheung.voca.quiz.entity.QuizResult;
import com.uhheung.voca.quiz.repository.QuizResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private static final BigDecimal PASS_SCORE = BigDecimal.valueOf(70);

    private final AttendanceRepository attendanceRepository;
    private final QuizResultRepository quizResultRepository;

    public AttendanceCheckResponse checkByQuizResult(Long quizResultId) {
        QuizResult quizResult = quizResultRepository.findById(quizResultId)
                .orElseThrow(() -> new IllegalArgumentException("퀴즈 결과를 찾을 수 없습니다. id=" + quizResultId));

        Long userId = quizResult.getUserId();
        LocalDate today = LocalDate.now();
        BigDecimal score = quizResult.getScore();

        if (score.compareTo(PASS_SCORE) < 0) {
            return new AttendanceCheckResponse(
                    userId,
                    today,
                    false,
                    score,
                    "정답률 70% 미만으로 출석이 인정되지 않았습니다."
            );
        }

        boolean alreadyChecked = attendanceRepository.findByUserIdAndDate(userId, today).isPresent();

        if (!alreadyChecked) {
            Attendance attendance = Attendance.builder()
                    .userId(userId)
                    .date(today)
                    .isAttended(true)
                    .score(score)
                    .build();

            attendanceRepository.save(attendance);
        }

        return new AttendanceCheckResponse(
                userId,
                today,
                true,
                score,
                alreadyChecked ? "이미 오늘 출석이 인정되었습니다." : "출석이 인정되었습니다."
        );
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> monthly(Long userId, int year, int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate start = yearMonth.atDay(1);
        LocalDate end = yearMonth.atEndOfMonth();

        return attendanceRepository.findByUserIdAndDateBetween(userId, start, end).stream()
                .map(attendance -> new AttendanceResponse(
                        attendance.getId(),
                        attendance.getUserId(),
                        attendance.getDate(),
                        attendance.getIsAttended(),
                        attendance.getScore()
                ))
                .toList();
    }
}