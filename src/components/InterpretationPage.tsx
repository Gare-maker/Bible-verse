'use client';

import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  BookMarked,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Compass,
  FileText,
  HelpCircle,
  Hash,
  Languages,
  CheckCircle2,
  Bookmark,
  Share2,
} from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import {
  BIBLICAL_LEXICON,
  searchBiblicalLexicon,
  getLexiconEntryById,
} from '@/data/lexiconData';
import {
  ETYMOLOGY_EXAMPLES,
  TYPOLOGY_GUIDE,
  INTERPRETATION_METHODS,
  ESSENTIAL_CONCEPTS,
  INTERPRETATION_PRINCIPLES,
} from '@/data/interpretationLearningData';
import { LexiconEntry, InterpretationMethod, EssentialConcept } from '@/types/bible';

export type InterpretationTab =
  | 'etymology'
  | 'word-study'
  | 'types-shadows'
  | 'methods'
  | 'concepts'
  | 'principles';

export default function InterpretationPage({
  initialTab = 'etymology',
  initialWordId,
}: {
  initialTab?: InterpretationTab;
  initialWordId?: string;
}) {
  const {
    preferences,
    navigateToPassage,
    navigateToReferenceString,
    setActivePage,
  } = usePlatform();

  const isLight = preferences.theme === 'light';
  const isChildren = preferences.experienceMode === 'children';

  const [activeTab, setActiveTab] = useState<InterpretationTab>(initialTab);

  // General search across all interpretation categories
  const [generalSearchQuery, setGeneralSearchQuery] = useState('');

  // Dedicated Word Study Search
  const [wordSearchQuery, setWordSearchQuery] = useState('');
  const [selectedWordEntry, setSelectedWordEntry] = useState<LexiconEntry | null>(
    initialWordId ? getLexiconEntryById(initialWordId) || null : null
  );

  // Selected Method modal / detail state
  const [selectedMethod, setSelectedMethod] = useState<InterpretationMethod | null>(null);

  // Selected Concept detail state
  const [selectedConcept, setSelectedConcept] = useState<EssentialConcept | null>(null);

  // Types & Shadows subcategory tab
  const [typologySubTab, setTypologySubTab] = useState<'types' | 'shadows' | 'antitypes'>('types');

  // Word Study filtered list
  const filteredLexicon = useMemo(() => {
    return searchBiblicalLexicon(wordSearchQuery);
  }, [wordSearchQuery]);

  // General search matches across methods and concepts
  const generalSearchResults = useMemo(() => {
    if (!generalSearchQuery.trim()) return null;
    const q = generalSearchQuery.trim().toLowerCase();

    const matchedMethods = INTERPRETATION_METHODS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.definition.toLowerCase().includes(q) ||
        m.detailedExplanation.toLowerCase().includes(q) ||
        m.practicalApplication.toLowerCase().includes(q)
    );

    const matchedConcepts = ESSENTIAL_CONCEPTS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.definition.toLowerCase().includes(q) ||
        c.importance.toLowerCase().includes(q)
    );

    const matchedEtymology = ETYMOLOGY_EXAMPLES.filter(
      (e) =>
        e.englishWord.toLowerCase().includes(q) ||
        e.originalWord.toLowerCase().includes(q) ||
        e.meaning.toLowerCase().includes(q)
    );

    return { matchedMethods, matchedConcepts, matchedEtymology };
  }, [generalSearchQuery]);

  // Helper to navigate to a scripture in the existing Bible reader
  const handleScriptureClick = (refStr: string) => {
    navigateToReferenceString(refStr, true);
    setActivePage('bible');
  };

  // Switch to Word Study with a specific word
  const handleOpenWordStudyEntry = (entry: LexiconEntry) => {
    setSelectedWordEntry(entry);
    setActiveTab('word-study');
    setWordSearchQuery('');
  };

  return (
    <div
      className={`flex-1 flex flex-col min-h-screen pb-24 ${
        isChildren
          ? isLight
            ? 'bg-[#FFFDF4] text-slate-900'
            : 'bg-[#111629] text-slate-100'
          : isLight
          ? 'bg-[#FBF9F5] text-stone-900'
          : 'bg-[#0F0F0F] text-zinc-100'
      }`}
    >
      {/* =====================================================================
          MAIN HEADER AREA
          Requirement: Page title is "Interpretation".
          DO NOT add any subtitle, introductory description or subtext beneath.
          ===================================================================== */}
      <header
        className={`sticky top-0 z-20 px-4 sm:px-8 py-3.5 sm:py-4 border-b flex items-center justify-between transition-colors shadow-xs ${
          isChildren
            ? isLight
              ? 'bg-[#FFFDF4] border-amber-200/90 text-slate-900'
              : 'bg-[#13192E] border-indigo-900 text-slate-100'
            : isLight
            ? 'bg-[#FBF9F5] border-stone-200/90 text-stone-900'
            : 'bg-[#0F0F0F] border-zinc-800 text-zinc-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-sm ${
              isLight ? 'bg-amber-700 text-white' : 'bg-amber-500 text-zinc-950'
            }`}
          >
            <Languages className="h-4 w-4" />
          </div>
          {/* Strictly "Interpretation" with NO subtitle beneath */}
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">Interpretation</h1>
        </div>

        <button
          onClick={() => setActivePage('bible')}
          className={`rounded-xl px-3 py-1.5 text-xs font-semibold border flex items-center gap-1.5 transition ${
            isLight
              ? 'bg-white hover:bg-stone-50 border-stone-200/90 text-stone-700 shadow-2xs'
              : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
          }`}
          title="Return to Bible Reader"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Back to</span> Bible Reader
        </button>
      </header>

      {/* =====================================================================
          GENERAL INTERPRETATION SEARCH BAR
          ===================================================================== */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 pt-5 pb-2">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={generalSearchQuery}
            onChange={(e) => setGeneralSearchQuery(e.target.value)}
            placeholder="Search across interpretation methods, concepts, types, shadows, and etymology..."
            className={`w-full rounded-2xl border pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none transition ${
              isLight
                ? 'bg-white border-stone-200/90 text-stone-900 placeholder-stone-400 focus:border-amber-600 focus:ring-1 focus:ring-amber-500'
                : 'bg-[#181818] border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
            }`}
          />
          {generalSearchQuery && (
            <button
              onClick={() => setGeneralSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-zinc-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* General Search Results Overlay */}
        {generalSearchResults && (
          <div
            className={`mt-2 rounded-2xl border p-4 shadow-lg space-y-3 animate-in fade-in ${
              isLight
                ? 'bg-white border-stone-200 text-stone-900'
                : 'bg-[#1a1a1a] border-zinc-800 text-zinc-100'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
              General Search Matches ({generalSearchResults.matchedMethods.length + generalSearchResults.matchedConcepts.length + generalSearchResults.matchedEtymology.length})
            </div>

            {generalSearchResults.matchedMethods.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400">Methods:</span>
                <div className="flex flex-wrap gap-1.5">
                  {generalSearchResults.matchedMethods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMethod(m);
                        setGeneralSearchQuery('');
                        setActiveTab('methods');
                      }}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium border bg-stone-50 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 border-stone-200 dark:border-zinc-700"
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {generalSearchResults.matchedConcepts.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400">Concepts:</span>
                <div className="flex flex-wrap gap-1.5">
                  {generalSearchResults.matchedConcepts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedConcept(c);
                        setGeneralSearchQuery('');
                        setActiveTab('concepts');
                      }}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium border bg-stone-50 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 border-stone-200 dark:border-zinc-700"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {generalSearchResults.matchedEtymology.length > 0 && (
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400">Etymology Examples:</span>
                <div className="flex flex-wrap gap-1.5">
                  {generalSearchResults.matchedEtymology.map((e) => (
                    <button
                      key={e.englishWord}
                      onClick={() => {
                        setActiveTab('etymology');
                        setGeneralSearchQuery('');
                      }}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium border bg-stone-50 dark:bg-zinc-800 hover:bg-amber-100 dark:hover:bg-amber-950/40 border-stone-200 dark:border-zinc-700"
                    >
                      {e.englishWord} ({e.originalWord})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* =====================================================================
          MAIN NAVIGATION TABS (6 Clearly Organised Sections)
          1. Etymology
          2. Word Study
          3. Types, Shadows and Antitypes
          4. Interpretation Methods
          5. Essential Bible Study Concepts
          6. Interpretation Principles
          ===================================================================== */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 pt-3 pb-4">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1 border-b border-stone-200/90 dark:border-zinc-800">
          {(
            [
              { id: 'etymology', label: 'Etymology' },
              { id: 'word-study', label: 'Word Study' },
              { id: 'types-shadows', label: 'Types & Shadows' },
              { id: 'methods', label: 'Interpretation Methods' },
              { id: 'concepts', label: 'Essential Concepts' },
              { id: 'principles', label: 'Principles' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition border ${
                activeTab === tab.id
                  ? isLight
                    ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                    : 'bg-amber-500 text-zinc-950 border-amber-500 shadow-xs'
                  : isLight
                  ? 'bg-white hover:bg-stone-50 border-stone-200/90 text-stone-700'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================================
          TAB 1: ETYMOLOGY
          ===================================================================== */}
      {activeTab === 'etymology' && (
        <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 space-y-6 pt-2 animate-in fade-in duration-150">
          {/* Conceptual Foundations */}
          <section
            className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-4 ${
              isLight
                ? 'bg-white border-stone-200/90 text-stone-900'
                : 'bg-[#181818] border-zinc-800 text-zinc-100'
            }`}
          >
            <h2 className="text-base sm:text-lg font-bold">Understanding Biblical Etymology</h2>
            <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-zinc-300">
              <p>
                <strong>What Etymology Means:</strong> Etymology is the study of the historical origin,
                derivation, and structural development of words. Biblical etymology examines how words
                originated in the ancient biblical languages—<strong>Hebrew</strong> (the covenant language
                of the Old Testament), <strong>Aramaic</strong> (the post-exilic and Galilean lingua franca),
                and <strong>Koinē Greek</strong> (the common international language of the Hellenistic
                world in which the New Testament was penned).
              </p>
              <p>
                <strong>Why Original Biblical Words Matter:</strong> Modern translations are invaluable, but
                translation is inherently an act of interpretation. English words often carry cultural baggage
                or lack the multidimensional breadth of ancient terms. For example, while English uses the
                single word <em>Love</em>, the Greek New Testament distinguishes between <em>Agapē</em> (sacrificial,
                unconditional devotion) and <em>Phileō</em> (affectionate friendship).
              </p>
              <p>
                <strong>Root Meaning vs. Contextual Meaning (Guarding Against the Root Fallacy):</strong>{' '}
                A crucial hermeneutical rule: <em>A word’s root meaning does not dictate its usage in every context.</em>{' '}
                Linguist James Barr noted the danger of the "root fallacy"—assuming that a word always carries its
                ancient etymological building blocks. For instance, while <em>ekklēsia</em> etymologically derives
                from <em>ek</em> (out) and <em>kaleō</em> (call), in the 1st-century Greco-Roman world it simply meant
                an "assembly" or "congregation", not an esoteric "called-out class". Context is always king.
              </p>
              <p>
                <strong>Semantic Development Over Time:</strong> Words evolve. Words in classical Greek (5th century BC)
                often shifted significantly in meaning by the time of Koinē Greek (1st century AD). For example,{' '}
                <em>euangelion</em> initially meant a reward for bringing good news in Homeric times, but evolved into
                an imperial proclamation of victory under the Caesars, which the Apostles boldly applied to King Jesus.
              </p>
            </div>

            {/* Quick link to Word Study */}
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('word-study')}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold border transition ${
                  isLight
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                    : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-300'
                }`}
              >
                <span>Open Dedicated Word Study Lexicon</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </section>

          {/* Interactive Examples Table */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold tracking-tight text-stone-500 dark:text-zinc-400 uppercase tracking-wider">
              Core Biblical Etymology Examples
            </h3>

            <div className="grid gap-3 sm:gap-4">
              {ETYMOLOGY_EXAMPLES.map((ex) => (
                <div
                  key={ex.englishWord}
                  className={`rounded-2xl border p-4 sm:p-5 shadow-xs space-y-3 transition ${
                    isLight
                      ? 'bg-white border-stone-200/90 text-stone-900'
                      : 'bg-[#181818] border-zinc-800 text-zinc-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-amber-800 dark:text-amber-400">
                        {ex.englishWord}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md font-semibold bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700">
                        {ex.originalWord} ({ex.language})
                      </span>
                    </div>

                    {ex.lexiconId && (
                      <button
                        onClick={() => {
                          const entry = getLexiconEntryById(ex.lexiconId!);
                          if (entry) handleOpenWordStudyEntry(entry);
                        }}
                        className={`text-xs font-bold flex items-center gap-1 hover:underline ${
                          isLight ? 'text-amber-800' : 'text-amber-300'
                        }`}
                      >
                        <span>View in Lexicon</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-semibold">{ex.meaning}</p>

                  <div className="text-xs leading-relaxed space-y-1.5 text-stone-600 dark:text-zinc-300">
                    <p>
                      <strong>Historical Development:</strong> {ex.historicalDevelopment}
                    </p>
                    <p>
                      <strong>Root vs. Context:</strong> {ex.rootVsContextualMeaning}
                    </p>
                  </div>

                  {/* Clickable Scripture References */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] font-semibold text-stone-400">References:</span>
                    {ex.scriptureReferences.map((refStr) => (
                      <button
                        key={refStr}
                        onClick={() => handleScriptureClick(refStr)}
                        className={`rounded-lg px-2 py-0.5 text-xs font-bold border transition ${
                          isLight
                            ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                            : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                        }`}
                        title={`Open ${refStr} in Bible Reader`}
                      >
                        [{refStr}]
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* =====================================================================
          TAB 2: WORD STUDY (DEDICATED ORIGINAL-LANGUAGE SEARCH)
          ===================================================================== */}
      {activeTab === 'word-study' && (
        <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 space-y-6 pt-2 animate-in fade-in duration-150">
          {/* Word Study Search Header */}
          <section
            className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-4 ${
              isLight
                ? 'bg-white border-stone-200/90 text-stone-900'
                : 'bg-[#181818] border-zinc-800 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-base sm:text-lg font-bold">Original-Language Lexicon & Word Study</h2>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                  Search Hebrew, Greek, and Aramaic root words, Strong’s numbers, transliterations, and theological meanings.
                </p>
              </div>

              {/* Source attribution notice */}
              <span className="text-[10px] font-medium text-stone-400 dark:text-zinc-500">
                Sources: Strong’s Concordance • Thayer’s Greek Lexicon • BDB Hebrew Lexicon
              </span>
            </div>

            {/* Dedicated Lexicon Search Input */}
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={wordSearchQuery}
                onChange={(e) => {
                  setWordSearchQuery(e.target.value);
                  setSelectedWordEntry(null);
                }}
                placeholder="Search English word (e.g. Love, Repentance, Grace, Faith), Strong's (G3341, H2617), or Greek/Hebrew..."
                className={`w-full rounded-2xl border pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none transition ${
                  isLight
                    ? 'bg-stone-50/80 border-stone-200/90 text-stone-900 placeholder-stone-400 focus:bg-white focus:border-amber-600 focus:ring-1 focus:ring-amber-500'
                    : 'bg-[#121212] border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:bg-[#1a1a1a] focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                }`}
              />
              {wordSearchQuery && (
                <button
                  onClick={() => setWordSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-zinc-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Word Pills (Section 4 words) */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Quick Jump:</span>
              {[
                'Love',
                'Repentance',
                'Baptism',
                'Grace',
                'Faith',
                'Salvation',
                'Church',
                'Glory',
                'Righteousness',
                'Worship',
                'Covenant',
                'Kingdom',
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setWordSearchQuery(term);
                    setSelectedWordEntry(null);
                  }}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition ${
                    wordSearchQuery.toLowerCase() === term.toLowerCase()
                      ? isLight
                        ? 'bg-amber-700 text-white border-amber-700'
                        : 'bg-amber-500 text-zinc-950 border-amber-500'
                      : isLight
                      ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </section>

          {/* Detailed Word Entry View if one is selected */}
          {selectedWordEntry ? (
            <section
              className={`rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-150 ${
                isLight
                  ? 'bg-white border-stone-200/90 text-stone-900'
                  : 'bg-[#181818] border-zinc-800 text-zinc-100'
              }`}
            >
              <div className="flex items-center justify-between gap-3 border-b pb-3 border-stone-200/80 dark:border-zinc-800">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-800 dark:text-amber-400">
                    {selectedWordEntry.englishWord}
                  </h3>
                  <span className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-white">
                    {selectedWordEntry.originalSpelling}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded font-semibold bg-stone-100 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700">
                    {selectedWordEntry.transliteration} • {selectedWordEntry.language}
                  </span>
                  {selectedWordEntry.strongsNumber && (
                    <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      Strong’s {selectedWordEntry.strongsNumber}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedWordEntry(null)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition ${
                    isLight
                      ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-600'
                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                  }`}
                >
                  Back to List
                </button>
              </div>

              {/* 14 Required Fields Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-stone-400 block text-[11px] uppercase tracking-wider">
                    Part of Speech
                  </span>
                  <p className="font-semibold text-stone-800 dark:text-zinc-200">
                    {selectedWordEntry.partOfSpeech}
                  </p>
                </div>

                {selectedWordEntry.pronunciation && (
                  <div>
                    <span className="font-bold text-stone-400 block text-[11px] uppercase tracking-wider">
                      Pronunciation
                    </span>
                    <p className="font-semibold text-stone-800 dark:text-zinc-200">
                      /{selectedWordEntry.pronunciation}/
                    </p>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <span className="font-bold text-stone-400 block text-[11px] uppercase tracking-wider">
                    Root Word & Related Forms
                  </span>
                  <p className="leading-relaxed text-stone-700 dark:text-zinc-300">
                    {selectedWordEntry.rootWordAndRelatedForms}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <span className="font-bold text-stone-400 block text-[11px] uppercase tracking-wider">
                    Lexical Definition
                  </span>
                  <p className="leading-relaxed text-stone-800 dark:text-zinc-200 font-medium">
                    {selectedWordEntry.lexicalDefinition}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <span className="font-bold text-stone-400 block text-[11px] uppercase tracking-wider">
                    Etymology & Historical Origin
                  </span>
                  <p className="leading-relaxed text-stone-700 dark:text-zinc-300">
                    {selectedWordEntry.etymologyAndOrigin}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <span className="font-bold text-stone-400 block text-[11px] uppercase tracking-wider">
                    Contextual Meaning
                  </span>
                  <p className="leading-relaxed text-stone-700 dark:text-zinc-300">
                    {selectedWordEntry.contextualMeaning}
                  </p>
                </div>

                {selectedWordEntry.distinctionNote && (
                  <div
                    className={`sm:col-span-2 rounded-xl p-3 border text-xs leading-relaxed ${
                      isLight
                        ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                        : 'bg-amber-950/20 border-amber-800 text-amber-200'
                    }`}
                  >
                    <strong>Lexical Distinction Note:</strong> {selectedWordEntry.distinctionNote}
                  </div>
                )}
              </div>

              {/* Examples of Usage */}
              {selectedWordEntry.examplesOfUsage && selectedWordEntry.examplesOfUsage.length > 0 && (
                <div className="pt-2 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Examples of Usage in Passages
                  </h4>
                  <div className="space-y-2">
                    {selectedWordEntry.examplesOfUsage.map((ex, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl p-3 border text-xs space-y-1 ${
                          isLight
                            ? 'bg-stone-50 border-stone-200/80 text-stone-800'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => handleScriptureClick(ex.ref)}
                            className="font-bold text-amber-800 dark:text-amber-400 hover:underline"
                          >
                            {ex.ref}
                          </button>
                        </div>
                        <p className="font-serif italic text-stone-700 dark:text-zinc-300">
                          “{ex.passageSnippet}”
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-zinc-400">
                          {ex.translationNote}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Relevant Scripture References */}
              <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-stone-400">
                  Relevant Scripture References ({selectedWordEntry.biblicalOccurrences} total occurrences):
                </span>
                {selectedWordEntry.relevantReferences.map((refStr) => (
                  <button
                    key={refStr}
                    onClick={() => handleScriptureClick(refStr)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition ${
                      isLight
                        ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800'
                        : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                    }`}
                  >
                    [{refStr}]
                  </button>
                ))}
              </div>

              {/* Source attribution footer */}
              <div className="pt-3 border-t border-stone-200/80 dark:border-zinc-800 text-[11px] text-stone-400">
                <strong>Source:</strong> {selectedWordEntry.sourceAttribution}
              </div>
            </section>
          ) : (
            /* Results List */
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Available Lexicon Entries ({filteredLexicon.length})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredLexicon.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => setSelectedWordEntry(entry)}
                    className={`text-left rounded-2xl border p-4 shadow-xs transition hover:scale-[1.01] ${
                      isLight
                        ? 'bg-white hover:bg-amber-50/40 border-stone-200/90 text-stone-900'
                        : 'bg-[#181818] hover:bg-zinc-800/60 border-zinc-800 text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-amber-800 dark:text-amber-400">
                        {entry.englishWord}
                      </span>
                      {entry.strongsNumber && (
                        <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                          {entry.strongsNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex items-baseline gap-2 text-xs mb-1.5">
                      <span className="font-serif font-bold text-stone-900 dark:text-white">
                        {entry.originalSpelling}
                      </span>
                      <span className="text-stone-400">
                        ({entry.transliteration} • {entry.language})
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-zinc-300 line-clamp-2">
                      {entry.lexicalDefinition}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </main>
      )}

      {/* =====================================================================
          TAB 3: TYPES, SHADOWS AND ANTITYPES
          ===================================================================== */}
      {activeTab === 'types-shadows' && (
        <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 space-y-6 pt-2 animate-in fade-in duration-150">
          {/* Subcategory Selector */}
          <div className="flex items-center gap-2 border-b border-stone-200/80 dark:border-zinc-800 pb-2">
            {[
              { id: 'types', label: '1. Types' },
              { id: 'shadows', label: '2. Shadows' },
              { id: 'antitypes', label: '3. Antitypes' },
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setTypologySubTab(sub.id as any)}
                className={`rounded-xl px-3.5 py-1.5 text-xs sm:text-sm font-bold transition border ${
                  typologySubTab === sub.id
                    ? isLight
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-amber-500 text-zinc-950 border-amber-500'
                    : isLight
                    ? 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300'
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          {/* Subcategory 1: Types */}
          {typologySubTab === 'types' && (
            <div className="space-y-4">
              <section
                className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-3 ${
                  isLight
                    ? 'bg-white border-stone-200/90 text-stone-900'
                    : 'bg-[#181818] border-zinc-800 text-zinc-100'
                }`}
              >
                <h3 className="text-base sm:text-lg font-bold">What is a Biblical Type?</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-zinc-300">
                  {TYPOLOGY_GUIDE.typesGuide.definition}
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-zinc-300">
                  {TYPOLOGY_GUIDE.typesGuide.howTheyFunction}
                </p>

                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Rules for Identifying Legitimate Biblical Types
                  </h4>
                  <ul className="list-disc pl-5 text-xs space-y-1 text-stone-600 dark:text-zinc-300">
                    {TYPOLOGY_GUIDE.typesGuide.identificationRules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </section>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Primary Biblical Types & Their Christological Fulfillment
                </h4>
                <div className="grid gap-3">
                  {TYPOLOGY_GUIDE.typesGuide.examples.map((ex) => (
                    <div
                      key={ex.name}
                      className={`rounded-2xl border p-4 shadow-xs space-y-2 ${
                        isLight
                          ? 'bg-white border-stone-200/90 text-stone-900'
                          : 'bg-[#181818] border-zinc-800 text-zinc-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-amber-800 dark:text-amber-400">
                          {ex.name}
                        </span>
                        <span className="text-xs font-semibold text-stone-500">
                          {ex.passage}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-stone-600 dark:text-zinc-300">
                        {ex.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subcategory 2: Shadows */}
          {typologySubTab === 'shadows' && (
            <div className="space-y-4">
              <section
                className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-3 ${
                  isLight
                    ? 'bg-white border-stone-200/90 text-stone-900'
                    : 'bg-[#181818] border-zinc-800 text-zinc-100'
                }`}
              >
                <h3 className="text-base sm:text-lg font-bold">What is a Biblical Shadow?</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-zinc-300">
                  {TYPOLOGY_GUIDE.shadowsGuide.definition}
                </p>
                <div
                  className={`rounded-xl p-3 border text-xs leading-relaxed font-serif italic ${
                    isLight
                      ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                      : 'bg-amber-950/20 border-amber-800 text-amber-200'
                  }`}
                >
                  {TYPOLOGY_GUIDE.shadowsGuide.colossiansHebrewsPrinciple}
                </div>
              </section>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Key Old Testament Shadows Fulfilled in Christ
                </h4>
                <div className="grid gap-3">
                  {TYPOLOGY_GUIDE.shadowsGuide.institutions.map((inst) => (
                    <div
                      key={inst.name}
                      className={`rounded-2xl border p-4 shadow-xs space-y-2 ${
                        isLight
                          ? 'bg-white border-stone-200/90 text-stone-900'
                          : 'bg-[#181818] border-zinc-800 text-zinc-100'
                      }`}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-sm font-bold text-amber-800 dark:text-amber-400">
                          {inst.name}
                        </span>
                        <span className="text-xs text-stone-500">
                          OT: {inst.otPassage} → NT: {inst.ntFulfilment}
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-stone-600 dark:text-zinc-300">
                        {inst.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Subcategory 3: Antitypes */}
          {typologySubTab === 'antitypes' && (
            <div className="space-y-4">
              <section
                className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-3 ${
                  isLight
                    ? 'bg-white border-stone-200/90 text-stone-900'
                    : 'bg-[#181818] border-zinc-800 text-zinc-100'
                }`}
              >
                <h3 className="text-base sm:text-lg font-bold">What is an Antitype?</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-zinc-300">
                  {TYPOLOGY_GUIDE.antitypesGuide.definition}
                </p>
                <div className="text-xs leading-relaxed space-y-1 text-stone-600 dark:text-zinc-300">
                  <p>
                    <strong>Word Origin:</strong> {TYPOLOGY_GUIDE.antitypesGuide.wordOrigin}
                  </p>
                  <p>
                    <strong>Relationship to Type:</strong> {TYPOLOGY_GUIDE.antitypesGuide.relationshipToType}
                  </p>
                </div>
              </section>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Major Type-Antitype Fulfillments in Scripture
                </h4>
                <div className="grid gap-3">
                  {TYPOLOGY_GUIDE.antitypesGuide.examples.map((item) => (
                    <div
                      key={item.title}
                      className={`rounded-2xl border p-4 sm:p-5 shadow-xs space-y-2.5 ${
                        isLight
                          ? 'bg-white border-stone-200/90 text-stone-900'
                          : 'bg-[#181818] border-zinc-800 text-zinc-100'
                      }`}
                    >
                      <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">
                        {item.title}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl border bg-stone-50 dark:bg-zinc-900 border-stone-200 dark:border-zinc-800">
                          <span className="font-bold block text-stone-400 mb-1">
                            Old Testament Type ({item.typePassage})
                          </span>
                          <p className="text-stone-700 dark:text-zinc-300">{item.originalEvent}</p>
                        </div>
                        <div className="p-2.5 rounded-xl border bg-stone-50 dark:bg-zinc-900 border-stone-200 dark:border-zinc-800">
                          <span className="font-bold block text-emerald-600 dark:text-emerald-400 mb-1">
                            New Testament Antitype ({item.antitypePassage})
                          </span>
                          <p className="text-stone-700 dark:text-zinc-300">{item.ntConnection}</p>
                        </div>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-zinc-400 pt-1">
                        <strong>Spiritual Significance:</strong> {item.spiritualSignificance}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      )}

      {/* =====================================================================
          TAB 4: 15 INTERPRETATION METHODS
          ===================================================================== */}
      {activeTab === 'methods' && (
        <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 space-y-6 pt-2 animate-in fade-in duration-150">
          {selectedMethod ? (
            /* Individual Detail View for Chosen Method */
            <section
              className={`rounded-2xl border p-5 sm:p-6 shadow-sm space-y-4 animate-in fade-in duration-150 ${
                isLight
                  ? 'bg-white border-stone-200/90 text-stone-900'
                  : 'bg-[#181818] border-zinc-800 text-zinc-100'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-stone-200/80 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-full bg-amber-700 dark:bg-amber-500 text-white dark:text-zinc-950 font-bold text-xs flex items-center justify-center">
                    {selectedMethod.number}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold">{selectedMethod.name}</h3>
                </div>

                <button
                  onClick={() => setSelectedMethod(null)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition ${
                    isLight
                      ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-600'
                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                  }`}
                >
                  All 15 Methods
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-stone-400 block text-[11px] uppercase tracking-wider">
                    Definition
                  </span>
                  <p className="font-semibold text-stone-800 dark:text-zinc-200">
                    {selectedMethod.definition}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-stone-400 block text-[11px] uppercase tracking-wider">
                    Detailed Explanation
                  </span>
                  <p className="leading-relaxed text-stone-700 dark:text-zinc-300">
                    {selectedMethod.detailedExplanation}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-stone-400 block text-[11px] uppercase tracking-wider">
                    How It Works
                  </span>
                  <ul className="list-disc pl-5 text-xs space-y-1 text-stone-600 dark:text-zinc-300 pt-1">
                    {selectedMethod.howItWorks.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ul>
                </div>

                {/* Multiple Biblical Examples */}
                <div className="space-y-2 pt-1">
                  <span className="font-bold text-stone-400 block text-[11px] uppercase tracking-wider">
                    Biblical Examples
                  </span>
                  <div className="grid gap-2">
                    {selectedMethod.biblicalExamples.map((ex, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl p-3 border text-xs space-y-1 ${
                          isLight
                            ? 'bg-stone-50 border-stone-200/80 text-stone-800'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-800 dark:text-amber-400">
                            {ex.title}
                          </span>
                          <button
                            onClick={() => handleScriptureClick(ex.passage.split(';')[0].trim())}
                            className="font-mono text-[11px] text-stone-500 hover:underline"
                          >
                            {ex.passage}
                          </button>
                        </div>
                        <p className="text-stone-600 dark:text-zinc-300">{ex.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-bold text-stone-400 block text-[11px] uppercase tracking-wider">
                    Practical Application
                  </span>
                  <p className="leading-relaxed text-stone-700 dark:text-zinc-300">
                    {selectedMethod.practicalApplication}
                  </p>
                </div>

                {/* Related Methods */}
                <div className="flex items-center gap-1.5 flex-wrap pt-2">
                  <span className="text-[11px] font-semibold text-stone-400">Related Methods:</span>
                  {selectedMethod.relatedMethods.map((relName) => {
                    const found = INTERPRETATION_METHODS.find((m) => m.name === relName);
                    return (
                      <button
                        key={relName}
                        onClick={() => {
                          if (found) setSelectedMethod(found);
                        }}
                        className={`rounded-lg px-2 py-0.5 text-xs font-semibold border transition ${
                          isLight
                            ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
                            : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                        }`}
                      >
                        {relName}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 text-[11px] text-stone-400 border-t border-stone-200/80 dark:border-zinc-800">
                  <strong>Source:</strong> {selectedMethod.sourceAttribution}
                </div>
              </div>
            </section>
          ) : (
            /* Grid of 15 Methods */
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  15 Biblical Interpretation Methods
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {INTERPRETATION_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMethod(m)}
                    className={`text-left rounded-2xl border p-4 shadow-xs transition hover:scale-[1.01] ${
                      isLight
                        ? 'bg-white hover:bg-amber-50/40 border-stone-200/90 text-stone-900'
                        : 'bg-[#181818] hover:bg-zinc-800/60 border-zinc-800 text-zinc-100'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="h-6 w-6 rounded-full bg-amber-700/10 dark:bg-amber-400/20 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                        {m.number}
                      </span>
                      <h4 className="text-sm font-bold truncate">{m.name}</h4>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-zinc-300 line-clamp-2">
                      {m.shortSummary}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </main>
      )}

      {/* =====================================================================
          TAB 5: ESSENTIAL BIBLE STUDY CONCEPTS
          ===================================================================== */}
      {activeTab === 'concepts' && (
        <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 space-y-6 pt-2 animate-in fade-in duration-150">
          <section className="space-y-4">
            {ESSENTIAL_CONCEPTS.map((concept) => (
              <div
                key={concept.id}
                className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-3 ${
                  isLight
                    ? 'bg-white border-stone-200/90 text-stone-900'
                    : 'bg-[#181818] border-zinc-800 text-zinc-100'
                }`}
              >
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-bold text-amber-800 dark:text-amber-400">
                    {concept.name}
                  </h3>
                  {concept.greekOrHebrewOrigin && (
                    <span className="text-xs text-stone-500 font-serif">
                      ({concept.greekOrHebrewOrigin})
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-zinc-200">
                  {concept.definition}
                </p>

                <p className="text-xs sm:text-sm leading-relaxed text-stone-600 dark:text-zinc-300">
                  <strong>Why It Matters:</strong> {concept.importance}
                </p>

                {/* Practical Demonstration if present (e.g. John 3:5) */}
                {concept.practicalDemonstration && (
                  <div
                    className={`rounded-xl p-3.5 border space-y-2 ${
                      isLight
                        ? 'bg-amber-50/50 border-amber-200/90 text-stone-900'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-100'
                    }`}
                  >
                    <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                      Practical Demonstration: {concept.practicalDemonstration.passage}
                    </span>
                    <ol className="list-decimal pl-4 text-xs space-y-1 text-stone-700 dark:text-zinc-300">
                      {concept.practicalDemonstration.stepByStep.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}

                {/* Key Subtopics (e.g. Systematic Theology branches or Biblical Theology themes) */}
                {concept.keySubtopics && concept.keySubtopics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {concept.keySubtopics.map((sub, idx) => (
                      <div
                        key={idx}
                        className={`rounded-xl p-3 border text-xs space-y-1 ${
                          isLight
                            ? 'bg-stone-50 border-stone-200 text-stone-800'
                            : 'bg-zinc-900 border-zinc-800 text-zinc-200'
                        }`}
                      >
                        <span className="font-bold text-amber-800 dark:text-amber-400 block">
                          {sub.title}
                        </span>
                        <p className="text-stone-600 dark:text-zinc-400">{sub.description}</p>
                        <div className="flex gap-1 flex-wrap pt-0.5">
                          {sub.references.map((r) => (
                            <button
                              key={r}
                              onClick={() => handleScriptureClick(r)}
                              className="text-[10px] font-bold text-stone-500 hover:underline"
                            >
                              [{r}]
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* References */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[11px] font-semibold text-stone-400">Scriptures:</span>
                  {concept.scriptureReferences.map((refStr) => (
                    <button
                      key={refStr}
                      onClick={() => handleScriptureClick(refStr)}
                      className={`rounded-lg px-2 py-0.5 text-xs font-bold border transition ${
                        isLight
                          ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-800'
                          : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                      }`}
                    >
                      [{refStr}]
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </main>
      )}

      {/* =====================================================================
          TAB 6: 8 INTERPRETATION PRINCIPLES
          ===================================================================== */}
      {activeTab === 'principles' && (
        <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 space-y-6 pt-2 animate-in fade-in duration-150">
          <section
            className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-3 ${
              isLight
                ? 'bg-white border-stone-200/90 text-stone-900'
                : 'bg-[#181818] border-zinc-800 text-zinc-100'
            }`}
          >
            <h2 className="text-base sm:text-lg font-bold">The 8 Complementary Interpretation Principles</h2>
            <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-zinc-300">
              These eight principles are not competing theories or mechanical checklists; they are
              interlocking dimensions of sound Bible study. When used together, they safeguard against
              error, uncover the author’s original intent, and illuminate the text’s timeless application.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {INTERPRETATION_PRINCIPLES.map((pr) => (
              <div
                key={pr.number}
                className={`rounded-2xl border p-4 sm:p-5 shadow-xs space-y-2 ${
                  isLight
                    ? 'bg-white border-stone-200/90 text-stone-900'
                    : 'bg-[#181818] border-zinc-800 text-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-amber-700/10 dark:bg-amber-400/20 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {pr.number}
                  </span>
                  <h4 className="text-sm font-bold">{pr.name}</h4>
                </div>

                <p className="text-xs font-semibold text-stone-800 dark:text-zinc-200">
                  {pr.role}
                </p>

                <p className="text-xs leading-relaxed text-stone-600 dark:text-zinc-300">
                  {pr.explanation}
                </p>

                <div className="text-[11px] p-2 rounded-lg bg-stone-50 dark:bg-zinc-900 border border-stone-200/80 dark:border-zinc-800 text-stone-500 dark:text-zinc-400">
                  <strong>How it complements others:</strong> {pr.complementaryAspect}
                </div>
              </div>
            ))}
          </div>

          {/* Practical Step-by-Step Study Demonstration */}
          <section
            className={`rounded-2xl border p-5 sm:p-6 shadow-xs space-y-3 ${
              isLight
                ? 'bg-white border-stone-200/90 text-stone-900'
                : 'bg-[#181818] border-zinc-800 text-zinc-100'
            }`}
          >
            <h3 className="text-sm sm:text-base font-bold text-amber-800 dark:text-amber-400">
              Practical Step-by-Step Study Blueprint: Applying the Principles
            </h3>
            <p className="text-xs text-stone-600 dark:text-zinc-300">
              Example: How to study a passage (e.g. John 3:1–10) using the complementary principles:
            </p>

            <ol className="list-decimal pl-5 text-xs sm:text-sm space-y-2 text-stone-700 dark:text-zinc-300">
              <li>
                <strong>Step 1 (Historical & Cultural):</strong> Identify who wrote the text, to whom, when, and what cultural circumstances surrounded the dialogue (Nicodemus, Sanhedrin, Passover season).
              </li>
              <li>
                <strong>Step 2 (Literary & Contextual):</strong> Read the entire chapter. Notice what comes before (cleansing the temple; sign-faith) and what comes after (John the Baptist’s testimony).
              </li>
              <li>
                <strong>Step 3 (Grammatical & Lexical):</strong> Look up key original terms (e.g. <em>anōthen</em> = from above; <em>hydōr</em> and <em>pneuma</em> governed by a single preposition).
              </li>
              <li>
                <strong>Step 4 (Comparative & Cross-Referencing):</strong> Find where the Old Testament promises "water and spirit" (Ezekiel 36:25–27; Titus 3:5).
              </li>
              <li>
                <strong>Step 5 (Theological & Typological):</strong> Connect the passage to the doctrine of regeneration, the insufficiency of human merit, and the bronze serpent lifted up (John 3:14).
              </li>
              <li>
                <strong>Step 6 (Application):</strong> Ask: What does this teach about human helplessness, God’s sovereign grace, and how we must place our faith in Christ today?
              </li>
            </ol>
          </section>
        </main>
      )}
    </div>
  );
}

