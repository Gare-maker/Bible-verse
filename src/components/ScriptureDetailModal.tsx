'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, Check, Copy, ExternalLink, X } from 'lucide-react';
import { TranslationId } from '@/types/bible';
import { parseScriptureReference } from '@/data/bibleBooks';
import { getVerseText, getVerseByReference, getChapterVersesSync } from '@/data/scriptureDatabase';
import { resolveScriptureVerse } from '@/services/bibleService';
import { usePlatform } from '@/context/PlatformContext';

interface ScriptureDetailModalProps {
  isOpen: boolean;
  reference: string | null;
  contextNote?: string;
  onClose: () => void;
}

export default function ScriptureDetailModal({
  isOpen,
  reference,
  contextNote,
  onClose,
}: ScriptureDetailModalProps) {
  const { preferences, translation, navigateToPassage, showToast } = usePlatform();
  const isLight = preferences.theme === 'light';
  const isChildren = preferences.experienceMode === 'children';

  const [resolvedText, setResolvedText] = useState<string>('');
  const [surroundingVerses, setSurroundingVerses] = useState<{ verse: number; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen || !reference) {
      setResolvedText('');
      setSurroundingVerses([]);
      return;
    }

    const parsed = parseScriptureReference(reference);
    if (!parsed) {
      setResolvedText(getVerseText(reference, translation) || 'Reference text unavailable.');
      return;
    }

    // Try synchronous local lookup first
    const localText = getVerseText(reference, translation);
    if (localText) {
      setResolvedText(localText);
    } else {
      setIsLoading(true);
      resolveScriptureVerse(reference, translation)
        .then((res) => {
          if (res?.text) {
            setResolvedText(res.text);
          } else {
            setResolvedText(getVerseText(reference, 'NIV') || 'Scripture passage text loading or offline.');
          }
        })
        .finally(() => setIsLoading(false));
    }

    // Fetch surrounding verses for context
    const chapVerses = getChapterVersesSync(parsed.book, parsed.chapter);
    if (chapVerses && chapVerses.length > 0) {
      const vNum = parsed.verse || 1;
      const nearby = chapVerses
        .filter((cv) => Math.abs(cv.verse - vNum) <= 2 && cv.verse !== vNum)
        .map((cv) => ({
          verse: cv.verse,
          text: cv.translations[translation] || cv.translations.NIV,
        }));
      setSurroundingVerses(nearby);
    } else {
      setSurroundingVerses([]);
    }
  }, [isOpen, reference, translation]);

  if (!isOpen || !reference) return null;

  const parsed = parseScriptureReference(reference);

  const handleCopy = () => {
    const textToCopy = `"${resolvedText}" — ${reference} (${translation})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast(`Copied ${reference} to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleOpenInReader = () => {
    if (parsed) {
      navigateToPassage(parsed.book, parsed.chapter, parsed.verse || 1, true);
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Scripture Passage: ${reference}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl max-h-[88vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isChildren
            ? isLight
              ? 'bg-[#FFF9E6] border-amber-300 text-slate-900'
              : 'bg-[#161D35] border-indigo-700/80 text-slate-100'
            : isLight
            ? 'bg-white border-stone-200/90 text-stone-900'
            : 'bg-[#151515] border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Sticky Header with Back Button, Title, and Close */}
        <header
          className={`sticky top-0 z-10 px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 border-b shrink-0 ${
            isChildren
              ? isLight
                ? 'bg-[#FFF9E6]/95 border-amber-200'
                : 'bg-[#161D35]/95 border-indigo-800/80'
              : isLight
              ? 'bg-white/95 border-stone-200'
              : 'bg-[#151515]/95 border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-bold border flex items-center gap-1.5 transition shrink-0 ${
                isChildren
                  ? isLight
                    ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-950'
                    : 'bg-indigo-900/60 hover:bg-indigo-800 border-indigo-700 text-amber-300'
                  : isLight
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              }`}
              title="Return to previous view"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold truncate">
                {reference}
              </h3>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold shrink-0 ${
                isLight ? 'bg-amber-100 text-amber-900' : 'bg-amber-950/70 text-amber-300'
              }`}
            >
              {translation}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className={`rounded-xl p-2 border transition ${
                isLight
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              }`}
              title="Copy scripture text"
              aria-label="Copy scripture text"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`rounded-xl p-2 border transition ${
                isLight
                  ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-600'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
              }`}
              title="Close"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Main Verse Passage Card */}
          <div
            className={`rounded-2xl p-5 border space-y-3 ${
              isChildren
                ? isLight
                  ? 'bg-amber-100/60 border-amber-300/80 shadow-2xs'
                  : 'bg-indigo-950/50 border-indigo-800/80'
                : isLight
                ? 'bg-stone-50/70 border-stone-200/90 shadow-2xs'
                : 'bg-zinc-900/60 border-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
                Scripture Text
              </span>
              <span className="text-xs font-semibold text-stone-500 dark:text-zinc-400">
                {reference}
              </span>
            </div>

            {isLoading ? (
              <p className="text-xs sm:text-sm italic text-stone-500 dark:text-zinc-400 animate-pulse">
                Loading scripture text...
              </p>
            ) : (
              <p
                className={`font-serif text-sm sm:text-base leading-relaxed ${
                  isLight ? 'text-stone-900' : 'text-zinc-100'
                }`}
              >
                &ldquo;{resolvedText || 'Scripture text unavailable.'}&rdquo;
              </p>
            )}
          </div>

          {/* Context Note (if passed from cross reference or interpretation) */}
          {contextNote && (
            <div
              className={`rounded-2xl p-4 border space-y-1.5 ${
                isLight
                  ? 'bg-amber-50/40 border-amber-200/70 text-stone-800'
                  : 'bg-amber-950/20 border-amber-900/40 text-zinc-200'
              }`}
            >
              <span className="text-[10.5px] uppercase font-bold tracking-wider text-amber-800 dark:text-amber-400 block">
                Context & Biblical Significance
              </span>
              <p className="text-xs sm:text-[13px] leading-relaxed">
                {contextNote}
              </p>
            </div>
          )}

          {/* Surrounding Passage Context */}
          {surroundingVerses.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                Surrounding Passage Verses
              </span>
              <div className="space-y-2 pl-3 border-l-2 border-stone-300 dark:border-zinc-700">
                {surroundingVerses.map((sv) => (
                  <div key={sv.verse} className="space-y-0.5 text-xs">
                    <span className="font-bold text-stone-500 dark:text-zinc-400">
                      Verse {sv.verse}:
                    </span>
                    <p className="font-serif leading-relaxed text-stone-700 dark:text-zinc-300">
                      &ldquo;{sv.text}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <footer
          className={`px-4 sm:px-6 py-3 border-t flex items-center justify-between gap-2 shrink-0 ${
            isLight ? 'bg-stone-50/80 border-stone-200' : 'bg-zinc-900/80 border-zinc-800'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition ${
              isLight
                ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
            }`}
          >
            Close
          </button>

          {parsed && (
            <button
              type="button"
              onClick={handleOpenInReader}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                isLight
                  ? 'bg-amber-700 hover:bg-amber-800 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Read in Bible ({parsed.book} {parsed.chapter})</span>
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
