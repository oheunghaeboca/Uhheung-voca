# PBI-12 데일리 학습 미션 Prompt Log

> **본 로그의 형식 노트**
> PBI-08·PBI-09·PBI-11 과 동일한 7-섹션 골격을 유지한다. 본 PBI 부터는 PBI-11 시범 운영의 결과를
> 반영하여 2-A 와 6-A 는 유지하되 **2-B 는 한 줄로 압축**한다 (`methodology_experiment.md` 의
> 5번 항목 권고). 다른 PBI 로그와 외형은 그대로다.

---

## 1. 기본 정보

- PBI ID: PBI-12 (User Story U-20)
- 기능명: 데일리 학습 미션 (`GET /api/missions/today`) + 미션 완료 시 자동 출석 부여
- 담당자: 이경진
- 브랜치: `feat/pbi-12-daily-mission` (PBI-11 위에 분기)
- 대상 영역: BE (mission + attendance + quiz repository) + FE (DashboardPage)
- 관련 API: `GET /api/missions/today` (API_명세서 7-1)
- 관련 DB: `daily_missions` (upsert), `attendance` (grant 시 INSERT), `quiz_results` + `quiz_result_details` (통계), V6 마이그레이션으로 인덱스 2개 추가

---

## 2. Prompt v1

### 작성 목적

사용자가 매일 동일한 진입 경험을 갖도록 세 미션 — (1) 오늘의 단어 20개 학습 (2) 퀴즈 1회 응시 (3) 퀴즈 정답률 70%+ — 을 한 응답에 묶어 제공한다. 세 미션이 모두 충족되는 시점에 출석이 자동으로 부여되어 학습 습관 형성 동기가 강화된다. U-21 (퀴즈 70%+ 시 자동 출석) 은 별도 후속 PBI 이므로 본 PBI 의 출석 부여는 **미션 3개 모두 완료** 경로에 한정한다.

본 PBI 의 동시성 위험은 두 가지: (a) `daily_missions(user_id, date)` UNIQUE 와 (b) `attendance(user_id, date)` UNIQUE. 둘 다 DB 제약을 1차 방어선으로 두고 `DataIntegrityViolationException` 을 swallow 하는 멱등 패턴으로 대응한다.

### 2-A. 정책 P1~P6 + AI 한계 사전 시나리오

| ID | 정책 | AI 가 빠지기 쉬운 함정 | 대응 |
|---|---|---|---|
| P1 | **DailyMission 은 멱등 upsert** | 같은 날 두 번째 호출에서 새 row INSERT 시도 → UNIQUE 위반 | `findByUserIdAndDate().orElseGet(getOrCreate)` 패턴 강제 |
| P2 | **출석 grant 는 멱등** | INSERT 전 SELECT 후 INSERT race condition | `DataIntegrityViolationException` catch → swallow |
| P3 | **자정 경계는 서버 LocalDate 기준** | AI 가 `LocalDateTime.now()` 또는 `Instant` 로 처리 → 자정 경계 모호 | 서비스 진입점에서 `LocalDate.now()` 명시 |
| P4 | **BigDecimal 비교는 `compareTo`** | `>=` 또는 `equals` 로 비교 → scale 차이로 거짓 음성 | 70 비교는 `score.compareTo(BigDecimal.valueOf(70)) >= 0` |
| P5 | **V6 마이그레이션은 신규 파일**, V1~V5 미수정 | AI 가 기존 V*.sql 에 인덱스 추가 제안 → checksum 깨짐 | 신규 `V6__add_quiz_indexes_for_daily_stats.sql` |
| P6 | **MissionResponse 재설계** 시 기존 사용처 (`TodayMissionCard.jsx`) 깨짐 | AI 가 백엔드만 바꾸고 프론트 호환성 누락 | 프론트도 같은 PBI 에서 일괄 교체 + DashboardPage mount 갱신 |

> 참조: AI 한계 카탈로그 L-01~L-04 의 한계도 본 PBI 에서 재발 가능 (Word.@Builder · 기존 API 메서드 중복 · Gradle test worker · vite build) — `prompts/ai_limitations_catalog.md` 참조.

### 2-B. 위임 vs 직접

핵심 invariant 인 **동시성 가드**(P1·P2) 와 **자정 경계**(P3) 는 직접 코딩 / 검증. 그 외 (Repository 쿼리, DTO record, 프론트 widget) 는 AI 위임. (PBI-11 의 6행 표를 PBI-12 에서는 한 줄로 압축 — `methodology_experiment.md` §5 권고 반영.)

### Prompt 본문

Spring Boot 3.5 / Java 17 / MySQL 8 / Flyway 환경의 어흥해보카 백엔드에 데일리 미션 조회 API 와 미션 완료 시 자동 출석 부여 로직을 추가한다.

**1. 엔드포인트 사양**
- `GET /api/missions/today`, 권한 USER, 요청 본문 없음.
- 응답 `MissionResponse(LocalDate date, List<MissionItem> missions, boolean allCompleted, boolean attendanceGranted)`.
- `MissionItem(String missionType, String description, int target, int current, boolean isCompleted)`.
- 미션 3개: STUDY_WORDS(target 20) / TAKE_QUIZ(target 1) / SCORE_70(target 70).

**2. 동작 순서 (단일 `@Transactional`)**
1. `Authentication.getName()` → `UserRepository.findByUsername(...)` → userId. (PBI-11 패턴 재사용; 정책 P3 의 자정 경계는 `LocalDate.now()` 로 결정)
2. `DailyMission` getOrCreate (정책 P1).
3. 3개 통계 쿼리로 `wordsStudied`, `quizzesTaken`, `highestScore` 계산.
4. `DailyMission.updateProgress(words, quizzes, highest)` 호출.
5. `allCompleted = (words >= 20 && quizzes >= 1 && highest.compareTo(70) >= 0)` (정책 P4).
6. `allCompleted && !attendanceGranted` 면 `AttendanceService.grant(userId, today, highest)` 호출 + `mission.markAttendanceGranted()`.
7. DTO 빌드 → 응답.

**3. 통계 쿼리**
- `QuizResultRepository` 에 두 메서드 추가:
  - `Optional<TodayStats> findTodayStats(Long userId, LocalDate date)` — `COUNT(*) AS taken, COALESCE(MAX(score), 0) AS top` 한 번에.
  - `int countDistinctWordsStudiedToday(Long userId, LocalDate date)` — `quiz_result_details` JOIN.
- 둘 다 native query. `DATE(submitted_at) = :date` 필터.

**4. 출석 자동 부여 (정책 P2)**
- `AttendanceService.grant(Long userId, LocalDate date, BigDecimal score)`:
  - `findByUserIdAndDate` 있으면 즉시 return.
  - 없으면 `Attendance.builder()...build()` 후 INSERT.
  - `try/catch (DataIntegrityViolationException)` → swallow (동시 호출 = 이미 부여됨).

**5. V6 마이그레이션 (정책 P5)**
```sql
-- V6__add_quiz_indexes_for_daily_stats.sql
CREATE INDEX idx_qr_user_submitted ON quiz_results(user_id, submitted_at);
CREATE INDEX idx_qrd_word_id ON quiz_result_details(word_id);
```

**6. 신규/수정 파일**
- 신규 `mission/domain/MissionType.java` (enum + description/target 메타)
- 신규 `mission/dto/MissionItem.java` (record)
- 수정 `mission/dto/MissionResponse.java` (record 시그니처 재설계)
- 수정 `mission/entity/DailyMission.java` (updateProgress / markAttendanceGranted 메서드 추가)
- 구현 `mission/service/MissionService.java` (`todayMission(String username)`)
- 구현 `mission/controller/MissionController.java` (`@GetMapping("/today")`)
- 구현 `attendance/service/AttendanceService.java` (`grant`)
- 수정 `quiz/repository/QuizResultRepository.java` (두 통계 쿼리)
- 신규 `backend/src/main/resources/db/migration/V6__add_quiz_indexes_for_daily_stats.sql`
- 수정 `frontend/src/components/dashboard/TodayMissionCard.jsx` (새 응답 시그니처 받기) — 정책 P6
- 수정 `frontend/src/pages/dashboard/DashboardPage.jsx` (TodayMissionCard mount + 데이터 fetch)

**7. 테스트**
- `MissionServiceTest` (Mockito): (a) 모두 완료 시 grant 1회, (b) 재호출 시 grant 미발생 (멱등), (c) 70점 미달 시 미완료.

---

## 3. AI 생성 결과

### 신규 파일

- `backend/src/main/java/com/uhheung/voca/mission/domain/MissionType.java`
  - enum 3종 — `STUDY_WORDS / TAKE_QUIZ / SCORE_70`. `description` + `target` 메타.
- `backend/src/main/java/com/uhheung/voca/mission/dto/MissionItem.java` — record (missionType / description / target / current / isCompleted).
- `backend/src/main/java/com/uhheung/voca/quiz/repository/TodayQuizStats.java` — `findTodayStats` 의 인터페이스 프로젝션 (taken: Long, top: BigDecimal).
- `backend/src/test/java/com/uhheung/voca/mission/service/MissionServiceTest.java` — Mockito 테스트 3건 (전체 충족 시 grant 1회 / 재호출 멱등 / 점수 미달 시 미부여).
- `backend/src/main/resources/db/migration/V6__add_quiz_indexes_for_daily_stats.sql` — `idx_qr_user_submitted`, `idx_qrd_word_id` 두 인덱스.

### 수정 파일

- `mission/dto/MissionResponse.java` — `(LocalDate date, List<MissionItem> missions, boolean allCompleted, boolean attendanceGranted)` 로 재설계 (정책 P6).
- `mission/entity/DailyMission.java` — `updateProgress` / `markCompleted` / `markAttendanceGranted` 메서드 추가. 외부 setter 노출 없음.
- `mission/service/MissionService.java` — `todayMission(String username)` 구현. read-on-demand + lazy upsert + 출석 자동 부여 통합.
- `mission/controller/MissionController.java` — `@GetMapping("/today")` 추가.
- `attendance/service/AttendanceService.java` — `grant(Long, LocalDate, BigDecimal)` 멱등 구현 (`DataIntegrityViolationException` swallow).
- `quiz/repository/QuizResultRepository.java` — `findTodayStats` + `countDistinctWordsStudiedToday` 두 native query.
- `frontend/src/components/dashboard/TodayMissionCard.jsx` — 새 응답 구조에 맞춰 self-fetch + 미션 3개 progress bar + 출석 인정 배지로 재작성.
- `frontend/src/pages/dashboard/DashboardPage.jsx` — `TodayMissionCard` import + mount (PBI-11 의 `TodayWordsCard` 와 같은 영역).

---

## 4. 검증 방법

| 단계 | 절차 | 기대 결과 |
| --- | --- | --- |
| 1 | `./gradlew compileJava` | BUILD SUCCESSFUL |
| 2 | `./gradlew compileTestJava` | BUILD SUCCESSFUL |
| 3 | `./gradlew build -x test` | bootJar 생성 |
| 4 | `npm run lint` (frontend) | 본 PBI 신규 파일 0 위반 |
| 5 | 토큰 없이 `curl /api/missions/today` | 401 UNAUTHORIZED |
| 6 | 토큰 포함 호출 (학습 이력 없음) | 200, missions current 모두 0, allCompleted=false, attendanceGranted=false |
| 7 | 퀴즈 1회 70%+ 응시 후 호출 | TAKE_QUIZ=1, SCORE_70 current>=70 |
| 8 | STUDY_WORDS 까지 20개 단어 응시 누적 | allCompleted=true, attendanceGranted=true, `attendance` 테이블 INSERT 1행 |
| 9 | 동일 일자 재호출 | attendanceGranted=true 유지, attendance INSERT 추가 없음 (멱등) |

---

## 5. 검증 결과

| 단계 | 결과 | 비고 |
| --- | --- | --- |
| `./gradlew compileJava` | ✅ BUILD SUCCESSFUL | 신규/수정 코드 컴파일 정상 |
| `./gradlew compileTestJava` | ✅ BUILD SUCCESSFUL | `MissionServiceTest` 컴파일 정상 |
| `./gradlew build -x test` | ✅ BUILD SUCCESSFUL | bootJar 생성 정상 |
| `./gradlew test` | ⚠️ 환경 한계 (PBI-11 동일) | 한국어 OneDrive 경로 + Gradle test worker 클래스 로딩 실패. 코드 자체 문제 아님 — `ai_limitations_catalog.md` L-03 참조. |
| `npm run lint` (frontend) | ✅ 본 PBI 파일 위반 0건 | 기존 부채는 본 PBI 와 무관 |
| `npm run build` (frontend) | ⚠️ 환경 한계 (PBI-11 동일) | 모듈 해석 성공 후 본 셸에서 비정상 종료 — L-04 참조 |
| 통합 시나리오 (학생 환경) | 미수행 | DB 의존성 — 학생 환경에서 §4 표 순서대로 검증 필요 |

### V6 마이그레이션 영향

- 본 PBI 머지 후 백엔드 첫 부팅 시 Flyway 가 V6 을 적용한다. `quiz_results` 행 수가 학습 환경에서 작아 인덱스 추가 비용은 거의 무시 가능.
- PBI-11 의 `findDailyCandidates` LEFT JOIN 도 같은 인덱스 수혜 — 학생 환경에서 응답 시간 비교 시 차이를 관찰할 수 있음.

---

## 6. Prompt 수정 기록

| 버전 | 단계 | 변경 사유 / 핵심 차이 |
| --- | --- | --- |
| v0 | 패턴 탐색 | read-on-demand vs 별도 update 엔드포인트 vs trigger 패턴 비교. API 명세에 update API 없음 + 일일 통계는 quiz_results 에서 계산 가능 → read-on-demand 채택. |
| v0.5 | 의사결정 | 출석 부여를 본 PBI 안에서 직접 INSERT 할지 또는 U-21 까지 미룰지 결정. 학생 명시 의사결정으로 본 PBI 가 직접 책임. AttendanceService.grant 도 함께 구현. |
| v1 | 구현 사양 | §2 본문. 정책 P1~P6 명시, 통계 쿼리 / 출석 부여 / V6 마이그레이션을 한 단일 트랜잭션 흐름으로 정렬. |

### 6-A. 한계 식별 → 교정 매핑 (Examining 기록)

| 사전 시나리오 (2-A) | 실제 AI 산출에서 발생 여부 | 교정 방법 / Refining |
|---|---|---|
| P1: DailyMission 멱등 upsert | 미발생 | v1 본문에 `findByUserIdAndDate().orElseGet(save(builder...))` 패턴을 명시. 단일 `@Transactional` 안에서 진척 갱신과 동일 트랜잭션을 유지하여 race 흡수. |
| P2: AttendanceService.grant race | 미발생 | `AttendanceService.grant` 에 `DataIntegrityViolationException` catch 블록을 명시 작성. log 는 debug 로만, 사용자 응답에는 영향 없음. |
| P3: 자정 경계 | 미발생 | 서비스 진입점 한 곳에서만 `LocalDate.now()` 를 호출, 이후 모든 비교는 같은 인스턴스 사용. |
| P4: BigDecimal compareTo | 미발생 | `SCORE_THRESHOLD = new BigDecimal("70")` 상수 + `score.compareTo(SCORE_THRESHOLD) >= 0` 사용. `>=` 또는 `equals` 사용 안 함. |
| P5: V6 마이그레이션 신규 파일 | 미발생 | 기존 V1~V5 무수정. V6 만 신규 작성 + 본 PBI commit 에 포함. |
| P6: 프론트 호환성 | 발생·교정 완료 | 기존 `TodayMissionCard.jsx` 가 `mission.wordsStudied / quizzesTaken / highestScore` prop 시그니처. 본 PBI 에서 응답 구조가 `missions[]` 배열로 바뀜 → 같은 PBI 의 frontend 변경에서 self-fetch + 새 시그니처로 컴포넌트 본체 재작성. 다른 사용처는 grep 결과 0건이라 외부 깨짐 없음. |
| L-01 (Word @Builder 에 id 없음) | 비해당 | 본 PBI 는 Word 엔티티 stub 불요. User 엔티티는 동일 패턴이라 `ReflectionTestUtils.setField(u, "id", id)` 로 동일 우회. |
| L-02 (기존 API 메서드 중복) | 미발생 | 작업 시작 전 `frontend/src/api/missions.js` 확인. `today()` 가 이미 존재하여 추가 없이 그대로 사용. |
| L-03 / L-04 (Gradle test worker, vite build) | 재발생 | 본 PBI 도 동일 환경 한계. §5 검증 결과 표에 명시. 학생 환경에서 별도 검증 필요. |

### Examining 메모

- `mission.attendanceGranted` 가 `Boolean` (래퍼) 이라 `if (mission.getAttendanceGranted())` 같은 호출이 null 시 NPE 일 수 있어 `Boolean.FALSE.equals(...)` 로 작성. 사전 시나리오에 없었던 작은 안전망 — `ai_limitations_catalog.md` 의 L-05 후보로 검토.
- PBI-11 의 위임 vs 직접 표가 6행, PBI-12 는 1행으로 압축. 압축 후에도 핵심 invariant (P1·P2·P3) 의 직접 검증 의도는 유지. `methodology_experiment.md` §5 권고 그대로 적용된 사례.

### 6-B. 사후 Refining 1회 — STUDY_WORDS 정의 전환 (B-옵션)

학생 명시 지시 (2026-05-20) 로 STUDY_WORDS 의 카운트 소스를 **퀴즈 응시 단어** 에서 **단어 학습 페이지 진입 이력** 으로 전환했다.

**전환 사유** (대화에서 학생이 지적한 세 가지 문제):

1. TAKE_QUIZ 와 트리거 동일: "퀴즈 한 번 풀고 제출" 만으로 두 미션 동시 충족 → 미션 3개 분리 의도 약화.
2. 단어 학습 페이지(`/flashcard`, `/words/:id`)에서 단어를 봐도 카운트되지 않음 → UI 가 "단어 학습" 이라고 부르는데 실제로는 퀴즈만 카운트하는 라벨-동작 불일치.
3. 표준 퀴즈가 20문제이므로 한 번에 자동 만점 → 미션의 점진적 진척 의미 상실.

**전환 내용**:

- 신규 `V7__create_word_study_events.sql` — `word_study_events(user_id, word_id, studied_at)` 테이블 + 인덱스 2개.
- 신규 `WordStudyEvent` 엔티티 / `WordStudyEventRepository.countDistinctWordsStudiedOn` / `WordStudyService.recordView`.
- 신규 `POST /api/words/{wordId}/view` 엔드포인트 (USER 권한, 204 No Content).
- `MissionService` 의 `wordsStudied` 카운트 소스를 `QuizResultRepository.countDistinctWordsStudiedToday` → `WordStudyEventRepository.countDistinctWordsStudiedOn` 으로 교체. `QuizResultRepository` 의 기존 메서드는 후속 통계용으로 보존.
- 프론트:
  - `wordsApi.view(id)` 추가.
  - `WordDetailPage` 의 `useEffect` 가 단어 로드 직후 `wordsApi.view(word.id)` 호출.
  - `FlashcardPage` 의 `useEffect` 가 `sessionWords[currentIndex]?.id` 변경 시 호출 (카드 넘김마다).
- `MissionServiceTest` 의 stub 도 새 의존성에 맞춰 갱신.

**Refining 의 의미**: 사전 시나리오 (2-A) 에 등록된 위험이 아니라, **AC 의 한 줄("단어 20개 학습")의 의미가 사용자 직관과 어긋날 수 있다는 점** 을 학생이 직접 식별해 교정했다. 즉 평가축 ②(AI 한계 파악) 의 가장 강한 형태 — AI 가 학생의 결정(A 옵션 추천)을 그대로 따라갔는데, 학생이 사용자 입장에서 본 의미와 비교해 다시 결정을 뒤집은 사례. `ai_limitations_catalog.md` L-06 으로 별도 항목 신설 예정.

---

## 7. 최종 반영 여부

- PR 번호: 미생성 (학생 승인 후 push 예정)
- Merge 여부: 미머지
- 로컬 커밋: `feat/pbi-12-daily-mission` 1건 (본 로그 + 코드 + V6 마이그레이션)
- 후속 PBI: U-21 자동 출석 (퀴즈 70%+ 단독 경로 — `AttendanceService.grant` 재사용), U-22 월별 출석 캘린더 (`/api/dashboard/attendance`).
- 본 시범 운영 효과는 `prompts/logs/methodology_experiment.md` 의 PBI-12 항목으로 누적 — PBI-11 과 종합 결론 절도 함께 작성.
