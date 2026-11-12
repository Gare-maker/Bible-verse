'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeft, BookOpen, BookmarkPlus, Check, Copy, ExternalLink, X } from 'lucide-react';
import { BiblicalTypeShadow } from '@/types/bible';
import { getVerseText } from '@/data/scriptureDatabase';
import { usePlatform } from '@/context/PlatformContext';

interface TypeShadowDetailModalProps {
  isOpen: boolean;
  typeShadow: BiblicalTypeShadow | null;
  onClose: () => void;
  onOpenScripture: (ref: string) => void;
}

export default function TypeShadowDetailModal({
  isOpen,
  typeShadow,
  onClose,
  onOpenScripture,
}: TypeShadowDetailModalProps) {
  const { preferences, translation, saveTypeShadowItem, showToast } = usePlatform();
  const isLight = preferences.theme === 'light';
  const isChildren = preferences.experienceMode === 'children';

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(false);
    setCopied(false);
  }, [typeShadow?.id]);

  if (!isOpen || !typeShadow) return null;

  const otText = getVerseText(typeShadow.otTypeRef, translation);
  const ntText = getVerseText(typeShadow.ntAntitypeRef, translation);

  const handleCopy = () => {
    const textToCopy = `*Type & Shadow: ${typeShadow.title}*\n\n` +
      `*Old Testament Type (${typeShadow.otTypeRef}):*\n"${otText}"\n\n` +
      `*New Testament Fulfilment (${typeShadow.ntAntitypeRef}):*\n"${ntText}"\n\n` +
      `*Explanation:*\n${typeShadow.explanation}\n\n` +
      `Shared from Bible Study App`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast(`Copied ${typeShadow.title} to clipboard`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    saveTypeShadowItem({
      title: typeShadow.title,
      otTypeRef: typeShadow.otTypeRef,
      otTypeText: otText,
      ntAntitypeRef: typeShadow.ntAntitypeRef,
      ntAntitypeText: ntText,
      explanation: typeShadow.explanation,
      collectionId: 'DEFAULT',
      personalNotes: '',
    });
    setSaved(true);
    showToast(`Saved "${typeShadow.title}" to Saved items`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Type and Shadow: ${typeShadow.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl max-h-[88vh] rounded-3xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isChildren
            ? isLight
              ? 'bg-[#FFF9E6] border-emerald-300 text-slate-900'
              : 'bg-[#161D35] border-emerald-700/80 text-slate-100'
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
                ? 'bg-[#FFF9E6]/95 border-emerald-200'
                : 'bg-[#161D35]/95 border-emerald-800/80'
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
                    ? 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-950'
                    : 'bg-emerald-900/60 hover:bg-emerald-800 border-emerald-700 text-emerald-200'
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
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 block">
                Type & Shadow
              </span>
              <h3 className="text-sm sm:text-base font-bold truncate">
                {typeShadow.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleSave}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-semibold border flex items-center gap-1 transition ${
                saved
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : isLight
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              }`}
              title="Save Type & Shadow"
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className={`rounded-xl p-2 border transition ${
                isLight
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              }`}
              title="Copy details"
              aria-label="Copy details"
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* OT Type */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-200/80 dark:border-amber-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                Old Testament Type
              </span>
              <button
                type="button"
                onClick={() => onOpenScripture(typeShadow.otTypeRef)}
                className="text-xs font-bold text-amber-800 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>{typeShadow.otTypeRef}</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
            {otText && (
              <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                &ldquo;{otText}&rdquo;
              </p>
            )}
          </div>

          {/* NT Fulfilment */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                New Testament Fulfilment
              </span>
              <button
                type="button"
                onClick={() => onOpenScripture(typeShadow.ntAntitypeRef)}
                className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>{typeShadow.ntAntitypeRef}</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
            {ntText && (
              <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                &ldquo;{ntText}&rdquo;
              </p>
            )}
          </div>

          {/* Explanation */}
          <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
              Biblical Symbolism & Fulfilment Explanation
            </span>
            <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-zinc-300">
              {typeShadow.explanation}
            </p>
          </div>

          {/* Context */}
          {typeShadow.biblicalContext && (
            <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                Biblical Context & Historical Setting
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-zinc-300">
                {typeShadow.biblicalContext}
              </p>
            </div>
          )}

          {/* Supporting References */}
          {typeShadow.supportingRefs && typeShadow.supportingRefs.length > 0 && (
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                Supporting Scripture References
              </span>
              <div className="flex flex-wrap gap-2">
                {typeShadow.supportingRefs.map((sup: string) => (
                  <button
                    key={sup}
                    type="button"
                    onClick={() => onOpenScripture(sup)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition flex items-center gap-1.5 ${
                      isLight
                        ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                        : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
                    }`}
                  >
                    <BookOpen className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{sup}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Source Attribution */}
          {typeShadow.historicalSource && (
            <div className="pt-2 text-[11px] text-stone-500 dark:text-zinc-400 italic">
              Basis: {typeShadow.historicalSource}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
