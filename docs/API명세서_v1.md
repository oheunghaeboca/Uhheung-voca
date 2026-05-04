# API 명세서 v1

API 명세 초안 및 논의는 Notion에서 관리한다.  
개발에 반영된 확정 API는 이 문서에 정리한다.

---

## 확정 API 목록

- GET `/api/words`: 단어 목록 조회
- POST `/api/quiz-results`: 퀴즈 결과 저장
- GET `/api/quiz-results/{quizResultId}`: 퀴즈 결과 상세 조회
- GET `/api/users/me/quiz-results`: 내 퀴즈 결과 목록 조회

---

# 1. 단어 목록 조회

## API

GET `/api/words`

## 설명

DB에 저장된 TOEIC 단어 목록을 조회한다.  
단어장 화면과 퀴즈 문제 생성 기능에서 사용한다.

## Request

없음

## Response Body

```json
[
  {
    "id": 1,
    "english": "review",
    "korean": "검토하다",
    "level": "Essential",
    "part": "Verb",
    "type": "LC",
    "example": "The manager will review the documents tomorrow.",
    "exampleTranslation": "매니저가 내일 서류를 검토할 것이다."
  },
  {
    "id": 2,
    "english": "budget",
    "korean": "예산",
    "level": "Essential",
    "part": "Noun",
    "type": "RC",
    "example": "The project was completed on time and within budget.",
    "exampleTranslation": "그 프로젝트는 예산 내에서 제시간에 완료되었다."
  }
]
```

## Response Field

| 필드명 | 타입 | 설명 |
|---|---|---|
| id | Long | 단어 ID |
| english | String | 영어 단어 |
| korean | String | 한국어 뜻 |
| level | String | 단어 난이도 |
| type | String | TOEIC 유형, LC 또는 RC |
| example | String | 예문 |

## HTTP Status Code

| 코드 | 의미 |
|---|---|
| 200 | 단어 목록 조회 성공 |
| 500 | 서버 오류 |

---

# 2. 퀴즈 결과 저장

## API

POST `/api/quiz-results`

## 설명

사용자가 퀴즈를 완료한 후 전체 문제 수, 정답 수, 점수, 문제별 정답/오답 기록을 저장한다.  
저장된 결과는 결과 화면에서 정답률, 맞힌 개수, 오답 리스트를 보여주기 위해 사용한다.

## Header

| 이름 | 값 | 필수 여부 | 설명 |
|---|---|---:|---|
| Authorization | Bearer `{accessToken}` | 필수 | 로그인한 사용자 식별용 JWT 토큰 |

## Request Body

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

## Request Field

| 필드명 | 타입 | 설명 |
|---|---|---|
| quizType | String | 퀴즈 유형. `MEANING_TO_WORD` 또는 `WORD_TO_MEANING` |
| totalQuestions | Integer | 전체 문제 수 |
| correctCount | Integer | 정답 개수 |
| score | Decimal | 정답률 또는 점수 |
| details | Array | 문제별 풀이 결과 목록 |
| details.wordId | Long | 문제로 출제된 단어 ID |
| details.questionNumber | Integer | 문제 번호 |
| details.userAnswer | String | 사용자가 선택한 답 |
| details.correctAnswer | String | 정답 |
| details.isCorrect | Boolean | 정답 여부 |

## Response Body

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

## Response Field

| 필드명 | 타입 | 설명 |
|---|---|---|
| quizResultId | Long | 저장된 퀴즈 결과 ID |
| quizType | String | 퀴즈 유형 |
| totalQuestions | Integer | 전체 문제 수 |
| correctCount | Integer | 정답 개수 |
| score | Decimal | 정답률 또는 점수 |
| submittedAt | DateTime | 퀴즈 제출 시간 |

## HTTP Status Code

| 코드 | 의미 |
|---|---|
| 201 | 퀴즈 결과 저장 성공 |
| 400 | 요청 데이터 형식 오류 |
| 401 | 로그인하지 않은 사용자 |
| 404 | 존재하지 않는 단어 ID 포함 |
| 500 | 서버 오류 |

## 논의사항

- 최종 구현에서는 `userId`를 Request Body로 직접 받지 않고, JWT 토큰에서 로그인 사용자를 식별한다.
- 인증 기능 완성 전까지는 테스트 목적으로 `userId`를 Request Body에 임시 포함할지 논의가 필요하다.
- `score`는 프론트에서 계산해서 보낼지, 백엔드에서 `correctCount / totalQuestions * 100`으로 계산할지 확정이 필요하다.
- 퀴즈 결과 저장 시 `quiz_results` 테이블에는 전체 결과를 저장하고, `quiz_result_details` 테이블에는 문제별 결과를 저장한다.

---

# 3. 퀴즈 결과 상세 조회

## API

GET `/api/quiz-results/{quizResultId}`

## 설명

저장된 퀴즈 결과를 상세 조회한다.  
결과 화면에서 전체 문제 수, 정답 수, 점수, 문제별 정답/오답 리스트를 보여주기 위해 사용한다.

## Header

| 이름 | 값 | 필수 여부 | 설명 |
|---|---|---:|---|
| Authorization | Bearer `{accessToken}` | 필수 | 로그인한 사용자 식별용 JWT 토큰 |

## Path Variable

| 이름 | 타입 | 설명 |
|---|---|---|
| quizResultId | Long | 조회할 퀴즈 결과 ID |

## Response Body

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

## Response Field

| 필드명 | 타입 | 설명 |
|---|---|---|
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

## HTTP Status Code

| 코드 | 의미 |
|---|---|
| 200 | 퀴즈 결과 조회 성공 |
| 401 | 로그인하지 않은 사용자 |
| 403 | 다른 사용자의 결과에 접근 |
| 404 | 퀴즈 결과 없음 |
| 500 | 서버 오류 |

## 논의사항

- 결과 상세 조회 시 오답만 내려줄지, 전체 문제 기록을 내려줄지 확정이 필요하다.
- 현재 명세는 결과 화면에서 전체 문제 리뷰가 가능하도록 전체 문제 기록을 반환하는 방식이다.
- 오답노트 기능으로 확장할 경우 `isCorrect = false`인 데이터만 필터링해서 사용할 수 있다.

---

# 4. 내 퀴즈 결과 목록 조회

## API

GET `/api/users/me/quiz-results`

## 설명

로그인한 사용자의 퀴즈 결과 목록을 조회한다.  
마이페이지, 학습 기록, 통계 화면에서 사용할 수 있다.

## Header

| 이름 | 값 | 필수 여부 | 설명 |
|---|---|---:|---|
| Authorization | Bearer `{accessToken}` | 필수 | 로그인한 사용자 식별용 JWT 토큰 |

## Request

없음

## Response Body

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

## Response Field

| 필드명 | 타입 | 설명 |
|---|---|---|
| quizResultId | Long | 퀴즈 결과 ID |
| quizType | String | 퀴즈 유형 |
| totalQuestions | Integer | 전체 문제 수 |
| correctCount | Integer | 정답 개수 |
| score | Decimal | 정답률 또는 점수 |
| submittedAt | DateTime | 제출 시간 |

## HTTP Status Code

| 코드 | 의미 |
|---|---|
| 200 | 내 퀴즈 결과 목록 조회 성공 |
| 401 | 로그인하지 않은 사용자 |
| 500 | 서버 오류 |

## 논의사항

- MVP에서는 필수 API가 아닐 수 있다.
- 결과 화면만 구현한다면 `POST /api/quiz-results`, `GET /api/quiz-results/{quizResultId}`를 우선 구현한다.
- 학습 통계, 마이페이지, 랭킹 기능으로 확장할 때 사용할 수 있다.
