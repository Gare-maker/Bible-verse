'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  ArrowLeft,
  BookMarked,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Info,
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
  INTERPRETATION_METHODS,
  ESSENTIAL_CONCEPTS,
  INTERPRETATION_PRINCIPLES,
  EtymologyExample,
} from '@/data/interpretationLearningData';
import {
  BIBLICAL_NAMES,
  searchBiblicalNames,
  getNameById,
} from '@/data/biblicalNamesData';
import {
  TYPES_AND_SHADOWS_LIBRARY,
  searchTypesAndShadows,
  getTypeAndShadowById,
} from '@/data/typesAndShadowsLibrary';
import {
  LexiconEntry,
  InterpretationMethod,
  BiblicalNameEntry,
  BiblicalTypeAndShadowEntry,
  TypologyCategory,
} from '@/types/bible';

export type StudyCategory =
  | 'word-study'
  | 'names'
  | 'etymology'
  | 'lexicon'
  | 'methods'
  | 'types-shadows';

export default function StudyPage({
  initialCategory = 'word-study',
  initialItemId,
}: {
  initialCategory?: StudyCategory;
  initialItemId?: string;
}) {
  const { preferences, navigateToReferenceString, setActivePage, showToast } =
    usePlatform();

  const isLight = preferences.theme === 'light';
  const isChildren = preferences.experienceMode === 'children';

  // Active Study Category
  const [activeCategory, setActiveCategory] = useState<StudyCategory>(initialCategory);

  // Unified Primary Search Query
  const [unifiedSearchQuery, setUnifiedSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Selected Detail States with Stable IDs
  const [selectedWordEntry, setSelectedWordEntry] = useState<LexiconEntry | null>(
    initialItemId ? getLexiconEntryById(initialItemId) || null : null
  );
  const [selectedNameEntry, setSelectedNameEntry] = useState<BiblicalNameEntry | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<InterpretationMethod | null>(null);
  const [selectedTypeShadow, setSelectedTypeShadow] =
    useState<BiblicalTypeAndShadowEntry | null>(null);
  const [selectedEtymology, setSelectedEtymology] = useState<EtymologyExample | null>(null);

  // Sub-category filter for Types & Shadows
  const [selectedTypologyCategory, setSelectedTypologyCategory] =
    useState<TypologyCategory | 'ALL'>('ALL');

  // Always scroll to top when category changes or detail opens
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  };

  const handleCategorySwitch = (cat: StudyCategory) => {
    setActiveCategory(cat);
    setSelectedMethod(null);
    scrollToTop();
  };

  // Close search overlay when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Primary Unified Search Engine across all biblical assets
  const unifiedSearchResults = useMemo(() => {
    const q = unifiedSearchQuery.trim().toLowerCase();
    if (!q) return null;

    // 1. Word Study / Lexicon matches (Exact matches prioritized at the top!)
    const words = searchBiblicalLexicon(q).slice(0, 5);

    // 2. Biblical Names matches
    const names = searchBiblicalNames(q).slice(0, 4);

    // 3. Types and Shadows matches
    const typesAndShadows = searchTypesAndShadows(q).slice(0, 4);

    // 4. Interpretation Methods matches
    const methods = INTERPRETATION_METHODS.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.slug.toLowerCase().includes(q) ||
        m.shortSummary.toLowerCase().includes(q)
    ).slice(0, 3);

    // 5. Etymology matches
    const etymologies = ETYMOLOGY_EXAMPLES.filter(
      (e) =>
        e.englishWord.toLowerCase().includes(q) ||
        e.originalWord.toLowerCase().includes(q) ||
        e.transliteration.toLowerCase().includes(q)
    ).slice(0, 3);

    const totalCount =
      words.length + names.length + typesAndShadows.length + methods.length + etymologies.length;

    return { words, names, typesAndShadows, methods, etymologies, totalCount };
  }, [unifiedSearchQuery]);

  // Click handler to open scripture in Bible reader
  const handleScriptureClick = (refStr: string) => {
    navigateToReferenceString(refStr, true);
    setActivePage('bible');
  };

  // Navigation from search to specific item
  const handleSelectWord = (entry: LexiconEntry) => {
    setSelectedWordEntry(entry);
    setActiveCategory('word-study');
    setUnifiedSearchQuery('');
    setIsSearchFocused(false);
    scrollToTop();
  };

  const handleSelectName = (nameEntry: BiblicalNameEntry) => {
    setSelectedNameEntry(nameEntry);
    setActiveCategory('names');
    setUnifiedSearchQuery('');
    setIsSearchFocused(false);
    scrollToTop();
  };

  const handleSelectMethod = (method: InterpretationMethod) => {
    setSelectedMethod(method);
    setActiveCategory('methods');
    setUnifiedSearchQuery('');
    setIsSearchFocused(false);
    scrollToTop();
  };

  const handleSelectTypeShadow = (ts: BiblicalTypeAndShadowEntry) => {
    setSelectedTypeShadow(ts);
    setActiveCategory('types-shadows');
    setUnifiedSearchQuery('');
    setIsSearchFocused(false);
    scrollToTop();
  };

  const handleSelectEtymology = (etym: EtymologyExample) => {
    setSelectedEtymology(etym);
    setActiveCategory('etymology');
    setUnifiedSearchQuery('');
    setIsSearchFocused(false);
    scrollToTop();
  };

  // Filtered lists for the active tab view
  const currentCategoryWords = useMemo(() => {
    return BIBLICAL_LEXICON;
  }, []);

  const currentCategoryNames = useMemo(() => {
    return BIBLICAL_NAMES;
  }, []);

  const currentTypesAndShadows = useMemo(() => {
    if (selectedTypologyCategory === 'ALL') return TYPES_AND_SHADOWS_LIBRARY;
    return TYPES_AND_SHADOWS_LIBRARY.filter((item) => item.category === selectedTypologyCategory);
  }, [selectedTypologyCategory]);

  return (
    <div
      className={`flex-1 flex flex-col min-h-screen pb-28 lg:pb-16 ${
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
          HEADER (Section 2 Requirement)
          - Title: "Study"
          - NO icon before the title
          - Search field directly below the title
          - Clean, uncluttered, consistent with application design
          ===================================================================== */}
      <header
        className={`sticky top-0 z-30 px-4 sm:px-8 pt-5 pb-4 border-b transition-colors shadow-xs ${
          isChildren
            ? isLight
              ? 'bg-[#FFFDF4]/95 border-amber-200/90 text-slate-900 backdrop-blur-md'
              : 'bg-[#13192E]/95 border-indigo-900/80 text-slate-100 backdrop-blur-md'
            : isLight
            ? 'bg-[#FBF9F5]/95 border-stone-200/90 text-stone-900 backdrop-blur-md'
            : 'bg-[#0F0F0F]/95 border-zinc-800/90 text-zinc-100 backdrop-blur-md'
        }`}
      >
        <div className="max-w-5xl mx-auto w-full space-y-3">
          {/* Top Title Bar: STRICTLY "Study" without any icon before it */}
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              Study
            </h1>
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
              <span className="hidden sm:inline">Bible Reader</span>
            </button>
          </div>

          {/* Single Unified Primary Search Field directly below the title */}
          <div ref={searchContainerRef} className="relative w-full">
            <div
              className={`relative rounded-2xl border transition-all ${
                isSearchFocused
                  ? isLight
                    ? 'border-amber-600 ring-2 ring-amber-500/20 shadow-md bg-white'
                    : 'border-amber-400 ring-2 ring-amber-400/20 shadow-md bg-[#181818]'
                  : isLight
                  ? 'border-stone-200/90 bg-white hover:border-stone-300 shadow-xs'
                  : 'border-zinc-800 bg-[#161616] hover:border-zinc-700'
              }`}
            >
              <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 dark:text-zinc-500" />
              <input
                type="text"
                value={unifiedSearchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setUnifiedSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Search biblical words, Greek/Hebrew terms, Strong's numbers, names, or types..."
                className={`w-full bg-transparent pl-10 pr-20 py-2.5 sm:py-3 text-xs sm:text-sm focus:outline-none ${
                  isLight
                    ? 'text-stone-900 placeholder-stone-400'
                    : 'text-zinc-100 placeholder-zinc-500'
                }`}
              />
              {unifiedSearchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setUnifiedSearchQuery('');
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-600 dark:hover:text-zinc-200 px-1 py-0.5"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Live Search Results Dropdown Overlay */}
            {isSearchFocused && unifiedSearchResults && unifiedSearchResults.totalCount > 0 && (
              <div
                className={`absolute top-full left-0 right-0 mt-2 rounded-2xl border shadow-2xl p-4 z-50 max-h-[460px] overflow-y-auto space-y-4 animate-in fade-in duration-150 ${
                  isLight
                    ? 'bg-white border-stone-200 text-stone-900'
                    : 'bg-[#181818] border-zinc-800 text-zinc-100'
                }`}
              >
                {/* 1. Word Study Results */}
                {unifiedSearchResults.words.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider text-amber-700 dark:text-amber-400">
                      Word Study & Lexicon ({unifiedSearchResults.words.length})
                    </span>
                    <div className="grid gap-1.5">
                      {unifiedSearchResults.words.map((w) => (
                        <button
                          key={w.id}
                          onClick={() => handleSelectWord(w)}
                          className={`w-full rounded-xl p-2.5 text-left text-xs transition border flex items-center justify-between ${
                            isLight
                              ? 'bg-stone-50/70 hover:bg-amber-50 border-stone-200/80 hover:border-amber-300'
                              : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 hover:border-amber-500/40'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-stone-900 dark:text-white">
                                {w.englishWord}
                              </span>
                              <span className="font-serif text-sm font-semibold text-amber-700 dark:text-amber-400">
                                {w.originalSpelling}
                              </span>
                              <span className="text-[11px] italic text-stone-500 dark:text-zinc-400">
                                ({w.transliteration})
                              </span>
                              {w.strongsNumber && (
                                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-200/70 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300">
                                  {w.strongsNumber}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-stone-500 dark:text-zinc-400 truncate mt-0.5">
                              {w.lexicalDefinition}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-stone-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Biblical Names Results */}
                {unifiedSearchResults.names.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider text-sky-700 dark:text-sky-400">
                      Biblical Name Meanings ({unifiedSearchResults.names.length})
                    </span>
                    <div className="grid gap-1.5">
                      {unifiedSearchResults.names.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleSelectName(n)}
                          className={`w-full rounded-xl p-2.5 text-left text-xs transition border flex items-center justify-between ${
                            isLight
                              ? 'bg-stone-50/70 hover:bg-sky-50 border-stone-200/80 hover:border-sky-300'
                              : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 hover:border-sky-500/40'
                          }`}
                        >
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-stone-900 dark:text-white">
                                {n.name}
                              </span>
                              <span className="font-serif text-sm font-semibold text-sky-700 dark:text-sky-400">
                                {n.originalSpelling}
                              </span>
                              <span className="text-[11px] text-stone-500 dark:text-zinc-400">
                                — &quot;{n.meaning}&quot;
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 dark:text-zinc-400 truncate mt-0.5">
                              {n.biblicalPersonAssociated}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-stone-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Types and Shadows Results */}
                {unifiedSearchResults.typesAndShadows.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">
                      Types & Shadows Library ({unifiedSearchResults.typesAndShadows.length})
                    </span>
                    <div className="grid gap-1.5">
                      {unifiedSearchResults.typesAndShadows.map((ts) => (
                        <button
                          key={ts.id}
                          onClick={() => handleSelectTypeShadow(ts)}
                          className={`w-full rounded-xl p-2.5 text-left text-xs transition border flex items-center justify-between ${
                            isLight
                              ? 'bg-stone-50/70 hover:bg-emerald-50 border-stone-200/80 hover:border-emerald-300'
                              : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 hover:border-emerald-500/40'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-stone-900 dark:text-white">
                                {ts.name}
                              </span>
                              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                                {ts.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 dark:text-zinc-400 truncate mt-0.5">
                              Foreshadows: {ts.personOrRealityForeshadowed}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-stone-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Interpretation Methods Results */}
                {unifiedSearchResults.methods.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider text-purple-700 dark:text-purple-400">
                      Interpretation Methods ({unifiedSearchResults.methods.length})
                    </span>
                    <div className="grid gap-1.5">
                      {unifiedSearchResults.methods.map((m) => (
                        <button
                          key={m.id}
                          onClick={() => handleSelectMethod(m)}
                          className={`w-full rounded-xl p-2.5 text-left text-xs transition border flex items-center justify-between ${
                            isLight
                              ? 'bg-stone-50/70 hover:bg-purple-50 border-stone-200/80 hover:border-purple-300'
                              : 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 hover:border-purple-500/40'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-stone-900 dark:text-white">
                              {m.name}
                            </span>
                            <p className="text-[11px] text-stone-500 dark:text-zinc-400 truncate mt-0.5">
                              {m.shortSummary}
                            </p>
                          </div>
                          <ChevronRight className="h-4 w-4 shrink-0 text-stone-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* =====================================================================
          MAIN STUDY CATEGORIES (6 Clear Categories — Section 2)
          1. Word Study
          2. Name Meanings
          3. Etymology
          4. Lexicon
          5. Interpretation Methods
          6. Types and Shadows
          ===================================================================== */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 pt-5">
        <nav
          aria-label="Study Categories"
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2 border-b border-stone-200/70 dark:border-zinc-800/80"
        >
          {(
            [
              { id: 'word-study', label: 'Word Study' },
              { id: 'names', label: 'Name Meanings' },
              { id: 'etymology', label: 'Etymology' },
              { id: 'lexicon', label: 'Lexicon' },
              { id: 'methods', label: 'Interpretation Methods' },
              { id: 'types-shadows', label: 'Types and Shadows' },
            ] as const
          ).map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySwitch(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition border ${
                  isActive
                    ? isLight
                      ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                      : 'bg-amber-500 text-zinc-950 border-amber-500 font-bold shadow-xs'
                    : isLight
                    ? 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200/80'
                    : 'bg-[#161616] hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* =====================================================================
          SECTION CONTENT ROUTER
          ===================================================================== */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 pt-6">
        {/* -------------------------------------------------------------------
            1. WORD STUDY (Section 3: Complete 16 Fields, Search Accuracy)
            ------------------------------------------------------------------- */}
        {activeCategory === 'word-study' && (
          <div className="space-y-6">
            {selectedWordEntry ? (
              // Selected Word Study Details (All 16 Fields)
              <article className="space-y-6 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => setSelectedWordEntry(null)}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition px-3 py-1.5 rounded-xl border ${
                    isLight
                      ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
                      : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Word Study List</span>
                </button>

                <div
                  className={`rounded-3xl border p-5 sm:p-7 shadow-sm space-y-5 ${
                    isLight
                      ? 'bg-white border-stone-200/90 text-stone-900'
                      : 'bg-[#151515] border-zinc-800 text-zinc-100'
                  }`}
                >
                  {/* Top Word Card Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-stone-200/80 dark:border-zinc-800 pb-4">
                    <div>
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                          {selectedWordEntry.englishWord}
                        </h2>
                        <span className="font-serif text-3xl font-bold text-amber-700 dark:text-amber-400">
                          {selectedWordEntry.originalSpelling}
                        </span>
                        <span className="text-base italic text-stone-600 dark:text-zinc-300">
                          ({selectedWordEntry.transliteration})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-semibold">
                          {selectedWordEntry.language}
                        </span>
                        {selectedWordEntry.strongsNumber && (
                          <span className="font-mono px-2 py-0.5 rounded-full bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300 font-bold">
                            Strong&apos;s {selectedWordEntry.strongsNumber}
                          </span>
                        )}
                        <span className="text-stone-500 dark:text-zinc-400">
                          Pronunciation: <strong>{selectedWordEntry.pronunciation || selectedWordEntry.transliteration}</strong>
                        </span>
                        <span className="text-stone-500 dark:text-zinc-400">
                          • {selectedWordEntry.partOfSpeech}
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs font-bold text-stone-400 block">Occurrences</span>
                      <span className="text-xl font-bold font-mono text-amber-700 dark:text-amber-400">
                        {selectedWordEntry.biblicalOccurrences} times
                      </span>
                    </div>
                  </div>

                  {/* 16-Field Content Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                    {/* Field 8: Root Word */}
                    <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                        Root Word & Derivation
                      </span>
                      <p className="text-xs sm:text-sm leading-relaxed">
                        {selectedWordEntry.rootWordAndRelatedForms}
                      </p>
                    </div>

                    {/* Field 10: Primary Meaning */}
                    <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                        Primary Lexical Meaning
                      </span>
                      <p className="text-xs sm:text-sm leading-relaxed font-medium">
                        {selectedWordEntry.primaryMeaning || selectedWordEntry.lexicalDefinition}
                      </p>
                    </div>
                  </div>

                  {/* Field 9: Etymology (Clearly distinct from theological interpretation) */}
                  <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-200/70 dark:border-amber-900/40 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                      Etymology (Historical & Linguistic Development)
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                      {selectedWordEntry.etymologyAndOrigin}
                    </p>
                  </div>

                  {/* Field 14: Theological Significance */}
                  <div className="p-4 rounded-2xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-200/70 dark:border-blue-900/40 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300 block">
                      Theological Significance
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                      {selectedWordEntry.theologicalSignificance || selectedWordEntry.contextualMeaning}
                    </p>
                  </div>

                  {/* Field 11: Contextual Meanings */}
                  {selectedWordEntry.contextualMeanings && selectedWordEntry.contextualMeanings.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                        Contextual Meanings Across Scripture
                      </span>
                      <ul className="grid gap-2">
                        {selectedWordEntry.contextualMeanings.map((cm, idx) => (
                          <li
                            key={idx}
                            className="p-3 rounded-xl border text-xs sm:text-[13px] bg-stone-50/50 dark:bg-zinc-900/40 border-stone-200/70 dark:border-zinc-800"
                          >
                            {cm}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Field 13: Scripture References (Clickable into reader) */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                      Relevant Bible Occurrences
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedWordEntry.relevantReferences.map((ref) => (
                        <button
                          key={ref}
                          type="button"
                          onClick={() => handleScriptureClick(ref)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition flex items-center gap-1.5 ${
                            isLight
                              ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                              : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-300'
                          }`}
                          title={`Read ${ref} in Bible Reader`}
                        >
                          <span>{ref}</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Field 12: Usage Examples in Context */}
                  {selectedWordEntry.examplesOfUsage && selectedWordEntry.examplesOfUsage.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                        Usage Examples in Biblical Passages
                      </span>
                      <div className="grid gap-2.5">
                        {selectedWordEntry.examplesOfUsage.map((ex, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border space-y-1.5 text-xs bg-stone-50/50 dark:bg-zinc-900/40 border-stone-200/70 dark:border-zinc-800"
                          >
                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => handleScriptureClick(ex.ref)}
                                className="font-bold text-amber-800 dark:text-amber-400 hover:underline"
                              >
                                {ex.ref}
                              </button>
                            </div>
                            <p className="font-serif italic text-stone-800 dark:text-zinc-200">
                              &ldquo;{ex.passageSnippet}&rdquo;
                            </p>
                            <p className="text-stone-600 dark:text-zinc-400 text-[11px]">
                              {ex.translationNote}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Field 15 & 16: Historical Background & Scholarly Perspectives */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {selectedWordEntry.historicalExplanation && (
                      <div className="p-3.5 rounded-xl border bg-stone-50/50 dark:bg-zinc-900/40 border-stone-200/70 dark:border-zinc-800 space-y-1">
                        <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-400 block">
                          Historical Background
                        </span>
                        <p className="text-xs leading-relaxed text-stone-700 dark:text-zinc-300">
                          {selectedWordEntry.historicalExplanation}
                        </p>
                      </div>
                    )}
                    {selectedWordEntry.scholarlyPerspectives && (
                      <div className="p-3.5 rounded-xl border bg-stone-50/50 dark:bg-zinc-900/40 border-stone-200/70 dark:border-zinc-800 space-y-1">
                        <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-400 block">
                          Scholarly Perspectives & Debates
                        </span>
                        <p className="text-xs leading-relaxed text-stone-700 dark:text-zinc-300">
                          {selectedWordEntry.scholarlyPerspectives}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Field 7: Source Attributions */}
                  <div className="pt-3 border-t border-stone-200/70 dark:border-zinc-800 text-[11px] text-stone-500 dark:text-zinc-400 italic">
                    Lexicon Sources: {selectedWordEntry.sourceAttribution}
                  </div>
                </div>
              </article>
            ) : (
              // Word Study Catalog List
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                    Comprehensive Original Language Word Studies ({currentCategoryWords.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentCategoryWords.map((word) => (
                    <button
                      key={word.id}
                      type="button"
                      onClick={() => {
                        setSelectedWordEntry(word);
                        scrollToTop();
                      }}
                      className={`p-4 rounded-2xl border text-left transition space-y-2 group ${
                        isLight
                          ? 'bg-white hover:bg-stone-50 border-stone-200/90 shadow-2xs hover:shadow-xs'
                          : 'bg-[#151515] hover:bg-[#1b1b1b] border-zinc-800 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-sm sm:text-base group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                            {word.englishWord}
                          </h3>
                          <span className="text-xs italic text-stone-500 dark:text-zinc-400">
                            {word.transliteration}
                          </span>
                        </div>
                        <span className="font-serif text-lg font-bold text-amber-700 dark:text-amber-400">
                          {word.originalSpelling}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-2">
                        {word.lexicalDefinition}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-zinc-800/80 text-[11px]">
                        <span className="text-stone-400">{word.language}</span>
                        <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                          {word.strongsNumber || `${word.biblicalOccurrences}x`}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------
            2. NAME MEANINGS (Section 4: Hebrew, Greek & Aramaic Names)
            ------------------------------------------------------------------- */}
        {activeCategory === 'names' && (
          <div className="space-y-6">
            {selectedNameEntry ? (
              // Dedicated Name Meaning Detail Page
              <article className="space-y-6 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => setSelectedNameEntry(null)}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition px-3 py-1.5 rounded-xl border ${
                    isLight
                      ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
                      : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Name Meanings List</span>
                </button>

                <div
                  className={`rounded-3xl border p-5 sm:p-7 shadow-sm space-y-5 ${
                    isLight
                      ? 'bg-white border-stone-200/90 text-stone-900'
                      : 'bg-[#151515] border-zinc-800 text-zinc-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-stone-200/80 dark:border-zinc-800 pb-4">
                    <div>
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                          {selectedNameEntry.name}
                        </h2>
                        <span className="font-serif text-3xl font-bold text-sky-700 dark:text-sky-400">
                          {selectedNameEntry.originalSpelling}
                        </span>
                        <span className="text-base italic text-stone-600 dark:text-zinc-300">
                          ({selectedNameEntry.transliteration})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 flex-wrap text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/70 text-sky-900 dark:text-sky-300 font-semibold">
                          {selectedNameEntry.language}
                        </span>
                        <span className="text-stone-500 dark:text-zinc-400">
                          Pronunciation: <strong>{selectedNameEntry.pronunciation}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/70 dark:border-sky-800/40 text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-sky-800 dark:text-sky-300 block">
                        Meaning of the Name
                      </span>
                      <span className="text-sm sm:text-base font-bold text-sky-950 dark:text-sky-200">
                        &ldquo;{selectedNameEntry.meaning}&rdquo;
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                      Linguistic Root & Derivation
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {selectedNameEntry.linguisticRoot}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                      Biblical Person Associated
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed font-medium">
                      {selectedNameEntry.biblicalPersonAssociated}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                        Historical Background
                      </span>
                      <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-zinc-300">
                        {selectedNameEntry.historicalBackground}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                        Theological Significance
                      </span>
                      <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-zinc-300">
                        {selectedNameEntry.theologicalSignificance}
                      </p>
                    </div>
                  </div>

                  {selectedNameEntry.alternativeScholarlyInterpretations && (
                    <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-200/70 dark:border-amber-900/40 space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                        Scholarly Interpretations, Evidence & Uncertainties
                      </span>
                      <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                        {selectedNameEntry.alternativeScholarlyInterpretations}
                      </p>
                    </div>
                  )}

                  {/* Scripture References */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                      Scripture References
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[...selectedNameEntry.otReferences, ...selectedNameEntry.ntReferences].map((ref) => (
                        <button
                          key={ref}
                          type="button"
                          onClick={() => handleScriptureClick(ref)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition flex items-center gap-1.5 ${
                            isLight
                              ? 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-900'
                              : 'bg-sky-500/15 hover:bg-sky-500/25 border-sky-500/30 text-sky-300'
                          }`}
                        >
                          <span>{ref}</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-200/70 dark:border-zinc-800 text-[11px] text-stone-500 dark:text-zinc-400 italic">
                    Onomastic Sources: {selectedNameEntry.sourceAttribution}
                  </div>
                </div>
              </article>
            ) : (
              // Name Meanings Catalog
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400">
                    Biblical Names Catalogue ({currentCategoryNames.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {currentCategoryNames.map((nameEntry) => (
                    <button
                      key={nameEntry.id}
                      type="button"
                      onClick={() => {
                        setSelectedNameEntry(nameEntry);
                        scrollToTop();
                      }}
                      className={`p-4 rounded-2xl border text-left transition space-y-2 group ${
                        isLight
                          ? 'bg-white hover:bg-stone-50 border-stone-200/90 shadow-2xs hover:shadow-xs'
                          : 'bg-[#151515] hover:bg-[#1b1b1b] border-zinc-800 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-bold text-sm sm:text-base group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">
                            {nameEntry.name}
                          </h3>
                          <span className="text-xs italic text-stone-500 dark:text-zinc-400">
                            {nameEntry.transliteration}
                          </span>
                        </div>
                        <span className="font-serif text-lg font-bold text-sky-700 dark:text-sky-400">
                          {nameEntry.originalSpelling}
                        </span>
                      </div>
                      <p className="text-xs text-sky-950 dark:text-sky-300 font-semibold line-clamp-1">
                        &ldquo;{nameEntry.meaning}&rdquo;
                      </p>
                      <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-2">
                        {nameEntry.biblicalPersonAssociated}
                      </p>
                      <div className="flex items-center justify-between pt-1 border-t border-stone-100 dark:border-zinc-800/80 text-[11px]">
                        <span className="text-stone-400">{nameEntry.language}</span>
                        <span className="text-sky-700 dark:text-sky-400 font-medium">Explore &rarr;</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------
            3. ETYMOLOGY
            ------------------------------------------------------------------- */}
        {activeCategory === 'etymology' && (
          <div className="space-y-6">
            <div
              className={`rounded-3xl border p-5 sm:p-7 shadow-xs space-y-3 ${
                isLight
                  ? 'bg-white border-stone-200/90 text-stone-900'
                  : 'bg-[#151515] border-zinc-800 text-zinc-100'
              }`}
            >
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Biblical Etymology & The Root Fallacy Principle
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-stone-700 dark:text-zinc-300">
                Etymology studies the historical origins, derivation, and semantic shifts of words across time. In sound hermeneutics, James Barr and D.A. Carson warn against the <strong>root fallacy</strong>: the erroneous assumption that the original historical etymology of a word is always its true present meaning in a biblical passage. A word’s meaning is governed primarily by <em>contextual usage</em> at the time of writing.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ETYMOLOGY_EXAMPLES.map((item) => (
                <div
                  key={item.englishWord}
                  className={`p-5 rounded-2xl border space-y-3 ${
                    isLight
                      ? 'bg-white border-stone-200/90 shadow-2xs'
                      : 'bg-[#151515] border-zinc-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 border-b border-stone-200/70 dark:border-zinc-800 pb-2">
                    <div>
                      <h3 className="font-bold text-base text-stone-900 dark:text-white">
                        {item.englishWord}
                      </h3>
                      <span className="text-xs italic text-stone-500 dark:text-zinc-400">
                        {item.originalWord}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                      {item.language}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs sm:text-[13px] leading-relaxed">
                    <p>
                      <strong>Historical Development:</strong> {item.historicalDevelopment}
                    </p>
                    <p className="text-amber-900 dark:text-amber-300">
                      <strong>Root vs. Contextual Meaning:</strong> {item.rootVsContextualMeaning}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-stone-100 dark:border-zinc-800/80">
                    {item.scriptureReferences.map((ref) => (
                      <button
                        key={ref}
                        type="button"
                        onClick={() => handleScriptureClick(ref)}
                        className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:underline"
                      >
                        {ref}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            4. LEXICON (Direct Dictionary & Strong's Numbers)
            ------------------------------------------------------------------- */}
        {activeCategory === 'lexicon' && (
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
              Biblical Lexicon Database (Hebrew, Aramaic & Greek)
            </span>

            <div className="grid gap-3">
              {BIBLICAL_LEXICON.map((entry) => (
                <div
                  key={entry.id}
                  className={`p-4 rounded-2xl border transition space-y-2 ${
                    isLight
                      ? 'bg-white border-stone-200/90 shadow-2xs'
                      : 'bg-[#151515] border-zinc-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-base text-stone-900 dark:text-white">
                        {entry.englishWord}
                      </span>
                      <span className="font-serif text-lg font-bold text-amber-700 dark:text-amber-400">
                        {entry.originalSpelling}
                      </span>
                      <span className="text-xs italic text-stone-500">
                        ({entry.transliteration})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300">
                        {entry.strongsNumber}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-semibold">
                        {entry.language}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-[13px] leading-relaxed text-stone-700 dark:text-zinc-300">
                    <strong>Lexical Definition:</strong> {entry.lexicalDefinition}
                  </p>
                  <p className="text-xs leading-relaxed text-stone-500 dark:text-zinc-400">
                    <strong>Root & Related:</strong> {entry.rootWordAndRelatedForms}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-zinc-800 text-[11px] text-stone-400">
                    <span>{entry.sourceAttribution}</span>
                    <button
                      type="button"
                      onClick={() => handleSelectWord(entry)}
                      className="font-bold text-amber-700 dark:text-amber-400 hover:underline"
                    >
                      Open Full Word Study &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------------
            5. INTERPRETATION METHODS (Section 5: Restore 15-Method Navigation)
            Structure: Methods List -> Selected Method Details
            - Small buttons in compact horizontal layout (no wrapping on mobile)
            - NO extra selected-method number indicator
            - Clear "Back to Methods" control
            - All 13 educational areas presented in details
            ------------------------------------------------------------------- */}
        {activeCategory === 'methods' && (
          <div className="space-y-6">
            {selectedMethod ? (
              // Selected Method Dedicated Details Page
              <article className="space-y-6 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => setSelectedMethod(null)}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition px-3 py-1.5 rounded-xl border ${
                    isLight
                      ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
                      : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Methods List</span>
                </button>

                <div
                  className={`rounded-3xl border p-5 sm:p-7 shadow-sm space-y-6 ${
                    isLight
                      ? 'bg-white border-stone-200/90 text-stone-900'
                      : 'bg-[#151515] border-zinc-800 text-zinc-100'
                  }`}
                >
                  {/* Method Header (Strictly NO extra selected-method number indicator) */}
                  <div className="border-b border-stone-200/80 dark:border-zinc-800 pb-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {selectedMethod.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 mt-1">
                      {selectedMethod.shortSummary}
                    </p>
                  </div>

                  {/* 1. Definition and Purpose */}
                  <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                      1. Definition & Purpose
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {selectedMethod.definition}
                    </p>
                  </div>

                  {/* 2. Detailed Explanation / Historical Origin */}
                  <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                      2. Historical Origin & Detailed Explanation
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed">
                      {selectedMethod.detailedExplanation}
                    </p>
                  </div>

                  {/* 3 & 4. How the Method Works & Fundamental Principles */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                      3 & 4. Fundamental Principles & How It Works
                    </span>
                    <div className="grid gap-2">
                      {selectedMethod.howItWorks.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl border text-xs sm:text-[13px] bg-stone-50/50 dark:bg-zinc-900/40 border-stone-200/70 dark:border-zinc-800 flex items-start gap-2.5"
                        >
                          <span className="font-bold text-amber-700 dark:text-amber-400 shrink-0">
                            {idx + 1}.
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5, 6 & 7. Practical Application, When to Use & When Inappropriate */}
                  <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-200/70 dark:border-amber-900/40 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300 block">
                      5, 6 & 7. Practical Application & Boundary Guidelines
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                      {selectedMethod.practicalApplication}
                    </p>
                  </div>

                  {/* 8. Biblical Examples */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                      8. Biblical Examples
                    </span>
                    <div className="grid gap-3">
                      {selectedMethod.biblicalExamples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl border bg-stone-50/50 dark:bg-zinc-900/40 border-stone-200/70 dark:border-zinc-800 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white">
                              {ex.title}
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleScriptureClick(ex.passage.split(';')[0])}
                              className="text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline"
                            >
                              {ex.passage}
                            </button>
                          </div>
                          <p className="text-xs sm:text-[13px] leading-relaxed text-stone-700 dark:text-zinc-300">
                            {ex.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 9. Relevant Scripture References */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                      9. Scripture References
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedMethod.relevantBibleReferences.map((ref) => (
                        <button
                          key={ref}
                          type="button"
                          onClick={() => handleScriptureClick(ref)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition flex items-center gap-1.5 ${
                            isLight
                              ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                              : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          <span>{ref}</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 10, 11 & 12. Strengths, Limitations & Related Methods */}
                  <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                      10, 11 & 12. Complementary & Related Methods
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedMethod.relatedMethods.map((relName) => {
                        const target = INTERPRETATION_METHODS.find((m) => m.name === relName);
                        return (
                          <button
                            key={relName}
                            type="button"
                            onClick={() => {
                              if (target) {
                                setSelectedMethod(target);
                                scrollToTop();
                              }
                            }}
                            className={`px-3 py-1 rounded-xl text-xs font-semibold border transition ${
                              isLight
                                ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
                                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                            }`}
                          >
                            {relName} &rarr;
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 13. Recommended Scholarly Sources */}
                  <div className="pt-3 border-t border-stone-200/70 dark:border-zinc-800 text-[11px] text-stone-500 dark:text-zinc-400 italic">
                    13. Recommended Scholarly Sources: {selectedMethod.sourceAttribution}
                  </div>
                </div>
              </article>
            ) : (
              // Methods List View: Displays all 15 methods together in compact horizontal list
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-bold tracking-tight">
                    15 Biblical Interpretation Methods
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400">
                    Select any method to view its full definition, historical development, principles, step-by-step application, and biblical examples.
                  </p>
                </div>

                {/* Compact Horizontal Scrolling Bar for 15 Methods (Does NOT wrap onto another line on mobile) */}
                <div className="overflow-x-auto scrollbar-none pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                  <div className="flex items-center gap-2 whitespace-nowrap min-w-max">
                    {INTERPRETATION_METHODS.map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => {
                          setSelectedMethod(method);
                          scrollToTop();
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition shrink-0 ${
                          isLight
                            ? 'bg-white hover:bg-amber-50 hover:border-amber-300 border-stone-200/90 text-stone-800 shadow-2xs'
                            : 'bg-[#161616] hover:bg-zinc-800 hover:border-amber-500/40 border-zinc-800 text-zinc-200 shadow-sm'
                        }`}
                      >
                        {method.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Organized Compact Overview Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {INTERPRETATION_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => {
                        setSelectedMethod(method);
                        scrollToTop();
                      }}
                      className={`p-4 rounded-2xl border text-left transition space-y-2 group ${
                        isLight
                          ? 'bg-white hover:bg-stone-50 border-stone-200/90 shadow-2xs'
                          : 'bg-[#151515] hover:bg-[#1b1b1b] border-zinc-800 shadow-sm'
                      }`}
                    >
                      <h4 className="font-bold text-sm sm:text-base group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                        {method.name}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-2">
                        {method.shortSummary}
                      </p>
                      <div className="pt-2 border-t border-stone-100 dark:border-zinc-800 text-[11px] text-amber-700 dark:text-amber-400 font-semibold flex items-center justify-between">
                        <span>Explore details</span>
                        <span>&rarr;</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------------------------------------------------------
            6. TYPES AND SHADOWS (Section 6: Comprehensive Biblical Library)
            7 Categories: People, Objects, Sacrifices, Events, Institutions, Places, Ceremonies & Feasts
            ------------------------------------------------------------------- */}
        {activeCategory === 'types-shadows' && (
          <div className="space-y-6">
            {selectedTypeShadow ? (
              // Dedicated Type and Shadow Detail Page
              <article className="space-y-6 animate-in fade-in duration-150">
                <button
                  type="button"
                  onClick={() => setSelectedTypeShadow(null)}
                  className={`inline-flex items-center gap-1.5 text-xs font-bold transition px-3 py-1.5 rounded-xl border ${
                    isLight
                      ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
                      : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Types & Shadows Library</span>
                </button>

                <div
                  className={`rounded-3xl border p-5 sm:p-7 shadow-sm space-y-6 ${
                    isLight
                      ? 'bg-white border-stone-200/90 text-stone-900'
                      : 'bg-[#151515] border-zinc-800 text-zinc-100'
                  }`}
                >
                  {/* Header */}
                  <div className="border-b border-stone-200/80 dark:border-zinc-800 pb-4 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 text-xs font-bold">
                        {selectedTypeShadow.category}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          selectedTypeShadow.interpretiveClassification === 'Explicit Biblical Typology'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300'
                            : 'bg-stone-100 dark:bg-zinc-800 text-stone-700 dark:text-zinc-300'
                        }`}
                      >
                        {selectedTypeShadow.interpretiveClassification}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {selectedTypeShadow.name}
                    </h2>
                  </div>

                  {/* Person or Reality Foreshadowed */}
                  <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-200/70 dark:border-emerald-900/40 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                      Person or Reality Foreshadowed
                    </span>
                    <p className="text-sm sm:text-base font-bold text-stone-900 dark:text-white">
                      {selectedTypeShadow.personOrRealityForeshadowed}
                    </p>
                  </div>

                  {/* Biblical Account & Historical Background */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                        Original Biblical Account
                      </span>
                      <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                        {selectedTypeShadow.biblicalAccount}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 space-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                        Historical & Cultural Setting
                      </span>
                      <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                        {selectedTypeShadow.historicalBackground}
                      </p>
                    </div>
                  </div>

                  {/* Theological Explanation */}
                  <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200/80 dark:border-zinc-800 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                      Substantial Theological Explanation
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                      {selectedTypeShadow.theologicalExplanation}
                    </p>
                  </div>

                  {/* Scriptural Scripture Links */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 block">
                        Old Testament References (Type / Shadow)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedTypeShadow.otReferences.map((ref) => (
                          <button
                            key={ref}
                            type="button"
                            onClick={() => handleScriptureClick(ref)}
                            className={`rounded-xl px-2.5 py-1 text-xs font-semibold border transition ${
                              isLight
                                ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                            }`}
                          >
                            {ref}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
                        New Testament Fulfilment (Antitype)
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedTypeShadow.ntFulfilmentOrConnection.map((ref) => (
                          <button
                            key={ref}
                            type="button"
                            onClick={() => handleScriptureClick(ref)}
                            className={`rounded-xl px-2.5 py-1 text-xs font-bold border transition ${
                              isLight
                                ? 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900'
                                : 'bg-emerald-950/60 hover:bg-emerald-900/80 border-emerald-800 text-emerald-300'
                            }`}
                          >
                            {ref}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Scholarly & Alternative Positions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 rounded-xl border bg-stone-50/50 dark:bg-zinc-900/40 border-stone-200/70 dark:border-zinc-800 space-y-1">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-400 block">
                        Scholarly Interpretations
                      </span>
                      <p className="text-xs leading-relaxed text-stone-700 dark:text-zinc-300">
                        {selectedTypeShadow.scholarlyInterpretations}
                      </p>
                    </div>

                    {selectedTypeShadow.alternativePositions && (
                      <div className="p-3.5 rounded-xl border bg-stone-50/50 dark:bg-zinc-900/40 border-stone-200/70 dark:border-zinc-800 space-y-1">
                        <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-400 block">
                          Alternative Positions & Disagreements
                        </span>
                        <p className="text-xs leading-relaxed text-stone-700 dark:text-zinc-300">
                          {selectedTypeShadow.alternativePositions}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-200/70 dark:border-zinc-800 text-[11px] text-stone-500 dark:text-zinc-400 italic">
                    Theological Sources: {selectedTypeShadow.sourceAttribution}
                  </div>
                </div>
              </article>
            ) : (
              // Types and Shadows Library Catalogue
              <div className="space-y-5">
                {/* 7 Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-2">
                  {(
                    [
                      'ALL',
                      'People',
                      'Objects',
                      'Sacrifices',
                      'Events',
                      'Institutions',
                      'Places',
                      'Ceremonies and Feasts',
                    ] as const
                  ).map((cat) => {
                    const isActive = selectedTypologyCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedTypologyCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                          isActive
                            ? isLight
                              ? 'bg-emerald-700 text-white border-emerald-700 font-bold'
                              : 'bg-emerald-500 text-zinc-950 border-emerald-500 font-bold'
                            : isLight
                            ? 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                            : 'bg-[#161616] hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                {/* Library Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {currentTypesAndShadows.map((ts) => (
                    <button
                      key={ts.id}
                      type="button"
                      onClick={() => {
                        setSelectedTypeShadow(ts);
                        scrollToTop();
                      }}
                      className={`p-4 rounded-2xl border text-left transition space-y-2 group ${
                        isLight
                          ? 'bg-white hover:bg-stone-50 border-stone-200/90 shadow-2xs'
                          : 'bg-[#151515] hover:bg-[#1b1b1b] border-zinc-800 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                          {ts.category}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {ts.interpretiveClassification === 'Explicit Biblical Typology' ? 'Explicit' : 'Strong'}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm sm:text-base group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                        {ts.name}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-zinc-400 line-clamp-2">
                        Foreshadows: {ts.personOrRealityForeshadowed}
                      </p>
                      <div className="pt-2 border-t border-stone-100 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        <span>Read reference study</span>
                        <span>&rarr;</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
