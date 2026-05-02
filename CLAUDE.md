# 어흥해보카 — 공통 컨텍스트 (루트)

> **이 파일은 Claude Code가 자동 로드한다.** 다른 AI 도구(Cursor, ChatGPT, Gemini)를 쓰는 팀원은 `VIBE_CODING.md`를 직접 첨부하면 된다.
>
> **이 파일에 무엇을 담나**: 백엔드/프론트엔드에 **공통**으로 적용되는 5-Layer 운영 지침과 협업 규칙.
> **백엔드 전용은 `backend/CLAUDE.md`, 프론트 전용은 `frontend/CLAUDE.md`에 둔다.** 갱신 시 위치 헷갈리지 말 것.

---

## 1. 프롬프트 구조 — 5-Layer Prompt Framework

본 프로젝트는 모든 Vibe Coding 요청에서 **5-Layer Prompt Framework**(프로젝트 계획서 v0.9)를 따른다. 매 요청을 받을 때 자동 적용:

1. **Role**: Spring Boot 3.5 + Java 17 백엔드 시니어 / React 19 프론트엔드 개발자
2. **Context**: 본 파일 + 폴더별 `CLAUDE.md`(자동 병합)
3. **Task**: 학생이 매 요청마다 채움 (1 프롬프트 = 1 기능)
4. **Constraint**: 본 파일 + 폴더별 `CLAUDE.md`
5. **Output**: 별도 지정 없으면 → 파일별 분리, 메서드당 한 줄 주석, 변경 요약, 검증 방법(curl/클릭 경로) 포함, 응답은 한국어

> 전체 가이드와 빈 템플릿: 같은 폴더의 [`VIBE_CODING.md`](./VIBE_CODING.md)

---

## 2. 공통 프로젝트 정보

- **이름**: 어흥해보카 (Uhheung-voca) — 대학생용 TOEIC 영단어 학습 Web App
- **팀**: SMU 소공 5조 (김현서·정다겸·김지우·이경진)
- **개발 방식**: Hybrid Scrum + Vibe Coding
- **Loop**: Prompting → Generation → Examining → Refining

### 2.1 디렉토리
```
Uhheung-voca/
├── VIBE_CODING.md          # 도구 중립 원본 (갱신 시 여기부터)
├── CLAUDE.md               # 이 파일 (공통)
├── backend/
│   ├── CLAUDE.md           # 백엔드 전용 컨텍스트
│   └── src/main/...
└── frontend/
    ├── CLAUDE.md           # 프론트 전용 컨텍스트
    └── src/...
```

### 2.2 작업 경로
- 백엔드 작업 → 백엔드 폴더에서 시작 → `루트 CLAUDE.md` + `backend/CLAUDE.md` 자동 병합
- 프론트 작업 → 프론트 폴더에서 시작 → `루트 CLAUDE.md` + `frontend/CLAUDE.md` 자동 병합
- 양쪽 동시 → 루트에서 시작 → 루트 + 둘 다 또는 필요 폴더 직접 명시

---

## 3. 공통 협업 규칙

### 3.1 Git
- 브랜치: `main` (배포) / `develop` (통합) / `feature/{기능명}` (작업)
- PR 제목: `이름-기능명-구현 진행도-PR 사유`
- 머지 전 최소 1명 리뷰
- `develop` 직접 푸시 금지
- **원격 푸시 / PR 생성 / 강제 푸시 모두 학생(이경진) 명시적 승인 후에만**. AI는 로컬 commit은 진행해도 되지만 `git push`·`gh pr create` 등 원격 송출은 항상 허락을 받는다. (자세한 규약은 [`VIBE_CODING.md`](./VIBE_CODING.md) 4.3절)

### 3.2 커밋 메시지 (한국어 본문)
- `feat:` 새 기능 / `fix:` 버그 / `docs:` 문서 / `style:` 포맷 / `refactor:` 리팩토링 / `test:` 테스트 / `chore:` 빌드·설정

### 3.3 비밀정보
- JWT secret, DB 비밀번호 등은 **절대 커밋 금지**
- 백엔드: `application-local.yml` (`.gitignore` 대상)
- 프론트: `.env.local` (`.gitignore` 대상)

### 3.4 Vibe Coding 원칙 (계획서 명시)
- AI 생성 코드는 **반드시 학생이 Examining 후 반영**
- **비즈니스 로직 / 보안 코드는 학생이 직접 검증**
- 1 프롬프트 = 1 작업. 결과 검토 가능한 단위로 분리

---

## 4. 공통 코드 컨벤션

- **주석**: 의도(Why)가 비자명할 때만. 자체 설명되는 코드엔 생략.
- **응답 본문**: 한국어. **코드 주석/식별자**: 영어.
- **요청 없는 추가 작업 금지**: 미래 확장 포인트, 과한 추상화, 불필요한 방어 코드, 사용 안 하는 import/변수, 요청 안 한 리팩토링·문서 생성 모두 X.

---

## 5. Examining 체크리스트 (코드 받고 머지 전)

- [ ] 빌드 통과 (`./gradlew build` / `npm run build`)
- [ ] 의도한 입력·출력대로 동작 확인 (curl / 브라우저)
- [ ] 회귀 없음
- [ ] 비밀정보 코드에 박힘 없음
- [ ] 커밋 메시지 컨벤션 준수
- [ ] **비즈니스 로직 / 보안 부분 직접 읽고 이해**

---

## 6. 갱신 책임

| 무엇이 바뀌면 | 어디를 수정 |
|---|---|
| 5-Layer 자체, 공통 협업 규칙, 공통 컨벤션 | `VIBE_CODING.md` + 본 파일 |
| 백엔드 스택·구조·DB·검증 방법 | `backend/CLAUDE.md` |
| 프론트 스택·구조·라우팅·검증 방법 | `frontend/CLAUDE.md` |
| 신규 자주 쓰는 작업 패턴(예시) | `VIBE_CODING.md` |

> **원본은 `VIBE_CODING.md`**. CLAUDE.md들은 그 운영 사본 + 폴더별 특화로 본다.
