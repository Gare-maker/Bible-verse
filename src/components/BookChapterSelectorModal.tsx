'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownAZ,
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Clock,
  Layers,
  Search,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { BIBLE_BOOKS, findBookByName } from '@/data/bibleBooks';
import { usePlatform } from '@/context/PlatformContext';
import { Testament, VerseData } from '@/types/bible';
import { fetchChapterVerses } from '@/services/bibleService';

interface BookChapterSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SelectorStep = 'books' | 'chapters' | 'verses';

export default function BookChapterSelectorModal({
  isOpen,
  onClose,
}: BookChapterSelectorModalProps) {
  const {
    currentBook,
    currentChapter,
    navigateToPassage,
    readingHistory,
    preferences,
    translation,
  } = usePlatform();

  const isLight = preferences.theme === 'light';
  const isChildren = preferences.experienceMode === 'children';

  const [step, setStep] = useState<SelectorStep>('books');
  const [selectedBook, setSelectedBook] = useState<string>(currentBook);
  const [selectedChapter, setSelectedChapter] = useState<number>(currentChapter || 1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAlphabetical, setSortAlphabetical] = useState(false);
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | Testament>('ALL');
  const [showHistory, setShowHistory] = useState(false);

  // Verses in selected chapter
  const [chapterVerses, setChapterVerses] = useState<number[]>([]);
  const [isLoadingVerses, setIsLoadingVerses] = useState(false);

  // Reset to initial state when opening
  useEffect(() => {
    if (isOpen) {
      setSelectedBook(currentBook);
      setSelectedChapter(currentChapter > 0 ? currentChapter : 1);
      // Start at books view
      setStep('books');
      setShowHistory(false);
      setSearchQuery('');
    }
  }, [isOpen, currentBook, currentChapter]);

  // Load verse numbers when entering verses step
  useEffect(() => {
    if (step === 'verses' && selectedBook && selectedChapter > 0) {
      setIsLoadingVerses(true);
      fetchChapterVerses(selectedBook, selectedChapter, translation)
        .then((data: VerseData[]) => {
          if (Array.isArray(data) && data.length > 0) {
            setChapterVerses(data.map((v) => v.verse));
          } else {
            // Sensible fallback of 30 verse tiles if offline
            setChapterVerses(Array.from({ length: 30 }, (_, i) => i + 1));
          }
        })
        .catch(() => {
          setChapterVerses(Array.from({ length: 30 }, (_, i) => i + 1));
        })
        .finally(() => {
          setIsLoadingVerses(false);
        });
    }
  }, [step, selectedBook, selectedChapter, translation]);

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    let list = [...BIBLE_BOOKS];
    if (testamentFilter !== 'ALL') {
      list = list.filter((b) => b.testament === testamentFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.abbreviation.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }
    if (sortAlphabetical) {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [searchQuery, sortAlphabetical, testamentFilter]);

  const activeBookObj = useMemo(() => {
    return findBookByName(selectedBook) || BIBLE_BOOKS[0];
  }, [selectedBook]);

  if (!isOpen) return null;

  const handleSelectBook = (bookName: string) => {
    setSelectedBook(bookName);
    setStep('chapters');
  };

  const handleSelectChapter = (chapNum: number) => {
    setSelectedChapter(chapNum);
    if (chapNum === 0) {
      // Intro goes directly to passage
      navigateToPassage(selectedBook, 0, undefined, false);
      onClose();
    } else {
      setStep('verses');
    }
  };

  const handleSelectVerse = (verseNum?: number) => {
    navigateToPassage(selectedBook, selectedChapter, verseNum, false);
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex justify-end bg-black/45 backdrop-blur-xs transition-opacity"
      aria-modal="true"
      role="dialog"
    >
      {/* Slide-out Drawer on the OPPOSITE side (Right Side) of the reading view */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex h-full w-full sm:w-[480px] md:w-[520px] max-w-full flex-col shadow-2xl overflow-hidden border-l animate-in slide-in-from-right duration-200 ${
          isChildren
            ? isLight
              ? 'bg-[#FFFDF4] border-amber-200 text-slate-900'
              : 'bg-[#141A30] border-indigo-800 text-slate-100'
            : isLight
            ? 'bg-white border-stone-200 text-stone-900'
            : 'bg-[#141414] border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Top Header with Contextual Back Navigation */}
        <div
          className={`flex items-center justify-between px-5 pt-4 pb-3 border-b ${
            isChildren
              ? isLight
                ? 'bg-amber-100/70 border-amber-200'
                : 'bg-indigo-950/80 border-indigo-800'
              : isLight
              ? 'bg-stone-50 border-stone-200'
              : 'bg-[#181818] border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {step === 'verses' ? (
              <button
                onClick={() => setStep('chapters')}
                className={`rounded-full p-1.5 transition flex items-center gap-1.5 text-xs font-bold ${
                  isChildren
                    ? isLight
                      ? 'text-amber-900 hover:bg-amber-200/80'
                      : 'text-amber-300 hover:bg-indigo-900'
                    : isLight
                    ? 'text-stone-700 hover:bg-stone-200'
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
                aria-label="Back to Chapters"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span>Chapters</span>
              </button>
            ) : step === 'chapters' ? (
              <button
                onClick={() => setStep('books')}
                className={`rounded-full p-1.5 transition flex items-center gap-1.5 text-xs font-bold ${
                  isChildren
                    ? isLight
                      ? 'text-amber-900 hover:bg-amber-200/80'
                      : 'text-amber-300 hover:bg-indigo-900'
                    : isLight
                    ? 'text-stone-700 hover:bg-stone-200'
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
                aria-label="Back to Books"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span>Books</span>
              </button>
            ) : showHistory ? (
              <button
                onClick={() => setShowHistory(false)}
                className={`rounded-full p-1.5 transition flex items-center gap-1.5 text-xs font-bold ${
                  isChildren
                    ? isLight
                      ? 'text-amber-900 hover:bg-amber-200/80'
                      : 'text-amber-300 hover:bg-indigo-900'
                    : isLight
                    ? 'text-stone-700 hover:bg-stone-200'
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
                aria-label="Back to Books"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span>Back</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                {isChildren ? (
                  <Sparkles className="h-5 w-5 text-amber-500 shrink-0" />
                ) : (
                  <BookOpen className="h-5 w-5 text-amber-700 dark:text-amber-400 shrink-0" />
                )}
                <h2
                  className={`text-base font-bold tracking-tight truncate ${
                    isChildren ? 'font-sans' : 'font-serif'
                  }`}
                >
                  Select Scripture
                </h2>
              </div>
            )}

            {step !== 'books' && !showHistory && (
              <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                <span className="text-stone-400">/</span>
                <span
                  className={
                    isChildren
                      ? isLight
                        ? 'text-orange-700'
                        : 'text-amber-300'
                      : isLight
                      ? 'text-amber-800'
                      : 'text-amber-400'
                  }
                >
                  {selectedBook} {step === 'verses' ? selectedChapter : ''}
                </span>
              </div>
            )}
          </div>

          {/* Action buttons on header right */}
          <div className="flex items-center gap-1.5 shrink-0">
            {step === 'books' && !showHistory && (
              <>
                <button
                  onClick={() => setSortAlphabetical((prev) => !prev)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1 transition ${
                    sortAlphabetical
                      ? isChildren
                        ? 'bg-amber-400 text-slate-950 font-extrabold'
                        : isLight
                        ? 'bg-amber-700 text-white'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : isChildren
                      ? isLight
                        ? 'text-slate-700 hover:bg-amber-200/60'
                        : 'text-slate-300 hover:bg-indigo-900'
                      : isLight
                      ? 'text-stone-600 hover:bg-stone-200'
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                  title="Toggle Alphabetical / Canonical Order"
                >
                  <ArrowDownAZ className="h-4 w-4" />
                  <span>{sortAlphabetical ? 'A–Z' : 'Canon'}</span>
                </button>

                <button
                  onClick={() => setShowHistory(true)}
                  className={`rounded-lg p-1.5 transition ${
                    isChildren
                      ? isLight
                        ? 'text-slate-700 hover:bg-amber-200/60'
                        : 'text-slate-300 hover:bg-indigo-900'
                      : isLight
                      ? 'text-stone-600 hover:bg-stone-200'
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                  title="Reading History"
                  aria-label="Reading History"
                >
                  <Clock className="h-4 w-4" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className={`rounded-lg p-1.5 transition ${
                isChildren
                  ? isLight
                    ? 'text-slate-500 hover:bg-amber-200/60 hover:text-slate-900'
                    : 'text-slate-400 hover:bg-indigo-900 hover:text-white'
                  : isLight
                  ? 'text-stone-400 hover:bg-stone-200 hover:text-stone-800'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
              title="Close"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Step 1: Books Search & Filter Bar */}
        {step === 'books' && !showHistory && (
          <div
            className={`px-5 py-3 space-y-2.5 border-b ${
              isChildren
                ? isLight
                  ? 'bg-amber-50/60 border-amber-200/70'
                  : 'bg-[#182038] border-indigo-800/70'
                : isLight
                ? 'bg-stone-50/80 border-stone-200'
                : 'bg-[#171717] border-zinc-800'
            }`}
          >
            <div className="relative">
              <Search
                className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${
                  isChildren
                    ? isLight
                      ? 'text-amber-600'
                      : 'text-amber-300'
                    : isLight
                    ? 'text-stone-400'
                    : 'text-zinc-400'
                }`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isChildren
                    ? 'Search Bible story books (Genesis, Matthew)...'
                    : 'Search Bible books (e.g. Genesis, Matthew, Romans)...'
                }
                className={`w-full rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm border focus:outline-none transition ${
                  isChildren
                    ? isLight
                      ? 'bg-white border-amber-300 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-amber-400'
                      : 'bg-[#11172B] border-indigo-700 text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-amber-400'
                    : isLight
                    ? 'bg-white border-stone-200 text-stone-900 placeholder-stone-400 focus:border-amber-700'
                    : 'bg-[#222222] border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:border-amber-500'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {(['ALL', 'OT', 'NT'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTestamentFilter(tab)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                    testamentFilter === tab
                      ? isChildren
                        ? isLight
                          ? 'bg-amber-400 text-slate-950 shadow-sm font-extrabold'
                          : 'bg-indigo-600 text-white shadow-sm font-extrabold'
                        : isLight
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-zinc-100 text-zinc-900 shadow-xs'
                      : isChildren
                      ? isLight
                        ? 'bg-amber-100/90 text-amber-900 hover:bg-amber-200'
                        : 'bg-indigo-900/60 text-slate-300 hover:bg-indigo-900'
                      : isLight
                      ? 'bg-stone-200/80 text-stone-700 hover:bg-stone-200'
                      : 'bg-[#222222] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab === 'ALL'
                    ? 'All 66 Books'
                    : tab === 'OT'
                    ? 'Old Testament'
                    : 'New Testament'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reading History Mode */}
        {showHistory ? (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  isLight ? 'text-stone-400' : 'text-zinc-500'
                }`}
              >
                Recent Reading History
              </span>
              <button
                onClick={() => setShowHistory(false)}
                className={`text-xs font-bold hover:underline ${
                  isChildren
                    ? isLight
                      ? 'text-orange-700'
                      : 'text-amber-300'
                    : isLight
                    ? 'text-amber-700'
                    : 'text-amber-400'
                }`}
              >
                Back to Books
              </button>
            </div>
            {readingHistory.map((item, i) => (
              <button
                key={`${item.book}-${item.chapter}-${i}`}
                onClick={() => {
                  navigateToPassage(item.book, item.chapter, undefined, false);
                  onClose();
                }}
                className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-left border transition ${
                  isChildren
                    ? isLight
                      ? 'bg-white hover:bg-amber-50 border-amber-200 text-slate-900'
                      : 'bg-[#182038] hover:bg-[#1E2847] border-indigo-800 text-slate-100'
                    : isLight
                    ? 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                    : 'bg-[#1c1c1c] hover:bg-[#262626] border-zinc-800'
                }`}
              >
                <div>
                  <p
                    className={`text-sm font-bold ${
                      isChildren ? 'font-sans' : 'font-serif'
                    }`}
                  >
                    {item.book} {item.chapter}
                  </p>
                  <p className="text-xs text-stone-400">Translation: {item.translation}</p>
                </div>
                <span className="text-xs text-stone-400">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        ) : step === 'books' ? (
          /* =================================================================
             STEP 1: DISPLAY ALL BOOKS
             ================================================================= */
          <div className="flex-1 overflow-y-auto px-5 py-3 divide-y divide-stone-100 dark:divide-zinc-800/80">
            {filteredBooks.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                No Bible books found matching &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              filteredBooks.map((book) => {
                const isCurrent = currentBook.toLowerCase() === book.name.toLowerCase();
                return (
                  <button
                    key={book.id}
                    onClick={() => handleSelectBook(book.name)}
                    className={`w-full flex items-center justify-between py-3 text-left transition group ${
                      isChildren ? 'hover:translate-x-1 duration-150' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition ${
                          isCurrent
                            ? isChildren
                              ? 'bg-amber-400 text-slate-950 shadow-xs'
                              : isLight
                              ? 'bg-amber-700 text-white'
                              : 'bg-amber-500 text-zinc-950'
                            : isChildren
                            ? isLight
                              ? 'bg-amber-100 text-amber-900 group-hover:bg-amber-200'
                              : 'bg-indigo-900/80 text-amber-300 group-hover:bg-indigo-800'
                            : isLight
                            ? 'bg-stone-100 text-stone-700 group-hover:bg-stone-200'
                            : 'bg-[#222222] text-zinc-300 group-hover:bg-[#2a2a2a]'
                        }`}
                      >
                        {book.abbreviation.slice(0, 3)}
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`text-sm sm:text-base font-bold block truncate transition ${
                            isCurrent
                              ? isChildren
                                ? isLight
                                  ? 'text-amber-950 font-extrabold'
                                  : 'text-amber-300 font-extrabold'
                                : isLight
                                ? 'text-amber-800 font-serif'
                                : 'text-amber-400 font-serif'
                              : isChildren
                              ? isLight
                                ? 'text-slate-800 group-hover:text-amber-900'
                                : 'text-slate-100 group-hover:text-amber-200'
                              : isLight
                              ? 'text-stone-800 group-hover:text-stone-950 font-serif'
                              : 'text-zinc-100 group-hover:text-white font-serif'
                          }`}
                        >
                          {book.name}
                        </span>
                        <span className="text-[11px] text-stone-400 block truncate">
                          {book.category} • {book.chapters} chapters
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isChildren
                            ? isLight
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-indigo-900 text-indigo-200'
                            : isLight
                            ? 'bg-stone-100 text-stone-600'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {book.chapters} ch
                      </span>
                      <ChevronRight className="h-4 w-4 text-stone-400 group-hover:text-stone-700 dark:group-hover:text-white" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        ) : step === 'chapters' ? (
          /* =================================================================
             STEP 2: DISPLAY CHAPTERS OF SELECTED BOOK
             ================================================================= */
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            <div
              className={`rounded-2xl p-4 border flex items-center justify-between gap-3 ${
                isChildren
                  ? isLight
                    ? 'bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 border-amber-300 text-slate-900'
                    : 'bg-gradient-to-r from-indigo-950 to-purple-950 border-indigo-700 text-slate-100'
                  : isLight
                  ? 'bg-stone-50 border-stone-200 text-stone-900'
                  : 'bg-[#181818] border-zinc-800 text-zinc-100'
              }`}
            >
              <div>
                <h3
                  className={`text-lg sm:text-xl font-bold ${
                    isChildren ? 'font-sans' : 'font-serif'
                  }`}
                >
                  {selectedBook}
                </h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                  {activeBookObj.category} • {activeBookObj.chapters} Chapters
                </p>
              </div>

              <button
                onClick={() => setStep('books')}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold border transition ${
                  isChildren
                    ? isLight
                      ? 'bg-white hover:bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-indigo-900 hover:bg-indigo-800 border-indigo-700 text-amber-200'
                    : isLight
                    ? 'bg-white hover:bg-stone-100 border-stone-300 text-stone-700'
                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                }`}
              >
                Switch Book
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isLight ? 'text-stone-400' : 'text-zinc-500'
                  }`}
                >
                  Select Chapter
                </span>
                <span className="text-[11px] text-stone-400">
                  Tap to view verses or jump in
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {/* Book Introduction Tile */}
                <button
                  onClick={() => handleSelectChapter(0)}
                  className={`h-12 rounded-xl text-xs font-bold flex flex-col items-center justify-center transition border ${
                    currentBook === selectedBook && currentChapter === 0
                      ? isChildren
                        ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-sm'
                        : isLight
                        ? 'bg-amber-700 border-amber-800 text-white shadow-sm'
                        : 'bg-amber-500 border-amber-400 text-zinc-950 shadow-sm'
                      : isChildren
                      ? isLight
                        ? 'bg-white hover:bg-amber-100 border-amber-200 text-slate-800'
                        : 'bg-[#182038] hover:bg-indigo-900 border-indigo-800 text-slate-200'
                      : isLight
                      ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                      : 'bg-[#1c1c1c] hover:bg-[#252525] border-zinc-800 text-zinc-200'
                  }`}
                >
                  <span>Intro</span>
                </button>

                {/* Numbered Chapter Tiles */}
                {Array.from({ length: activeBookObj.chapters }, (_, idx) => {
                  const ch = idx + 1;
                  const isCurrent =
                    currentBook === selectedBook && currentChapter === ch;
                  return (
                    <button
                      key={ch}
                      onClick={() => handleSelectChapter(ch)}
                      className={`h-12 rounded-xl text-sm font-bold flex items-center justify-center transition border ${
                        isCurrent
                          ? isChildren
                            ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-sm font-extrabold'
                            : isLight
                            ? 'bg-amber-700 border-amber-800 text-white shadow-sm font-serif'
                            : 'bg-amber-500 border-amber-400 text-zinc-950 shadow-sm font-serif'
                          : isChildren
                          ? isLight
                            ? 'bg-white hover:bg-amber-100 border-amber-200 text-slate-800 hover:scale-105 duration-100'
                            : 'bg-[#182038] hover:bg-indigo-900 border-indigo-800 text-slate-200'
                          : isLight
                          ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800 font-serif'
                          : 'bg-[#1c1c1c] hover:bg-[#252525] border-zinc-800 text-zinc-200 font-serif'
                      }`}
                    >
                      {ch}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* =================================================================
             STEP 3: DISPLAY VERSES OF SELECTED CHAPTER
             ================================================================= */
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            <div
              className={`rounded-2xl p-4 border flex items-center justify-between gap-3 ${
                isChildren
                  ? isLight
                    ? 'bg-gradient-to-r from-amber-100 via-orange-50 to-amber-100 border-amber-300 text-slate-900'
                    : 'bg-gradient-to-r from-indigo-950 to-purple-950 border-indigo-700 text-slate-100'
                  : isLight
                  ? 'bg-stone-50 border-stone-200 text-stone-900'
                  : 'bg-[#181818] border-zinc-800 text-zinc-100'
              }`}
            >
              <div>
                <h3
                  className={`text-lg sm:text-xl font-bold ${
                    isChildren ? 'font-sans' : 'font-serif'
                  }`}
                >
                  {selectedBook} {selectedChapter}
                </h3>
                <p className="text-xs text-stone-500 dark:text-zinc-400 mt-0.5">
                  Select a verse to jump directly into the reading view
                </p>
              </div>

              <button
                onClick={() => handleSelectVerse(1)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold shadow-sm transition ${
                  isChildren
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white font-extrabold'
                    : isLight
                    ? 'bg-amber-700 hover:bg-amber-800 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                }`}
              >
                Read Whole Chapter
              </button>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isLight ? 'text-stone-400' : 'text-zinc-500'
                  }`}
                >
                  Available Verses
                </span>
                <span className="text-[11px] text-stone-400">
                  {chapterVerses.length} verses
                </span>
              </div>

              {isLoadingVerses ? (
                <div className="py-12 text-center text-xs text-stone-400">
                  Loading verses for {selectedBook} {selectedChapter}...
                </div>
              ) : (
                <div className="grid grid-cols-6 sm:grid-cols-7 gap-2">
                  {chapterVerses.map((vNum) => (
                    <button
                      key={vNum}
                      onClick={() => handleSelectVerse(vNum)}
                      className={`h-11 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center transition border ${
                        isChildren
                          ? isLight
                            ? 'bg-white hover:bg-amber-200 border-amber-200 text-slate-800 hover:scale-105 duration-100'
                            : 'bg-[#182038] hover:bg-indigo-900 border-indigo-800 text-slate-200'
                          : isLight
                          ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800 font-serif'
                          : 'bg-[#1c1c1c] hover:bg-[#252525] border-zinc-800 text-zinc-200 font-serif'
                      }`}
                      title={`Jump to ${selectedBook} ${selectedChapter}:${vNum}`}
                    >
                      {vNum}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer with Quick Mode Info */}
        <div
          className={`px-5 py-3 border-t text-xs flex items-center justify-between ${
            isChildren
              ? isLight
                ? 'bg-amber-100/60 border-amber-200 text-amber-950'
                : 'bg-[#121729] border-indigo-800/80 text-amber-300'
              : isLight
              ? 'bg-stone-50 border-stone-200 text-stone-600'
              : 'bg-[#161616] border-zinc-800 text-zinc-400'
          }`}
        >
          <span className="truncate">
            {isChildren ? '🌈 Bible Kids Mode Explorer' : 'Canonical Bible Navigation'}
          </span>
          <button
            onClick={onClose}
            className={`font-semibold hover:underline ${
              isChildren
                ? isLight
                  ? 'text-orange-700'
                  : 'text-amber-300'
                : isLight
                ? 'text-amber-800'
                : 'text-amber-400'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
