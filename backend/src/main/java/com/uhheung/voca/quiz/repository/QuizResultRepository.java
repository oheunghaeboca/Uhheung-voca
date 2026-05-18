package com.uhheung.voca.quiz.repository;

import com.uhheung.voca.quiz.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

    long countByUserId(Long userId);

    @Query("SELECT AVG(q.score) FROM QuizResult q WHERE q.userId = :userId")
    BigDecimal findAverageScoreByUserId(@Param("userId") Long userId);

    List<QuizResult> findByUserId(Long userId);

    @Query("SELECT q.userId, AVG(q.score) as avgScore FROM QuizResult q WHERE q.submittedAt >= :from GROUP BY q.userId ORDER BY avgScore DESC")
    List<Object[]> findRankingByAvgScore(@Param("from") LocalDateTime from);

    @Query("SELECT q.userId, AVG(q.score) as avgScore FROM QuizResult q GROUP BY q.userId ORDER BY avgScore DESC")
    List<Object[]> findRankingByAvgScoreAll();
}