package com.uhheung.voca.word.service;

import com.uhheung.voca.word.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WordService {

    private final WordRepository wordRepository;

    // TODO: list / get / create / update / delete / daily — Vibe Coding 시 채울 것
}
