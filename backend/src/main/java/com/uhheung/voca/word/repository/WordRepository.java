package com.uhheung.voca.word.repository;

import com.uhheung.voca.word.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WordRepository extends JpaRepository<Word, Long> {

    @Query(value = "SELECT * FROM words ORDER BY RAND() LIMIT 20", nativeQuery = true)
    List<Word> findRandom20();

    @Query(value = "SELECT * FROM words WHERE id != :excludeId ORDER BY RAND() LIMIT 2", nativeQuery = true)
    List<Word> findRandom2Excluding(@Param("excludeId") Long excludeId);

    // 사용자별 학습 이력 횟수가 적은 단어 후보 60개를 조회한다.
    // 본 결과를 Java 측에서 결정적 seeded shuffle 한 뒤 상위 20개를 추천 단어로 사용한다.
    // 단어마다 cnt 서브쿼리를 반복 호출하지 않도록 단일 LEFT JOIN aggregation 으로 N+1 을 차단한다.
    //
    // 학습 이력 정의는 PBI-12 의 STUDY_WORDS 미션과 동일한 word_study_events 테이블 기반이다.
    // 즉 사용자가 단어 학습 페이지(WordDetail / Flashcard)에서 본 횟수만 "학습됨" 으로 간주하며,
    // 퀴즈 응시 단어는 본 추천 알고리즘의 "학습 이력" 에 포함하지 않는다.
    // 두 PBI 가 같은 어휘로 학습을 정의하도록 일관성을 맞춘다 (2026-05-20 결정).
    @Query(value = """
            SELECT w.*
            FROM words w
            LEFT JOIN (
                SELECT word_id, COUNT(*) AS cnt
                FROM word_study_events
                WHERE user_id = :userId
                GROUP BY word_id
            ) s ON w.id = s.word_id
            ORDER BY COALESCE(s.cnt, 0) ASC, w.id ASC
            LIMIT 60
            """, nativeQuery = true)
    List<Word> findDailyCandidates(@Param("userId") Long userId);
}
