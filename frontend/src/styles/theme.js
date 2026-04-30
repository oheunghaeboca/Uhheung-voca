// Design tokens — STYLE_GUIDE.md SoT. 직접 hex / px 사용 금지, 토큰 추가는 STYLE_GUIDE 먼저 갱신.
export const theme = {
  colors: {
    primary: { 50: '#FFF4E6', 100: '#FFE0B3', 500: '#F6841F', 600: '#D86A0C', 700: '#A4500A' },
    secondary: { 500: '#1E3A5F', 700: '#152744' },
    success: '#16A34A',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#0EA5E9',
    bg: '#FAFAF7',
    surface: '#FFFFFF',
    border: '#E5E5E0',
    text: {
      primary: '#1F2933',
      secondary: '#52606D',
      muted: '#9AA5B1',
      inverse: '#FFFFFF',
    },
    level: { essential: '#16A34A', frequent: '#0EA5E9', advanced: '#7C3AED' },
    type: { LC: '#F59E0B', RC: '#1E3A5F' },
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
