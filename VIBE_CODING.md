# 어흥해보카 — Vibe Coding 프롬프트 가이드

> 본 문서는 **프로젝트 계획서 v0.9**의 *5-Layer Prompt Framework* 를 그대로 따른다.
> 매 코딩 시작 전 Claude에게 이 파일을 첨부하면 Layer 1·2·4 (Role / Context / Constraint)는 자동 적용됨.
> 학생은 **Layer 3 (Task)** 와 **Layer 5 (Output)** 만 채우면 된다.
>
> Vibe Coding Loop: **Prompting → Generation → Examining → Refining**

---

## 0. 사용법

매 작업마다 아래 한 줄로 시작:

```
@VIBE_CODING.md 기준. 아래 작업 부탁해.

[Layer 3 - Task]
(이번에 만들 기능 1개를 구체적으로)

[Layer 5 - Output]
(원하는 출력 형식 — 안 적으면 기본값으로)
```

> 1 프롬프트 = 1 작업. 여러 기능을 한 번에 요청하지 말 것 (계획서 Layer 3 원칙).

---

## 1. Layer 1 — Role (고정)

> 너는 **Spring Boot 3.5 + Java 17 백엔드 시니어 개발자** 이자, **React 19 + Vite 프론트엔드 개발자** 다.
> Vibe Coding 보조자로서 어흥해보카 팀(SMU 소공 5조)의 코드 컨벤션과 기술 스택을 따른다.
> 코드 생성 후에는 학생(이경진)이 Examining → Refining 할 수 있도록 **검토 포인트와 검증 방법**을 함께 제시한다.

---

## 2. Layer 2 — Context (고정)

### 2.1 프로젝트
- **이름**: 어흥해보카 (Uhheung-voca)
- **목적**: 대학생을 위한 TOEIC 영단어 학습 Web App
- **팀**: 상명대 소프트웨어공학 5조 (김현서·정다겸·김지우·이경진)
- **개발 방식**: Hybrid Scrum + Vibe Coding

### 2.2 기술 스택
| 영역 | 기술 |
|---|---|
| Backend | Spring Boot 3.5, Java 17, Spring Data JPA, Spring Security + JWT (jjwt 0.12.6), Validation, Actuator, Lombok, DevTools |
| Frontend | React 19 + Vite, Styled Components, Recharts, Axios, React Router |
| DB | MySQL 8.0 (각자 로컬), Flyway 마이그레이션 |
| 발음 | Web Speech API (브라우저 내장) |
| 인증 | JWT (Role: ADMIN / USER) |
| 배포 | Vercel (FE) + Railway (BE) — 예정 |

> ⚠️ Spring Boot는 계획서에 3.4로 적혔으나 Initializr가 3.4를 더 이상 제공 안 해 **3.5.0**으로 시작함. 동작 동일.

### 2.3 디렉토리
```
Uhheung-voca/
├── backend/                        # Spring Boot (Gradle)
│   └── src/main/resources/
│       ├── application*.yml
│       └── db/migration/V*.sql     # Flyway
└── frontend/                       # React + Vite
```

### 2.4 주요 DB 테이블 (계획서 기준 초안)
```
users         : id, username, password, role(ADMIN/USER), created_at
words         : id, english, meaning, type(LC/RC)
quiz_results  : id, user_id, word_id, is_correct, quiz_date
bookmarks     : user_id, word_id (다대다)
attendance    : id, user_id, attend_date
```
> 실제 스키마는 `backend/src/main/resources/db/migration/V*.sql` 가 SoT(Source of Truth). 변경 시 새 V 파일 추가.

### 2.5 Flyway 운영 규칙
- DB 변경은 **반드시 새 마이그레이션** (`V{다음번호}__{설명}.sql`)
- **이미 머지된 V*.sql은 절대 수정 금지** (체크섬 깨짐 → 부팅 실패)
- JPA `ddl-auto = validate` (Flyway가 스키마, JPA는 매핑 검증만)

---

## 3. Layer 3 — Task (매번 학생이 채움)

> 한 프롬프트에 **기능 1개**만. 여러 개면 분리해서 요청.

작성 시 포함할 것:
- 무엇을 만들/고칠 것인지 한 문장
- API라면: 메서드 + 경로 + 요청 + 응답 + 에러 코드
- UI라면: 라우트 + 표시 데이터 + 사용자 동작
- DB 영향: 있으면 새 V*.sql 추가 명시

### 빈 템플릿 (복붙용)
```
[Layer 3 - Task]
- 기능:
- 위치: backend / frontend / 양쪽
- 상세:
  - (메서드/경로 또는 라우트)
  - (요청/입력)
  - (응답/출력)
  - (에러/예외 케이스)
- DB 변경: 있음(새 V*.sql 추가) / 없음
- 완료 조건: (어떻게 동작 확인할지)
```

---

## 4. Layer 4 — Constraint (고정)

### 4.1 코드 구조 / 컨벤션
- **Backend**: `Controller → Service → Repository` 3계층. 요청/응답은 **DTO**로(Entity 직접 노출 금지). Lombok 사용 가능 (`@Getter`, `@Builder`, `@RequiredArgsConstructor`).
- **Frontend**: 함수형 컴포넌트 + Hooks. Styled Components로 스타일링. API 호출은 Axios.
- **네이밍**: Java `camelCase` / 클래스 `PascalCase`, SQL 테이블·컬럼 `snake_case`.
- **주석**: 의도(Why)가 비자명할 때만. 코드가 자체 설명되면 생략.

### 4.2 보안 / 비밀
- 비밀정보(JWT secret, DB password)는 **코드/커밋 절대 금지**. `application-local.yml` (gitignore됨)에만.
- 비밀번호는 **BCrypt** 암호화. 평문 저장 금지.

### 4.3 Git / 협업
- 브랜치: `main` (배포) / `develop` (통합) / `feature/{기능}` (작업)
- 커밋: `유형: 한국어 설명`
  - `feat:` / `fix:` / `docs:` / `style:` / `refactor:` / `test:` / `chore:`
- PR 제목: `이름-기능명-구현 진행도-PR 사유`
- 머지된 마이그레이션 / 공유 코드는 임의 변경 금지.

### 4.4 Vibe Coding 규칙 (계획서)
- AI 생성 코드는 **반드시 학생이 Examining 후 반영**.
- **비즈니스 로직 / 보안 관련 코드는 학생이 직접 검증**.
- 한 번에 한 작업. 결과 검토 가능한 단위로 분리.

### 4.5 안 해도 되는 것 (요청 없이 추가하지 말 것)
- 과도한 추상화 / 미래 확장 포인트
- 일어나지 않을 시나리오의 방어 코드
- 사용 안 하는 import / 변수
- 요청하지 않은 리팩토링·문서 파일 생성

---

## 5. Layer 5 — Output (매번 학생이 채움, 기본값 있음)

### 5.1 기본값 (별도로 안 적으면 이렇게)
- **파일별로 나눠서** 보여줄 것.
- 각 메서드에 **한 줄 주석**.
- 변경 요약 (어떤 파일이 어떻게 변했는지) 1~3줄.
- **검증 방법**: backend는 `curl` 명령, frontend는 클릭 경로.
- 응답 본문은 **한국어**, 코드 내 주석/식별자는 **영어**.

### 5.2 빈 템플릿 (필요할 때만 다르게 지정)
```
[Layer 5 - Output]
- 출력 단위: 파일별 / diff 형식 / 단일 블록
- 주석 수준: 메서드당 1줄 / 핵심 로직만 / 없음
- 추가 산출물: curl 예시 / 테스트 코드 / 없음
```

---

## 6. 실제 적용 예시 — "회원가입 API" (계획서 그대로)

```
[Layer 1 - Role]  ← VIBE_CODING.md로 자동 적용
[Layer 2 - Context] ← VIBE_CODING.md로 자동 적용

[Layer 3 - Task]
회원가입 API를 만들어줘.
- POST /api/auth/signup
- 요청: { username: String, password: String }
- 비밀번호는 BCrypt로 암호화
- 중복 username이면 409 에러
- 성공하면 201 응답

[Layer 4 - Constraint] ← VIBE_CODING.md로 자동 적용
(추가 제약 있을 때만 여기에 덧붙임)

[Layer 5 - Output]
파일별로 나눠서 보여주고, 각 메서드에 한 줄 주석 달아줘.
```

---

## 7. 메타 프롬프트 (Layer 채우기 막힐 때)

5-Layer 채우는 게 어려우면, AI에게 프롬프트 자체를 작성해 달라고 한다.

```
@VIBE_CODING.md 기준.
나 [기능명] 을 만들어야 해. 어떻게 5-Layer로 적어야 할지 모르겠어.
Layer 3과 Layer 5 초안을 만들어줘. 빈 항목은 내가 채울 수 있게 [TODO] 표시로.
```

---

## 8. Examining 단계 체크리스트 (Claude가 코드 만든 후, 학생이 본다)

머지 전에 학생이 직접 확인:
- [ ] 빌드 / 컴파일 통과? (`./gradlew build`, `npm run build`)
- [ ] 의도한 입력/출력대로 호출해서 동작 확인했나?
- [ ] DB 변경 시 새 V*.sql 추가됐고 부팅 시 적용되나?
- [ ] 기존 기능 회귀 없나?
- [ ] 비밀정보 코드 박힘 없나?
- [ ] 커밋 메시지 컨벤션(`유형:`)대로?
- [ ] **비즈니스 로직 / 보안 부분 직접 읽고 이해했나?** (계획서 명시 원칙)

---

## 9. Refining — 마음에 안 들 때 어떻게 다시 요청할까

막연한 "다시" 대신:
- **방향 수정**: "이 부분은 [이유]로 [다른 방식]으로 바꿔줘"
- **부분 수정**: "[파일:라인] 의 [무엇]만 [어떻게] 고쳐, 나머지 유지"
- **단순화**: "너무 추상적이야. [구체 케이스]만 처리하는 단순한 형태로"
- **컨벤션 위반 지적**: "[Layer 4의 어떤 규칙] 위반이야"

---

## 10. Notion Prompt 아카이브 (계획서 권장 — 학생 사후 기록용)

성공/실패한 프롬프트는 Notion에 아래 양식으로 남긴다.

| 항목 | 내용 |
|---|---|
| 작성자 | (이름) |
| 날짜 | (날짜) |
| 기능 | (예: 회원가입 API) |
| 사용한 프롬프트 | (전문 붙여넣기) |
| 결과 | 성공 / 부분 성공 / 실패 |
| 수정한 부분 | (AI 코드에서 직접 고친 내용) |
| 배운 점 | (예: "DTO 빠뜨리면 Entity가 직접 노출됨") |

> 과제 3 (MVP 개발 보고서)에 **prompting 어떻게 했고 어떤 구조 썼는지** 들어가야 함 → 이 아카이브가 그 근거가 됨.

---

## 11. 이 파일 갱신 규칙

- 새 컨벤션 / DB 테이블 추가 → 2번·4번 갱신
- 새로운 자주 쓰는 작업 패턴 → 6번 또는 7번에 예시 추가
- 한 번 정한 규칙이 깨지면 즉시 수정
