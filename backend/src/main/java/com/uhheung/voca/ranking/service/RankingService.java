package com.uhheung.voca.ranking.service;

import com.uhheung.voca.quiz.repository.QuizResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankingService {

    private final QuizResultRepository quizResultRepository;

    // TODO: list(type, period, size) — 랭킹 조회 (period: WEEKLY/MONTHLY/ALL)
}
