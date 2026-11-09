'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Link2,
  Search,
  Users,
  X,
} from 'lucide-react';
import { parseScriptureReference } from '@/data/bibleBooks';
import { searchLocalScriptures } from '@/data/scriptureDatabase';
import { resolveScriptureVerse } from '@/services/bibleService';
import { CANONICAL_CROSS_REFERENCES, getCrossReferencesForVerse } from '@/data/crossReferences';
import { usePlatform } from '@/context/PlatformContext';
import { VerseData } from '@/types/bible';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReferencePanel?: (canonicalRef: string) => void;
}

type SearchTab = 'ALL' | 'SCRIPTURES' | 'REFERENCES' | 'TOPICS';

const BIBLICAL_THEMES_AND_TOPICS = [
  {
    name: 'Immanuel / Virgin Birth',
    type: 'Topic',
    description: 'Prophecy and fulfilment of God dwelling with His people.',
    references: ['Matthew 1:23', 'Isaiah 7:14', 'John 1:14'],
  },
  {
    name: 'Creation & The Eternal Word (Logos)',
    type: 'Topic',
    description: 'Cosmic creation through the spoken Word of God.',
    references: ['Genesis 1:1', 'John 1:1', 'Colossians 1:16', 'Hebrews 1:2'],
  },
  {
    name: 'Moses & The Song of Moses',
    type: 'Topic',
    description: 'Covenant renewal, YHWH as the Rock and Father of Israel.',
    references: ['Deuteronomy 32:1', 'Deuteronomy 32:4', 'Deuteronomy 32:6', '1 Corinthians 10:4'],
  },
  {
    name: 'Reconciliation & Restoration',
    type: 'Topic',
    description: 'Winning back a brother and the witness of two or three.',
    references: ['Matthew 18:15', 'Matthew 18:16', 'Matthew 18:20', 'Deuteronomy 19:15', 'Leviticus 19:17'],
  },
  {
    name: 'The Suffering Servant & Atonement',
    type: 'Topic',
    description: 'Messianic substitutionary suffering and healing by His wounds.',
    references: ['Isaiah 53:5', '1 Peter 2:24', 'Psalms 22:1', 'Matthew 27:46'],
  },
  {
    name: 'Abraham & Davidic Covenants',
    type: 'Topic',
    description: 'Royal Messianic lineage promised to Abraham and King David.',
    references: ['Matthew 1:1', 'Genesis 12:3', '2 Samuel 7:12', 'Micah 5:2'],
  },
];

export default function GlobalSearchModal({
  isOpen,
  onClose,
  onOpenReferencePanel,
}: GlobalSearchModalProps) {
  const { translation, navigateToPassage, navigateToReferenceString, preferences } = usePlatform();
  const isLight = preferences.theme === 'light';
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('ALL');
  const [resolvedDirectVerse, setResolvedDirectVerse] = useState<VerseData | null>(null);

  const parsedDirectRef = useMemo(() => parseScriptureReference(query), [query]);

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

  const matchingVerses = useMemo(() => {
    const q = query.trim();
    if (!q) {
      return activeTab === 'SCRIPTURES'
        ? searchLocalScriptures('God', translation).slice(0, 8)
        : [];
    }
    const localMatches = searchLocalScriptures(q, translation);
    const list: VerseData[] = [...localMatches];
    if (
      resolvedDirectVerse &&
      !list.some(
        (v) => v.canonicalRef.toLowerCase() === resolvedDirectVerse.canonicalRef.toLowerCase()
      )
    ) {
      list.unshift(resolvedDirectVerse);
    }
    return list.slice(0, 12);
  }, [query, translation, resolvedDirectVerse, activeTab]);

  const matchingCrossRefs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return activeTab === 'REFERENCES'
        ? CANONICAL_CROSS_REFERENCES.slice(0, 10)
        : CANONICAL_CROSS_REFERENCES.slice(0, 4);
    }
    return CANONICAL_CROSS_REFERENCES.filter(
      (r) =>
        r.sourceRef.toLowerCase().includes(q) ||
        r.targetRef.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        (r.explanation && r.explanation.toLowerCase().includes(q)) ||
        (r.biblicalContext && r.biblicalContext.toLowerCase().includes(q)) ||
        r.sourceToTargetCategory.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query, activeTab]);

  const matchingTopics = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BIBLICAL_THEMES_AND_TOPICS;
    return BIBLICAL_THEMES_AND_TOPICS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.references.some((r) => r.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isOpen) return null;

  const showScriptures = activeTab === 'ALL' || activeTab === 'SCRIPTURES';
  const showReferences = activeTab === 'ALL' || activeTab === 'REFERENCES';
  const showTopics = activeTab === 'ALL' || activeTab === 'TOPICS';

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden my-auto sm:my-8 ${
          isLight
            ? 'bg-white border-stone-200 text-stone-900'
            : 'bg-[#141414] border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Minimal Search Input Header */}
        <div
          className={`px-4 py-3 border-b ${
            isLight ? 'bg-stone-50/70 border-stone-200/80' : 'bg-[#181818] border-zinc-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Search className={`h-4 w-4 shrink-0 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search words, phrases, statements, topics, or references..."
              autoFocus
              className="w-full bg-transparent text-xs sm:text-sm placeholder-stone-400 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-[11px] font-medium text-stone-400 hover:text-stone-700 px-1.5 py-0.5 shrink-0"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-stone-400 hover:text-stone-700 dark:hover:text-zinc-200 transition shrink-0"
              aria-label="Close Search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Clean Category Tabs (No figures/counts) */}
          <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'ALL', label: 'All' },
                { id: 'SCRIPTURES', label: 'Scriptures' },
                { id: 'REFERENCES', label: 'References' },
                { id: 'TOPICS', label: 'Topics' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? isLight
                      ? 'bg-stone-900 text-white'
                      : 'bg-zinc-100 text-zinc-900'
                    : isLight
                    ? 'bg-stone-200/70 text-stone-600 hover:bg-stone-200'
                    : 'bg-[#222222] text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results Body */}
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-4">
          {/* Direct Reference Jump */}
          {parsedDirectRef && (
            <div
              className={`rounded-xl border px-3.5 py-2.5 flex items-center justify-between gap-3 ${
                isLight
                  ? 'bg-amber-50/70 border-amber-200 text-stone-900'
                  : 'bg-amber-500/10 border-amber-500/30 text-white'
              }`}
            >
              <div className="min-w-0">
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider block ${
                    isLight ? 'text-amber-800' : 'text-amber-400'
                  }`}
                >
                  Direct Scripture
                </span>
                <p className="text-xs sm:text-sm font-bold truncate">
                  {parsedDirectRef.book} {parsedDirectRef.chapter}
                  {parsedDirectRef.verse ? `:${parsedDirectRef.verse}` : ''}
                </p>
              </div>
              <button
                onClick={() => {
                  navigateToPassage(
                    parsedDirectRef.book,
                    parsedDirectRef.chapter,
                    parsedDirectRef.verse,
                    true
                  );
                  onClose();
                }}
                className={`rounded-lg font-semibold px-3 py-1.5 text-xs transition shrink-0 ${
                  isLight
                    ? 'bg-amber-700 hover:bg-amber-800 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                }`}
              >
                Open
              </button>
            </div>
          )}

          {/* Scriptures Section */}
          {showScriptures && matchingVerses.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-amber-600" />
                <span>Scriptures</span>
              </h3>
              <div className="space-y-2">
                {matchingVerses.map((v) => {
                  const refs = getCrossReferencesForVerse(v.canonicalRef);
                  return (
                    <div
                      key={v.canonicalRef}
                      className={`rounded-xl border p-3 transition ${
                        isLight
                          ? 'bg-stone-50/60 border-stone-200/90 hover:border-stone-300'
                          : 'bg-[#1b1b1b] border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <button
                          onClick={() => {
                            navigateToReferenceString(v.canonicalRef, true);
                            onClose();
                          }}
                          className={`text-xs font-bold hover:underline ${
                            isLight ? 'text-amber-800' : 'text-amber-400'
                          }`}
                        >
                          {v.canonicalRef} ({translation})
                        </button>
                        <div className="flex items-center gap-2">
                          {refs.length > 0 && (
                            <button
                              onClick={() => {
                                navigateToReferenceString(v.canonicalRef, true);
                                onClose();
                                if (onOpenReferencePanel) {
                                  onOpenReferencePanel(v.canonicalRef);
                                }
                              }}
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition ${
                                isLight
                                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                  : 'bg-amber-500/15 text-amber-300'
                              }`}
                            >
                              Reference
                            </button>
                          )}
                          <button
                            onClick={() => {
                              navigateToReferenceString(v.canonicalRef, true);
                              onClose();
                            }}
                            className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-zinc-200"
                          >
                            Open →
                          </button>
                        </div>
                      </div>
                      <p className="text-xs font-serif leading-relaxed text-stone-700 dark:text-zinc-300">
                        {v.translations[translation] || v.translations.NIV}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* References Section (Consistent with Scriptures & Topics tabs) */}
          {showReferences && matchingCrossRefs.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>References</span>
              </h3>
              <div className="space-y-2">
                {matchingCrossRefs.map((xref) => (
                  <div
                    key={xref.id}
                    className={`rounded-xl border p-3 transition ${
                      isLight
                        ? 'bg-stone-50/60 border-stone-200/90 hover:border-stone-300'
                        : 'bg-[#1b1b1b] border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            navigateToReferenceString(xref.sourceRef, true);
                            onClose();
                          }}
                          className={`text-xs font-bold hover:underline ${
                            isLight ? 'text-amber-800' : 'text-amber-400'
                          }`}
                        >
                          {xref.sourceRef}
                        </button>
                        <span className="text-[11px] text-stone-400">↔</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigateToReferenceString(xref.targetRef, true);
                            onClose();
                          }}
                          className={`text-xs font-bold hover:underline ${
                            isLight ? 'text-emerald-800' : 'text-emerald-400'
                          }`}
                        >
                          {xref.targetRef}
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigateToReferenceString(xref.sourceRef, true);
                          onClose();
                          if (onOpenReferencePanel) {
                            onOpenReferencePanel(xref.sourceRef);
                          }
                        }}
                        className="text-[11px] font-semibold text-stone-500 hover:text-stone-900 dark:hover:text-zinc-200 shrink-0"
                      >
                        Open →
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-stone-800 dark:text-zinc-200">
                      {xref.title}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-zinc-400 leading-relaxed mt-0.5 line-clamp-2">
                      {xref.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Topics & Statements Section */}
          {showTopics && matchingTopics.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-amber-700" />
                <span>Topics & Expressions</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchingTopics.map((topic) => (
                  <div
                    key={topic.name}
                    className={`rounded-xl border p-3 space-y-1.5 ${
                      isLight
                        ? 'bg-stone-50/60 border-stone-200/80'
                        : 'bg-[#1b1b1b] border-zinc-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold">{topic.name}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                          isLight ? 'bg-stone-200/80 text-stone-600' : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {topic.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-zinc-400 leading-relaxed">
                      {topic.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {topic.references.map((ref) => (
                        <button
                          key={ref}
                          onClick={() => {
                            navigateToReferenceString(ref, true);
                            onClose();
                          }}
                          className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold transition ${
                            isLight
                              ? 'bg-white hover:bg-amber-50 border-stone-200 text-amber-800'
                              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                          }`}
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

          {/* Empty Search State */}
          {query.trim() &&
            !parsedDirectRef &&
            ((activeTab === 'SCRIPTURES' && matchingVerses.length === 0) ||
              (activeTab === 'REFERENCES' && matchingCrossRefs.length === 0) ||
              (activeTab === 'TOPICS' && matchingTopics.length === 0) ||
              (activeTab === 'ALL' &&
                matchingVerses.length === 0 &&
                matchingCrossRefs.length === 0 &&
                matchingTopics.length === 0)) && (
              <div className="py-8 text-center text-xs text-stone-500">
                No matching scriptures, references, or topics found for &ldquo;{query}&rdquo;.
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
