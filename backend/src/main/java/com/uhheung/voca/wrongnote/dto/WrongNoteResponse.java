package com.uhheung.voca.wrongnote.dto;

import java.time.LocalDateTime;

public record WrongNoteResponse(
        Long wordId,
        String english,
        String korean,
        int wrongCount,
        LocalDateTime lastWrongAt
) {}
