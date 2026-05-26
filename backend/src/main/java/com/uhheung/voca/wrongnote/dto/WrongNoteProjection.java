package com.uhheung.voca.wrongnote.dto;

import java.time.LocalDateTime;

public interface WrongNoteProjection {
    Long getWordId();
    String getEnglish();
    String getKorean();
    // MySQL COUNT(*) 는 BIGINT 를 반환하므로 Long 으로 받는다. Integer 로 받으면 Hibernate 캐스팅 실패.
    Long getWrongCount();
    LocalDateTime getLastWrongAt();
}