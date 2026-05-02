import styled from 'styled-components';
import Card from '../ui/Card.jsx';

/**
 * 랜딩 Features 섹션. 4개의 카드(아이콘 emoji + 제목 + 설명).
 * 시안에서는 lucide-react 아이콘을 썼지만, 의존성 추가 금지 제약에 따라
 * emoji 로 대체. 의미는 시안과 동일하게 유지.
 */
const FEATURES = [
  { icon: '📚', title: '등급별 단어 학습', desc: '필수, 빈출, 고득점 단어를 체계적으로 학습' },
  { icon: '🔥', title: '매일 20단어 학습', desc: '매일 새로운 단어로 꾸준히 실력 향상' },
  { icon: '🧠', title: '퀴즈로 복습', desc: '학습한 단어를 퀴즈로 확인하고 기억력 강화' },
  { icon: '🏆', title: '랭킹 시스템', desc: '다른 유저와 경쟁하며 동기 부여' },
];

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing[16]} ${({ theme }) => theme.spacing[6]};
`;

const Inner = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Heading = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[12]};
`;

const H2 = styled.h2`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Sub = styled.p`
  margin-top: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing[5]};

  @media (max-width: ${({ theme }) => theme.bp.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: ${({ theme }) => theme.bp.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing[6]};
  transition: border-color ${({ theme }) => theme.transition.fast},
    box-shadow ${({ theme }) => theme.transition.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[100]};
    box-shadow: ${({ theme }) => theme.shadow.lg};
  }
`;

const IconBox = styled.div`
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary[50]};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const CardDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: ${({ theme }) => theme.lineHeight.sm};
`;

export default function Features() {
  return (
    <Section>
      <Inner>
        <Heading>
          <H2>어흥해보카의 특별함</H2>
          <Sub>효과적인 영단어 학습을 위한 모든 것</Sub>
        </Heading>
        <Grid>
          {FEATURES.map((f) => (
            <FeatureCard key={f.title}>
              <IconBox aria-hidden="true">{f.icon}</IconBox>
              <CardTitle>{f.title}</CardTitle>
              <CardDesc>{f.desc}</CardDesc>
            </FeatureCard>
          ))}
        </Grid>
      </Inner>
    </Section>
  );
}
