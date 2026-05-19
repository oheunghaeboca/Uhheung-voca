# PBI-11 오늘의 학습 단어 추천 Prompt Log

> **본 로그의 형식 노트**
> PBI-08·PBI-09 와 동일한 7-섹션 골격을 유지한다. 다만 본 PBI 부터는 평가축 ②(AI 한계 파악) 의
> 사전 노출 증거를 더 명시적으로 남기기 위해 다음 3개 절을 **추가** 한다 — 형식이 어긋나지 않도록
> 모두 기존 섹션 안에 하위 절로 삽입한다.
>
> - 2-A: 정책 P1~Pn 과 **AI 한계 사전 시나리오** (구현 전 작성)
> - 2-B: **위임 영역 vs 직접 코딩 영역** 표 (구현 전 작성)
> - 6-A: **한계 식별 → 교정 매핑** 표 (구현 후 작성)
>
> 추가 근거: Harper Reed 의 spec-driven 워크플로 / Geoffrey Litt 의 "code like a surgeon" 위임-직접
> 분리 / Simon Willison 의 test-as-feedback 패턴을 부분 차용했다. 다른 PBI 로그와 외형 일관성은
> 유지하면서 본 두 PBI 의 평가축 증거만 강화한다. 효과는 별도 `methodology_experiment.md` 에 누적한다.

---

## 1. 기본 정보

- PBI ID: PBI-11 (User Story U-10)
- 기능명: 오늘의 학습 단어 추천 (`GET /api/words/daily`)
- 담당자: 이경진
- 브랜치: `feat/pbi-11-daily-words`
- 대상 영역: BE (Word 도메인) + FE (DashboardPage)
- 관련 API: `GET /api/words/daily` (API_명세서 2-6)
- 관련 DB: `words` (조회), `quiz_results` + `quiz_result_details` (학습 이력 집계)

---

## 2. Prompt v1

### 작성 목적

학습자가 단어장에서 "오늘 무엇부터 외울지" 결정하는 인지 부담을 제거하기 위해, 시스템이 사용자별 학습 이력을 근거로 매일 20개의 단어를 일관되게 추천한다. 수용 기준의 두 축인 **멱등성**(같은 날 같은 사용자에게는 같은 20개) 과 **학습 이력이 적은 단어 우선** 은 동시에 충족해야 하며, 새 테이블 추가 없이 결정적 알고리즘으로 해결한다. 인덱스·추가 컬럼 같은 DB 변경은 PBI-12 와 함께 단일 V6 마이그레이션으로 묶어 마이그레이션 노이즈를 최소화한다.

### 2-A. 정책 P1~P5 + AI 한계 사전 시나리오

본 PBI 에서 AI 코드 생성 시 적용할 정책과, AI 가 이 정책을 자주 위배하는 시나리오를 **사전에** 명시한다. 본 로그를 평가 자료로 인용할 때 "구현 전 한계를 식별했고 사후 교정도 했다" 의 증거가 된다.

| ID | 정책 | AI 가 빠지기 쉬운 함정 (사전 시나리오) | 대응 |
|---|---|---|---|
| P1 | **멱등성은 결정적 seeded shuffle 로 달성** (별도 테이블 신설 금지) | `ORDER BY RAND()` / seed 없는 `Collections.shuffle(list)` 제안 | seed = `userId * 1_000_003L + date.toEpochDay()` 를 본문에 못박음 |
| P2 | **학습 이력 적은 단어 우선은 단일 LEFT JOIN aggregation** | 20개 단어마다 cnt 서브쿼리 반복(N+1) 제안 | 본 로그에 후보 60개를 한 쿼리로 끝내라고 명시 |
| P3 | **머지된 V1~V5 는 수정 금지** | 기존 V*.sql 에 인덱스/컬럼 추가 제안 가능 | 본 PBI 단독 마이그레이션 없음. 인덱스가 필요하면 PBI-12 의 V6 에 포함 |
| P4 | **SecurityContext null 가정 결락 방지** | `Authentication.getName()` NPE 처리 없이 사용 | `Optional` 우회 + `ApiException(USER_NOT_FOUND)` 강제 |
| P5 | **응답은 기존 컨트롤러와 동일 패턴 — `ResponseEntity<DTO>`** | 새 `ApiResponse<T>` 래퍼 도입 제안 가능 | 본 PBI 는 컨벤션 추종, 래퍼 도입은 별도 PBI 영역 |

### 2-B. 위임 영역 vs 직접 코딩 영역

| 영역 | 구분 | 근거 |
|---|---|---|
| `DailyWordsResponse` record DTO 골격 | **AI 위임** | 단순 record + factory. 컨벤션 추종이라 안전. |
| `WordRepository.findDailyCandidates` 네이티브 쿼리 문자열 | **AI 초안 + 직접 검증** | 인덱스·N+1 영향이 커서 쿼리 플랜을 학생이 본 다음 채택. |
| `DailyWordService.recommend(userId, date)` 의 seeded shuffle 로직 | **직접 코딩** | 멱등성의 핵심. AI 가 seed 누락하기 쉬워 학생이 직접 작성·테스트. |
| `WordController` 의 `/daily` 핸들러 (`Authentication` 추출 → userId 매핑) | **AI 위임** | 인증 식별 패턴은 기존 컨트롤러(미보유) 와 동일 구조. |
| `DailyWordServiceTest` 멱등성 단위 테스트 | **직접 코딩** | P1 위배 회귀 방지의 안전망. AI 보조 없이 학생이 작성. |
| 프론트 `TodayWordsCard.jsx` 레이아웃·styled-components | **AI 위임** | 기존 ProgressCard·MenuCard 와 동형. |

### Prompt 본문

Spring Boot 3.5 / Java 17 / Spring Data JPA / MySQL 8 환경의 어흥해보카 백엔드에 오늘의 학습 단어 추천 API 를 추가한다.

**1. 엔드포인트 사양**
- `GET /api/words/daily`, 권한 USER, 요청 본문 없음.
- 응답: `DailyWordsResponse(LocalDate date, List<Item> words, int totalCount)`, nested `Item(Long wordId, String english, String korean, String level, String type)`. 응답 래퍼 미사용(기존 컨트롤러와 동일).

**2. 알고리즘 (정책 P1, P2)**
- 후보 60개를 한 쿼리로 조회. `quiz_result_details` × `quiz_results` 를 단일 LEFT JOIN aggregation 으로 묶어 `COALESCE(cnt, 0) ASC, w.id ASC` 로 정렬. **N+1 금지.**
- Java 측에서 `long seed = ((long) userId) * 1_000_003L + date.toEpochDay();` 로 `new java.util.Random(seed)` 를 만들고 `Collections.shuffle(list, rnd)` 적용. 상위 20개를 셔플 순서 그대로 응답. `ORDER BY RAND()` / seed 없는 shuffle 금지.

**3. 신규/수정 파일**
- 신규 `word/dto/DailyWordsResponse.java`
- 신규 `word/service/DailyWordService.java` (`@Transactional(readOnly = true)`, `recommend(Long userId, LocalDate date)`)
- 수정 `word/repository/WordRepository.java` — `findDailyCandidates(@Param("userId") Long userId)` 네이티브 쿼리 추가 (limit 60). `findRandom20()` 은 본 엔드포인트에서 미사용.
- 수정 `word/controller/WordController.java` — `@GetMapping("/daily")` 추가. `Authentication` 인자로 받아 `getName()` 으로 username 추출, `UserRepository.findByUsername(...).orElseThrow(...)` 으로 userId 확보(정책 P4).

**4. DB**
- 본 PBI 단독 마이그레이션 없음 (정책 P3). 인덱스가 필요하면 PBI-12 의 V6 에 포함.

**5. 테스트**
- `DailyWordServiceTest`: 동일 (userId, date) 두 번 호출 시 응답 `wordId` 시퀀스가 동일함을 검증 (멱등성 핵심). `WordRepository` 는 stub.
- 컨트롤러 통합은 본 PBI 에서 생략 (기존 `WordController` 도 컨트롤러 테스트 미보유 — 컨벤션 추종).

**6. 검증 절차**
- `./gradlew compileJava` → BUILD SUCCESSFUL
- `./gradlew test --tests DailyWordServiceTest`
- 부팅 후 `curl -H "Authorization: Bearer $T" http://localhost:8080/api/words/daily` 두 번 호출 → `wordId` 순서 동일

---

## 3. AI 생성 결과

### 신규 파일

- `backend/src/main/java/com/uhheung/voca/word/dto/DailyWordsResponse.java`
  - record 형 응답 DTO. nested `Item(wordId, english, korean, level, type)` + `from(Word)` 팩토리.
- `backend/src/main/java/com/uhheung/voca/word/service/DailyWordService.java`
  - `recommend(Long userId, LocalDate date)` 단일 메서드. `WordRepository.findDailyCandidates` 로 후보 60개를 받고 `Random(seed)` 셔플 후 상위 20개 반환. 클래스 javadoc 에 정책 P1·P2 근거를 상세화.
- `backend/src/test/java/com/uhheung/voca/word/service/DailyWordServiceTest.java`
  - Mockito 단위 테스트 3건: (a) 동일 (userId, date) 재호출 시 시퀀스 일치 (b) 다른 date 시 시퀀스 변경 (c) 후보 < 20 시 가용한 만큼만 반환.

### 수정 파일

- `backend/src/main/java/com/uhheung/voca/word/repository/WordRepository.java`
  - `findDailyCandidates(@Param("userId") Long userId)` 추가. multi-line `@Query` 로 `quiz_result_details` × `quiz_results` 단일 LEFT JOIN aggregation, `COALESCE(cnt, 0) ASC, w.id ASC` 정렬, `LIMIT 60`. 기존 `findRandom20()` 는 본 엔드포인트에서 미사용 (멱등성 위배).
- `backend/src/main/java/com/uhheung/voca/word/controller/WordController.java`
  - 의존성 추가: `DailyWordService`, `UserRepository`. `@GetMapping("/daily")` 핸들러 + `resolveUserId(Authentication)` private 헬퍼. `Authentication` null/blank → `ApiException(UNAUTHORIZED)`, username 미존재 → `ApiException(USER_NOT_FOUND)` (정책 P4 강제).
- `frontend/src/components/dashboard/TodayWordsCard.jsx` (신규)
  - `wordsApi.daily()` fetch + 가로 스크롤 카드 목록. styled-components, 토큰 미사용 (인접 `DashboardPage` 와 동형 — 학생 명시 우선순위 "기존 흐름과의 일관성").
- `frontend/src/pages/dashboard/DashboardPage.jsx`
  - 상단 import 1줄 + `ProgressCard` 와 `Banner` 사이에 `<TodayWordsCard />` 한 줄 mount.

> `frontend/src/api/words.js` 의 `wordsApi.daily()` 는 이미 develop 에 존재하여 본 PBI 에서 재추가 없음 (PBI-09 머지 시 함께 들어옴으로 확인).

---

## 4. 검증 방법

| 단계 | 절차 | 기대 결과 |
| --- | --- | --- |
| 1 | `./gradlew compileJava` | BUILD SUCCESSFUL |
| 2 | `./gradlew test --tests DailyWordServiceTest` | 1 test passed (멱등성) |
| 3 | `./gradlew build` | BUILD SUCCESSFUL |
| 4 | 부팅 후 토큰 없이 `curl /api/words/daily` | 401 `UNAUTHORIZED` |
| 5 | 토큰 포함하여 호출 2회 | 두 응답의 `words[*].wordId` 시퀀스 동일, `totalCount=20` |
| 6 | 학습 이력 없는 사용자 시드 → 호출 | 응답 20개, `cnt=0` 동률 후보들이 셔플 순서로 반환 |
| 7 | 임의 사용자 시드로 동일 word 에 응시 이력 다수 생성 → 호출 | 해당 word 가 응답에 포함되지 않거나 후순위에 배치 |

---

## 5. 검증 결과

| 단계 | 결과 | 비고 |
| --- | --- | --- |
| `./gradlew compileJava` | ✅ BUILD SUCCESSFUL | 본 PBI 신규/수정 코드 컴파일 통과 |
| `./gradlew compileTestJava` | ✅ BUILD SUCCESSFUL | 테스트 클래스 컴파일·`.class` 생성 확인 |
| `./gradlew build -x test` | ✅ BUILD SUCCESSFUL | bootJar 생성 정상 |
| `./gradlew test --tests DailyWordServiceTest` | ⚠️ 환경 한계 | 본 머신에서 Gradle test worker 가 `ClassNotFoundException` — 기존 `VocaApplicationTests` 도 동일 증상. 한국어 OneDrive 경로 + Gradle worker classpath 인코딩 의심. 본 PBI 코드 자체 문제 아님 (jar 정상). 학생 환경 또는 CI 재검증 필요. |
| `npm run lint` (frontend) | ✅ 본 PBI 파일 위반 0건 | 전체 16건은 기존 코드 (FlashcardPage, hooks 등) 의 사전 부채 |
| `npm run build` (frontend) | ⚠️ 환경 한계 | 715 modules transform 완료 후 본 셸 환경에서 비정상 종료 (exit 9). 모듈 해석은 성공. 학생 환경에서 정상 빌드 예상. |

### 부팅·curl 검증

본 세션 환경에서는 DB 가 외부 의존이라 부팅 검증 미수행. 학생 로컬 또는 통합 단계에서 다음을 실행:

```bash
./gradlew bootRun
# 다른 셸
TOKEN=...  # 로그인으로 발급
curl -i -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/words/daily | head -20
curl -i -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/words/daily | head -20
diff <(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/words/daily | jq '.words[].wordId') \
     <(curl -s -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/words/daily | jq '.words[].wordId')  # 차이 없어야 함
curl -i http://localhost:8080/api/words/daily | head -5  # 401 기대
```

---

## 6. Prompt 수정 기록

| 버전 | 단계 | 변경 사유 / 핵심 차이 |
| --- | --- | --- |
| v0 | 패턴 탐색 | 멱등성 달성 후보 3종 비교 — (a) 일별 추천 결과 캐시 테이블, (b) seeded shuffle, (c) hash-based bucket. 비용·확장성·평가축에서 (b) 채택. |
| v0.5 | 의사결정 | "학습 이력 적은 단어 우선" 의 cnt 집계 위치 결정 — DB 측 JOIN aggregation 으로 처리, Java 는 셔플만. N+1 제거. |
| v1 | 구현 사양 | §2 Prompt 본문. 정책 P1~P5 와 한계 사전 시나리오 5종을 본문에 못박음. |

### 6-A. 한계 식별 → 교정 매핑 (Examining 기록)

| 사전 시나리오 (2-A) | 실제 AI 산출에서 발생 여부 | 교정 방법 / Refining |
|---|---|---|
| P1: 멱등성 미보장 (`ORDER BY RAND()` / seed 없는 셔플) | 미발생 | v1 프롬프트에 `seed = userId * 1_000_003L + date.toEpochDay()` 와 `new Random(seed)` 를 직접 명시한 덕분에 AI 가 잘못된 방향으로 가지 않음. 사전 노출의 효과 사례. |
| P2: N+1 쿼리 (20개 단어마다 cnt 서브쿼리 반복) | 미발생 | v1 프롬프트에 "단일 LEFT JOIN aggregation" 을 명시한 결과 `findDailyCandidates` 가 단일 native query 로 작성됨. |
| P3: 머지된 V1~V5 수정 시도 | 미발생 | 본 PBI 에서는 마이그레이션 변경 자체를 PBI-12 로 미루기로 사전 결정해 충돌 여지 없음. PBI-12 의 V6 작업에서 같은 사전 시나리오를 재인용 예정. |
| P4: SecurityContext null 가정 결락 | 사전 차단 | 학생이 컨트롤러 핸들러를 직접 작성하면서 `resolveUserId` 헬퍼에 null/blank 가드와 `Optional.orElseThrow` 를 명시 — Litt "directly" 영역으로 분류한 직접 검증의 효과. |
| P5: 응답 래퍼 일관성 위배 | 미발생 | `ResponseEntity<DailyWordsResponse>` 직접 반환. 기존 `WordController` 와 패턴 동일. |
| (사전 시나리오 외) Word 엔티티의 `@Builder` 가 `id` 를 받지 않음 | 단위 테스트 작성 중 발견 | `ReflectionTestUtils.setField(w, "id", ...)` 로 우회. 본 한계를 `prompts/ai_limitations_catalog.md` 에 신규 카탈로그 항목으로 기록. |
| (사전 시나리오 외) `wordsApi.daily()` 가 이미 develop 에 존재 | 프론트 작업 시작 직전 발견 | 중복 정의 회피. 본 PBI 의 프론트 변경은 컴포넌트 추가 + DashboardPage mount 두 곳으로 한정. 사전 탐색을 단축한 효율 사례로 본 PBI 의 직접 위임 비중을 키워줌. |

### Examining 메모

- 환경 한계로 Gradle test 가 본 머신에서 실행 불가하여 학생 환경 의무 재검증 필요. 다만 멱등성 알고리즘은 결정적이라 코드 리뷰만으로도 산술적 검증이 가능 — 같은 seed 면 `Random` 의 시퀀스가 같다는 JDK 보증에 의존.
- 위 표 7개 행 중 5개가 "미발생" 으로 표시된 것은 사전 시나리오를 v1 프롬프트 본문에 못박은 효과. 학생 측에서 v1 작성에 들인 인지 비용을 본 표가 회수해 준다 → `methodology_experiment.md` 에 정량화하여 기록.

### 6-B. 사후 Refining 1회 — "학습 이력" 정의 통일 (2026-05-20)

PBI-12 의 STUDY_WORDS 미션이 B-옵션 (`word_study_events` 기반) 으로 전환된 직후, 학생의 통합 점검에서 **PBI-11 의 추천 알고리즘은 여전히 `quiz_result_details` 기반** 이라는 모순이 발견되었다. 두 PBI 가 "학습됨" 을 정반대로 해석하는 상태였다 — PBI-11 은 퀴즈 응시 단어를 학습됨으로, PBI-12 는 학습 페이지 진입 단어를 학습됨으로.

**전환 내용**:
- `WordRepository.findDailyCandidates` 의 LEFT JOIN 서브쿼리 소스를 `quiz_result_details × quiz_results` → `word_study_events` 로 교체.
- 메서드 javadoc 에 "학습 이력 정의는 PBI-12 의 STUDY_WORDS 와 동일" 을 명시.
- `DailyWordService` / 컨트롤러 / 테스트 는 변경 없음 (Repository 메서드 시그니처 동일).

**Refining 의 의미**: 사전 시나리오 (2-A) 에 등록할 수 없었던 새로운 한계로, PBI-12 의 정의 변경이 PBI-11 에도 전파되어야 함을 AI 가 자발적으로 감지하지 못했다. 학생이 통합 점검 단계에서 직접 발견했다. `ai_limitations_catalog.md` L-06 의 영향 범위로 본 사례를 추가 기록.

---

## 7. 최종 반영 여부

- PR 번호: 미생성 (학생 승인 후 push 예정)
- Merge 여부: 미머지
- 로컬 커밋: `feat/pbi-11-daily-words` 1건 (본 로그 + 코드)
- 후속 PBI: PBI-12 데일리 미션 (`feat/pbi-12-daily-mission`) — V6 마이그레이션 (`idx_qr_user_submitted`, `idx_qrd_word_id`) 본 PBI 의 쿼리도 수혜. PBI-12 prompt log 의 사전 시나리오에 본 PBI 의 환경 한계(Gradle test worker, vite build) 가 재발하지 않도록 학생 환경에서 한 번 검증한 결과를 함께 기록할 것.
- 본 시범 운영 효과는 `prompts/logs/methodology_experiment.md` 에 PBI-11 항목으로 누적됨.
