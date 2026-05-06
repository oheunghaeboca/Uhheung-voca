# 어흥해보카 — Frontend Component Tree

- **버전**: v1.0
- **작성일**: 2026-04-30
- **목적**: React 컴포넌트 계층을 못 박아 LLM이 비슷한 컴포넌트를 중복 생성하지 않게 한다.
- **참조**: `frontend/CLAUDE.md`, `산출물/1_설계/Wireframes.md`, `산출물/1_설계/User_Stories.md`

> **재사용 원칙**: 새 컴포넌트 만들기 전에 본 트리에서 검색. 80% 비슷하면 props 추가로 확장, 50% 미만이면 신규 컴포넌트.

---

## 1번. 전체 트리 (라우트 단위)

```
<App>
└─ <BrowserRouter>
   └─ <Routes>
      ├─ /login        → <LoginPage>
      ├─ /signup       → <SignupPage>
      └─ <ProtectedRoute>            ← AuthContext.user 검사
         └─ <AppLayout>              ← Header / Footer 공통
            ├─ /dashboard  → <DashboardPage>
            ├─ /words      → <WordListPage>
            ├─ /words/:id  → <WordDetailPage>
            ├─ /quiz       → <QuizPage>
            │     ├─ <QuizStartModal>      (mode: 'start')
            │     ├─ <QuizPlayView>        (mode: 'play')
            │     └─ <QuizResultView>      (mode: 'result')
            ├─ /quiz/results       → <QuizResultListPage>
            ├─ /quiz/results/:id   → <QuizResultDetailPage>
            ├─ /bookmarks  → <BookmarkPage>
            ├─ /wrong-notes → <WrongNotePage>
            ├─ /stats      → <StatsPage>
            └─ /ranking    → <RankingPage>
```

---

## 2번. 공통 레이아웃 / 가드 컴포넌트

| 컴포넌트 | 경로 | 역할 |
|---|---|---|
| `<App>` | `src/App.jsx` | 최상위 — Router + Theme + Auth Provider |
| `<AppLayout>` | `src/components/layout/AppLayout.jsx` | Header/Footer 감싸기, `<Outlet>` |
| `<Header>` | `src/components/layout/Header.jsx` | 로고, 네비, 사용자 메뉴 |
| `<Footer>` | `src/components/layout/Footer.jsx` | 카피라이트, 버전 |
| `<NavMenu>` | `src/components/layout/NavMenu.jsx` | 네비 항목 + active 표시 |
| `<UserMenu>` | `src/components/layout/UserMenu.jsx` | 닉네임 + 드롭다운 (내 정보/로그아웃) |
| `<ProtectedRoute>` | `src/components/auth/ProtectedRoute.jsx` | AuthContext 미인증 시 `/login` redirect |

---

## 3번. 페이지 컴포넌트 (Pages)

| 페이지 | 경로 | 사용 컴포넌트 | 호출 API |
|---|---|---|---|
| `<LoginPage>` | `src/pages/auth/LoginPage.jsx` | `<LoginForm>` | `POST /auth/login` |
| `<SignupPage>` | `src/pages/auth/SignupPage.jsx` | `<SignupForm>` | `POST /auth/signup` |
| `<DashboardPage>` | `src/pages/dashboard/DashboardPage.jsx` | `<GreetingHeader>`, `<TodayMissionCard>`, `<QuickAccessButtons>`, `<WeeklyScoreChart>`, `<MonthAttendanceGrid>` | `GET /auth/me`, `GET /missions/today`, `GET /dashboard`, `GET /dashboard/attendance` |
| `<WordListPage>` | `src/pages/word/WordListPage.jsx` | `<WordFilterBar>`, `<WordList>`, `<Pagination>` | `GET /words` |
| `<WordDetailPage>` | `src/pages/word/WordDetailPage.jsx` | `<WordDetailCard>`, `<PronounceButton>`, `<BookmarkToggle>` | `GET /words/{id}` |
| `<QuizPage>` | `src/pages/quiz/QuizPage.jsx` | `<QuizStartModal>`, `<QuizPlayView>`, `<QuizResultView>` | `POST /quiz/start`, `POST /quiz/submit` |
| `<QuizResultListPage>` | `src/pages/quiz/QuizResultListPage.jsx` | `<QuizResultRow>`, `<Pagination>` | `GET /quiz/results` |
| `<QuizResultDetailPage>` | `src/pages/quiz/QuizResultDetailPage.jsx` | `<QuizResultSummary>`, `<WrongAnswerList>` | `GET /quiz/results/{id}` |
| `<BookmarkPage>` | `src/pages/bookmark/BookmarkPage.jsx` | `<BookmarkList>`, `<BookmarkRow>` | `GET /bookmarks` |
| `<WrongNotePage>` | `src/pages/wrongnote/WrongNotePage.jsx` | `<WrongNoteList>`, `<RetestButton>` | `GET /wrong-notes`, `POST /wrong-notes/retest` |
| `<StatsPage>` | `src/pages/stats/StatsPage.jsx` | `<DashboardSummary>`, `<LevelProgressBars>`, `<WeeklyScoreChart>` | `GET /dashboard` |
| `<RankingPage>` | `src/pages/ranking/RankingPage.jsx` | `<RankingFilterBar>`, `<RankingList>` | `GET /ranking` |

---

## 4번. 재사용 컴포넌트 (Domain별)

### 4-1. Auth
- `<LoginForm>`
- `<SignupForm>`

### 4-2. Word
- `<WordFilterBar>` — level / type / keyword
- `<WordList>` — `<WordCard>` 매핑
- `<WordCard>` — 한 단어 카드 (영어/뜻/태그/북마크/발음)
- `<WordDetailCard>` — 상세 표시 (예문, 메타)
- `<PronounceButton>` — Web Speech API 래퍼
- `<BookmarkToggle>` — 별 아이콘 토글 (옵티미스틱)
- `<WordTag>` — `[ESSENTIAL]`, `[LC]` 등 작은 라벨

### 4-3. Quiz
- `<QuizStartModal>` — 유형/난이도/문제수 선택
- `<QuizPlayView>` — 현재 문제 + 보기 + 진행률
- `<QuizQuestion>` — 한 문제 표시
- `<QuizChoiceList>` — 보기 4개 (선택 상태 관리)
- `<QuizProgressBar>` — `current/total`
- `<QuizTimer>` — UX용 (제출에 포함 X)
- `<QuizResultView>` — 결과 요약 + 오답 리스트
- `<QuizResultSummary>` — 정답률, 출석 인정 여부
- `<QuizResultRow>` — 결과 목록의 한 행
- `<WrongAnswerList>` — 오답만 모아 표시

### 4-4. Bookmark / WrongNote
- `<BookmarkList>` — 북마크 목록 (Page 단)
- `<BookmarkRow>` — `<WordCard>`의 가벼운 변형 (해제 버튼)
- `<WrongNoteList>` — 오답노트
- `<RetestButton>` — 오답 기반 재테스트 시작

### 4-5. Dashboard / Stats
- `<GreetingHeader>` — "안녕하세요, {nickname}님 👋"
- `<TodayMissionCard>` — 미션 3개 + 진행률
- `<MissionRow>` — 한 미션 (체크박스 + 진행률 바)
- `<QuickAccessButtons>` — 빠른 진입 4개
- `<WeeklyScoreChart>` — Recharts LineChart
- `<MonthAttendanceGrid>` — 캘린더 그리드
- `<DashboardSummary>` — 종합 카드 (퀴즈/정답률/단어/출석)
- `<LevelProgressBars>` — 수준별 진척도 (BarChart 또는 progress bar)

### 4-6. Ranking
- `<RankingFilterBar>` — type / period 토글
- `<RankingList>` — `<RankingRow>` 매핑
- `<RankingRow>` — 1~3등 메달, 내 순위 강조

### 4-7. 공용 UI (UI Kit — `src/components/ui/`)
| 컴포넌트 | 용도 |
|---|---|
| `<Button>` | primary / secondary / ghost variant |
| `<Input>` | label, error, helper text |
| `<Modal>` | 오버레이 + 닫기 버튼 |
| `<Card>` | 둥근 박스, 그림자 (디자인 토큰 적용) |
| `<Pagination>` | 페이지 번호 + 이전/다음 |
| `<Spinner>` | 로딩 스피너 |
| `<Toast>` | 성공/에러 알림 (전역 Provider) |
| `<EmptyState>` | "아직 북마크가 없습니다" 같은 빈 화면 |
| `<ProgressBar>` | 진행률 바 |

> UI Kit는 디자인 토큰 (`STYLE_GUIDE.md`)을 직접 참조해야 함. 페이지·도메인 컴포넌트는 UI Kit를 조합해서 만들 것.

---

## 5번. Custom Hooks (`src/hooks/`)

| 훅 | 책임 |
|---|---|
| `useAuth()` | AuthContext 래퍼 (user, login, logout, isAuthenticated) |
| `useWords(filters)` | 단어 목록 패칭 + 페이지네이션 상태 |
| `useWord(id)` | 단어 상세 |
| `useBookmarkToggle()` | 옵티미스틱 토글 (mutation) |
| `useQuizSession()` | 퀴즈 세션 상태 (questions, answers, currentIndex) |
| `useToast()` | 전역 토스트 호출 |
| `useDebouncedValue(value, ms)` | 검색어 디바운스 |
| `useSpeech()` | Web Speech API 래퍼 (지원 여부 + 발음 함수) |

---

## 6번. Context (`src/contexts/`)

| Context | 책임 | Provider 위치 |
|---|---|---|
| `AuthContext` | user, accessToken, login(), logout() | `<App>` 최상단 |
| `ToastContext` | 전역 토스트 큐 | `<App>` 최상단 |
| `ThemeContext` | (옵션) 라이트/다크 토글 — Phase 2 | — |

---

## 7번. API 모듈 (`src/api/`)

| 파일 | 책임 |
|---|---|
| `client.js` | Axios 인스턴스, baseURL, JWT 인터셉터, 401 핸들러 |
| `auth.js` | `signup()`, `login()`, `me()`, `logout()` |
| `words.js` | `list()`, `get()`, `create()`, `update()`, `delete()`, `daily()` |
| `quiz.js` | `start()`, `submit()`, `results()`, `result(id)`, `retest()` |
| `bookmarks.js` | `list()`, `toggle(wordId)` |
| `wrongNotes.js` | `list()`, `retest()` |
| `dashboard.js` | `summary()`, `attendance(year, month)` |
| `missions.js` | `today()` |
| `ranking.js` | `list(type, period, size)` |

> 페이지는 axios를 **절대** 직접 import 하지 않고 위 모듈만 사용.

---

## 8번. 디렉토리 트리 (최종 형태)

```
frontend/src/
├── api/
│   ├── client.js
│   ├── auth.js
│   ├── words.js
│   ├── quiz.js
│   ├── bookmarks.js
│   ├── wrongNotes.js
│   ├── dashboard.js
│   ├── missions.js
│   └── ranking.js
├── components/
│   ├── ui/                  ← Button, Input, Modal, Card, Pagination, Spinner, Toast, EmptyState, ProgressBar
│   ├── layout/              ← AppLayout, Header, Footer, NavMenu, UserMenu
│   ├── auth/                ← ProtectedRoute, LoginForm, SignupForm
│   ├── word/                ← WordFilterBar, WordList, WordCard, WordDetailCard, PronounceButton, BookmarkToggle, WordTag
│   ├── quiz/                ← QuizStartModal, QuizPlayView, QuizQuestion, QuizChoiceList, QuizProgressBar, QuizTimer, QuizResultView, QuizResultSummary, QuizResultRow, WrongAnswerList
│   ├── bookmark/            ← BookmarkList, BookmarkRow
│   ├── wrongnote/           ← WrongNoteList, RetestButton
│   ├── dashboard/           ← GreetingHeader, TodayMissionCard, MissionRow, QuickAccessButtons, WeeklyScoreChart, MonthAttendanceGrid, DashboardSummary, LevelProgressBars
│   └── ranking/             ← RankingFilterBar, RankingList, RankingRow
├── contexts/
│   ├── AuthContext.jsx
│   └── ToastContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useWords.js
│   ├── useWord.js
│   ├── useBookmarkToggle.js
│   ├── useQuizSession.js
│   ├── useToast.js
│   ├── useDebouncedValue.js
│   └── useSpeech.js
├── pages/
│   ├── auth/{LoginPage,SignupPage}.jsx
│   ├── dashboard/DashboardPage.jsx
│   ├── word/{WordListPage,WordDetailPage}.jsx
│   ├── quiz/{QuizPage,QuizResultListPage,QuizResultDetailPage}.jsx
│   ├── bookmark/BookmarkPage.jsx
│   ├── wrongnote/WrongNotePage.jsx
│   ├── stats/StatsPage.jsx
│   └── ranking/RankingPage.jsx
├── router/
│   └── index.jsx            ← createBrowserRouter
├── styles/
│   ├── theme.js             ← 디자인 토큰 (STYLE_GUIDE 참조)
│   └── GlobalStyle.js
├── utils/
│   └── (formatDate, formatScore 등)
├── App.jsx
└── main.jsx
```

---

## 9번. Vibe Coding 활용 가이드

새 화면 요청 시:

```
@VIBE_CODING.md 기준.

[Layer 3 - Task]
- User Story: U-06 (단어 목록 조회)
- 화면: WordListPage (Wireframes.md 3번)
- 컴포넌트 분해 (COMPONENTS.md 3번):
  - Page: WordListPage
  - Reuse: WordFilterBar, WordList, WordCard, Pagination
  - UI Kit: Button, Input
  - Hook: useWords(filters), useDebouncedValue
- API 모듈: api/words.js의 list(filters)
- 디자인 토큰: STYLE_GUIDE.md theme.colors / theme.spacing

[Layer 5 - Output]
파일별 분리 + Styled Components + 클릭 경로 검증
```

> **새 컴포넌트를 만들기 전에 본 트리에서 비슷한 게 있는지 먼저 검색**할 것을 LLM에 명시 — 중복 생성 방지의 핵심.

---

## 10번. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|---|---|---|
| v1.0 | 2026-04-30 | 라우트 12개 / 페이지 12개 / 도메인 컴포넌트 50+ / UI Kit 9개 / Hook 8개 초안 |
