package com.uhheung.voca.quiz;

import com.uhheung.voca.quiz.dto.QuizQuestionDto;
import com.uhheung.voca.word.Word;
import com.uhheung.voca.word.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final WordRepository wordRepository;

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
                    .meaning(correctWord.getKorean())
                    .choices(choices)
                    .correctAnswer(correctWord.getEnglish())
                    .build();
        }).collect(Collectors.toList());
    }
}
