import styled from 'styled-components';

/**
 * 랜딩 페이지 전용 footer. 짧은 카피라이트 한 줄.
 * 앱 내부 페이지에서 쓰는 layout/Footer 와 분리해, 마케팅 페이지의 카피를 유지.
 */
const Foot = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing[8]} ${({ theme }) => theme.spacing[6]};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

export default function LandingFooter() {
  return (
    <Foot>
      <p>© {new Date().getFullYear()} 어흥해보카. 대학생을 위한 영단어 학습 플랫폼</p>
    </Foot>
  );
}
