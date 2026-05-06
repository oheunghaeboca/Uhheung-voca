package com.uhheung.voca.quizresult.service;

import com.uhheung.voca.common.exception.ApiException;
import com.uhheung.voca.common.exception.ErrorCode;
import com.uhheung.voca.quiz.entity.QuizResult;
import com.uhheung.voca.quiz.entity.QuizResultDetail;
import com.uhheung.voca.quiz.repository.QuizResultDetailRepository;
import com.uhheung.voca.quiz.repository.QuizResultRepository;
import com.uhheung.voca.quizresult.dto.QuizResultDetailRequest;
import com.uhheung.voca.quizresult.dto.QuizResultDetailResponse;
import com.uhheung.voca.quizresult.dto.QuizResultSaveRequest;
import com.uhheung.voca.quizresult.dto.QuizResultSaveResponse;
import com.uhheung.voca.user.repository.UserRepository;
import com.uhheung.voca.word.entity.Word;
import com.uhheung.voca.word.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class QuizResultService {

    private final QuizResultRepository quizResultRepository;
    private final QuizResultDetailRepository quizResultDetailRepository;
    private final UserRepository userRepository;
    private final WordRepository wordRepository;

    // 퀴즈 전체 결과와 문항별 상세 결과를 하나의 트랜잭션으로 저장한다.
    public QuizResultSaveResponse save(QuizResultSaveRequest request) {
        validateUser(request.getUserId());
        validateWords(request.getDetails());
        validateCorrectCount(request.getCorrectCount(), request.getTotalQuestions());

        QuizResult savedQuizResult = quizResultRepository.save(toQuizResult(request));
        List<QuizResultDetail> details = toDetails(savedQuizResult.getId(), request.getDetails());
        quizResultDetailRepository.saveAll(details);

        return QuizResultSaveResponse.from(savedQuizResult);
    }

    // 저장된 퀴즈 결과와 문항별 상세 결과를 조회한다.
    @Transactional(readOnly = true)
    public QuizResultDetailResponse getDetail(Long quizResultId) {
        QuizResult quizResult = quizResultRepository.findById(quizResultId)
                .orElseThrow(() -> new ApiException(ErrorCode.NOT_FOUND));

        List<QuizResultDetail> details =
                quizResultDetailRepository.findByQuizResultIdOrderByQuestionNumberAsc(quizResultId);

        Set<Long> wordIds = details.stream()
                .map(QuizResultDetail::getWordId)
                .collect(Collectors.toSet());

        Map<Long, Word> wordMap = wordRepository.findAllById(wordIds).stream()
                .collect(Collectors.toMap(Word::getId, word -> word));

        List<QuizResultDetailResponse.Item> responseDetails = details.stream()
                .map(detail -> {
                    Word word = wordMap.get(detail.getWordId());

                    if (word == null) {
                        throw new ApiException(ErrorCode.WORD_NOT_FOUND);
                    }

                    return new QuizResultDetailResponse.Item(
                            detail.getWordId(),
                            word.getEnglish(),
                            word.getKorean(),
                            detail.getQuestionNumber(),
                            detail.getUserAnswer(),
                            detail.getCorrectAnswer(),
                            detail.getIsCorrect()
                    );
                })
                .toList();

        return new QuizResultDetailResponse(
                quizResult.getId(),
                quizResult.getQuizType(),
                quizResult.getTotalQuestions(),
                quizResult.getCorrectCount(),
                quizResult.getScore(),
                quizResult.getSubmittedAt(),
                responseDetails
        );
    }

    // 요청한 userId가 실제 users 테이블에 존재하는지 확인한다.
    private void validateUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ApiException(ErrorCode.USER_NOT_FOUND);
        }
    }

    // 요청한 wordId들이 실제 words 테이블에 모두 존재하는지 확인한다.
    private void validateWords(List<QuizResultDetailRequest> details) {
        Set<Long> requestedWordIds = new HashSet<>();

        for (QuizResultDetailRequest detail : details) {
            requestedWordIds.add(detail.getWordId());
        }

        List<Word> foundWords = wordRepository.findAllById(requestedWordIds);

        if (foundWords.size() != requestedWordIds.size()) {
            throw new ApiException(ErrorCode.WORD_NOT_FOUND);
        }
    }

    // 정답 개수가 전체 문제 수를 초과하지 않도록 검증한다.
    private void validateCorrectCount(Integer correctCount, Integer totalQuestions) {
        if (correctCount > totalQuestions) {
            throw new ApiException(ErrorCode.INVALID_INPUT);
        }
    }

    // 요청 DTO를 quiz_results Entity로 변환한다.
    private QuizResult toQuizResult(QuizResultSaveRequest request) {
        return QuizResult.builder()
                .userId(request.getUserId())
                .quizType(request.getQuizType())
                .totalQuestions(request.getTotalQuestions())
                .correctCount(request.getCorrectCount())
                .score(request.getScore())
                .build();
    }

    // 요청 DTO의 문항별 결과를 quiz_result_details Entity 목록으로 변환한다.
    private List<QuizResultDetail> toDetails(Long quizResultId, List<QuizResultDetailRequest> details) {
        return details.stream()
                .map(detail -> QuizResultDetail.builder()
                        .quizResultId(quizResultId)
                        .wordId(detail.getWordId())
                        .questionNumber(detail.getQuestionNumber())
                        .userAnswer(detail.getUserAnswer())
                        .correctAnswer(detail.getCorrectAnswer())
                        .isCorrect(detail.getIsCorrect())
                        .build())
                .toList();
    }
}