package com.uhheung.voca.word;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "words")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String english;

    @Column(nullable = false)
    private String korean;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WordType type;

    public enum WordType { LC, RC }
}