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
