package com.uhheung.voca.word.repository;

import com.uhheung.voca.word.entity.Word;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WordRepository extends JpaRepository<Word, Long> {
}
