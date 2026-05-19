package com.uhheung.voca.wrongnote.controller;

import com.uhheung.voca.wrongnote.dto.WrongNoteResponse;
import com.uhheung.voca.wrongnote.service.WrongNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/wrong-notes")
@RequiredArgsConstructor
public class WrongNoteController {

    private final WrongNoteService wrongNoteService;

    @GetMapping
    public List<WrongNoteResponse> list(@RequestParam Long userId) {
        return wrongNoteService.list(userId);
    }
}
