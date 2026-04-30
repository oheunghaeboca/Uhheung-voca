package com.uhheung.voca.wrongnote.controller;

import com.uhheung.voca.wrongnote.service.WrongNoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/wrong-notes")
@RequiredArgsConstructor
public class WrongNoteController {

    private final WrongNoteService wrongNoteService;

    // TODO: GET  /api/wrong-notes
    // TODO: POST /api/wrong-notes/retest
}
