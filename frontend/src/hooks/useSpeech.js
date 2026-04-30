import { useCallback } from 'react';

export function useSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text, lang = 'en-US') => {
    if (!supported || !text) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = lang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [supported]);

  return { supported, speak };
}
