package com.uhheung.voca.ranking.controller;

import com.uhheung.voca.ranking.dto.RankingResponse;
import com.uhheung.voca.ranking.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ranking")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping
    public ResponseEntity<List<RankingResponse>> getRanking(
            @RequestParam(defaultValue = "SCORE") String type,
            @RequestParam(defaultValue = "ALL") String period,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(rankingService.list(type, period, size));
    }
}