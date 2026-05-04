package com.uhheung.voca.word.controller;

import com.uhheung.voca.word.dto.WordResponse;
import com.uhheung.voca.word.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
public class WordController {

    private final WordService wordService;

    @GetMapping
    public ResponseEntity<List<WordResponse>> getWords() {
        return ResponseEntity.ok(wordService.findAll());
    }
}
