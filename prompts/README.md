# 어흥해보카 — Prompts 템플릿

> Vibe Coding 프롬프트의 **버전관리 저장소**.
> 원본 가이드: [`../VIBE_CODING.md`](../VIBE_CODING.md) — 본 폴더는 그 운영 사본이다.

---

## 1. 폴더 구조

```
prompts/
├── README.md                  # 이 파일
├── templates/                 # 작업 종류별 빈 템플릿 (복붙용)
│   ├── 01_fullstack.md        # User Story 기반 풀스택 (가장 자주 씀)
│   ├── 02_backend_api.md      # 백엔드 단독 API 추가
│   ├── 03_frontend_screen.md  # 프론트 단독 화면 추가
│   ├── 04_db_migration.md     # DB 스키마 변경 (V*.sql)
│   ├── 05_debug_refine.md     # 디버깅 / Refining
│   └── 06_meta.md             # Layer 채우기 막힐 때 메타 프롬프트
└── CHANGELOG.md               # 템플릿 자체의 버전 변경 이력
```

---

## 2. 사용 규칙

### 2.1 새 작업 시작
1. `templates/` 에서 작업 종류에 맞는 파일 선택 → 본문 복사
2. Layer 3(Task) / Layer 5(Output)를 채워 LLM에 입력
3. 결과 검토 후 머지 (`Examining` 단계)

### 2.2 템플릿 자체 갱신
- 컨벤션이 바뀌면 `templates/*.md` 갱신 + `CHANGELOG.md` 한 줄 추가
- **원본인 `VIBE_CODING.md` 도 동시 갱신** — 두 파일이 어긋나면 안 됨

---

## 3. 자주 쓰는 단축형

매 요청 첫 줄:
```
@VIBE_CODING.md 기준. 아래 작업 부탁해.
```

폴더별로 컨텍스트 자동 병합:
- 백엔드 폴더에서 시작 → 루트 + `backend/CLAUDE.md`
- 프론트 폴더에서 시작 → 루트 + `frontend/CLAUDE.md`
- 양쪽 동시 → 루트에서 시작 + `+ 양쪽 CLAUDE.md` 직접 명시

---

## 4. 산출물 첨부 매트릭스 (요약)

| 작업 종류 | 필수 첨부 |
|---|---|
| 백엔드 신규 API | ERD / API 명세서 / Sequence / DoD |
| 프론트 신규 화면 | Wireframes / COMPONENTS / STYLE_GUIDE / API 명세서 |
| 풀스택 한 기능 | 위 둘 다 + ERD + Sequence |
| DB 스키마 변경 | ERD / 기존 V*.sql / DoD |
| 버그 수정 | (해당 기능의) Sequence + AC |

> 자세한 내용은 [`../VIBE_CODING.md`](../VIBE_CODING.md) 11.2절.
