package com.uhheung.voca.quiz.repository;

import com.uhheung.voca.quiz.entity.QuizResultDetail;
import com.uhheung.voca.wrongnote.dto.WrongNoteProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizResultDetailRepository extends JpaRepository<QuizResultDetail, Long> {

    List<QuizResultDetail> findByQuizResultIdOrderByQuestionNumberAsc(Long quizResultId);

    @Query(value = """
            SELECT
                d.word_id AS wordId,
                w.english AS english,
                w.korean AS korean,
                COUNT(*) AS wrongCount,
                MAX(r.submitted_at) AS lastWrongAt
            FROM quiz_result_details d
            JOIN quiz_results r ON d.quiz_result_id = r.id
            JOIN words w ON d.word_id = w.id
            WHERE r.user_id = :userId
              AND d.is_correct = false
            GROUP BY d.word_id, w.english, w.korean
            ORDER BY lastWrongAt DESC
            """, nativeQuery = true)
    List<WrongNoteProjection> findWrongNotesByUserId(@Param("userId") Long userId);
}
