# 템플릿 04 — DB 스키마 변경 (Flyway)

> 백엔드 폴더에서 실행. 머지된 V*.sql은 절대 수정 금지 (Flyway 체크섬 깨짐).

```
@VIBE_CODING.md + backend/CLAUDE.md 기준.

[Layer 3 - Task]
- 작업: DB 스키마 변경
- 변경 종류: 테이블 추가 / 컬럼 추가 / 인덱스 / 제약 / 데이터 변환
- 영향 테이블: (ERD.md 테이블 명시)
- 비즈니스 이유: (왜 이 변경이 필요한가)
- 호환성: 기존 데이터 보존 / 마이그레이션 스크립트 필요 여부
- 함께 갱신할 산출물: ERD.md / API_명세서.md (해당 시)

[Layer 5 - Output]
- src/main/resources/db/migration/V{다음번호}__{설명}.sql 신규 파일만 작성
  - 기존 V*.sql 절대 수정 금지
- 매핑되는 JPA Entity 변경 (필드 추가 / @Column / @Enumerated 등)
- ./gradlew bootRun 부팅 시 Flyway가 적용 + JPA validate 통과 확인
- 영향 받는 Repository / Service / DTO 갱신 필요 여부 명시
```

## 자주 빠뜨리는 것
- [ ] 다음 V 번호 확인 (현재 마지막 V 번호 + 1)
- [ ] `ddl-auto = validate` 위배 안 되게 Entity와 컬럼 1:1 매칭
- [ ] InnoDB / utf8mb4 / NOT NULL 정책 일관성
- [ ] 인덱스 / FK / UNIQUE 제약 명명 규칙(`idx_`, `fk_`, `uq_`)
- [ ] 산출물(ERD.md 등) 동시 갱신
