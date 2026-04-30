package com.uhheung.voca.quiz.service;

import com.uhheung.voca.quiz.repository.QuizResultDetailRepository;
import com.uhheung.voca.quiz.repository.QuizResultRepository;
import com.uhheung.voca.word.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class QuizService {

    private final QuizResultRepository quizResultRepository;
    private final QuizResultDetailRepository quizResultDetailRepository;
    private final WordRepository wordRepository;

    // TODO: start(userId, QuizStartRequest) → 문제 생성 (출처: API_명세서.md 참조)
    // TODO: submit(userId, QuizSubmitRequest) → 채점 + QuizResult/QuizResultDetail 저장
    // TODO: results(userId, pageable)
    // TODO: result(userId, resultId)
}
