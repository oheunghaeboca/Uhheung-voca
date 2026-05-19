package com.uhheung.voca.mission.service;

import com.uhheung.voca.attendance.service.AttendanceService;
import com.uhheung.voca.common.exception.ApiException;
import com.uhheung.voca.common.exception.ErrorCode;
import com.uhheung.voca.mission.domain.MissionType;
import com.uhheung.voca.mission.dto.MissionItem;
import com.uhheung.voca.mission.dto.MissionResponse;
import com.uhheung.voca.mission.entity.DailyMission;
import com.uhheung.voca.mission.repository.DailyMissionRepository;
import com.uhheung.voca.quiz.repository.QuizResultRepository;
import com.uhheung.voca.quiz.repository.TodayQuizStats;
import com.uhheung.voca.user.entity.User;
import com.uhheung.voca.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 데일리 미션 조회 서비스.
 *
 * <p>호출마다 오늘의 quiz_results / quiz_result_details 를 다시 집계하여 진척 필드를 갱신한다
 * (read-on-demand). 별도 진척 갱신 엔드포인트는 두지 않는다.
 *
 * <p>세 미션이 모두 충족되면 같은 트랜잭션 안에서 출석을 자동 부여한다.
 * 출석 INSERT 실패(UNIQUE 위반) 는 {@link AttendanceService#grant} 가 흡수한다.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class MissionService {

    private static final BigDecimal SCORE_THRESHOLD = new BigDecimal("70");

    private final DailyMissionRepository dailyMissionRepository;
    private final QuizResultRepository quizResultRepository;
    private final UserRepository userRepository;
    private final AttendanceService attendanceService;

    /**
     * 인증된 사용자의 오늘 미션 진척 상태를 조회하고, 모두 완료되었다면 출석을 자동 부여한다.
     * 같은 일자에 두 번 호출되어도 결과는 동일 (멱등).
     */
    public MissionResponse todayMission(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        Long userId = user.getId();
        LocalDate today = LocalDate.now();

        DailyMission mission = dailyMissionRepository.findByUserIdAndDate(userId, today)
                .orElseGet(() -> dailyMissionRepository.save(
                        DailyMission.builder().userId(userId).date(today).build()
                ));

        TodayQuizStats stats = quizResultRepository.findTodayStats(userId, today);
        int quizzesTaken = stats != null && stats.getTaken() != null ? stats.getTaken().intValue() : 0;
        BigDecimal highestScore = stats != null && stats.getTop() != null ? stats.getTop() : BigDecimal.ZERO;
        int wordsStudied = quizResultRepository.countDistinctWordsStudiedToday(userId, today);

        mission.updateProgress(wordsStudied, quizzesTaken, highestScore);

        int studyCurrent = Math.min(wordsStudied, MissionType.STUDY_WORDS.getTarget());
        int quizCurrent = Math.min(quizzesTaken, MissionType.TAKE_QUIZ.getTarget());
        int scoreCurrent = clampToTarget(highestScore, MissionType.SCORE_70.getTarget());

        boolean studyDone = studyCurrent >= MissionType.STUDY_WORDS.getTarget();
        boolean quizDone = quizCurrent >= MissionType.TAKE_QUIZ.getTarget();
        boolean scoreDone = highestScore.compareTo(SCORE_THRESHOLD) >= 0;
        boolean allCompleted = studyDone && quizDone && scoreDone;

        if (allCompleted) {
            mission.markCompleted();
            if (Boolean.FALSE.equals(mission.getAttendanceGranted())) {
                attendanceService.grant(userId, today, highestScore);
                mission.markAttendanceGranted();
            }
        }

        List<MissionItem> items = List.of(
                buildItem(MissionType.STUDY_WORDS, studyCurrent, studyDone),
                buildItem(MissionType.TAKE_QUIZ, quizCurrent, quizDone),
                buildItem(MissionType.SCORE_70, scoreCurrent, scoreDone)
        );

        return new MissionResponse(today, items, allCompleted, mission.getAttendanceGranted());
    }

    // BigDecimal score 를 0~target 사이 정수로 환원한다. UI 의 progress bar 가 사용한다.
    private int clampToTarget(BigDecimal score, int target) {
        int v = score.setScale(0, java.math.RoundingMode.DOWN).intValue();
        return Math.min(Math.max(v, 0), target);
    }

    // MissionType 메타와 진척값을 묶어 응답 항목 한 개를 만든다.
    private MissionItem buildItem(MissionType type, int current, boolean completed) {
        return new MissionItem(type.name(), type.getDescription(), type.getTarget(), current, completed);
    }
}
