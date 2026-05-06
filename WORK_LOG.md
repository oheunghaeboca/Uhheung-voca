# 어흥해보카 — 작업 이력 (Work Log)

> 세션 단위 누적 로그. 코드는 git history, **왜/어떻게**는 여기에. 최신이 위.
> Claude Code transcript JSONL 은 `~/.claude/projects/.../*.jsonl` 에 자동 저장되지만,
> 가독성을 위해 핵심 흐름만 사람이 읽기 좋게 정리한다.

---

## 2026-05-03 — 인증 시스템(JWT + Refresh) + 랜딩/로그인 구현

- **브랜치**: `feat/auth`
- **커밋**: `097c3b7`, `076caf6` (이 세션 직전 head: `520538a`)
- **작업자**: 이경진 (학생) + Claude Opus 4.7
- **빌드**: backend `./gradlew compileJava` ✅ / frontend `npm run build` ✅
- **lint**: 인증 영역 0 errors / 0 warnings (다른 도메인 잔여 11건은 범위 외)

### 1) 받은 프롬프트와 결과

#### 프롬프트 A (v2) — Backend: JWT 인증 + 회원가입/로그인
- **요구**: Spring Boot 백엔드에 `signup/login/me` 3개 엔드포인트 + JWT 인프라(HS256, jjwt 0.12.6) + SecurityConfig + 글로벌 예외 핸들러. 시크릿 안전 점검까지.
- **사전 점검 결과**:
  - 도메인 스켈레톤(컨트롤러/DTO/시큐리티/서비스 빈 파일)이 이미 있음 → 재사용/확장
  - User 엔티티에 `nickname VARCHAR(20) NOT NULL` 존재 → 명세에 없는 필드지만 V1 스키마 변경 금지라 SignupRequest 에 nickname 유지
  - JwtTokenProvider 의 프로퍼티 키가 `voca.jwt.secret` 인 반면 application.yml 은 `jwt.secret` → **`jwt.secret` 으로 통일**
- **구현**:
  - `JwtTokenProvider`: HS256, claims = `sub(username) + uid + role`, `@PostConstruct` 로 빈 secret / 32바이트 미만이면 즉시 `IllegalStateException` (fail-fast)
  - `JwtAuthenticationFilter` + `JwtAuthenticationEntryPoint(401)` + `JwtAccessDeniedHandler(403)`
  - `SecurityConfig`: STATELESS, CSRF/formLogin/httpBasic disable, CORS 5173 only, `permitAll`(signup/login/health) + `authenticated`
  - `AuthService`: BCrypt 해싱, username 열거 방지(로그인 실패 동일 메시지), `me()` 추가
  - `application.yml` 의 `jwt.secret` 은 `${JWT_SECRET:}` placeholder 만, 실값은 `application-local.yml`(gitignored)
- **시크릿 점검**: 4/4 통과 (`git check-ignore -v` 로 application-local.yml 미추적 확인)

#### 프롬프트 후속 — "test 어떻게 해보면 되 / 코드 주석 부족"
- 단계별 테스트 가이드(헬스체크 → signup → 중복 409 → login → /me Bearer / 토큰 없음 / 변조) 제공
- **모든 인증 파일에 클래스/메서드 단위 javadoc 보강** (JwtTokenProvider/Filter/EntryPoint/AccessDeniedHandler/SecurityConfig/AuthService/AuthController/DTOs/ErrorCode/GlobalExceptionHandler)

#### 프롬프트 후속 — "주석 한글로 달아"
- 위 14개 파일의 주석 전부를 한국어로 재작성 (식별자/변수명은 영어 유지)
- **메모리에 선호 저장**: `feedback_comments_korean.md` — 향후 어흥해보카 프로젝트의 새 코드 주석은 자동으로 한국어로 작성

#### 프롬프트 후속 — "주석에 보안에 민감한 사항 안 들어갔지"
- 자동 grep + 직접 검토로 검증:
  - 실제 secret/key/token/password 값 0건
  - 이메일/IP 0건
  - 일반 보안 지식(HS256 / BCrypt cost / username enumeration 방지 등)만 기재 — OWASP/공식 문서 수준이라 무해

#### 프롬프트 후속 — "refresh token 도입해 / 변경사항 정리"
- **DB**: 신규 테이블 `refresh_tokens`. raw 토큰 대신 SHA-256 해시(64hex)만 저장. V2 마이그레이션 추가.
- **토큰 모델**: access(JWT, 1h) + refresh(opaque 32B random, 14d). refresh 1회 사용 시 즉시 폐기 + 새 토큰 발급(rotation).
- **신규 엔드포인트**: `POST /api/auth/refresh`, `POST /api/auth/logout` (둘 다 인증 불필요 — refresh 는 access 만료 상태에서 호출, logout 은 idempotent)
- **응답 DTO 변경**: `AuthResponse` 에 `refreshToken / refreshExpiresIn` 추가, `TokenRefreshResponse` 신규
- **ErrorCode 추가**: `INVALID_REFRESH_TOKEN`
- 변경사항을 메모장에 복사하기 좋은 plain text 박스로 정리해 응답

#### 프롬프트 B (v2) — Frontend: 인증 컨텍스트 + Landing/Login + ProtectedRoute
- **요구**: AuthContext(status 머신), api/client + auth, LoginForm/SignupForm/ProtectedRoute, LandingPage(Hero/Features/HowItWorks/CTA/Footer), LoginPage(카드 안 토글), router 갱신, vite proxy.
- **사전 점검**:
  - 풍부한 스켈레톤(50+ 컴포넌트) 이미 존재 → 거의 다 재사용
  - `api/client.js` 가 401 시 `window.location.href` hard reload → **이벤트 패턴(`auth:logout`) 으로 갱신**
  - `index.css` 가 Vite 기본 템플릿(`#root { width: 1126px; text-align: center }`) → 랜딩 풀폭 hero 깨짐 → 정리
  - `UserMenu` 가 이미 nickname + 로그아웃 버튼을 갖고 있어 dashboard placeholder 추가 불필요
- **proxy 채택 이유**: `.env` 추가 안 해 학생 셋업 단순화 + same-origin 처럼 보여 CORS 의존 제거. baseURL `'/api'` + vite proxy `/api → http://localhost:8080`
- **구현**:
  - `AuthContext`: `status: loading | authed | guest`, signup → 자동 로그인, `auth:logout` 이벤트 리스너로 401 → 자동 로그아웃 → ProtectedRoute 가 자연스럽게 /login 리다이렉트
  - `LoginPage`: 한 카드 안에서 로그인↔회원가입 탭 토글, password show/hide
  - `LandingPage` + 5개 섹션 컴포넌트(Hero/Features/HowItWorks/CTA/Footer)
  - `router`: `/` Landing, `/login` 토글, `/signup` 라우트/파일 제거, `*` → `/`
- **보안 점검 5/5 통과**: .env* gitignore 매치 / 시크릿 하드코딩 0건 / console.* 호출 자체 0건 / VITE_ 변수에 토큰 없음 / localStorage 토큰 노출 없음

#### 프롬프트 후속 — "커밋까지만 진행"
- 논리적으로 2개 커밋으로 분리:
  - `097c3b7 feat(auth): JWT 인증 + refresh token 도입` — 22개 파일 (+1082 / -33)
  - `076caf6 feat(auth): Landing 페이지 + 로그인/회원가입 카드 토글 + ProtectedRoute` — 17개 파일 (+1079 / -193)
- push / PR 은 학생 명시 승인 후에만 (루트 CLAUDE.md §3.1)

### 2) 변경/추가 파일 요약

#### 백엔드 (커밋 097c3b7 — 22개)
신규 9: `auth/dto/{RefreshRequest,TokenRefreshResponse,UserSummary}`, `auth/entity/RefreshToken`, `auth/repository/RefreshTokenRepository`, `auth/security/{JwtAccessDeniedHandler,JwtAuthenticationEntryPoint}`, `auth/service/RefreshTokenService`, `db/migration/V2__create_refresh_tokens.sql`
수정 13: `auth/controller/AuthController`, `auth/dto/{AuthResponse,LoginRequest,MeResponse,SignupRequest}`, `auth/security/{JwtAuthenticationFilter,JwtTokenProvider}`, `auth/service/AuthService`, `common/exception/{ErrorCode,GlobalExceptionHandler}`, `config/SecurityConfig`, `resources/{application.yml,application-local.yml.example}`

#### 프론트엔드 (커밋 076caf6 — 17개)
신규 6: `components/landing/{Hero,Features,HowItWorks,CTASection,LandingFooter}`, `pages/auth/LandingPage`
수정 10: `vite.config.js`, `src/index.css`, `api/{client,auth}`, `contexts/AuthContext`, `components/auth/{LoginForm,SignupForm,ProtectedRoute}`, `pages/auth/LoginPage`, `router/index`
삭제 1: `pages/auth/SignupPage` (LoginPage 토글로 흡수)

### 3) 결정 사항 / 트레이드오프 메모

- **nickname 필드 살림**: 백엔드 V1 스키마가 `NOT NULL` 이라 명세에 없어도 SignupRequest 유지. UserSummary/MeResponse 응답에도 포함.
- **token 키 단위 ms 유지**: 명세는 "validity-seconds" 였으나 기존 application-local.yml 이 `access-token-validity-ms` 로 이미 사용 중 → 키 유지하고 응답의 `expiresIn` 만 초 변환.
- **logout 인증 불필요**: refresh token 기반 stateless 폐기 — OAuth2 token revocation endpoint 관례를 따름. idempotent.
- **다중 세션 허용**: 로그인 시 기존 refresh 들 revoke 안 함 — 폰/노트북 다중 로그인 자연스럽게 동작.
- **refresh 토큰 재사용 감지(paranoid mode) 미구현**: 학습 단계 단순화. 추후 폐기된 refresh 재사용 시 그 사용자의 모든 refresh 폐기 로직 추가 가능.
- **vite proxy vs .env**: proxy 채택 — VITE_ 변수 추가 없이 same-origin 효과.
- **AuthContext.value 안정화**: useMemo 로 객체 신원 안정 (React 19 컨텍스트 리렌더 최소화).
- **localStorage 토큰**: 단순함 우선. TODO 주석으로 "httpOnly cookie 전환" 표시.

### 4) 다음 단계 (Backlog)

- [ ] PR 생성 및 머지 (학생 검토 후, push 승인 시)
- [ ] frontend 의 다른 도메인 lint 11건(useWord/useWords/RankingPage) 정리 — 별도 task
- [ ] DashboardPage 실제 데이터 연동 (현재는 placeholder 컴포넌트들)
- [ ] refresh token 만료된 행 정기 청소 스케줄러
- [ ] 운영 시 `actuator/health` `show-details: when-authorized` 로 변경
- [ ] 운영 시 SQL DEBUG 로그 OFF
- [ ] frontend `COMPONENTS.md` / `STYLE_GUIDE.md` 미커밋 (학생 별도 결정)

### 5) 검증 시나리오 (백엔드/프론트 함께 검증 시)

```bash
# 백엔드 (별도 터미널)
cd backend && ./gradlew bootRun     # http://localhost:8080

# 프론트
cd frontend && npm run dev           # http://localhost:5173

# 수동 클릭 경로
# /  → 랜딩 → "지금 시작하기" → /login → 회원가입 탭 newuser/pw12345678/테스터
# → 자동 로그인 → /dashboard → F5 새로고침 유지 → 헤더 로그아웃 → /login
# → /dashboard 직접 입력 → /login 리다이렉트
```

---

## 2026-05-06 — Flyway 마이그레이션 정합성 회복 / 관리자 부트스트랩 도입 / API 명세서 통합

- **브랜치**: `feat/auth`
- **작업자**: 이경진 + Claude Opus 4.7
- **빌드 상태**: backend `./gradlew compileJava` 통과
- **선행 컨텍스트**: 팀 `develop` 의 단어 도메인 작업물을 `feat/auth` 로 리베이스한 직후. 인증 도메인 자체는 정합 상태였으나, 마이그레이션 버전 번호 영역에서 양 브랜치가 동일 슬롯을 점유하여 부팅 단계의 검증을 통과하지 못하는 상황이었다.

### 1) Prompt 단위 작업 기록

#### Prompt A — 리베이스 직후 식별자·컬럼·마이그레이션 정합성 점검

- **사전 점검**: `develop` 의 Flyway 히스토리가 V1 → V4 영역을 점유하고 있는 반면, `feat/auth` 의 `V2__create_refresh_tokens.sql` 이 동일 슬롯을 사용하여 부팅 단계의 체크섬 검증이 실패. 그 외 영속 모델·DTO·FK(`User.nickname` 컬럼, `refresh_tokens.user_id`, 인증 응답 DTO 필드) 는 양 브랜치 간 상이점이 발견되지 않음.
- **조치**:
  - `git mv V2__create_refresh_tokens.sql V5__create_refresh_tokens.sql` — 충돌 슬롯에서 단일 사용 슬롯으로 이전. 머지 이전 단계이므로 "이미 적용된 마이그레이션 파일은 변경 금지" 규약을 위반하지 않는 범위에서 진행.
  - `RefreshToken.java:45` 의 마이그레이션 버전 식별 주석을 V5 로 동기화.
  - `FlywayRepairConfig.java` (학생이 직접 도입한 미추적 파일) 는 보존. 과거 체크섬이 잔존한 로컬 환경에서의 안전 장치로 의미가 있으며, 정상 환경에서는 부수효과가 없다.

#### Prompt 후속 — 데이터베이스 초기화 및 재기동

- `DROP DATABASE uhheung_voca; CREATE DATABASE ... CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci` 로 데이터 계층을 초기 상태로 환원한 후 부팅.
- 이전 세션에 잔존하던 Spring Boot 프로세스(PID 7052) 가 8080 포트를 점유하여 1차 부팅이 실패. 점유 프로세스 종료 후 재기동.
- 부팅 종료 후 `Started VocaApplication in 6.4s`, Flyway 히스토리 5건 모두 `success = 1`, 시드 단어 123건, `users` 및 `refresh_tokens` 0건의 초기 상태가 일관되게 확인됨.

#### Prompt 후속 — 8080 포트 점유 프로세스 회수 절차 정리

- 본 세션에서 백그라운드로 기동한 `bootRun` 작업(`bjml1tyxt`) 이 잔존하여 IDE 의 신규 부팅과 충돌. `TaskStop` 호출 후 자식 Java 프로세스를 회수하여 포트를 해제.
- 향후 동일 문제의 재발을 방지하기 위해, 본 세션 이후 `./gradlew bootRun` 은 IDE 가 관리하도록 위임하고 도구 측에서 백그라운드 기동을 유발하지 않는 운영 정책으로 합의.

#### Prompt 후속 — 8080 진입점 정책 결정

- 8080 은 REST API 전용 포트이며 정적 자원을 제공하지 않음을 정리. 실 사용 진입점은 Vite 개발 서버(`:5173`) 가 담당.
- 세 가지 후보를 비교 (5173 직접 진입 / 8080 → 5173 서버측 리다이렉트 / 프론트 빌드 산출물의 Spring Boot 정적 서빙) 한 후, 개발 단계의 핫 리로드 보존과 추가 코드 도입 회피를 근거로 **5173 직접 진입** 정책을 채택. 코드 변경 없이 운영 가이드만 갱신.

#### Prompt B — 관리자(ADMIN) 진입 메커니즘 도입

- 회원가입 경로가 `Role.USER` 만을 발급하도록 의도적으로 제한되어 있어 ADMIN 진입 절차가 부재한 상태였음을 식별. 시드 마이그레이션 / 환경설정 부트스트랩 / CLI / 수동 INSERT / 첫 사용자 자동 ADMIN 의 다섯 패턴을 비교한 후, 학습 환경에서의 비밀번호 노출 면적과 데이터베이스 초기화 시 자가 복원 능력을 근거로 **환경설정 부트스트랩** 패턴을 채택.
- 정식 PBI Prompt Log: [`prompts/logs/PBI-09_admin_bootstrap.md`](./prompts/logs/PBI-09_admin_bootstrap.md)
- 산출물:
  - 신규 `backend/.../config/AdminBootstrapRunner.java` — `ApplicationRunner` 구현. 미설정 시 부트스트랩 비활성, 동일 username 존재 시 갱신 차단, BCrypt 해싱 후 `Role.ADMIN` 으로 영속화.
  - 수정 `application-local.yml.example` — `admin` 섹션 신설 및 비밀번호의 git 커밋 금지 원칙을 인라인 주석으로 명시.
  - 수정 `application-local.yml` (`.gitignore` 대상) — 학습 환경 기본값 주입.

#### Prompt C — API 명세서 단일 진실 공급원 통합

- 팀 노션 익스포트(`팀프로젝트/노션/소프트웨어공학/API 명세서/`) 를 레포 내 단일 진실 공급원인 `docs/API명세서_v1.md` 에 통합.
- 명세 형식을 노션 페이지 단위 구조(`Method` / `URL` → `Header` / `Path Variable` / `Request Body` / `Response Body` / `Response Field` / `HTTP Status Code`) 로 일원화.
- 도메인 분류: 인증(5건) / 단어(2건) / 관리자(3건) / 퀴즈(5건) + 확장 기능 인덱스 표(12건). 941 lines, 변경량 +703 / −104.
- 노션 export 단계에서 누적된 정합성 결함을 정리:
  - 단어 삭제 경로의 슬래시 중복 (`DELETE//api/admin/...` → `DELETE /api/admin/words/{wordId}`)
  - 회원가입 경로의 prefix 누락 (`/auth/signup` → `/api/auth/signup`)
  - 로그인 명세 페이지에 잔존하던 타 프로젝트(이메일·유리병) 잔재 → 어흥해보카 username 기반으로 재작성
  - 내 퀴즈 결과 목록 응답이 단일 객체 형태로 잘못 기술된 부분 → 배열 형태로 정정
- 구현물과의 동기화: `AuthResponse` / `TokenRefreshResponse` 의 실제 필드 시그니처 (`accessToken` / `refreshToken` / `tokenType` / `expiresIn` / `refreshExpiresIn` / `user`) 를 그대로 반영. 노션 인덱스에 누락되어 있던 토큰 재발급 (`POST /api/auth/refresh`) 을 §1.3 으로 정식 편입.

### 2) 의사결정 및 트레이드오프

- **마이그레이션 V5 로의 이전**: 충돌 슬롯의 회피와 "이미 적용된 마이그레이션 파일 변경 금지" 규약 양쪽을 동시에 만족하는 유일한 해법. 머지 이전 시점이라는 조건에서만 가능하며, 머지 이후에는 동일 패턴을 사용할 수 없음.
- **데이터베이스 초기화 채택**: Flyway repair 로 체크섬만 정렬하는 우회 방안은, 신규 V2 (`insert_initial_words`) 의 SQL 이 실제 실행되지 않은 채로 히스토리만 적용 처리되는 부작용을 동반. 데이터 일관성을 우선하여 초기화 채택.
- **환경설정 부트스트랩 채택 근거**: yml 키만 채우면 즉시 동작하고, 데이터베이스 초기화 시에도 부팅 한 사이클이면 권한 인프라가 자가 복원됨. 동시에 다른 팀원이 본 브랜치를 풀하더라도 본인의 yml 에 명시적으로 키를 채우지 않는 한 자동 계정 생성이 일어나지 않아, 의도하지 않은 권한 누출이 차단된다.
- **기존 admin 비밀번호 보호 정책 (P2)**: 운영자가 화면에서 변경한 비밀번호를 환경 변수의 변경이 묵시적으로 덮어쓰는 시나리오를 차단. 비밀번호 회전 시에는 데이터 계층의 admin 행을 명시적으로 삭제한 뒤 재기동하도록 운영 절차를 정리.
- **API 명세서의 단일 진실 공급원 일원화**: 노션은 초안 및 논의의 공간으로, `docs/API명세서_v1.md` 는 확정 산출물의 공간으로 책임을 분리. 형식 정돈 과정에서 명세 ↔ 구현 간 정합성 갭(예: `QuizController` 의 prefix `/api/quiz` 와 명세의 `/api/quizzes` / `/api/quiz-results`, 결과 저장 시 `userId` 식별 방식) 을 §4.3 의 논의사항으로 명시화.

### 3) 후속 백로그

- [ ] ADMIN 권한 승격 API (`PATCH /api/admin/users/{userId}/role`) — 두 번째 ADMIN 발급 흐름.
- [ ] ADMIN 단어 CRUD (`POST` / `PATCH` / `DELETE /api/admin/words`) — 명세서 §3.
- [ ] 프론트 `/admin` 라우트 및 `RoleProtectedRoute` 컴포넌트.
- [ ] 퀴즈 채점 책임 소재 (프론트 vs 백엔드) 결정 및 `QuizSubmitRequest` 스키마와 명세 §4.3 의 동기화.
- [ ] PR 생성 및 머지 (학생 승인 후 push).

### 4) 검증 절차

```bash
# 1) 데이터 계층 초기화
mysql -u root -p -e "DROP DATABASE uhheung_voca; \
  CREATE DATABASE uhheung_voca CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2) 백엔드 부팅 및 부트스트랩 검증
cd backend && ./gradlew bootRun
#   - 로그에서 "Successfully validated 5 migrations" 확인
#   - 로그에서 "관리자 계정 생성: username=admin role=ADMIN" 확인

# 3) 프론트 기동
cd frontend && npm run dev

# 4) 인증 흐름 검증
#   - http://localhost:5173/login 접속
#   - admin / <개인 비밀번호> 로 로그인
#   - GET /api/auth/me 응답의 user.role = "ADMIN" 확인
```

---

<!-- 새 세션 추가 시 이 위에 ## 날짜 — 제목 블록을 끼워넣는다 -->
