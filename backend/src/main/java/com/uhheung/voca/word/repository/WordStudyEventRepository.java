package com.uhheung.voca.word.repository;

import com.uhheung.voca.word.entity.WordStudyEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface WordStudyEventRepository extends JpaRepository<WordStudyEvent, Long> {

    // 사용자가 특정 일자에 본 distinct 단어 수. STUDY_WORDS 미션의 current 계산용.
    @Query(value = """
            SELECT COUNT(DISTINCT word_id)
            FROM word_study_events
            WHERE user_id = :userId AND DATE(studied_at) = :date
            """, nativeQuery = true)
    int countDistinctWordsStudiedOn(@Param("userId") Long userId, @Param("date") LocalDate date);
}
