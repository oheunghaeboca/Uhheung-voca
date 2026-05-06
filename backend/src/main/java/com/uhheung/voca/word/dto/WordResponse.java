package com.uhheung.voca.word.dto;

import com.uhheung.voca.word.entity.Word;

public record WordResponse(
        Long wordId,
        String english,
        String korean,
        String level,
        String part,
        String type,
        String example,
        String exampleTranslation
) {
    public static WordResponse from(Word w) {
        return new WordResponse(
                w.getId(),
                w.getEnglish(),
                w.getKorean(),
                w.getLevel(),
                w.getPart(),
                w.getType(),
                w.getExample(),
                w.getExampleTranslation()
        );
    }
}
