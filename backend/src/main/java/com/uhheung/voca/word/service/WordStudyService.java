package com.uhheung.voca.word.service;

import com.uhheung.voca.common.exception.ApiException;
import com.uhheung.voca.common.exception.ErrorCode;
import com.uhheung.voca.mission.service.MissionService;
import com.uhheung.voca.word.entity.WordStudyEvent;
import com.uhheung.voca.word.repository.WordRepository;
import com.uhheung.voca.word.repository.WordStudyEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 사용자의 단어 학습 이벤트를 기록한다. PBI-12 B-옵션의 STUDY_WORDS 미션 트리거.
 *
 * <p>같은 사용자가 같은 단어를 같은 날 여러 번 봐도 행을 새로 INSERT 한다.
 * 미션 카운트는 호출 시점에 DISTINCT 로 환산되므로 진척률은 한 단어당 한 번만 증가한다.
 * 행을 누적해 두는 이유는 후속 PBI 에서 학습 패턴 통계가 필요할 가능성을 고려한 단순함 우선 선택이다.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class WordStudyService {

    private final WordStudyEventRepository wordStudyEventRepository;
    private final WordRepository wordRepository;
    private final MissionService missionService;

    // 사용자가 한 단어를 본 사건을 기록한다. 존재하지 않는 wordId 는 404 로 매핑한다.
    // 기록 직후 미션 진척을 재평가하여 STUDY_WORDS 충족 시점이 GET 호출이 아닌 이 트리거에서 잡히도록 한다.
    public void recordView(Long userId, Long wordId) {
        if (!wordRepository.existsById(wordId)) {
            throw new ApiException(ErrorCode.WORD_NOT_FOUND);
        }
        WordStudyEvent event = WordStudyEvent.builder()
                .userId(userId)
                .wordId(wordId)
                .build();
        wordStudyEventRepository.save(event);
        missionService.evaluateAndGrant(userId);
    }
}
