# 어흥해보카 (Uhheung-voca)

대학생을 위한 TOEIC 영어 단어 학습 Web App.
SMU 소프트웨어공학 5조 팀 프로젝트.

## 기술 스택

| 영역 | 기술 |
|---|---|
| Front-end | React 19 + Vite, Styled Components, Recharts, Axios, React Router |
| Back-end | Spring Boot 3.5 (Java 17), Spring Data JPA, Spring Security + JWT (jjwt) |
| Database | MySQL 8.0 (각자 로컬 인스턴스) |
| 발음 API | Web Speech API (브라우저 내장) |

> ⚠️ Spring Initializr가 3.4를 더 이상 제공하지 않아 3.5.0으로 시작함. 동작 동일.

## 디렉토리 구조

```
Uhheung-voca/
├── backend/        # Spring Boot (Gradle)
└── frontend/       # React + Vite
```

## 로컬 개발 환경 세팅

### 사전 요구사항
- JDK 17 이상 (Gradle toolchain이 자동 다운로드 가능)
- Node.js 20 이상
- MySQL 8.0 (로컬 인스턴스)

### 1. MySQL DB 준비 (각자 본인 로컬에서)

빈 데이터베이스만 만들어 두면 된다. **테이블은 백엔드 첫 실행 시 Flyway가 자동 생성**한다.

```sql
CREATE DATABASE uhheung_voca CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 백엔드 로컬 설정

```bash
cd backend
cp src/main/resources/application-local.yml.example src/main/resources/application-local.yml
# application-local.yml 열어서 본인 MySQL username/password, JWT secret 입력
```

`application-local.yml`은 `.gitignore`에 포함되어 있어 커밋되지 않음. **개인 비밀정보는 절대 커밋하지 말 것.**

### 3. 백엔드 실행

```bash
cd backend
./gradlew bootRun       # macOS/Linux
gradlew.bat bootRun     # Windows
```

기본 포트 `8080`. 첫 실행 시 Flyway가 `db/migration/V*.sql` 파일들을 순서대로 실행해 테이블을 자동 생성한다.

연결 확인: 다른 터미널에서

```bash
curl http://localhost:8080/actuator/health
# 응답에 "db":{"status":"UP"} 가 보이면 정상
```

### 4. 프론트엔드 실행

```bash
cd frontend
cp .env.example .env.local   # 필요 시 백엔드 URL 수정
npm install
npm run dev
```

기본 포트 `5173`.

## DB 스키마 관리 (Flyway)

각자 로컬 MySQL을 쓰지만, **스키마는 Git에 버전 관리되는 SQL 파일**로 통일한다. Flyway가 백엔드 부팅 시 자동으로 적용해 모든 팀원의 DB가 같은 상태가 된다.

### 위치
```
backend/src/main/resources/db/migration/
└── V1__create_initial_schema.sql
```

### 동작 원리
- `bootRun` 시 Flyway가 `V*.sql` 파일을 버전 순서대로 실행
- 적용된 버전은 DB의 `flyway_schema_history` 테이블에 기록 → 같은 마이그레이션은 두 번 실행되지 않음
- JPA의 `ddl-auto`는 `validate` (스키마는 Flyway만 만지고, JPA는 엔티티-테이블 매핑만 검증)

### 새 마이그레이션 추가하는 방법
1. `db/migration/V{다음번호}__{설명}.sql` 파일 생성
   - 예: `V2__add_user_email_column.sql`, `V3__seed_initial_words.sql`
2. SQL 작성 (`ALTER TABLE`, `CREATE TABLE`, `INSERT`, …)
3. PR 올리기. 머지 후 팀원이 자기 브랜치 pull → bootRun 하면 자동 적용

### 처음부터 다시 깔고 싶을 때
```sql
DROP DATABASE uhheung_voca;
CREATE DATABASE uhheung_voca CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 다시 ./gradlew bootRun 하면 V1부터 다 실행됨
```

### 주의
- **이미 머지되어 팀원에게 적용된 마이그레이션 파일은 절대 수정하지 말 것.** Flyway가 체크섬 불일치로 부팅을 실패시킨다. 수정이 필요하면 `V{다음번호}__*.sql`을 새로 만들어서 변경.

## 브랜치 전략 (GitHub Flow)

- `main`: 안정 배포 버전 (직접 커밋 금지)
- `develop`: 개발 통합 브랜치
- `feature/{기능명}`: 기능별 브랜치
  - 예: `feature/login`, `feature/word-test`

## 커밋 메시지 규칙

`유형: 작업내용` 형태.

- `feat:` 새 기능
- `fix:` 버그 수정
- `docs:` 문서
- `style:` 포맷
- `refactor:` 리팩토링
- `test:` 테스트
- `chore:` 빌드/설정

## 팀 구성

- 팀장: 김현서 
- 정다겸 
- 김지우 
- 이경진 
