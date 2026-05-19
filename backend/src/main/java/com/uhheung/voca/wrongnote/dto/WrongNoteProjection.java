package com.uhheung.voca.wrongnote.dto;

import java.time.LocalDateTime;

public interface WrongNoteProjection {
    Long getWordId();
    String getEnglish();
    String getKorean();
    Integer getWrongCount();
    LocalDateTime getLastWrongAt();
}