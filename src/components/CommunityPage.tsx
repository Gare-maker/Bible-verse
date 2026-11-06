'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Bookmark,
  BookmarkPlus,
  Compass,
  Folder,
  Heart,
  Link2,
  MessageSquareQuote,
  Search,
  User,
  X,
} from 'lucide-react';
import {
  SavedConnection,
  SavedContextItem,
  SavedVerseItem,
} from '@/types/bible';
import { usePlatform } from '@/context/PlatformContext';

type CommunityTab = 'connections' | 'context' | 'verses';

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
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const [activeTab, setActiveTab] = useState<CommunityTab>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('ALL');

  const getCollectionName = (colId?: string) => {
    if (!colId) return 'General Collection';
    return collections.find((c) => c.id === colId)?.name || 'General Collection';
  };

  // Filtered Community Connections
  const filteredConnections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return communityConnections.filter((c) => {
      if (selectedCollectionId !== 'ALL' && c.collectionId !== selectedCollectionId) {
        return false;
      }
      if (!q) return true;
      return (
        c.primaryRef.toLowerCase().includes(q) ||
        c.connectedRef.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.primaryText.toLowerCase().includes(q) ||
        c.connectedText.toLowerCase().includes(q) ||
        c.personalObservation.toLowerCase().includes(q) ||
        (c.authorName || '').toLowerCase().includes(q)
      );
    });
  }, [communityConnections, searchQuery, selectedCollectionId]);

  // Filtered Community Contexts
  const filteredContexts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return communityContexts.filter((c) => {
      if (selectedCollectionId !== 'ALL' && c.collectionId !== selectedCollectionId) {
        return false;
      }
      if (!q) return true;
      return (
        c.verseRef.toLowerCase().includes(q) ||
        c.verseText.toLowerCase().includes(q) ||
        c.mainTheme.toLowerCase().includes(q) ||
        c.contextSummary.toLowerCase().includes(q) ||
        c.personalNotes.toLowerCase().includes(q) ||
        (c.authorName || '').toLowerCase().includes(q)
      );
    });
  }, [communityContexts, searchQuery, selectedCollectionId]);

  // Filtered Community Bible Verses
  const filteredVerses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return communityVerses.filter((v) => {
      if (selectedCollectionId !== 'ALL' && v.collectionId !== selectedCollectionId) {
        return false;
      }
      if (!q) return true;
      return (
        v.verseRef.toLowerCase().includes(q) ||
        v.verseText.toLowerCase().includes(q) ||
        v.personalNotes.toLowerCase().includes(q) ||
        (v.authorName || '').toLowerCase().includes(q)
      );
    });
  }, [communityVerses, searchQuery, selectedCollectionId]);

  return (
    <div className="flex-1 min-w-0 pb-28 lg:pb-16">
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 pt-8 sm:pt-10 space-y-6">
        {/* ===================================================================
            PROMINENT LARGE HEADER TITLE: "Community"
            =================================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1
              className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight ${
                isLight ? 'text-stone-900' : 'text-white'
              }`}
            >
              Community
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-zinc-400 mt-1">
              Explore scripture connections, verse contexts, and personal reflections shared by readers across the community.
            </p>
          </div>
        </div>

        {/* ===================================================================
            SEARCH AND COLLECTION SELECTION (Side-by-side row)
            =================================================================== */}
        <div className="flex items-center gap-2">
          {/* Search Input on the Left */}
          <div
            className={`flex-1 rounded-2xl border px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xs ${
              isLight
                ? 'bg-white border-stone-200/90 text-stone-900'
                : 'bg-[#161616] border-zinc-800 text-zinc-100'
            }`}
          >
            <Search className="h-4 w-4 text-stone-400 dark:text-zinc-500 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search community connections, verse contexts, scriptures, or contributor notes..."
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-stone-900 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="rounded-lg p-0.5 text-stone-400 hover:text-stone-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Collection Filter on the Right */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className={`rounded-2xl border px-3 py-2 flex items-center gap-1.5 ${
                isLight
                  ? 'bg-white border-stone-200/90 text-stone-900'
                  : 'bg-[#161616] border-zinc-800 text-zinc-100'
              }`}
            >
              <Folder className="h-3.5 w-3.5 text-amber-600 shrink-0" />
              <select
                value={selectedCollectionId}
                onChange={(e) => setSelectedCollectionId(e.target.value)}
                className="bg-transparent text-xs font-semibold focus:outline-none max-w-[130px] sm:max-w-[180px] truncate text-stone-900 dark:text-zinc-100"
              >
                <option value="ALL" className="bg-white dark:bg-[#161616] text-stone-900 dark:text-zinc-100">All Collections</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id} className="bg-white dark:bg-[#161616] text-stone-900 dark:text-zinc-100">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ===================================================================
            TABS (Connections | Context | Bible Verses)
            =================================================================== */}
        <div className="flex items-center overflow-x-auto no-scrollbar">
          <div
            className={`inline-flex items-center rounded-2xl border p-1 gap-1 shrink-0 ${
              isLight
                ? 'bg-stone-100/90 border-stone-200/90'
                : 'bg-[#161616] border-zinc-800'
            }`}
          >
            <button
              onClick={() => setActiveTab('connections')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition ${
                activeTab === 'connections'
                  ? isLight
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'bg-zinc-800 text-white'
                  : isLight
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Link2 className="h-3.5 w-3.5" />
              <span>Connections</span>
            </button>

            <button
              onClick={() => setActiveTab('context')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition ${
                activeTab === 'context'
                  ? isLight
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'bg-zinc-800 text-white'
                  : isLight
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Context</span>
            </button>

            <button
              onClick={() => setActiveTab('verses')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition ${
                activeTab === 'verses'
                  ? isLight
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'bg-zinc-800 text-white'
                  : isLight
                  ? 'text-stone-600 hover:text-stone-900'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>Bible Verses</span>
            </button>
          </div>
        </div>

        <div
          className={`h-px w-full ${
            isLight ? 'bg-stone-200/80' : 'bg-zinc-800/80'
          }`}
        />

        {/* ===================================================================
            TAB 1: COMMUNITY CONNECTIONS
            =================================================================== */}
        {activeTab === 'connections' && (
          <div className="space-y-4">
            {filteredConnections.length === 0 ? (
              <div
                className={`rounded-2xl border p-8 text-center space-y-2 ${
                  isLight
                    ? 'bg-white border-stone-200 text-stone-500'
                    : 'bg-[#161616] border-zinc-800 text-zinc-400'
                }`}
              >
                <p className="text-sm font-semibold text-stone-700 dark:text-zinc-200">
                  No community connections match your filter.
                </p>
              </div>
            ) : (
              filteredConnections.map((conn: SavedConnection) => {
                const isLiked = likedItemIds.includes(conn.id);
                const count = (conn.likesCount || 1) + (isLiked ? 1 : 0);
                return (
                  <div
                    key={conn.id}
                    className={`rounded-2xl border p-4 sm:p-5 space-y-3.5 transition ${
                      isLight
                        ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
                        : 'bg-[#161616] border-zinc-800 text-zinc-100'
                    }`}
                  >
                    {/* Top Row: References, Collection, Contributor & Actions */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${
                            isLight
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {conn.primaryRef} ↔ {conn.connectedRef}
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-zinc-400 font-medium truncate">
                          • {getCollectionName(conn.collectionId)}
                        </span>
                        <span className="text-[11px] text-stone-400 dark:text-zinc-500 hidden sm:inline truncate">
                          • by {conn.authorName || 'Community Reader'}
                        </span>
                      </div>

                      {/* Compact Community Actions: Like & Save */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => likeCommunityItem(conn.id)}
                          className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                            isLiked
                              ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400'
                              : isLight
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                          }`}
                          title="Like"
                        >
                          <Heart
                            className={`h-3.5 w-3.5 ${
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
                              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          }`}
                          title="Save to My Saved"
                        >
                          <BookmarkPlus className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Save</span>
                        </button>
                      </div>
                    </div>

                    {conn.title && (
                      <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-zinc-100">
                        {conn.title}
                      </h3>
                    )}

                    {/* Both Scriptures (No redundant Open buttons) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                      <div
                        className={`rounded-xl border p-3 space-y-1 ${
                          isLight
                            ? 'bg-[#FBF9F5] border-stone-200/80'
                            : 'bg-[#121212] border-zinc-800'
                        }`}
                      >
                        <span className={`text-xs font-bold block ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                          {conn.primaryRef} ({conn.translation})
                        </span>
                        <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                          “{conn.primaryText}”
                        </p>
                      </div>

                      <div
                        className={`rounded-xl border p-3 space-y-1 ${
                          isLight
                            ? 'bg-amber-50/40 border-amber-200/80'
                            : 'bg-[#1c1a15] border-amber-500/30'
                        }`}
                      >
                        <span className={`text-xs font-bold block ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                          {conn.connectedRef} ({conn.translation})
                        </span>
                        <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
                          “{conn.connectedText}”
                        </p>
                      </div>
                    </div>

                    {/* Contributor's Personal Notes & Reflections */}
                    <div
                      className={`rounded-xl border p-3.5 space-y-1.5 text-xs leading-relaxed ${
                        isLight
                          ? 'bg-stone-50/90 border-stone-200/90 text-stone-800'
                          : 'bg-[#121212] border-zinc-800 text-zinc-200'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          isLight ? 'text-amber-800' : 'text-amber-400'
                        }`}
                      >
                        <MessageSquareQuote className="h-3.5 w-3.5" />
                        <span>
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
              })
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: COMMUNITY CONTEXT
            =================================================================== */}
        {activeTab === 'context' && (
          <div className="space-y-4">
            {filteredContexts.length === 0 ? (
              <div
                className={`rounded-2xl border p-8 text-center space-y-2 ${
                  isLight
                    ? 'bg-white border-stone-200 text-stone-500'
                    : 'bg-[#161616] border-zinc-800 text-zinc-400'
                }`}
              >
                <p className="text-sm font-semibold text-stone-700 dark:text-zinc-200">
                  No community contexts match your filter.
                </p>
              </div>
            ) : (
              filteredContexts.map((ctx: SavedContextItem) => {
                const isLiked = likedItemIds.includes(ctx.id);
                const count = (ctx.likesCount || 1) + (isLiked ? 1 : 0);
                return (
                  <div
                    key={ctx.id}
                    className={`rounded-2xl border p-4 sm:p-5 space-y-3.5 transition ${
                      isLight
                        ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
                        : 'bg-[#161616] border-zinc-800 text-zinc-100'
                    }`}
                  >
                    {/* Top Row: Reference, Theme, Contributor & Actions */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${
                            isLight
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {ctx.verseRef} ({ctx.translation})
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-zinc-400 font-medium truncate">
                          • {ctx.mainTheme}
                        </span>
                        <span className="text-[11px] text-stone-400 dark:text-zinc-500 hidden sm:inline truncate">
                          • by {ctx.authorName || 'Community Reader'}
                        </span>
                      </div>

                      {/* Compact Actions: Like & Save */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => likeCommunityItem(ctx.id)}
                          className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                            isLiked
                              ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400'
                              : isLight
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                          }`}
                          title="Like"
                        >
                          <Heart
                            className={`h-3.5 w-3.5 ${
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
                              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          }`}
                          title="Save to My Saved"
                        >
                          <BookmarkPlus className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Save</span>
                        </button>
                      </div>
                    </div>

                    {/* Scripture Text (No redundant Open button!) */}
                    <div
                      className={`rounded-xl border p-3.5 font-serif text-sm leading-relaxed ${
                        isLight
                          ? 'bg-[#FBF9F5] border-stone-200/80 text-stone-900'
                          : 'bg-[#121212] border-zinc-800 text-zinc-100'
                      }`}
                    >
                      “{ctx.verseText}”
                    </div>

                    {/* Breakdown Points */}
                    <div className="space-y-2">
                      {ctx.verseBreakdown.map((pt, i) => (
                        <div
                          key={i}
                          className={`rounded-xl border p-3 text-xs leading-relaxed ${
                            isLight
                              ? 'bg-amber-50/35 border-amber-200/70 text-stone-800'
                              : 'bg-[#1b1914] border-amber-500/25 text-zinc-200'
                          }`}
                        >
                          {pt}
                        </div>
                      ))}
                    </div>

                    {/* Contributor's Personal Notes & Reflections */}
                    <div
                      className={`rounded-xl border p-3.5 space-y-1.5 text-xs leading-relaxed ${
                        isLight
                          ? 'bg-stone-50/90 border-stone-200/90 text-stone-800'
                          : 'bg-[#121212] border-zinc-800 text-zinc-200'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          isLight ? 'text-amber-800' : 'text-amber-400'
                        }`}
                      >
                        <MessageSquareQuote className="h-3.5 w-3.5" />
                        <span>
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
              })
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 3: COMMUNITY BIBLE VERSES
            =================================================================== */}
        {activeTab === 'verses' && (
          <div className="space-y-4">
            {filteredVerses.length === 0 ? (
              <div
                className={`rounded-2xl border p-8 text-center space-y-2 ${
                  isLight
                    ? 'bg-white border-stone-200 text-stone-500'
                    : 'bg-[#161616] border-zinc-800 text-zinc-400'
                }`}
              >
                <p className="text-sm font-semibold text-stone-700 dark:text-zinc-200">
                  No community verses match your filter.
                </p>
              </div>
            ) : (
              filteredVerses.map((vItem: SavedVerseItem) => {
                const isLiked = likedItemIds.includes(vItem.id);
                const count = (vItem.likesCount || 1) + (isLiked ? 1 : 0);
                return (
                  <div
                    key={vItem.id}
                    className={`rounded-2xl border p-4 sm:p-5 space-y-3.5 transition ${
                      isLight
                        ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
                        : 'bg-[#161616] border-zinc-800 text-zinc-100'
                    }`}
                  >
                    {/* Top Row: Reference, Collection, Contributor & Actions */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${
                            isLight
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {vItem.verseRef} ({vItem.translation})
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-zinc-400 font-medium truncate">
                          • {getCollectionName(vItem.collectionId)}
                        </span>
                        <span className="text-[11px] text-stone-400 dark:text-zinc-500 hidden sm:inline truncate">
                          • by {vItem.authorName || 'Community Reader'}
                        </span>
                      </div>

                      {/* Compact Actions: Like & Save */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => likeCommunityItem(vItem.id)}
                          className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                            isLiked
                              ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400'
                              : isLight
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                          }`}
                          title="Like"
                        >
                          <Heart
                            className={`h-3.5 w-3.5 ${
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
                              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          }`}
                          title="Save to My Saved"
                        >
                          <BookmarkPlus className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Save</span>
                        </button>
                      </div>
                    </div>

                    {/* Scripture Text (No redundant Open button!) */}
                    <div
                      className={`rounded-xl border p-4 font-serif text-base leading-relaxed ${
                        isLight
                          ? 'bg-[#FBF9F5] border-stone-200/80 text-stone-900'
                          : 'bg-[#121212] border-zinc-800 text-zinc-100'
                      }`}
                    >
                      “{vItem.verseText}”
                    </div>

                    {/* Contributor's Personal Notes & Reflections */}
                    <div
                      className={`rounded-xl border p-3.5 space-y-1.5 text-xs leading-relaxed ${
                        isLight
                          ? 'bg-stone-50/90 border-stone-200/90 text-stone-800'
                          : 'bg-[#121212] border-zinc-800 text-zinc-200'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          isLight ? 'text-amber-800' : 'text-amber-400'
                        }`}
                      >
                        <MessageSquareQuote className="h-3.5 w-3.5" />
                        <span>
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
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

