'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  Bookmark,
  BookmarkCheck,
  BookmarkPlus,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Compass,
  Copy,
  ExternalLink,
  Globe,
  Link2,
  Pause,
  Play,
  RotateCcw,
  Search,
  Share2,
  SlidersHorizontal,
  Volume2,
  X,
} from 'lucide-react';
import {
  BIBLE_BOOKS,
  BIBLE_TRANSLATIONS,
  BOOK_INTRODUCTIONS,
  findBookByName,
} from '@/data/bibleBooks';
import {
  getCrossReferencesForVerse,
  getInferencesForVerse,
  getTypesAndShadowsForVerse,
} from '@/data/crossReferences';
import { getVerseText } from '@/data/scriptureDatabase';
import {
  buildVerseContextData,
  fetchAllTranslationsForChapter,
  fetchChapterVerses,
  resolveScriptureVerse,
} from '@/services/bibleService';
import {
  BiblicalInference,
  BiblicalTypeShadow,
  ResolvedCrossReference,
  VerseContextData,
  VerseData,
} from '@/types/bible';
import { usePlatform } from '@/context/PlatformContext';
import {
  getRankedHumanVoices,
  speakScriptureNaturally,
  stopHumanSpeech,
  VoiceOption,
} from '@/utils/naturalSpeech';
import BookChapterSelectorModal from './BookChapterSelectorModal';
import GlobalSearchModal from './GlobalSearchModal';

type VerseActionView = 'none' | 'context' | 'compare' | 'save';
type OpenPanelMode = 'none' | 'action' | 'reference';
type ReferenceSectionTab = 'reference' | 'inference' | 'types';

export default function BibleReaderPage() {
  const {
    currentBook,
    currentChapter,
    translation,
    setTranslation,
    selectedVerse,
    setSelectedVerse,
    previousReadingPosition,
    returnToPreviousPosition,
    navigateToPassage,
    navigateToReferenceString,
    preferences,
    updatePreferences,
    bookmarks,
    toggleBookmark,
    highlights,
    setVerseHighlight,
    collections,
    saveConnectionToNotes,
    saveContextItem,
    saveBibleVerseItem,
    showToast,
  } = usePlatform();

  const [verses, setVerses] = useState<VerseData[]>([]);
  const [isLoadingChapter, setIsLoadingChapter] = useState(false);
  const [isLoadingAllVersions, setIsLoadingAllVersions] = useState(false);

  const [isBookSelectorOpen, setIsBookSelectorOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDisplayMenuOpen, setIsDisplayMenuOpen] = useState(false);
  const [isTranslationMenuOpen, setIsTranslationMenuOpen] = useState(false);

  // Inline expanded verse state (Reference and Action are strictly mutually exclusive)
  const [openPanelMode, setOpenPanelMode] = useState<OpenPanelMode>('none');
  const [activeRefSection, setActiveRefSection] = useState<ReferenceSectionTab>('reference');
  const [activeActionView, setActiveActionView] = useState<VerseActionView>('none');
  const [inlineContextData, setInlineContextData] = useState<VerseContextData | null>(null);
  const [isLoadingInlineContext, setIsLoadingInlineContext] = useState(false);
  const [resolvedRefTexts, setResolvedRefTexts] = useState<Record<string, string>>({});
  const [expandedInlineSupportingRefs, setExpandedInlineSupportingRefs] = useState<
    Record<string, boolean>
  >({});

  const toggleInlineSupportingRef = (key: string, refStr: string) => {
    ensureScriptureRefsResolved([refStr]);
    setExpandedInlineSupportingRefs((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Inline Save & Personal Notes state
  const [saveTargetType, setSaveTargetType] = useState<'verse' | 'context' | 'connection'>('verse');
  const [selectedRefIdxForSave, setSelectedRefIdxForSave] = useState(0);
  const [personalNoteDraft, setPersonalNoteDraft] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(
    collections[0]?.id || 'col-messianic'
  );
  const [shareToCommunity, setShareToCommunity] = useState<boolean>(false);
  const [justSavedInline, setJustSavedInline] = useState(false);

  // Audio speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingVerse, setSpeakingVerse] = useState<number | null>(null);
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);

  const toolbarMenuRef = useRef<HTMLDivElement | null>(null);

  const currentBookObj = findBookByName(currentBook) || BIBLE_BOOKS[39];
  const isLight = preferences.theme === 'light';

  // Close dropdowns/popups when clicking outside OR scrolling the page
  useEffect(() => {
    if (!isDisplayMenuOpen && !isTranslationMenuOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        toolbarMenuRef.current &&
        !toolbarMenuRef.current.contains(e.target as Node)
      ) {
        setIsDisplayMenuOpen(false);
        setIsTranslationMenuOpen(false);
      }
    };

    const handleScrollClose = () => {
      setIsDisplayMenuOpen(false);
      setIsTranslationMenuOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    window.addEventListener('scroll', handleScrollClose, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      window.removeEventListener('scroll', handleScrollClose);
    };
  }, [isDisplayMenuOpen, isTranslationMenuOpen]);

  // Load ranked natural human voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const updateVoices = () => {
      const list = getRankedHumanVoices();
      setAvailableVoices(list);
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Fetch exact chapter verses for currentBook, currentChapter, and translation,
  // then load all 6 translations in the background so version comparison is instant
  useEffect(() => {
    if (currentChapter === 0) {
      setVerses([]);
      return;
    }
    let active = true;
    setIsLoadingChapter(true);
    fetchChapterVerses(currentBook, currentChapter, translation)
      .then((data) => {
        if (active) setVerses([...data]);
        return fetchAllTranslationsForChapter(currentBook, currentChapter);
      })
      .then((allVersionData) => {
        if (active && allVersionData) {
          setVerses([...allVersionData]);
        }
      })
      .finally(() => {
        if (active) setIsLoadingChapter(false);
      });

    return () => {
      active = false;
    };
  }, [currentBook, currentChapter, translation]);

  // Reset reading area to top when moving between chapters
  useEffect(() => {
    stopHumanSpeech();
    setIsSpeaking(false);
    setSpeakingVerse(null);
    setOpenPanelMode('none');
    setActiveActionView('none');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [currentBook, currentChapter]);

  // Helper to scroll selected verse to the top of the reading area below sticky header
  const scrollVerseToTop = (verseNum: number) => {
    if (typeof window === 'undefined') return;
    requestAnimationFrame(() => {
      setTimeout(() => {
        const el = document.getElementById(`verse-row-${verseNum}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const stickyOffset = window.innerWidth < 1024 ? 106 : 64;
          const targetTop = Math.max(0, window.scrollY + rect.top - stickyOffset);
          window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
      }, 40);
    });
  };

  // Resolve any list of scripture reference strings into resolvedRefTexts
  const ensureScriptureRefsResolved = (refStrings: string[]) => {
    const uniqueRefs = Array.from(new Set(refStrings));
    uniqueRefs.forEach((refStr) => {
      const local = getVerseText(refStr, translation);
      if (local && !local.startsWith('[')) {
        setResolvedRefTexts((prev) =>
          prev[refStr] === local ? prev : { ...prev, [refStr]: local }
        );
      } else {
        resolveScriptureVerse(refStr, translation).then((res) => {
          if (res?.text) {
            setResolvedRefTexts((prev) => ({ ...prev, [refStr]: res.text }));
          }
        });
      }
    });
  };

  // Whenever selectedVerse changes, load its inline context and connected reference texts
  useEffect(() => {
    if (!selectedVerse || currentChapter === 0) {
      setInlineContextData(null);
      setOpenPanelMode('none');
      return;
    }
    const canonicalRef = `${currentBook} ${currentChapter}:${selectedVerse}`;
    const refs = getCrossReferencesForVerse(canonicalRef);
    const infs = getInferencesForVerse(canonicalRef);
    const tShadows = getTypesAndShadowsForVerse(canonicalRef);

    setJustSavedInline(false);
    setPersonalNoteDraft('');
    setSelectedRefIdxForSave(0);
    setSaveTargetType(refs.length > 0 ? 'connection' : 'verse');

    let active = true;
    setIsLoadingInlineContext(true);
    buildVerseContextData(canonicalRef, translation)
      .then((ctx) => {
        if (active) setInlineContextData(ctx);
      })
      .finally(() => {
        if (active) setIsLoadingInlineContext(false);
      });

    // Collect all scripture references across Reference, Inference, and Types & Shadows
    const allRefsToResolve: string[] = [
      ...refs.flatMap((r) => [r.connectedRef, ...(r.supportingRefs || [])]),
      ...infs.flatMap((inf) => [inf.verseRef, ...inf.supportingRefs]),
      ...tShadows.flatMap((ts) => [
        ts.otTypeRef,
        ts.ntAntitypeRef,
        ...(ts.supportingRefs || []),
      ]),
    ];

    if (allRefsToResolve.length > 0) {
      ensureScriptureRefsResolved(allRefsToResolve);
    }

    return () => {
      active = false;
    };
  }, [selectedVerse, currentBook, currentChapter, translation]);

  // Open Reference / Inference / Types & Shadows panel (closes Action panel and scrolls verse to top)
  const openScriptureIntelligenceForVerse = (
    v: VerseData,
    preferredTab?: ReferenceSectionTab
  ) => {
    const refs = getCrossReferencesForVerse(v.canonicalRef);
    const infs = getInferencesForVerse(v.canonicalRef);
    const tShadows = getTypesAndShadowsForVerse(v.canonicalRef);

    // Choose default tab from available non-empty categories
    let targetTab: ReferenceSectionTab = preferredTab || 'reference';
    if (targetTab === 'reference' && refs.length === 0) {
      if (infs.length > 0) targetTab = 'inference';
      else if (tShadows.length > 0) targetTab = 'types';
    } else if (targetTab === 'inference' && infs.length === 0) {
      if (refs.length > 0) targetTab = 'reference';
      else if (tShadows.length > 0) targetTab = 'types';
    } else if (targetTab === 'types' && tShadows.length === 0) {
      if (refs.length > 0) targetTab = 'reference';
      else if (infs.length > 0) targetTab = 'inference';
    }

    setSelectedVerse(v.verse);
    setActiveActionView('none');
    setActiveRefSection(targetTab);
    setOpenPanelMode('reference');
    scrollVerseToTop(v.verse);
  };

  const handlePrevChapter = () => {
    setSelectedVerse(null);
    setOpenPanelMode('none');
    if (currentChapter > 1) {
      navigateToPassage(currentBook, currentChapter - 1);
    } else if (currentChapter === 1) {
      const prevBook = BIBLE_BOOKS.find((b) => b.id === currentBookObj.id - 1);
      if (prevBook) {
        navigateToPassage(prevBook.name, prevBook.chapters);
      }
    } else if (currentChapter === 0) {
      navigateToPassage(currentBook, 1);
    }
  };

  const handleNextChapter = () => {
    setSelectedVerse(null);
    setOpenPanelMode('none');
    if (currentChapter < currentBookObj.chapters) {
      navigateToPassage(currentBook, currentChapter + 1);
    } else {
      const nextBook = BIBLE_BOOKS.find((b) => b.id === currentBookObj.id + 1);
      if (nextBook) {
        navigateToPassage(nextBook.name, 1);
      }
    }
  };

  const handleOpenCompareInline = async () => {
    setActiveActionView(activeActionView === 'compare' ? 'none' : 'compare');
    setIsLoadingAllVersions(true);
    try {
      const updated = await fetchAllTranslationsForChapter(currentBook, currentChapter);
      setVerses([...updated]);
    } finally {
      setIsLoadingAllVersions(false);
    }
  };

  const handleToggleAudio = (startFromVerse?: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Audio speech synthesis is not supported in this browser.');
      return;
    }
    if (isSpeaking && !startFromVerse) {
      stopHumanSpeech();
      setIsSpeaking(false);
      setSpeakingVerse(null);
      return;
    }

    const filteredVerses = startFromVerse
      ? verses.filter((v) => v.verse >= startFromVerse)
      : verses;

    if (filteredVerses.length === 0) return;

    setIsSpeaking(true);
    speakScriptureNaturally({
      book: currentBook,
      chapter: currentChapter,
      verses: filteredVerses.map((v) => ({
        verse: v.verse,
        text: v.translations[translation] || v.translations.NIV,
        heading: v.heading,
      })),
      preferredVoiceName: preferences.preferredVoiceName,
      onVerseStart: (vNum) => setSpeakingVerse(vNum),
      onComplete: () => {
        setIsSpeaking(false);
        setSpeakingVerse(null);
      },
      onStop: () => {
        setIsSpeaking(false);
        setSpeakingVerse(null);
      },
    });
  };

  const handleCopyVerse = (v: VerseData) => {
    const text = `${v.canonicalRef} (${translation}) — "${v.translations[translation]}"`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showToast(`Copied ${v.canonicalRef} (${translation})`);
  };

  const handleSaveFromInline = (v: VerseData) => {
    const refs = getCrossReferencesForVerse(v.canonicalRef);
    const verseText = v.translations[translation] || v.translations.NIV;

    if (saveTargetType === 'connection' && refs.length > 0) {
      const chosenRef = refs[selectedRefIdxForSave] || refs[0];
      saveConnectionToNotes({
        title: chosenRef.title,
        primaryRef: chosenRef.primaryRef,
        connectedRef: chosenRef.connectedRef,
        primaryText: verseText,
        connectedText:
          resolvedRefTexts[chosenRef.connectedRef] ||
          getVerseText(chosenRef.connectedRef, translation),
        translation,
        category: chosenRef.category,
        connectionLabel: chosenRef.connectionLabel,
        verificationStatus: chosenRef.verificationStatus,
        personalObservation: personalNoteDraft.trim(),
        collectionId: selectedCollectionId,
        sharedToCommunity: shareToCommunity,
      });
    } else if (saveTargetType === 'context') {
      saveContextItem({
        verseRef: v.canonicalRef,
        verseText,
        translation,
        mainTheme:
          inlineContextData?.mainTheme ||
          `Main Theme of ${v.canonicalRef}`,
        verseBreakdown: inlineContextData?.verseBreakdown || [
          inlineContextData?.verseSpecificAnalysis || verseText,
        ],
        contextSummary:
          inlineContextData?.howPreviousChapterLeadsHere ||
          inlineContextData?.immediateLiteraryContext ||
          `Context for ${v.canonicalRef}`,
        personalNotes: personalNoteDraft.trim(),
        collectionId: selectedCollectionId,
        sharedToCommunity: shareToCommunity,
      });
    } else {
      saveBibleVerseItem({
        verseRef: v.canonicalRef,
        verseText,
        translation,
        highlightColor: highlights[v.canonicalRef],
        personalNotes: personalNoteDraft.trim(),
        collectionId: selectedCollectionId,
        sharedToCommunity: shareToCommunity,
      });
    }

    setJustSavedInline(true);
  };

  const fontSizeClass =
    preferences.fontSize === 'xsmall'
      ? 'text-[13px] sm:text-[14px] leading-[1.75]'
      : preferences.fontSize === 'small'
      ? 'text-[15px] sm:text-[16px] leading-[1.8]'
      : preferences.fontSize === 'large'
      ? 'text-[20px] leading-[1.9]'
      : preferences.fontSize === 'xlarge'
      ? 'text-[23px] leading-[1.95]'
      : 'text-[17px] sm:text-[18px] leading-[1.85]';

  const bookIntro = BOOK_INTRODUCTIONS[currentBook] || {
    author: `${currentBook} Canonical Witness`,
    date: `${currentBookObj.testament === 'OT' ? 'Old Testament Era' : 'First Century AD'}`,
    theme: `${currentBookObj.category} — Covenant Revelation & Redemptive History`,
    summary: `${currentBook} is book #${currentBookObj.id} of the biblical canon (${
      currentBookObj.testament === 'OT' ? 'Old Testament' : 'New Testament'
    }, ${currentBookObj.category}), consisting of ${currentBookObj.chapters} chapters.`,
    keyConnections: [
      'Matthew 1:23',
      'Isaiah 7:14',
      'John 1:1',
      'Genesis 1:1',
      'Deuteronomy 32:6',
    ],
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* =====================================================================
          MAIN BIBLE READING COLUMN
          ===================================================================== */}
      <div className="flex-1 min-w-0 flex flex-col pb-32 lg:pb-16">
        {/* Top Reader Toolbar — Sticky & Solid Opaque Background Close to Header */}
        <div
          className={`sticky top-12 lg:top-0 z-20 py-2 sm:py-2.5 px-3 sm:px-8 flex items-center justify-between transition-colors shadow-xs ${
            isLight
              ? 'bg-[#FBF9F5] text-stone-900'
              : 'bg-[#0F0F0F] text-zinc-100'
          }`}
        >
          {/* Left: Prev/Next Chapter + Book/Chapter Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <button
              onClick={handlePrevChapter}
              className={`rounded-lg p-2 transition shrink-0 ${
                isLight
                  ? 'text-stone-500 hover:bg-stone-200/60 hover:text-stone-900'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
              title="Previous Chapter"
              aria-label="Previous Chapter"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsBookSelectorOpen(true)}
              className={`rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold flex items-center gap-2 border transition truncate ${
                isLight
                  ? 'bg-white hover:bg-stone-50 border-stone-200/90 text-stone-900 shadow-2xs'
                  : 'bg-[#1a1a1a] hover:bg-[#222222] border-zinc-800 text-zinc-100'
              }`}
            >
              <span className="truncate">
                {currentBook} {currentChapter === 0 ? 'Intro' : currentChapter}
              </span>
              <span className="text-[10px] text-stone-400 shrink-0">▾</span>
            </button>

            <button
              onClick={handleNextChapter}
              className={`rounded-lg p-2 transition shrink-0 ${
                isLight
                  ? 'text-stone-500 hover:bg-stone-200/60 hover:text-stone-900'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
              title="Next Chapter"
              aria-label="Next Chapter"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Right: Audio Play Button, Search, Filter/Settings, Translation Pill */}
          <div
            ref={toolbarMenuRef}
            className="flex items-center gap-1.5 sm:gap-2 relative shrink-0"
          >
            <button
              onClick={() => handleToggleAudio()}
              className={`rounded-xl px-3 py-2 text-xs font-semibold flex items-center gap-1.5 transition ${
                isSpeaking
                  ? isLight
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-amber-500 text-zinc-950'
                  : isLight
                  ? 'text-stone-600 hover:bg-stone-200/60'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
              title={isSpeaking ? 'Stop Reading Aloud' : 'Listen with Natural Voice'}
              aria-label="Listen to Chapter"
            >
              {isSpeaking ? (
                <>
                  <Pause className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {speakingVerse ? `v.${speakingVerse}` : 'Playing'}
                  </span>
                </>
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>

            <button
              onClick={() => {
                setIsDisplayMenuOpen(false);
                setIsTranslationMenuOpen(false);
                setIsSearchOpen(true);
              }}
              className={`rounded-xl p-2 transition ${
                isLight
                  ? 'text-stone-600 hover:bg-stone-200/60'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
              title="Search Scriptures"
              aria-label="Search Scriptures"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Typography, Natural Voice & Display Settings */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsDisplayMenuOpen((prev) => !prev);
                  setIsTranslationMenuOpen(false);
                }}
                className={`rounded-xl p-2 transition ${
                  isLight
                    ? 'text-stone-600 hover:bg-stone-200/60'
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
                title="Reading Appearance, Voice & Font Size"
                aria-label="Reading Settings"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </button>

              {isDisplayMenuOpen && (
                <div
                  className={`fixed right-3 left-3 top-28 sm:left-auto sm:top-full sm:absolute sm:right-0 sm:mt-2 sm:w-72 max-w-[calc(100vw-1.5rem)] rounded-2xl border p-4 shadow-2xl z-50 space-y-4 ${
                    isLight
                      ? 'bg-white border-stone-200 text-stone-900'
                      : 'bg-[#1b1b1b] border-zinc-800 text-zinc-100'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                      Reading & Voice Settings
                    </span>
                    <button
                      onClick={() => setIsDisplayMenuOpen(false)}
                      className="text-xs font-semibold text-amber-700 dark:text-amber-400"
                    >
                      Done
                    </button>
                  </div>

                  <div
                    className={`h-px w-full ${
                      isLight ? 'bg-stone-200/70' : 'bg-zinc-800'
                    }`}
                  />

                  {/* Font Size */}
                  <div className="space-y-1.5">
                    <span className="text-xs text-stone-500">Text Size</span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => updatePreferences({ fontSize: sz })}
                          className={`rounded-lg py-1.5 text-xs font-bold uppercase transition ${
                            preferences.fontSize === sz
                              ? isLight
                                ? 'bg-amber-700 text-white'
                                : 'bg-amber-500 text-zinc-950'
                              : isLight
                              ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                              : 'bg-zinc-800 text-zinc-300'
                          }`}
                        >
                          {sz === 'xsmall' ? 'XS' : sz === 'xlarge' ? 'XL' : sz.slice(0, 1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Natural Human Voice Selector */}
                  {availableVoices.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs text-stone-500 block">
                        Narrator Voice (Natural Neural)
                      </span>
                      <select
                        value={
                          preferences.preferredVoiceName ||
                          availableVoices[0]?.voiceObj.name ||
                          ''
                        }
                        onChange={(e) =>
                          updatePreferences({ preferredVoiceName: e.target.value })
                        }
                        className={`w-full rounded-xl border px-2.5 py-1.5 text-xs ${
                          isLight
                            ? 'bg-stone-50 border-stone-300 text-stone-800'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                        }`}
                      >
                        {availableVoices.slice(0, 12).map((v) => (
                          <option key={v.voiceObj.name} value={v.voiceObj.name}>
                            {v.isNatural ? '★ ' : ''}
                            {v.name} ({v.lang})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Toggles */}
                  <label className="flex items-center justify-between text-xs cursor-pointer pt-1">
                    <span>Red-Letter Words of Jesus</span>
                    <input
                      type="checkbox"
                      checked={preferences.redLetterEnabled}
                      onChange={(e) =>
                        updatePreferences({ redLetterEnabled: e.target.checked })
                      }
                      className="h-4 w-4 accent-amber-700 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs cursor-pointer">
                    <span>Show Cross-Reference Pills</span>
                    <input
                      type="checkbox"
                      checked={preferences.showReferenceBadges}
                      onChange={(e) =>
                        updatePreferences({ showReferenceBadges: e.target.checked })
                      }
                      className="h-4 w-4 accent-amber-700 rounded"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Translation Selector Pill — Name Only, No Subtext */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsTranslationMenuOpen((prev) => !prev);
                  setIsDisplayMenuOpen(false);
                }}
                className={`rounded-xl px-3 py-2 text-xs font-bold flex items-center gap-1.5 border transition ${
                  isLight
                    ? 'bg-white hover:bg-stone-50 border-stone-200/90 text-stone-800 shadow-2xs'
                    : 'bg-[#1a1a1a] hover:bg-[#242424] border-zinc-800 text-zinc-100'
                }`}
                title="Switch Bible Translation"
              >
                <Globe
                  className={`h-3.5 w-3.5 ${
                    isLight ? 'text-amber-700' : 'text-amber-400'
                  }`}
                />
                <span>{translation}</span>
              </button>

              {isTranslationMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-60 max-w-[calc(100vw-1.5rem)] rounded-2xl border p-1.5 shadow-2xl z-50 space-y-0.5 ${
                    isLight
                      ? 'bg-white border-stone-200 text-stone-900'
                      : 'bg-[#1b1b1b] border-zinc-800 text-zinc-100'
                  }`}
                >
                  {BIBLE_TRANSLATIONS.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTranslation(t.id);
                        setIsTranslationMenuOpen(false);
                        showToast(`Switched to ${t.name} (${t.abbreviation})`);
                      }}
                      className={`w-full rounded-xl px-3 py-2 text-left text-xs font-semibold transition flex items-center justify-between gap-2 ${
                        translation === t.id
                          ? isLight
                            ? 'bg-amber-50 text-amber-900 font-bold'
                            : 'bg-amber-500/20 text-amber-300 font-bold'
                          : isLight
                          ? 'hover:bg-stone-100 text-stone-700'
                          : 'hover:bg-zinc-800 text-zinc-200'
                      }`}
                    >
                      <span className="truncate">{t.name}</span>
                      {translation === t.id && (
                        <span
                          className={`text-xs font-bold shrink-0 ${
                            isLight ? 'text-amber-800' : 'text-amber-400'
                          }`}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Divider Line */}
        <div
          className={`h-px w-full ${
            isLight ? 'bg-stone-200/80' : 'bg-zinc-800/80'
          }`}
        />

        {/* Return to Previous Reading Position Banner */}
        {previousReadingPosition && (
          <div className="mx-auto w-full max-w-3xl px-6 mt-4">
            <div
              className={`rounded-xl border px-4 py-2.5 flex items-center justify-between gap-3 ${
                isLight
                  ? 'bg-amber-50/90 border-amber-200 text-stone-800'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-100'
              }`}
            >
              <div className="flex items-center gap-2 text-xs">
                <RotateCcw
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isLight ? 'text-amber-700' : 'text-amber-400'
                  }`}
                />
                <span>
                  Reading connected passage. Previous position:{' '}
                  <strong>{previousReadingPosition.label}</strong>
                </span>
              </div>
              <button
                onClick={returnToPreviousPosition}
                className={`rounded-lg font-bold px-3 py-1 text-xs shrink-0 transition ${
                  isLight
                    ? 'bg-amber-700 hover:bg-amber-800 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                }`}
              >
                Return
              </button>
            </div>
          </div>
        )}

        {/* Spacious Scripture Reading Canvas */}
        <main className="mx-auto w-full max-w-3xl px-5 sm:px-10 pt-8 sm:pt-10 pb-12">
          {/* Calm Centered Serif Chapter Heading */}
          <header className="text-center mb-8 sm:mb-10 select-none">
            <button
              onClick={() => setIsBookSelectorOpen(true)}
              className="group inline-flex flex-col items-center"
            >
              <span
                className={`text-xs font-bold uppercase tracking-[0.2em] transition ${
                  isLight
                    ? 'text-stone-400 group-hover:text-amber-800'
                    : 'text-zinc-500 group-hover:text-amber-400'
                }`}
              >
                {currentBook}
              </span>
              <span
                className={`font-serif text-4xl sm:text-5xl font-bold tracking-tight mt-1.5 ${
                  isLight ? 'text-stone-900' : 'text-white'
                }`}
              >
                {currentChapter === 0 ? 'Introduction' : currentChapter}
              </span>
            </button>
          </header>

          {/* Book Introduction View */}
          {currentChapter === 0 ? (
            <div
              className={`rounded-2xl border p-6 sm:p-8 space-y-6 ${
                isLight
                  ? 'bg-white border-stone-200/90 text-stone-800 shadow-xs'
                  : 'bg-[#151515] border-zinc-800 text-zinc-200'
              }`}
            >
              <div className="space-y-1.5 pb-4">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isLight ? 'text-amber-700' : 'text-amber-400'
                  }`}
                >
                  Book Introduction
                </span>
                <h2 className="text-2xl font-serif font-bold">{currentBook}</h2>
                <div className="flex flex-wrap gap-4 text-xs text-stone-500 pt-1">
                  <span>
                    <strong>Author:</strong> {bookIntro.author}
                  </span>
                  <span>
                    <strong>Date:</strong> {bookIntro.date}
                  </span>
                  <span>
                    <strong>Chapters:</strong> {currentBookObj.chapters}
                  </span>
                </div>
              </div>

              <div
                className={`h-px w-full ${
                  isLight ? 'bg-stone-200/80' : 'bg-zinc-800'
                }`}
              />

              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Core Theme
                </h3>
                <p className="font-serif text-base font-medium">{bookIntro.theme}</p>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Summary
                </h3>
                <p className="font-serif text-base leading-relaxed">{bookIntro.summary}</p>
              </div>

              <div className="space-y-2 pt-1">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Key Cross-Referenced Passages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {bookIntro.keyConnections.map((ref) => (
                    <button
                      key={ref}
                      onClick={() => {
                        navigateToReferenceString(ref);
                      }}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                        isLight
                          ? 'bg-amber-50/70 hover:bg-amber-100 border-amber-200 text-amber-900'
                          : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                      }`}
                    >
                      {ref} →
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : isLoadingChapter ? (
            <div className="space-y-3 py-8">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className={`h-14 rounded-xl animate-pulse ${
                    isLight ? 'bg-stone-200/50' : 'bg-zinc-800/40'
                  }`}
                />
              ))}
            </div>
          ) : verses.length === 0 ? (
            <div
              className={`rounded-2xl border p-8 text-center space-y-3 ${
                isLight
                  ? 'bg-white border-stone-200 text-stone-600'
                  : 'bg-[#161616] border-zinc-800 text-zinc-300'
              }`}
            >
              <p className="text-sm font-medium">
                Unable to reach the online Bible server while offline for {currentBook}{' '}
                {currentChapter} ({translation}).
              </p>
              <p className="text-xs text-stone-400">
                Please check your internet connection or select one of the pre-indexed study chapters (Matthew 1, Matthew 18, Deuteronomy 32, Isaiah 7, Isaiah 53, John 1, Genesis 1).
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {verses.map((v) => {
                const refs = getCrossReferencesForVerse(v.canonicalRef);
                const inferences = getInferencesForVerse(v.canonicalRef);
                const typeShadows = getTypesAndShadowsForVerse(v.canonicalRef);
                const availableIntelTabs: {
                  id: ReferenceSectionTab;
                  label: string;
                }[] = [
                  ...(refs.length > 0
                    ? [
                        {
                          id: 'reference' as const,
                          label: refs.length > 1 ? 'References' : 'Reference',
                        },
                      ]
                    : []),
                  ...(inferences.length > 0
                    ? [{ id: 'inference' as const, label: 'Inference' }]
                    : []),
                  ...(typeShadows.length > 0
                    ? [{ id: 'types' as const, label: 'Types & Shadows' }]
                    : []),
                ];
                const hasAnyIntel = availableIntelTabs.length > 0;

                const isSelected = selectedVerse === v.verse;
                const isReferenceOpen = isSelected && openPanelMode === 'reference';
                const isActionOpen = isSelected && openPanelMode === 'action';
                const isCurrentlySpoken = speakingVerse === v.verse;
                const isBookmarked = bookmarks.includes(v.canonicalRef);
                const highlightColor = highlights[v.canonicalRef];
                const isRedLetterActive = Boolean(
                  v.isRedLetter && preferences.redLetterEnabled
                );

                // Section 2 Rule:
                // When highlighting a particular verse (especially in Dark Mode),
                // the edge must be straight (rounded-none, border: 0, edge: 0) with a straight stroke ONLY on the left!
                const hasHighlight = Boolean(highlightColor);
                const highlightClass =
                  highlightColor === 'amber'
                    ? isLight
                      ? 'rounded-none border-0 border-l-4 border-solid border-amber-600 bg-amber-100/70 pl-3.5'
                      : 'rounded-none border-0 border-l-4 border-solid border-amber-400 bg-amber-500/15 pl-3.5'
                    : highlightColor === 'emerald'
                    ? isLight
                      ? 'rounded-none border-0 border-l-4 border-solid border-emerald-600 bg-emerald-100/60 pl-3.5'
                      : 'rounded-none border-0 border-l-4 border-solid border-emerald-400 bg-emerald-500/15 pl-3.5'
                    : highlightColor === 'blue'
                    ? isLight
                      ? 'rounded-none border-0 border-l-4 border-solid border-sky-600 bg-sky-100/60 pl-3.5'
                      : 'rounded-none border-0 border-l-4 border-solid border-blue-400 bg-blue-500/15 pl-3.5'
                    : '';

                return (
                  <div
                    key={v.canonicalRef}
                    id={`verse-row-${v.verse}`}
                    className="space-y-2.5 scroll-mt-28"
                  >
                    {/* Section Subheading */}
                    {v.heading && (
                      <h3
                        className={`font-serif text-base sm:text-lg font-bold italic pt-5 pb-1 ${
                          isLight ? 'text-stone-700' : 'text-zinc-200'
                        }`}
                      >
                        {v.heading}
                      </h3>
                    )}

                    {/* Clean Verse Block */}
                    <div
                      onClick={() => {
                        if (isActionOpen) {
                          setSelectedVerse(null);
                          setOpenPanelMode('none');
                          setActiveActionView('none');
                        } else {
                          // Opening Action closes Reference (mutually exclusive)
                          setSelectedVerse(v.verse);
                          setOpenPanelMode('action');
                          setActiveActionView('none');
                        }
                      }}
                      className={`group relative py-2.5 px-3 -mx-3 cursor-pointer transition ${
                        hasHighlight
                          ? highlightClass
                          : `rounded-xl border-0 ${
                              isCurrentlySpoken
                                ? isLight
                                  ? 'bg-amber-100/90'
                                  : 'bg-amber-500/20'
                                : isSelected
                                ? isLight
                                  ? 'bg-stone-200/65 ring-1 ring-stone-300/80'
                                  : 'bg-[#1a1a1a] ring-1 ring-zinc-800'
                                : isLight
                                ? 'hover:bg-stone-200/35'
                                : 'hover:bg-[#151515]'
                            }`
                      }`}
                    >
                      <div
                        className={`font-serif ${fontSizeClass} ${
                          v.isPoetry ? 'pl-2 sm:pl-4' : ''
                        } ${
                          isRedLetterActive
                            ? isLight
                              ? 'text-[#A63225]'
                              : 'text-[#d47a70]'
                            : isLight
                            ? 'text-stone-900'
                            : 'text-[#e8e6e3]'
                        }`}
                      >
                        <sup
                          className={`mr-2 font-sans text-[11px] font-bold select-none ${
                            isSelected
                              ? isLight
                                ? 'text-amber-800'
                                : 'text-amber-400'
                              : isLight
                              ? 'text-stone-400'
                              : 'text-zinc-500'
                          }`}
                        >
                          {v.verse}
                        </sup>
                        <span>{v.translations[translation] || v.translations.NIV}</span>

                        {/* Unified Scripture Intelligence Badge (Reference / Inference / Types & Shadows) */}
                        {hasAnyIntel && preferences.showReferenceBadges && (
                          <span className="inline-flex items-center ml-2 align-middle">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isReferenceOpen) {
                                  setSelectedVerse(null);
                                  setOpenPanelMode('none');
                                } else {
                                  // Opening Reference closes Action and scrolls verse to top
                                  openScriptureIntelligenceForVerse(v);
                                }
                              }}
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-sans text-[11px] font-semibold transition border ${
                                isReferenceOpen
                                  ? isLight
                                    ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                                    : 'bg-amber-500 text-zinc-950 border-amber-500 shadow-xs font-bold'
                                  : isLight
                                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200/90'
                                  : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30'
                              }`}
                              title={
                                isReferenceOpen
                                  ? `Close Scripture references for ${v.canonicalRef}`
                                  : `Open Scripture references, inference & types for ${v.canonicalRef}`
                              }
                            >
                              <Link2 className="h-3 w-3" />
                              <span>
                                {refs.length > 1
                                  ? 'References'
                                  : refs.length === 1
                                  ? 'Reference'
                                  : availableIntelTabs[0]?.label || 'Reference'}
                              </span>
                            </button>
                          </span>
                        )}

                        {isBookmarked && (
                          <Bookmark
                            className={`ml-2 inline h-3.5 w-3.5 ${
                              isLight
                                ? 'text-amber-700 fill-amber-700'
                                : 'text-amber-400 fill-amber-400'
                            }`}
                          />
                        )}
                      </div>
                    </div>

                    {/* =========================================================
                        MUTUALLY EXCLUSIVE PANEL 1: SCRIPTURE INTELLIGENCE
                        (Reference • Inference • Types & Shadows)
                        Uses the exact same background colour as Action panel,
                        one main container, and full-width horizontal dividers.
                        ========================================================= */}
                    {isReferenceOpen && (
                      <div
                        className={`rounded-2xl border overflow-hidden mt-2 mb-2 animate-in fade-in duration-150 ${
                          isLight
                            ? 'bg-white border-stone-200/90 shadow-sm text-stone-900'
                            : 'bg-[#171717] border-zinc-800 shadow-md text-zinc-100'
                        }`}
                      >
                        {/* Top Bar: Verse Reference, Category Tabs (only non-empty), and 'X' to Close */}
                        <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-xs sm:text-sm font-bold tracking-tight ${
                                isLight ? 'text-amber-900' : 'text-amber-400'
                              }`}
                            >
                              {v.canonicalRef} ({translation})
                            </span>

                            {availableIntelTabs.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {availableIntelTabs.map((tab) => {
                                  const isTabActive = activeRefSection === tab.id;
                                  return (
                                    <button
                                      key={tab.id}
                                      type="button"
                                      onClick={() => {
                                        setActiveRefSection(tab.id);
                                        scrollVerseToTop(v.verse);
                                      }}
                                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition border ${
                                        isTabActive
                                          ? isLight
                                            ? 'bg-amber-700 text-white border-amber-700'
                                            : 'bg-amber-500 text-zinc-950 border-amber-500'
                                          : isLight
                                          ? 'bg-stone-100 hover:bg-stone-200/80 text-stone-700 border-stone-200'
                                          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700'
                                      }`}
                                    >
                                      {tab.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedVerse(null);
                              setOpenPanelMode('none');
                            }}
                            className={`rounded-lg p-1.5 border transition shrink-0 ${
                              isLight
                                ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-600'
                                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                            }`}
                            title="Close"
                            aria-label="Close panel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Full-width horizontal divider */}
                        <div
                          className={`h-px w-full ${
                            isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
                          }`}
                        />

                        {/* SECTION 1: REFERENCE (Biblical Cross-References — Scripturally Verifiable) */}
                        {activeRefSection === 'reference' && (
                          <div>
                            {refs.length === 0 ? (
                              <div className="px-4 sm:px-5 py-4 text-xs text-stone-500 dark:text-zinc-400">
                                No reference found for this verse.
                              </div>
                            ) : (
                              refs.map((r, idx) => {
                                const primaryVerseText =
                                  v.translations[translation] || v.translations.NIV;
                                const refText =
                                  resolvedRefTexts[r.connectedRef] ||
                                  getVerseText(r.connectedRef, translation) ||
                                  'Loading cross-reference...';
                                const supportingList = r.supportingRefs || [];
                                return (
                                  <React.Fragment key={`inline-ref-${r.id}`}>
                                    {idx > 0 && (
                                      <div
                                        className={`h-px w-full ${
                                          isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
                                        }`}
                                      />
                                    )}
                                    {/* Header: Category, Verification Status & Save Related Verses */}
                                    <div className="px-4 sm:px-5 py-3.5 space-y-2">
                                      <div className="flex items-center justify-between gap-2 flex-wrap">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                              isLight
                                                ? 'bg-emerald-100 text-emerald-900'
                                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                            }`}
                                          >
                                            Scripturally Verifiable • Explicit
                                          </span>
                                          <span
                                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                              isLight
                                                ? 'bg-amber-100 text-amber-900'
                                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                            }`}
                                          >
                                            {r.category}
                                          </span>
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => {
                                            saveConnectionToNotes({
                                              title: r.title,
                                              primaryRef: v.canonicalRef,
                                              connectedRef: r.connectedRef,
                                              primaryText: primaryVerseText,
                                              connectedText: refText,
                                              translation,
                                              category: r.category,
                                              connectionLabel:
                                                r.explanation || r.connectionLabel,
                                              verificationStatus: r.verificationStatus,
                                              personalObservation: r.biblicalContext || '',
                                              collectionId: selectedCollectionId,
                                              sharedToCommunity: false,
                                            });
                                          }}
                                          className={`rounded-lg px-2.5 py-1 text-[11px] font-bold inline-flex items-center gap-1 border transition ${
                                            isLight
                                              ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
                                              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                                          }`}
                                          title="Save related verses together in Notes"
                                        >
                                          <BookmarkPlus className="h-3 w-3" />
                                          <span>Save Together</span>
                                        </button>
                                      </div>

                                      <p className="text-xs sm:text-sm font-bold text-stone-900 dark:text-zinc-100">
                                        {r.title}
                                      </p>

                                      {/* Original & Connected Scripture Reference Summary + Speaker Attribution */}
                                      <div className="flex items-center gap-2 flex-wrap text-[11px]">
                                        <span className="font-semibold text-stone-700 dark:text-zinc-300">
                                          {v.canonicalRef}
                                        </span>
                                        {r.primarySpeaker && (
                                          <span
                                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                              isLight
                                                ? 'bg-stone-100 text-stone-600'
                                                : 'bg-zinc-800 text-zinc-400'
                                            }`}
                                          >
                                            {r.primarySpeaker}
                                          </span>
                                        )}
                                        <span className="text-stone-400">↔</span>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            toggleInlineSupportingRef(
                                              `ref-main-${r.id}`,
                                              r.connectedRef
                                            )
                                          }
                                          className={`font-bold hover:underline inline-flex items-center gap-1 ${
                                            isLight ? 'text-amber-900' : 'text-amber-400'
                                          }`}
                                        >
                                          <span>
                                            {r.connectedRef} ({translation})
                                          </span>
                                        </button>
                                        {r.connectedSpeaker && (
                                          <span
                                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                              isLight
                                                ? 'bg-stone-100 text-stone-600'
                                                : 'bg-zinc-800 text-zinc-400'
                                            }`}
                                          >
                                            {r.connectedSpeaker}
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div
                                      className={`h-px w-full ${
                                        isLight ? 'bg-stone-200/60' : 'bg-zinc-800/70'
                                      }`}
                                    />

                                    {/* Exact Connected Bible Verse */}
                                    <div className="px-4 sm:px-5 py-3 space-y-1.5">
                                      <div className="flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                                          Connected Scripture — {r.connectedRef} ({translation})
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() =>
                                            navigateToReferenceString(r.connectedRef)
                                          }
                                          className={`text-[11px] font-semibold hover:underline inline-flex items-center gap-1 ${
                                            isLight ? 'text-amber-900' : 'text-amber-400'
                                          }`}
                                          title={`Go to chapter for ${r.connectedRef}`}
                                        >
                                          <span>Open chapter</span>
                                          <ExternalLink className="h-3 w-3 opacity-75" />
                                        </button>
                                      </div>
                                      <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                                        “{refText}”
                                      </p>
                                    </div>

                                    <div
                                      className={`h-px w-full ${
                                        isLight ? 'bg-stone-200/60' : 'bg-zinc-800/70'
                                      }`}
                                    />

                                    {/* Explanation of the Relationship & Biblical Context */}
                                    <div className="px-4 sm:px-5 py-3 space-y-2">
                                      <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block">
                                          Explanation of Relationship
                                        </span>
                                        <p className="text-xs leading-relaxed mt-0.5 text-stone-700 dark:text-zinc-300">
                                          {r.explanation || r.connectionLabel}
                                        </p>
                                      </div>
                                      {r.biblicalContext && (
                                        <div>
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block">
                                            Biblical Context
                                          </span>
                                          <p className="text-xs leading-relaxed mt-0.5 text-stone-600 dark:text-zinc-400">
                                            {r.biblicalContext}
                                          </p>
                                        </div>
                                      )}
                                      {r.disputedNote && (
                                        <p className="text-[11px] italic text-amber-800 dark:text-amber-300">
                                          Note on scholarly discussion: {r.disputedNote}
                                        </p>
                                      )}
                                    </div>

                                    {/* Supporting Scriptures (Expand Inline Directly Beneath When Clicked) */}
                                    {supportingList.length > 0 && (
                                      <>
                                        <div
                                          className={`h-px w-full ${
                                            isLight ? 'bg-stone-200/60' : 'bg-zinc-800/70'
                                          }`}
                                        />
                                        <div className="px-4 sm:px-5 py-3 space-y-2">
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block">
                                            Supporting Scripture (Click to expand inline)
                                          </span>
                                          <div className="flex flex-wrap gap-1.5">
                                            {supportingList.map((supRef) => {
                                              const supKey = `ref-sup-${r.id}-${supRef}`;
                                              const isSupExpanded =
                                                !!expandedInlineSupportingRefs[supKey];
                                              return (
                                                <button
                                                  key={supRef}
                                                  type="button"
                                                  onClick={() =>
                                                    toggleInlineSupportingRef(supKey, supRef)
                                                  }
                                                  className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition inline-flex items-center gap-1 ${
                                                    isSupExpanded
                                                      ? isLight
                                                        ? 'bg-amber-700 text-white border-amber-700'
                                                        : 'bg-amber-500 text-zinc-950 border-amber-500'
                                                      : isLight
                                                      ? 'bg-stone-100 hover:bg-stone-200 text-amber-900 border-stone-200'
                                                      : 'bg-zinc-800 hover:bg-zinc-700 text-amber-400 border-zinc-700'
                                                  }`}
                                                >
                                                  <span>{supRef}</span>
                                                  {isSupExpanded ? (
                                                    <ChevronUp className="h-3 w-3" />
                                                  ) : (
                                                    <ChevronDown className="h-3 w-3" />
                                                  )}
                                                </button>
                                              );
                                            })}
                                          </div>

                                          {supportingList.map((supRef) => {
                                            const supKey = `ref-sup-${r.id}-${supRef}`;
                                            if (!expandedInlineSupportingRefs[supKey]) {
                                              return null;
                                            }
                                            const supText =
                                              resolvedRefTexts[supRef] ||
                                              getVerseText(supRef, translation) ||
                                              'Loading verse...';
                                            return (
                                              <div
                                                key={`expanded-${supKey}`}
                                                className="pt-2 space-y-1"
                                              >
                                                <div className="flex items-center justify-between gap-2">
                                                  <span
                                                    className={`text-xs font-bold ${
                                                      isLight
                                                        ? 'text-amber-900'
                                                        : 'text-amber-400'
                                                    }`}
                                                  >
                                                    {supRef} ({translation})
                                                  </span>
                                                  <div className="flex items-center gap-2">
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        navigateToReferenceString(supRef)
                                                      }
                                                      className="text-[11px] font-semibold hover:underline inline-flex items-center gap-1 text-stone-500 dark:text-zinc-400"
                                                    >
                                                      <span>Open chapter</span>
                                                      <ExternalLink className="h-3 w-3" />
                                                    </button>
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        toggleInlineSupportingRef(
                                                          supKey,
                                                          supRef
                                                        )
                                                      }
                                                      className="p-0.5 rounded hover:bg-stone-200 dark:hover:bg-zinc-800"
                                                      title="Close supporting scripture"
                                                    >
                                                      <X className="h-3.5 w-3.5" />
                                                    </button>
                                                  </div>
                                                </div>
                                                <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                                                  “{supText}”
                                                </p>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </>
                                    )}
                                  </React.Fragment>
                                );
                              })
                            )}
                          </div>
                        )}

                        {/* SECTION 2: INFERENCE (Biblical Interpretations & Connections — Interpretive) */}
                        {activeRefSection === 'inference' && inferences.length > 0 && (
                          <div>
                            {inferences.map((inf, idx) => {
                              const primaryVerseText =
                                v.translations[translation] || v.translations.NIV;
                              const firstSupportRef = inf.supportingRefs[0] || v.canonicalRef;
                              const firstSupportText =
                                resolvedRefTexts[firstSupportRef] ||
                                getVerseText(firstSupportRef, translation) ||
                                primaryVerseText;
                              return (
                                <React.Fragment key={inf.id}>
                                  {idx > 0 && (
                                    <div
                                      className={`h-px w-full ${
                                        isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
                                      }`}
                                    />
                                  )}
                                  {/* Inference Header: Interpretive Badge, Strength Badge, Speaker & Save */}
                                  <div className="px-4 sm:px-5 py-3.5 space-y-2">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span
                                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                            isLight
                                              ? 'bg-stone-200 text-stone-800'
                                              : 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                                          }`}
                                        >
                                          Interpretive (Not Direct Quotation)
                                        </span>
                                        <span
                                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                            inf.inferenceStrength === 'Possible Interpretation'
                                              ? isLight
                                                ? 'bg-amber-100 text-amber-900'
                                                : 'bg-amber-500/20 text-amber-300'
                                              : isLight
                                              ? 'bg-sky-100 text-sky-900'
                                              : 'bg-sky-500/20 text-sky-300'
                                          }`}
                                        >
                                          {inf.inferenceStrength ||
                                            'Strong Scriptural Inference'}
                                        </span>
                                        {inf.speakerAttribution && (
                                          <span
                                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                              isLight
                                                ? 'bg-stone-100 text-stone-600'
                                                : 'bg-zinc-800 text-zinc-400'
                                            }`}
                                          >
                                            {inf.speakerAttribution}
                                          </span>
                                        )}
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          saveConnectionToNotes({
                                            title: inf.title,
                                            primaryRef: inf.verseRef,
                                            connectedRef: firstSupportRef,
                                            primaryText: primaryVerseText,
                                            connectedText: firstSupportText,
                                            translation,
                                            category: 'Thematic connection',
                                            connectionLabel: `${
                                              inf.inferenceStrength ||
                                              'Strong Scriptural Inference'
                                            }: ${inf.inferredConclusion}`,
                                            verificationStatus: 'verified',
                                            personalObservation: inf.reasoningExplanation,
                                            collectionId: selectedCollectionId,
                                            sharedToCommunity: false,
                                          });
                                        }}
                                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold inline-flex items-center gap-1 border transition ${
                                          isLight
                                            ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
                                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                                        }`}
                                        title="Save inference and supporting verses together in Notes"
                                      >
                                        <BookmarkPlus className="h-3 w-3" />
                                        <span>Save Together</span>
                                      </button>
                                    </div>

                                    <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-zinc-100 block">
                                      {inf.title}
                                    </span>

                                    <div className="pt-1">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block">
                                        Explicit Biblical Statement ({inf.verseRef})
                                      </span>
                                      <p className="text-xs leading-relaxed mt-0.5 text-stone-800 dark:text-zinc-200">
                                        {inf.explicitStatement}
                                      </p>
                                    </div>
                                  </div>

                                  <div
                                    className={`h-px w-full ${
                                      isLight ? 'bg-stone-200/80' : 'bg-zinc-800'
                                    }`}
                                  />

                                  {/* Inferred Conclusion, Reasoning & Biblical Context */}
                                  <div className="px-4 sm:px-5 py-3.5 space-y-2.5">
                                    <div>
                                      <span
                                        className={`text-[10px] font-bold uppercase tracking-wider block ${
                                          isLight ? 'text-amber-800' : 'text-amber-400'
                                        }`}
                                      >
                                        Inferred Conclusion
                                      </span>
                                      <p className="text-xs sm:text-sm font-semibold leading-relaxed mt-0.5 text-stone-900 dark:text-zinc-100">
                                        {inf.inferredConclusion}
                                      </p>
                                    </div>

                                    <div>
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block">
                                        Reasoning & How the Conclusion Follows
                                      </span>
                                      <p className="text-xs leading-relaxed mt-0.5 text-stone-600 dark:text-zinc-300">
                                        {inf.reasoningExplanation}
                                      </p>
                                    </div>

                                    {inf.biblicalContext && (
                                      <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block">
                                          Biblical Context
                                        </span>
                                        <p className="text-xs leading-relaxed mt-0.5 text-stone-600 dark:text-zinc-400">
                                          {inf.biblicalContext}
                                        </p>
                                      </div>
                                    )}

                                    {inf.disputedNote && (
                                      <p className="text-[11px] italic text-amber-800 dark:text-amber-300">
                                        Disputed / Interpretive Note: {inf.disputedNote}
                                      </p>
                                    )}
                                  </div>

                                  <div
                                    className={`h-px w-full ${
                                      isLight ? 'bg-stone-200/80' : 'bg-zinc-800'
                                    }`}
                                  />

                                  {/* Supporting Scriptures (Expand Inline Directly Beneath When Clicked) */}
                                  <div className="px-4 sm:px-5 py-3.5 space-y-2.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block">
                                      Supporting Scriptures (Click to expand or collapse inline)
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {inf.supportingRefs.map((supRef) => {
                                        const supKey = `inf-sup-${inf.id}-${supRef}`;
                                        const isSupExpanded =
                                          expandedInlineSupportingRefs[supKey] ?? true;
                                        return (
                                          <button
                                            key={supRef}
                                            type="button"
                                            onClick={() =>
                                              setExpandedInlineSupportingRefs((prev) => ({
                                                ...prev,
                                                [supKey]: !(prev[supKey] ?? true),
                                              }))
                                            }
                                            className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition inline-flex items-center gap-1 ${
                                              isSupExpanded
                                                ? isLight
                                                  ? 'bg-amber-700 text-white border-amber-700'
                                                  : 'bg-amber-500 text-zinc-950 border-amber-500'
                                                : isLight
                                                ? 'bg-stone-100 hover:bg-stone-200 text-amber-900 border-stone-200'
                                                : 'bg-zinc-800 hover:bg-zinc-700 text-amber-400 border-zinc-700'
                                            }`}
                                          >
                                            <span>{supRef}</span>
                                            {isSupExpanded ? (
                                              <ChevronUp className="h-3 w-3" />
                                            ) : (
                                              <ChevronDown className="h-3 w-3" />
                                            )}
                                          </button>
                                        );
                                      })}
                                    </div>
                                    <div className="space-y-2.5">
                                      {inf.supportingRefs.map((supRef, sIdx) => {
                                        const supKey = `inf-sup-${inf.id}-${supRef}`;
                                        const isSupExpanded =
                                          expandedInlineSupportingRefs[supKey] ?? true;
                                        if (!isSupExpanded) return null;
                                        const supText =
                                          resolvedRefTexts[supRef] ||
                                          getVerseText(supRef, translation);
                                        return (
                                          <div key={supRef} className="space-y-1">
                                            {sIdx > 0 && (
                                              <div
                                                className={`h-px w-full my-2 ${
                                                  isLight ? 'bg-stone-200/60' : 'bg-zinc-800/70'
                                                }`}
                                              />
                                            )}
                                            <div className="flex items-center justify-between gap-2">
                                              <span
                                                className={`text-xs font-bold ${
                                                  isLight ? 'text-amber-900' : 'text-amber-400'
                                                }`}
                                              >
                                                {supRef} ({translation})
                                              </span>
                                              <button
                                                type="button"
                                                onClick={() =>
                                                  navigateToReferenceString(supRef)
                                                }
                                                className="text-[11px] font-semibold hover:underline inline-flex items-center gap-1 text-stone-500 dark:text-zinc-400"
                                              >
                                                <span>Open chapter</span>
                                                <ExternalLink className="h-3 w-3 opacity-75" />
                                              </button>
                                            </div>
                                            <p className="font-serif text-xs leading-relaxed text-stone-700 dark:text-zinc-300">
                                              “{supText}”
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        )}

                        {/* SECTION 3: TYPES & SHADOWS (Biblical Typology) */}
                        {activeRefSection === 'types' && typeShadows.length > 0 && (
                          <div>
                            {typeShadows.map((ts, idx) => {
                              const otText =
                                resolvedRefTexts[ts.otTypeRef] ||
                                getVerseText(ts.otTypeRef, translation);
                              const ntText =
                                resolvedRefTexts[ts.ntAntitypeRef] ||
                                getVerseText(ts.ntAntitypeRef, translation);
                              const tsSupportingList = ts.supportingRefs || [];
                              return (
                                <React.Fragment key={ts.id}>
                                  {idx > 0 && (
                                    <div
                                      className={`h-px w-full ${
                                        isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
                                      }`}
                                    />
                                  )}
                                  {/* Title, Typology Basis Badge & Save Together Button */}
                                  <div className="px-4 sm:px-5 py-3.5 space-y-2">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span
                                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                            isLight
                                              ? 'bg-amber-100 text-amber-900'
                                              : 'bg-amber-500/20 text-amber-300'
                                          }`}
                                        >
                                          Typological Connection
                                        </span>
                                        <span
                                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                            isLight
                                              ? 'bg-emerald-100 text-emerald-900'
                                              : 'bg-emerald-500/20 text-emerald-300'
                                          }`}
                                        >
                                          {ts.typologyBasis ||
                                            'Explicitly Established by Scripture'}
                                        </span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          saveConnectionToNotes({
                                            title: ts.title,
                                            primaryRef: ts.otTypeRef,
                                            connectedRef: ts.ntAntitypeRef,
                                            primaryText: otText,
                                            connectedText: ntText,
                                            translation,
                                            category: 'Prophecy fulfilment',
                                            connectionLabel: `${ts.typeName} → ${ts.fulfilmentName}: ${ts.explanation}`,
                                            verificationStatus: 'verified',
                                            personalObservation: ts.biblicalContext || '',
                                            collectionId: selectedCollectionId,
                                            sharedToCommunity: false,
                                          });
                                        }}
                                        className={`rounded-lg px-2.5 py-1 text-[11px] font-bold inline-flex items-center gap-1 border transition ${
                                          isLight
                                            ? 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-200'
                                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
                                        }`}
                                        title="Save Old Testament Type & New Testament Fulfilment together in Notes"
                                      >
                                        <BookmarkPlus className="h-3 w-3" />
                                        <span>Save Together</span>
                                      </button>
                                    </div>

                                    <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-zinc-100 block">
                                      {ts.title}
                                    </span>
                                  </div>

                                  <div
                                    className={`h-px w-full ${
                                      isLight ? 'bg-stone-200/80' : 'bg-zinc-800'
                                    }`}
                                  />

                                  {/* Old Testament Type Passage */}
                                  <div className="px-4 sm:px-5 py-3.5 space-y-1.5">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500">
                                          Old Testament Type — {ts.otTypeRef} ({translation})
                                        </span>
                                        {ts.otSpeaker && (
                                          <span
                                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                              isLight
                                                ? 'bg-stone-100 text-stone-600'
                                                : 'bg-zinc-800 text-zinc-400'
                                            }`}
                                          >
                                            {ts.otSpeaker}
                                          </span>
                                        )}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => navigateToReferenceString(ts.otTypeRef)}
                                        className={`text-[11px] font-semibold hover:underline inline-flex items-center gap-1 ${
                                          isLight ? 'text-amber-900' : 'text-amber-400'
                                        }`}
                                      >
                                        <span>Open chapter</span>
                                        <ExternalLink className="h-3 w-3 opacity-75" />
                                      </button>
                                    </div>
                                    <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                                      “{otText}”
                                    </p>
                                  </div>

                                  <div
                                    className={`h-px w-full ${
                                      isLight ? 'bg-stone-200/80' : 'bg-zinc-800'
                                    }`}
                                  />

                                  {/* New Testament Fulfilment Passage */}
                                  <div className="px-4 sm:px-5 py-3.5 space-y-1.5">
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span
                                          className={`text-[10px] font-bold uppercase tracking-wider ${
                                            isLight ? 'text-emerald-800' : 'text-emerald-400'
                                          }`}
                                        >
                                          New Testament Fulfilment — {ts.ntAntitypeRef} (
                                          {translation})
                                        </span>
                                        {ts.ntSpeaker && (
                                          <span
                                            className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                              isLight
                                                ? 'bg-stone-100 text-stone-600'
                                                : 'bg-zinc-800 text-zinc-400'
                                            }`}
                                          >
                                            {ts.ntSpeaker}
                                          </span>
                                        )}
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          navigateToReferenceString(ts.ntAntitypeRef)
                                        }
                                        className={`text-[11px] font-semibold hover:underline inline-flex items-center gap-1 ${
                                          isLight ? 'text-amber-900' : 'text-amber-400'
                                        }`}
                                      >
                                        <span>Open chapter</span>
                                        <ExternalLink className="h-3 w-3 opacity-75" />
                                      </button>
                                    </div>
                                    <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                                      “{ntText}”
                                    </p>
                                  </div>

                                  <div
                                    className={`h-px w-full ${
                                      isLight ? 'bg-stone-200/80' : 'bg-zinc-800'
                                    }`}
                                  />

                                  {/* Explanation of What the Type Represents, Biblical Context & Supporting Scripture */}
                                  <div className="px-4 sm:px-5 py-3.5 space-y-2">
                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                      <span className="font-bold text-stone-500 dark:text-zinc-400">
                                        Shadow / Type:
                                      </span>
                                      <span className="font-semibold text-stone-900 dark:text-zinc-100">
                                        {ts.typeName}
                                      </span>
                                      <span className="text-stone-400">→</span>
                                      <span className="font-bold text-stone-500 dark:text-zinc-400">
                                        Substance / Fulfilment:
                                      </span>
                                      <span className="font-semibold text-stone-900 dark:text-zinc-100">
                                        {ts.fulfilmentName}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block">
                                        Explanation of the Typological Relationship
                                      </span>
                                      <p className="text-xs leading-relaxed mt-0.5 text-stone-700 dark:text-zinc-300">
                                        {ts.explanation}
                                      </p>
                                    </div>
                                    {ts.biblicalContext && (
                                      <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block">
                                          Biblical Context
                                        </span>
                                        <p className="text-xs leading-relaxed mt-0.5 text-stone-600 dark:text-zinc-400">
                                          {ts.biblicalContext}
                                        </p>
                                      </div>
                                    )}
                                    {ts.disputedNote && (
                                      <p className="text-[11px] italic text-amber-800 dark:text-amber-300">
                                        Note on interpretation: {ts.disputedNote}
                                      </p>
                                    )}

                                    {tsSupportingList.length > 0 && (
                                      <div className="pt-1 space-y-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block">
                                          Supporting Scripture (Click to expand inline)
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                          {tsSupportingList.map((supRef) => {
                                            const supKey = `ts-sup-${ts.id}-${supRef}`;
                                            const isSupExpanded =
                                              !!expandedInlineSupportingRefs[supKey];
                                            return (
                                              <button
                                                key={supRef}
                                                type="button"
                                                onClick={() =>
                                                  toggleInlineSupportingRef(supKey, supRef)
                                                }
                                                className={`rounded-lg px-2.5 py-1 text-xs font-bold border transition inline-flex items-center gap-1 ${
                                                  isSupExpanded
                                                    ? isLight
                                                      ? 'bg-amber-700 text-white border-amber-700'
                                                      : 'bg-amber-500 text-zinc-950 border-amber-500'
                                                    : isLight
                                                    ? 'bg-stone-100 hover:bg-stone-200 text-amber-900 border-stone-200'
                                                    : 'bg-zinc-800 hover:bg-zinc-700 text-amber-400 border-zinc-700'
                                                }`}
                                              >
                                                <span>{supRef}</span>
                                                {isSupExpanded ? (
                                                  <ChevronUp className="h-3 w-3" />
                                                ) : (
                                                  <ChevronDown className="h-3 w-3" />
                                                )}
                                              </button>
                                            );
                                          })}
                                        </div>

                                        {tsSupportingList.map((supRef) => {
                                          const supKey = `ts-sup-${ts.id}-${supRef}`;
                                          if (!expandedInlineSupportingRefs[supKey]) {
                                            return null;
                                          }
                                          const supText =
                                            resolvedRefTexts[supRef] ||
                                            getVerseText(supRef, translation) ||
                                            'Loading verse...';
                                          return (
                                            <div
                                              key={`expanded-${supKey}`}
                                              className="pt-2 space-y-1"
                                            >
                                              <div className="flex items-center justify-between gap-2">
                                                <span
                                                  className={`text-xs font-bold ${
                                                    isLight
                                                      ? 'text-amber-900'
                                                      : 'text-amber-400'
                                                  }`}
                                                >
                                                  {supRef} ({translation})
                                                </span>
                                                <div className="flex items-center gap-2">
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      navigateToReferenceString(supRef)
                                                    }
                                                    className="text-[11px] font-semibold hover:underline inline-flex items-center gap-1 text-stone-500 dark:text-zinc-400"
                                                  >
                                                    <span>Open chapter</span>
                                                    <ExternalLink className="h-3 w-3" />
                                                  </button>
                                                  <button
                                                    type="button"
                                                    onClick={() =>
                                                      toggleInlineSupportingRef(
                                                        supKey,
                                                        supRef
                                                      )
                                                    }
                                                    className="p-0.5 rounded hover:bg-stone-200 dark:hover:bg-zinc-800"
                                                    title="Close supporting scripture"
                                                  >
                                                    <X className="h-3.5 w-3.5" />
                                                  </button>
                                                </div>
                                              </div>
                                              <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                                                “{supText}”
                                              </p>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {/* =========================================================
                        MUTUALLY EXCLUSIVE PANEL 2: VERSE ACTION INTERFACE
                        Single container with full-width horizontal dividers (no nested cards)
                        ========================================================= */}
                    {isActionOpen && (
                      <div
                        className={`rounded-2xl border overflow-hidden animate-in fade-in duration-150 ${
                          isLight
                            ? 'bg-white border-stone-200/90 shadow-sm text-stone-900'
                            : 'bg-[#171717] border-zinc-800 shadow-md text-zinc-100'
                        }`}
                      >
                        {activeActionView === 'none' ? (
                          <>
                            {/* FIRST SECTION: Verse reference on left, Controls on top-right (no repeated verse text) */}
                            <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
                              <span
                                className={`text-xs sm:text-sm font-bold tracking-tight ${
                                  isLight ? 'text-amber-900' : 'text-amber-400'
                                }`}
                              >
                                {v.canonicalRef} ({translation})
                              </span>

                              {/* Top-Right Controls: Colour selector, Voice, Save, Close */}
                              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                                {/* Colour selection control */}
                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-stone-200/80 dark:border-zinc-800 bg-stone-50/70 dark:bg-zinc-900/80">
                                  {(['amber', 'emerald', 'blue'] as const).map((col) => (
                                    <button
                                      key={col}
                                      onClick={() =>
                                        setVerseHighlight(
                                          v.canonicalRef,
                                          highlightColor === col ? null : col
                                        )
                                      }
                                      className={`h-4 w-4 rounded-full border transition ${
                                        col === 'amber'
                                          ? 'bg-amber-400 border-amber-300'
                                          : col === 'emerald'
                                          ? 'bg-emerald-400 border-emerald-300'
                                          : 'bg-sky-400 border-sky-300'
                                      } ${
                                        highlightColor === col
                                          ? 'ring-2 ring-stone-800 dark:ring-white scale-110'
                                          : ''
                                      }`}
                                      title={`Highlight ${col}`}
                                      aria-label={`Highlight ${col}`}
                                    />
                                  ))}
                                  {highlightColor && (
                                    <button
                                      onClick={() => setVerseHighlight(v.canonicalRef, null)}
                                      className="text-[10px] text-stone-400 hover:text-stone-700 dark:text-zinc-400 dark:hover:text-zinc-200 ml-0.5 underline"
                                    >
                                      Clear
                                    </button>
                                  )}
                                </div>

                                {/* Voice, Save and Close icons */}
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleToggleAudio(v.verse)}
                                    className={`rounded-lg p-1.5 border transition ${
                                      isCurrentlySpoken
                                        ? isLight
                                          ? 'bg-amber-700 border-amber-700 text-white'
                                          : 'bg-amber-500 border-amber-500 text-zinc-950'
                                        : isLight
                                        ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                                        : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                    }`}
                                    title="Voice (Read Aloud)"
                                    aria-label="Read Aloud"
                                  >
                                    <Volume2 className="h-4 w-4" />
                                  </button>

                                  <button
                                    onClick={() => setActiveActionView('save')}
                                    className={`rounded-lg p-1.5 border transition ${
                                      isLight
                                        ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                                        : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                    }`}
                                    title="Save to Notes or Collections"
                                    aria-label="Save Verse"
                                  >
                                    <Bookmark className="h-4 w-4" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setSelectedVerse(null);
                                      setOpenPanelMode('none');
                                      setActiveActionView('none');
                                    }}
                                    className={`rounded-lg p-1.5 border transition ${
                                      isLight
                                        ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-600'
                                        : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                                    }`}
                                    title="Close"
                                    aria-label="Close selection"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Full-width horizontal divider */}
                            <div
                              className={`h-px w-full ${
                                isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
                              }`}
                            />

                            {/* SECOND SECTION: Available actions */}
                            {/* Only show Reference / Inference / Types & Shadows categories with supported findings, or Reference when clicked */}
                            <div className="px-4 sm:px-5 py-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <button
                                onClick={() =>
                                  openScriptureIntelligenceForVerse(v, 'reference')
                                }
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border transition shrink-0 whitespace-nowrap ${
                                  isLight
                                    ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                }`}
                              >
                                Reference
                              </button>

                              {inferences.length > 0 && (
                                <button
                                  onClick={() =>
                                    openScriptureIntelligenceForVerse(v, 'inference')
                                  }
                                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border transition shrink-0 whitespace-nowrap ${
                                    isLight
                                      ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                  }`}
                                >
                                  Inference
                                </button>
                              )}

                              {typeShadows.length > 0 && (
                                <button
                                  onClick={() =>
                                    openScriptureIntelligenceForVerse(v, 'types')
                                  }
                                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border transition shrink-0 whitespace-nowrap ${
                                    isLight
                                      ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                  }`}
                                >
                                  Types & Shadows
                                </button>
                              )}

                              <button
                                onClick={() => setActiveActionView('context')}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border transition shrink-0 whitespace-nowrap ${
                                  isLight
                                    ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                }`}
                              >
                                Context
                              </button>

                              <button
                                onClick={handleOpenCompareInline}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border transition shrink-0 whitespace-nowrap ${
                                  isLight
                                    ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                }`}
                              >
                                Compare Translation
                              </button>

                              <button
                                onClick={() => handleCopyVerse(v)}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border transition shrink-0 whitespace-nowrap ${
                                  isLight
                                    ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                }`}
                              >
                                Copy
                              </button>
                            </div>
                          </>
                        ) : activeActionView === 'context' ? (
                          /* FOCUSED VIEW: Context (Single container with edge-to-edge dividers, no nested cards) */
                          <div>
                            <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded w-fit ${
                                    isLight
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}
                                >
                                  Context
                                </span>
                                <span
                                  className={`text-xs sm:text-sm font-bold ${
                                    isLight ? 'text-stone-900' : 'text-zinc-100'
                                  }`}
                                >
                                  {v.canonicalRef}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedVerse(null);
                                  setOpenPanelMode('none');
                                  setActiveActionView('none');
                                }}
                                className={`rounded-lg p-1.5 border transition shrink-0 ${
                                  isLight
                                    ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-600'
                                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                                }`}
                                title="Close"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            <div
                              className={`h-px w-full ${
                                isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
                              }`}
                            />

                            {isLoadingInlineContext || !inlineContextData ? (
                              <div className="px-4 sm:px-5 py-4 text-xs text-stone-500 dark:text-zinc-400">
                                Loading passage context...
                              </div>
                            ) : (
                              <div>
                                <div className="px-4 sm:px-5 py-3.5">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block">
                                    Main Theme of {v.canonicalRef}
                                  </span>
                                  <h4 className="text-xs sm:text-sm font-bold mt-0.5 text-stone-900 dark:text-zinc-100">
                                    {inlineContextData.mainTheme}
                                  </h4>
                                </div>

                                {inlineContextData.verseBreakdown.map((point, idx) => (
                                  <React.Fragment key={idx}>
                                    <div
                                      className={`h-px w-full ${
                                        isLight ? 'bg-stone-200/80' : 'bg-zinc-800'
                                      }`}
                                    />
                                    <div className="px-4 sm:px-5 py-3 text-xs leading-relaxed text-stone-700 dark:text-zinc-300">
                                      {point}
                                    </div>
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : activeActionView === 'compare' ? (
                          /* FOCUSED VIEW: Compare Translation (Single container with clean dividers) */
                          <div>
                            <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded w-fit ${
                                    isLight
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}
                                >
                                  Compare Translation
                                </span>
                                <span
                                  className={`text-xs sm:text-sm font-bold ${
                                    isLight ? 'text-stone-900' : 'text-zinc-100'
                                  }`}
                                >
                                  {v.canonicalRef}
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedVerse(null);
                                  setOpenPanelMode('none');
                                  setActiveActionView('none');
                                }}
                                className={`rounded-lg p-1.5 border transition shrink-0 ${
                                  isLight
                                    ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-600'
                                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                                }`}
                                title="Close"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            {BIBLE_TRANSLATIONS.map((t) => (
                              <React.Fragment key={t.id}>
                                <div
                                  className={`h-px w-full ${
                                    isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
                                  }`}
                                />
                                <div
                                  onClick={() => setTranslation(t.id)}
                                  className={`cursor-pointer px-4 sm:px-5 py-3 text-xs transition ${
                                    translation === t.id
                                      ? isLight
                                        ? 'bg-amber-50/60 text-stone-900'
                                        : 'bg-amber-500/10 text-zinc-100'
                                      : isLight
                                      ? 'hover:bg-stone-50 text-stone-800'
                                      : 'hover:bg-zinc-800/50 text-zinc-200'
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
                                    {translation === t.id && (
                                      <span className="text-[10px] font-bold text-emerald-600">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-serif text-xs leading-relaxed">
                                    “{v.translations[t.id]}”
                                  </p>
                                </div>
                              </React.Fragment>
                            ))}
                          </div>
                        ) : activeActionView === 'save' ? (
                          /* FOCUSED VIEW: Save */
                          <div>
                            <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded w-fit ${
                                    isLight
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}
                                >
                                  Save Discovery
                                </span>
                                <span
                                  className={`text-xs sm:text-sm font-bold ${
                                    isLight ? 'text-stone-900' : 'text-zinc-100'
                                  }`}
                                >
                                  {v.canonicalRef} ({translation})
                                </span>
                              </div>
                              <button
                                onClick={() => {
                                  setSelectedVerse(null);
                                  setOpenPanelMode('none');
                                  setActiveActionView('none');
                                }}
                                className={`rounded-lg p-1.5 border transition shrink-0 ${
                                  isLight
                                    ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-600'
                                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                                }`}
                                title="Close"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>

                            <div
                              className={`h-px w-full ${
                                isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
                              }`}
                            />

                            <div className="px-4 sm:px-5 py-3.5 space-y-3">
                              {/* What to Save: Verse, Context, or Connection */}
                              <div className="grid grid-cols-3 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setSaveTargetType('verse')}
                                  className={`rounded-xl py-1.5 px-2 text-xs font-bold border transition ${
                                    saveTargetType === 'verse'
                                      ? isLight
                                        ? 'bg-amber-700 border-amber-700 text-white'
                                        : 'bg-amber-500 border-amber-500 text-zinc-950'
                                      : isLight
                                      ? 'bg-white border-stone-200 text-stone-700'
                                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                                  }`}
                                >
                                  Bible Verse
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setSaveTargetType('context')}
                                  className={`rounded-xl py-1.5 px-2 text-xs font-bold border transition ${
                                    saveTargetType === 'context'
                                      ? isLight
                                        ? 'bg-amber-700 border-amber-700 text-white'
                                        : 'bg-amber-500 border-amber-500 text-zinc-950'
                                      : isLight
                                      ? 'bg-white border-stone-200 text-stone-700'
                                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                                  }`}
                                >
                                  Verse Context
                                </button>

                                <button
                                  type="button"
                                  disabled={refs.length === 0}
                                  onClick={() => setSaveTargetType('connection')}
                                  className={`rounded-xl py-1.5 px-2 text-xs font-bold border transition ${
                                    refs.length === 0
                                      ? 'opacity-40 cursor-not-allowed bg-stone-100 border-stone-200 text-stone-400'
                                      : saveTargetType === 'connection'
                                      ? isLight
                                        ? 'bg-amber-700 border-amber-700 text-white'
                                        : 'bg-amber-500 border-amber-500 text-zinc-950'
                                      : isLight
                                      ? 'bg-white border-stone-200 text-stone-700'
                                      : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                                  }`}
                                >
                                  Connection {refs.length > 0 ? `(${refs.length})` : ''}
                                </button>
                              </div>

                              {saveTargetType === 'connection' && refs.length > 1 && (
                                <div>
                                  <label className="text-[11px] font-semibold text-stone-500 dark:text-zinc-400 block mb-1">
                                    Select Connected Reference
                                  </label>
                                  <select
                                    value={selectedRefIdxForSave}
                                    onChange={(e) =>
                                      setSelectedRefIdxForSave(Number(e.target.value))
                                    }
                                    className={`w-full rounded-xl border px-3 py-1.5 text-xs ${
                                      isLight
                                        ? 'bg-white border-stone-300 text-stone-900'
                                        : 'bg-zinc-900 border-zinc-700 text-white'
                                    }`}
                                  >
                                    {refs.map((r, i) => (
                                      <option
                                        key={r.id}
                                        value={i}
                                        className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100"
                                      >
                                        {v.canonicalRef} ↔ {r.connectedRef} ({r.title})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}

                              {/* Collection Selector */}
                              <div>
                                <label className="text-[11px] font-semibold text-stone-500 dark:text-zinc-400 block mb-1">
                                  Collection
                                </label>
                                <select
                                  value={selectedCollectionId}
                                  onChange={(e) => setSelectedCollectionId(e.target.value)}
                                  className={`w-full rounded-xl border px-3 py-1.5 text-xs font-medium ${
                                    isLight
                                      ? 'bg-white border-stone-300 text-stone-800'
                                      : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                                  }`}
                                >
                                  {collections.map((col) => (
                                    <option
                                      key={col.id}
                                      value={col.id}
                                      className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100"
                                    >
                                      {col.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              {/* Personal Notes & Reflections */}
                              <div>
                                <label className="text-[11px] font-semibold text-stone-500 dark:text-zinc-400 block mb-1">
                                  Personal Reflections & Insights
                                </label>
                                <textarea
                                  rows={2}
                                  value={personalNoteDraft}
                                  onChange={(e) => setPersonalNoteDraft(e.target.value)}
                                  placeholder="Write your personal reflections and insights on this scripture..."
                                  className={`w-full rounded-xl border p-2.5 text-xs focus:outline-none ${
                                    isLight
                                      ? 'bg-white border-stone-300 text-stone-900 placeholder-stone-400'
                                      : 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500'
                                  }`}
                                />
                              </div>

                              {/* Save Button & Community Share Toggle */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                                <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer select-none">
                                  <input
                                    type="checkbox"
                                    checked={shareToCommunity}
                                    onChange={(e) => setShareToCommunity(e.target.checked)}
                                    className="h-3.5 w-3.5 accent-amber-700 rounded"
                                  />
                                  <Share2 className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                                  <span>Share to Community</span>
                                </label>

                                <button
                                  type="button"
                                  onClick={() => handleSaveFromInline(v)}
                                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 transition ${
                                    justSavedInline
                                      ? 'bg-emerald-600 text-white'
                                      : isLight
                                      ? 'bg-amber-700 hover:bg-amber-800 text-white'
                                      : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                                  }`}
                                >
                                  {justSavedInline ? (
                                    <>
                                      <BookmarkCheck className="h-3.5 w-3.5" />
                                      <span>Saved!</span>
                                    </>
                                  ) : (
                                    <>
                                      <BookmarkPlus className="h-3.5 w-3.5" />
                                      <span>Save</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {/* Note: Previous and Next Chapter buttons at the bottom of chapter views have been removed per specification */}
        </main>
      </div>

      {/* =====================================================================
          MOBILE FLOATING CHAPTER & AUDIO BAR (Close to Bottom Nav Bar while Scrolling)
          ===================================================================== */}
      <div className="lg:hidden fixed bottom-[70px] inset-x-0 z-30 px-4 pointer-events-none">
        <div className="mx-auto max-w-md flex items-center gap-2.5">
          {/* Play / Pause Audio Button */}
          <button
            onClick={() => handleToggleAudio()}
            className={`pointer-events-auto h-11 w-11 rounded-full flex items-center justify-center shadow-lg border transition shrink-0 ${
              isSpeaking
                ? isLight
                  ? 'bg-amber-700 border-amber-700 text-white'
                  : 'bg-amber-500 border-amber-400 text-zinc-950'
                : isLight
                ? 'bg-white/95 border-stone-200/90 text-stone-800 backdrop-blur-md'
                : 'bg-[#1e1e1e]/95 border-zinc-800 text-zinc-100 backdrop-blur-md'
            }`}
            aria-label={isSpeaking ? 'Pause Audio' : 'Play Chapter Audio'}
          >
            {isSpeaking ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4 ml-0.5" />
            )}
          </button>

          {/* Floating Chapter Pill (< Current Chapter >) */}
          <div
            className={`pointer-events-auto flex-1 h-11 rounded-full border shadow-lg px-2 flex items-center justify-between backdrop-blur-md ${
              isLight
                ? 'bg-white/95 border-stone-200/90 text-stone-900'
                : 'bg-[#1e1e1e]/95 border-zinc-800 text-zinc-100'
            }`}
          >
            <button
              onClick={handlePrevChapter}
              className={`h-8 w-8 rounded-full flex items-center justify-center transition ${
                isLight
                  ? 'text-stone-600 hover:bg-stone-100'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
              aria-label="Previous Chapter"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsBookSelectorOpen(true)}
              className="px-3 py-1 text-xs font-bold tracking-tight truncate"
            >
              {currentBook} {currentChapter === 0 ? 'Intro' : currentChapter}
            </button>

            <button
              onClick={handleNextChapter}
              className={`h-8 w-8 rounded-full flex items-center justify-center transition ${
                isLight
                  ? 'text-stone-600 hover:bg-stone-100'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
              aria-label="Next Chapter"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookChapterSelectorModal
        isOpen={isBookSelectorOpen}
        onClose={() => setIsBookSelectorOpen(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenReferencePanel={(ref) => navigateToReferenceString(ref, true)}
      />
    </div>
  );
}
