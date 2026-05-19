package com.uhheung.voca.word.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

// 사용자가 단어를 본 사건을 기록한다. PBI-12 STUDY_WORDS 미션의 카운트 소스.
@Getter
@Entity
@Table(name = "word_study_events")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class WordStudyEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "word_id", nullable = false)
    private Long wordId;

    @CreationTimestamp
    @Column(name = "studied_at", nullable = false, updatable = false)
    private LocalDateTime studiedAt;

    @Builder
    private WordStudyEvent(Long userId, Long wordId) {
        this.userId = userId;
        this.wordId = wordId;
    }
}
