'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkPlus,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Globe,
  Link2,
  Pause,
  Play,
  Search,
  Share2,
  SlidersHorizontal,
  Sparkles,
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
  getTypesAndShadowsForVerse,
  registerRuntimeCrossReferences,
} from '@/data/crossReferences';
import { findSectionForVerse } from '@/data/chapterSections';
import { getVerseText } from '@/data/scriptureDatabase';
import {
  buildVerseContextData,
  fetchAllTranslationsForChapter,
  fetchChapterVerses,
  resolveScriptureVerse,
} from '@/services/bibleService';
import {
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
import BibleLineDrawing, { getIllustrationForChapter, getIllustrationForSection } from './BibleLineDrawing';
import BookChapterSelectorModal from './BookChapterSelectorModal';
import GlobalSearchModal from './GlobalSearchModal';

type VerseActionView = 'none' | 'context' | 'compare' | 'save';
type OpenPanelMode = 'none' | 'action' | 'reference' | 'types';

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
    highlights,
    setVerseHighlight,
    collections,
    saveConnectionToNotes,
    saveContextItem,
    saveBibleVerseItem,
    saveTypeShadowItem,
    showToast,
  } = usePlatform();

  const [verses, setVerses] = useState<VerseData[]>([]);
  const [isLoadingChapter, setIsLoadingChapter] = useState(false);

  const [isBookSelectorOpen, setIsBookSelectorOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDisplayMenuOpen, setIsDisplayMenuOpen] = useState(false);
  const [isTranslationMenuOpen, setIsTranslationMenuOpen] = useState(false);

  // Inline expanded verse state (Reference, Type and Shadow, and Action are mutually exclusive)
  const [openPanelMode, setOpenPanelMode] = useState<OpenPanelMode>('none');
  const [activeActionView, setActiveActionView] = useState<VerseActionView>('none');
  const [inlineContextData, setInlineContextData] = useState<VerseContextData | null>(null);
  const [isLoadingInlineContext, setIsLoadingInlineContext] = useState(false);
  const [resolvedRefTexts, setResolvedRefTexts] = useState<Record<string, string>>({});

  // Single-expand state for Supporting Texts tertiary dropdowns (only ONE may be expanded at a time)
  const [expandedSupportingRefId, setExpandedSupportingRefId] = useState<string | null>(null);

  // Inline Save & Personal Notes state (for saving a Bible Verse with optional notes/collection)
  const [personalNoteDraft, setPersonalNoteDraft] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(
    collections[0]?.id || 'col-messianic'
  );
  const [, setCrossRefsCounter] = useState<number>(0);

  // Audio speech state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingVerse, setSpeakingVerse] = useState<number | null>(null);
  const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);

  const toolbarMenuRef = useRef<HTMLDivElement | null>(null);
  const stickyToolbarRef = useRef<HTMLDivElement | null>(null);

  const currentBookObj = findBookByName(currentBook) || BIBLE_BOOKS[39];
  const isLight = preferences.theme === 'light';
  const isChildren = preferences.experienceMode === 'children';

  // Persistent Chapter Illustration (every chapter >= 1 has its own illustration in both Adult and Children's Modes)
  const chapterIllustration = useMemo(
    () => getIllustrationForChapter(currentBook, currentChapter),
    [currentBook, currentChapter]
  );

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

  // Helper to scroll selected verse to the top of the visible reading area,
  // immediately below the main header and the sticky reader toolbar
  const scrollVerseToTop = (verseNum: number) => {
    if (typeof window === 'undefined') return;
    const performScroll = () => {
      const el = document.getElementById(`verse-row-${verseNum}`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const toolbarBottom = stickyToolbarRef.current
        ? stickyToolbarRef.current.getBoundingClientRect().bottom
        : window.innerWidth < 1024
        ? 106
        : 64;
      const stickyOffset = Math.max(toolbarBottom + 10, window.innerWidth < 1024 ? 108 : 68);
      const targetTop = Math.max(0, window.scrollY + rect.top - stickyOffset);
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    };
    requestAnimationFrame(() => {
      setTimeout(performScroll, 25);
      setTimeout(performScroll, 140);
    });
  };

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
        const enriched = data.map((v) => {
          if (!v.heading) {
            const sec = findSectionForVerse(currentBook, currentChapter, v.verse);
            if (sec) return { ...v, heading: sec.heading };
          }
          return v;
        });
        if (active) setVerses([...enriched]);
        return fetchAllTranslationsForChapter(currentBook, currentChapter);
      })
      .then((allVersionData) => {
        if (active && allVersionData) {
          const enriched = allVersionData.map((v) => {
            if (!v.heading) {
              const sec = findSectionForVerse(currentBook, currentChapter, v.verse);
              if (sec) return { ...v, heading: sec.heading };
            }
            return v;
          });
          setVerses([...enriched]);
        }
      })
      .finally(() => {
        if (active) setIsLoadingChapter(false);
      });

    // Fetch expanded 66-book cross references from API
    fetch(`/api/cross-references?book=${encodeURIComponent(currentBook)}&chapter=${currentChapter}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.crossReferencesByVerse) {
          registerRuntimeCrossReferences(data.crossReferencesByVerse);
          setCrossRefsCounter((prev) => prev + 1);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [currentBook, currentChapter, translation]);

  // Reset reading area when moving between chapters, or scroll to selectedVerse if jumping to a specific verse
  useEffect(() => {
    stopHumanSpeech();
    setIsSpeaking(false);
    setSpeakingVerse(null);
    setOpenPanelMode('none');
    setActiveActionView('none');
    setExpandedSupportingRefId(null);
    if (typeof window !== 'undefined' && !selectedVerse) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [currentBook, currentChapter]);

  // When chapter verses finish loading and a selectedVerse is active (e.g. from search jump), scroll it near the header
  useEffect(() => {
    if (!isLoadingChapter && selectedVerse && verses.length > 0) {
      scrollVerseToTop(selectedVerse);
    }
  }, [isLoadingChapter, selectedVerse, verses.length]);

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
      setExpandedSupportingRefId(null);
      return;
    }
    const canonicalRef = `${currentBook} ${currentChapter}:${selectedVerse}`;
    const refs = getCrossReferencesForVerse(canonicalRef);
    const tShadows = getTypesAndShadowsForVerse(canonicalRef);

    setPersonalNoteDraft('');
    setExpandedSupportingRefId(null);

    let active = true;
    setIsLoadingInlineContext(true);
    buildVerseContextData(canonicalRef, translation)
      .then((ctx) => {
        if (active) setInlineContextData(ctx);
      })
      .finally(() => {
        if (active) setIsLoadingInlineContext(false);
      });

    // Collect all scripture references across Reference and Type and Shadow
    const allRefsToResolve: string[] = [
      ...refs.flatMap((r) => [r.connectedRef, ...(r.supportingRefs || [])]),
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

  // Open independent Reference or Type and Shadow view and position selected verse at top
  const openIndependentVersePanel = (
    v: VerseData,
    mode: 'reference' | 'types'
  ) => {
    setSelectedVerse(v.verse);
    setActiveActionView('none');
    setExpandedSupportingRefId(null);
    setOpenPanelMode(mode);
    scrollVerseToTop(v.verse);
  };

  // Requirement 4: Direct Save & Auto-Close for Type and Shadow, Reference, Context, and Bible Verse
  const handleDirectSaveTypeShadow = (v: VerseData, idx = 0) => {
    const tShadows = getTypesAndShadowsForVerse(v.canonicalRef);
    const chosenTs = tShadows[idx] || tShadows[0];
    if (!chosenTs) return;

    saveTypeShadowItem({
      title: chosenTs.title,
      selectedVerseRef: v.canonicalRef,
      otTypeRef: chosenTs.otTypeRef,
      ntAntitypeRef: chosenTs.ntAntitypeRef,
      otTypeText:
        resolvedRefTexts[chosenTs.otTypeRef] ||
        getVerseText(chosenTs.otTypeRef, translation),
      ntAntitypeText:
        resolvedRefTexts[chosenTs.ntAntitypeRef] ||
        getVerseText(chosenTs.ntAntitypeRef, translation),
      translation,
      typeName: chosenTs.typeName,
      fulfilmentName: chosenTs.fulfilmentName,
      explanation: chosenTs.explanation,
      biblicalContext: chosenTs.biblicalContext,
      typologyBasis: chosenTs.typologyBasis,
      personalNotes: '',
      collectionId: selectedCollectionId,
      sharedToCommunity: false,
    });

    // Close card and return user to normal scripture view
    setSelectedVerse(null);
    setOpenPanelMode('none');
    setActiveActionView('none');
  };

  const handleDirectSaveReference = (v: VerseData, idx = 0) => {
    const refs = getCrossReferencesForVerse(v.canonicalRef);
    const chosenRef = refs[idx] || refs[0];
    if (!chosenRef) return;
    const verseText = v.translations[translation] || v.translations.NIV;

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
      personalObservation: '',
      collectionId: selectedCollectionId,
      sharedToCommunity: false,
    });

    // Close card and return user to normal scripture view
    setSelectedVerse(null);
    setOpenPanelMode('none');
    setActiveActionView('none');
  };

  const handleDirectSaveContext = (v: VerseData) => {
    const verseText = v.translations[translation] || v.translations.NIV;
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
      personalNotes: '',
      collectionId: selectedCollectionId,
      sharedToCommunity: false,
    });

    // Close card and return user to normal scripture view
    setSelectedVerse(null);
    setOpenPanelMode('none');
    setActiveActionView('none');
  };

  const handleSaveBibleVerse = (v: VerseData) => {
    const verseText = v.translations[translation] || v.translations.NIV;
    saveBibleVerseItem({
      verseRef: v.canonicalRef,
      verseText,
      translation,
      highlightColor: highlights[v.canonicalRef],
      personalNotes: personalNoteDraft.trim(),
      collectionId: selectedCollectionId,
      sharedToCommunity: false,
    });

    // Automatically close saving card and return user to normal scripture view
    setSelectedVerse(null);
    setOpenPanelMode('none');
    setActiveActionView('none');
  };

  const handleExportReferenceText = (title: string, bodyText: string) => {
    const fullExport = `${title}\n${bodyText}`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullExport);
    }
    showToast(`Exported ${title} to clipboard`);
  };

  const handlePrevChapter = () => {
    setSelectedVerse(null);
    setOpenPanelMode('none');
    if (currentChapter > 1) {
      navigateToPassage(currentBook, currentChapter - 1, undefined, false);
    } else if (currentChapter === 1) {
      const prevBook = BIBLE_BOOKS.find((b) => b.id === currentBookObj.id - 1);
      if (prevBook) {
        navigateToPassage(prevBook.name, prevBook.chapters, undefined, false);
      }
    } else if (currentChapter === 0) {
      navigateToPassage(currentBook, 1, undefined, false);
    }
  };

  const handleNextChapter = () => {
    setSelectedVerse(null);
    setOpenPanelMode('none');
    if (currentChapter < currentBookObj.chapters) {
      navigateToPassage(currentBook, currentChapter + 1, undefined, false);
    } else {
      const nextBook = BIBLE_BOOKS.find((b) => b.id === currentBookObj.id + 1);
      if (nextBook) {
        navigateToPassage(nextBook.name, 1, undefined, false);
      }
    }
  };

  const handleOpenCompareInline = async (v: VerseData) => {
    setActiveActionView(activeActionView === 'compare' ? 'none' : 'compare');
    scrollVerseToTop(v.verse);
    try {
      const updated = await fetchAllTranslationsForChapter(currentBook, currentChapter);
      setVerses([...updated]);
    } catch {
      // ignore offline error
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

  // Format previous scripture label per Requirement 1B (e.g., "← Back to Isaiah")
  const previousBackLabel = previousReadingPosition
    ? previousReadingPosition.book !== currentBook
      ? previousReadingPosition.book
      : previousReadingPosition.label
    : null;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* =====================================================================
          MAIN BIBLE READING COLUMN
          ===================================================================== */}
      <div className="flex-1 min-w-0 flex flex-col pb-32 lg:pb-16">
        {/* Header 2: Secondary Reader Toolbar (Restored clean layout; no back button inside header) */}
        <div
          ref={stickyToolbarRef}
          className={`sticky top-12 lg:top-0 z-20 py-2 sm:py-2.5 px-3 sm:px-8 flex items-center justify-between transition-colors shadow-xs ${
            isChildren
              ? isLight
                ? 'bg-[#FFFDF4] text-slate-900'
                : 'bg-[#13192E] text-slate-100'
              : isLight
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
                isChildren
                  ? isLight
                    ? 'bg-amber-100 hover:bg-amber-200/80 border-amber-300 text-amber-950 shadow-2xs'
                    : 'bg-indigo-900/90 hover:bg-indigo-800 border-indigo-700 text-amber-200'
                  : isLight
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
                    isChildren
                      ? isLight
                        ? 'bg-[#FFFDF4] border-amber-300 text-slate-900 shadow-amber-200/50'
                        : 'bg-[#182038] border-indigo-700 text-slate-100 shadow-indigo-950/80'
                      : isLight
                      ? 'bg-white border-stone-200 text-stone-900'
                      : 'bg-[#1b1b1b] border-zinc-800 text-zinc-100'
                  }`}
                >
                  <div className="flex items-center justify-between pb-1">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isChildren
                          ? isLight
                            ? 'text-amber-800'
                            : 'text-amber-300'
                          : 'text-stone-400'
                      }`}
                    >
                      {isChildren ? '🌈 Reading & Voice Options' : 'Reading & Voice Settings'}
                    </span>
                    <button
                      onClick={() => setIsDisplayMenuOpen(false)}
                      className={`text-xs font-bold ${
                        isChildren
                          ? isLight
                            ? 'text-orange-700 hover:underline'
                            : 'text-amber-300 hover:underline'
                          : 'text-amber-700 dark:text-amber-400 font-semibold'
                      }`}
                    >
                      Done
                    </button>
                  </div>

                  <div
                    className={`h-px w-full ${
                      isChildren
                        ? isLight
                          ? 'bg-amber-200/80'
                          : 'bg-indigo-800/80'
                        : isLight
                        ? 'bg-stone-200/70'
                        : 'bg-zinc-800'
                    }`}
                  />

                  {/* Font Size */}
                  <div className="space-y-1.5">
                    <span
                      className={`text-xs ${
                        isChildren ? 'font-bold text-slate-700 dark:text-slate-200' : 'text-stone-500'
                      }`}
                    >
                      Text Size
                    </span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {(['xsmall', 'small', 'medium', 'large', 'xlarge'] as const).map((sz) => (
                        <button
                          key={sz}
                          onClick={() => updatePreferences({ fontSize: sz })}
                          className={`rounded-xl py-1.5 text-xs font-bold uppercase transition ${
                            preferences.fontSize === sz
                              ? isChildren
                                ? 'bg-amber-400 text-slate-950 font-extrabold shadow-xs'
                                : isLight
                                ? 'bg-amber-700 text-white'
                                : 'bg-amber-500 text-zinc-950'
                              : isChildren
                              ? isLight
                                ? 'bg-amber-100/80 text-amber-950 hover:bg-amber-200'
                                : 'bg-indigo-900/60 text-slate-200 hover:bg-indigo-800'
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
                      <span
                        className={`text-xs ${
                          isChildren ? 'font-bold text-slate-700 dark:text-slate-200' : 'text-stone-500'
                        } block`}
                      >
                        {isChildren ? 'Narrator Story Voice' : 'Narrator Voice (Natural Neural)'}
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
                        className={`w-full rounded-xl border px-2.5 py-1.5 text-xs font-semibold ${
                          isChildren
                            ? isLight
                              ? 'bg-white border-amber-300 text-slate-900 focus:ring-2 focus:ring-amber-400'
                              : 'bg-[#12172A] border-indigo-700 text-slate-100 focus:ring-2 focus:ring-amber-400'
                            : isLight
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
                  <label className="flex items-center justify-between text-xs cursor-pointer pt-1 font-semibold">
                    <span>Red-Letter Words of Jesus</span>
                    <input
                      type="checkbox"
                      checked={preferences.redLetterEnabled}
                      onChange={(e) =>
                        updatePreferences({ redLetterEnabled: e.target.checked })
                      }
                      className="h-4 w-4 accent-amber-500 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between text-xs cursor-pointer font-semibold">
                    <span>Show Cross-Reference Badges</span>
                    <input
                      type="checkbox"
                      checked={preferences.showReferenceBadges}
                      onChange={(e) =>
                        updatePreferences({ showReferenceBadges: e.target.checked })
                      }
                      className="h-4 w-4 accent-amber-500 rounded"
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
                  isChildren
                    ? isLight
                      ? 'bg-sky-100 hover:bg-sky-200/80 border-sky-300 text-sky-950'
                      : 'bg-indigo-900 hover:bg-indigo-800 border-indigo-700 text-sky-200'
                    : isLight
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
                  className={`absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] rounded-2xl border p-2 shadow-2xl z-50 space-y-1 ${
                    isChildren
                      ? isLight
                        ? 'bg-[#FFFDF4] border-amber-300 text-slate-900 shadow-amber-200/50'
                        : 'bg-[#182038] border-indigo-700 text-slate-100 shadow-indigo-950/80'
                      : isLight
                      ? 'bg-white border-stone-200 text-stone-900'
                      : 'bg-[#1b1b1b] border-zinc-800 text-zinc-100'
                  }`}
                >
                  <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                    {isChildren ? '🌈 Translation Versions' : 'Translations'}
                  </div>
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
                          ? isChildren
                            ? isLight
                              ? 'bg-amber-300/80 text-amber-950 font-extrabold shadow-2xs'
                              : 'bg-indigo-600 text-white font-extrabold shadow-2xs'
                            : isLight
                            ? 'bg-amber-50 text-amber-900 font-bold'
                            : 'bg-amber-500/20 text-amber-300 font-bold'
                          : isChildren
                          ? isLight
                            ? 'hover:bg-amber-100 text-slate-800'
                            : 'hover:bg-indigo-900/80 text-slate-200'
                          : isLight
                          ? 'hover:bg-stone-100 text-stone-700'
                          : 'hover:bg-zinc-800 text-zinc-200'
                      }`}
                    >
                      <span className="truncate">{t.name}</span>
                      {translation === t.id && (
                        <span
                          className={`text-xs font-bold shrink-0 ${
                            isChildren
                              ? isLight
                                ? 'text-amber-950'
                                : 'text-amber-300'
                              : isLight
                              ? 'text-amber-800'
                              : 'text-amber-400'
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
            isChildren
              ? isLight
                ? 'bg-amber-200/80'
                : 'bg-indigo-800/70'
              : isLight
              ? 'bg-stone-200/80'
              : 'bg-zinc-800/80'
          }`}
        />

        {/* Spacious Scripture Reading Canvas */}
        <main className="mx-auto w-full max-w-3xl px-5 sm:px-10 pt-6 sm:pt-8 pb-12">
          {/* =================================================================
              Requirement 1C: Previous-Scripture Navigation
              Positioned immediately below both header sections and directly above the chapter title.
              Only appears when a scripture was opened through header search.
              ================================================================= */}
          {previousReadingPosition && previousBackLabel && (
            <div className="mb-4 flex items-center justify-start">
              <button
                type="button"
                onClick={returnToPreviousPosition}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold border transition ${
                  isChildren
                    ? isLight
                      ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-950 shadow-2xs'
                      : 'bg-indigo-900 hover:bg-indigo-800 border-indigo-700 text-amber-300'
                    : isLight
                    ? 'bg-amber-50/90 hover:bg-amber-100 border-amber-200 text-amber-900 shadow-2xs'
                    : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-300'
                }`}
              >
                <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                <span>Back to {previousBackLabel}</span>
              </button>
            </div>
          )}

          {/* Chapter Heading */}
          <header className="text-center mb-6 sm:mb-8 select-none">
            <button
              onClick={() => setIsBookSelectorOpen(true)}
              className="group inline-flex flex-col items-center"
            >
              <span
                className={`text-xs font-bold uppercase tracking-[0.2em] transition ${
                  isChildren
                    ? isLight
                      ? 'text-orange-600 group-hover:text-orange-800'
                      : 'text-amber-300 group-hover:text-amber-200'
                    : isLight
                    ? 'text-stone-400 group-hover:text-amber-800'
                    : 'text-zinc-500 group-hover:text-amber-400'
                }`}
              >
                {currentBook}
              </span>
              <span
                className={`${
                  isChildren ? 'font-sans' : 'font-serif'
                } text-4xl sm:text-5xl font-bold tracking-tight mt-1.5 ${
                  isLight ? 'text-stone-900' : 'text-white'
                }`}
              >
                {currentChapter === 0
                  ? 'Introduction'
                  : isChildren
                  ? `Chapter ${currentChapter}`
                  : currentChapter}
              </span>
            </button>
          </header>

          {/* Persistent Chapter Illustration Before the Bible Text (Adult Mode & Children's Mode) */}
          {currentChapter > 0 && chapterIllustration && (
            <div className="mb-8">
              <BibleLineDrawing
                illustration={chapterIllustration}
                isLight={isLight}
                mode={isChildren ? 'children' : 'adult'}
              />
            </div>
          )}

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
                        navigateToReferenceString(ref, false);
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
                const typeShadows = getTypesAndShadowsForVerse(v.canonicalRef);
                const isSelected = selectedVerse === v.verse;
                const isReferenceOpen = isSelected && openPanelMode === 'reference';
                const isTypesOpen = isSelected && openPanelMode === 'types';
                const isActionOpen = isSelected && openPanelMode === 'action';
                const hasAnyIntel = refs.length > 0 || typeShadows.length > 0;
                const isCurrentlySpoken = speakingVerse === v.verse;
                const isBookmarked = bookmarks.includes(v.canonicalRef);
                const highlightColor = highlights[v.canonicalRef];
                const isRedLetterActive = Boolean(
                  v.isRedLetter && preferences.redLetterEnabled
                );

                // Straight left highlight border
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

                // Build one unified, coherent explanation for the passage
                const unifiedExplanationParagraphs = inlineContextData
                  ? [
                      ...inlineContextData.verseBreakdown.map((pt) =>
                        pt.replace(
                          /^(What Is Being Discussed|How Preceding Verses Lead Here|How It Ties Into the Whole Passage):\s*/i,
                          ''
                        )
                      ),
                    ]
                  : [];

                return (
                  <div
                    key={v.canonicalRef}
                    id={`verse-row-${v.verse}`}
                    className="space-y-2.5 scroll-mt-28"
                  >
                    {/* Section Subheading & Passage Illustration */}
                    {v.heading && (
                      <div className="space-y-3 pt-6 pb-2">
                        <h3
                          className={`${
                            isChildren ? 'font-sans not-italic text-amber-700 dark:text-amber-300' : 'font-serif italic'
                          } text-base sm:text-lg font-bold ${
                            !isChildren ? (isLight ? 'text-stone-700' : 'text-zinc-200') : ''
                          }`}
                        >
                          {v.heading}
                        </h3>
                        {(() => {
                          const secIll = getIllustrationForSection(currentBook, currentChapter, v.heading, v.verse);
                          if (secIll && v.verse > 1) {
                            return (
                              <div className="my-3">
                                <BibleLineDrawing
                                  illustration={secIll}
                                  isLight={isLight}
                                  mode={isChildren ? 'children' : 'adult'}
                                />
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}

                    {/* Clean Verse Block — Repositioned closer to header when selected */}
                    <div
                      onClick={() => {
                        if (isActionOpen && activeActionView === 'none') {
                          setSelectedVerse(null);
                          setOpenPanelMode('none');
                          setActiveActionView('none');
                        } else {
                          setSelectedVerse(v.verse);
                          setOpenPanelMode('action');
                          setActiveActionView('none');
                          scrollVerseToTop(v.verse);
                        }
                      }}
                      className={`group relative py-2.5 px-3 -mx-3 cursor-pointer transition ${
                        hasHighlight
                          ? highlightClass
                          : `rounded-2xl border-0 ${
                              isCurrentlySpoken
                                ? isLight
                                  ? 'bg-amber-100/90'
                                  : 'bg-amber-500/20'
                                : isSelected
                                ? isChildren
                                  ? isLight
                                    ? 'bg-amber-100/80 ring-2 ring-amber-400'
                                    : 'bg-indigo-900/70 ring-2 ring-amber-400'
                                  : isLight
                                  ? 'bg-stone-200/65 ring-1 ring-stone-300/80'
                                  : 'bg-[#1a1a1a] ring-1 ring-zinc-800'
                                : isChildren
                                ? isLight
                                  ? 'hover:bg-amber-50/80'
                                  : 'hover:bg-indigo-950/50'
                                : isLight
                                ? 'hover:bg-stone-200/35'
                                : 'hover:bg-[#151515]'
                            }`
                      }`}
                    >
                      <div
                        className={`${isChildren ? 'font-sans' : 'font-serif'} ${fontSizeClass} ${
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
                            isChildren
                              ? isLight
                                ? 'inline-flex items-center justify-center rounded-full bg-amber-200 text-amber-950 px-1.5 py-0.5 text-[10px]'
                                : 'inline-flex items-center justify-center rounded-full bg-indigo-800 text-amber-300 px-1.5 py-0.5 text-[10px]'
                              : isSelected
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

                        {/* Distinct Inline Indicators Alongside Verse Text: Reference & Type and Shadow */}
                        {hasAnyIntel && preferences.showReferenceBadges && (
                          <span className="inline-flex flex-wrap items-center gap-1.5 ml-2 align-middle">
                            {refs.length > 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isReferenceOpen) {
                                    setSelectedVerse(null);
                                    setOpenPanelMode('none');
                                  } else {
                                    openIndependentVersePanel(v, 'reference');
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
                                title={`Open Reference for ${v.canonicalRef}`}
                              >
                                <Link2 className="h-3 w-3" />
                                <span>Reference</span>
                              </button>
                            )}

                            {typeShadows.length > 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isTypesOpen) {
                                    setSelectedVerse(null);
                                    setOpenPanelMode('none');
                                  } else {
                                    openIndependentVersePanel(v, 'types');
                                  }
                                }}
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-sans text-[11px] font-semibold transition border ${
                                  isTypesOpen
                                    ? isLight
                                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                                      : 'bg-emerald-500 text-zinc-950 border-emerald-500 shadow-xs font-bold'
                                    : isLight
                                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200/90'
                                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border-emerald-500/30'
                                }`}
                                title={`Open Type and Shadow for ${v.canonicalRef}`}
                              >
                                <BookOpen className="h-3 w-3" />
                                <span>Type and Shadow</span>
                              </button>
                            )}
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
                        1. REFERENCE VIEW (Requirement 2A & Requirement 4)
                        Structure required by Section 2A:
                        1. Reference scripture (e.g. 1 Corinthians 10:4)
                        2. Full scripture text (complete actual Bible verse text)
                        3. Context (surrounding biblical context of that reference)
                        4. Supporting Text (other relevant scriptures that support or establish the connection)
                        ========================================================= */}
                    {isReferenceOpen && (
                      <div
                        className={`rounded-2xl border overflow-hidden mt-2 mb-2 flex flex-col max-h-[72vh] sm:max-h-[78vh] shadow-sm animate-in fade-in duration-150 ${
                          isLight
                            ? 'bg-white border-stone-200/90 text-stone-900'
                            : 'bg-[#171717] border-zinc-800 shadow-md text-zinc-100'
                        }`}
                      >
                        {/* Sticky Card Header: Category label, Actions, Close (X) button */}
                        <div
                          className={`sticky top-0 z-20 shrink-0 px-4 sm:px-5 py-3 flex items-center justify-between gap-3 border-b backdrop-blur-md ${
                            isLight
                              ? 'bg-white/95 border-stone-200/90'
                              : 'bg-[#171717]/95 border-zinc-800'
                          }`}
                        >
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded w-fit ${
                              isLight
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            Reference
                          </span>

                          {/* Top-Right Direct Save + Export + Close */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {refs.length > 0 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleDirectSaveReference(v, 0)}
                                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold border flex items-center gap-1 transition ${
                                    isLight
                                      ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                  }`}
                                  title="Save Reference"
                                >
                                  <BookmarkPlus className="h-3.5 w-3.5" />
                                  <span>Save</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleExportReferenceText(
                                      `${v.canonicalRef} — Reference`,
                                      refs
                                        .map((r) => {
                                          const rText =
                                            resolvedRefTexts[r.connectedRef] ||
                                            getVerseText(r.connectedRef, translation) ||
                                            '';
                                          return `${r.connectedRef} (${translation}): "${rText}"\nContext: ${
                                            r.biblicalContext || r.explanation || ''
                                          }`;
                                        })
                                        .join('\n\n')
                                    )
                                  }
                                  className={`rounded-lg p-1.5 border transition ${
                                    isLight
                                      ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                                  }`}
                                  title="Export Reference"
                                  aria-label="Export Reference"
                                >
                                  <Share2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}

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
                              aria-label="Close Reference"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Scrollable Card Body */}
                        <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-stone-200/90 dark:divide-zinc-800">
                          {refs.length === 0 ? (
                            <div className="px-4 sm:px-5 py-4 text-xs font-medium text-stone-500 dark:text-zinc-400">
                              No reference found.
                            </div>
                          ) : (
                            refs.map((r) => {
                              const supportKey = `ref-support-${r.id}`;
                              const isSupportingOpen = expandedSupportingRefId === supportKey;
                              const supportingList = (r.supportingRefs || []).filter(
                                (sup) => sup.toLowerCase() !== r.connectedRef.toLowerCase()
                              );
                              const refVerseText =
                                resolvedRefTexts[r.connectedRef] ||
                                getVerseText(r.connectedRef, translation) ||
                                'Loading scripture text...';
                              const contextText = r.biblicalContext || r.explanation;

                              return (
                                <div key={`inline-ref-${r.id}`} className="px-4 sm:px-5 py-4 space-y-3.5">
                                  {/* 1. Reference Scripture & 2. Full Scripture Text */}
                                  <div className="space-y-1.5">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        navigateToReferenceString(r.connectedRef, false)
                                      }
                                      className={`text-xs sm:text-sm font-bold hover:underline inline-flex items-center gap-1 text-left ${
                                        isLight ? 'text-amber-900' : 'text-amber-400'
                                      }`}
                                    >
                                      <span>
                                        {r.connectedRef} ({translation})
                                      </span>
                                    </button>
                                    <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-900 dark:text-zinc-100">
                                      “{refVerseText}”
                                    </p>
                                  </div>

                                  <div
                                    className={`h-px w-full ${
                                      isLight ? 'bg-stone-200/80' : 'bg-zinc-800'
                                    }`}
                                  />

                                  {/* 3. Context: Surrounding Biblical Context of That Reference */}
                                  {contextText && (
                                    <div className="space-y-1">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                                        Context
                                      </span>
                                      <p className="text-xs leading-relaxed text-stone-700 dark:text-zinc-300">
                                        {contextText}
                                      </p>
                                    </div>
                                  )}

                                  {/* 4. Supporting Text: Other Relevant Scriptures That Support or Establish the Connection */}
                                  {supportingList.length > 0 && (
                                    <div className="pt-1">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setExpandedSupportingRefId(
                                            isSupportingOpen ? null : supportKey
                                          )
                                        }
                                        className={`inline-flex items-center gap-1 text-xs font-semibold transition ${
                                          isLight
                                            ? 'text-stone-600 hover:text-stone-900'
                                            : 'text-zinc-400 hover:text-zinc-200'
                                        }`}
                                      >
                                        <span>
                                          Supporting Text ({supportingList.length})
                                        </span>
                                        {isSupportingOpen ? (
                                          <ChevronUp className="h-3.5 w-3.5" />
                                        ) : (
                                          <ChevronDown className="h-3.5 w-3.5" />
                                        )}
                                      </button>

                                      {isSupportingOpen && (
                                        <div className="mt-2.5 space-y-2.5 pl-3 border-l-2 border-stone-200 dark:border-zinc-800">
                                          {supportingList.map((supRef) => {
                                            const supText =
                                              resolvedRefTexts[supRef] ||
                                              getVerseText(supRef, translation);
                                            return (
                                              <div key={supRef} className="space-y-0.5">
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    navigateToReferenceString(supRef, false)
                                                  }
                                                  className={`text-xs font-bold hover:underline block text-left ${
                                                    isLight
                                                      ? 'text-amber-800'
                                                      : 'text-amber-400'
                                                  }`}
                                                >
                                                  {supRef}
                                                </button>
                                                {supText && (
                                                  <p className="text-xs font-serif leading-relaxed text-stone-700 dark:text-zinc-300">
                                                    “{supText}”
                                                  </p>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}

                    {/* =========================================================
                        2. TYPE AND SHADOW VIEW (Requirement 2B & Requirement 4)
                        Keeps existing Types and Shadows functionality unchanged.
                        Clicking Save saves the Type and Shadow directly, shows a toast,
                        and automatically closes the card.
                        ========================================================= */}
                    {isTypesOpen && (
                      <div
                        className={`rounded-2xl border overflow-hidden mt-2 mb-2 flex flex-col max-h-[72vh] sm:max-h-[78vh] shadow-sm animate-in fade-in duration-150 ${
                          isLight
                            ? 'bg-white border-stone-200/90 text-stone-900'
                            : 'bg-[#171717] border-zinc-800 shadow-md text-zinc-100'
                        }`}
                      >
                        {/* Sticky Card Header: Category label, Actions, Close (X) button */}
                        <div
                          className={`sticky top-0 z-20 shrink-0 px-4 sm:px-5 py-3 flex items-center justify-between gap-3 border-b backdrop-blur-md ${
                            isLight
                              ? 'bg-white/95 border-stone-200/90'
                              : 'bg-[#171717]/95 border-zinc-800'
                          }`}
                        >
                          <span
                            className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded w-fit ${
                              isLight
                                ? 'bg-emerald-100 text-emerald-900'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            Type and Shadow
                          </span>

                          {/* Top-Right Direct Save + Export + Close */}
                          <div className="flex items-center gap-1.5 shrink-0">
                            {typeShadows.length > 0 && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleDirectSaveTypeShadow(v, 0)}
                                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold border flex items-center gap-1 transition ${
                                    isLight
                                      ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                  }`}
                                  title="Save Type and Shadow"
                                >
                                  <BookmarkPlus className="h-3.5 w-3.5" />
                                  <span>Save</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleExportReferenceText(
                                      `${v.canonicalRef} — ${typeShadows[0].title}`,
                                      typeShadows
                                        .map(
                                          (ts) =>
                                            `Old Testament Type (${ts.otTypeRef}) -> New Testament Fulfilment (${ts.ntAntitypeRef}): ${ts.explanation}`
                                        )
                                        .join('\n\n')
                                    )
                                  }
                                  className={`rounded-lg p-1.5 border transition ${
                                    isLight
                                      ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                                  }`}
                                  title="Export Type and Shadow"
                                  aria-label="Export Type and Shadow"
                                >
                                  <Share2 className="h-3.5 w-3.5" />
                                </button>
                              </>
                            )}

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
                              aria-label="Close Type and Shadow"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Scrollable Card Body */}
                        <div className="flex-1 overflow-y-auto overscroll-contain">
                          {typeShadows.length === 0 ? (
                            <div className="px-4 sm:px-5 py-4 text-xs font-medium text-stone-500 dark:text-zinc-400">
                              No type and shadow found.
                            </div>
                          ) : (
                            typeShadows.map((ts, idx) => {
                            const supportKey = `ts-support-${ts.id}`;
                            const isSupportingOpen = expandedSupportingRefId === supportKey;
                            const supportingList = ts.supportingRefs || [];
                            const otText =
                              resolvedRefTexts[ts.otTypeRef] ||
                              getVerseText(ts.otTypeRef, translation);
                            const ntText =
                              resolvedRefTexts[ts.ntAntitypeRef] ||
                              getVerseText(ts.ntAntitypeRef, translation);

                            return (
                              <React.Fragment key={ts.id}>
                                {idx > 0 && (
                                  <div
                                    className={`h-px w-full ${
                                      isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
                                    }`}
                                  />
                                )}
                                <div className="px-4 sm:px-5 py-4 space-y-3.5">
                                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-zinc-100">
                                    {ts.title}
                                  </h4>

                                  {/* Old Testament Type */}
                                  <div className="space-y-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        navigateToReferenceString(ts.otTypeRef, false)
                                      }
                                      className={`text-xs font-bold hover:underline block text-left ${
                                        isLight ? 'text-amber-900' : 'text-amber-400'
                                      }`}
                                    >
                                      Old Testament Type — {ts.otTypeRef}
                                    </button>
                                    {otText && (
                                      <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                                        “{otText}”
                                      </p>
                                    )}
                                  </div>

                                  {/* New Testament Fulfilment */}
                                  <div className="space-y-1">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        navigateToReferenceString(ts.ntAntitypeRef, false)
                                      }
                                      className={`text-xs font-bold hover:underline block text-left ${
                                        isLight ? 'text-emerald-800' : 'text-emerald-400'
                                      }`}
                                    >
                                      New Testament Fulfilment — {ts.ntAntitypeRef}
                                    </button>
                                    {ntText && (
                                      <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                                        “{ntText}”
                                      </p>
                                    )}
                                  </div>

                                  {/* Horizontal Divider */}
                                  <div
                                    className={`h-px w-full ${
                                      isLight ? 'bg-stone-200/80' : 'bg-zinc-800'
                                    }`}
                                  />

                                  {/* Explanation of Biblical Symbolism & Fulfilment */}
                                  <p className="text-xs sm:text-[13px] leading-relaxed text-stone-700 dark:text-zinc-300">
                                    {ts.explanation}
                                  </p>

                                  {ts.biblicalContext && (
                                    <div className="pt-1 space-y-1">
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                                        Context
                                      </span>
                                      <p className="text-xs leading-relaxed text-stone-600 dark:text-zinc-400">
                                        {ts.biblicalContext}
                                      </p>
                                    </div>
                                  )}

                                  {supportingList.length > 0 && (
                                    <div className="pt-1">
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setExpandedSupportingRefId(
                                            isSupportingOpen ? null : supportKey
                                          )
                                        }
                                        className={`inline-flex items-center gap-1 text-xs font-semibold transition ${
                                          isLight
                                            ? 'text-stone-500 hover:text-stone-900'
                                            : 'text-zinc-400 hover:text-zinc-200'
                                        }`}
                                      >
                                        <span>
                                          Supporting Text ({supportingList.length})
                                        </span>
                                        {isSupportingOpen ? (
                                          <ChevronUp className="h-3.5 w-3.5" />
                                        ) : (
                                          <ChevronDown className="h-3.5 w-3.5" />
                                        )}
                                      </button>

                                      {isSupportingOpen && (
                                        <div className="mt-2.5 space-y-2 pl-2 border-l border-stone-200 dark:border-zinc-800">
                                          {supportingList.map((supRef) => {
                                            const supText =
                                              resolvedRefTexts[supRef] ||
                                              getVerseText(supRef, translation);
                                            return (
                                              <div key={supRef} className="space-y-0.5">
                                                <button
                                                  type="button"
                                                  onClick={() =>
                                                    navigateToReferenceString(supRef, false)
                                                  }
                                                  className={`text-xs font-bold hover:underline block text-left ${
                                                    isLight
                                                      ? 'text-amber-800'
                                                      : 'text-amber-400'
                                                  }`}
                                                >
                                                  {supRef}
                                                </button>
                                                {supText && (
                                                  <p className="text-xs font-serif leading-relaxed text-stone-600 dark:text-zinc-400">
                                                    “{supText}”
                                                  </p>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </React.Fragment>
                            );
                          })
                        )}
                        </div>
                      </div>
                    )}

                    {/* =========================================================
                        3. VERSE ACTION INTERFACE
                        - Available action buttons directly beneath selected verse
                        - Label renamed from Content to Context (Requirement 3)
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
                            {/* FIRST SECTION: Verse reference on left, Controls on top-right */}
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
                                    onClick={() => {
                                      setActiveActionView('save');
                                      scrollVerseToTop(v.verse);
                                    }}
                                    className={`rounded-lg p-1.5 border transition ${
                                      isLight
                                        ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                                        : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                    }`}
                                    title="Save Bible Verse"
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

                            <div
                              className={`h-px w-full ${
                                isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
                              }`}
                            />

                            {/* SECOND SECTION: Available actions directly beneath the selected verse */}
                            <div className="px-4 sm:px-5 py-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <button
                                onClick={() => openIndependentVersePanel(v, 'reference')}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border transition shrink-0 whitespace-nowrap ${
                                  isLight
                                    ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                }`}
                              >
                                Reference
                              </button>

                              <button
                                onClick={() => openIndependentVersePanel(v, 'types')}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border transition shrink-0 whitespace-nowrap ${
                                  isLight
                                    ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                }`}
                              >
                                Type and Shadow
                              </button>

                              {/* Requirement 3: Renamed Content to Context */}
                              <button
                                onClick={() => {
                                  setActiveActionView('context');
                                  scrollVerseToTop(v.verse);
                                }}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border transition shrink-0 whitespace-nowrap ${
                                  isLight
                                    ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                }`}
                              >
                                Context
                              </button>

                              <button
                                onClick={() => handleOpenCompareInline(v)}
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
                          /* FOCUSED VIEW: Context Explanation (Requirement 3 & Requirement 4) */
                          <div className="flex flex-col max-h-[72vh] sm:max-h-[78vh]">
                            {/* Sticky Card Header */}
                            <div
                              className={`sticky top-0 z-20 shrink-0 px-4 sm:px-5 py-3 flex items-center justify-between gap-3 border-b backdrop-blur-md ${
                                isLight
                                  ? 'bg-white/95 border-stone-200/90'
                                  : 'bg-[#171717]/95 border-zinc-800'
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded w-fit ${
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
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleDirectSaveContext(v)}
                                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold border flex items-center gap-1 transition ${
                                    isLight
                                      ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                                      : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                                  }`}
                                  title="Save Context"
                                >
                                  <BookmarkPlus className="h-3.5 w-3.5" />
                                  <span>Save</span>
                                </button>
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
                            </div>

                            {/* Scrollable Body */}
                            <div className="flex-1 overflow-y-auto overscroll-contain">
                              {isLoadingInlineContext || !inlineContextData ? (
                                <div className="px-4 sm:px-5 py-4 text-xs text-stone-500 dark:text-zinc-400">
                                  Loading passage context...
                                </div>
                              ) : (
                                <div className="px-4 sm:px-5 py-4 space-y-2">
                                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-zinc-100">
                                    {inlineContextData.mainTheme}
                                  </h4>
                                  <p className="text-xs sm:text-[13px] leading-relaxed text-stone-700 dark:text-zinc-300">
                                    {unifiedExplanationParagraphs.join(' ')}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : activeActionView === 'compare' ? (
                          /* FOCUSED VIEW: Compare Translation */
                          <div className="flex flex-col max-h-[72vh] sm:max-h-[78vh]">
                            {/* Sticky Card Header */}
                            <div
                              className={`sticky top-0 z-20 shrink-0 px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 border-b backdrop-blur-md ${
                                isLight
                                  ? 'bg-white/95 border-stone-200/90'
                                  : 'bg-[#171717]/95 border-zinc-800'
                              }`}
                            >
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

                            {/* Scrollable Body */}
                            <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-stone-200/90 dark:divide-zinc-800">
                              {BIBLE_TRANSLATIONS.map((t) => (
                                <div
                                  key={t.id}
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
                              ))}
                            </div>
                          </div>
                        ) : activeActionView === 'save' ? (
                          /* FOCUSED VIEW: Save Bible Verse (Requirement 4: No redundant content-type selection; auto-closes on save) */
                          <div className="flex flex-col max-h-[72vh] sm:max-h-[78vh]">
                            {/* Sticky Card Header */}
                            <div
                              className={`sticky top-0 z-20 shrink-0 px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 border-b backdrop-blur-md ${
                                isLight
                                  ? 'bg-white/95 border-stone-200/90'
                                  : 'bg-[#171717]/95 border-zinc-800'
                              }`}
                            >
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded w-fit ${
                                    isLight
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}
                                >
                                  Save Bible Verse
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

                            {/* Scrollable Body */}
                            <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-3.5 space-y-3">
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

                              {/* Save Button */}
                              <div className="flex items-center justify-end gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => handleSaveBibleVerse(v)}
                                  className={`rounded-xl px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 transition ${
                                    isLight
                                      ? 'bg-amber-700 hover:bg-amber-800 text-white'
                                      : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                                  }`}
                                >
                                  <BookmarkPlus className="h-3.5 w-3.5" />
                                  <span>Save</span>
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
