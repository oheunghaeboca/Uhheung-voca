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

    // 날짜 시드 기반 결정적 무작위 — 같은 seed면 항상 같은 순서
    @Query(value = "SELECT * FROM words WHERE level = 'BASIC' ORDER BY RAND(:seed) LIMIT 10", nativeQuery = true)
    List<Word> findDailyBasicWords(@Param("seed") long seed);

    @Query(value = "SELECT * FROM words WHERE level = 'ADVANCED' ORDER BY RAND(:seed) LIMIT 5", nativeQuery = true)
    List<Word> findDailyAdvancedWords(@Param("seed") long seed);

    @Query(value = "SELECT * FROM words WHERE level = 'FREQUENT' ORDER BY RAND(:seed) LIMIT 5", nativeQuery = true)
    List<Word> findDailyFrequentWords(@Param("seed") long seed);
}
