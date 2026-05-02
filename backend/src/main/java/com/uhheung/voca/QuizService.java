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

            List<String> options = new ArrayList<>();
            options.add(correctWord.getEnglish());
            wrongWords.forEach(w -> options.add(w.getEnglish()));

            Collections.shuffle(options);

            return QuizQuestionDto.builder()
                    .wordId(correctWord.getId())
                    .meaning(correctWord.getMeaning())
                    .options(options)
                    .answer(correctWord.getEnglish())
                    .build();
        }).collect(Collectors.toList());
    }
}