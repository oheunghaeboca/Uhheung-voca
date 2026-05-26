import { useCallback } from 'react';

export function useSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const speak = useCallback((text, lang = 'en-US', rate = 0.9) => {
    if (!supported || !text) return;
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = rate;
    // 이전 재생 중단 후 새 발음 시작 — 빠른 연타 시 끊김 방지
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  }, [supported]);

  return { supported, speak };
}
