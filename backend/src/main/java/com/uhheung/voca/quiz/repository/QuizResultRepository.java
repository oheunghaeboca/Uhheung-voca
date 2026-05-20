package com.uhheung.voca.quiz.repository;

import com.uhheung.voca.quiz.entity.QuizResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizResultRepository extends JpaRepository<QuizResult, Long> {
}
