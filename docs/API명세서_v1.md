# 어흥해보카 API 명세서 v1

대학생을 위한 TOEIC 영단어 학습 Web App **어흥해보카** 의 REST API 명세.
초안·논의는 Notion 에서 관리하고, 개발에 반영된 확정 API 는 본 문서를 단일 진실 공급원(Source of Truth)으로 유지한다.

- **Base URL (개발)**: `http://localhost:8080`
- **인증 방식**: JWT Bearer 토큰 (`Authorization: Bearer {accessToken}`)
- **시간 형식**: ISO-8601 (예: `2026-05-04T03:30:00`)
- **단어 필드 표준**: `english` / `korean` / `level` / `part` / `type` / `example` / `exampleTranslation`
- **에러 상태**: 400 검증 실패 / 401 미로그인 / 403 권한 부족 / 404 리소스 없음 / 409 중복 / 500 서버 오류

---

## 엔드포인트 목록

| 분류 | 이름 | Method | URL | 인증 |
| --- | --- | --- | --- | --- |
| 인증 | 회원가입 | POST | `/api/auth/signup` | 공개 |
| 인증 | 로그인 | POST | `/api/auth/login` | 공개 |
| 인증 | 토큰 재발급 | POST | `/api/auth/refresh` | 공개 |
| 인증 | 로그아웃 | POST | `/api/auth/logout` | 공개 |
| 인증 | 내 정보 조회 | GET | `/api/auth/me` | USER |
| 단어 | 단어 목록 조회 | GET | `/api/words` | USER |
| 단어 | 단어 상세 조회 | GET | `/api/words/{wordId}` | USER |
| 관리자 | 단어 생성 | POST | `/api/admin/words` | ADMIN |
| 관리자 | 단어 수정 | PATCH | `/api/admin/words/{wordId}` | ADMIN |
| 관리자 | 단어 삭제 | DELETE | `/api/admin/words/{wordId}` | ADMIN |
| 퀴즈 | 뜻→영단어 퀴즈 생성 | GET | `/api/quizzes?type=MEANING_TO_WORD` | USER |
| 퀴즈 | 영단어→뜻 퀴즈 생성 | GET | `/api/quizzes?type=WORD_TO_MEANING` | USER |
| 퀴즈 | 퀴즈 결과 저장 | POST | `/api/quiz-results` | USER |
| 퀴즈 | 퀴즈 결과 상세 조회 | GET | `/api/quiz-results/{quizResultId}` | USER |
| 퀴즈 | 내 퀴즈 결과 목록 조회 | GET | `/api/users/me/quiz-results` | USER |

확장 기능(데일리 미션 / 출석 / 북마크 / 오답노트 / 통계 / 랭킹) 은 본 문서 마지막의 [확장 기능](#확장-기능) 섹션 참고.

---

## 1. 인증 (Auth)

### 1.1 회원가입

Method: POST
URL: `/api/auth/signup`

#### Request Body

```json
{
  "username": "student01",
  "password": "Password123!",
  "nickname": "학습자1"
}
```

#### Request Field

| 필드명 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| username | String | 필수 | 4~20자, 영문·숫자·언더스코어만 |
| password | String | 필수 | 8~72자 (BCrypt 상한) |
| nickname | String | 필수 | 1~20자, 유니코드 허용 |

#### Response Body

```json
{
  "id": 1,
  "username": "student01",
  "nickname": "학습자1",
  "role": "USER"
}
```

#### Response Field

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id | Long | 사용자 ID |
| username | String | 로그인 아이디 |
| nickname | String | 표시 이름 |
| role | String | `USER` 또는 `ADMIN` |

#### HTTP Status Code

| 코드 | 의미 |
| --- | --- |
| 201 | 회원가입 성공 |
| 400 | 유효성 검증 실패 |
| 409 | 이미 존재하는 username |
| 500 | 서버 오류 |

---

### 1.2 로그인

Method: POST
URL: `/api/auth/login`

#### Request Body

```json
{
  "username": "student01",
  "password": "Password123!"
}
```

#### Response Body

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "abc123...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "refreshExpiresIn": 1209600,
  "user": {
    "id": 1,
    "username": "student01",
    "nickname": "학습자1",
    "role": "USER"
  }
}
```

#### Response Field

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| accessToken | String | 보호 자원 호출용 JWT (단기 1시간) |
| refreshToken | String | access 만료 시 재발급용 토큰 (장기 14일, 1회용) |
| tokenType | String | 항상 `Bearer` |
| expiresIn | Integer | access 토큰 유효시간(초) |
| refreshExpiresIn | Integer | refresh 토큰 유효시간(초) |
| user.id | Long | 사용자 ID |
| user.username | String | 로그인 아이디 |
| user.nickname | String | 표시 이름 |
| user.role | String | `USER` 또는 `ADMIN` |

#### HTTP Status Code

| 코드 | 의미 |
| --- | --- |
| 200 | 로그인 성공 |
| 400 | 요청 본문 형식 오류 |
| 401 | 자격 증명 불일치(username 없음·password 틀림 동일 메시지) |
| 500 | 서버 오류 |

---

### 1.3 토큰 재발급

Method: POST
URL: `/api/auth/refresh`

기존 refresh 토큰을 폐기하고 새 access + refresh 를 발급한다(rotation). 한 번 사용된 refresh 토큰은 재사용 불가.

#### Request Body

```json
{
  "refreshToken": "abc123..."
}
```

#### Response Body

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
  "refreshToken": "xyz789...",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "refreshExpiresIn": 1209600
}
```

#### Response Field

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| accessToken | String | 새 access JWT |
| refreshToken | String | 새 refresh 토큰 (이전 토큰은 폐기됨) |
| tokenType | String | 항상 `Bearer` |
| expiresIn | Integer | access 유효시간(초) |
| refreshExpiresIn | Integer | refresh 유효시간(초) |

#### HTTP Status Code

| 코드 | 의미 |
| --- | --- |
| 200 | 재발급 성공 |
| 400 | 요청 본문 형식 오류 |
| 401 | refresh 토큰 무효(없음·만료·이미 폐기) |
| 500 | 서버 오류 |

---

### 1.4 로그아웃

Method: POST
URL: `/api/auth/logout`

전달된 refresh 토큰을 폐기한다. 토큰이 없거나 이미 폐기된 경우에도 동일하게 성공 처리(idempotent). 다른 디바이스의 세션은 영향받지 않는다. access 토큰은 stateless 라 만료 전까지 유효하므로 클라이언트도 로컬에서 폐기해야 한다.

#### Request Body

```json
{
  "refreshToken": "abc123..."
}
```

#### Response

본문 없음.

#### HTTP Status Code

| 코드 | 의미 |
| --- | --- |
| 204 | 로그아웃 처리 완료 |
| 400 | 요청 본문 형식 오류 |
| 500 | 서버 오류 |

---

### 1.5 내 정보 조회

Method: GET
URL: `/api/auth/me`

#### Header

| 이름 | 값 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| Authorization | Bearer {accessToken} | 필수 | 로그인한 사용자 식별용 JWT 토큰 |

#### Response Body

```json
{
  "id": 1,
  "username": "student01",
  "nickname": "학습자1",
  "role": "USER"
}
```

#### Response Field

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id | Long | 사용자 ID |
| username | String | 로그인 아이디 |
| nickname | String | 표시 이름 |
| role | String | `USER` 또는 `ADMIN` (관리자 화면 접근 제어용) |

#### HTTP Status Code

| 코드 | 의미 |
| --- | --- |
| 200 | 조회 성공 |
| 401 | 토큰 누락·만료·위조 |
| 500 | 서버 오류 |

---

## 2. 단어 (Word)

### 2.1 단어 목록 조회

Method: GET
URL: `/api/words`

DB 에 저장된 TOEIC 단어 전체 목록을 조회. 단어장 화면과 퀴즈 문제 생성에서 사용.

#### Header

| 이름 | 값 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| Authorization | Bearer {accessToken} | 필수 | 로그인한 사용자 식별용 JWT 토큰 |

#### Query Parameter (선택)

| 이름 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| level | String | 선택 | `BASIC` / `FREQUENT` / `ADVANCED` 필터 |
| type | String | 선택 | `LC` / `RC` 필터 |

#### Request Body

없음

#### Response Body

```json
[
  {
    "id": 1,
    "english": "review",
    "korean": "검토하다",
    "level": "BASIC",
    "part": "Verb",
    "type": "LC",
    "example": "The manager will review the documents tomorrow.",
    "exampleTranslation": "매니저가 내일 서류를 검토할 것이다."
  },
  {
    "id": 2,
    "english": "budget",
    "korean": "예산",
    "level": "BASIC",
    "part": "Noun",
    "type": "RC",
    "example": "The project was completed on time and within budget.",
    "exampleTranslation": "그 프로젝트는 예산 내에서 제시간에 완료되었다."
  }
]
```

#### Response Field

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id | Long | 단어 고유 ID |
| english | String | 영어 단어 |
| korean | String | 한국어 뜻 |
| level | String | 단어 난이도 (`BASIC`, `FREQUENT`, `ADVANCED`) |
| part | String | 단어 품사 (`Noun`, `Verb`, `Adjective`, `Adverb` 등) |
| type | String | TOEIC 유형 (`LC`, `RC`) |
| example | String | 영어 예문 |
| exampleTranslation | String | 예문 한국어 해석 |

#### HTTP Status Code

| 코드 | 의미 |
| --- | --- |
| 200 | 단어 목록 조회 성공 |
| 401 | 로그인하지 않은 사용자 |
| 500 | 서버 오류 |

---

### 2.2 단어 상세 조회

Method: GET
URL: `/api/words/{wordId}`

#### Header

| 이름 | 값 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| Authorization | Bearer {accessToken} | 필수 | 로그인한 사용자 식별용 JWT 토큰 |

#### Path Variable

| 이름 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| wordId | Long | 필수 | 조회할 단어의 고유 ID |

#### Response Body

```json
{
  "id": 1,
  "english": "review",
  "korean": "검토하다",
  "level": "BASIC",
  "part": "Verb",
  "type": "LC",
  "example": "The manager will review the documents tomorrow.",
  "exampleTranslation": "매니저가 내일 서류를 검토할 것이다."
}
```

#### Response Field

[2.1 단어 목록 조회](#21-단어-목록-조회) 의 항목과 동일.

#### HTTP Status Code

| 코드 | 의미 |
| --- | --- |
| 200 | 단어 조회 성공 |
| 401 | 로그인하지 않은 사용자 |
| 404 | 존재하지 않는 단어 ID |
| 500 | 서버 오류 |

---

## 3. 관리자 (Admin)

### 3.1 단어 생성

Method: POST
URL: `/api/admin/words`

새로운 단어를 시스템에 등록한다. ADMIN 권한 필수.

#### Header

| 이름 | 값 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| Authorization | Bearer {adminAccessToken} | 필수 | ADMIN 권한 사용자의 JWT 토큰 |
| Content-Type | application/json | 필수 | 요청 본문 타입 |

#### Request Body

```json
{
  "english": "candidate",
  "korean": "후보자",
  "level": "BASIC",
  "part": "Noun",
  "type": "LC",
  "example": "We are interviewing three candidates for the position.",
  "exampleTranslation": "우리는 그 직책을 위해 세 명의 지원자를 면접하고 있다."
}
```

#### Request Field

| 필드명 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| english | String | 필수 | 영어 단어 (UNIQUE) |
| korean | String | 필수 | 한국어 뜻 |
| level | String | 필수 | `BASIC` / `FREQUENT` / `ADVANCED` |
| part | String | 선택 | 품사 |
| type | String | 필수 | `LC` / `RC` |
| example | String | 선택 | 영어 예문 |
| exampleTranslation | String | 선택 | 예문 한국어 해석 |

#### Response Body

```json
{
  "id": 124,
  "english": "candidate",
  "korean": "후보자",
  "level": "BASIC",
  "part": "Noun",
  "type": "LC",
  "example": "We are interviewing three candidates for the position.",
  "exampleTranslation": "우리는 그 직책을 위해 세 명의 지원자를 면접하고 있다."
}
```

#### Response Field

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| id | Long | 새로 생성된 단어의 고유 ID |
| english | String | 등록된 영어 단어 |
| korean | String | 등록된 한국어 뜻 |
| level | String | 등록된 단어 난이도 |
| part | String | 등록된 단어 품사 |
| type | String | 등록된 단어 유형 |
| example | String | 등록된 예문 |
| exampleTranslation | String | 등록된 예문 해석 |

#### HTTP Status Code

| 코드 | 의미 |
| --- | --- |
| 201 | 단어 생성 성공 |
| 400 | 잘못된 요청 (필수 값 누락 등) |
| 401 | 로그인하지 않은 사용자 |
| 403 | 관리자 권한이 없는 사용자 |
| 409 | 이미 존재하는 english 값 |
| 500 | 서버 오류 |

---

### 3.2 단어 수정

Method: PATCH
URL: `/api/admin/words/{wordId}`

#### Header

| 이름 | 값 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| Authorization | Bearer {adminAccessToken} | 필수 | ADMIN 권한 사용자의 JWT 토큰 |
| Content-Type | application/json | 필수 | 요청 본문 타입 |

#### Path Variable

| 이름 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| wordId | Long | 필수 | 수정할 단어의 고유 ID |

#### Request Body

```json
{
  "english": "candidate",
  "korean": "지원자",
  "level": "FREQUENT",
  "part": "Noun",
  "type": "LC",
  "example": "The successful candidate will start next week.",
  "exampleTranslation": "합격한 지원자는 다음 주부터 출근할 것입니다."
}
```

PATCH 이므로 변경하려는 필드만 포함해도 된다.

#### Response Body

```json
{
  "id": 3,
  "english": "candidate",
  "korean": "지원자",
  "level": "FREQUENT",
  "part": "Noun",
  "type": "LC",
  "example": "The successful candidate will start next week.",
  "exampleTranslation": "합격한 지원자는 다음 주부터 출근할 것입니다."
}
```

#### Response Field

[3.1 단어 생성](#31-단어-생성) 의 응답 항목과 동일.

#### HTTP Status Code

| 코드 | 의미 |
| --- | --- |
| 200 | 단어 수정 성공 |
| 400 | 잘못된 요청 |
| 401 | 로그인하지 않은 사용자 |
| 403 | 관리자 권한이 없는 사용자 |
| 404 | 수정할 단어(wordId) 없음 |
| 409 | english 값 중복 |
| 500 | 서버 오류 |

---

### 3.3 단어 삭제

Method: DELETE
URL: `/api/admin/words/{wordId}`

#### Header

| 이름 | 값 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| Authorization | Bearer {adminAccessToken} | 필수 | ADMIN 권한 사용자의 JWT 토큰 |

#### Path Variable

| 이름 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| wordId | Long | 필수 | 삭제할 단어의 고유 ID |

#### Request Body

없음

#### Response

본문 없음.

#### HTTP Status Code

| 코드 | 의미 |
| --- | --- |
| 204 | 단어 삭제 성공 |
| 401 | 로그인하지 않은 사용자 |
| 403 | 관리자 권한이 없는 사용자 |
| 404 | 삭제할 단어(wordId) 없음 |
| 500 | 서버 오류 |

---

## 4. 퀴즈 (Quiz)

### 4.1 뜻→영단어 퀴즈 생성

Method: GET
URL: `/api/quizzes?type=MEANING_TO_WORD`

한국어 뜻을 보고 영어 단어를 고르는 퀴즈 문제 세트를 생성한다. 기본 20문제, 보기 4지선다.

#### Header

| 이름 | 값 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| Authorization | Bearer {accessToken} | 필수 | 로그인한 사용자 식별용 JWT 토큰 |

#### Query Parameter

| 이름 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| type | String | 필수 | `MEANING_TO_WORD` 고정 |
| level | String | 선택 | `BASIC` / `FREQUENT` / `ADVANCED` |
| count | Integer | 선택 | 문제 수 (기본 20) |

#### Response Body

```json
{
  "quizType": "MEANING_TO_WORD",
  "questions": [
    {
      "questionNumber": 1,
      "wordId": 12,
      "prompt": "검토하다",
      "choices": ["review", "submit", "depart", "expire"],
      "correctAnswer": "review"
    }
  ]
}
```

#### Response Field

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| quizType | String | 퀴즈 유형 |
| questions | Array | 문제 목록 |
| questions.questionNumber | Integer | 문제 번호 |
| questions.wordId | Long | 정답 단어 ID |
| questions.prompt | String | 화면에 보여줄 문제 (뜻) |
| questions.choices | Array<String> | 보기 4개 |
| questions.correctAnswer | String | 정답 영어 단어 |

#### HTTP Status Code

| 코드 | 의미 |
| --- | --- |
| 200 | 퀴즈 생성 성공 |
| 400 | type 파라미터 누락·오류 |
| 401 | 로그인하지 않은 사용자 |
| 500 | 서버 오류 |

---

### 4.2 영단어→뜻 퀴즈 생성

Method: GET
URL: `/api/quizzes?type=WORD_TO_MEANING`

영어 단어를 보고 한국어 뜻을 고르는 퀴즈. 4.1 과 type 파라미터만 다르며, `prompt` 가 영어 단어, `choices` 가 한국어 뜻 4개로 구성된다.

#### Response Body

```json
{
  "quizType": "WORD_TO_MEANING",
  "questions": [
    {
      "questionNumber": 1,
      "wordId": 12,
      "prompt": "review",
      "choices": ["검토하다", "제출하다", "출발하다", "만료되다"],
      "correctAnswer": "검토하다"
    }
  ]
}
```

응답 필드 / HTTP Status Code 는 [4.1](#41-뜻영단어-퀴즈-생성) 와 동일.

---

### 4.3 퀴즈 결과 저장

Method: POST
URL: `/api/quiz-results`

사용자가 퀴즈를 완료한 후 전체 문제 수, 정답 수, 점수, 문제별 정답/오답 기록을 저장한다. 저장 결과는 결과 화면(정답률, 맞힌 개수, 오답 리스트)에서 사용한다.

#### Header

| 이름 | 값 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| Authorization | Bearer {accessToken} | 필수 | 로그인한 사용자 식별용 JWT 토큰 |

#### Request Body

```json
{
  "quizType": "MEANING_TO_WORD",
  "totalQuestions": 20,
  "correctCount": 15,
  "score": 75.0,
  "details": [
    {
      "wordId": 1,
      "questionNumber": 1,
      "userAnswer": "obtain",
      "correctAnswer": "distinguish",
      "isCorrect": false
    },
    {
      "wordId": 2,
      "questionNumber": 2,
      "userAnswer": "obtain",
      "correctAnswer": "obtain",
      "isCorrect": true
    }
  ]
}
```

#### Request Field

| 필드명 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| quizType | String | 필수 | `MEANING_TO_WORD` 또는 `WORD_TO_MEANING` |
| totalQuestions | Integer | 필수 | 전체 문제 수 |
| correctCount | Integer | 필수 | 정답 개수 |
| score | Decimal | 필수 | 정답률 또는 점수 |
| details | Array | 필수 | 문제별 풀이 결과 목록 |
| details.wordId | Long | 필수 | 문제로 출제된 단어 ID |
| details.questionNumber | Integer | 필수 | 문제 번호 |
| details.userAnswer | String | 필수 | 사용자가 선택한 답 |
| details.correctAnswer | String | 필수 | 정답 |
| details.isCorrect | Boolean | 필수 | 정답 여부 |

#### Response Body

```json
{
  "quizResultId": 1,
  "quizType": "MEANING_TO_WORD",
  "totalQuestions": 20,
  "correctCount": 15,
  "score": 75.0,
  "submittedAt": "2026-05-04T03:30:00"
}
```

#### Response Field

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| quizResultId | Long | 저장된 퀴즈 결과 ID |
| quizType | String | 퀴즈 유형 |
| totalQuestions | Integer | 전체 문제 수 |
| correctCount | Integer | 정답 개수 |
| score | Decimal | 정답률 또는 점수 |
| submittedAt | DateTime | 퀴즈 제출 시간 |

#### HTTP Status Code

| 코드 | 의미 |
| --- | --- |
| 201 | 퀴즈 결과 저장 성공 |
| 400 | 요청 데이터 형식 오류 |
| 401 | 로그인하지 않은 사용자 |
| 404 | 존재하지 않는 단어 ID 포함 |
| 500 | 서버 오류 |

#### 논의사항

- userId 는 Request Body 에 받지 않고 JWT 에서 식별한다.
- score 는 백엔드에서 `correctCount / totalQuestions * 100` 으로 재계산할지, 프론트 값을 그대로 쓸지 확정 필요.

---

### 4.4 퀴즈 결과 상세 조회

Method: GET
URL: `/api/quiz-results/{quizResultId}`

저장된 퀴즈 결과를 상세 조회. 결과 화면에서 전체 문제 수, 정답 수, 점수, 문제별 정답/오답 리스트를 보여주는 데 사용.

#### Header

| 이름 | 값 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| Authorization | Bearer {accessToken} | 필수 | 로그인한 사용자 식별용 JWT 토큰 |

#### Path Variable

| 이름 | 타입 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| quizResultId | Long | 필수 | 조회할 퀴즈 결과 ID |

#### Response Body

```json
{
  "quizResultId": 1,
  "quizType": "MEANING_TO_WORD",
  "totalQuestions": 20,
  "correctCount": 15,
  "score": 75.0,
  "submittedAt": "2026-05-04T03:30:00",
  "details": [
    {
      "wordId": 1,
      "english": "distinguish",
      "korean": "구별하다",
      "questionNumber": 1,
      "userAnswer": "obtain",
      "correctAnswer": "distinguish",
      "isCorrect": false
    },
    {
      "wordId": 2,
      "english": "obtain",
      "korean": "얻다",
      "questionNumber": 2,
      "userAnswer": "obtain",
      "correctAnswer": "obtain",
      "isCorrect": true
    }
  ]
}
```

#### Response Field

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| quizResultId | Long | 퀴즈 결과 ID |
| quizType | String | 퀴즈 유형 |
| totalQuestions | Integer | 전체 문제 수 |
| correctCount | Integer | 정답 개수 |
| score | Decimal | 정답률 또는 점수 |
| submittedAt | DateTime | 제출 시간 |
| details | Array | 문제별 풀이 결과 목록 |
| details.wordId | Long | 단어 ID |
| details.english | String | 영어 단어 |
| details.korean | String | 한국어 뜻 |
| details.questionNumber | Integer | 문제 번호 |
| details.userAnswer | String | 사용자가 선택한 답 |
| details.correctAnswer | String | 정답 |
| details.isCorrect | Boolean | 정답 여부 |

#### HTTP Status Code

| 코드 | 의미 |
| --- | --- |
| 200 | 퀴즈 결과 조회 성공 |
| 401 | 로그인하지 않은 사용자 |
| 403 | 다른 사용자의 결과에 접근 |
| 404 | 퀴즈 결과 없음 |
| 500 | 서버 오류 |

#### 논의사항

- 결과 상세 조회 시 오답만 반환할지, 전체 문제 기록을 반환할지 확정 필요.
- 현재 명세는 결과 화면에서 전체 문제 리뷰 가능하도록 전체 기록 반환.
- 오답노트 기능은 `isCorrect = false` 만 필터링해서 사용 가능.

---

### 4.5 내 퀴즈 결과 목록 조회

Method: GET
URL: `/api/users/me/quiz-results`

로그인한 사용자의 퀴즈 결과 목록을 조회. 마이페이지·학습 기록·통계 화면에서 사용.

#### Header

| 이름 | 값 | 필수 여부 | 설명 |
| --- | --- | --- | --- |
| Authorization | Bearer {accessToken} | 필수 | 로그인한 사용자 식별용 JWT 토큰 |

#### Request Body

없음

#### Response Body

```json
[
  {
    "quizResultId": 1,
    "quizType": "MEANING_TO_WORD",
    "totalQuestions": 20,
    "correctCount": 15,
    "score": 75.0,
    "submittedAt": "2026-05-04T03:30:00"
  },
  {
    "quizResultId": 2,
    "quizType": "WORD_TO_MEANING",
    "totalQuestions": 20,
    "correctCount": 18,
    "score": 90.0,
    "submittedAt": "2026-05-04T04:10:00"
  }
]
```

#### Response Field

| 필드명 | 타입 | 설명 |
| --- | --- | --- |
| quizResultId | Long | 퀴즈 결과 ID |
| quizType | String | 퀴즈 유형 |
| totalQuestions | Integer | 전체 문제 수 |
| correctCount | Integer | 정답 개수 |
| score | Decimal | 정답률 또는 점수 |
| submittedAt | DateTime | 제출 시간 |

#### HTTP Status Code

| 코드 | 의미 |
| --- | --- |
| 200 | 내 퀴즈 결과 목록 조회 성공 |
| 401 | 로그인하지 않은 사용자 |
| 500 | 서버 오류 |

---

## 확장 기능

MVP 이후 추가 검토 대상. 본 문서에는 표만 두고, 상세 명세는 구현 직전 본 섹션에 채운다.

| 이름 | Method | URL | 설명 | 인증 |
| --- | --- | --- | --- | --- |
| 수준별 단어 조회 | GET | `/api/words?level=BASIC` | 난이도별 단어 목록 (2.1 의 query parameter 형태) | USER |
| 유형별 단어 조회 | GET | `/api/words?type=LC` | LC/RC 유형별 단어 (2.1 의 query parameter 형태) | USER |
| 오늘의 학습 단어 조회 | GET | `/api/daily-missions/today/words` | 오늘 학습할 추천 단어 | USER |
| 데일리 미션 조회 | GET | `/api/daily-missions/today` | 오늘의 학습 미션 (`words_studied`, `quizzes_taken`) | USER |
| 데일리 미션 갱신 | PATCH | `/api/daily-missions/today` | 학습/퀴즈 진행 상황 반영 | USER |
| 출석 기록 조회 | GET | `/api/attendance` | 사용자 출석 기록 | USER |
| 북마크 추가 | POST | `/api/bookmarks/{wordId}` | 특정 단어 북마크 | USER |
| 북마크 삭제 | DELETE | `/api/bookmarks/{wordId}` | 북마크 취소 | USER |
| 내 북마크 목록 조회 | GET | `/api/bookmarks` | 저장한 단어 목록 | USER |
| 오답노트 조회 | GET | `/api/wrong-notes` | 틀린 단어 목록 (`isCorrect=false` 기반) | USER |
| 학습 통계 조회 | GET | `/api/statistics/me` | 정답률·출석일수·학습 진행률 | USER |
| 랭킹 조회 | GET | `/api/rankings` | 사용자별 정답률·출석일수 랭킹 | USER |

---

## 변경 이력

| 일자 | 내용 |
| --- | --- |
| 2026-05-06 | 노션 명세서를 본 문서로 통합. 인증(5건)·단어(2건)·관리자(3건)·퀴즈(5건) + 확장 기능 표 정리. |
