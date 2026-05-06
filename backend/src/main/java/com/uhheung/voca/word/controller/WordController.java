package com.uhheung.voca.word.controller;

import com.uhheung.voca.word.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;

    // TODO: GET /api/words, GET /api/words/{id}, POST/PUT/DELETE (ADMIN)
}
