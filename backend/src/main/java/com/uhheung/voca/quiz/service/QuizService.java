package com.uhheung.voca.quiz.service;

import com.uhheung.voca.quiz.dto.QuizQuestionDto;
import com.uhheung.voca.quiz.repository.QuizResultDetailRepository;
import com.uhheung.voca.quiz.repository.QuizResultRepository;
import com.uhheung.voca.word.entity.Word;
import com.uhheung.voca.word.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuizService {

    private final QuizResultRepository quizResultRepository;
    private final QuizResultDetailRepository quizResultDetailRepository;
    private final WordRepository wordRepository;

    // 랜덤 20문항 생성: 정답 1개 + 오답 2개를 섞어 객관식 보기 구성
    public List<QuizQuestionDto> generateQuiz() {
        List<Word> quizWords = wordRepository.findRandom20();

        return quizWords.stream().map(correctWord -> {
            List<Word> wrongWords = wordRepository.findRandom2Excluding(correctWord.getId());

            List<String> choices = new ArrayList<>();
            choices.add(correctWord.getEnglish());
            wrongWords.forEach(w -> choices.add(w.getEnglish()));
            Collections.shuffle(choices);

            return QuizQuestionDto.builder()
                    .wordId(correctWord.getId())
                    .questionNumber(quizWords.indexOf(correctWord) + 1)
                    .prompt(correctWord.getKorean())
                    .choices(choices)
                    .correctAnswer(correctWord.getEnglish())
                    .build();
        }).collect(Collectors.toList());
    }

    // TODO: start(userId, QuizStartRequest) → 문제 생성 (출처: API_명세서.md 참조)
    // TODO: submit(userId, QuizSubmitRequest) → 채점 + QuizResult/QuizResultDetail 저장
    // TODO: results(userId, pageable)
    // TODO: result(userId, resultId)
}
