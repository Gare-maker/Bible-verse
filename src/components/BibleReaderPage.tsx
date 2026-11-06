'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  Bookmark,
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
  Compass,
  Copy,
  Globe,
  Link2,
  Pause,
  Play,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Volume2,
} from 'lucide-react';
import {
  BIBLE_BOOKS,
  BIBLE_TRANSLATIONS,
  BOOK_INTRODUCTIONS,
  findBookByName,
} from '@/data/bibleBooks';
import { getCrossReferencesForVerse } from '@/data/crossReferences';
import {
  fetchAllTranslationsForChapter,
  fetchChapterVerses,
} from '@/services/bibleService';
import { VerseData } from '@/types/bible';
import { usePlatform } from '@/context/PlatformContext';
import {
  getRankedHumanVoices,
  speakScriptureNaturally,
  stopHumanSpeech,
  VoiceOption,
} from '@/utils/naturalSpeech';
import BookChapterSelectorModal from './BookChapterSelectorModal';
import GlobalSearchModal from './GlobalSearchModal';
import ReferencePanelModal from './ReferencePanelModal';

export default function BibleReaderPage() {
  const {
    currentBook,
    currentChapter,
    translation,
    setTranslation,
    selectedVerse,
    setSelectedVerse,
    activeReferenceVerse,
    activeReferenceMode,
    openReferenceInspector,
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
    saveConnectionToNotes,
    createPersonalNote,
    showToast,
  } = usePlatform();

  const [verses, setVerses] = useState<VerseData[]>([]);
  const [isLoadingChapter, setIsLoadingChapter] = useState(false);
  const [isLoadingAllVersions, setIsLoadingAllVersions] = useState(false);

  const [isBookSelectorOpen, setIsBookSelectorOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDisplayMenuOpen, setIsDisplayMenuOpen] = useState(false);
  const [isTranslationMenuOpen, setIsTranslationMenuOpen] = useState(false);

  const [compareSingleVerseRef, setCompareSingleVerseRef] = useState<string | null>(null);
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
  // then load all 6 translations in the background so version comparison is always accurate
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

  useEffect(() => {
    stopHumanSpeech();
    setIsSpeaking(false);
    setSpeakingVerse(null);
    setCompareSingleVerseRef(null);
  }, [currentBook, currentChapter]);

  const handlePrevChapter = () => {
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
    if (currentChapter < currentBookObj.chapters) {
      navigateToPassage(currentBook, currentChapter + 1);
    } else {
      const nextBook = BIBLE_BOOKS.find((b) => b.id === currentBookObj.id + 1);
      if (nextBook) {
        navigateToPassage(nextBook.name, 1);
      }
    }
  };

  // Compute Next Chapter label for the bottom button
  const nextChapterLabel =
    currentChapter < currentBookObj.chapters
      ? `${currentBook} ${currentChapter + 1}`
      : BIBLE_BOOKS.find((b) => b.id === currentBookObj.id + 1)
      ? `${BIBLE_BOOKS.find((b) => b.id === currentBookObj.id + 1)!.name} 1`
      : `${currentBook} ${currentChapter}`;

  const handleToggleCompareSingleVerse = async (canonicalRef: string) => {
    if (compareSingleVerseRef === canonicalRef) {
      setCompareSingleVerseRef(null);
      return;
    }
    setCompareSingleVerseRef(canonicalRef);
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

  const handleQuickSaveVerse = (v: VerseData) => {
    const refs = getCrossReferencesForVerse(v.canonicalRef);
    if (refs.length > 0) {
      const first = refs[0];
      saveConnectionToNotes({
        title: first.title,
        primaryRef: first.primaryRef,
        connectedRef: first.connectedRef,
        translation,
        category: first.category,
        connectionLabel: first.connectionLabel,
        verificationStatus: first.verificationStatus,
      });
    } else {
      createPersonalNote({
        title: `${v.canonicalRef} (${translation})`,
        content: `"${v.translations[translation]}"`,
        scriptureRefs: [v.canonicalRef],
      });
    }
  };

  const fontSizeClass =
    preferences.fontSize === 'small'
      ? 'text-[16px] leading-[1.8]'
      : preferences.fontSize === 'large'
      ? 'text-[20px] leading-[1.9]'
      : preferences.fontSize === 'xlarge'
      ? 'text-[23px] leading-[1.95]'
      : 'text-[18px] leading-[1.85]';

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
    <div className="flex-1 flex flex-col lg:flex-row min-h-0">
      {/* =====================================================================
          MAIN BIBLE READING COLUMN
          ===================================================================== */}
      <div className="flex-1 min-w-0 flex flex-col pb-36 lg:pb-12">
        {/* Clean Single Top Reader Toolbar */}
        <div
          className={`sticky top-13 lg:top-0 z-20 h-13 border-b backdrop-blur-md px-3 sm:px-8 flex items-center justify-between transition-colors ${
            isLight
              ? 'bg-[#FBF9F5]/95 border-stone-200/80'
              : 'bg-[#0F0F0F]/95 border-zinc-800/80'
          }`}
        >
          {/* Left: Prev/Next Chapter + Book/Chapter Selector */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0">
            <button
              onClick={handlePrevChapter}
              className={`rounded-lg p-1.5 transition shrink-0 ${
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
              className={`rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 border transition truncate ${
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
              className={`rounded-lg p-1.5 transition shrink-0 ${
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

          {/* Right: Natural Voice Reader, Search, Typography, Translation Pill */}
          <div ref={toolbarMenuRef} className="flex items-center gap-1 sm:gap-1.5 relative shrink-0">
            <button
              onClick={() => handleToggleAudio()}
              className={`rounded-xl px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition ${
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
                  <Pause className="h-3.5 w-3.5" />
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
              className={`rounded-lg p-2 transition ${
                isLight
                  ? 'text-stone-600 hover:bg-stone-200/60'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
              title="Search Scriptures"
              aria-label="Search Scriptures"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Typography, Natural Voice & Display Settings — Constrained Inside Viewport */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsDisplayMenuOpen((prev) => !prev);
                  setIsTranslationMenuOpen(false);
                }}
                className={`rounded-lg p-2 transition ${
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
                  className={`fixed right-3 left-3 top-26 sm:left-auto sm:top-full sm:absolute sm:right-0 sm:mt-2 sm:w-72 max-w-[calc(100vw-1.5rem)] rounded-2xl border p-4 shadow-2xl z-50 space-y-4 ${
                    isLight
                      ? 'bg-white border-stone-200 text-stone-900'
                      : 'bg-[#1b1b1b] border-zinc-800 text-zinc-100'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-stone-200/70 dark:border-zinc-800 pb-2">
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

                  {/* Theme */}
                  <div className="space-y-1.5">
                    <span className="text-xs text-stone-500">Theme</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => updatePreferences({ theme: 'light' })}
                        className={`rounded-xl py-2 text-xs font-bold border transition ${
                          preferences.theme === 'light'
                            ? 'bg-[#FBF9F5] border-amber-700 text-amber-900'
                            : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                        }`}
                      >
                        Paper Light
                      </button>
                      <button
                        onClick={() => updatePreferences({ theme: 'dark' })}
                        className={`rounded-xl py-2 text-xs font-bold border transition ${
                          preferences.theme === 'dark'
                            ? 'bg-zinc-900 border-amber-500 text-amber-300'
                            : 'bg-stone-100 border-stone-200 text-stone-600'
                        }`}
                      >
                        Midnight Dark
                      </button>
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-1.5">
                    <span className="text-xs text-stone-500">Text Size</span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['small', 'medium', 'large', 'xlarge'] as const).map((sz) => (
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
                          {sz === 'xlarge' ? 'XL' : sz.slice(0, 1)}
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

            {/* Translation Selector Pill — Compact Name-Only Dropdown (No Subtext, Stays Inside Screen) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsTranslationMenuOpen((prev) => !prev);
                  setIsDisplayMenuOpen(false);
                }}
                className={`rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 border transition ${
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
                      <span className="truncate">
                        <strong className={isLight ? 'text-amber-800' : 'text-amber-400'}>
                          {t.abbreviation}
                        </strong>{' '}
                        — {t.name}
                      </span>
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

        {/* Return to Previous Reading Position Banner */}
        {previousReadingPosition && (
          <div className="mx-auto w-full max-w-2xl px-6 mt-4">
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
        <main className="mx-auto w-full max-w-2xl px-5 sm:px-10 pt-8 sm:pt-10 pb-12">
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
              <div className="space-y-1.5 border-b border-stone-200/80 dark:border-zinc-800 pb-4">
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
                        openReferenceInspector(ref, 'reference');
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
            <div className="space-y-3.5">
              {verses.map((v) => {
                const refs = getCrossReferencesForVerse(v.canonicalRef);
                const isSelected = selectedVerse === v.verse;
                const isInspected = activeReferenceVerse === v.canonicalRef;
                const isCurrentlySpoken = speakingVerse === v.verse;
                const isBookmarked = bookmarks.includes(v.canonicalRef);
                const highlightColor = highlights[v.canonicalRef];
                const isRedLetterActive = Boolean(
                  v.isRedLetter && preferences.redLetterEnabled
                );

                const highlightClass =
                  highlightColor === 'amber'
                    ? isLight
                      ? 'bg-amber-100/70 border-l-3 border-amber-600 pl-3'
                      : 'bg-amber-500/15 border-l-2 border-amber-400 pl-3'
                    : highlightColor === 'emerald'
                    ? isLight
                      ? 'bg-emerald-100/60 border-l-3 border-emerald-600 pl-3'
                      : 'bg-emerald-500/15 border-l-2 border-emerald-400 pl-3'
                    : highlightColor === 'blue'
                    ? isLight
                      ? 'bg-sky-100/60 border-l-3 border-sky-600 pl-3'
                      : 'bg-blue-500/15 border-l-2 border-blue-400 pl-3'
                    : '';

                return (
                  <div key={v.canonicalRef} className="space-y-2">
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
                      onClick={() => setSelectedVerse(isSelected ? null : v.verse)}
                      className={`group relative rounded-xl py-2 px-3 -mx-3 cursor-pointer transition ${
                        isCurrentlySpoken
                          ? isLight
                            ? 'bg-amber-100/90 ring-2 ring-amber-600/50'
                            : 'bg-amber-500/20 ring-2 ring-amber-400/50'
                          : isSelected || isInspected
                          ? isLight
                            ? 'bg-white shadow-xs ring-1 ring-amber-700/30'
                            : 'bg-[#181818] ring-1 ring-amber-500/40'
                          : isLight
                          ? 'hover:bg-stone-200/35'
                          : 'hover:bg-[#151515]'
                      } ${highlightClass}`}
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
                            isLight ? 'text-stone-400' : 'text-zinc-500'
                          }`}
                        >
                          {v.verse}
                        </sup>
                        <span>{v.translations[translation] || v.translations.NIV}</span>

                        {/* Neat, Unobtrusive Reference Pill */}
                        {refs.length > 0 && preferences.showReferenceBadges && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openReferenceInspector(v.canonicalRef, 'reference');
                            }}
                            className={`ml-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-sans text-[11px] font-semibold align-middle transition border ${
                              isInspected
                                ? isLight
                                  ? 'bg-amber-700 text-white border-amber-700'
                                  : 'bg-amber-500 text-zinc-950 border-amber-500'
                                : isLight
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200/90'
                                : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30'
                            }`}
                            title={`View ${refs.length} biblical cross-reference(s)`}
                          >
                            <Link2 className="h-3 w-3" />
                            <span>
                              {refs.length} {refs.length === 1 ? 'Reference' : 'References'}
                            </span>
                          </button>
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

                    {/* Sleek Contextual Verse Toolbar (When Verse is Selected) */}
                    {isSelected && (
                      <div
                        className={`rounded-2xl border p-3.5 space-y-3 animate-in fade-in duration-150 ${
                          isLight
                            ? 'bg-white border-stone-200/90 shadow-md'
                            : 'bg-[#181818] border-zinc-800 shadow-xl'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-bold ${
                                isLight ? 'text-amber-800' : 'text-amber-400'
                              }`}
                            >
                              {v.canonicalRef} ({translation})
                            </span>
                            {refs.length > 0 && (
                              <span className="text-[11px] text-stone-400">
                                • Linked to {refs.map((r) => r.connectedRef).join(', ')}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleAudio(v.verse)}
                              className={`rounded-lg px-2 py-1 text-[11px] font-semibold flex items-center gap-1 border mr-1 ${
                                isLight
                                  ? 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                                  : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                              }`}
                              title="Read from this verse with natural voice"
                            >
                              <Volume2 className="h-3 w-3" />
                              <span>Read Aloud</span>
                            </button>

                            {(['amber', 'emerald', 'blue'] as const).map((col) => (
                              <button
                                key={col}
                                onClick={() =>
                                  setVerseHighlight(
                                    v.canonicalRef,
                                    highlightColor === col ? null : col
                                  )
                                }
                                className={`h-4 w-4 rounded-full border ${
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
                              />
                            ))}
                            <button
                              onClick={() => toggleBookmark(v.canonicalRef)}
                              className={`ml-1.5 rounded-lg p-1 text-xs ${
                                isBookmarked
                                  ? isLight
                                    ? 'text-amber-700'
                                    : 'text-amber-400'
                                  : 'text-stone-400 hover:text-stone-700'
                              }`}
                              title="Bookmark Verse"
                            >
                              <Bookmark className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            onClick={() =>
                              openReferenceInspector(v.canonicalRef, 'reference')
                            }
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition ${
                              isLight
                                ? 'bg-amber-700 hover:bg-amber-800 text-white'
                                : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                            }`}
                          >
                            <Link2 className="h-3.5 w-3.5" />
                            <span>
                              View References {refs.length > 0 ? `(${refs.length})` : ''}
                            </span>
                          </button>

                          <button
                            onClick={() =>
                              openReferenceInspector(v.canonicalRef, 'context')
                            }
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 border transition ${
                              isLight
                                ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                                : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                            }`}
                          >
                            <Compass className="h-3.5 w-3.5" />
                            <span>Verse Context</span>
                          </button>

                          <button
                            onClick={() => openReferenceInspector(v.canonicalRef, 'ai')}
                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                              isLight
                                ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-800'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                            }`}
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Explain with AI</span>
                          </button>

                          <button
                            onClick={() => handleToggleCompareSingleVerse(v.canonicalRef)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                              compareSingleVerseRef === v.canonicalRef
                                ? isLight
                                  ? 'bg-stone-900 text-white border-stone-900'
                                  : 'bg-zinc-100 text-zinc-900 border-zinc-100'
                                : isLight
                                ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                            }`}
                          >
                            <ArrowLeftRight className="h-3.5 w-3.5" />
                            <span>Compare Translations</span>
                          </button>

                          <button
                            onClick={() => handleQuickSaveVerse(v)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                              isLight
                                ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                            }`}
                          >
                            <BookmarkPlus className="h-3.5 w-3.5" />
                            <span>Save to Notes</span>
                          </button>

                          <button
                            onClick={() => handleCopyVerse(v)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                              isLight
                                ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                            }`}
                          >
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                          </button>
                        </div>

                        {/* Inline 6-Version Comparison Grid — Each Version Has Its Authentic Scripture */}
                        {compareSingleVerseRef === v.canonicalRef && (
                          <div className="pt-3 border-t border-stone-200/80 dark:border-zinc-800 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                                Comparing All 6 Versions for {v.canonicalRef}
                              </span>
                              {isLoadingAllVersions && (
                                <span className="text-[11px] text-amber-700 dark:text-amber-400 animate-pulse">
                                  Loading exact translations...
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {BIBLE_TRANSLATIONS.map((t) => (
                                <div
                                  key={t.id}
                                  onClick={() => setTranslation(t.id)}
                                  className={`cursor-pointer rounded-xl p-2.5 border text-xs transition ${
                                    translation === t.id
                                      ? isLight
                                        ? 'bg-amber-50/70 border-amber-300 text-stone-900'
                                      : 'bg-amber-500/10 border-amber-500/40 text-zinc-100'
                                      : isLight
                                      ? 'bg-stone-50 border-stone-200/80 text-stone-700 hover:border-stone-300'
                                      : 'bg-[#121212] border-zinc-800 text-zinc-300'
                                  }`}
                                >
                                  <span
                                    className={`font-bold block mb-0.5 ${
                                      isLight ? 'text-amber-800' : 'text-amber-400'
                                    }`}
                                  >
                                    {t.abbreviation} — {t.name}
                                  </span>
                                  <p className="font-serif leading-relaxed">
                                    “{v.translations[t.id]}”
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Prominent End-of-Chapter Navigation Footer (Click Next Chapter at the Bottom) */}
          <div
            className={`mt-12 pt-6 border-t flex items-center justify-between gap-3 ${
              isLight ? 'border-stone-200/80' : 'border-zinc-800/80'
            }`}
          >
            <button
              onClick={handlePrevChapter}
              className={`rounded-2xl border px-4 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition ${
                isLight
                  ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700 shadow-xs'
                  : 'bg-[#161616] hover:bg-zinc-800 border-zinc-800 text-zinc-200'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous Chapter</span>
            </button>

            <button
              onClick={handleNextChapter}
              className={`rounded-2xl px-5 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition shadow-sm ${
                isLight
                  ? 'bg-amber-700 hover:bg-amber-800 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
              }`}
            >
              <span>Next Chapter ({nextChapterLabel})</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </main>
      </div>

      {/* =====================================================================
          MOBILE FLOATING CHAPTER & AUDIO BAR (Close to Bottom Nav Bar while Scrolling)
          Matches Reference Screenshots 1, 2, 3, 4
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

      {/* =====================================================================
          CONNECTED RIGHT-HAND CONTEXTUAL REFERENCE & CHAPTER CONTEXT INSPECTOR
          ===================================================================== */}
      <ReferencePanelModal
        isOpen={Boolean(activeReferenceVerse)}
        primaryRef={activeReferenceVerse}
        initialMode={activeReferenceMode}
        onClose={() => openReferenceInspector(null)}
      />

      {/* Modals */}
      <BookChapterSelectorModal
        isOpen={isBookSelectorOpen}
        onClose={() => setIsBookSelectorOpen(false)}
      />

      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onOpenReferencePanel={(ref) => openReferenceInspector(ref, 'reference')}
      />
    </div>
  );
}
