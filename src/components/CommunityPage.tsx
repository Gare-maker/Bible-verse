'use client';

import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  BookmarkPlus,
  BookOpen,
  Compass,
  ExternalLink,
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
    navigateToReferenceString,
    preferences,
  } = usePlatform();

  const isLight = preferences.theme === 'light';

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
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Explore scripture connections, verse contexts, and personal reflections shared by readers across the community.
            </p>
          </div>
        </div>

        {/* ===================================================================
            SEARCH BAR ABOVE THE TABS
            =================================================================== */}
        <div
          className={`rounded-2xl border px-4 py-3 flex items-center gap-3 shadow-2xs ${
            isLight
              ? 'bg-white border-stone-200/90 text-stone-900'
              : 'bg-[#161616] border-zinc-800 text-zinc-100'
          }`}
        >
          <Search className="h-4 w-4 text-stone-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search community connections, verse contexts, scriptures, or contributor notes..."
            className="w-full bg-transparent text-xs sm:text-sm focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="rounded-lg p-1 text-stone-400 hover:text-stone-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ===================================================================
            TABS (Connections | Context | Bible Verses) + COLLECTION FILTER
            =================================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 3 Tabs */}
          <div
            className={`inline-flex items-center rounded-2xl border p-1 gap-1 ${
              isLight
                ? 'bg-stone-100/90 border-stone-200/90'
                : 'bg-[#161616] border-zinc-800'
            }`}
          >
            <button
              onClick={() => setActiveTab('connections')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 transition ${
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
              <span>Connections ({filteredConnections.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('context')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 transition ${
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
              <span>Context ({filteredContexts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('verses')}
              className={`rounded-xl px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 transition ${
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
              <span>Bible Verses ({filteredVerses.length})</span>
            </button>
          </div>

          {/* Collection Filter Close to Tabs */}
          <div className="flex items-center gap-2">
            <Folder
              className={`h-4 w-4 ${isLight ? 'text-amber-700' : 'text-amber-400'}`}
            />
            <span className="text-xs font-semibold text-stone-500">Collection:</span>
            <select
              value={selectedCollectionId}
              onChange={(e) => setSelectedCollectionId(e.target.value)}
              className={`rounded-xl border px-3 py-2 text-xs font-bold ${
                isLight
                  ? 'bg-white border-stone-200 text-stone-800'
                  : 'bg-[#161616] border-zinc-800 text-zinc-100'
              }`}
            >
              <option value="ALL">All Collections</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
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
                <p className="text-sm font-semibold">
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
                    className={`rounded-2xl border p-5 space-y-4 transition ${
                      isLight
                        ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
                        : 'bg-[#161616] border-zinc-800 text-zinc-100'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`rounded-lg px-2.5 py-0.5 text-xs font-bold ${
                              isLight
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {conn.primaryRef} ↔ {conn.connectedRef}
                          </span>
                          <span
                            className={`rounded-lg border px-2.5 py-0.5 text-[11px] font-semibold ${
                              isLight
                                ? 'bg-stone-50 border-stone-200 text-stone-700'
                                : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                            }`}
                          >
                            Collection: {getCollectionName(conn.collectionId)}
                          </span>
                          <span className="text-xs text-stone-500 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>Shared by {conn.authorName || 'Community Reader'}</span>
                          </span>
                        </div>
                        <h3 className="text-base font-bold pt-0.5">{conn.title}</h3>
                      </div>

                      {/* Community Actions: Like & Save to My Saved */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => likeCommunityItem(conn.id)}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition ${
                            isLiked
                              ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400'
                              : isLight
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                          }`}
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
                          className={`rounded-xl border px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition ${
                            isLight
                              ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          <BookmarkPlus className="h-3.5 w-3.5" />
                          <span>Save to My Saved</span>
                        </button>
                      </div>
                    </div>

                    {/* Both Scriptures */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div
                        className={`rounded-xl border p-3.5 space-y-1.5 ${
                          isLight
                            ? 'bg-[#FBF9F5] border-stone-200/80'
                            : 'bg-[#121212] border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className={isLight ? 'text-amber-800' : 'text-amber-400'}>
                            {conn.primaryRef} ({conn.translation})
                          </span>
                          <button
                            onClick={() => navigateToReferenceString(conn.primaryRef, false)}
                            className="text-[11px] text-stone-500 hover:underline flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-serif text-sm leading-relaxed">
                          “{conn.primaryText}”
                        </p>
                      </div>

                      <div
                        className={`rounded-xl border p-3.5 space-y-1.5 ${
                          isLight
                            ? 'bg-amber-50/40 border-amber-200/80'
                            : 'bg-[#1c1a15] border-amber-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className={isLight ? 'text-amber-800' : 'text-amber-400'}>
                            {conn.connectedRef} ({conn.translation})
                          </span>
                          <button
                            onClick={() =>
                              navigateToReferenceString(conn.connectedRef, false)
                            }
                            className="text-[11px] text-stone-500 hover:underline flex items-center gap-1"
                          >
                            <span>Open</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                        <p className="font-serif text-sm leading-relaxed">
                          “{conn.connectedText}”
                        </p>
                      </div>
                    </div>

                    {/* Contributor's Personal Notes & Reflections */}
                    <div
                      className={`rounded-xl border p-4 space-y-1.5 text-xs leading-relaxed ${
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
                          Reader’s Perspective & Notes ({conn.authorName || 'Scholar'})
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
                <p className="text-sm font-semibold">
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
                    className={`rounded-2xl border p-5 space-y-4 transition ${
                      isLight
                        ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
                        : 'bg-[#161616] border-zinc-800 text-zinc-100'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`rounded-lg px-2.5 py-0.5 text-xs font-bold ${
                              isLight
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {ctx.verseRef} ({ctx.translation})
                          </span>
                          <span
                            className={`rounded-lg border px-2.5 py-0.5 text-[11px] font-semibold ${
                              isLight
                                ? 'bg-stone-50 border-stone-200 text-stone-700'
                                : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                            }`}
                          >
                            Collection: {getCollectionName(ctx.collectionId)}
                          </span>
                          <span className="text-xs text-stone-500 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>Shared by {ctx.authorName || 'Community Reader'}</span>
                          </span>
                        </div>
                        <h3 className="text-base font-bold pt-0.5">{ctx.mainTheme}</h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigateToReferenceString(ctx.verseRef, false)}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold flex items-center gap-1 transition ${
                            isLight
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                          }`}
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Open</span>
                        </button>

                        <button
                          onClick={() => likeCommunityItem(ctx.id)}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition ${
                            isLiked
                              ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400'
                              : isLight
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                          }`}
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
                          className={`rounded-xl border px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition ${
                            isLight
                              ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          <BookmarkPlus className="h-3.5 w-3.5" />
                          <span>Save to My Saved</span>
                        </button>
                      </div>
                    </div>

                    <div
                      className={`rounded-xl border p-3.5 font-serif text-sm leading-relaxed ${
                        isLight
                          ? 'bg-[#FBF9F5] border-stone-200/80 text-stone-900'
                          : 'bg-[#121212] border-zinc-800 text-zinc-100'
                      }`}
                    >
                      “{ctx.verseText}”
                    </div>

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

                    <div
                      className={`rounded-xl border p-4 space-y-1.5 text-xs leading-relaxed ${
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
                          Reader’s Perspective & Notes ({ctx.authorName || 'Scholar'})
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
                <p className="text-sm font-semibold">
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
                    className={`rounded-2xl border p-5 space-y-4 transition ${
                      isLight
                        ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
                        : 'bg-[#161616] border-zinc-800 text-zinc-100'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                            isLight
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {vItem.verseRef} ({vItem.translation})
                        </span>
                        <span
                          className={`rounded-lg border px-2.5 py-0.5 text-[11px] font-semibold ${
                            isLight
                              ? 'bg-stone-50 border-stone-200 text-stone-700'
                              : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                          }`}
                        >
                          Collection: {getCollectionName(vItem.collectionId)}
                        </span>
                        <span className="text-xs text-stone-500 flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>Shared by {vItem.authorName || 'Community Reader'}</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigateToReferenceString(vItem.verseRef, false)}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold flex items-center gap-1 transition ${
                            isLight
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                          }`}
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Open</span>
                        </button>

                        <button
                          onClick={() => likeCommunityItem(vItem.id)}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition ${
                            isLiked
                              ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400'
                              : isLight
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                          }`}
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
                          className={`rounded-xl border px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition ${
                            isLight
                              ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                              : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                          }`}
                        >
                          <BookmarkPlus className="h-3.5 w-3.5" />
                          <span>Save to My Saved</span>
                        </button>
                      </div>
                    </div>

                    <div
                      className={`rounded-xl border p-4 font-serif text-base leading-relaxed ${
                        isLight
                          ? 'bg-[#FBF9F5] border-stone-200/80 text-stone-900'
                          : 'bg-[#121212] border-zinc-800 text-zinc-100'
                      }`}
                    >
                      “{vItem.verseText}”
                    </div>

                    <div
                      className={`rounded-xl border p-4 space-y-1.5 text-xs leading-relaxed ${
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
                          Reader’s Perspective & Notes ({vItem.authorName || 'Scholar'})
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

