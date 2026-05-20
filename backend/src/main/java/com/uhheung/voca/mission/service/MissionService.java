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
import com.uhheung.voca.word.repository.WordStudyEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 데일리 미션 평가 서비스.
 *
 * <p>두 진입 경로를 노출한다:
 * <ul>
 *   <li>{@link #todayMission(String)} — GET /api/missions/today 의 응답 빌더.
 *   <li>{@link #evaluateAndGrant(Long)} — 미션 충족 행위(퀴즈 제출 / 단어 학습 이벤트) 직후
 *       호출되어 즉시 미션 진척 갱신과 필요 시 출석 부여를 수행한다. 응답 본문은 무시.
 * </ul>
 *
 * <p>두 경로 모두 같은 핵심 로직 {@link #refresh(Long, LocalDate)} 를 호출하여
 * "GET 응답" 과 "실시간 트리거" 의 동작 차이를 없앤다. 사용자 입장에서는
 * 단어 한 개를 보거나 퀴즈 한 번을 제출한 직후, 다음 GET 호출이 아니라 그 즉시 출석이 부여된다.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class MissionService {

    private static final BigDecimal SCORE_THRESHOLD = new BigDecimal("70");

    private final DailyMissionRepository dailyMissionRepository;
    private final QuizResultRepository quizResultRepository;
    private final WordStudyEventRepository wordStudyEventRepository;
    private final UserRepository userRepository;
    private final AttendanceService attendanceService;

    /**
     * GET /api/missions/today 의 응답을 만든다. 같은 일자에 두 번 호출되어도 결과는 동일 (멱등).
     */
    public MissionResponse todayMission(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ApiException(ErrorCode.USER_NOT_FOUND));
        return refresh(user.getId(), LocalDate.now());
    }

    /**
     * 미션 충족 행위(단어 학습 이벤트 기록 / 퀴즈 결과 제출) 직후에 호출되어 즉시 미션을
     * 갱신하고 필요 시 출석을 부여한다. 호출자는 응답 본문을 사용하지 않는다.
     * 트랜잭션은 호출자와 별개로 처리되므로 호출자 예외가 본 메서드의 부여 결과를 되돌리지 않는다.
     */
    public void evaluateAndGrant(Long userId) {
        refresh(userId, LocalDate.now());
    }

    /**
     * 미션 진척 계산과 출석 자동 부여의 단일 진실 공급원.
     * todayMission 의 응답 빌더와 evaluateAndGrant 의 트리거가 같은 본문을 공유한다.
     */
    private MissionResponse refresh(Long userId, LocalDate today) {
        DailyMission mission = dailyMissionRepository.findByUserIdAndDate(userId, today)
                .orElseGet(() -> dailyMissionRepository.save(
                        DailyMission.builder().userId(userId).date(today).build()
                ));

        TodayQuizStats stats = quizResultRepository.findTodayStats(userId, today);
        int quizzesTaken = stats != null && stats.getTaken() != null ? stats.getTaken().intValue() : 0;
        BigDecimal highestScore = stats != null && stats.getTop() != null ? stats.getTop() : BigDecimal.ZERO;
        // STUDY_WORDS 는 단어 학습 페이지(WordDetail/Flashcard) 진입 이력을 카운트한다.
        // 퀴즈 응시는 TAKE_QUIZ 미션에만 반영하여 두 미션의 트리거를 분리한다 (B-옵션, 2026-05-20 결정).
        int wordsStudied = wordStudyEventRepository.countDistinctWordsStudiedOn(userId, today);

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
