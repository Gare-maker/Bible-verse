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
  Languages,
  GraduationCap,
  ExternalLink,
  ArrowRight,
  X,
} from 'lucide-react';
import {
  BIBLE_BOOKS,
  BIBLE_TRANSLATIONS,
  BOOK_INTRODUCTIONS,
  findBookByName,
  parseScriptureReference,
} from '@/data/bibleBooks';
import { getVerseContextExplanation } from '@/data/verseContexts';
import {
  getCrossReferencesForVerse,
  getTypesAndShadowsForVerse,
  registerRuntimeCrossReferences,
} from '@/data/crossReferences';
import { findSectionForVerse } from '@/data/chapterSections';
import { getVerseText } from '@/data/scriptureDatabase';
import { getContextualInterpretation } from '@/data/scriptureInterpretations';
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
import ScriptureDetailModal from './ScriptureDetailModal';
import TypeShadowDetailModal from './TypeShadowDetailModal';

type VerseActionView = 'none' | 'context' | 'compare' | 'save' | 'interpretation';
type OpenPanelMode = 'none' | 'action' | 'reference' | 'types' | 'interpretation';
type InterpretationCategory =
  | 'all'
  | 'historical'
  | 'contextual'
  | 'theological'
  | 'words'
  | 'cross-references'
  | 'literary'
  | 'typology';

function isOldTestamentRef(refStr: string): boolean {
  const parsed = parseScriptureReference(refStr);
  if (!parsed) return false;
  const book = findBookByName(parsed.book);
  return book?.testament === 'OT';
}

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
    setActivePage,
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
  const [selectedInterpCategory, setSelectedInterpCategory] = useState<InterpretationCategory>('all');
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

  // Dedicated Study Details Page & Modals state
  const [scriptureDetailRef, setScriptureDetailRef] = useState<string | null>(null);
  const [scriptureDetailContext, setScriptureDetailContext] = useState<string | undefined>(undefined);
  const [typeShadowDetailItem, setTypeShadowDetailItem] = useState<any | null>(null);
  const [activeInterpretationVerse, setActiveInterpretationVerse] = useState<VerseData | null>(null);

  // Inline expansion state for References, Types and Shadows, and individual Scripture Texts
  const [expandedRefVerse, setExpandedRefVerse] = useState<number | null>(null);
  const [expandedTypesVerse, setExpandedTypesVerse] = useState<number | null>(null);
  const [expandedInlineScriptures, setExpandedInlineScriptures] = useState<Record<string, boolean>>({});

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
    const uniqueRefs = Array.from(new Set(refStrings.filter(Boolean)));
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

  const toggleExpandedRef = (verseNum: number, refsList: any[]) => {
    setExpandedRefVerse((prev) => {
      const next = prev === verseNum ? null : verseNum;
      if (next !== null) {
        const allRefs = refsList.map((r) => r.connectedRef);
        ensureScriptureRefsResolved(allRefs);
      }
      return next;
    });
  };

  const toggleExpandedTypes = (verseNum: number, typesList: any[]) => {
    setExpandedTypesVerse((prev) => {
      const next = prev === verseNum ? null : verseNum;
      if (next !== null) {
        const allRefs = typesList.flatMap((ts) => [
          ts.otTypeRef,
          ts.ntAntitypeRef,
          ...(ts.supportingRefs || []),
        ]);
        ensureScriptureRefsResolved(allRefs);
      }
      return next;
    });
  };

  const toggleInlineScripture = (key: string, refStr: string) => {
    setExpandedInlineScriptures((prev) => {
      const next = !prev[key];
      if (next) {
        ensureScriptureRefsResolved([refStr]);
      }
      return { ...prev, [key]: next };
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
    const refs = getCrossReferencesForVerse(canonicalRef).filter(
      (r) =>
        r.connectedRef &&
        r.explanation &&
        r.explanation.length > 20 &&
        !r.explanation.startsWith('Biblical connection linking')
    );
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

  // Open independent Reference, Type and Shadow, or Interpretation view and position selected verse at top
  const openIndependentVersePanel = (
    v: VerseData,
    mode: 'reference' | 'types' | 'interpretation',
    category?: InterpretationCategory
  ) => {
    setSelectedVerse(v.verse);
    setActiveActionView('none');
    setExpandedSupportingRefId(null);
    if (category) {
      setSelectedInterpCategory(category);
    }
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
    const ctx = getVerseContextExplanation(v.canonicalRef, verseText, v.heading);
    saveContextItem({
      verseRef: v.canonicalRef,
      verseText,
      translation,
      mainTheme: `Context of ${v.canonicalRef}`,
      verseBreakdown: [
        `What Is Being Discussed: ${ctx.whatVerseIsTalkingAbout}`,
        `Surrounding Passage: ${ctx.surroundingPassage}`,
        `Speaker & Audience: ${ctx.speakerAndAudience}`,
        `What Prompted It: ${ctx.whatPromptedIt}`,
        `Immediate Meaning: ${ctx.immediateContextMeaning}`,
        `Surrounding Connection: ${ctx.connectionWithSurroundingVerses}`,
      ],
      contextSummary: `${ctx.whatVerseIsTalkingAbout} ${ctx.immediateContextMeaning}`,
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

  // Dedicated Separate Interpretation Page (Requirement 1.2 & Requirement 2)
  if (activeInterpretationVerse) {
    const interp = getContextualInterpretation(activeInterpretationVerse.canonicalRef);
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
        {/* Sticky Header with Back to Bible button */}
        <header
          className={`sticky top-0 z-30 px-4 sm:px-8 py-3.5 border-b backdrop-blur-md flex items-center justify-between gap-3 shadow-xs ${
            isChildren
              ? isLight
                ? 'bg-[#FFFDF4]/95 border-amber-200'
                : 'bg-[#13192E]/95 border-indigo-900'
              : isLight
              ? 'bg-[#FBF9F5]/95 border-stone-200'
              : 'bg-[#0F0F0F]/95 border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={() => setActiveInterpretationVerse(null)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold border flex items-center gap-1.5 transition shrink-0 ${
                isChildren
                  ? isLight
                    ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-950 font-extrabold'
                    : 'bg-indigo-900/60 hover:bg-indigo-800 border-indigo-700 text-amber-300 font-extrabold'
                  : isLight
                  ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
              }`}
              title="Return to Bible reading"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Bible Reading ({currentBook} {currentChapter}:{activeInterpretationVerse.verse})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveInterpretationVerse(null);
                setActivePage('study');
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold border flex items-center gap-1.5 transition ${
                isLight
                  ? 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-900'
                  : 'bg-blue-900/30 hover:bg-blue-800/40 border-blue-800 text-blue-200'
              }`}
              title="Open Study Centre"
            >
              <GraduationCap className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Study Centre</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="max-w-4xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6 flex-1">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 block mb-1">
              Contextual Scripture Interpretation
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              {activeInterpretationVerse.canonicalRef}
            </h1>
            {interp?.chapterScope && (
              <p className="text-xs sm:text-sm text-stone-500 dark:text-zinc-400 mt-1">
                Passage Scope: {interp.chapterScope}
              </p>
            )}
          </div>

          {/* Verse Text Card */}
          <div
            className={`p-5 sm:p-6 rounded-3xl border space-y-2 ${
              isLight
                ? 'bg-white border-blue-200/80 shadow-2xs'
                : 'bg-[#141822] border-blue-900/50 shadow-md'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 block">
              Scripture Passage ({translation})
            </span>
            <p className="font-serif text-base sm:text-lg leading-relaxed italic text-stone-900 dark:text-zinc-100">
              &ldquo;{activeInterpretationVerse.translations[translation] || activeInterpretationVerse.translations.NIV}&rdquo;
            </p>
          </div>

          {!interp ? (
            <div className="p-6 rounded-2xl border text-center space-y-2">
              <p className="text-sm font-medium">
                Detailed contextual interpretation is being prepared for {activeInterpretationVerse.canonicalRef}.
              </p>
              <p className="text-xs text-stone-400">
                You can explore related cross-references, word studies, and types in the Study tab.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 1. Historical Background */}
              {interp.historicalContext && (
                <section className="p-5 sm:p-6 rounded-3xl border bg-white dark:bg-[#151515] border-stone-200 dark:border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
                      1. Historical Context & Background
                    </span>
                    {interp.historicalContext.dateWritten && (
                      <span className="text-xs text-stone-500 dark:text-zinc-400">
                        Date: {interp.historicalContext.dateWritten}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                    {interp.historicalContext.historicalCircumstances}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-stone-600 dark:text-zinc-400">
                    <div><strong>Author:</strong> {interp.historicalContext.author}</div>
                    <div><strong>Original Audience:</strong> {interp.historicalContext.originalAudience}</div>
                    <div className="sm:col-span-2"><strong>Conditions & Setting:</strong> {interp.historicalContext.politicalReligiousSocialConditions}</div>
                  </div>
                  {interp.historicalContext.sourceAttribution && (
                    <div className="pt-2 text-[11px] text-stone-400 italic">
                      Source: {interp.historicalContext.sourceAttribution}
                    </div>
                  )}
                </section>
              )}

              {/* 2. Contextual & Passage Explanation */}
              {interp.contextualExplanation && (
                <section className="p-5 sm:p-6 rounded-3xl border bg-white dark:bg-[#151515] border-stone-200 dark:border-zinc-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-400 block">
                    2. Contextual & Passage Explanation
                  </span>
                  <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                    <p><strong>Main Subject:</strong> {interp.contextualExplanation.mainSubject}</p>
                    <p><strong>Preceding Context:</strong> {interp.contextualExplanation.beforePassage}</p>
                    <p><strong>Succeeding Context:</strong> {interp.contextualExplanation.afterPassage}</p>
                    <div className="p-4 rounded-2xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-200/70 dark:border-sky-900/40 text-xs sm:text-sm space-y-1">
                      <span className="font-bold text-sky-900 dark:text-sky-300 block">Author&apos;s Intended Message:</span>
                      <p className="leading-relaxed text-stone-700 dark:text-zinc-300">
                        {interp.contextualExplanation.authorsIntendedMessage}
                      </p>
                    </div>
                  </div>
                </section>
              )}

              {/* 3. Theological Significance */}
              {interp.theologicalInterpretation && (
                <section className="p-5 sm:p-6 rounded-3xl border bg-white dark:bg-[#151515] border-stone-200 dark:border-zinc-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-400 block">
                    3. Theological Significance & Doctrinal Truths
                  </span>
                  <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                    {interp.theologicalInterpretation.coreTheologicalThemes && (
                      <p><strong>Core Themes:</strong> {interp.theologicalInterpretation.coreTheologicalThemes.join(', ')}</p>
                    )}
                    <p className="leading-relaxed text-stone-700 dark:text-zinc-300">
                      {interp.theologicalInterpretation.explanation}
                    </p>
                  </div>
                </section>
              )}

              {/* 4. Original Words */}
              {interp.originalLanguageWords && interp.originalLanguageWords.length > 0 && (
                <section className="p-5 sm:p-6 rounded-3xl border bg-white dark:bg-[#151515] border-stone-200 dark:border-zinc-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
                    4. Original Language Meanings (Hebrew / Greek)
                  </span>
                  <div className="grid gap-3">
                    {interp.originalLanguageWords.map((w, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200 dark:border-zinc-800 space-y-2">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="font-bold text-sm sm:text-base text-stone-900 dark:text-white">{w.englishWord}</span>
                          <span className="font-serif text-lg font-bold text-emerald-700 dark:text-emerald-400">{w.originalSpelling}</span>
                          <span className="text-xs italic text-stone-500">({w.transliteration})</span>
                          {w.strongsNumber && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-200 dark:bg-zinc-800 font-bold">
                              {w.strongsNumber}
                            </span>
                          )}
                          <span className="text-xs text-stone-500">• {w.partOfSpeech}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-800 dark:text-zinc-200">
                          <strong>Meaning:</strong> {w.meaning}
                        </p>
                        <p className="text-xs text-stone-600 dark:text-zinc-400">
                          <strong>Contextual Usage:</strong> {w.contextualUsage}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 5. Cross-References (Clickable!) */}
              {interp.crossReferences && interp.crossReferences.length > 0 && (
                <section className="p-5 sm:p-6 rounded-3xl border bg-white dark:bg-[#151515] border-stone-200 dark:border-zinc-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 block">
                    5. Biblical Cross-References (Click to inspect)
                  </span>
                  <div className="grid gap-2.5">
                    {interp.crossReferences.map((cr, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-stone-50/70 dark:bg-zinc-900/60 border border-stone-200 dark:border-zinc-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setScriptureDetailRef(cr.ref);
                              setScriptureDetailContext(cr.relevanceExplanation);
                            }}
                            className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1.5"
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>{cr.ref}</span>
                          </button>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-200 dark:bg-zinc-800 text-stone-600 dark:text-zinc-400">
                            {cr.category}
                          </span>
                        </div>
                        <p className="text-xs text-stone-700 dark:text-zinc-300 leading-relaxed">
                          {cr.relevanceExplanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* 6. Literary & Cultural Context */}
              {interp.literaryAndCulturalContext && (
                <section className="p-5 sm:p-6 rounded-3xl border bg-white dark:bg-[#151515] border-stone-200 dark:border-zinc-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 block">
                    6. Literary & Cultural Context
                  </span>
                  <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                    <p><strong>Genre:</strong> {interp.literaryAndCulturalContext.genre}</p>
                    <p><strong>Figures of Speech:</strong> {interp.literaryAndCulturalContext.figuresOfSpeechAndIdioms}</p>
                    <p><strong>Jewish Customs & Traditions:</strong> {interp.literaryAndCulturalContext.jewishCustomsAndTraditions}</p>
                    <p><strong>Social Structures:</strong> {interp.literaryAndCulturalContext.socialStructures}</p>
                  </div>
                </section>
              )}

              {/* 7. Typology & Biblical Symbolism */}
              {interp.typologyAndSymbolism && (
                <section className="p-5 sm:p-6 rounded-3xl border bg-white dark:bg-[#151515] border-stone-200 dark:border-zinc-800 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800 dark:text-teal-400 block">
                    7. Typology & Biblical Symbolism
                  </span>
                  <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                    <p><strong>Types & Shadows:</strong> {interp.typologyAndSymbolism.typesAndShadowsIdentified}</p>
                    <p><strong>Prophetic Connections:</strong> {interp.typologyAndSymbolism.propheticConnections}</p>
                  </div>
                </section>
              )}
            </div>
          )}

          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setActiveInterpretationVerse(null)}
              className={`rounded-2xl px-6 py-2.5 text-sm font-bold border transition flex items-center gap-2 ${
                isLight
                  ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-800 shadow-sm'
                  : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-100 shadow-md'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Bible Reading ({currentBook} {currentChapter}:{activeInterpretationVerse.verse})</span>
            </button>
          </div>
        </main>

        {/* Scripture Detail Modal */}
        <ScriptureDetailModal
          isOpen={Boolean(scriptureDetailRef)}
          reference={scriptureDetailRef}
          contextNote={scriptureDetailContext}
          onClose={() => {
            setScriptureDetailRef(null);
            setScriptureDetailContext(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* =====================================================================
          MAIN BIBLE READING COLUMN
          ===================================================================== */}
      <div className="flex-1 min-w-0 flex flex-col pb-32 lg:pb-16">
        {/* Header 2: Sticky Book Header and Reader Toolbar */}
        <div
          ref={stickyToolbarRef}
          className={`sticky top-12 lg:top-0 z-30 py-2 sm:py-2.5 px-3 sm:px-8 flex items-center justify-between transition-colors border-b shadow-xs ${
            isChildren
              ? isLight
                ? 'bg-[#FFFDF4] border-amber-200/90 text-slate-900'
                : 'bg-[#13192E] border-indigo-900 text-slate-100'
              : isLight
              ? 'bg-[#FBF9F5] border-stone-200/90 text-stone-900'
              : 'bg-[#0F0F0F] border-zinc-800 text-zinc-100'
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
                const refs = getCrossReferencesForVerse(v.canonicalRef).filter(
                  (r) =>
                    r.connectedRef &&
                    r.explanation &&
                    r.explanation.length > 20 &&
                    !r.explanation.startsWith('Biblical connection linking')
                );
                const typeShadows = getTypesAndShadowsForVerse(v.canonicalRef);
                const interp = getContextualInterpretation(v.canonicalRef);
                const isSelected = selectedVerse === v.verse;
                const isReferenceOpen = isSelected && openPanelMode === 'reference';
                const isTypesOpen = isSelected && openPanelMode === 'types';
                const isInterpretationOpen = isSelected && openPanelMode === 'interpretation';
                const isActionOpen = isSelected && openPanelMode === 'action';
                const hasAnyIntel = refs.length > 0 || typeShadows.length > 0 || Boolean(interp);
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

                    {/* Small, rounded, clickable tags on verses (Requirement 2) */}
                    {(refs.length > 0 || typeShadows.length > 0) && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-2 flex-wrap pt-1 select-none"
                      >
                        {refs.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpandedRef(v.verse, refs);
                            }}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition border ${
                              expandedRefVerse === v.verse
                                ? isLight
                                  ? 'bg-amber-700 text-white border-amber-700 shadow-sm'
                                  : 'bg-amber-500 text-zinc-950 border-amber-500 font-bold shadow-sm'
                                : isChildren
                                ? isLight
                                  ? 'bg-amber-100/80 hover:bg-amber-200 text-amber-950 border-amber-300'
                                  : 'bg-indigo-900/60 hover:bg-indigo-800 text-amber-300 border-indigo-700'
                                : isLight
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200/90'
                                : 'bg-amber-950/30 hover:bg-amber-900/40 text-amber-300 border-amber-800/50'
                            }`}
                            title="View scripture references"
                          >
                            <BookOpen className="h-3 w-3" />
                            <span>References</span>
                            {expandedRefVerse === v.verse ? (
                              <ChevronUp className="h-3 w-3 ml-0.5" />
                            ) : (
                              <ChevronDown className="h-3 w-3 ml-0.5 opacity-70" />
                            )}
                          </button>
                        )}

                        {typeShadows.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpandedTypes(v.verse, typeShadows);
                            }}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition border ${
                              expandedTypesVerse === v.verse
                                ? isLight
                                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                                  : 'bg-emerald-500 text-zinc-950 border-emerald-500 font-bold shadow-sm'
                                : isChildren
                                ? isLight
                                  ? 'bg-emerald-100/80 hover:bg-emerald-200 text-emerald-950 border-emerald-300'
                                  : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border-emerald-700'
                                : isLight
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200/90'
                                : 'bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-300 border-emerald-800/50'
                            }`}
                            title="View Types and Shadows"
                          >
                            <Sparkles className="h-3 w-3" />
                            <span>Types and Shadows</span>
                            {expandedTypesVerse === v.verse ? (
                              <ChevronUp className="h-3 w-3 ml-0.5" />
                            ) : (
                              <ChevronDown className="h-3 w-3 ml-0.5 opacity-70" />
                            )}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Inline Expandable References Section (Requirement 1 & 3) */}
                    {expandedRefVerse === v.verse && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={`rounded-2xl border overflow-hidden mt-2 mb-2 shadow-sm animate-in fade-in duration-150 ${
                          isChildren
                            ? isLight
                              ? 'bg-[#FFFDF5] border-amber-300 text-stone-900'
                              : 'bg-[#151C33] border-indigo-700 text-zinc-100'
                            : isLight
                            ? 'bg-white border-amber-200/90 text-stone-900'
                            : 'bg-[#181818] border-amber-900/40 shadow-md text-zinc-100'
                        }`}
                      >
                        {/* References Header */}
                        <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3 border-b border-stone-200/80 dark:border-zinc-800">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded ${
                                isLight
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-amber-500/20 text-amber-300'
                              }`}
                            >
                              References
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-400">
                              {v.canonicalRef}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
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
                              <span className="hidden sm:inline">Save</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setExpandedRefVerse(null)}
                              className={`rounded-lg p-1.5 border transition ${
                                isLight
                                  ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-600'
                                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                              }`}
                              title="Close References"
                              aria-label="Close References"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* References Body: Old Testament and New Testament */}
                        <div className="px-4 sm:px-5 py-3.5 space-y-4">
                          {(() => {
                            const otRefs = refs.filter((r) => isOldTestamentRef(r.connectedRef));
                            const ntRefs = refs.filter((r) => !isOldTestamentRef(r.connectedRef));

                            return (
                              <>
                                {/* Old Testament References */}
                                {otRefs.length > 0 && (
                                  <div className="space-y-2">
                                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 flex items-center gap-1.5">
                                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                                      <span>Old Testament References ({otRefs.length})</span>
                                    </h5>
                                    <div className="space-y-2 pl-2 border-l-2 border-amber-300/60 dark:border-amber-700/50">
                                      {otRefs.map((r) => {
                                        const itemKey = `${v.verse}-${r.connectedRef}`;
                                        const isExpanded = Boolean(expandedInlineScriptures[itemKey]);
                                        const refText =
                                          resolvedRefTexts[r.connectedRef] ||
                                          getVerseText(r.connectedRef, translation);

                                        return (
                                          <div
                                            key={r.connectedRef || r.id}
                                            className={`rounded-xl border p-2.5 transition ${
                                              isExpanded
                                                ? isLight
                                                  ? 'bg-amber-50/70 border-amber-300'
                                                  : 'bg-zinc-900 border-amber-700/60'
                                                : isLight
                                                ? 'bg-white hover:bg-stone-50 border-stone-200'
                                                : 'bg-zinc-900/60 hover:bg-zinc-800 border-zinc-800'
                                            }`}
                                          >
                                            <button
                                              type="button"
                                              onClick={() => toggleInlineScripture(itemKey, r.connectedRef)}
                                              className="w-full flex items-center justify-between text-left gap-2"
                                            >
                                              <div className="flex items-center gap-2">
                                                <span className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-400">
                                                  {r.connectedRef}
                                                </span>
                                                <span className="text-[10px] text-stone-400 dark:text-zinc-500">
                                                  ({translation})
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-zinc-400 font-medium">
                                                <span>{isExpanded ? 'Hide Passage' : 'Read Passage'}</span>
                                                {isExpanded ? (
                                                  <ChevronUp className="h-3.5 w-3.5" />
                                                ) : (
                                                  <ChevronDown className="h-3.5 w-3.5" />
                                                )}
                                              </div>
                                            </button>

                                            {/* Inline Expanded Scripture Text */}
                                            {isExpanded && (
                                              <div className="mt-2.5 pt-2 border-t border-stone-200/80 dark:border-zinc-800 space-y-2 animate-in fade-in duration-100">
                                                <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-900 dark:text-zinc-100">
                                                  {refText ? `“${refText}”` : 'Loading scripture text...'}
                                                </p>
                                                {(r.biblicalContext || r.explanation) && (
                                                  <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed italic bg-amber-100/40 dark:bg-zinc-800/60 p-2 rounded-lg">
                                                    {r.biblicalContext || r.explanation}
                                                  </p>
                                                )}
                                                <div className="flex items-center justify-between pt-1">
                                                  <button
                                                    type="button"
                                                    onClick={() => navigateToReferenceString(r.connectedRef, false)}
                                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 dark:text-amber-400 hover:underline"
                                                  >
                                                    <ExternalLink className="h-3 w-3" />
                                                    <span>Go to {r.connectedRef} in Bible</span>
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                {/* New Testament References */}
                                {ntRefs.length > 0 && (
                                  <div className="space-y-2">
                                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-zinc-400 flex items-center gap-1.5">
                                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                      <span>New Testament References ({ntRefs.length})</span>
                                    </h5>
                                    <div className="space-y-2 pl-2 border-l-2 border-blue-300/60 dark:border-blue-700/50">
                                      {ntRefs.map((r) => {
                                        const itemKey = `${v.verse}-${r.connectedRef}`;
                                        const isExpanded = Boolean(expandedInlineScriptures[itemKey]);
                                        const refText =
                                          resolvedRefTexts[r.connectedRef] ||
                                          getVerseText(r.connectedRef, translation);

                                        return (
                                          <div
                                            key={r.connectedRef || r.id}
                                            className={`rounded-xl border p-2.5 transition ${
                                              isExpanded
                                                ? isLight
                                                  ? 'bg-blue-50/70 border-blue-300'
                                                  : 'bg-zinc-900 border-blue-700/60'
                                                : isLight
                                                ? 'bg-white hover:bg-stone-50 border-stone-200'
                                                : 'bg-zinc-900/60 hover:bg-zinc-800 border-zinc-800'
                                            }`}
                                          >
                                            <button
                                              type="button"
                                              onClick={() => toggleInlineScripture(itemKey, r.connectedRef)}
                                              className="w-full flex items-center justify-between text-left gap-2"
                                            >
                                              <div className="flex items-center gap-2">
                                                <span className="text-xs sm:text-sm font-bold text-blue-900 dark:text-blue-400">
                                                  {r.connectedRef}
                                                </span>
                                                <span className="text-[10px] text-stone-400 dark:text-zinc-500">
                                                  ({translation})
                                                </span>
                                              </div>
                                              <div className="flex items-center gap-1 text-[11px] text-stone-500 dark:text-zinc-400 font-medium">
                                                <span>{isExpanded ? 'Hide Passage' : 'Read Passage'}</span>
                                                {isExpanded ? (
                                                  <ChevronUp className="h-3.5 w-3.5" />
                                                ) : (
                                                  <ChevronDown className="h-3.5 w-3.5" />
                                                )}
                                              </div>
                                            </button>

                                            {/* Inline Expanded Scripture Text */}
                                            {isExpanded && (
                                              <div className="mt-2.5 pt-2 border-t border-stone-200/80 dark:border-zinc-800 space-y-2 animate-in fade-in duration-100">
                                                <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-900 dark:text-zinc-100">
                                                  {refText ? `“${refText}”` : 'Loading scripture text...'}
                                                </p>
                                                {(r.biblicalContext || r.explanation) && (
                                                  <p className="text-xs text-stone-600 dark:text-zinc-400 leading-relaxed italic bg-blue-100/40 dark:bg-zinc-800/60 p-2 rounded-lg">
                                                    {r.biblicalContext || r.explanation}
                                                  </p>
                                                )}
                                                <div className="flex items-center justify-between pt-1">
                                                  <button
                                                    type="button"
                                                    onClick={() => navigateToReferenceString(r.connectedRef, false)}
                                                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-800 dark:text-blue-400 hover:underline"
                                                  >
                                                    <ExternalLink className="h-3 w-3" />
                                                    <span>Go to {r.connectedRef} in Bible</span>
                                                  </button>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Inline Expandable Types and Shadows Section (Requirement 1 & 4) */}
                    {expandedTypesVerse === v.verse && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className={`rounded-2xl border overflow-hidden mt-2 mb-2 shadow-sm animate-in fade-in duration-150 ${
                          isChildren
                            ? isLight
                              ? 'bg-[#FFFDF5] border-emerald-300 text-stone-900'
                              : 'bg-[#151C33] border-emerald-700 text-zinc-100'
                            : isLight
                            ? 'bg-white border-emerald-200/90 text-stone-900'
                            : 'bg-[#181818] border-emerald-900/40 shadow-md text-zinc-100'
                        }`}
                      >
                        {/* Types and Shadows Header */}
                        <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3 border-b border-stone-200/80 dark:border-zinc-800">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded ${
                                isLight
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : 'bg-emerald-500/20 text-emerald-300'
                              }`}
                            >
                              Types and Shadows
                            </span>
                            <span className="text-xs sm:text-sm font-bold text-emerald-900 dark:text-emerald-400">
                              {v.canonicalRef}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
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
                              <span className="hidden sm:inline">Save</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setExpandedTypesVerse(null)}
                              className={`rounded-lg p-1.5 border transition ${
                                isLight
                                  ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-600'
                                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                              }`}
                              title="Close Types and Shadows"
                              aria-label="Close Types and Shadows"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Types and Shadows Body */}
                        <div className="px-4 sm:px-5 py-4 space-y-4">
                          {typeShadows.map((ts, idx) => {
                            const otKey = `ts-ot-${ts.id}`;
                            const ntKey = `ts-nt-${ts.id}`;
                            const isOtExpanded = Boolean(expandedInlineScriptures[otKey]);
                            const isNtExpanded = Boolean(expandedInlineScriptures[ntKey]);
                            const otText =
                              resolvedRefTexts[ts.otTypeRef] || getVerseText(ts.otTypeRef, translation);
                            const ntText =
                              resolvedRefTexts[ts.ntAntitypeRef] || getVerseText(ts.ntAntitypeRef, translation);

                            return (
                              <div
                                key={ts.id || idx}
                                className={`space-y-3 ${
                                  idx > 0 ? 'pt-3 border-t border-stone-200 dark:border-zinc-800' : ''
                                }`}
                              >
                                <div>
                                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-zinc-100">
                                    {ts.title}
                                  </h4>
                                  <p className="text-xs text-stone-700 dark:text-zinc-300 mt-1 leading-relaxed">
                                    {ts.explanation}
                                  </p>
                                </div>

                                {/* OT Type passage */}
                                <div className="rounded-xl border p-2.5 bg-stone-50/70 dark:bg-zinc-900/60 border-stone-200 dark:border-zinc-800">
                                  <button
                                    type="button"
                                    onClick={() => toggleInlineScripture(otKey, ts.otTypeRef)}
                                    className="w-full flex items-center justify-between text-left gap-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-amber-900 dark:text-amber-400">
                                        Old Testament Type: {ts.otTypeRef}
                                      </span>
                                      <span className="text-[10px] text-stone-400">({translation})</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                                      <span>{isOtExpanded ? 'Hide' : 'Read Text'}</span>
                                      {isOtExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                    </div>
                                  </button>
                                  {isOtExpanded && (
                                    <p className="mt-2 pt-2 border-t border-stone-200 dark:border-zinc-800 font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                                      {otText ? `“${otText}”` : 'Loading scripture text...'}
                                    </p>
                                  )}
                                </div>

                                {/* NT Fulfilment passage */}
                                <div className="rounded-xl border p-2.5 bg-stone-50/70 dark:bg-zinc-900/60 border-stone-200 dark:border-zinc-800">
                                  <button
                                    type="button"
                                    onClick={() => toggleInlineScripture(ntKey, ts.ntAntitypeRef)}
                                    className="w-full flex items-center justify-between text-left gap-2"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-bold text-emerald-900 dark:text-emerald-400">
                                        New Testament Fulfilment: {ts.ntAntitypeRef}
                                      </span>
                                      <span className="text-[10px] text-stone-400">({translation})</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px] text-stone-500 font-medium">
                                      <span>{isNtExpanded ? 'Hide' : 'Read Text'}</span>
                                      {isNtExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                    </div>
                                  </button>
                                  {isNtExpanded && (
                                    <p className="mt-2 pt-2 border-t border-stone-200 dark:border-zinc-800 font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                                      {ntText ? `“${ntText}”` : 'Loading scripture text...'}
                                    </p>
                                  )}
                                </div>

                                {/* Context / Typology Basis */}
                                {ts.biblicalContext && (
                                  <div className="text-xs text-stone-600 dark:text-zinc-400 italic bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10">
                                    <strong>Context:</strong> {ts.biblicalContext}
                                  </div>
                                )}
                              </div>
                            );
                          })}
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

                            {/* SECOND SECTION: Action card options (Requirement 1.2) */}
                            <div className="px-4 sm:px-5 py-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <button
                                onClick={() => {
                                  setSelectedVerse(null);
                                  setOpenPanelMode('none');
                                  setActiveInterpretationVerse(v);
                                }}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition shrink-0 whitespace-nowrap ${
                                  isLight
                                    ? 'bg-amber-50 hover:bg-amber-100/80 border-amber-300 text-amber-900'
                                    : 'bg-amber-950/40 hover:bg-amber-900/50 border-amber-800 text-amber-300'
                                }`}
                              >
                                Interpretation
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
                                onClick={() => setActiveActionView('context')}
                                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold border transition shrink-0 whitespace-nowrap ${
                                  isLight
                                    ? 'bg-amber-50 hover:bg-amber-100/80 border-amber-300 text-amber-900'
                                    : 'bg-amber-950/40 hover:bg-amber-900/50 border-amber-800 text-amber-300'
                                }`}
                              >
                                Contexts
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
                          /* FOCUSED VIEW: 6-Point Contextual Explanation (Requirement 5) */
                          (() => {
                            const ctx = getVerseContextExplanation(
                              v.canonicalRef,
                              v.translations[translation] || v.translations.NIV,
                              v.heading
                            );

                            return (
                              <>
                                <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-3 bg-stone-50/70 dark:bg-zinc-900/60">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span
                                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded w-fit ${
                                        isLight
                                          ? 'bg-amber-100 text-amber-900'
                                          : 'bg-amber-500/20 text-amber-300'
                                      }`}
                                    >
                                      Contexts
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
                                      <span className="hidden sm:inline">Save</span>
                                    </button>
                                    <button
                                      onClick={() => setActiveActionView('none')}
                                      className={`rounded-lg p-1.5 border transition shrink-0 ${
                                        isLight
                                          ? 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-600'
                                          : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300'
                                      }`}
                                      title="Close Contexts"
                                      aria-label="Close Contexts"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>

                                <div
                                  className={`h-px w-full ${
                                    isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
                                  }`}
                                />

                                <div className="p-4 sm:px-5 sm:py-4 space-y-3.5 text-xs sm:text-[13px] leading-relaxed">
                                  {/* 1. What the verse is talking about */}
                                  <div className="space-y-1">
                                    <h6 className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-300 text-[10px] font-bold">
                                        1
                                      </span>
                                      <span>What the verse is talking about</span>
                                    </h6>
                                    <p className="text-stone-800 dark:text-zinc-200 pl-5.5">
                                      {ctx.whatVerseIsTalkingAbout}
                                    </p>
                                  </div>

                                  {/* 2. What is happening in surrounding passage */}
                                  <div className="space-y-1">
                                    <h6 className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-300 text-[10px] font-bold">
                                        2
                                      </span>
                                      <span>What is happening in the surrounding passage</span>
                                    </h6>
                                    <p className="text-stone-800 dark:text-zinc-200 pl-5.5">
                                      {ctx.surroundingPassage}
                                    </p>
                                  </div>

                                  {/* 3. Who is speaking or being addressed */}
                                  <div className="space-y-1">
                                    <h6 className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-300 text-[10px] font-bold">
                                        3
                                      </span>
                                      <span>Who is speaking or being addressed</span>
                                    </h6>
                                    <p className="text-stone-800 dark:text-zinc-200 pl-5.5">
                                      {ctx.speakerAndAudience}
                                    </p>
                                  </div>

                                  {/* 4. What prompted the statement or event */}
                                  <div className="space-y-1">
                                    <h6 className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-300 text-[10px] font-bold">
                                        4
                                      </span>
                                      <span>What prompted the statement or event</span>
                                    </h6>
                                    <p className="text-stone-800 dark:text-zinc-200 pl-5.5">
                                      {ctx.whatPromptedIt}
                                    </p>
                                  </div>

                                  {/* 5. What the verse means within immediate biblical context */}
                                  <div className="space-y-1">
                                    <h6 className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-300 text-[10px] font-bold">
                                        5
                                      </span>
                                      <span>What the verse means within its immediate biblical context</span>
                                    </h6>
                                    <p className="text-stone-800 dark:text-zinc-200 pl-5.5">
                                      {ctx.immediateContextMeaning}
                                    </p>
                                  </div>

                                  {/* 6. How the verse connects with surrounding verses */}
                                  <div className="space-y-1">
                                    <h6 className="font-bold text-amber-900 dark:text-amber-400 flex items-center gap-1.5">
                                      <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-300 text-[10px] font-bold">
                                        6
                                      </span>
                                      <span>How the verse connects with the surrounding verses</span>
                                    </h6>
                                    <p className="text-stone-800 dark:text-zinc-200 pl-5.5">
                                      {ctx.connectionWithSurroundingVerses}
                                    </p>
                                  </div>
                                </div>
                              </>
                            );
                          })()
                        ) : activeActionView === 'compare' ? (
                          /* FOCUSED VIEW: Compare Translation */
                          <>
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

                            <div
                              className={`h-px w-full ${
                                isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
                              }`}
                            />

                            <div className="divide-y divide-stone-200/90 dark:divide-zinc-800">
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
                          </>
                        ) : activeActionView === 'save' ? (
                          /* FOCUSED VIEW: Save Bible Verse (Requirement 4: No redundant content-type selection; auto-closes on save) */
                          <>
                            <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
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

                            <div
                              className={`h-px w-full ${
                                isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
                              }`}
                            />

                            <div className="px-4 sm:px-5 py-3.5 space-y-3">
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
                          </>
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
