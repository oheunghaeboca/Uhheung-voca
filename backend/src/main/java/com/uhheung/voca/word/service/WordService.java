package com.uhheung.voca.word.service;

import com.uhheung.voca.common.exception.ApiException;
import com.uhheung.voca.common.exception.ErrorCode;
import com.uhheung.voca.word.dto.WordCreateRequest;
import com.uhheung.voca.word.dto.WordResponse;
import com.uhheung.voca.word.dto.WordUpdateRequest;
import com.uhheung.voca.word.entity.Word;
import com.uhheung.voca.word.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WordService {

    private final WordRepository wordRepository;

    // 단어 목록을 조회한다.
    public List<WordResponse> findAll() {
        return wordRepository.findAll().stream()
                .map(WordResponse::from)
                .toList();
    }

    // 단어 상세 정보를 조회한다.
    public WordResponse findById(Long wordId) {
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new ApiException(ErrorCode.WORD_NOT_FOUND));

        return WordResponse.from(word);
    }

    // 단어를 생성한다.
    @Transactional
    public WordResponse create(WordCreateRequest req) {
        Word word = Word.builder()
                .english(req.english())
                .korean(req.korean())
                .level(req.level())
                .part(req.part())
                .type(req.type())
                .example(req.example())
                .exampleTranslation(req.exampleTranslation())
                .build();

        return WordResponse.from(wordRepository.save(word));
    }

    // 단어를 수정한다.
    @Transactional
    public WordResponse update(Long wordId, WordUpdateRequest req) {
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new ApiException(ErrorCode.WORD_NOT_FOUND));

        word.update(
                req.english(),
                req.korean(),
                req.level(),
                req.part(),
                req.type(),
                req.example(),
                req.exampleTranslation()
        );

        return WordResponse.from(word);
    }

    // 단어를 삭제한다.
    @Transactional
    public void delete(Long wordId) {
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new ApiException(ErrorCode.WORD_NOT_FOUND));

        wordRepository.delete(word);
    }
}