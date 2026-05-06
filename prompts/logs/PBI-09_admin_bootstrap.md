# PBI-09 관리자 계정 부트스트랩 Prompt Log

## 1. 기본 정보

- PBI ID: PBI-09
- 기능명: 관리자(ADMIN) 계정 부트스트랩 메커니즘
- 담당자: 이경진
- 브랜치: `feat/auth`
- 대상 영역: BE / Auth · Configuration
- 관련 API: 해당 없음 (애플리케이션 부트스트랩 컴포넌트로, HTTP 진입점을 가지지 않음)
- 관련 DB: `users` (`role = ADMIN` 행의 단일 인스턴스 보장)

---

## 2. Prompt v1

### 작성 목적

회원가입 경로는 `Role.USER` 만을 발급하도록 의도적으로 제한되어 있어, 운영 권한을 보유한 ADMIN 계정을 시스템적으로 확보할 진입 절차가 부재한 상태이다. 비밀번호가 마이그레이션 SQL 또는 소스 코드에 정적으로 박히지 않도록 하면서도, 환경별로 상이한 비밀번호 주입을 허용하고, 데이터베이스 초기화 시 부팅 한 사이클로 권한 인프라가 자가 복원되는 구조를 목표로 한다. 본 작업은 단일 ADMIN 계정의 보장만을 책임지며, 추가 ADMIN 발급은 후속 PBI 의 권한 승격 API 로 위임한다.

### Prompt

Spring Boot 3.5 / Java 17 / Spring Data JPA / Spring Security 환경의 어흥해보카 백엔드에 환경설정 기반 관리자 부트스트랩 컴포넌트를 도입한다.

**1. 컴포넌트 사양**

- 위치: `com.uhheung.voca.config` 패키지.
- 클래스명: `AdminBootstrapRunner`. `org.springframework.boot.ApplicationRunner` 를 구현하여 컨텍스트 초기화 종료 직후 1회 실행되도록 한다.
- 트랜잭션 경계: 메서드 단위 `@Transactional` 부여. 부트스트랩 도중 예외 발생 시 부분 커밋이 남지 않도록 한다.

**2. 외부 설정 바인딩**

`application-local.yml` 의 다음 키를 `@Value` 로 주입하며, 모두 빈 문자열을 기본값으로 갖는다.

- `admin.bootstrap-username`
- `admin.bootstrap-password`
- `admin.bootstrap-nickname` (기본값 `관리자`)

**3. 부트스트랩 정책**

- (P1) `username` 또는 `password` 가 비어 있을 경우 부트스트랩을 비활성화하며, INFO 레벨 로그로 그 사실을 명시한다. 본 정책은 팀원이 자신의 `application-local.yml` 에 명시적으로 키를 채우기 전까지 의도하지 않은 계정 생성이 발생하지 않도록 한다.
- (P2) `UserRepository.existsByUsername` 으로 중복을 검사하여, 동일 username 의 계정이 이미 존재하는 경우 갱신 없이 종료한다. 본 정책은 운영자가 화면에서 변경한 비밀번호를 환경 변수 변경이 묵시적으로 덮어쓰는 시나리오를 차단한다.
- (P3) 신규 생성 시 `PasswordEncoder` (BCrypt) 로 해싱한 결과만을 영속화하여 평문이 데이터 계층에 도달하지 않음을 보장한다.
- (P4) 발급 권한은 `Role.ADMIN` 으로 고정한다. 두 번째 이상의 ADMIN 발급은 본 컴포넌트의 책임이 아니며, 추후 ADMIN 전용 권한 승격 엔드포인트로 위임한다.

**4. 설정 파일 갱신**

- `application-local.yml.example`: `admin` 섹션과 함께 비밀번호의 git 커밋 금지 원칙을 명시하는 인라인 주석을 추가한다.
- `application-local.yml` (`.gitignore` 대상): 학습 환경에서 즉시 동작 가능하도록 기본값을 채운다.

**5. 코드 컨벤션**

- 식별자는 영어, 주석은 한국어. 클래스 단위 javadoc 에 정책의 근거를 기술하고, 메서드 단위는 한 줄 주석을 부여한다.
- 기존 `User.builder()` 시그니처 (`username / password / nickname / role`) 를 그대로 사용하며, 신규 빌더 메서드를 도입하지 않는다.

**6. 산출물 요구사항**

- 신규/수정 파일 목록과 각 파일의 전체 코드.
- 검증 절차 (로그 시그니처 / 인증 흐름 / 데이터 계층 확인 쿼리).
- 비밀번호 재설정 시나리오와, 그 시나리오에서 yml 변경이 의미를 가지지 않는 이유에 대한 설명.

---

## 3. AI 생성 결과

### 신규 파일

- `backend/src/main/java/com/uhheung/voca/config/AdminBootstrapRunner.java`
  - `@Component` + `ApplicationRunner` 구현, `@Transactional` 적용.
  - `@Value` 로 `admin.bootstrap-{username,password,nickname}` 주입.
  - 정책 P1 (미설정 skip) → 정책 P2 (중복 skip) → 정책 P3 (BCrypt 해싱 후 INSERT) → 정책 P4 (`Role.ADMIN`) 의 순차 적용.
  - 클래스 javadoc 에 P1~P4 의 의도와 근거를 기술.

### 수정 파일

- `backend/src/main/resources/application-local.yml.example`
  - `admin:` 섹션 신설. `bootstrap-password` 의 placeholder 는 `REPLACE_ME_ADMIN_PASSWORD` 로 통일.
  - 비밀번호의 git 커밋 금지 원칙을 인라인 주석으로 명시.
- `backend/src/main/resources/application-local.yml`
  - 학습 환경 기본값 `admin / <개인 비밀번호> / 관리자` 주입. `.gitignore` 에 의해 추적 제외 상태 유지.

---

## 4. 검증 방법

| 단계 | 절차 | 기대 결과 |
| --- | --- | --- |
| 1 | `./gradlew compileJava` | `BUILD SUCCESSFUL` |
| 2 | `application-local.yml` 키 채운 상태로 최초 부팅 | 로그에 `관리자 계정 생성: username=admin role=ADMIN` 출력 |
| 3 | 동일 상태로 재부팅 | 로그에 `관리자 부트스트랩 건너뜀: username=admin 이미 존재` 출력 |
| 4 | `bootstrap-username` / `bootstrap-password` 를 비운 채 부팅 | 로그에 `관리자 부트스트랩 비활성: admin.bootstrap-username/password 미설정` 출력 |
| 5 | 프론트(`http://localhost:5173`) 에서 `admin / <개인 비밀번호>` 로그인 | `POST /api/auth/login` 200 응답의 `user.role = "ADMIN"` |
| 6 | 데이터 계층 검증 | `SELECT id, username, nickname, role FROM users WHERE role = 'ADMIN';` 결과 1행, `password` 컬럼이 BCrypt 해시(`$2a$...`) 형태 |
| 7 | 비밀번호 회전 시나리오 | yml 의 `bootstrap-password` 를 변경 후 재부팅하더라도 데이터 계층의 admin 행이 갱신되지 않음 — 정책 P2 의 작동 검증 |

---

## 5. 검증 결과

- 컴파일 및 부팅 절차 모두 정상 종료.
- 정책 P1 (미설정 skip) / P2 (중복 보호) / P3 (BCrypt) / P4 (`Role.ADMIN`) 모두 의도대로 동작.
- 데이터 계층의 `password` 컬럼은 항상 해시 형태이며, 평문이 로그·DB 어디에도 잔존하지 않음.
- 프론트 로그인 응답의 `user.role` 이 `"ADMIN"` 으로 반환되어 클라이언트 측 권한 분기에 즉시 사용 가능한 상태.

---

## 6. Prompt 수정 기록

| 버전 | 단계 | 변경 사유 / 핵심 차이 |
| --- | --- | --- |
| v0 | 패턴 탐색 | 시드 마이그레이션 / env 부트스트랩 / CLI / 수동 INSERT / 첫 사용자 자동 ADMIN 등 다섯 패턴의 보안·운영 트레이드오프를 비교. 구현 지시는 포함하지 않음. |
| v0.5 | 의사결정 | 학습 환경에서의 비밀번호 노출 면적과 데이터베이스 초기화 시 자가 복원 능력을 기준으로 env 부트스트랩 패턴을 채택. |
| v1 | 구현 사양 확정 | §2 본문. 컴포넌트 사양·외부 설정 바인딩·정책 4종·설정 파일 갱신·코드 컨벤션·산출물 요구사항을 단일 프롬프트로 정렬하여 반복 회차 없이 구현 가능하도록 한다. |

### Examining 기록

- v1 프롬프트 입력 후 컴파일/부팅/로그인 검증 모두 1회차에 통과. 추가 거절 또는 재요청 없음.
- `application-local.yml` 이 `.gitignore` 대상이므로, 다른 팀원이 본 브랜치를 풀하더라도 자신의 yml 에 명시적으로 키를 채우지 않는 한 자동 계정 생성이 발생하지 않음을 확인. 정책 P1 의 의도와 부합.

---

## 7. 최종 반영 여부

- PR 번호: 미생성 (학생 승인 후 push 예정)
- Merge 여부: 미머지
- 후속 PBI 분리:
  - ADMIN 권한 승격 API: `PATCH /api/admin/users/{userId}/role`
  - ADMIN 단어 CRUD: `POST/PATCH/DELETE /api/admin/words`
  - 프론트 라우트 가드: `/admin` + `RoleProtectedRoute` 컴포넌트
