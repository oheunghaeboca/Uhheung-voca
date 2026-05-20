import styled from 'styled-components';
import { useSpeech } from '../../hooks/useSpeech';

const FLAG = { 'en-US': '🇺🇸', 'en-GB': '🇬🇧' };

const Btn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border: 1.5px solid ${({ theme }) => theme.colors.primary[100]};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.1s;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[100]};
    border-color: ${({ theme }) => theme.colors.primary[500]};
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  &:active {
    transform: scale(0.94);
  }
`;

export default function PronounceButton({ text, lang = 'en-US', label }) {
  const { supported, speak } = useSpeech();
  if (!supported) return null;
  return (
    <Btn type="button" aria-label={`${label ?? lang} 발음 듣기`} onClick={() => speak(text, lang)}>
      🔊{label && ` ${label}`}
    </Btn>
  );
}