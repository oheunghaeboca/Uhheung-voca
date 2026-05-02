# 템플릿 02 — 백엔드 단독 API

> 백엔드 폴더에서 실행 → `루트 CLAUDE.md` + `backend/CLAUDE.md` 자동 병합.

```
@VIBE_CODING.md + backend/CLAUDE.md 기준.

[Layer 3 - Task]
- 도메인: (auth / user / word / quiz / bookmark / attendance / mission / dashboard / ranking / wrongnote)
- 엔드포인트: METHOD /api/...
- 요청 DTO: (산출물/1_설계/API_명세서.md X-Y 그대로)
- 응답 DTO: (산출물/1_설계/API_명세서.md X-Y 그대로)
- 사용 테이블: (ERD.md 테이블 N — 관계 명시)
- 트랜잭션 / 동시성 주의점: (UNIQUE 제약 / Cascade / 락 등)
- 에러 케이스: 401 / 403 / 404 / 409 / 400 / 그 외 ___
- 인증: USER / ADMIN / 불필요
- DB 변경: 없음 / 있음(새 V{번호}__{설명}.sql)

[Layer 5 - Output]
파일별 분리:
- Controller (com.uhheung.voca.{도메인}.controller)
- Service    (com.uhheung.voca.{도메인}.service)
- Repository (com.uhheung.voca.{도메인}.repository)
- DTO        (com.uhheung.voca.{도메인}.dto)
- Entity     (필요 시 com.uhheung.voca.{도메인}.entity)
+ 메서드당 한 줄 주석
+ curl 예시 (정상 1 + 에러 1 이상)
+ ./gradlew build 통과 안내
```

## 자주 빠뜨리는 것
- [ ] `@Valid` + `@RestControllerAdvice` 통한 검증 처리
- [ ] 비밀번호 등 민감 데이터를 응답 DTO에 노출하지 않기
- [ ] N+1 (`@EntityGraph` 또는 fetch join)
- [ ] 머지된 V*.sql 수정 금지 — 항상 새 V{다음번호}
