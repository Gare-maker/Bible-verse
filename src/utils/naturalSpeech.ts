'use client';

export interface VoiceOption {
  name: string;
  lang: string;
  isNatural: boolean;
  voiceObj: SpeechSynthesisVoice;
}

/**
 * Ranks available browser voices to prioritize warm, human-sounding Neural/Natural voices
 * (e.g. Microsoft Natural Online voices on Windows, Google Neural voices on Chrome, Apple Enhanced voices).
 */
export function getRankedHumanVoices(): VoiceOption[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }

  const rawVoices = window.speechSynthesis.getVoices();
  const englishVoices = rawVoices.filter((v) => v.lang.toLowerCase().startsWith('en'));
  const pool = englishVoices.length > 0 ? englishVoices : rawVoices;

  const scored = pool.map((v) => {
    const n = v.name.toLowerCase();
    let score = 0;

    // Prioritize Neural / Online Natural voices
    if (n.includes('natural')) score += 100;
    if (n.includes('online')) score += 80;
    if (n.includes('neural')) score += 80;
    if (n.includes('andrew') || n.includes('brian') || n.includes('christopher') || n.includes('aria') || n.includes('jenny') || n.includes('steffan') || n.includes('guy')) {
      score += 50;
    }
    if (n.includes('google uk english male') || n.includes('google us english')) {
      score += 65;
    }
    if (n.includes('premium') || n.includes('enhanced') || n.includes('siri')) {
      score += 60;
    }
    if (n.includes('daniel') || n.includes('samantha') || n.includes('alex') || n.includes('ava')) {
      score += 40;
    }
    if (v.lang === 'en-US' || v.lang === 'en-GB') {
      score += 15;
    }

    const isNatural = score >= 50;
    return {
      name: v.name.replace(/Microsoft |Online \(Natural\) - /g, '').trim(),
      lang: v.lang,
      isNatural,
      voiceObj: v,
      score,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored;
}

/**
 * Normalizes biblical text for natural human-sounding cadence and pronunciation
 */
export function formatScriptureForHumanSpeech(text: string): string {
  return text
    .replace(/LORD/g, 'Lord')
    .replace(/YHWH/g, 'Yahweh')
    .replace(/—/g, ', ')
    .replace(/;/g, '; ')
    .replace(/:/g, ': ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface SpeakVerseQueueOptions {
  book: string;
  chapter: number;
  verses: { verse: number; text: string; heading?: string }[];
  preferredVoiceName?: string;
  rate?: number;
  onVerseStart?: (verseNumber: number) => void;
  onComplete?: () => void;
  onStop?: () => void;
}

let activeAbortFlag = false;
let activeTimer: ReturnType<typeof setTimeout> | null = null;

export function stopHumanSpeech() {
  activeAbortFlag = true;
  if (activeTimer) {
    clearTimeout(activeTimer);
    activeTimer = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speaks a chapter or verse queue with natural human prosody:
 * - Selects the highest-ranked Neural/Natural voice
 * - Pauses naturally between headings and verses
 * - Triggers `onVerseStart(verseNumber)` so the reader highlights each verse as it is spoken
 */
export function speakScriptureNaturally(options: SpeakVerseQueueOptions) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  stopHumanSpeech();
  activeAbortFlag = false;

  const ranked = getRankedHumanVoices();
  const chosenVoice =
    (options.preferredVoiceName
      ? ranked.find((v) => v.voiceObj.name === options.preferredVoiceName)?.voiceObj
      : undefined) || ranked[0]?.voiceObj;

  const rate = options.rate ?? 0.94; // Slightly measured, reverent storytelling cadence

  interface SpeechSegment {
    verseNumber: number;
    text: string;
    pauseAfterMs: number;
    pitch: number;
  }

  const segments: SpeechSegment[] = [
    {
      verseNumber: options.verses[0]?.verse || 1,
      text: `${options.book}, Chapter ${options.chapter}.`,
      pauseAfterMs: 420,
      pitch: 0.98,
    },
  ];

  for (const v of options.verses) {
    if (v.heading) {
      segments.push({
        verseNumber: v.verse,
        text: `${v.heading}.`,
        pauseAfterMs: 350,
        pitch: 0.97,
      });
    }

    // Split long verses at semicolons or sentence boundaries for natural breathing
    const cleaned = formatScriptureForHumanSpeech(v.text);
    segments.push({
      verseNumber: v.verse,
      text: cleaned,
      pauseAfterMs: 280,
      pitch: 1.0,
    });
  }

  let currentIdx = 0;

  const speakNext = () => {
    if (activeAbortFlag || currentIdx >= segments.length) {
      if (!activeAbortFlag && options.onComplete) {
        options.onComplete();
      }
      return;
    }

    const seg = segments[currentIdx];
    currentIdx += 1;

    if (options.onVerseStart) {
      options.onVerseStart(seg.verseNumber);
    }

    const utterance = new SpeechSynthesisUtterance(seg.text);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
      utterance.lang = chosenVoice.lang;
    }
    utterance.rate = rate;
    utterance.pitch = seg.pitch;

    utterance.onend = () => {
      if (activeAbortFlag) return;
      activeTimer = setTimeout(() => {
        speakNext();
      }, seg.pauseAfterMs);
    };

    utterance.onerror = () => {
      if (!activeAbortFlag && options.onStop) {
        options.onStop();
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  speakNext();
}
