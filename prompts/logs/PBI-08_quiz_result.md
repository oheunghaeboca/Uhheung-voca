# PBI-08 테스트 결과 확인 Prompt Log

## 1. 기본 정보

- PBI ID: PBI-08
- 기능명: 테스트 결과 확인
- 담당자:
- 브랜치: feature/quiz-result
- 대상 영역: BE / Integration
- 관련 API:
  - POST /api/quiz-results
  - GET /api/quiz-results/{quizResultId}
  - GET /api/users/me/quiz-results
- 관련 DB:
  - users
  - words
  - quiz_results
  - quiz_result_details

---

## 2. Prompt v1

### 작성 목적

사용자가 퀴즈를 완료한 후 퀴즈 결과와 문제별 정답/오답 상세 기록을 저장하고, 결과 화면에서 다시 조회할 수 있는 API를 구현하기 위함.

### Prompt

Spring Boot 3.5, Java 17, JPA 기반 프로젝트에서 퀴즈 결과 저장 및 조회 API를 구현해줘.

프로젝트는 어흥해보카이며, 대학생을 위한 TOEIC 영어 단어 학습 웹앱이다.

구현할 API는 다음과 같다.

1. POST /api/quiz-results
- 퀴즈 결과를 저장한다.
- quiz_results 테이블에 전체 결과를 저장한다.
- quiz_result_details 테이블에 문제별 결과를 저장한다.
- 저장 성공 시 quizResultId를 반환한다.

2. GET /api/quiz-results/{quizResultId}
- 저장된 퀴즈 결과와 문제별 상세 결과를 조회한다.
- 결과 화면에서 정답 수, 정답률, 오답 리스트를 보여줄 수 있어야 한다.

3. GET /api/users/me/quiz-results
- 로그인한 사용자의 퀴즈 결과 목록을 조회한다.
- MVP 필수는 아니지만 마이페이지/통계 확장 기능에서 사용할 수 있다.

DB 테이블은 Flyway로 이미 생성되어 있다.

quiz_results 컬럼:
- id
- user_id
- quiz_type
- total_questions
- correct_count
- score
- submitted_at

quiz_result_details 컬럼:
- id
- quiz_result_id
- word_id
- question_number
- user_answer
- correct_answer
- is_correct

조건:
- 패키지는 com.uhheung.voca.quizresult를 사용한다.
- Controller → Service → Repository 구조를 따른다.
- Entity를 직접 반환하지 않고 Request/Response DTO를 사용한다.
- API 명세서의 Request/Response 형식을 유지한다.
- words 테이블과 연관된 wordId가 존재하지 않을 경우 예외 처리한다.
- 현재 인증 기능이 완성되지 않았을 수 있으므로, 임시 개발 단계에서는 userId를 request에 포함하는 방식과 JWT 기반 방식 중 어떤 부분을 수정해야 하는지도 설명해줘.
- 최종 구조에서는 JWT 토큰에서 로그인 사용자를 식별하는 방식으로 확장 가능해야 한다.

출력:
- 생성해야 할 파일 목록
- 각 파일의 코드
- 검증 방법
- 예상 요청/응답 JSON
- Postman 테스트 순서

---

## 3. 검증 방법

- MySQL에 users, words 데이터가 존재하는지 확인한다.
- POST /api/quiz-results 요청으로 결과 저장을 테스트한다.
- quiz_results 테이블에 전체 결과가 저장되는지 확인한다.
- quiz_result_details 테이블에 문제별 결과가 저장되는지 확인한다.
- GET /api/quiz-results/{quizResultId} 요청으로 결과 상세 조회가 되는지 확인한다.
- API 명세서와 응답 필드가 일치하는지 확인한다.

---

## 4. 검증 결과

작성 예정

---

## 5. Prompt 수정 기록

작성 예정

---

## 6. 최종 반영 여부

- PR 번호:
- Merge 여부:
- 남은 이슈:
