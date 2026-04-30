package com.uhheung.voca.wrongnote.service;

import com.uhheung.voca.quiz.repository.QuizResultDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WrongNoteService {

    private final QuizResultDetailRepository quizResultDetailRepository;

    // TODO: list(userId) — 사용자 오답 단어 집계
    // TODO: retest(userId, wordIds) — 오답 기반 재테스트 시작 (퀴즈 도메인과 연계)
}
