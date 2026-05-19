package com.uhheung.voca.quiz.repository;

import com.uhheung.voca.quiz.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {

    // 사용자의 특정 일자 퀴즈 응시 수와 최고 점수를 한 쿼리로 조회한다 (PBI-12).
    // 결과가 행 0개여도 COALESCE 로 score=0 을 강제하여 호출 측에서 null 처리 부담을 없앤다.
    @Query(value = """
            SELECT COUNT(*) AS taken, COALESCE(MAX(score), 0) AS top
            FROM quiz_results
            WHERE user_id = :userId AND DATE(submitted_at) = :date
            """, nativeQuery = true)
    TodayQuizStats findTodayStats(@Param("userId") Long userId, @Param("date") LocalDate date);

    // 사용자의 특정 일자 응시 퀴즈에 포함된 distinct word_id 수를 조회한다 (PBI-12 STUDY_WORDS.current).
    @Query(value = """
            SELECT COUNT(DISTINCT qrd.word_id)
            FROM quiz_result_details qrd
            JOIN quiz_results qr ON qrd.quiz_result_id = qr.id
            WHERE qr.user_id = :userId AND DATE(qr.submitted_at) = :date
            """, nativeQuery = true)
    int countDistinctWordsStudiedToday(@Param("userId") Long userId, @Param("date") LocalDate date);
}
