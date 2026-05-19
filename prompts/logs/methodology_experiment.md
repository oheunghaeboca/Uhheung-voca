# Vibe Coding 방법론 시범 운영 기록

> 본 노트는 PBI-11/12 두 PBI 에 한해 prompt log 의 운영 방식을 일부 강화한 결과를 정량·정성적으로 누적한다.
> 다른 PBI 의 prompt log 형식 자체는 변경하지 않는다 (팀원 산출물과의 외형 일관성 우선).

## 1. 배경

학생(이경진) 단독 담당의 Sprint 3 두 PBI 작업 시작 시점(2026-05-20)에, "여러 산출물·프롬프팅 보완 과정·피드백" 의 질을 한 단계 끌어올리기 위한 시범 운영을 결정했다. 결정의 입력은 다음 5인의 공개 방법론을 합성한 결과:

| 출처 | 차용한 요소 |
| --- | --- |
| Andrej Karpathy — vibe coding → agentic engineering 진화론 | judgment 의 명시화 (위임 vs 직접 영역 분리) |
| Simon Willison — Agentic Engineering Patterns | test-as-feedback (단위 테스트가 한계 노출의 1차 신호) |
| Steve Yegge — CHOP (chat-oriented programming) | v0→v0.5→v1 반복 정제 사이클의 가시화 |
| Geoffrey Litt — "code like a surgeon" | 핵심 invariant 는 학생이 직접, 잡일은 AI 위임 |
| Harper Reed — 3-step LLM codegen workflow (spec / plan / execute) | spec 단계의 정책 P1~Pn 사전 명시 |

## 2. 시범 운영 형태

PBI-08, PBI-09 의 단일 `prompts/logs/PBI-NN_*.md` 형식을 그대로 유지하고, 다음 **3개 절** 만 기존 섹션 안에 하위 절로 추가:

- 2-A: 정책 P1~Pn + AI 한계 사전 시나리오 (구현 전)
- 2-B: 위임 vs 직접 코딩 영역 표 (구현 전)
- 6-A: 한계 식별 → 교정 매핑 (구현 후)

다른 팀원이 본 로그를 열어도 7개 섹션 외형은 동일. 추가 절의 도입 이유는 본문 상단 노트 박스에 한 문단으로 명시.

## 3. 관측 지표 — PBI-11 (`feat/pbi-11-daily-words`)

| 지표 | 값 | 비고 |
| --- | --- | --- |
| Prompt 버전 수 (v0→v1 도달) | 3 (v0 / v0.5 / v1) | spec-driven 워크플로의 기본 단위. PBI-08 의 단일 v1 대비 +2회. |
| 사전 시나리오 등록 수 (2-A 표) | 5 (P1~P5) + 7 (위험 카탈로그) | F절 7개 위험 시나리오 중 본 PBI 와 무관한 2건은 PBI-12 로 이관. |
| 사전 시나리오 중 AI 가 실제 빠진 함정 수 | 0 / 5 | v1 본문에 명시한 결과 모두 사전 차단. "사전 노출의 효과" 의 1차 증거. |
| 사전 시나리오 외 신규 한계 발견 수 | 2 | (a) `Word.@Builder` 가 `id` 비포함 — 테스트 작성 시 발견 (b) `wordsApi.daily()` 가 develop 에 이미 존재 — 프론트 시작 시 발견 |
| 직접 코딩 영역 (Litt) | 2 영역 | `DailyWordService.recommend` (멱등성 핵심), 단위 테스트 |
| AI 위임 영역 (Litt) | 4 영역 | DTO 골격, native query 초안, 컨트롤러 핸들러, 프론트 카드 레이아웃 |
| Refining 횟수 | 0 (v1 1회 통과) | 사전 시나리오를 본문에 못박은 직접 효과 — 평가축 ② 의 강력한 증거. |
| 빌드 검증 | ✅ jar / ⚠️ test worker / ⚠️ vite build | 환경 한계 2건은 `prompts/logs/PBI-11_daily_words.md` §5 에 명시 |
| 신규 산출물 수 | 6 파일 | DTO, Service, Test, FE component, Repo 메서드, Controller 핸들러 (수정 2건은 별도) |
| PR 머지까지 시간 | 미머지 (학생 승인 대기) | |

## 4. 결과 해석 — PBI-11 단독

### 가치 있었던 산출물
- **2-A 사전 시나리오 표**: Refining 0회로 v1 통과의 직접 원인. 평가 보고서 인용 시 "사전 노출 5건 / 실제 사후 함정 0건 = 한계 식별이 사전 단계에서 끝남" 으로 명확.
- **6-A 한계-교정 매핑**: 사후 정리가 아닌 사전 노출 결과의 "결과 테이블" 로 기능. 평가축 ② 의 직접 증거.

### Over-engineering 여지
- **2-B 위임 vs 직접 표**: PBI-11 처럼 단일 알고리즘 중심 PBI 에서는 표 한 줄짜리가 6행으로 늘어나며 약간 과해 보임. PBI-12 처럼 다중 도메인(미션 + 출석 + 동시성) PBI 에서 더 가치가 있을 것으로 예상 — PBI-12 마무리 후 재평가.

### 다른 팀원 외형 보존
- 단일 파일 + 7개 섹션 골격 유지로 PBI-08/09 와 외형 동일. 새 절 3개는 모두 기존 섹션 안에 들여쓰기 된 하위 절이라 깊이만 한 단계 늘어남.

## 5. 다음 적용 권고 (PBI-12 작업 전 결정)

- 2-A / 6-A 는 그대로 유지.
- 2-B 는 PBI-12 에서 다시 채우되, 1~3행으로 압축 시도. 자연스레 1행으로 줄어들면 다음 PBI 부터 절 자체를 제거.
- 새 한계 (Word.@Builder, 기존 daily() 중복) 같은 발견은 `prompts/ai_limitations_catalog.md` 에 누적 → 다음 PBI 의 2-A 사전 시나리오에 자동 인입.

## 6. PBI-12 항목

(PBI-12 머지 후 §3 동일 표 추가, §4 해석 추가, §7 종합 결론 절 작성 예정)
