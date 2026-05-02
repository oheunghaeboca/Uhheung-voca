import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../ui/Button.jsx';

/**
 * 랜딩 페이지 최상단 Hero 섹션.
 * - 호랑이 emoji 뱃지 + 메인 타이틀 + 부제 + 2개 CTA + 통계 3개.
 * - 시안의 landing-screen.tsx 카피/구조를 styled-components 로 옮긴 형태.
 */
const Section = styled.section`
  padding: ${({ theme }) => theme.spacing[16]} ${({ theme }) => theme.spacing[6]};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[50]} 0%,
    ${({ theme }) => theme.colors.bg} 60%
  );
  text-align: center;
`;

const Inner = styled.div`
  max-width: 880px;
  margin: 0 auto;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[5]};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primary[50]};
  border: 1px solid ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['4xl']};
  line-height: ${({ theme }) => theme.lineHeight['4xl']};
  font-weight: ${({ theme }) => theme.fontWeight.heavy};
  color: ${({ theme }) => theme.colors.text.primary};
  letter-spacing: -0.02em;
`;

const Highlight = styled.span`
  color: ${({ theme }) => theme.colors.primary[500]};
`;

const Lead = styled.p`
  margin: ${({ theme }) => theme.spacing[6]} auto 0;
  max-width: 640px;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSize.lg};
  line-height: ${({ theme }) => theme.lineHeight.lg};
`;

const Actions = styled.div`
  margin-top: ${({ theme }) => theme.spacing[10]};
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: center;
`;

const BigButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const Stats = styled.div`
  margin-top: ${({ theme }) => theme.spacing[16]};
  padding-top: ${({ theme }) => theme.spacing[8]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing[8]};
`;

const StatItem = styled.div``;

const StatNum = styled.p`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.heavy};
  color: ${({ theme }) => theme.colors.primary[500]};
`;

const StatLabel = styled.p`
  margin-top: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export default function Hero() {
  const navigate = useNavigate();
  const goLogin = () => navigate('/login');

  return (
    <Section>
      <Inner>
        <Badge>
          <span role="img" aria-label="tiger">🐯</span>
          <span>어흥해보카</span>
        </Badge>
        <Title>
          호랑이처럼 강해지는<br />
          <Highlight>영단어 실력</Highlight>
        </Title>
        <Lead>
          대학생을 위한 체계적인 영단어 학습 플랫폼.<br />
          매일 20단어씩 학습하고, 퀴즈로 실력을 확인하세요!
        </Lead>
        <Actions>
          <BigButton type="button" onClick={goLogin}>
            🔥 지금 시작하기
          </BigButton>
          <BigButton type="button" $variant="ghost" onClick={goLogin}>
            이미 계정이 있어요
          </BigButton>
        </Actions>
        <Stats>
          <StatItem>
            <StatNum>60+</StatNum>
            <StatLabel>엄선된 단어</StatLabel>
          </StatItem>
          <StatItem>
            <StatNum>3</StatNum>
            <StatLabel>학습 등급</StatLabel>
          </StatItem>
          <StatItem>
            <StatNum>70%</StatNum>
            <StatLabel>출석 기준</StatLabel>
          </StatItem>
        </Stats>
      </Inner>
    </Section>
  );
}
