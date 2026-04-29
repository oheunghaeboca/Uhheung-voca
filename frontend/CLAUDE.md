# 어흥해보카 — Frontend 전용 컨텍스트

> 본 파일은 프론트엔드 폴더에서 Claude Code 실행 시 **루트 `CLAUDE.md` 와 자동 병합** 된다.
> **공통(5-Layer, 협업·커밋·비밀정보 규칙 등)은 루트 [`../CLAUDE.md`](../CLAUDE.md) 와 [`../VIBE_CODING.md`](../VIBE_CODING.md) 에 있음.** 본 파일에는 **프론트 전용 Layer 2 (Context) 와 Layer 4 (Constraint)** 만 둔다.
>
> 갱신 시: 프론트만 해당하면 본 파일, 공통이면 루트 파일들.

---

## 1. Layer 2 — Frontend Context

### 1.1 스택 / 버전 (`package.json` 기준)
- **React 19.2** + **Vite 8.0**
- **React Router DOM 7.14** — 라우팅
- **Styled Components 6.4** — 스타일링
- **Recharts 3.8** — 대시보드 그래프 (정답률·출석)
- **Axios 1.15** — 백엔드 API 호출
- **Web Speech API** (브라우저 내장) — 단어 발음 (us/au/gb accent 지원)
- **ESLint 10** + react-hooks/react-refresh 플러그인 — 린트
- **빌드/실행**: `npm run dev` / `npm run build` / `npm run preview` / `npm run lint`

### 1.2 디렉토리 (현 상태는 스켈레톤)
```
frontend/
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
├── public/
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── App.css
    ├── index.css
    └── assets/
```

### 1.3 신규 코드 둘 위치 (생성 시 권장 구조)
| 종류 | 경로 |
|---|---|
| 페이지 컴포넌트 | `src/pages/{도메인}/{Page}.jsx` |
| 재사용 컴포넌트 | `src/components/{도메인}/{Component}.jsx` |
| API 클라이언트 (axios) | `src/api/{도메인}.js` 또는 `src/api/client.js`(공용 인스턴스) |
| 라우터 정의 | `src/router/index.jsx` 또는 `App.jsx` |
| 커스텀 훅 | `src/hooks/use{Name}.js` |
| 컨텍스트 (Auth 등) | `src/contexts/{Name}Context.jsx` |
| 유틸 | `src/utils/{name}.js` |
| 테마/공통 스타일 | `src/styles/` |

> 도메인 예: `auth`, `word`, `quiz`, `bookmark`, `dashboard`, `ranking`.

### 1.4 환경 변수
- `.env.local` (gitignore됨) — 백엔드 URL 등 개인 설정.
- 예시 키: `VITE_API_BASE_URL=http://localhost:8080`
- Vite 규칙: 클라이언트 노출 변수는 **반드시 `VITE_` 접두사**.

---

## 2. Layer 4 — Frontend Constraint

### 2.1 컴포넌트 / Hooks
- **함수형 컴포넌트 + React Hooks** 만 사용. Class component 금지.
- 상태 끌어올림은 적절히, **무분별한 전역 상태 라이브러리 도입 금지** (현재 의존성에 Redux/Zustand 없음). 인증·전역 정보만 Context로.
- 사이드 이펙트는 `useEffect`. 데이터 fetching은 컴포넌트 마운트 시 axios 호출 → 로딩/에러/성공 상태 관리.

### 2.2 스타일링
- **Styled Components** 일관 사용 — 컴포넌트 단위 스타일 격리.
- 인라인 `style={{...}}` 는 동적 한 줄짜리에만. 정적 스타일은 styled로.
- Tailwind / 일반 CSS 클래스 도입 금지 (계획서: 컴포넌트 격리 / 충돌 방지 목적).

### 2.3 API 호출
- **Axios 단일 인스턴스 (`src/api/client.js`)** 권장 — `baseURL = VITE_API_BASE_URL`, JWT 인터셉터 (`Authorization: Bearer ...`) 한 곳에 묶기.
- API 호출은 `src/api/{도메인}.js` 모듈 함수로 추상화. 페이지 컴포넌트가 axios를 직접 import 하지 않도록.
- 401 응답 시 토큰 만료 처리 → 로그인 페이지로 리다이렉트 (인터셉터에서).

### 2.4 라우팅
- **React Router DOM v7** — `createBrowserRouter` 또는 `<BrowserRouter>` 한 곳에서 정의.
- 인증 필요 라우트는 `<ProtectedRoute>` 패턴(Auth 컨텍스트로 토큰 확인).

### 2.5 네이밍
- 컴포넌트 파일/식별자: `PascalCase` (예: `WordList.jsx`).
- 훅: `useXxx` (camelCase, `use` 접두사).
- 일반 함수/변수: `camelCase`.
- 폴더: `camelCase` 또는 도메인명 `lowercase` (혼용 X — 한 프로젝트에서 통일).

### 2.6 폼 / 검증
- 가능하면 표준 input + 자체 검증으로 시작 (의존성 추가 신중).
- 필요해지면 그때 라이브러리 도입 논의 — **요청 없이 react-hook-form/yup 등 추가 금지**.

### 2.7 ESLint
- `npm run lint` 통과 필수. 경고도 가능한 한 0.
- `react-hooks/exhaustive-deps` 무시 금지 (의존성 배열 정확히).

---

## 3. Frontend 검증 방법 (Output Layer 기본값)

코드 생성 후 검증 안내에 다음을 기본으로 포함:

```bash
# 의존성 (최초 1회)
npm install

# 개발 서버 (기본 포트 5173)
npm run dev
# 브라우저에서 http://localhost:5173 → 라우트 진입 → 사용자 동작 확인

# 빌드 검증
npm run build

# 린트
npm run lint
```

UI 동작 확인 안내는 **클릭 경로 또는 입력값 → 기대 화면**으로 구체적으로 적을 것
(예: "/login 진입 → username/password 입력 → 로그인 클릭 → /dashboard 로 이동").

> 백엔드 연동 작업이면 사전에 `backend/`에서 `./gradlew bootRun` 띄워야 함을 안내.

---

## 4. Frontend 작업 시작 프롬프트 단축형

```
[Layer 3 - Task]
- 화면 / 컴포넌트 명:
- 라우트:
- 표시 데이터:
- 호출할 API: (메서드 + 경로 + 응답 DTO)
- 사용자 동작: (클릭/입력 → 결과)
- 인증: 필요 / 불필요
- 신규 의존성: 없음 / 있음(이유 명시)

[Layer 5 - Output]
파일별 분리 + 컴포넌트 한 줄 설명 주석 + 클릭 경로 검증 안내.
```
