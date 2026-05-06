package com.uhheung.voca.quiz.repository;

import com.uhheung.voca.quiz.entity.QuizResultDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizResultDetailRepository extends JpaRepository<QuizResultDetail, Long> {

    // 특정 퀴즈 결과의 문항별 상세를 문제 번호 오름차순으로 조회한다.
    List<QuizResultDetail> findByQuizResultIdOrderByQuestionNumberAsc(Long quizResultId);
}
