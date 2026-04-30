# 템플릿 03 — 프론트 단독 화면 추가

> 프론트엔드 폴더에서 실행 → `루트 CLAUDE.md` + `frontend/CLAUDE.md` 자동 병합.

```
@VIBE_CODING.md + frontend/CLAUDE.md 기준.

[Layer 3 - Task]
- 화면: (Wireframes.md N번 절)
- 라우트: /xxx
- User Story: U-XX (선택)
- 컴포넌트 분해 (COMPONENTS.md 우선 검색):
  - Page: src/pages/{도메인}/{Page}.jsx
  - 재사용: ___
  - UI Kit: ___
  - Hook: ___
- 호출 API: src/api/{도메인}.js 모듈 함수 (axios 직접 import 금지)
- 사용자 동작: (클릭/입력 → 결과)
- 인증: ProtectedRoute 안 / 공개

[Layer 5 - Output]
- Page + 신규 컴포넌트 파일별 분리
- Styled Components (theme.* 토큰만 사용 — hex/px 하드코딩 금지)
- 컴포넌트당 한 줄 설명 주석
- 클릭 경로 검증 안내 (예: "/login → ID/PW 입력 → 로그인 → /dashboard")
- npm run lint 통과 안내
```

## 자주 빠뜨리는 것
- [ ] `STYLE_GUIDE.md` theme 토큰만 사용 (직접 hex/px 금지)
- [ ] `COMPONENTS.md` 에 비슷한 컴포넌트가 이미 있는지 먼저 검색
- [ ] axios 직접 import 금지 — `src/api/{도메인}.js` 모듈만 사용
- [ ] react-hooks/exhaustive-deps 무시 금지
