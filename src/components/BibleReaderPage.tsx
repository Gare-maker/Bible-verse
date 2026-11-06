'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  Bookmark,
  BookmarkCheck,
  BookmarkPlus,
  BookOpen,
  ChevronLeft,
  ChevronRight,
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
import { getCrossReferencesForVerse } from '@/data/crossReferences';
import { getVerseText } from '@/data/scriptureDatabase';
import {
  buildVerseContextData,
  fetchAllTranslationsForChapter,
  fetchChapterVerses,
  resolveScriptureVerse,
} from '@/services/bibleService';
import { VerseContextData, VerseData } from '@/types/bible';
import { usePlatform } from '@/context/PlatformContext';
import {
  getRankedHumanVoices,
  speakScriptureNaturally,
  stopHumanSpeech,
  VoiceOption,
} from '@/utils/naturalSpeech';
import BookChapterSelectorModal from './BookChapterSelectorModal';
import GlobalSearchModal from './GlobalSearchModal';

type InlineSectionTab = 'overview' | 'compare' | 'save';

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

  // Inline expanded verse state
  const [inlineTab, setInlineTab] = useState<InlineSectionTab>('overview');
  const [inlineContextData, setInlineContextData] = useState<VerseContextData | null>(null);
  const [isLoadingInlineContext, setIsLoadingInlineContext] = useState(false);
  const [resolvedRefTexts, setResolvedRefTexts] = useState<Record<string, string>>({});

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

  useEffect(() => {
    stopHumanSpeech();
    setIsSpeaking(false);
    setSpeakingVerse(null);
  }, [currentBook, currentChapter]);

  // Whenever selectedVerse changes, load its inline context and connected reference texts
  useEffect(() => {
    if (!selectedVerse || currentChapter === 0) {
      setInlineContextData(null);
      return;
    }
    const canonicalRef = `${currentBook} ${currentChapter}:${selectedVerse}`;
    const refs = getCrossReferencesForVerse(canonicalRef);

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

    // Resolve connected scripture texts in current translation
    if (refs.length > 0) {
      Promise.all(
        refs.map(async (r) => {
          const res = await resolveScriptureVerse(r.connectedRef, translation);
          return {
            ref: r.connectedRef,
            text: res?.text || getVerseText(r.connectedRef, translation),
          };
        })
      ).then((items) => {
        if (!active) return;
        const map: Record<string, string> = {};
        for (const item of items) {
          map[item.ref] = item.text;
        }
        setResolvedRefTexts(map);
      });
    } else {
      setResolvedRefTexts({});
    }

    return () => {
      active = false;
    };
  }, [selectedVerse, currentBook, currentChapter, translation]);

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

  const handleOpenCompareInline = async () => {
    setInlineTab(inlineTab === 'compare' ? 'overview' : 'compare');
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
    <div className="flex-1 flex flex-col min-h-0">
      {/* =====================================================================
          MAIN BIBLE READING COLUMN
          ===================================================================== */}
      <div className="flex-1 min-w-0 flex flex-col pb-32 lg:pb-16">
        {/* Top Reader Toolbar — Adjusted Top & Bottom Padding */}
        <div
          className={`sticky top-14 lg:top-0 z-20 py-3.5 sm:py-4 px-4 sm:px-8 backdrop-blur-md flex items-center justify-between transition-colors shadow-2xs ${
            isLight
              ? 'bg-[#FBF9F5]/95 text-stone-900'
              : 'bg-[#0F0F0F]/95 text-zinc-100'
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
                const isSelected = selectedVerse === v.verse;
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
                  <div key={v.canonicalRef} className="space-y-2.5">
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
                        if (isSelected) {
                          setSelectedVerse(null);
                        } else {
                          setInlineTab('overview');
                          setSelectedVerse(v.verse);
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
                                  ? 'bg-stone-200/55'
                                  : 'bg-[#1a1a1a]'
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
                            isLight ? 'text-stone-400' : 'text-zinc-500'
                          }`}
                        >
                          {v.verse}
                        </sup>
                        <span>{v.translations[translation] || v.translations.NIV}</span>

                        {/* Neat Reference Pill — Expands Inline Underneath Verse */}
                        {refs.length > 0 && preferences.showReferenceBadges && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setInlineTab('overview');
                              setSelectedVerse(isSelected ? null : v.verse);
                            }}
                            className={`ml-2.5 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-sans text-[11px] font-semibold align-middle transition border ${
                              isSelected
                                ? isLight
                                  ? 'bg-amber-700 text-white border-amber-700'
                                  : 'bg-amber-500 text-zinc-950 border-amber-500'
                                : isLight
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200/90'
                                : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30'
                            }`}
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

                    {/* =========================================================
                        INLINE EXPANDED CONTENT & ACTIONS UNDERNEATH CLICKED VERSE
                        (On Both Mobile & Desktop — No Popup!)
                        ========================================================= */}
                    {isSelected && (
                      <div
                        className={`rounded-2xl border p-4 sm:p-5 space-y-4 animate-in fade-in duration-150 ${
                          isLight
                            ? 'bg-white border-stone-200/90 shadow-md text-stone-900'
                            : 'bg-[#171717] border-zinc-800 shadow-xl text-zinc-100'
                        }`}
                      >
                        {/* Top Action Bar: Verse Reference, Color/Collection Section, Speaker Icon, Copy, Compare, Save, and X Close Icon */}
                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            {/* Verse Reference Badge */}
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-sm font-bold tracking-tight ${
                                  isLight ? 'text-amber-900' : 'text-amber-400'
                                }`}
                              >
                                {v.canonicalRef} ({translation})
                              </span>
                              <span
                                className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                                  refs.length > 0
                                    ? isLight
                                      ? 'bg-amber-100 text-amber-900'
                                      : 'bg-amber-500/15 text-amber-300'
                                    : isLight
                                    ? 'bg-stone-100 text-stone-500'
                                    : 'bg-zinc-800 text-zinc-400'
                                }`}
                              >
                                {refs.length > 0
                                  ? `${refs.length} ${
                                      refs.length === 1 ? 'Reference' : 'References'
                                    }`
                                  : 'No reference found'}
                              </span>
                            </div>

                            {/* Right Controls: Highlight Colors, Speaker Icon (Read Aloud), Bookmark, X Close */}
                            <div className="flex items-center gap-2">
                              {/* Color Highlight Section */}
                              <div className="flex items-center gap-1.5 mr-1">
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
                              </div>

                              {/* Read Aloud Represented by Speaker Icon (Without "Explain with AI") */}
                              <button
                                onClick={() => handleToggleAudio(v.verse)}
                                className={`rounded-xl p-2 border transition ${
                                  isCurrentlySpoken
                                    ? isLight
                                      ? 'bg-amber-700 border-amber-700 text-white'
                                      : 'bg-amber-500 border-amber-500 text-zinc-950'
                                    : isLight
                                    ? 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                                    : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700'
                                }`}
                                title="Read Aloud"
                                aria-label="Read Aloud"
                              >
                                <Volume2 className="h-4 w-4" />
                              </button>

                              {/* Bookmark */}
                              <button
                                onClick={() => toggleBookmark(v.canonicalRef)}
                                className={`rounded-xl p-2 border transition ${
                                  isBookmarked
                                    ? isLight
                                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                                      : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                                    : isLight
                                    ? 'bg-stone-50 border-stone-200 text-stone-500 hover:text-stone-800'
                                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-100'
                                }`}
                                title="Bookmark Verse"
                                aria-label="Bookmark Verse"
                              >
                                <Bookmark className="h-4 w-4" />
                              </button>

                              {/* "X" Icon to Close Inline Expanded View */}
                              <button
                                onClick={() => setSelectedVerse(null)}
                                className={`rounded-xl p-2 border transition ${
                                  isLight
                                    ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-600'
                                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                                }`}
                                title="Close"
                                aria-label="Close expanded verse view"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Grouped Active Action Buttons */}
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => setInlineTab('overview')}
                              className={`rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 border transition ${
                                inlineTab === 'overview'
                                  ? isLight
                                    ? 'bg-amber-700 border-amber-700 text-white'
                                    : 'bg-amber-500 border-amber-500 text-zinc-950'
                                  : isLight
                                  ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                              }`}
                            >
                              <Compass className="h-3.5 w-3.5" />
                              <span>References & Context</span>
                            </button>

                            <button
                              onClick={handleOpenCompareInline}
                              className={`rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 border transition ${
                                inlineTab === 'compare'
                                  ? isLight
                                    ? 'bg-stone-900 border-stone-900 text-white'
                                    : 'bg-zinc-100 border-zinc-100 text-zinc-900'
                                  : isLight
                                  ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                              }`}
                            >
                              <ArrowLeftRight className="h-3.5 w-3.5" />
                              <span>Compare Translation</span>
                            </button>

                            <button
                              onClick={() =>
                                setInlineTab(inlineTab === 'save' ? 'overview' : 'save')
                              }
                              className={`rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 border transition ${
                                inlineTab === 'save'
                                  ? isLight
                                    ? 'bg-emerald-700 border-emerald-700 text-white'
                                    : 'bg-emerald-500 border-emerald-500 text-zinc-950'
                                  : isLight
                                  ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                              }`}
                            >
                              <BookmarkPlus className="h-3.5 w-3.5" />
                              <span>Save & Add Note</span>
                            </button>

                            <button
                              onClick={() => handleCopyVerse(v)}
                              className={`rounded-xl px-3.5 py-2 text-xs font-semibold flex items-center gap-1.5 border transition ${
                                isLight
                                  ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                              }`}
                            >
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy</span>
                            </button>
                          </div>
                        </div>

                        {/* Clean Divider Line Separating Action Buttons From Expanded Content */}
                        <div
                          className={`h-px w-full ${
                            isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
                          }`}
                        />

                        {/* =====================================================
                            VIEW 1: REFERENCES & VERSE CONTEXT (DEFAULT)
                            ===================================================== */}
                        {inlineTab === 'overview' && (
                          <div className="space-y-4">
                            {/* 1. Scriptural References Section */}
                            <div className="space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                    isLight ? 'text-amber-800' : 'text-amber-400'
                                  }`}
                                >
                                  <Link2 className="h-3.5 w-3.5" />
                                  <span>Scriptural References</span>
                                </span>
                              </div>

                              {refs.length === 0 ? (
                                <div
                                  className={`rounded-xl border p-3.5 text-xs font-medium ${
                                    isLight
                                      ? 'bg-stone-50 border-stone-200/90 text-stone-500'
                                      : 'bg-[#121212] border-zinc-800 text-zinc-400'
                                  }`}
                                >
                                  No reference found
                                </div>
                              ) : (
                                <div className="space-y-2.5">
                                  {refs.map((refItem) => {
                                    const connText =
                                      resolvedRefTexts[refItem.connectedRef] ||
                                      getVerseText(refItem.connectedRef, translation);
                                    return (
                                      <div
                                        key={refItem.id}
                                        className={`rounded-xl border p-3.5 space-y-2 ${
                                          isLight
                                            ? 'bg-amber-50/40 border-amber-200/80'
                                            : 'bg-[#1d1b16] border-amber-500/30'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold">
                                              {refItem.connectedRef}
                                            </span>
                                            <span
                                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                                                isLight
                                                  ? 'bg-amber-700 text-white'
                                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                              }`}
                                            >
                                              {refItem.category}
                                            </span>
                                          </div>

                                          <div className="flex items-center gap-1.5">
                                            <button
                                              onClick={() =>
                                                navigateToReferenceString(
                                                  refItem.connectedRef,
                                                  true
                                                )
                                              }
                                              className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1 transition ${
                                                isLight
                                                  ? 'bg-white hover:bg-stone-100 border-stone-300 text-stone-800'
                                                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-100'
                                              }`}
                                            >
                                              <BookOpen className="h-3 w-3" />
                                              <span>Open {refItem.connectedRef}</span>
                                              <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                                            </button>
                                          </div>
                                        </div>

                                        <p className="text-xs font-semibold text-stone-500 dark:text-zinc-400">
                                          {refItem.title}
                                        </p>

                                        <p
                                          className={`font-serif text-sm leading-relaxed rounded-xl border p-3 ${
                                            isLight
                                              ? 'bg-white border-stone-200/80 text-stone-900'
                                              : 'bg-[#121212] border-zinc-800 text-zinc-100'
                                          }`}
                                        >
                                          “{connText}”
                                        </p>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>

                            {/* 2. Verse Context Section (Direct Main Theme & Breakdown) */}
                            <div className="space-y-2.5">
                              <span
                                className={`text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                  isLight ? 'text-amber-800' : 'text-amber-400'
                                }`}
                              >
                                <Compass className="h-3.5 w-3.5" />
                                <span>Verse Context & Breakdown</span>
                              </span>

                              {isLoadingInlineContext || !inlineContextData ? (
                                <div
                                  className={`rounded-xl border p-4 text-xs ${
                                    isLight
                                      ? 'bg-stone-50 border-stone-200 text-stone-500'
                                      : 'bg-[#121212] border-zinc-800 text-zinc-400'
                                  }`}
                                >
                                  Loading verse context breakdown...
                                </div>
                              ) : (
                                <div
                                  className={`rounded-xl border p-4 space-y-3 ${
                                    isLight
                                      ? 'bg-stone-50/90 border-stone-200/90 text-stone-800'
                                      : 'bg-[#121212] border-zinc-800 text-zinc-200'
                                  }`}
                                >
                                  <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                                      Main Theme of {v.canonicalRef}
                                    </span>
                                    <h4 className="text-sm font-bold mt-0.5">
                                      {inlineContextData.mainTheme}
                                    </h4>
                                  </div>

                                  <div
                                    className={`h-px w-full ${
                                      isLight ? 'bg-stone-200/80' : 'bg-zinc-800'
                                    }`}
                                  />

                                  <div className="space-y-2">
                                    {inlineContextData.verseBreakdown.map((point, idx) => (
                                      <div
                                        key={idx}
                                        className={`rounded-xl border p-3 text-xs leading-relaxed ${
                                          isLight
                                            ? 'bg-white border-stone-200/80 text-stone-700'
                                            : 'bg-[#181818] border-zinc-800 text-zinc-300'
                                        }`}
                                      >
                                        {point}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* =====================================================
                            VIEW 2: COMPARE TRANSLATIONS SIDE-BY-SIDE
                            ===================================================== */}
                        {inlineTab === 'compare' && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[11px] font-bold uppercase tracking-wider ${
                                  isLight ? 'text-amber-800' : 'text-amber-400'
                                }`}
                              >
                                Side-by-Side Translation Comparison ({v.canonicalRef})
                              </span>
                              <div className="flex items-center gap-2">
                                {isLoadingAllVersions && (
                                  <span className="text-[11px] text-amber-700 dark:text-amber-400 animate-pulse">
                                    Loading translations...
                                  </span>
                                )}
                                <button
                                  onClick={() => setInlineTab('overview')}
                                  className={`rounded-lg p-1 border text-xs ${
                                    isLight
                                      ? 'bg-stone-100 border-stone-200 text-stone-600'
                                      : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                                  }`}
                                  title="Close Compare Translations"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Side-by-side grid lining up all 6 translations so you can read all of them at once */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                              {BIBLE_TRANSLATIONS.map((t) => (
                                <div
                                  key={t.id}
                                  onClick={() => setTranslation(t.id)}
                                  className={`cursor-pointer rounded-xl p-3 border text-xs flex flex-col justify-between transition ${
                                    translation === t.id
                                      ? isLight
                                        ? 'bg-amber-50/80 border-amber-400 text-stone-900 shadow-2xs'
                                        : 'bg-amber-500/15 border-amber-500/50 text-zinc-100'
                                      : isLight
                                      ? 'bg-stone-50 border-stone-200/90 text-stone-800 hover:bg-stone-100/80'
                                      : 'bg-[#121212] border-zinc-800 text-zinc-200 hover:bg-zinc-800/60'
                                  }`}
                                >
                                  <div>
                                    <div className="flex items-center justify-between mb-1.5">
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
                                    <p className="font-serif text-sm leading-relaxed">
                                      “{v.translations[t.id]}”
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* =====================================================
                            VIEW 3: SAVE TO SAVED & SHARE TO COMMUNITY (WITH NOTES)
                            ===================================================== */}
                        {inlineTab === 'save' && (
                          <div
                            className={`rounded-xl border p-4 space-y-3.5 ${
                              isLight
                                ? 'bg-stone-50/90 border-stone-200'
                                : 'bg-[#121212] border-zinc-800'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold">
                                Save Discovery & Add Personal Notes
                              </span>
                              <button
                                onClick={() => setInlineTab('overview')}
                                className="rounded-lg p-1 text-stone-400 hover:text-stone-700"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* What to Save: Connection, Context, or Bible Verse */}
                            <div className="grid grid-cols-3 gap-2">
                              <button
                                type="button"
                                onClick={() => setSaveTargetType('verse')}
                                className={`rounded-xl py-2 px-2.5 text-xs font-bold border transition ${
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
                                className={`rounded-xl py-2 px-2.5 text-xs font-bold border transition ${
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
                                className={`rounded-xl py-2 px-2.5 text-xs font-bold border transition ${
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
                                <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                                  Select Connected Reference
                                </label>
                                <select
                                  value={selectedRefIdxForSave}
                                  onChange={(e) =>
                                    setSelectedRefIdxForSave(Number(e.target.value))
                                  }
                                  className={`w-full rounded-xl border px-3 py-2 text-xs ${
                                    isLight
                                      ? 'bg-white border-stone-300 text-stone-900'
                                      : 'bg-zinc-900 border-zinc-700 text-white'
                                  }`}
                                >
                                  {refs.map((r, i) => (
                                    <option key={r.id} value={i}>
                                      {v.canonicalRef} ↔ {r.connectedRef} ({r.title})
                                    </option>
                                  ))}
                                </select>
                              </div>
                            )}

                            {/* Collection Selector */}
                            <div>
                              <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                                Collection
                              </label>
                              <select
                                value={selectedCollectionId}
                                onChange={(e) => setSelectedCollectionId(e.target.value)}
                                className={`w-full rounded-xl border px-3 py-2 text-xs font-medium ${
                                  isLight
                                    ? 'bg-white border-stone-300 text-stone-800'
                                    : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                                }`}
                              >
                                {collections.map((col) => (
                                  <option key={col.id} value={col.id}>
                                    {col.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Personal Notes & Insights */}
                            <div>
                              <label className="text-[11px] font-semibold text-stone-500 block mb-1">
                                Personal Notes & Reflections
                              </label>
                              <textarea
                                rows={3}
                                value={personalNoteDraft}
                                onChange={(e) => setPersonalNoteDraft(e.target.value)}
                                placeholder="Write your personal notes, reflections, and insights on this scripture..."
                                className={`w-full rounded-xl border p-3 text-xs focus:outline-none ${
                                  isLight
                                    ? 'bg-white border-stone-300 text-stone-900 placeholder-stone-400'
                                    : 'bg-zinc-900 border-zinc-700 text-white placeholder-zinc-500'
                                }`}
                              />
                            </div>

                            {/* Personal Save vs Share to Community Toggle */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={shareToCommunity}
                                  onChange={(e) => setShareToCommunity(e.target.checked)}
                                  className="h-4 w-4 accent-amber-700 rounded"
                                />
                                <Share2 className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                                <span>Share with notes to Community</span>
                              </label>

                              <button
                                type="button"
                                onClick={() => handleSaveFromInline(v)}
                                className={`rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition ${
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
                                    <span>
                                      {shareToCommunity
                                        ? 'Saved & Shared to Community!'
                                        : 'Saved to My Saved!'}
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <BookmarkPlus className="h-3.5 w-3.5" />
                                    <span>
                                      {shareToCommunity
                                        ? 'Save & Share to Community'
                                        : 'Save to My Saved'}
                                    </span>
                                  </>
                                )}
                              </button>
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
