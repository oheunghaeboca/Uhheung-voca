package com.uhheung.voca.quiz.repository;

import java.math.BigDecimal;

// QuizResultRepository.findTodayStats 의 인터페이스 프로젝션.
// MySQL 의 COUNT(*) 결과는 Long 으로 매핑되므로 호출 측에서 int 캐스팅한다.
public interface TodayQuizStats {

    Long getTaken();

    BigDecimal getTop();
}
