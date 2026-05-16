import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../ui/Button.jsx';

/**
 * 페이지 하단의 최종 CTA. 큰 호랑이 emoji + 한 줄 카피 + 버튼.
 */
const Section = styled.section`
  padding: ${({ theme }) => theme.spacing[16]} ${({ theme }) => theme.spacing[6]};
  text-align: center;
`;

const Emoji = styled.div`
  font-size: 64px;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const H2 = styled.h2`
  font-size: ${({ theme }) => theme.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Lead = styled.p`
  margin-top: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const BigButton = styled(Button)`
  margin-top: ${({ theme }) => theme.spacing[8]};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

export default function CTASection() {
  const navigate = useNavigate();
  return (
    <Section>
      <Emoji aria-hidden="true">🐯</Emoji>
      <H2>어흥! 오늘부터 시작해볼까요?</H2>
      <Lead>호랑이처럼 용맹하게, 영단어 정복의 길을 함께해요!</Lead>
      <BigButton type="button" onClick={() => navigate('/login')}>
        무료로 시작하기
      </BigButton>
    </Section>
  );
}
