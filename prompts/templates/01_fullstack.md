# 템플릿 01 — 풀스택 (User Story 기반)

> 가장 자주 쓸 형태. User Story 1개 = 백엔드 API + 프론트 화면 한 묶음.

```
@VIBE_CODING.md 기준. 아래 작업 부탁해.

[Layer 3 - Task]
- User Story: U-XX (Story 제목)
  → 산출물/1_설계/User_Stories.md 참조
- 위치: 백엔드 + 프론트엔드 (양쪽)
- 와이어프레임: 산출물/1_설계/Wireframes.md N번 절
- API 계약: 산출물/1_설계/API_명세서.md X-Y 절
  - METHOD /api/...
  - 요청 DTO / 응답 DTO 그대로 사용
  - 에러 코드: ___
- 시퀀스: 산출물/1_설계/Sequence_Diagrams.md N번 시나리오
- DB 영향: 있음(새 V*.sql 추가) / 없음 / ERD.md N번 테이블만 사용
- 컴포넌트 분해 (FE): frontend/COMPONENTS.md 의 ___
- 디자인 토큰 (FE): frontend/STYLE_GUIDE.md theme.* 만 사용
- 인증: 필요(USER/ADMIN) / 불필요

[Layer 5 - Output]
파일별 분리 +
백엔드: Controller/Service/Repository/DTO/Entity 분리, 메서드당 한 줄 주석 +
프론트: Page/컴포넌트/Hook 분리, Styled Components, 메서드당 한 줄 주석 +
검증 방법: curl(정상 + 에러 1) + 클릭 경로 +
DoD.md 1번 체크리스트 결과(✓/✗/N/A) 표 포함
```

## 작성 시 체크
- [ ] User Story 번호 명시했나
- [ ] API 명세서 절 번호 명시했나
- [ ] 와이어프레임 절 번호 명시했나
- [ ] DB 변경 여부 명시했나
- [ ] 인증 필요 여부 명시했나
