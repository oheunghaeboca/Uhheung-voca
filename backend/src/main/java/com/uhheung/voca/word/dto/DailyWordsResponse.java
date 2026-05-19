package com.uhheung.voca.word.dto;

import com.uhheung.voca.word.entity.Word;

import java.time.LocalDate;
import java.util.List;

// 오늘의 학습 단어 추천 응답 DTO. 같은 사용자가 같은 날 호출하면 동일한 words 시퀀스를 받는다.
public record DailyWordsResponse(
        LocalDate date,
        List<Item> words,
        int totalCount
) {

    // 추천 단어 한 개를 나타내는 항목.
    public record Item(
            Long wordId,
            String english,
            String korean,
            String level,
            String type
    ) {
        public static Item from(Word w) {
            return new Item(w.getId(), w.getEnglish(), w.getKorean(), w.getLevel(), w.getType());
        }
    }
}
