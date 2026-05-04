package com.uhheung.voca.word.dto;

import jakarta.validation.constraints.NotBlank;

public record WordCreateRequest(
        @NotBlank String english,
        @NotBlank String korean,
        @NotBlank String level,
        String part,
        @NotBlank String type,
        String example,
        String exampleTranslation
) {}