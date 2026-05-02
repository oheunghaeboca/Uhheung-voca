package com.uhheung.voca.word;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface WordRepository extends JpaRepository<Word, Long> {

    @Query(value = "SELECT * FROM words ORDER BY RAND() LIMIT 20",
            nativeQuery = true)
    List<Word> findRandom20();

    @Query(value = "SELECT * FROM words WHERE id != :excludeId ORDER BY RAND() LIMIT 2",
            nativeQuery = true)
    List<Word> findRandom2Excluding(@Param("excludeId") Long excludeId);
}