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

기본 포트 `8080`.

### 4. 프론트엔드 실행

```bash
cd frontend
cp .env.example .env.local   # 필요 시 백엔드 URL 수정
npm install
npm run dev
```

기본 포트 `5173`.

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
