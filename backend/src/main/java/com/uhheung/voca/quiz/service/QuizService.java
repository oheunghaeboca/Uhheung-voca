package com.uhheung.voca.quiz.service;

import com.uhheung.voca.quiz.dto.QuizQuestionDto;
import com.uhheung.voca.quiz.dto.QuizResponseDto;
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

    // 랜덤 20문항 생성: type에 따라 뜻→영단어 또는 영단어→뜻 퀴즈 구성
    public QuizResponseDto generateQuiz(String type) {
        List<Word> quizWords = wordRepository.findRandom20();

        List<QuizQuestionDto> questions = quizWords.stream().map(correctWord -> {
            List<Word> wrongWords = wordRepository.findRandom2Excluding(correctWord.getId());

            List<String> choices = new ArrayList<>();

            if ("WORD_TO_MEANING".equals(type)) {
                // 영단어→뜻: prompt=영단어, choices=한국어 뜻
                choices.add(correctWord.getKorean());
                wrongWords.forEach(w -> choices.add(w.getKorean()));
                Collections.shuffle(choices);

                return QuizQuestionDto.builder()
                        .wordId(correctWord.getId())
                        .questionNumber(quizWords.indexOf(correctWord) + 1)
                        .prompt(correctWord.getEnglish())
                        .choices(choices)
                        .correctAnswer(correctWord.getKorean())
                        .build();
            } else {
                // 뜻→영단어 (기본): prompt=한국어 뜻, choices=영단어
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
            }
        }).collect(Collectors.toList());

        return QuizResponseDto.builder()
                .quizType(type)
                .questions(questions)
                .build();
    }
}