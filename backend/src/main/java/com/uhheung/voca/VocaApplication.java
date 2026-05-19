package com.uhheung.voca;

import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.TimeZone;

@SpringBootApplication
public class VocaApplication {

	public static void main(String[] args) {
		SpringApplication.run(VocaApplication.class, args);
	}

	// JVM 기본 시간대를 한국시간으로 고정한다. LocalDate.now() 의 자정 경계가 KST 기준으로 동작하여
	// 미션/추천/출석의 "오늘" 이 사용자 체감과 일치하게 한다 (PBI-12 timezone 점검, 2026-05-20).
	@PostConstruct
	void initTimezone() {
		TimeZone.setDefault(TimeZone.getTimeZone("Asia/Seoul"));
	}
}
