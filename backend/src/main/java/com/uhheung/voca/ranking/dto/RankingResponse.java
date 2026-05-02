package com.uhheung.voca.ranking.dto;

import java.math.BigDecimal;

public record RankingResponse(
        int rank,
        Long userId,
        String nickname,
        BigDecimal score
) {}
