'use client';

import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Compass,
  Link2,
  Search,
  Users,
  X,
} from 'lucide-react';
import { BIBLE_BOOKS, parseScriptureReference } from '@/data/bibleBooks';
import { searchLocalScriptures } from '@/data/scriptureDatabase';
import { CANONICAL_CROSS_REFERENCES, getCrossReferencesForVerse } from '@/data/crossReferences';
import { usePlatform } from '@/context/PlatformContext';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenReferencePanel?: (canonicalRef: string) => void;
}

const BIBLICAL_THEMES_AND_PEOPLE = [
  {
    name: 'Immanuel / Virgin Birth',
    type: 'Theme',
    description: 'Prophecy and fulfilment of God dwelling with His people.',
    references: ['Matthew 1:23', 'Isaiah 7:14', 'John 1:14'],
  },
  {
    name: 'Creation & The Eternal Word (Logos)',
    type: 'Theme',
    description: 'Cosmic creation through the spoken Word of God.',
    references: ['Genesis 1:1', 'John 1:1', 'Colossians 1:16', 'Hebrews 1:2'],
  },
  {
    name: 'Moses & The Song of Moses',
    type: 'Person / Theme',
    description: 'Covenant renewal, YHWH as the Rock and Father of Israel.',
    references: ['Deuteronomy 32:1', 'Deuteronomy 32:4', 'Deuteronomy 32:6', '1 Corinthians 10:4'],
  },
  {
    name: 'Reconciliation & Church Discipline',
    type: 'Theme',
    description: 'Winning back a sinning brother and the witness of two or three.',
    references: ['Matthew 18:15', 'Matthew 18:16', 'Matthew 18:20', 'Deuteronomy 19:15', 'Leviticus 19:17'],
  },
  {
    name: 'The Suffering Servant & Atonement',
    type: 'Theme',
    description: 'Messianic substitutionary suffering and healing by His wounds.',
    references: ['Isaiah 53:5', '1 Peter 2:24', 'Psalms 22:1', 'Matthew 27:46'],
  },
  {
    name: 'Abraham & Davidic Covenants',
    type: 'Person / Covenant',
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

  const parsedDirectRef = useMemo(() => parseScriptureReference(query), [query]);

  const matchingBooks = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return BIBLE_BOOKS.filter(
      (b) => b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [query]);

  const matchingVerses = useMemo(() => {
    if (!query.trim()) return [];
    return searchLocalScriptures(query, translation).slice(0, 12);
  }, [query, translation]);

  const matchingCrossRefs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CANONICAL_CROSS_REFERENCES.filter(
      (r) =>
        r.sourceRef.toLowerCase().includes(q) ||
        r.targetRef.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.sourceToTargetCategory.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [query]);

  const matchingThemes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return BIBLICAL_THEMES_AND_PEOPLE;
    return BIBLICAL_THEMES_AND_PEOPLE.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.references.some((r) => r.toLowerCase().includes(q))
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden my-auto sm:my-8 ${
          isLight
            ? 'bg-white border-stone-200 text-stone-900'
            : 'bg-[#141414] border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Search Input Header */}
        <div
          className={`flex items-center gap-3 px-5 py-4 border-b ${
            isLight ? 'bg-stone-50/70 border-stone-200' : 'bg-[#181818] border-zinc-800'
          }`}
        >
          <Search className={`h-5 w-5 shrink-0 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search references (Matthew 1:23), phrases ('virgin', 'Rock'), books, people, or themes..."
            autoFocus
            className="w-full bg-transparent text-sm sm:text-base placeholder-stone-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-stone-400 hover:text-stone-700 px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:text-stone-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-5 space-y-6">
          {parsedDirectRef && (
            <div
              className={`rounded-xl border p-4 flex items-center justify-between ${
                isLight
                  ? 'bg-amber-50/80 border-amber-200 text-stone-900'
                  : 'bg-amber-500/10 border-amber-500/30 text-white'
              }`}
            >
              <div>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isLight ? 'text-amber-800' : 'text-amber-400'
                  }`}
                >
                  Direct Scripture Jump
                </span>
                <p className="text-base font-bold mt-0.5">
                  {parsedDirectRef.book} {parsedDirectRef.chapter}
                  {parsedDirectRef.verse ? `:${parsedDirectRef.verse}` : ''}
                </p>
              </div>
              <button
                onClick={() => {
                  navigateToPassage(
                    parsedDirectRef.book,
                    parsedDirectRef.chapter,
                    parsedDirectRef.verse
                  );
                  onClose();
                }}
                className={`rounded-lg font-bold px-4 py-2 text-xs transition ${
                  isLight
                    ? 'bg-amber-700 hover:bg-amber-800 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                }`}
              >
                Open Passage
              </button>
            </div>
          )}

          {matchingVerses.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-amber-600" />
                Scripture Passages ({matchingVerses.length})
              </h3>
              <div className="space-y-2">
                {matchingVerses.map((v) => {
                  const refs = getCrossReferencesForVerse(v.canonicalRef);
                  return (
                    <div
                      key={v.canonicalRef}
                      className={`rounded-xl border p-3.5 transition ${
                        isLight
                          ? 'bg-stone-50/70 border-stone-200 hover:border-stone-300'
                          : 'bg-[#1d1d1d] border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <button
                          onClick={() => {
                            navigateToReferenceString(v.canonicalRef);
                            onClose();
                          }}
                          className={`text-sm font-bold hover:underline ${
                            isLight ? 'text-amber-800' : 'text-amber-400'
                          }`}
                        >
                          {v.canonicalRef} ({translation})
                        </button>
                        <div className="flex items-center gap-2">
                          {refs.length > 0 && (
                            <button
                              onClick={() => {
                                navigateToReferenceString(v.canonicalRef);
                                onClose();
                                if (onOpenReferencePanel) {
                                  onOpenReferencePanel(v.canonicalRef);
                                }
                              }}
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition ${
                                isLight
                                  ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                                  : 'bg-amber-500/15 text-amber-300'
                              }`}
                            >
                              {refs.length} {refs.length === 1 ? 'Reference' : 'References'}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              navigateToReferenceString(v.canonicalRef);
                              onClose();
                            }}
                            className="text-xs font-semibold text-stone-500 hover:text-stone-900"
                          >
                            Read →
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-serif leading-relaxed">
                        {v.translations[translation]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {matchingCrossRefs.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                <Link2 className="h-3.5 w-3.5 text-emerald-600" />
                Connected Scripture References ({matchingCrossRefs.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {matchingCrossRefs.map((xref) => (
                  <button
                    key={xref.id}
                    onClick={() => {
                      navigateToReferenceString(xref.sourceRef);
                      onClose();
                      if (onOpenReferencePanel) {
                        onOpenReferencePanel(xref.sourceRef);
                      }
                    }}
                    className={`rounded-xl border p-3 text-left transition ${
                      isLight
                        ? 'bg-stone-50 hover:bg-amber-50/40 border-stone-200'
                        : 'bg-[#1d1d1d] border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className={isLight ? 'text-amber-800' : 'text-amber-300'}>
                        {xref.sourceRef} ↔ {xref.targetRef}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] ${
                          isLight ? 'bg-stone-200 text-stone-700' : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {xref.sourceToTargetCategory}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 font-medium mt-1">{xref.title}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingBooks.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                <Compass className="h-3.5 w-3.5 text-blue-600" />
                Bible Books
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchingBooks.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      navigateToPassage(b.name, 1);
                      onClose();
                    }}
                    className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                      isLight
                        ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
                        : 'bg-[#222222] border-zinc-800 text-zinc-100'
                    }`}
                  >
                    {b.name} ({b.chapters} ch)
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-amber-700" />
              Biblical People, Covenants & Themes
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchingThemes.map((theme) => (
                <div
                  key={theme.name}
                  className={`rounded-xl border p-3.5 space-y-2 ${
                    isLight
                      ? 'bg-stone-50/70 border-stone-200/80'
                      : 'bg-[#1b1b1b] border-zinc-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{theme.name}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        isLight ? 'bg-stone-200 text-stone-600' : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {theme.type}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">{theme.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {theme.references.map((ref) => (
                      <button
                        key={ref}
                        onClick={() => {
                          navigateToReferenceString(ref);
                          onClose();
                          if (onOpenReferencePanel) {
                            onOpenReferencePanel(ref);
                          }
                        }}
                        className={`rounded-md border px-2 py-1 text-[11px] font-semibold transition ${
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
        </div>
      </div>
    </div>
  );
}
