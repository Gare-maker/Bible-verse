'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowDownAZ,
  ArrowLeft,
  BookOpen,
  Clock,
  Search,
  Volume2,
  X,
} from 'lucide-react';
import { BIBLE_BOOKS, parseScriptureReference } from '@/data/bibleBooks';
import { getVerseText, searchLocalScriptures } from '@/data/scriptureDatabase';
import { resolveScriptureVerse } from '@/services/bibleService';
import { usePlatform } from '@/context/PlatformContext';
import { Testament, VerseData } from '@/types/bible';

interface BookChapterSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookChapterSelectorModal({
  isOpen,
  onClose,
}: BookChapterSelectorModalProps) {
  const {
    currentBook,
    currentChapter,
    translation,
    navigateToPassage,
    navigateToReferenceString,
    readingHistory,
    preferences,
  } = usePlatform();

  const isLight = preferences.theme === 'light';

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBook, setExpandedBook] = useState<string>(currentBook);
  const [sortAlphabetical, setSortAlphabetical] = useState(false);
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | Testament>('ALL');
  const [showHistory, setShowHistory] = useState(false);
  const [resolvedDirectVerse, setResolvedDirectVerse] = useState<VerseData | null>(null);

  const parsedDirectRef = useMemo(
    () => parseScriptureReference(searchQuery),
    [searchQuery]
  );

  // Dynamically resolve direct verse reference if user typed e.g. "Matthew 3:5", "John 3:16", "Romans 8:28"
  useEffect(() => {
    let active = true;
    if (parsedDirectRef && parsedDirectRef.verse) {
      const refStr = `${parsedDirectRef.book} ${parsedDirectRef.chapter}:${parsedDirectRef.verse}`;
      resolveScriptureVerse(refStr, translation).then((res) => {
        if (!active) return;
        if (res?.verseData) {
          setResolvedDirectVerse(res.verseData);
        } else if (res?.text) {
          setResolvedDirectVerse({
            book: parsedDirectRef.book,
            chapter: parsedDirectRef.chapter,
            verse: parsedDirectRef.verse!,
            canonicalRef: refStr,
            translations: {
              NIV: res.text,
              KJV: res.text,
              ESV: res.text,
              NKJV: res.text,
              NLT: res.text,
              ASV: res.text,
            },
          });
        } else {
          setResolvedDirectVerse(null);
        }
      });
    } else {
      setResolvedDirectVerse(null);
    }
    return () => {
      active = false;
    };
  }, [parsedDirectRef, translation]);

  // Matching scripture verses by reference or phrase/text search
  const matchingVerses = useMemo(() => {
    const q = searchQuery.trim();
    if (q.length < 2) return [];
    const localMatches = searchLocalScriptures(q, translation);
    const list: VerseData[] = [...localMatches];
    if (
      resolvedDirectVerse &&
      !list.some(
        (v) =>
          v.canonicalRef.toLowerCase() ===
          resolvedDirectVerse.canonicalRef.toLowerCase()
      )
    ) {
      list.unshift(resolvedDirectVerse);
    }
    return list.slice(0, 10);
  }, [searchQuery, translation, resolvedDirectVerse]);

  const filteredBooks = useMemo(() => {
    let list = [...BIBLE_BOOKS];
    if (testamentFilter !== 'ALL') {
      list = list.filter((b) => b.testament === testamentFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      if (parsedDirectRef) {
        list = list.filter(
          (b) => b.name.toLowerCase() === parsedDirectRef.book.toLowerCase()
        );
      } else {
        list = list.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.abbreviation.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q)
        );
      }
    }
    if (sortAlphabetical) {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [searchQuery, sortAlphabetical, testamentFilter, parsedDirectRef]);

  if (!isOpen) return null;

  const handleDirectReferenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedDirectRef) {
      navigateToPassage(
        parsedDirectRef.book,
        parsedDirectRef.chapter,
        parsedDirectRef.verse
      );
      onClose();
    } else if (matchingVerses.length > 0) {
      const first = matchingVerses[0];
      navigateToPassage(first.book, first.chapter, first.verse);
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative flex h-full w-full max-w-lg flex-col sm:h-[84vh] sm:rounded-2xl sm:border shadow-2xl overflow-hidden ${
          isLight
            ? 'bg-white border-stone-200 text-stone-900'
            : 'bg-[#141414] border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`rounded-full p-1.5 transition ${
                isLight
                  ? 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
              aria-label="Close References"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-base font-bold tracking-tight">Select Book & Chapter</h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSortAlphabetical((prev) => !prev)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1 transition ${
                sortAlphabetical
                  ? isLight
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : isLight
                  ? 'text-stone-600 hover:bg-stone-100'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
              title="Toggle Alphabetical / Canonical Order"
            >
              <ArrowDownAZ className="h-4 w-4" />
              <span>{sortAlphabetical ? 'A–Z' : 'Canon'}</span>
            </button>
            <button
              onClick={() => setShowHistory((prev) => !prev)}
              className={`rounded-lg p-1.5 transition ${
                showHistory
                  ? isLight
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-500/20 text-amber-300'
                  : isLight
                  ? 'text-stone-600 hover:bg-stone-100'
                  : 'text-zinc-300 hover:bg-zinc-800'
              }`}
              title="Reading History"
            >
              <Clock className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className={`hidden sm:inline-flex rounded-lg p-1.5 transition ${
                isLight
                  ? 'text-stone-400 hover:bg-stone-100 hover:text-stone-800'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search & Testament Filters */}
        <div
          className={`px-5 py-3 space-y-2.5 ${
            isLight ? 'bg-stone-50/70' : 'bg-[#181818]'
          }`}
        >
          <form onSubmit={handleDirectReferenceSubmit} className="relative">
            <Search
              className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${
                isLight ? 'text-stone-400' : 'text-zinc-400'
              }`}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search book, reference (John 3:16), or verse text ('For God so loved')..."
              className={`w-full rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm border focus:outline-none ${
                isLight
                  ? 'bg-white border-stone-200/90 text-stone-900 placeholder-stone-400 focus:border-amber-700'
                  : 'bg-[#242424] border-zinc-700 text-zinc-100 placeholder-zinc-400 focus:border-amber-500'
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
          </form>

          <div className="flex items-center gap-1.5">
            {(['ALL', 'OT', 'NT'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTestamentFilter(tab)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  testamentFilter === tab
                    ? isLight
                      ? 'bg-stone-900 text-white'
                      : 'bg-zinc-100 text-zinc-900'
                    : isLight
                    ? 'bg-stone-200/70 text-stone-600 hover:bg-stone-200'
                    : 'bg-[#222222] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab === 'ALL'
                  ? 'All'
                  : tab === 'OT'
                  ? 'Old Testament'
                  : 'New Testament'}
              </button>
            ))}
          </div>
        </div>

        {/* Reading History or Book/Chapter Grid */}
        {showHistory ? (
          <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Recent Reading History
              </span>
              <button
                onClick={() => setShowHistory(false)}
                className={`text-xs font-semibold hover:underline ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}
              >
                Back to Books
              </button>
            </div>
            {readingHistory.map((item, i) => (
              <button
                key={`${item.book}-${item.chapter}-${i}`}
                onClick={() => {
                  navigateToPassage(item.book, item.chapter);
                  onClose();
                }}
                className={`w-full flex items-center justify-between rounded-xl px-4 py-3 text-left border transition ${
                  isLight
                    ? 'bg-stone-50 hover:bg-stone-100 border-stone-200/80'
                    : 'bg-[#1c1c1c] hover:bg-[#262626] border-zinc-800'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold">
                    {item.book} {item.chapter}
                  </p>
                  <p className="text-xs text-stone-500">Translation: {item.translation}</p>
                </div>
                <span className="text-xs text-stone-400">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-2 space-y-2">
            {/* Direct Reference Jump or Matching Scripture Verses */}
            {searchQuery.trim().length >= 2 && (parsedDirectRef || matchingVerses.length > 0) && (
              <div className="pt-1 pb-2 space-y-2">
                {parsedDirectRef && !parsedDirectRef.verse && (
                  <button
                    onClick={() => {
                      navigateToPassage(parsedDirectRef.book, parsedDirectRef.chapter);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left border transition ${
                      isLight
                        ? 'bg-amber-50/70 hover:bg-amber-50 border-amber-200 text-stone-900'
                        : 'bg-amber-500/10 hover:bg-amber-500/15 border-amber-500/30 text-zinc-100'
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                        Open Chapter
                      </span>
                      <p className="text-sm font-bold">
                        {parsedDirectRef.book} {parsedDirectRef.chapter}
                      </p>
                    </div>
                    <span className={`text-xs font-bold ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                      Go →
                    </span>
                  </button>
                )}

                {matchingVerses.length > 0 && (
                  <div
                    className={`rounded-2xl border overflow-hidden ${
                      isLight
                        ? 'bg-white border-stone-200/90 text-stone-900'
                        : 'bg-[#1a1a1a] border-zinc-800 text-zinc-100'
                    }`}
                  >
                    <div
                      className={`px-3.5 py-2 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider ${
                        isLight ? 'bg-stone-50 text-stone-500' : 'bg-[#202020] text-zinc-400'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5 text-amber-600" />
                        Matching Scriptures
                      </span>
                      <span>{translation}</span>
                    </div>
                    {matchingVerses.map((v, idx) => (
                      <React.Fragment key={v.canonicalRef}>
                        {idx > 0 && (
                          <div className={`h-px w-full ${isLight ? 'bg-stone-200/80' : 'bg-zinc-800'}`} />
                        )}
                        <button
                          onClick={() => {
                            navigateToPassage(v.book, v.chapter, v.verse);
                            onClose();
                          }}
                          className={`w-full px-3.5 py-3 text-left transition ${
                            isLight ? 'hover:bg-stone-50' : 'hover:bg-[#242424]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className={`text-xs font-bold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                              {v.book} {v.chapter}:{v.verse}
                            </span>
                            <span className={`text-[11px] font-semibold ${isLight ? 'text-stone-400' : 'text-zinc-500'}`}>
                              Open passage →
                            </span>
                          </div>
                          <p className={`text-xs font-serif leading-relaxed line-clamp-2 ${isLight ? 'text-stone-700' : 'text-zinc-300'}`}>
                            {v.translations[translation] || v.translations.NIV}
                          </p>
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}

            {filteredBooks.map((book) => {
              const isExpanded =
                expandedBook.toLowerCase() === book.name.toLowerCase() ||
                filteredBooks.length === 1;

              return (
                <div key={book.id} className="py-3">
                  <button
                    onClick={() =>
                      setExpandedBook(isExpanded && filteredBooks.length > 1 ? '' : book.name)
                    }
                    className="w-full flex items-center justify-between py-1 text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-sm sm:text-base font-semibold transition ${
                          currentBook === book.name
                            ? isLight
                              ? 'text-amber-800'
                              : 'text-amber-400'
                            : isLight
                            ? 'text-stone-800 group-hover:text-stone-950'
                            : 'text-zinc-100 group-hover:text-white'
                        }`}
                      >
                        {book.name}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {book.category} • {book.chapters} ch
                      </span>
                    </div>
                    <Volume2 className="h-4 w-4 text-stone-400" />
                  </button>

                  {isExpanded && (
                    <div className="mt-3 grid grid-cols-5 gap-2">
                      <button
                        onClick={() => {
                          navigateToPassage(book.name, 0);
                          onClose();
                        }}
                        className={`h-11 rounded-xl text-xs font-semibold flex items-center justify-center transition ${
                          currentBook === book.name && currentChapter === 0
                            ? isLight
                              ? 'bg-amber-700 text-white'
                              : 'bg-amber-500 text-zinc-950'
                            : isLight
                            ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            : 'bg-[#262626] text-zinc-200 hover:bg-[#333333]'
                        }`}
                      >
                        Intro
                      </button>
                      {Array.from({ length: book.chapters }, (_, idx) => {
                        const ch = idx + 1;
                        const isSelected =
                          currentBook === book.name && currentChapter === ch;
                        return (
                          <button
                            key={ch}
                            onClick={() => {
                              navigateToPassage(book.name, ch);
                              onClose();
                            }}
                            className={`h-11 rounded-xl text-sm font-semibold flex items-center justify-center transition ${
                              isSelected
                                ? isLight
                                  ? 'bg-amber-700 text-white shadow-sm'
                                  : 'bg-amber-500 text-zinc-950 shadow-sm'
                                : isLight
                                ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                                : 'bg-[#262626] text-zinc-200 hover:bg-[#333333]'
                            }`}
                          >
                            {ch}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
