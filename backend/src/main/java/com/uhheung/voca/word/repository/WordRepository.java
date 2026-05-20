package com.uhheung.voca.word.repository;

import com.uhheung.voca.word.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WordRepository extends JpaRepository<Word, Long> {

    @Query(value = "SELECT * FROM words ORDER BY RAND() LIMIT 20", nativeQuery = true)
    List<Word> findRandom20();

    @Query(value = "SELECT * FROM words WHERE id <> :wordId ORDER BY RAND() LIMIT 2", nativeQuery = true)
    List<Word> findRandom2Excluding(@Param("wordId") Long wordId);

    @Query(value = """
            SELECT *
            FROM words
            WHERE level = 'BASIC'
            ORDER BY RAND(:seed)
            LIMIT 7
            """, nativeQuery = true)
    List<Word> findDailyBasicWords(@Param("seed") long seed);

    @Query(value = """
            SELECT *
            FROM words
            WHERE level = 'ADVANCED'
            ORDER BY RAND(:seed)
            LIMIT 6
            """, nativeQuery = true)
    List<Word> findDailyAdvancedWords(@Param("seed") long seed);

    @Query(value = """
            SELECT *
            FROM words
            WHERE level = 'FREQUENT'
            ORDER BY RAND(:seed)
            LIMIT 7
            """, nativeQuery = true)
    List<Word> findDailyFrequentWords(@Param("seed") long seed);

    @Query(value = """
            SELECT *
            FROM words
            WHERE id NOT IN (
                SELECT word_id
                FROM quiz_result_details d
                JOIN quiz_results r ON d.quiz_result_id = r.id
                WHERE r.user_id = :userId
                  AND d.is_correct = true
            )
            ORDER BY RAND()
            LIMIT 20
            """, nativeQuery = true)
    List<Word> findDailyCandidates(@Param("userId") Long userId);
}