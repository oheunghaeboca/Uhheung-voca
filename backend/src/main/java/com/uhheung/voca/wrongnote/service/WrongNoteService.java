package com.uhheung.voca.wrongnote.service;

import com.uhheung.voca.quiz.repository.QuizResultDetailRepository;
import com.uhheung.voca.wrongnote.dto.WrongNoteResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WrongNoteService {

    private final QuizResultDetailRepository quizResultDetailRepository;

    public List<WrongNoteResponse> list(Long userId) {
        return quizResultDetailRepository.findWrongNotesByUserId(userId).stream()
                .map(item -> new WrongNoteResponse(
                        item.getWordId(),
                        item.getEnglish(),
                        item.getKorean(),
                        item.getWrongCount(),
                        item.getLastWrongAt()
                ))
                .toList();
    }
}