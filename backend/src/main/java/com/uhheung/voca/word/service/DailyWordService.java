package com.uhheung.voca.word.service;

import com.uhheung.voca.word.dto.DailyWordsResponse;
import com.uhheung.voca.word.entity.Word;
import com.uhheung.voca.word.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

/**
 * 오늘의 학습 단어 추천 서비스.
 *
 * 두 가지 수용 기준을 동시에 만족시킨다:
 *   - <b>멱등성</b>: 같은 (userId, date) 호출은 동일한 wordId 시퀀스를 반환한다.
 *   - <b>학습 이력이 적은 단어 우선</b>: quiz_result_details 의 등장 횟수가 적은 단어가 후보로 먼저 들어온다.
 *
 * 구현 전략:
 *   1) {@code WordRepository#findDailyCandidates} 가 cnt 오름차순으로 후보 60개를 한 쿼리로 반환한다.
 *   2) {@code seed = userId * 1_000_003L + date.toEpochDay()} 로 결정적 시드를 만들고,
 *      {@code new java.util.Random(seed)} 로 후보 리스트를 셔플한다.
 *      JDK Random 은 동일 seed → 동일 순열을 보장하므로 멱등성이 성립한다.
 *   3) 셔플된 순서 그대로 상위 {@value #DAILY_COUNT} 개를 응답한다 (재정렬 금지).
 *
 * 본 서비스는 별도 추천 캐시 테이블을 두지 않는다. 결정적 알고리즘만으로 멱등성을 충족하므로
 * 마이그레이션 노이즈를 최소화하기 위함이다.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DailyWordService {

    // userId 와 date 의 곱셈 충돌을 줄이기 위한 소수.
    private static final long SEED_PRIME = 1_000_003L;

    // 하루에 추천하는 단어 개수 (U-10 AC 명시값).
    static final int DAILY_COUNT = 20;

    private final WordRepository wordRepository;

    // 지정 사용자에게 지정 일자의 추천 단어 20개를 반환한다. 같은 인자로 두 번 호출하면 결과가 동일하다.
    public DailyWordsResponse recommend(Long userId, LocalDate date) {
        List<Word> candidates = new ArrayList<>(wordRepository.findDailyCandidates(userId));

        long seed = ((long) userId) * SEED_PRIME + date.toEpochDay();
        Collections.shuffle(candidates, new Random(seed));

        int limit = Math.min(DAILY_COUNT, candidates.size());
        List<DailyWordsResponse.Item> items = candidates.subList(0, limit).stream()
                .map(DailyWordsResponse.Item::from)
                .toList();

        return new DailyWordsResponse(date, items, items.size());
    }
}
