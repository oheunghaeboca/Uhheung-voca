package com.uhheung.voca.wrongnote.dto;

import java.time.LocalDateTime;

public record WrongNoteResponse(
        Long wordId,
        String english,
        String korean,
        long wrongCount,
        LocalDateTime lastWrongAt
) {}
