package com.uhheung.voca.mission.service;

import com.uhheung.voca.attendance.service.AttendanceService;
import com.uhheung.voca.mission.dto.MissionResponse;
import com.uhheung.voca.mission.entity.DailyMission;
import com.uhheung.voca.mission.repository.DailyMissionRepository;
import com.uhheung.voca.quiz.repository.QuizResultRepository;
import com.uhheung.voca.quiz.repository.TodayQuizStats;
import com.uhheung.voca.user.entity.User;
import com.uhheung.voca.user.entity.Role;
import com.uhheung.voca.user.repository.UserRepository;
import com.uhheung.voca.word.repository.WordStudyEventRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MissionServiceTest {

    @Mock
    private DailyMissionRepository dailyMissionRepository;
    @Mock
    private QuizResultRepository quizResultRepository;
    @Mock
    private WordStudyEventRepository wordStudyEventRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AttendanceService attendanceService;

    @InjectMocks
    private MissionService missionService;

    @Test
    @DisplayName("세 미션 모두 충족이면 출석을 한 번 부여하고 allCompleted=true 를 반환한다")
    void todayMission_grantsAttendanceOnceWhenAllCompleted() {
        User user = stubUser(1L, "alice");
        DailyMission mission = stubMission(user.getId(), LocalDate.now());
        when(userRepository.findByUsername(eq("alice"))).thenReturn(Optional.of(user));
        when(dailyMissionRepository.findByUserIdAndDate(eq(user.getId()), any())).thenReturn(Optional.of(mission));
        when(quizResultRepository.findTodayStats(eq(user.getId()), any())).thenReturn(stats(2L, new BigDecimal("85.50")));
        when(wordStudyEventRepository.countDistinctWordsStudiedOn(eq(user.getId()), any())).thenReturn(20);

        MissionResponse resp = missionService.todayMission("alice");

        assertThat(resp.allCompleted()).isTrue();
        assertThat(resp.attendanceGranted()).isTrue();
        verify(attendanceService, times(1)).grant(eq(user.getId()), any(), eq(new BigDecimal("85.50")));
    }

    @Test
    @DisplayName("같은 날 두 번째 호출에서는 출석을 다시 부여하지 않는다 (멱등)")
    void todayMission_idempotentOnSecondCall() {
        User user = stubUser(2L, "bob");
        DailyMission mission = stubMission(user.getId(), LocalDate.now());
        ReflectionTestUtils.setField(mission, "attendanceGranted", Boolean.TRUE);
        when(userRepository.findByUsername(eq("bob"))).thenReturn(Optional.of(user));
        when(dailyMissionRepository.findByUserIdAndDate(eq(user.getId()), any())).thenReturn(Optional.of(mission));
        when(quizResultRepository.findTodayStats(eq(user.getId()), any())).thenReturn(stats(3L, new BigDecimal("90.00")));
        when(wordStudyEventRepository.countDistinctWordsStudiedOn(eq(user.getId()), any())).thenReturn(25);

        MissionResponse resp = missionService.todayMission("bob");

        assertThat(resp.allCompleted()).isTrue();
        assertThat(resp.attendanceGranted()).isTrue();
        verify(attendanceService, never()).grant(anyLong(), any(), any());
    }

    @Test
    @DisplayName("정답률 70% 미만이면 미완료로 처리되고 출석은 부여되지 않는다")
    void todayMission_notCompletedWhenScoreBelow70() {
        User user = stubUser(3L, "carol");
        DailyMission mission = stubMission(user.getId(), LocalDate.now());
        when(userRepository.findByUsername(eq("carol"))).thenReturn(Optional.of(user));
        when(dailyMissionRepository.findByUserIdAndDate(eq(user.getId()), any())).thenReturn(Optional.of(mission));
        when(quizResultRepository.findTodayStats(eq(user.getId()), any())).thenReturn(stats(1L, new BigDecimal("69.99")));
        when(wordStudyEventRepository.countDistinctWordsStudiedOn(eq(user.getId()), any())).thenReturn(20);


        MissionResponse resp = missionService.todayMission("carol");

        assertThat(resp.allCompleted()).isFalse();
        assertThat(resp.attendanceGranted()).isFalse();
        verify(attendanceService, never()).grant(anyLong(), any(), any());
    }

    private User stubUser(long id, String username) {
        User u = User.builder()
                .username(username)
                .password("hash")
                .nickname("nick" + id)
                .role(Role.USER)
                .build();
        ReflectionTestUtils.setField(u, "id", id);
        return u;
    }

    private DailyMission stubMission(long userId, LocalDate date) {
        return DailyMission.builder().userId(userId).date(date).build();
    }

    private TodayQuizStats stats(long taken, BigDecimal top) {
        return new TodayQuizStats() {
            @Override public Long getTaken() { return taken; }
            @Override public BigDecimal getTop() { return top; }
        };
    }
}
