import styled from 'styled-components';

/**
 * 학습 흐름을 3단계로 설명하는 섹션.
 * 단계 번호 원 + 제목 + 설명. 회색 배경(muted) 배경으로 위/아래 섹션과 시각적으로 분리.
 */
const STEPS = [
  { n: 1, title: '오늘의 단어 학습', desc: '매일 제공되는 20개의 단어를 예문과 함께 학습합니다.' },
  { n: 2, title: '퀴즈 응시', desc: '학습한 단어에 대한 퀴즈를 풀어 실력을 확인합니다.' },
  { n: 3, title: '출석 인정 & 랭킹', desc: '70% 이상 정답 시 출석 인정! 연속 출석과 정답률로 랭킹에 도전하세요.' },
];

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing[16]} ${({ theme }) => theme.spacing[6]};
  background: ${({ theme }) => theme.colors.bg};
`;

const Inner = styled.div`
  max-width: 880px;
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

const StepList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

const StepRow = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[6]};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const StepNum = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.heavy};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

const StepDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export default function HowItWorks() {
  return (
    <Section>
      <Inner>
        <Heading>
          <H2>이렇게 학습해요</H2>
        </Heading>
        <StepList>
          {STEPS.map((s) => (
            <StepRow key={s.n}>
              <StepNum aria-hidden="true">{s.n}</StepNum>
              <div>
                <StepTitle>{s.title}</StepTitle>
                <StepDesc>{s.desc}</StepDesc>
              </div>
            </StepRow>
          ))}
        </StepList>
      </Inner>
    </Section>
  );
}
