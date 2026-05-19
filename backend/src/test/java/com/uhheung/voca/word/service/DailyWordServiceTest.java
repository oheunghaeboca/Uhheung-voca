package com.uhheung.voca.word.service;

import com.uhheung.voca.word.dto.DailyWordsResponse;
import com.uhheung.voca.word.entity.Word;
import com.uhheung.voca.word.repository.WordRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DailyWordServiceTest {

    @Mock
    private WordRepository wordRepository;

    @InjectMocks
    private DailyWordService dailyWordService;

    @Test
    @DisplayName("같은 사용자 같은 날에 두 번 호출하면 단어 시퀀스가 동일하다 (멱등성)")
    void recommend_isDeterministicForSameUserAndDate() {
        long userId = 42L;
        LocalDate date = LocalDate.of(2026, 5, 20);
        when(wordRepository.findDailyCandidates(eq(userId))).thenReturn(buildCandidates(60));

        DailyWordsResponse first = dailyWordService.recommend(userId, date);
        DailyWordsResponse second = dailyWordService.recommend(userId, date);

        assertThat(first.totalCount()).isEqualTo(20);
        assertThat(idSequence(first)).isEqualTo(idSequence(second));
    }

    @Test
    @DisplayName("다른 날짜로 호출하면 단어 시퀀스가 달라진다 (의미 있는 셔플)")
    void recommend_changesAcrossDates() {
        long userId = 42L;
        when(wordRepository.findDailyCandidates(eq(userId))).thenReturn(buildCandidates(60));

        DailyWordsResponse today = dailyWordService.recommend(userId, LocalDate.of(2026, 5, 20));
        DailyWordsResponse tomorrow = dailyWordService.recommend(userId, LocalDate.of(2026, 5, 21));

        assertThat(idSequence(today)).isNotEqualTo(idSequence(tomorrow));
    }

    @Test
    @DisplayName("후보가 20개 미만이면 가능한 만큼만 반환한다")
    void recommend_capsAtAvailableCount() {
        long userId = 1L;
        when(wordRepository.findDailyCandidates(eq(userId))).thenReturn(buildCandidates(7));

        DailyWordsResponse resp = dailyWordService.recommend(userId, LocalDate.of(2026, 5, 20));

        assertThat(resp.totalCount()).isEqualTo(7);
        assertThat(resp.words()).hasSize(7);
    }

    // 테스트용 Word 엔티티 후보 목록을 만든다. id 는 ReflectionTestUtils 로 채운다.
    private List<Word> buildCandidates(int count) {
        List<Word> list = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            Word w = Word.builder()
                    .english("word" + i)
                    .korean("뜻" + i)
                    .level("ESSENTIAL")
                    .part("noun")
                    .type("RC")
                    .build();
            ReflectionTestUtils.setField(w, "id", (long) i);
            list.add(w);
        }
        return list;
    }

    private List<Long> idSequence(DailyWordsResponse resp) {
        return resp.words().stream().map(DailyWordsResponse.Item::wordId).toList();
    }
}
