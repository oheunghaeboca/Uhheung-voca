# 어흥해보카 — Style Guide / Design Tokens

- **버전**: v1.0
- **작성일**: 2026-04-30
- **목적**: 디자인 일관성 유지를 위한 토큰. Styled Components의 `<ThemeProvider>` 에 그대로 주입한다.
- **참조**: `frontend/CLAUDE.md`, `산출물/1_설계/Wireframes.md`, `COMPONENTS.md`

> 컴포넌트 작성 시 **이 토큰 외 색상/스페이싱 사용 금지**. 새 토큰이 필요하면 본 문서 먼저 갱신.

---

## 1번. 디자인 컨셉

| 요소 | 방향 |
|---|---|
| **무드** | 친근한 호랑이 마스코트(어흥), 명랑하고 학습 동기 부여 |
| **주조색** | 따뜻한 오렌지 (호랑이 컬러) — Primary |
| **보조색** | 차분한 네이비 — 학습 신뢰감 |
| **온도** | 미디엄 (블루 라이트가 아닌, 살짝 따뜻한 무채색) |
| **타이포** | 본문 시스템 폰트, 한글 우선 가독성 |
| **모서리** | 8~12px 라운드 — 부드러움 |
| **음영** | 약한 그림자 (0~2단계만) — 평면 미감 유지 |

---

## 2번. Color Tokens

### 2-1. Primary / Secondary

| 토큰 | Hex | 용도 |
|---|---|---|
| `colors.primary.50`  | `#FFF4E6` | 배경 연한 강조 (Today Mission Card 배경 등) |
| `colors.primary.100` | `#FFE0B3` | 배지 배경 |
| `colors.primary.500` | `#F6841F` | **메인 — 버튼, 활성 메뉴, 강조** (호랑이 오렌지) |
| `colors.primary.600` | `#D86A0C` | hover / pressed |
| `colors.primary.700` | `#A4500A` | 텍스트 위 강조 (작은 라벨) |
| `colors.secondary.500` | `#1E3A5F` | 네이비 — 헤더, 강조 텍스트 |
| `colors.secondary.700` | `#152744` | hover |

### 2-2. Semantic (의미 기반)

| 토큰 | Hex | 용도 |
|---|---|---|
| `colors.success` | `#16A34A` | 정답, 출석 인정, ⭐ 색 |
| `colors.warning` | `#F59E0B` | 정답률 50~70% 영역 |
| `colors.error`   | `#DC2626` | 오답, 401/409 알림 |
| `colors.info`    | `#0EA5E9` | 안내 토스트 |

### 2-3. Neutral (Grayscale)

| 토큰 | Hex | 용도 |
|---|---|---|
| `colors.bg`        | `#FAFAF7` | 페이지 배경 (살짝 따뜻한 화이트) |
| `colors.surface`   | `#FFFFFF` | 카드/모달 배경 |
| `colors.border`    | `#E5E5E0` | 구분선, input 테두리 |
| `colors.text.primary`   | `#1F2933` | 본문 |
| `colors.text.secondary` | `#52606D` | 보조 텍스트 |
| `colors.text.muted`     | `#9AA5B1` | 캡션, placeholder |
| `colors.text.inverse`   | `#FFFFFF` | 어두운 배경 위 텍스트 |

### 2-4. 단어 수준 / 유형 라벨 컬러

| 토큰 | Hex | 용도 |
|---|---|---|
| `colors.level.essential` | `#16A34A` | `[ESSENTIAL]` 배지 |
| `colors.level.frequent`  | `#0EA5E9` | `[FREQUENT]` 배지 |
| `colors.level.advanced`  | `#7C3AED` | `[ADVANCED]` 배지 |
| `colors.type.LC`         | `#F59E0B` | `[LC]` 배지 (Listening) |
| `colors.type.RC`         | `#1E3A5F` | `[RC]` 배지 (Reading) |

---

## 3번. Typography

### 3-1. Font Family

```js
fonts.body = "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
fonts.mono = "'JetBrains Mono', 'D2Coding', monospace"
```

> Pretendard는 한글·영문 혼용 가독성 우수. CDN 로드 또는 `@fontsource/pretendard` 패키지로 도입 가능. **새 폰트 추가는 학생 결정 후**.

### 3-2. Type Scale

| 토큰 | Size | Line-height | Weight | 용도 |
|---|---|---|---|---|
| `fontSize.xs`   | 12px | 16px | 400 | 캡션, 작은 라벨 |
| `fontSize.sm`   | 14px | 20px | 400 | 보조 텍스트 |
| `fontSize.base` | 16px | 24px | 400 | 본문 (기본) |
| `fontSize.lg`   | 18px | 28px | 500 | 강조 본문 |
| `fontSize.xl`   | 20px | 28px | 600 | 카드 제목 |
| `fontSize.2xl`  | 24px | 32px | 700 | 페이지 서브 제목 |
| `fontSize.3xl`  | 30px | 36px | 700 | 페이지 제목 |
| `fontSize.4xl`  | 36px | 44px | 800 | Hero (로그인 등) |

### 3-3. Font Weight

| 토큰 | 값 | 용도 |
|---|---|---|
| `fontWeight.normal` | 400 | 본문 |
| `fontWeight.medium` | 500 | 강조 |
| `fontWeight.bold`   | 700 | 제목 |
| `fontWeight.heavy`  | 800 | Hero |

---

## 4번. Spacing (4px 단위)

| 토큰 | px | 용도 |
|---|---|---|
| `spacing[0]`  | 0 | — |
| `spacing[1]`  | 4 | 매우 좁은 간격 |
| `spacing[2]`  | 8 | 작은 간격 |
| `spacing[3]`  | 12 | 기본 작은 간격 |
| `spacing[4]`  | 16 | **표준 간격** |
| `spacing[5]`  | 20 | 카드 안쪽 패딩 |
| `spacing[6]`  | 24 | 섹션 간격 |
| `spacing[8]`  | 32 | 큰 간격 |
| `spacing[10]` | 40 | 페이지 패딩 |
| `spacing[12]` | 48 | 페이지 상단 여백 |
| `spacing[16]` | 64 | Hero 영역 |

> Tailwind 식 1=4px 환산. 자유 px 사용 금지.

---

## 5번. Border Radius

| 토큰 | px | 용도 |
|---|---|---|
| `radius.none` | 0 | — |
| `radius.sm`   | 4 | 작은 배지 |
| `radius.md`   | 8 | **표준 — Input, Button** |
| `radius.lg`   | 12 | Card, Modal |
| `radius.xl`   | 20 | 큰 카드 |
| `radius.full` | 9999 | 원형 (아바타, Pill) |

---

## 6번. Shadow

| 토큰 | 값 | 용도 |
|---|---|---|
| `shadow.none` | `none` | — |
| `shadow.sm`   | `0 1px 2px rgba(0,0,0,0.05)` | Card 살짝 |
| `shadow.md`   | `0 4px 12px rgba(0,0,0,0.08)` | **표준 — Card** |
| `shadow.lg`   | `0 10px 24px rgba(0,0,0,0.12)` | Modal, Dropdown |
| `shadow.focus`| `0 0 0 3px rgba(246,132,31,0.35)` | input focus ring (primary 기준) |

> 그림자 3단계만 사용. 그 이상은 시각적 노이즈.

---

## 7번. Z-Index 스케일

| 토큰 | 값 | 용도 |
|---|---|---|
| `z.base`    | 0 | 일반 |
| `z.dropdown`| 100 | UserMenu 드롭다운 |
| `z.sticky`  | 200 | sticky 헤더 |
| `z.overlay` | 1000 | Modal 오버레이 |
| `z.modal`   | 1100 | Modal 본체 |
| `z.toast`   | 1200 | Toast (최상단) |

---

## 8번. Breakpoints (반응형)

| 토큰 | min-width | 디바이스 |
|---|---|---|
| `bp.sm` | 640px  | 모바일 가로 |
| `bp.md` | 768px  | 태블릿 |
| `bp.lg` | 1024px | 데스크톱 (기본 디자인 기준) |
| `bp.xl` | 1280px | 큰 데스크톱 |

> 기본 디자인은 데스크톱 우선. 모바일은 1차 출시 후 보강 (Phase 2).

---

## 9번. Motion / Transition

| 토큰 | 값 | 용도 |
|---|---|---|
| `transition.fast`   | `120ms ease-out` | hover, active |
| `transition.normal` | `200ms ease-out` | 기본 상태 변화 |
| `transition.slow`   | `320ms ease-in-out` | Modal open/close |
| `transition.bounce` | `360ms cubic-bezier(0.34, 1.56, 0.64, 1)` | 별 토글 등 강조 |

---

## 10번. theme.js 구현 예시

```js
// src/styles/theme.js
export const theme = {
  colors: {
    primary:   { 50: '#FFF4E6', 100: '#FFE0B3', 500: '#F6841F', 600: '#D86A0C', 700: '#A4500A' },
    secondary: { 500: '#1E3A5F', 700: '#152744' },
    success: '#16A34A',
    warning: '#F59E0B',
    error:   '#DC2626',
    info:    '#0EA5E9',
    bg:      '#FAFAF7',
    surface: '#FFFFFF',
    border:  '#E5E5E0',
    text: {
      primary: '#1F2933', secondary: '#52606D', muted: '#9AA5B1', inverse: '#FFFFFF',
    },
    level: { essential: '#16A34A', frequent: '#0EA5E9', advanced: '#7C3AED' },
    type:  { LC: '#F59E0B', RC: '#1E3A5F' },
  },
  fonts: {
    body: "'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'D2Coding', monospace",
  },
  fontSize: {
    xs: '12px', sm: '14px', base: '16px', lg: '18px', xl: '20px',
    '2xl': '24px', '3xl': '30px', '4xl': '36px',
  },
  fontWeight: { normal: 400, medium: 500, bold: 700, heavy: 800 },
  lineHeight: {
    xs: '16px', sm: '20px', base: '24px', lg: '28px', xl: '28px',
    '2xl': '32px', '3xl': '36px', '4xl': '44px',
  },
  spacing: {
    0: '0', 1: '4px', 2: '8px', 3: '12px', 4: '16px', 5: '20px', 6: '24px',
    8: '32px', 10: '40px', 12: '48px', 16: '64px',
  },
  radius: { none: '0', sm: '4px', md: '8px', lg: '12px', xl: '20px', full: '9999px' },
  shadow: {
    none: 'none',
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
    lg: '0 10px 24px rgba(0,0,0,0.12)',
    focus: '0 0 0 3px rgba(246,132,31,0.35)',
  },
  z: { base: 0, dropdown: 100, sticky: 200, overlay: 1000, modal: 1100, toast: 1200 },
  bp: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
  transition: {
    fast: '120ms ease-out',
    normal: '200ms ease-out',
    slow: '320ms ease-in-out',
    bounce: '360ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};
```

### App에서 적용

```jsx
// src/App.jsx
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {/* Router ... */}
    </ThemeProvider>
  );
}
```

### 컴포넌트에서 사용

```jsx
import styled from 'styled-components';

const PrimaryButton = styled.button`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.text.inverse};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[5]}`};
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: background ${({ theme }) => theme.transition.fast};

  &:hover { background: ${({ theme }) => theme.colors.primary[600]}; }
  &:focus-visible { box-shadow: ${({ theme }) => theme.shadow.focus}; }
`;
```

---

## 11번. GlobalStyle (권장)

```js
// src/styles/GlobalStyle.js
import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body {
    font-family: ${({ theme }) => theme.fonts.body};
    font-size: ${({ theme }) => theme.fontSize.base};
    line-height: ${({ theme }) => theme.lineHeight.base};
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.bg};
    -webkit-font-smoothing: antialiased;
  }
  button, input { font-family: inherit; font-size: inherit; }
  a { color: inherit; text-decoration: none; }
`;
```

---

## 12번. Vibe Coding 활용 가이드

LLM에 컴포넌트 만들 때:

```
[Layer 4 - Constraint 추가]
- 색상은 theme.colors의 토큰만 사용. 하드코딩된 hex 금지.
- 간격은 theme.spacing[N]만 사용. 임의 px 금지.
- Border radius는 theme.radius만 사용.
- 컴포넌트는 Styled Components로 작성. inline style 금지.
- (참조: frontend/STYLE_GUIDE.md)
```

> 이 한 블록을 프롬프트에 첨부하면 LLM이 "임의 색·임의 px"를 절대 안 쓴다 — 가장 강력한 일관성 도구.

---

## 13번. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|---|---|---|
| v1.0 | 2026-04-30 | 컬러/타이포/스페이싱/라운드/그림자/모션 토큰 초안, theme.js 예시 |
