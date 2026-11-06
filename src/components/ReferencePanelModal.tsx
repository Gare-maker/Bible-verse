'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowLeftRight,
  BookmarkCheck,
  BookmarkPlus,
  BookOpen,
  CheckCircle2,
  Compass,
  ExternalLink,
  FolderPlus,
  Languages,
  Link2,
  MessageSquarePlus,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import {
  AIExplanationData,
  FollowUpMessage,
  InspectorMode,
  ResolvedCrossReference,
  TranslationId,
  VerseContextData,
} from '@/types/bible';
import { BIBLE_TRANSLATIONS } from '@/data/bibleBooks';
import { getCrossReferencesForVerse } from '@/data/crossReferences';
import { getVerseByReference, getVerseText } from '@/data/scriptureDatabase';
import {
  buildVerseContextData,
  fetchVerseAllTranslations,
  resolveScriptureVerse,
} from '@/services/bibleService';
import { usePlatform } from '@/context/PlatformContext';

interface ReferencePanelModalProps {
  isOpen: boolean;
  primaryRef: string | null;
  initialMode?: InspectorMode;
  onClose: () => void;
}

export default function ReferencePanelModal({
  isOpen,
  primaryRef,
  initialMode = 'reference',
  onClose,
}: ReferencePanelModalProps) {
  const {
    translation,
    setTranslation,
    navigateToReferenceString,
    saveConnectionToNotes,
    createPersonalNote,
    collections,
    setActivePage,
    preferences,
  } = usePlatform();

  const isLight = preferences.theme === 'light';

  const [selectedRefIndex, setSelectedRefIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<InspectorMode>(initialMode);
  const [compareTranslation, setCompareTranslation] = useState<TranslationId>('KJV');

  const [primaryText, setPrimaryText] = useState<string>('');
  const [connectedText, setConnectedText] = useState<string>('');
  const [comparePrimaryText, setComparePrimaryText] = useState<string>('');
  const [compareConnectedText, setCompareConnectedText] = useState<string>('');
  const [allVersionTexts, setAllVersionTexts] = useState<Record<TranslationId, string> | null>(
    null
  );
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);

  const [contextData, setContextData] = useState<VerseContextData | null>(null);
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  const [aiExplanation, setAiExplanation] = useState<AIExplanationData | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const [followUpInput, setFollowUpInput] = useState('');
  const [followUpThread, setFollowUpThread] = useState<FollowUpMessage[]>([]);
  const [isAskingFollowUp, setIsAskingFollowUp] = useState(false);

  const [personalObservation, setPersonalObservation] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('col-messianic');
  const [justSaved, setJustSaved] = useState(false);

  const references: ResolvedCrossReference[] = primaryRef
    ? getCrossReferencesForVerse(primaryRef)
    : [];
  const activeConnection: ResolvedCrossReference | undefined =
    references[selectedRefIndex] || references[0];

  const primaryVerseObj = primaryRef ? getVerseByReference(primaryRef) : undefined;

  // Reset tab only when primaryRef or initialMode changes (NOT when translation changes!)
  useEffect(() => {
    setSelectedRefIndex(0);
    setActiveTab(initialMode);
    setAiExplanation(null);
    setFollowUpThread([]);
    setPersonalObservation('');
    setJustSaved(false);
    setCompareTranslation(translation === 'NIV' ? 'KJV' : 'NIV');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primaryRef, initialMode]);

  useEffect(() => {
    if (!primaryRef) return;
    let mounted = true;

    resolveScriptureVerse(primaryRef, translation).then((res) => {
      if (mounted && res) setPrimaryText(res.text);
    });

    if (activeConnection) {
      resolveScriptureVerse(activeConnection.connectedRef, translation).then((res) => {
        if (mounted && res) setConnectedText(res.text);
      });
    } else {
      setConnectedText('');
    }

    return () => {
      mounted = false;
    };
  }, [primaryRef, activeConnection, translation]);

  // Load all 6 Bible versions for the selected verse so Compare always shows each version's own text
  useEffect(() => {
    if (!isOpen || !primaryRef) return;
    let active = true;
    setIsLoadingVersions(true);
    fetchVerseAllTranslations(primaryRef)
      .then((res) => {
        if (active && res) setAllVersionTexts(res);
      })
      .finally(() => {
        if (active) setIsLoadingVersions(false);
      });
    return () => {
      active = false;
    };
  }, [isOpen, primaryRef]);

  // Build Verse-Specific & Preceding-Chapter Context Data
  useEffect(() => {
    if (!isOpen || !primaryRef) return;
    let active = true;
    setIsLoadingContext(true);
    buildVerseContextData(primaryRef, translation)
      .then((res) => {
        if (active) setContextData(res);
      })
      .finally(() => {
        if (active) setIsLoadingContext(false);
      });
    return () => {
      active = false;
    };
  }, [isOpen, primaryRef, translation]);

  useEffect(() => {
    if (!primaryRef) return;
    let mounted = true;

    resolveScriptureVerse(primaryRef, compareTranslation).then((res) => {
      if (mounted && res) setComparePrimaryText(res.text);
    });

    if (activeConnection) {
      resolveScriptureVerse(activeConnection.connectedRef, compareTranslation).then((res) => {
        if (mounted && res) setCompareConnectedText(res.text);
      });
    }

    return () => {
      mounted = false;
    };
  }, [primaryRef, activeConnection, compareTranslation]);

  useEffect(() => {
    if (isOpen && primaryRef && activeTab === 'ai' && !aiExplanation && !isGeneratingAi) {
      handleExplainWithAI();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, primaryRef, activeTab, selectedRefIndex]);

  if (!isOpen || !primaryRef) return null;

  const handleExplainWithAI = async () => {
    setActiveTab('ai');
    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/ai-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: activeConnection ? 'connection' : 'verse',
          primaryRef,
          connectedRef: activeConnection?.connectedRef,
          translation,
        }),
      });
      const data = await response.json();
      if (data.explanation) {
        setAiExplanation(data.explanation);
      }
    } catch (e) {
      console.error('Failed to generate AI explanation:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleAskFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpInput.trim()) return;
    const questionText = followUpInput.trim();
    setFollowUpInput('');

    const userMsg: FollowUpMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: questionText,
      timestamp: new Date().toISOString(),
    };
    setFollowUpThread((prev) => [...prev, userMsg]);
    setIsAskingFollowUp(true);

    try {
      const response = await fetch('/api/ai-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'followup',
          primaryRef,
          connectedRef: activeConnection?.connectedRef,
          translation,
          question: questionText,
        }),
      });
      const data = await response.json();
      if (data.result) {
        const assistantMsg: FollowUpMessage = {
          id: `msg-${Date.now() + 1}`,
          role: 'assistant',
          content: data.result.content,
          citedReferences: data.result.citedReferences,
          timestamp: new Date().toISOString(),
        };
        setFollowUpThread((prev) => [...prev, assistantMsg]);
      }
    } catch (e) {
      console.error('Follow-up error:', e);
    } finally {
      setIsAskingFollowUp(false);
    }
  };

  const handleSaveToNotes = () => {
    if (activeConnection) {
      saveConnectionToNotes({
        title: activeConnection.title,
        primaryRef: activeConnection.primaryRef,
        connectedRef: activeConnection.connectedRef,
        primaryText: primaryText || getVerseText(activeConnection.primaryRef, translation),
        connectedText: connectedText || getVerseText(activeConnection.connectedRef, translation),
        translation,
        category: activeConnection.category,
        connectionLabel: activeConnection.connectionLabel,
        verificationStatus: activeConnection.verificationStatus,
        aiExplanation: aiExplanation || undefined,
        personalObservation: personalObservation.trim(),
        collectionId: selectedCollectionId,
      });
    } else {
      createPersonalNote({
        title: `Context & Study on ${primaryRef}`,
        content:
          personalObservation.trim() ||
          contextData?.verseSpecificAnalysis ||
          aiExplanation?.summary ||
          `${primaryRef} (${translation}): "${primaryText}"`,
        scriptureRefs: [
          primaryRef,
          ...(contextData?.verifiedCrossReferences.map((r) => r.ref) || []),
        ],
        collectionId: selectedCollectionId,
        aiExplanation: aiExplanation || undefined,
      });
    }
    setJustSaved(true);
  };

  const panelBody = (
    <div
      className={`flex flex-col h-full w-full max-w-full overflow-x-hidden overflow-y-hidden ${
        isLight ? 'bg-white text-stone-900' : 'bg-[#161616] text-zinc-100'
      }`}
    >
      {/* Mobile Bottom-Sheet Drag Handle */}
      <div className="lg:hidden flex justify-center pt-2.5 pb-1">
        <div
          className={`h-1.5 w-11 rounded-full ${
            isLight ? 'bg-stone-300' : 'bg-zinc-700'
          }`}
        />
      </div>

      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 sm:px-5 py-3 border-b ${
          isLight ? 'border-stone-200/90 bg-[#FBF9F5]' : 'border-zinc-800 bg-[#141414]'
        }`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-bold tracking-tight">{primaryRef}</h2>
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                isLight
                  ? 'bg-stone-200/80 text-stone-700'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {translation}
            </span>
            {references.length > 0 && (
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${
                  isLight
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-amber-500/15 text-amber-300'
                }`}
              >
                {references.length} {references.length === 1 ? 'Reference' : 'References'}
              </span>
            )}
          </div>
          {activeConnection && (
            <p className="text-xs text-stone-500 truncate mt-0.5">
              {activeConnection.title}
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className={`rounded-lg p-1.5 transition shrink-0 ${
            isLight
              ? 'text-stone-400 hover:bg-stone-200/60 hover:text-stone-800'
              : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
          }`}
          aria-label="Close Inspector"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Mode Switcher Bar: Reference | Context | Explain | Compare */}
      <div
        className={`flex items-center justify-between gap-1.5 px-3 sm:px-4 py-2 border-b overflow-x-auto no-scrollbar ${
          isLight ? 'bg-stone-50 border-stone-200/80' : 'bg-[#121212] border-zinc-800'
        }`}
      >
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('reference')}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1 transition shrink-0 ${
              activeTab === 'reference'
                ? isLight
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-900'
                : isLight
                ? 'text-stone-600 hover:bg-stone-200/60'
                : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <Link2 className="h-3.5 w-3.5" />
            <span>Reference</span>
          </button>

          <button
            onClick={() => setActiveTab('context')}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1 transition shrink-0 ${
              activeTab === 'context'
                ? isLight
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-900'
                : isLight
                ? 'text-stone-600 hover:bg-stone-200/60'
                : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <Compass className="h-3.5 w-3.5" />
            <span>Context</span>
          </button>

          <button
            onClick={handleExplainWithAI}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1 transition shrink-0 ${
              activeTab === 'ai'
                ? isLight
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-amber-500 text-zinc-950'
                : isLight
                ? 'text-amber-800 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80'
                : 'text-amber-300 bg-amber-500/10 border border-amber-500/30'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Explain</span>
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1 transition shrink-0 ${
              activeTab === 'compare'
                ? isLight
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-zinc-100 text-zinc-900'
                : isLight
                ? 'text-stone-600 hover:bg-stone-200/60'
                : 'text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>Compare</span>
          </button>
        </div>

        <button
          onClick={handleSaveToNotes}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-bold flex items-center gap-1 shrink-0 transition ${
            justSaved
              ? 'bg-emerald-600 text-white'
              : isLight
              ? 'bg-amber-700 hover:bg-amber-800 text-white'
              : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
          }`}
        >
          {justSaved ? (
            <>
              <BookmarkCheck className="h-3.5 w-3.5" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="h-3.5 w-3.5" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>

      {/* Scrollable Inspector Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
        {/* Selected Primary Scripture */}
        <div
          className={`rounded-xl border p-4 space-y-2 ${
            isLight
              ? 'bg-[#FBF9F5] border-stone-200/90'
              : 'bg-[#1e1e1e] border-zinc-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Selected Scripture
            </span>
            <span
              className={`text-xs font-bold ${
                isLight ? 'text-amber-800' : 'text-amber-400'
              }`}
            >
              {primaryRef} ({translation})
            </span>
          </div>
          <p className="font-serif text-sm sm:text-base leading-relaxed">
            “{primaryText}”
          </p>
          {primaryVerseObj?.footnote && (
            <div
              className={`pt-2 border-t flex items-center gap-2 text-xs ${
                isLight ? 'border-stone-200 text-stone-600' : 'border-zinc-800 text-zinc-300'
              }`}
            >
              <span
                className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold ${
                  isLight ? 'bg-amber-100 text-amber-900' : 'bg-zinc-800 text-amber-300'
                }`}
              >
                Note
              </span>
              <span>{primaryVerseObj.footnote}</span>
            </div>
          )}
        </div>

        {/* Multiple Reference Switcher */}
        {references.length > 1 && activeTab !== 'context' && (
          <div className="flex items-center gap-1.5 flex-wrap">
            {references.map((refItem, idx) => (
              <button
                key={refItem.id}
                onClick={() => {
                  setSelectedRefIndex(idx);
                  setAiExplanation(null);
                }}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition border ${
                  selectedRefIndex === idx
                    ? isLight
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-amber-500 text-zinc-950 border-amber-500'
                    : isLight
                    ? 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                    : 'bg-[#222222] text-zinc-300 border-zinc-700'
                }`}
              >
                {refItem.connectedRef}
              </button>
            ))}
          </div>
        )}

        {/* TAB 1: REFERENCE */}
        {activeTab === 'reference' && (
          <>
            {activeConnection ? (
              <div
                className={`rounded-xl border p-4 space-y-4 ${
                  isLight
                    ? 'bg-amber-50/40 border-amber-200/80'
                    : 'bg-[#1f1d18] border-amber-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider block ${
                        isLight ? 'text-amber-800' : 'text-amber-400'
                      }`}
                    >
                      Connected Scripture
                    </span>
                    <h3 className="text-lg font-bold mt-0.5">
                      {activeConnection.connectedRef}
                    </h3>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        isLight
                          ? 'bg-amber-700 text-white'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {activeConnection.category}
                    </span>
                    <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" />
                      Verified Reference
                    </span>
                  </div>
                </div>

                <div
                  className={`rounded-lg p-2.5 text-xs border ${
                    isLight
                      ? 'bg-white border-stone-200/80 text-stone-600'
                      : 'bg-black/30 border-zinc-800 text-zinc-300'
                  }`}
                >
                  <div className="font-semibold">
                    {activeConnection.connectionLabel}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {activeConnection.directionLabel} • {activeConnection.dataSource}
                  </div>
                </div>

                <blockquote
                  className={`font-serif text-sm sm:text-base leading-relaxed rounded-xl p-3.5 border-l-4 ${
                    isLight
                      ? 'bg-white text-stone-900 border-amber-700 shadow-2xs'
                      : 'bg-[#141414] text-zinc-100 border-amber-500'
                  }`}
                >
                  “{connectedText}”
                </blockquote>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      navigateToReferenceString(activeConnection.connectedRef, true);
                    }}
                    className={`rounded-xl font-semibold px-3 py-2 text-xs flex items-center justify-center gap-1.5 border transition ${
                      isLight
                        ? 'bg-white hover:bg-stone-100 border-stone-300 text-stone-800'
                        : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-100'
                    }`}
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Open {activeConnection.connectedRef}</span>
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </button>

                  <button
                    onClick={handleExplainWithAI}
                    className={`rounded-xl font-bold px-3 py-2 text-xs flex items-center justify-center gap-1.5 transition ${
                      isLight
                        ? 'bg-amber-700 hover:bg-amber-800 text-white'
                        : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Explain Connection</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`rounded-xl border p-5 text-center space-y-3 ${
                  isLight
                    ? 'bg-stone-50 border-stone-200 text-stone-600'
                    : 'bg-[#202020] border-zinc-800 text-zinc-300'
                }`}
              >
                <p className="text-xs">
                  No direct individual cross-reference is indexed for {primaryRef}. Open the Context tab to see how this verse fits within its surrounding verses and preceding chapter.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button
                    onClick={() => setActiveTab('context')}
                    className={`inline-flex items-center gap-1.5 rounded-xl font-bold px-3.5 py-2 text-xs border transition ${
                      isLight
                        ? 'bg-white border-stone-300 text-stone-800 hover:bg-stone-100'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-100'
                    }`}
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>View Verse Context</span>
                  </button>
                  <button
                    onClick={handleExplainWithAI}
                    className={`inline-flex items-center gap-1.5 rounded-xl font-bold px-3.5 py-2 text-xs transition ${
                      isLight
                        ? 'bg-amber-700 text-white hover:bg-amber-800'
                        : 'bg-amber-500 text-zinc-950'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Explain {primaryRef}</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ===================================================================
            TAB 2: VERSE-SPECIFIC CONTEXT, SURROUNDING PASSAGE & PREVIOUS CHAPTER
            =================================================================== */}
        {activeTab === 'context' && (
          <div className="space-y-4">
            {isLoadingContext || !contextData ? (
              <div
                className={`rounded-xl border p-6 text-center space-y-2 ${
                  isLight
                    ? 'bg-stone-50 border-stone-200 text-stone-600'
                    : 'bg-[#1a1a1a] border-zinc-800 text-zinc-300'
                }`}
              >
                <Compass
                  className={`h-6 w-6 animate-spin mx-auto ${
                    isLight ? 'text-amber-700' : 'text-amber-400'
                  }`}
                />
                <p className="text-xs font-medium">
                  Analyzing {primaryRef} in context of its surrounding verses and preceding chapter...
                </p>
              </div>
            ) : (
              <>
                {/* 1. Specific Context of the Selected Verse */}
                <div
                  className={`rounded-xl border p-4 space-y-2.5 ${
                    isLight
                      ? 'bg-amber-50/50 border-amber-200/90 text-stone-800'
                      : 'bg-[#1f1d18] border-amber-500/30 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isLight ? 'text-amber-800' : 'text-amber-400'
                      }`}
                    >
                      <Compass className="h-3.5 w-3.5" />
                      1. Context of Selected Verse ({contextData.targetRef})
                    </span>
                    {contextData.sectionHeading && (
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold italic ${
                          isLight
                            ? 'bg-white border border-amber-200 text-amber-900'
                            : 'bg-zinc-900 border border-zinc-700 text-amber-300'
                        }`}
                      >
                        Section: {contextData.sectionHeading}
                      </span>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed">
                    {contextData.verseSpecificAnalysis}
                  </p>
                </div>

                {/* 2. Immediate Surrounding Verses (Leading -> Selected -> Following) */}
                <div
                  className={`rounded-xl border p-4 space-y-3 ${
                    isLight
                      ? 'bg-stone-50/80 border-stone-200/90 text-stone-800'
                      : 'bg-[#1a1a1a] border-zinc-800 text-zinc-200'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block ${
                      isLight ? 'text-amber-800' : 'text-amber-400'
                    }`}
                  >
                    2. Surrounding Verses in {contextData.book} {contextData.chapter} ({translation})
                  </span>
                  <p className="text-xs leading-relaxed text-stone-600 dark:text-zinc-300">
                    {contextData.immediateLiteraryContext}
                  </p>

                  <div className="space-y-1.5">
                    {contextData.leadingVersesInChapter.map((lv) => (
                      <div
                        key={lv.ref}
                        onClick={() => navigateToReferenceString(lv.ref, false)}
                        className={`cursor-pointer rounded-lg p-2.5 border text-xs font-serif leading-relaxed ${
                          isLight
                            ? 'bg-white border-stone-200/80 text-stone-700'
                            : 'bg-[#121212] border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <span className="font-sans font-bold text-stone-400 mr-1.5">
                          {lv.ref}
                        </span>
                        {lv.text}
                      </div>
                    ))}

                    {/* Highlighted Selected Verse in Sequence */}
                    <div
                      className={`rounded-lg p-3 border-l-4 text-xs font-serif leading-relaxed ${
                        isLight
                          ? 'bg-amber-50/80 border-amber-700 text-stone-900 font-medium'
                          : 'bg-amber-500/15 border-amber-400 text-zinc-100 font-medium'
                      }`}
                    >
                      <span
                        className={`font-sans font-bold mr-1.5 ${
                          isLight ? 'text-amber-800' : 'text-amber-400'
                        }`}
                      >
                        {contextData.targetRef} (Selected)
                      </span>
                      “{contextData.selectedVerseText}”
                    </div>

                    {contextData.followingVersesInChapter.map((fv) => (
                      <div
                        key={fv.ref}
                        onClick={() => navigateToReferenceString(fv.ref, false)}
                        className={`cursor-pointer rounded-lg p-2.5 border text-xs font-serif leading-relaxed ${
                          isLight
                            ? 'bg-white border-stone-200/80 text-stone-700'
                            : 'bg-[#121212] border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <span className="font-sans font-bold text-stone-400 mr-1.5">
                          {fv.ref}
                        </span>
                        {fv.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Preceding Chapter Bridge */}
                <div
                  className={`rounded-xl border p-4 space-y-2.5 ${
                    isLight
                      ? 'bg-stone-50/80 border-stone-200/90 text-stone-800'
                      : 'bg-[#1a1a1a] border-zinc-800 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                        isLight ? 'text-amber-800' : 'text-amber-400'
                      }`}
                    >
                      3. Preceding Chapter ({contextData.previousChapterRef})
                    </span>
                    {contextData.chapter > 1 && (
                      <button
                        onClick={() =>
                          navigateToReferenceString(
                            `${contextData.book} ${contextData.chapter - 1}:1`,
                            true
                          )
                        }
                        className={`text-[11px] font-bold hover:underline ${
                          isLight ? 'text-amber-800' : 'text-amber-400'
                        }`}
                      >
                        Open {contextData.book} {contextData.chapter - 1} →
                      </button>
                    )}
                  </div>

                  <p className="text-xs leading-relaxed">
                    {contextData.previousChapterSummary}
                  </p>

                  <p
                    className={`text-xs leading-relaxed pt-2 border-t ${
                      isLight
                        ? 'border-stone-200/80 text-stone-700'
                        : 'border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <strong>How It Leads Into {primaryRef}:</strong>{' '}
                    {contextData.howPreviousChapterLeadsHere}
                  </p>

                  {contextData.previousChapterKeyVerses.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                        Closing Verses of {contextData.previousChapterRef} ({translation}):
                      </span>
                      <div className="space-y-1.5">
                        {contextData.previousChapterKeyVerses.map((pv) => (
                          <div
                            key={pv.ref}
                            onClick={() => navigateToReferenceString(pv.ref, true)}
                            className={`cursor-pointer rounded-lg p-2.5 border text-xs font-serif leading-relaxed transition ${
                              isLight
                                ? 'bg-white hover:bg-stone-50 border-stone-200/90 text-stone-800'
                                : 'bg-[#141414] hover:bg-zinc-900 border-zinc-800 text-zinc-200'
                            }`}
                          >
                            <span
                              className={`font-sans font-bold mr-1.5 ${
                                isLight ? 'text-amber-800' : 'text-amber-400'
                              }`}
                            >
                              {pv.ref}
                            </span>
                            “{pv.text}”
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Verified Cross-References in Context */}
                <div
                  className={`rounded-xl border p-4 space-y-3 ${
                    isLight
                      ? 'bg-stone-50/80 border-stone-200/90 text-stone-800'
                      : 'bg-[#1a1a1a] border-zinc-800 text-zinc-200'
                  }`}
                >
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider block ${
                      isLight ? 'text-amber-800' : 'text-amber-400'
                    }`}
                  >
                    4. Canonical Cross-References Supporting This Context
                  </span>

                  {contextData.verifiedCrossReferences.length > 0 ? (
                    <div className="space-y-2.5">
                      {contextData.verifiedCrossReferences.map((xref) => (
                        <div
                          key={xref.ref}
                          className={`rounded-xl p-3 border space-y-1.5 ${
                            isLight
                              ? 'bg-white border-amber-200/90'
                              : 'bg-[#141414] border-amber-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <button
                              onClick={() => navigateToReferenceString(xref.ref, true)}
                              className={`text-xs font-bold hover:underline flex items-center gap-1 ${
                                isLight ? 'text-amber-800' : 'text-amber-400'
                              }`}
                            >
                              <span>{xref.ref}</span>
                              <ExternalLink className="h-3 w-3" />
                            </button>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                isLight
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              {xref.category}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-stone-500">
                            {xref.title}
                          </p>
                          <p className="font-serif text-xs leading-relaxed">
                            “{xref.text}”
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : contextData.chapterCrossReferences.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs text-stone-500">
                        Verified cross-references in {contextData.book} {contextData.chapter}:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {contextData.chapterCrossReferences.map((cr, idx) => (
                          <button
                            key={`${cr.sourceVerseRef}-${cr.connectedRef}-${idx}`}
                            onClick={() => navigateToReferenceString(cr.connectedRef, true)}
                            className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold text-left transition ${
                              isLight
                                ? 'bg-white hover:bg-amber-50 border-stone-200 text-stone-800'
                                : 'bg-[#141414] border-zinc-800 text-zinc-200'
                            }`}
                          >
                            <span className={isLight ? 'text-amber-800' : 'text-amber-400'}>
                              {cr.sourceVerseRef} ↔ {cr.connectedRef}
                            </span>{' '}
                            <span className="text-[10px] text-stone-400">({cr.category})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-stone-500">
                      Read {contextData.previousChapterRef} and {contextData.book}{' '}
                      {contextData.chapter} above for the full literary context.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* TAB 3: AI EXPLANATION */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            {isGeneratingAi ? (
              <div
                className={`rounded-xl border p-8 text-center space-y-2.5 ${
                  isLight
                    ? 'bg-stone-50 border-stone-200 text-stone-700'
                    : 'bg-[#202020] border-zinc-800 text-zinc-200'
                }`}
              >
                <Sparkles
                  className={`h-6 w-6 animate-spin mx-auto ${
                    isLight ? 'text-amber-700' : 'text-amber-400'
                  }`}
                />
                <p className="text-xs font-medium">
                  Retrieving scripture texts and synthesizing historical & lexical connections...
                </p>
              </div>
            ) : aiExplanation ? (
              <div className="space-y-3.5">
                <div
                  className={`rounded-xl p-3.5 border text-xs leading-relaxed ${
                    isLight
                      ? 'bg-amber-50/70 border-amber-200 text-stone-800'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-100'
                  }`}
                >
                  <div
                    className={`font-bold mb-1 flex items-center gap-1.5 ${
                      isLight ? 'text-amber-900' : 'text-amber-300'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{aiExplanation.title}</span>
                  </div>
                  {aiExplanation.summary}
                </div>

                {[
                  {
                    label: `1. Context of ${primaryRef}`,
                    body: aiExplanation.originalContextFirst,
                  },
                  {
                    label: '2. Historical Circumstances',
                    body: aiExplanation.historicalCircumstances,
                  },
                  aiExplanation.contextSecond
                    ? {
                        label: `3. Context of ${
                          activeConnection?.connectedRef || 'Connected Passage'
                        }`,
                        body: aiExplanation.contextSecond,
                      }
                    : null,
                  aiExplanation.whyReferenced
                    ? {
                        label: '4. Why Referenced Across Testaments',
                        body: aiExplanation.whyReferenced,
                      }
                    : null,
                  aiExplanation.similaritiesAndDifferences
                    ? {
                        label: '5. Wording & Translation Nuances',
                        body: aiExplanation.similaritiesAndDifferences,
                      }
                    : null,
                  {
                    label: '6. Theological Significance',
                    body: aiExplanation.theologicalSignificance,
                  },
                ]
                  .filter(Boolean)
                  .map((sec, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl p-3.5 border space-y-1 text-xs ${
                        isLight
                          ? 'bg-stone-50/80 border-stone-200/80 text-stone-700'
                          : 'bg-[#1a1a1a] border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <h4
                        className={`font-bold uppercase tracking-wider text-[10px] ${
                          isLight ? 'text-amber-800' : 'text-amber-400'
                        }`}
                      >
                        {sec!.label}
                      </h4>
                      <p className="leading-relaxed">{sec!.body}</p>
                    </div>
                  ))}

                {/* Lexical Word Study */}
                {aiExplanation.lexicalStudy && aiExplanation.lexicalStudy.length > 0 && (
                  <div
                    className={`rounded-xl p-3.5 border space-y-2 ${
                      isLight
                        ? 'bg-stone-50/80 border-stone-200/80'
                        : 'bg-[#1a1a1a] border-zinc-800'
                    }`}
                  >
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <Languages className="h-3.5 w-3.5" />
                      Hebrew & Greek Lexical Study
                    </h4>
                    <div className="space-y-2">
                      {aiExplanation.lexicalStudy.map((lex, i) => (
                        <div
                          key={i}
                          className={`rounded-lg p-2.5 border text-xs ${
                            isLight
                              ? 'bg-white border-stone-200'
                              : 'bg-[#121212] border-zinc-800'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold">
                            <span className={isLight ? 'text-amber-900' : 'text-amber-300'}>
                              {lex.term} ({lex.transliteration})
                            </span>
                            <span className="text-[10px] font-mono text-stone-400">
                              {lex.language} • {lex.strongs}
                            </span>
                          </div>
                          <p className="text-stone-600 dark:text-zinc-400 mt-1 leading-relaxed">
                            {lex.meaning}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Clickable Related References */}
                {aiExplanation.relatedReferences.length > 0 && (
                  <div
                    className={`rounded-xl p-3.5 border space-y-2 ${
                      isLight
                        ? 'bg-stone-50/80 border-stone-200/80'
                        : 'bg-[#1a1a1a] border-zinc-800'
                    }`}
                  >
                    <h4
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isLight ? 'text-amber-800' : 'text-amber-400'
                      }`}
                    >
                      7. Verified Biblical References
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {aiExplanation.relatedReferences.map((refStr) => (
                        <button
                          key={refStr}
                          onClick={() => navigateToReferenceString(refStr, true)}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                            isLight
                              ? 'bg-white hover:bg-amber-50 border-stone-200 text-amber-800'
                              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          {refStr} →
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Follow-Up Research Chat */}
                <div className="pt-2 space-y-2.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                    <MessageSquarePlus className="h-3.5 w-3.5" />
                    Follow-Up Question
                  </h4>
                  {followUpThread.map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-xl p-3 text-xs leading-relaxed border ${
                        msg.role === 'user'
                          ? isLight
                            ? 'bg-stone-100 border-stone-200 text-stone-900 ml-6'
                            : 'bg-zinc-800 border-zinc-700 text-white ml-6'
                          : isLight
                          ? 'bg-amber-50/50 border-amber-200 text-stone-800 mr-4'
                          : 'bg-[#141414] border-amber-500/30 text-zinc-200 mr-4'
                      }`}
                    >
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>
                  ))}
                  <form onSubmit={handleAskFollowUp} className="flex gap-1.5">
                    <input
                      type="text"
                      value={followUpInput}
                      onChange={(e) => setFollowUpInput(e.target.value)}
                      placeholder="Ask follow-up question..."
                      className={`flex-1 rounded-xl border px-3 py-2 text-xs focus:outline-none ${
                        isLight
                          ? 'bg-stone-50 border-stone-300 text-stone-900 focus:border-amber-700'
                          : 'bg-[#121212] border-zinc-700 text-white focus:border-amber-500'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={isAskingFollowUp}
                      className={`rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1 ${
                        isLight
                          ? 'bg-amber-700 text-white hover:bg-amber-800'
                          : 'bg-amber-500 text-zinc-950'
                      }`}
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 4: COMPARE VERSIONS & SCRIPTURES */}
        {activeTab === 'compare' && (
          <div className="space-y-4">
            {/* Side-by-Side Connected Scripture Comparison (if a connection exists) */}
            {activeConnection && (
              <div className="space-y-3 pb-3 border-b border-stone-200 dark:border-zinc-800">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    Compare Connected Passages
                  </span>
                  <select
                    value={compareTranslation}
                    onChange={(e) => setCompareTranslation(e.target.value as TranslationId)}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-bold ${
                      isLight
                        ? 'bg-stone-50 border-stone-300 text-amber-800'
                        : 'bg-[#141414] border-zinc-700 text-amber-300'
                    }`}
                  >
                    {BIBLE_TRANSLATIONS.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.abbreviation} — {t.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className={`rounded-xl border p-3.5 space-y-1.5 ${
                    isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#1a1a1a] border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-400">Primary</span>
                    <span className={isLight ? 'text-amber-800' : 'text-amber-300'}>
                      {primaryRef} ({compareTranslation})
                    </span>
                  </div>
                  <p className="font-serif text-sm leading-relaxed">“{comparePrimaryText}”</p>
                </div>

                <div
                  className={`rounded-xl border p-3.5 space-y-1.5 ${
                    isLight
                      ? 'bg-amber-50/40 border-amber-200'
                      : 'bg-[#1f1d18] border-amber-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-stone-400">Connected</span>
                    <span className={isLight ? 'text-amber-800' : 'text-amber-300'}>
                      {activeConnection.connectedRef} ({compareTranslation})
                    </span>
                  </div>
                  <p className="font-serif text-sm leading-relaxed">
                    “{compareConnectedText}”
                  </p>
                </div>
              </div>
            )}

            {/* All 6 Bible Versions Comparison for Selected Verse */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  All 6 Bible Versions for {primaryRef}
                </span>
                {isLoadingVersions && (
                  <span className="text-[11px] text-amber-700 dark:text-amber-400 animate-pulse">
                    Loading versions...
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {BIBLE_TRANSLATIONS.map((t) => {
                  const vText =
                    allVersionTexts?.[t.id] ||
                    primaryVerseObj?.translations[t.id] ||
                    primaryText;
                  const isCurrent = translation === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setTranslation(t.id)}
                      className={`cursor-pointer rounded-xl p-3 border text-xs transition ${
                        isCurrent
                          ? isLight
                            ? 'bg-amber-50/70 border-amber-300 text-stone-900'
                            : 'bg-amber-500/15 border-amber-500/40 text-zinc-100'
                          : isLight
                          ? 'bg-stone-50/80 border-stone-200/90 text-stone-800 hover:bg-stone-100'
                          : 'bg-[#1a1a1a] border-zinc-800 text-zinc-200 hover:bg-zinc-800/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`font-bold ${
                            isLight ? 'text-amber-800' : 'text-amber-400'
                          }`}
                        >
                          {t.abbreviation} — {t.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-emerald-600">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="font-serif text-sm leading-relaxed">“{vText}”</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Save Connection & Observation Card */}
        <div
          className={`rounded-xl border p-4 space-y-2.5 ${
            isLight
              ? 'bg-stone-50/90 border-stone-200'
              : 'bg-[#1d1d1d] border-zinc-800'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold flex items-center gap-1.5">
              <FolderPlus
                className={`h-3.5 w-3.5 ${isLight ? 'text-amber-700' : 'text-amber-400'}`}
              />
              Save to Research Notebook
            </span>
            <select
              value={selectedCollectionId}
              onChange={(e) => setSelectedCollectionId(e.target.value)}
              className={`rounded-lg border px-2 py-1 text-[11px] font-medium max-w-[160px] truncate ${
                isLight
                  ? 'bg-white border-stone-300 text-stone-700'
                  : 'bg-[#121212] border-zinc-700 text-zinc-200'
              }`}
            >
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>

          <textarea
            rows={2}
            value={personalObservation}
            onChange={(e) => setPersonalObservation(e.target.value)}
            placeholder="Add a personal study note before saving (optional)..."
            className={`w-full rounded-lg border p-2.5 text-xs focus:outline-none ${
              isLight
                ? 'bg-white border-stone-200/90 text-stone-900 placeholder-stone-400 focus:border-amber-700'
                : 'bg-[#121212] border-zinc-700 text-white placeholder-zinc-500'
            }`}
          />

          <div className="flex items-center justify-between pt-1">
            {justSaved ? (
              <button
                onClick={() => {
                  onClose();
                  setActivePage('notes');
                }}
                className={`text-xs font-bold hover:underline ${
                  isLight ? 'text-amber-800' : 'text-amber-400'
                }`}
              >
                Open in Notes →
              </button>
            ) : (
              <span className="text-[11px] text-stone-400">
                Saves scripture & study
              </span>
            )}

            <button
              onClick={handleSaveToNotes}
              className={`rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition ${
                isLight
                  ? 'bg-amber-700 hover:bg-amber-800 text-white shadow-2xs'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{justSaved ? 'Update in Notes' : 'Save to Notes'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Docked Right Inspector Panel (lg and up) */}
      <aside
        className={`hidden lg:block w-[410px] xl:w-[450px] shrink-0 border-l sticky top-0 h-screen z-20 ${
          isLight ? 'border-stone-200/90 bg-white' : 'border-zinc-800 bg-[#161616]'
        }`}
      >
        {panelBody}
      </aside>

      {/* Mobile & Tablet Bottom Sheet Drawer (< lg) — Closes on Backdrop Click */}
      <div
        onClick={onClose}
        className="lg:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-full max-h-[85vh] rounded-t-3xl overflow-hidden shadow-2xl border-t border-stone-200 dark:border-zinc-800 flex flex-col"
        >
          {panelBody}
        </div>
      </div>
    </>
  );
}
