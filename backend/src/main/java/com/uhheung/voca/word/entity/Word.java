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

    @Column(nullable = false, length = 10)
    private String type;

    @Column(length = 300)
    private String example;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Builder
    private Word(String english, String korean, String level, String type, String example) {
        this.english = english;
        this.korean = korean;
        this.level = level;
        this.type = type;
        this.example = example;
    }
}
