package com.uhheung.voca.ranking.service;

import com.uhheung.voca.quiz.repository.QuizResultRepository;
import com.uhheung.voca.ranking.dto.RankingResponse;
import com.uhheung.voca.user.entity.User;
import com.uhheung.voca.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankingService {

    private final QuizResultRepository quizResultRepository;
    private final UserRepository userRepository;

    public List<RankingResponse> list(String type, String period, int size) {
        List<Object[]> raw = switch (period.toUpperCase()) {
            case "WEEKLY" -> quizResultRepository.findRankingByAvgScore(LocalDateTime.now().minusWeeks(1));
            case "MONTHLY" -> quizResultRepository.findRankingByAvgScore(LocalDateTime.now().minusMonths(1));
            default -> quizResultRepository.findRankingByAvgScoreAll();
        };

        List<Long> userIds = raw.stream()
                .map(row -> (Long) row[0])
                .toList();

        Map<Long, String> nicknameMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, User::getNickname));

        List<RankingResponse> result = new ArrayList<>();
        for (int i = 0; i < Math.min(raw.size(), size); i++) {
            Long userId = (Long) raw.get(i)[0];
            BigDecimal avgScore = BigDecimal.valueOf((Double) raw.get(i)[1]);
            String nickname = nicknameMap.getOrDefault(userId, "unknown");
            result.add(new RankingResponse(i + 1, userId, nickname, avgScore));
        }
        return result;
    }
}