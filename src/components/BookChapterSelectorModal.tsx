'use client';

import React, { useMemo, useState } from 'react';
import {
  ArrowDownAZ,
  ArrowLeft,
  Clock,
  Search,
  Volume2,
  X,
} from 'lucide-react';
import { BIBLE_BOOKS, parseScriptureReference } from '@/data/bibleBooks';
import { usePlatform } from '@/context/PlatformContext';
import { Testament } from '@/types/bible';

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

  const filteredBooks = useMemo(() => {
    let list = [...BIBLE_BOOKS];
    if (testamentFilter !== 'ALL') {
      list = list.filter((b) => b.testament === testamentFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const parsed = parseScriptureReference(searchQuery);
      if (parsed) {
        list = list.filter((b) => b.name.toLowerCase() === parsed.book.toLowerCase());
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
  }, [searchQuery, sortAlphabetical, testamentFilter]);

  if (!isOpen) return null;

  const handleDirectReferenceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseScriptureReference(searchQuery);
    if (parsed) {
      navigateToReferenceString(searchQuery, false);
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
              placeholder="Jump to book or verse (e.g. Matthew 1:23, Deuteronomy 32)..."
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
                  ? 'All 66 Books'
                  : tab === 'OT'
                  ? 'Old Testament (39)'
                  : 'New Testament (27)'}
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
          <div className="flex-1 overflow-y-auto px-5 py-2 space-y-1">
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
