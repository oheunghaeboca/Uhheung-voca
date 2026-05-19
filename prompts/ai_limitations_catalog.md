# AI 한계 카탈로그 — Uhheung-voca

> 본 PBI 작업 중 실제로 식별된 AI 의 한계·맹점·맥락 결락을 누적한다.
> 다음 PBI 의 prompt log "2-A 사전 시나리오" 절에서 본 카탈로그 항목을 직접 인용하여
> "예전에 한 번 식별했고, 그 다음 PBI 부터는 사전에 차단한다" 의 연속성을 만든다.
>
> 각 항목: ID / 한 줄 요약 / 발견 경로 / 영향 / 대응 패턴

## L-01 — `@Builder` 에 `id` 가 빠진 엔티티는 단위 테스트 stub 생성 시 ReflectionTestUtils 필요

- **발견 경로**: PBI-11 `DailyWordServiceTest` 작성 시
- **영향**: Mockito stub 으로 `Word` 객체를 만들 때 `Word.builder().build()` 만으로는 `id == null`. JPA 매핑 표준 패턴이라 한국어 / Lombok 가이드에는 잘 안 적혀 있음. AI 가 "테스트에서 id 를 직접 setter 로 넣어라" 같은 잘못된 제안을 하기 쉬움 (PROTECTED setter 없음).
- **대응 패턴**: `org.springframework.test.util.ReflectionTestUtils.setField(entity, "id", value)`. 본 코드베이스 표준.

## L-02 — `wordsApi` / `missionsApi` 같은 프론트 API 모듈은 PBI 별로 인접 PR 이 먼저 머지되며 메서드가 누적될 수 있음

- **발견 경로**: PBI-11 프론트 작업 시작 직전, `frontend/src/api/words.js` 가 이미 `daily()` 를 노출하고 있어 신규 추가 불요
- **영향**: AI 가 "신규 메서드 추가" 라는 의도된 단계를 그대로 수행하면 동일 함수가 두 번 정의되거나 기존 정의를 덮어쓸 수 있음.
- **대응 패턴**: 프론트 작업 시작 전 `frontend/src/api/{domain}.js` 의 export 객체를 먼저 grep 으로 확인. 본 카탈로그를 다음 PBI 의 2-A 사전 시나리오에 인입.

## L-03 — 본 머신(한국어 OneDrive 경로 + Windows + bash via Git-Bash) 환경에서 Gradle test worker 가 `ClassNotFoundException` 으로 모든 테스트를 실행 불가

- **발견 경로**: PBI-11 `./gradlew test --tests DailyWordServiceTest` 시도
- **영향**: 본 머신에서는 단위 테스트 실행 자체가 불가능. 컴파일·bootJar 패키징은 정상. CI 또는 학생 노트북의 윈도우 PowerShell 환경에서 별도 검증 필요.
- **대응 패턴**: 작업 시 `./gradlew compileTestJava` 까지로 검증을 줄이고, prompt log 의 §5 검증 결과 표에 환경 한계로 명시. 학생 환경에서 별도 검증 후 결과 추가.

## L-04 — `vite build` 가 본 셸에서 715 모듈 transform 후 비정상 종료 (exit 9)

- **발견 경로**: PBI-11 `npm run build`
- **영향**: dist 가 갱신되지 않으나 모듈 해석은 모두 성공 (vite 의 transforming 단계 통과). lint 는 정상 종료. 본 PBI 의 신규 파일에 lint 위반 0건.
- **대응 패턴**: `npm run lint` 결과로 import 그래프의 유효성은 확인 가능. 실제 dist 패키징은 학생 환경 또는 CI 에서 별도 검증.

## L-06 — AC 한 줄의 비즈니스 의미가 사용자 직관과 어긋날 때, AI 는 학생의 첫 결정을 그대로 따른다 + 정의 변경이 인접 PBI 로 전파되어야 함을 감지하지 못한다

- **발견 경로**: PBI-12 머지 직전 학생이 "STUDY_WORDS 는 언제 충족되는가" 를 재확인한 시점 + B-옵션 전환 후 PBI-11/12 통합 점검 시점
- **영향**:
  1. U-20 의 AC "단어 20개 학습" 은 자연어이며 정의가 명세에 없다. 학생이 사전에 결정한 정의("오늘 응시 퀴즈의 distinct word")를 AI 가 그대로 코드로 구현했으나, 실제 사용자 입장에서는 (a) TAKE_QUIZ 미션과 트리거가 동일, (b) 단어 학습 페이지 클릭이 카운트 안 됨, (c) 표준 퀴즈 한 번이면 자동 만점이라는 세 가지 라벨-동작 불일치가 발견됐다.
  2. PBI-12 의 STUDY_WORDS 가 B-옵션으로 전환되어 "학습" 의 정의가 `word_study_events` 로 바뀌었으나, **AI 는 같은 어휘로 정의되어야 할 PBI-11 의 "학습 이력 적은 단어 우선" 추천 알고리즘이 여전히 `quiz_result_details` 기반인 점을 자발적으로 지적하지 않았다.** 즉 단일 도메인 용어("학습")의 정의 변경이 인접 PBI 로 전파되어야 함을 AI 가 감지하지 못했다.
- **대응 패턴**:
  - AC 가 자연어 한 줄로 표현된 미션·진척률·점수 등 **"학습 도메인의 정의 모호함"** 영역에서는 v1 프롬프트 본문에 "이 정의가 사용자 직관과 어긋나지 않는지 두세 가지 사용 시나리오를 작성한 뒤 다시 검증할 것" 을 의무화한다.
  - **도메인 용어의 정의를 변경할 때는 같은 용어를 쓰는 인접 PBI/엔드포인트/쿼리를 grep 으로 전수 확인하고 동기 변경 여부를 결정** 한다. 본 카탈로그 항목을 다음 PBI 의 2-A 사전 시나리오에 직접 인용.
- **본 PBI 의 교정**:
  - PBI-12: STUDY_WORDS 의 카운트 소스를 `word_study_events` 테이블로 전환 (B-옵션). `POST /api/words/{id}/view` 신규 엔드포인트 + 단어 상세·플래시카드에서 호출. 자세한 내용은 `prompts/logs/PBI-12_daily_mission.md` §6-B 참조.
  - PBI-11: `WordRepository.findDailyCandidates` 의 LEFT JOIN 소스를 `quiz_result_details` → `word_study_events` 로 통일. `prompts/logs/PBI-11_daily_words.md` §6-B 참조.

## L-05 — Lombok `@Getter` 가 `Boolean` 래퍼 필드에 대해 생성하는 `getXxx()` 의 null 가능성

- **발견 경로**: PBI-12 `MissionService.todayMission` 작성 시 `mission.getAttendanceGranted()` 의 null 가드 필요성 검토
- **영향**: DailyMission 엔티티는 `@Builder` 안에서 `attendanceGranted = false` 로 초기화하므로 실제 NPE 가능성은 낮지만, 새 엔티티를 reflection 으로 stub 하거나 DB 마이그레이션 도중 nullable 컬럼이 잠시 존재할 수 있는 상황에서 위험. `if (mission.getAttendanceGranted())` 같은 직접 boolean 캐스팅이 NPE 를 발생시킬 수 있다. AI 가 즉시 풀어쓸 때 이 가드를 빠뜨리기 쉬움.
- **대응 패턴**: `Boolean.FALSE.equals(mission.getAttendanceGranted())` 또는 `Optional.ofNullable(...).orElse(false)` 로 null-safe 비교. 본 패턴을 PBI-13 이후 prompt log 의 2-A 사전 시나리오에 포함.
