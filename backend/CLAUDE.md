# 어흥해보카 — Backend 전용 컨텍스트

> 본 파일은 백엔드 폴더에서 Claude Code 실행 시 **루트 `CLAUDE.md` 와 자동 병합** 된다.
> **공통(5-Layer, 협업·커밋·비밀정보 규칙 등)은 루트 [`../CLAUDE.md`](../CLAUDE.md) 와 [`../VIBE_CODING.md`](../VIBE_CODING.md) 에 있음.** 본 파일에는 **백엔드 전용 Layer 2 (Context) 와 Layer 4 (Constraint)** 만 둔다.
>
> 갱신 시: 백엔드만 해당하면 본 파일, 공통이면 루트 파일들.

---

## 1. Layer 2 — Backend Context

### 1.1 스택 / 버전
- **Spring Boot 3.5.0** (Java 17 toolchain) — 계획서엔 3.4지만 Initializr 미제공으로 3.5 채택. 동작 동일.
- **Spring Data JPA** + **MySQL 8.0** (`mysql-connector-j` 런타임)
- **Spring Security** + **JWT** (`io.jsonwebtoken:jjwt-api/impl/jackson 0.12.6`)
- **Spring Boot Validation**, **Actuator** (`/actuator/health`)
- **Flyway** (`flyway-core`, `flyway-mysql`) — DB 마이그레이션
- **Lombok** (compileOnly + annotationProcessor)
- **DevTools** (developmentOnly)
- 빌드: **Gradle**

### 1.2 패키지 / 디렉토리
```
backend/
├── build.gradle
├── gradle.properties              # UTF-8, 1GB heap
└── src/main/
    ├── java/com/uhheung/voca/     # 루트 패키지
    │   └── config/                # 현재 존재하는 유일한 하위 패키지
    └── resources/
        ├── application.yml         # 공용 설정 (커밋됨)
        ├── application-local.yml   # 개인 설정 (gitignore — 직접 만들어 사용)
        ├── application-local.yml.example
        └── db/migration/           # Flyway V*.sql
            └── V1__create_initial_schema.sql
```

### 1.3 신규 코드 둘 위치 (생성 시 권장 패키지)
| 종류 | 패키지 |
|---|---|
| `@RestController` | `com.uhheung.voca.{도메인}.controller` |
| `@Service` | `com.uhheung.voca.{도메인}.service` |
| `@Repository` (JpaRepository) | `com.uhheung.voca.{도메인}.repository` |
| `@Entity` | `com.uhheung.voca.{도메인}.entity` 또는 `domain` |
| Request/Response DTO | `com.uhheung.voca.{도메인}.dto` |
| 전역 설정 (Security, Cors 등) | `com.uhheung.voca.config` |

> 도메인 예: `auth`, `user`, `word`, `quiz`, `bookmark`, `attendance`.

### 1.4 DB 스키마 (Source of Truth)
- **`backend/src/main/resources/db/migration/V*.sql` 가 SoT**. 계획서의 테이블 설계는 초안일 뿐.
- 현재 적용된 마이그레이션: `V1__create_initial_schema.sql` 한 개.
- 스키마 변경 시 **반드시** `V{다음번호}__{설명}.sql` 새 파일 추가. **머지된 V*.sql 절대 수정 금지** (Flyway 체크섬 깨짐 → 부팅 실패).

### 1.5 계획서 기준 도메인 모델 (개념적, 실 스키마는 V*.sql 기준)
```
users         : id, username, password, role(ADMIN/USER), created_at
words         : id, english, meaning, type(LC/RC)
quiz_results  : id, user_id, word_id, is_correct, quiz_date
bookmarks     : user_id, word_id  (다대다 매핑)
attendance    : id, user_id, attend_date
```

---

## 2. Layer 4 — Backend Constraint

### 2.1 계층 구조
- **Controller → Service → Repository** 3계층 엄수.
- Controller는 HTTP/검증/DTO 매핑만, 비즈니스 로직은 Service.
- **Entity 직접 반환 금지** — 항상 Request/Response DTO 사용.

### 2.2 Lombok 사용
- 권장: `@Getter`, `@Builder`, `@RequiredArgsConstructor`, `@Slf4j`, `@AllArgsConstructor` (DTO).
- `@Setter` 무분별 사용 지양 (불변 지향). Entity는 setter 대신 명시적 메서드.

### 2.3 JPA / Flyway 운영
- `spring.jpa.hibernate.ddl-auto = validate` (Flyway가 스키마, JPA는 매핑만 검증).
- Entity 필드 추가 → 새 V*.sql 마이그레이션 함께 추가.
- N+1 주의 (`@EntityGraph`, fetch join 사용 검토).

### 2.4 보안 / 인증
- 비밀번호: **BCrypt** (`PasswordEncoder`) 암호화. 평문 저장 금지.
- 인증: **JWT (jjwt 0.12.6)**. `Authorization: Bearer <token>` 헤더.
- 권한: `Role` (ADMIN / USER)로 분리. `@PreAuthorize` 또는 SecurityFilterChain 설정.
- JWT secret / DB 비밀번호는 `application-local.yml`에만. 코드/`application.yml`에 박지 말 것.

### 2.5 API 응답 규약
- 성공: 적절한 2xx (생성=201, 조회=200, 본문 없음=204).
- 에러: 4xx/5xx + 일관된 에러 응답 DTO. 중복 충돌은 `409 Conflict`, 인증 실패는 `401`, 권한 없음은 `403`, 검증 실패는 `400`.
- `@Valid` + `@Validated` 적극 사용. 글로벌 예외 처리는 `@RestControllerAdvice`.

### 2.6 패키지 네이밍
- Java: `camelCase` (메서드/필드), `PascalCase` (클래스), `UPPER_SNAKE_CASE` (상수).
- SQL: 테이블/컬럼은 `snake_case` (예: `quiz_results.is_correct`).

---

## 3. Backend 검증 방법 (Output Layer 기본값)

코드 생성 후 검증 안내에 다음을 기본으로 포함:

```bash
# 빌드
./gradlew build

# 실행
./gradlew bootRun

# 헬스체크
curl http://localhost:8080/actuator/health
# "db":{"status":"UP"} 확인

# API 호출 예 (생성한 엔드포인트에 맞춰 작성)
curl -X POST http://localhost:8080/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"pw1234"}'
```

테스트 코드(`src/test/java/...`)를 추가했다면 `./gradlew test`도 안내.

---

## 4. Backend 작업 시작 프롬프트 단축형

```
[Layer 3 - Task]
- 도메인: (auth / word / quiz / ...)
- 메서드 + 경로:
- 요청 DTO:
- 응답 DTO:
- 에러 케이스:
- DB 변경: 있음(새 V*.sql) / 없음
- 인증: 필요(USER/ADMIN) / 불필요

[Layer 5 - Output]
파일별 분리 + 메서드당 한 줄 주석 + curl 검증 예시.
```
