'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkPlus,
  Compass,
  Folder,
  Heart,
  Link2,
  MessageSquareQuote,
  Search,
  X,
} from 'lucide-react';
import {
  NotebookCollection,
  SavedConnection,
  SavedContextItem,
  SavedVerseItem,
} from '@/types/bible';
import { usePlatform } from '@/context/PlatformContext';

type CommunityContentFilter = 'all' | 'connections' | 'context' | 'verses';
type CommunitySearchCategory = 'collections' | 'connections' | 'context' | 'verses';

export default function CommunityPage() {
  const {
    communityConnections,
    communityContexts,
    communityVerses,
    collections,
    likeCommunityItem,
    likedItemIds,
    saveConnectionToNotes,
    saveContextItem,
    saveBibleVerseItem,
    preferences,
  } = usePlatform();

  const isLight = preferences.theme === 'light';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  // Main page content filter: All | Connections | Contexts | Bible Verses
  const [contentFilter, setContentFilter] = useState<CommunityContentFilter>('all');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('ALL');

  // Dedicated WhatsApp-style Search View state
  const [isSearchViewOpen, setIsSearchViewOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState<CommunitySearchCategory>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSearchViewOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 40);
    }
  }, [isSearchViewOpen]);

  const getCollectionName = (colId?: string) => {
    if (!colId) return 'General Collection';
    return collections.find((c) => c.id === colId)?.name || 'General Collection';
  };

  // Main page filtered items (by selectedCollectionId)
  const filteredConnections = useMemo(() => {
    return communityConnections.filter((c) => {
      if (selectedCollectionId !== 'ALL' && c.collectionId !== selectedCollectionId) {
        return false;
      }
      return true;
    });
  }, [communityConnections, selectedCollectionId]);

  const filteredContexts = useMemo(() => {
    return communityContexts.filter((c) => {
      if (selectedCollectionId !== 'ALL' && c.collectionId !== selectedCollectionId) {
        return false;
      }
      return true;
    });
  }, [communityContexts, selectedCollectionId]);

  const filteredVerses = useMemo(() => {
    return communityVerses.filter((v) => {
      if (selectedCollectionId !== 'ALL' && v.collectionId !== selectedCollectionId) {
        return false;
      }
      return true;
    });
  }, [communityVerses, selectedCollectionId]);

  // Dedicated Search View results (by searchCategory and searchQuery)
  const searchedCollections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return collections.filter((col) => {
      if (!q) return true;
      return (
        col.name.toLowerCase().includes(q) ||
        col.description.toLowerCase().includes(q)
      );
    });
  }, [collections, searchQuery]);

  const searchedConnections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return communityConnections.filter((c) => {
      if (!q) return true;
      return (
        c.primaryRef.toLowerCase().includes(q) ||
        c.connectedRef.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.primaryText.toLowerCase().includes(q) ||
        c.connectedText.toLowerCase().includes(q) ||
        c.personalObservation.toLowerCase().includes(q) ||
        (c.authorName || '').toLowerCase().includes(q) ||
        getCollectionName(c.collectionId).toLowerCase().includes(q)
      );
    });
  }, [communityConnections, searchQuery, collections]);

  const searchedContexts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return communityContexts.filter((c) => {
      if (!q) return true;
      return (
        c.verseRef.toLowerCase().includes(q) ||
        c.verseText.toLowerCase().includes(q) ||
        c.mainTheme.toLowerCase().includes(q) ||
        c.contextSummary.toLowerCase().includes(q) ||
        c.personalNotes.toLowerCase().includes(q) ||
        (c.authorName || '').toLowerCase().includes(q) ||
        getCollectionName(c.collectionId).toLowerCase().includes(q)
      );
    });
  }, [communityContexts, searchQuery, collections]);

  const searchedVerses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return communityVerses.filter((v) => {
      if (!q) return true;
      return (
        v.verseRef.toLowerCase().includes(q) ||
        v.verseText.toLowerCase().includes(q) ||
        v.personalNotes.toLowerCase().includes(q) ||
        (v.authorName || '').toLowerCase().includes(q) ||
        getCollectionName(v.collectionId).toLowerCase().includes(q)
      );
    });
  }, [communityVerses, searchQuery, collections]);

  const renderConnectionCard = (conn: SavedConnection) => {
    const isLiked = likedItemIds.includes(conn.id);
    const count = (conn.likesCount || 1) + (isLiked ? 1 : 0);
    const fullTag = `${conn.primaryRef} ↔ ${conn.connectedRef}`;
    const colLabel = getCollectionName(conn.collectionId);

    return (
      <div
        key={conn.id}
        className={`rounded-2xl border overflow-hidden transition ${
          isLight
            ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
            : 'bg-[#161616] border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Top Row: Truncated Tag & Collection on Left; Like & Save on Right (Never Overlaps) */}
        <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            <span
              title={fullTag}
              className={`rounded-md px-2 py-0.5 text-xs font-semibold truncate max-w-[150px] sm:max-w-[240px] md:max-w-[320px] block ${
                isLight
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {fullTag}
            </span>
            <span
              title={colLabel}
              className={`text-[11px] font-medium truncate min-w-0 ${
                isLight ? 'text-stone-500' : 'text-zinc-400'
              }`}
            >
              • {colLabel}
            </span>
            <span
              className={`text-[11px] hidden md:inline truncate ${
                isLight ? 'text-stone-400' : 'text-zinc-400'
              }`}
            >
              • by {conn.authorName || 'Community Reader'}
            </span>
          </div>

          {/* Compact Community Actions: Like & Save */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => likeCommunityItem(conn.id)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                isLiked
                  ? isLight
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : isLight
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-100'
              }`}
              title="Like"
            >
              <Heart
                className={`h-3.5 w-3.5 shrink-0 ${
                  isLiked ? 'fill-current' : ''
                }`}
              />
              <span>{count}</span>
            </button>

            <button
              onClick={() =>
                saveConnectionToNotes({
                  title: conn.title,
                  primaryRef: conn.primaryRef,
                  connectedRef: conn.connectedRef,
                  primaryText: conn.primaryText,
                  connectedText: conn.connectedText,
                  translation: conn.translation,
                  category: conn.category,
                  personalObservation: conn.personalObservation,
                  collectionId: conn.collectionId,
                  sharedToCommunity: false,
                })
              }
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                isLight
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-300'
              }`}
              title="Save to My Saved"
            >
              <BookmarkPlus className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>

        {conn.title && (
          <>
            <div
              className={`h-px w-full ${
                isLight ? 'bg-stone-200/80' : 'bg-zinc-800'
              }`}
            />
            <div className="px-4 sm:px-5 py-2.5">
              <h3
                className={`text-xs sm:text-sm font-bold ${
                  isLight ? 'text-stone-900' : 'text-zinc-100'
                }`}
              >
                {conn.title}
              </h3>
            </div>
          </>
        )}

        <div
          className={`h-px w-full ${
            isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
          }`}
        />

        {/* Primary Scripture */}
        <div className="px-4 sm:px-5 py-3.5 space-y-1">
          <span
            className={`text-xs font-bold block ${
              isLight ? 'text-amber-800' : 'text-amber-400'
            }`}
          >
            {conn.primaryRef} ({conn.translation})
          </span>
          <p
            className={`font-serif text-xs sm:text-sm leading-relaxed ${
              isLight ? 'text-stone-800' : 'text-zinc-100'
            }`}
          >
            “{conn.primaryText}”
          </p>
        </div>

        <div
          className={`h-px w-full ${
            isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
          }`}
        />

        {/* Connected Scripture */}
        <div className="px-4 sm:px-5 py-3.5 space-y-1">
          <span
            className={`text-xs font-bold block ${
              isLight ? 'text-amber-800' : 'text-amber-400'
            }`}
          >
            {conn.connectedRef} ({conn.translation})
          </span>
          <p
            className={`font-serif text-xs sm:text-sm leading-relaxed ${
              isLight ? 'text-stone-800' : 'text-zinc-100'
            }`}
          >
            “{conn.connectedText}”
          </p>
        </div>

        <div
          className={`h-px w-full ${
            isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
          }`}
        />

        {/* Contributor's Personal Notes & Reflections */}
        <div
          className={`px-4 sm:px-5 py-3.5 space-y-1.5 text-xs leading-relaxed ${
            isLight ? 'text-stone-800' : 'text-zinc-200'
          }`}
        >
          <span
            className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-amber-800' : 'text-amber-400'
            }`}
          >
            <MessageSquareQuote className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              Reader’s Perspective ({conn.authorName || 'Community Reader'})
            </span>
          </span>
          <p>
            {conn.personalObservation ||
              'Shared this verified scripture connection with the community.'}
          </p>
        </div>
      </div>
    );
  };

  const renderContextCard = (ctx: SavedContextItem) => {
    const isLiked = likedItemIds.includes(ctx.id);
    const count = (ctx.likesCount || 1) + (isLiked ? 1 : 0);
    const fullRef = `${ctx.verseRef} (${ctx.translation})`;

    return (
      <div
        key={ctx.id}
        className={`rounded-2xl border overflow-hidden transition ${
          isLight
            ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
            : 'bg-[#161616] border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Top Row: Reference, Theme, Contributor & Actions */}
        <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            <span
              title={fullRef}
              className={`rounded-md px-2 py-0.5 text-xs font-semibold truncate max-w-[140px] sm:max-w-[220px] block ${
                isLight
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {fullRef}
            </span>
            <span
              title={ctx.mainTheme}
              className={`text-[11px] font-medium truncate min-w-0 ${
                isLight ? 'text-stone-500' : 'text-zinc-400'
              }`}
            >
              • {ctx.mainTheme}
            </span>
            <span
              className={`text-[11px] hidden md:inline truncate ${
                isLight ? 'text-stone-400' : 'text-zinc-400'
              }`}
            >
              • by {ctx.authorName || 'Community Reader'}
            </span>
          </div>

          {/* Compact Actions: Like & Save */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => likeCommunityItem(ctx.id)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                isLiked
                  ? isLight
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : isLight
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-100'
              }`}
              title="Like"
            >
              <Heart
                className={`h-3.5 w-3.5 shrink-0 ${
                  isLiked ? 'fill-current' : ''
                }`}
              />
              <span>{count}</span>
            </button>

            <button
              onClick={() =>
                saveContextItem({
                  verseRef: ctx.verseRef,
                  verseText: ctx.verseText,
                  translation: ctx.translation,
                  mainTheme: ctx.mainTheme,
                  verseBreakdown: ctx.verseBreakdown,
                  contextSummary: ctx.contextSummary,
                  personalNotes: ctx.personalNotes,
                  collectionId: ctx.collectionId,
                  sharedToCommunity: false,
                })
              }
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                isLight
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-300'
              }`}
              title="Save to My Saved"
            >
              <BookmarkPlus className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>

        <div
          className={`h-px w-full ${
            isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
          }`}
        />

        {/* Scripture Text */}
        <div
          className={`px-4 sm:px-5 py-3.5 font-serif text-sm leading-relaxed ${
            isLight ? 'text-stone-900' : 'text-zinc-100'
          }`}
        >
          “{ctx.verseText}”
        </div>

        {/* Breakdown Points separated by horizontal dividers */}
        {ctx.verseBreakdown.map((pt, i) => (
          <React.Fragment key={i}>
            <div
              className={`h-px w-full ${
                isLight ? 'bg-stone-200/80' : 'bg-zinc-800'
              }`}
            />
            <div
              className={`px-4 sm:px-5 py-3 text-xs leading-relaxed ${
                isLight ? 'text-stone-800' : 'text-zinc-200'
              }`}
            >
              {pt}
            </div>
          </React.Fragment>
        ))}

        <div
          className={`h-px w-full ${
            isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
          }`}
        />

        {/* Contributor's Personal Notes & Reflections */}
        <div
          className={`px-4 sm:px-5 py-3.5 space-y-1.5 text-xs leading-relaxed ${
            isLight ? 'text-stone-800' : 'text-zinc-200'
          }`}
        >
          <span
            className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-amber-800' : 'text-amber-400'
            }`}
          >
            <MessageSquareQuote className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              Reader’s Perspective ({ctx.authorName || 'Community Reader'})
            </span>
          </span>
          <p>
            {ctx.personalNotes ||
              'Shared this verse context breakdown with the community.'}
          </p>
        </div>
      </div>
    );
  };

  const renderVerseCard = (vItem: SavedVerseItem) => {
    const isLiked = likedItemIds.includes(vItem.id);
    const count = (vItem.likesCount || 1) + (isLiked ? 1 : 0);
    const fullRef = `${vItem.verseRef} (${vItem.translation})`;
    const colLabel = getCollectionName(vItem.collectionId);

    return (
      <div
        key={vItem.id}
        className={`rounded-2xl border overflow-hidden transition ${
          isLight
            ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
            : 'bg-[#161616] border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Top Row: Reference, Collection, Contributor & Actions */}
        <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            <span
              title={fullRef}
              className={`rounded-md px-2 py-0.5 text-xs font-semibold truncate max-w-[140px] sm:max-w-[220px] block ${
                isLight
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {fullRef}
            </span>
            <span
              title={colLabel}
              className={`text-[11px] font-medium truncate min-w-0 ${
                isLight ? 'text-stone-500' : 'text-zinc-400'
              }`}
            >
              • {colLabel}
            </span>
            <span
              className={`text-[11px] hidden md:inline truncate ${
                isLight ? 'text-stone-400' : 'text-zinc-400'
              }`}
            >
              • by {vItem.authorName || 'Community Reader'}
            </span>
          </div>

          {/* Compact Actions: Like & Save */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => likeCommunityItem(vItem.id)}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                isLiked
                  ? isLight
                    ? 'bg-rose-50 border-rose-300 text-rose-700'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : isLight
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-100'
              }`}
              title="Like"
            >
              <Heart
                className={`h-3.5 w-3.5 shrink-0 ${
                  isLiked ? 'fill-current' : ''
                }`}
              />
              <span>{count}</span>
            </button>

            <button
              onClick={() =>
                saveBibleVerseItem({
                  verseRef: vItem.verseRef,
                  verseText: vItem.verseText,
                  translation: vItem.translation,
                  highlightColor: vItem.highlightColor,
                  personalNotes: vItem.personalNotes,
                  collectionId: vItem.collectionId,
                  sharedToCommunity: false,
                })
              }
              className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                isLight
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                  : 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-500/30 text-amber-300'
              }`}
              title="Save to My Saved"
            >
              <BookmarkPlus className="h-3.5 w-3.5 shrink-0" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>
        </div>

        <div
          className={`h-px w-full ${
            isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
          }`}
        />

        {/* Scripture Text */}
        <div
          className={`px-4 sm:px-5 py-4 font-serif text-base leading-relaxed ${
            isLight ? 'text-stone-900' : 'text-zinc-100'
          }`}
        >
          “{vItem.verseText}”
        </div>

        <div
          className={`h-px w-full ${
            isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
          }`}
        />

        {/* Contributor's Personal Notes & Reflections */}
        <div
          className={`px-4 sm:px-5 py-3.5 space-y-1.5 text-xs leading-relaxed ${
            isLight ? 'text-stone-800' : 'text-zinc-200'
          }`}
        >
          <span
            className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
              isLight ? 'text-amber-800' : 'text-amber-400'
            }`}
          >
            <MessageSquareQuote className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              Reader’s Perspective ({vItem.authorName || 'Community Reader'})
            </span>
          </span>
          <p>
            {vItem.personalNotes ||
              'Shared this scripture verse with the community.'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 min-w-0 pb-28 lg:pb-16">
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 pt-8 sm:pt-10 space-y-6">
        {isSearchViewOpen ? (
          /* =================================================================
             DEDICATED WHATSAPP-STYLE SEARCH VIEW FOR COMMUNITY
             ================================================================= */
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Search Top Bar: Back Button + Auto-Focused Search Input + Clear/Close */}
            <div
              className={`rounded-2xl border px-3.5 py-2.5 flex items-center gap-2.5 shadow-xs ${
                isLight
                  ? 'bg-white border-stone-200/90 text-stone-900'
                  : 'bg-[#161616] border-zinc-800 text-zinc-100'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setIsSearchViewOpen(false);
                  setSearchQuery('');
                }}
                className={`rounded-xl p-1.5 transition shrink-0 ${
                  isLight
                    ? 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
                title="Back to Community"
                aria-label="Close Search"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <Search
                className={`h-4 w-4 shrink-0 ${
                  isLight ? 'text-stone-400' : 'text-zinc-400'
                }`}
              />

              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search Community ${
                  searchCategory === 'collections'
                    ? 'collections'
                    : searchCategory === 'connections'
                    ? 'connections'
                    : searchCategory === 'context'
                    ? 'contexts'
                    : 'Bible verses'
                }...`}
                className={`w-full bg-transparent text-xs sm:text-sm focus:outline-none ${
                  isLight
                    ? 'text-stone-900 placeholder-stone-400'
                    : 'text-zinc-100 placeholder-zinc-500'
                }`}
              />

              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className={`rounded-lg p-1 shrink-0 ${
                    isLight
                      ? 'text-stone-400 hover:text-stone-700'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  title="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchViewOpen(false)}
                  className={`rounded-lg px-2 py-1 text-xs font-semibold shrink-0 ${
                    isLight
                      ? 'text-stone-500 hover:text-stone-900'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Close
                </button>
              )}
            </div>

            {/* 4 Search Categories as Tabs: Collections | Connections | Contexts | Bible Verses */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {(
                [
                  { id: 'collections', label: 'Collections', icon: Folder },
                  { id: 'connections', label: 'Connections', icon: Link2 },
                  { id: 'context', label: 'Contexts', icon: Compass },
                  { id: 'verses', label: 'Bible Verses', icon: Bookmark },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const isActive = searchCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSearchCategory(tab.id)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 border transition whitespace-nowrap ${
                      isActive
                        ? isLight
                          ? 'bg-amber-700 text-white border-amber-700 shadow-2xs'
                          : 'bg-amber-500 text-zinc-950 border-amber-500 shadow-2xs'
                        : isLight
                        ? 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200/90'
                        : 'bg-[#161616] hover:bg-zinc-800 text-zinc-200 border-zinc-800'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dedicated Search Results */}
            <div className="space-y-4">
              {searchCategory === 'collections' && (
                <>
                  {searchedCollections.length === 0 ? (
                    <div
                      className={`rounded-2xl border p-8 text-center space-y-2 ${
                        isLight
                          ? 'bg-white border-stone-200 text-stone-600'
                          : 'bg-[#161616] border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <p className="text-sm font-semibold">
                        No matching collections found.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {searchedCollections.map((col: NotebookCollection) => (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => {
                            setSelectedCollectionId(col.id);
                            setIsSearchViewOpen(false);
                          }}
                          className={`rounded-2xl border p-4 text-left transition flex items-start gap-3 ${
                            isLight
                              ? 'bg-white hover:bg-stone-50 border-stone-200/90 text-stone-900'
                              : 'bg-[#161616] hover:bg-zinc-900 border-zinc-800 text-zinc-100'
                          }`}
                        >
                          <div
                            className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isLight
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            <Folder className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm font-bold truncate ${
                                isLight ? 'text-stone-900' : 'text-zinc-100'
                              }`}
                            >
                              {col.name}
                            </p>
                            <p
                              className={`text-xs mt-1 line-clamp-2 ${
                                isLight ? 'text-stone-500' : 'text-zinc-400'
                              }`}
                            >
                              {col.description || 'Community study collection'}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}

              {searchCategory === 'connections' && (
                <>
                  {searchedConnections.length === 0 ? (
                    <div
                      className={`rounded-2xl border p-8 text-center space-y-2 ${
                        isLight
                          ? 'bg-white border-stone-200 text-stone-600'
                          : 'bg-[#161616] border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <p className="text-sm font-semibold">
                        No matching community connections found.
                      </p>
                    </div>
                  ) : (
                    searchedConnections.map((conn) => renderConnectionCard(conn))
                  )}
                </>
              )}

              {searchCategory === 'context' && (
                <>
                  {searchedContexts.length === 0 ? (
                    <div
                      className={`rounded-2xl border p-8 text-center space-y-2 ${
                        isLight
                          ? 'bg-white border-stone-200 text-stone-600'
                          : 'bg-[#161616] border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <p className="text-sm font-semibold">
                        No matching community contexts found.
                      </p>
                    </div>
                  ) : (
                    searchedContexts.map((ctx) => renderContextCard(ctx))
                  )}
                </>
              )}

              {searchCategory === 'verses' && (
                <>
                  {searchedVerses.length === 0 ? (
                    <div
                      className={`rounded-2xl border p-8 text-center space-y-2 ${
                        isLight
                          ? 'bg-white border-stone-200 text-stone-600'
                          : 'bg-[#161616] border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <p className="text-sm font-semibold">
                        No matching community Bible verses found.
                      </p>
                    </div>
                  ) : (
                    searchedVerses.map((vItem) => renderVerseCard(vItem))
                  )}
                </>
              )}
            </div>
          </div>
        ) : (
          /* =================================================================
             STANDARD COMMUNITY PAGE VIEW
             ================================================================= */
          <>
            {/* 2A. Community Heading on the Left + Search Icon on the Far Right */}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h1
                  className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight ${
                    isLight ? 'text-stone-900' : 'text-white'
                  }`}
                >
                  Community
                </h1>
                <p
                  className={`text-xs sm:text-sm mt-1 ${
                    isLight ? 'text-stone-500' : 'text-zinc-400'
                  }`}
                >
                  Explore scripture connections, verse contexts, and personal reflections shared by readers across the community.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSearchViewOpen(true)}
                className={`rounded-2xl border p-3 transition shrink-0 shadow-2xs ${
                  isLight
                    ? 'bg-white hover:bg-stone-100 border-stone-200/90 text-stone-800'
                    : 'bg-[#161616] hover:bg-zinc-800 border-zinc-800 text-zinc-100'
                }`}
                title="Search Community items"
                aria-label="Open Community Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* 2B. Horizontal Filter Arrangement:
                All | Connections | Contexts | Bible Verses | Collection filter
                (Old tab navigation and its divider removed) */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'connections', label: 'Connections' },
                  { id: 'context', label: 'Contexts' },
                  { id: 'verses', label: 'Bible Verses' },
                ] as const
              ).map((filter) => {
                const isActive = contentFilter === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setContentFilter(filter.id)}
                    className={`rounded-xl px-3.5 py-2 text-xs font-bold whitespace-nowrap border transition ${
                      isActive
                        ? isLight
                          ? 'bg-amber-700 text-white border-amber-700 shadow-2xs'
                          : 'bg-amber-500 text-zinc-950 border-amber-500 shadow-2xs'
                        : isLight
                        ? 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200/90'
                        : 'bg-[#161616] hover:bg-zinc-800 text-zinc-200 border-zinc-800'
                    }`}
                  >
                    {filter.label}
                  </button>
                );
              })}

              {/* Collection Category Filter */}
              <div
                className={`rounded-xl border px-3 py-1.5 flex items-center gap-1.5 ${
                  isLight
                    ? 'bg-white border-stone-200/90 text-stone-800'
                    : 'bg-[#161616] border-zinc-800 text-zinc-100'
                }`}
              >
                <Folder
                  className={`h-3.5 w-3.5 shrink-0 ${
                    isLight ? 'text-amber-700' : 'text-amber-400'
                  }`}
                />
                <select
                  value={selectedCollectionId}
                  onChange={(e) => setSelectedCollectionId(e.target.value)}
                  aria-label="Filter by Collection"
                  className={`bg-transparent text-xs font-semibold focus:outline-none max-w-[140px] sm:max-w-[180px] truncate ${
                    isLight ? 'text-stone-800' : 'text-zinc-100'
                  }`}
                >
                  <option
                    value="ALL"
                    className={
                      isLight
                        ? 'bg-white text-stone-900'
                        : 'bg-[#161616] text-zinc-100'
                    }
                  >
                    All Collections
                  </option>
                  {collections.map((c) => (
                    <option
                      key={c.id}
                      value={c.id}
                      className={
                        isLight
                          ? 'bg-white text-stone-900'
                          : 'bg-[#161616] text-zinc-100'
                      }
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Community Content Display */}
            <div className="space-y-4">
              {contentFilter === 'all' &&
                filteredConnections.length === 0 &&
                filteredContexts.length === 0 &&
                filteredVerses.length === 0 && (
                  <div
                    className={`rounded-2xl border p-8 text-center space-y-2 ${
                      isLight
                        ? 'bg-white border-stone-200 text-stone-600'
                        : 'bg-[#161616] border-zinc-800 text-zinc-300'
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold ${
                        isLight ? 'text-stone-800' : 'text-zinc-100'
                      }`}
                    >
                      No community items match your filter.
                    </p>
                  </div>
                )}

              {(contentFilter === 'all' || contentFilter === 'connections') && (
                <>
                  {contentFilter === 'connections' &&
                  filteredConnections.length === 0 ? (
                    <div
                      className={`rounded-2xl border p-8 text-center space-y-2 ${
                        isLight
                          ? 'bg-white border-stone-200 text-stone-600'
                          : 'bg-[#161616] border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          isLight ? 'text-stone-800' : 'text-zinc-100'
                        }`}
                      >
                        No community connections match your filter.
                      </p>
                    </div>
                  ) : (
                    filteredConnections.map((conn) => renderConnectionCard(conn))
                  )}
                </>
              )}

              {(contentFilter === 'all' || contentFilter === 'context') && (
                <>
                  {contentFilter === 'context' &&
                  filteredContexts.length === 0 ? (
                    <div
                      className={`rounded-2xl border p-8 text-center space-y-2 ${
                        isLight
                          ? 'bg-white border-stone-200 text-stone-600'
                          : 'bg-[#161616] border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          isLight ? 'text-stone-800' : 'text-zinc-100'
                        }`}
                      >
                        No community contexts match your filter.
                      </p>
                    </div>
                  ) : (
                    filteredContexts.map((ctx) => renderContextCard(ctx))
                  )}
                </>
              )}

              {(contentFilter === 'all' || contentFilter === 'verses') && (
                <>
                  {contentFilter === 'verses' && filteredVerses.length === 0 ? (
                    <div
                      className={`rounded-2xl border p-8 text-center space-y-2 ${
                        isLight
                          ? 'bg-white border-stone-200 text-stone-600'
                          : 'bg-[#161616] border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          isLight ? 'text-stone-800' : 'text-zinc-100'
                        }`}
                      >
                        No community verses match your filter.
                      </p>
                    </div>
                  ) : (
                    filteredVerses.map((vItem) => renderVerseCard(vItem))
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
