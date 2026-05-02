import { useSpeech } from '../../hooks/useSpeech';

export default function PronounceButton({ text, lang = 'en-US' }) {
  const { supported, speak } = useSpeech();
  if (!supported) return null;
  return (
    <button type="button" aria-label="발음 듣기" onClick={() => speak(text, lang)}>🔊</button>
  );
}
