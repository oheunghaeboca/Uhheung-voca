package com.uhheung.voca.word.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "words")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String english;

    @Column(nullable = false, length = 200)
    private String korean;

    @Column(nullable = false, length = 20)
    private String level;

    @Column(length = 20)
    private String part;

    @Column(nullable = false, length = 10)
    private String type;

    @Column(length = 300)
    private String example;

    @Column(name = "example_translation", length = 300)
    private String exampleTranslation;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    private Word(String english, String korean, String level, String part,
                 String type, String example, String exampleTranslation) {
        this.english = english;
        this.korean = korean;
        this.level = level;
        this.part = part;
        this.type = type;
        this.example = example;
        this.exampleTranslation = exampleTranslation;
    }

    // PATCH 시 null인 필드는 기존 값 유지
    public void update(String english, String korean, String level, String part,
                       String type, String example, String exampleTranslation) {
        if (english != null) this.english = english;
        if (korean != null) this.korean = korean;
        if (level != null) this.level = level;
        if (part != null) this.part = part;
        if (type != null) this.type = type;
        if (example != null) this.example = example;
        if (exampleTranslation != null) this.exampleTranslation = exampleTranslation;
    }
}
