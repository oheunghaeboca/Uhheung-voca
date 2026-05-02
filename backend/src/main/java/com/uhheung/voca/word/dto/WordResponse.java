package com.uhheung.voca.word.dto;

import com.uhheung.voca.word.entity.Word;

public record WordResponse(
        Long id,
        String english,
        String korean,
        String level,
        String type,
        String example
) {
    public static WordResponse from(Word w) {
        return new WordResponse(w.getId(), w.getEnglish(), w.getKorean(), w.getLevel(), w.getType(), w.getExample());
    }
}
