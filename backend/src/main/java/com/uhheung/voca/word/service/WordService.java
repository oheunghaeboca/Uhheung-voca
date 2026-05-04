package com.uhheung.voca.word.service;

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

    public List<WordResponse> findAll() {
        return wordRepository.findAll().stream()
                .map(WordResponse::from)
                .toList();
    }

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

    @Transactional
    public WordResponse update(Long wordId, WordUpdateRequest req) {
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("단어를 찾을 수 없습니다. id=" + wordId));
        word.update(req.english(), req.korean(), req.level(), req.part(),
                req.type(), req.example(), req.exampleTranslation());
        return WordResponse.from(word);
    }

    @Transactional
    public void delete(Long wordId) {
        Word word = wordRepository.findById(wordId)
                .orElseThrow(() -> new IllegalArgumentException("단어를 찾을 수 없습니다. id=" + wordId));
        wordRepository.delete(word);
    }
}