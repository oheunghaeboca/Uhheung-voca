import styled from 'styled-components';
import { useSpeech } from '../../hooks/useSpeech';

// 언어 코드에 대응하는 깃발 이모지 — 기본 미국/영국, 추후 호주(en-AU) 확장 가능
const FLAG = { 'en-US': '🇺🇸', 'en-GB': '🇬🇧', 'en-AU': '🇦🇺' };

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1.5px solid #F6D8B8;
  border-radius: ${({ theme }) => theme.radius.full};
  background: #fff;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
    border-color: #F6841F;
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  &:active {
    transform: scale(0.94);
  }
`;

export default function PronounceButton({ text, lang = 'en-US', label }) {
  const { supported, speak } = useSpeech();
  if (!supported) return null;
  // 기본 라벨은 깃발 이모지. 부모 카드의 onClick 과 충돌하지 않도록 stopPropagation 적용
  const displayLabel = label ?? FLAG[lang] ?? '🔊';
  const handleClick = (e) => {
    e.stopPropagation();
    speak(text, lang);
  };
  return (
    <Btn type="button" aria-label={`${lang} 발음 듣기`} onClick={handleClick}>
      {displayLabel}
    </Btn>
  );
}
