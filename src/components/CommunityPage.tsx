'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookmarkPlus,
  BookOpen,
  Compass,
  Filter,
  Folder,
  FolderPlus,
  Heart,
  Link2,
  MessageSquareQuote,
  Search,
  Users,
  X,
} from 'lucide-react';
import {
  NotebookCollection,
  SavedConnection,
  SavedContextItem,
  SavedTypeShadowItem,
  SavedVerseItem,
} from '@/types/bible';
import { usePlatform } from '@/context/PlatformContext';

type CommunityContentFilter = 'all' | 'connections' | 'context' | 'verses' | 'type_shadow';
type CommunitySearchCategory = 'collections' | 'connections' | 'context' | 'verses' | 'type_shadow';

export default function CommunityPage() {
  const {
    communityConnections,
    communityContexts,
    communityVerses,
    communityTypeShadows,
    collections,
    createCollection,
    likeCommunityItem,
    likedItemIds,
    saveConnectionToNotes,
    saveContextItem,
    saveBibleVerseItem,
    saveTypeShadowItem,
    preferences,
  } = usePlatform();

  const isLight = preferences.theme === 'light';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  // Main page content filter: All | Connection | Context | Bible Verse | Type & Shadow
  const [contentFilter, setContentFilter] = useState<CommunityContentFilter>('all');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('ALL');

  // Dedicated WhatsApp-style Search View state
  const [isSearchViewOpen, setIsSearchViewOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState<CommunitySearchCategory>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Add Collection Modal
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    createCollection(newCollectionName.trim(), newCollectionDesc.trim());
    setNewCollectionName('');
    setNewCollectionDesc('');
    setIsAddCollectionOpen(false);
  };

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

  // Main page filtered items (by selectedCollectionId & active searchQuery)
  const filteredConnections = useMemo(() => {
    const q = isSearchViewOpen ? searchQuery.trim().toLowerCase() : '';
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
        (c.authorName || '').toLowerCase().includes(q) ||
        getCollectionName(c.collectionId).toLowerCase().includes(q)
      );
    });
  }, [communityConnections, selectedCollectionId, isSearchViewOpen, searchQuery, collections]);

  const filteredContexts = useMemo(() => {
    const q = isSearchViewOpen ? searchQuery.trim().toLowerCase() : '';
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
        (c.authorName || '').toLowerCase().includes(q) ||
        getCollectionName(c.collectionId).toLowerCase().includes(q)
      );
    });
  }, [communityContexts, selectedCollectionId, isSearchViewOpen, searchQuery, collections]);

  const filteredVerses = useMemo(() => {
    const q = isSearchViewOpen ? searchQuery.trim().toLowerCase() : '';
    return communityVerses.filter((v) => {
      if (selectedCollectionId !== 'ALL' && v.collectionId !== selectedCollectionId) {
        return false;
      }
      if (!q) return true;
      return (
        v.verseRef.toLowerCase().includes(q) ||
        v.verseText.toLowerCase().includes(q) ||
        v.personalNotes.toLowerCase().includes(q) ||
        (v.authorName || '').toLowerCase().includes(q) ||
        getCollectionName(v.collectionId).toLowerCase().includes(q)
      );
    });
  }, [communityVerses, selectedCollectionId, isSearchViewOpen, searchQuery, collections]);

  const filteredTypeShadows = useMemo(() => {
    const q = isSearchViewOpen ? searchQuery.trim().toLowerCase() : '';
    return communityTypeShadows.filter((t) => {
      if (selectedCollectionId !== 'ALL' && t.collectionId !== selectedCollectionId) {
        return false;
      }
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.otTypeRef.toLowerCase().includes(q) ||
        t.otTypeText.toLowerCase().includes(q) ||
        t.ntAntitypeRef.toLowerCase().includes(q) ||
        t.ntAntitypeText.toLowerCase().includes(q) ||
        t.explanation.toLowerCase().includes(q) ||
        t.personalNotes.toLowerCase().includes(q) ||
        (t.authorName || '').toLowerCase().includes(q) ||
        getCollectionName(t.collectionId).toLowerCase().includes(q)
      );
    });
  }, [communityTypeShadows, selectedCollectionId, isSearchViewOpen, searchQuery, collections]);

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

  const searchedTypeShadows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return communityTypeShadows.filter((t) => {
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.otTypeRef.toLowerCase().includes(q) ||
        t.otTypeText.toLowerCase().includes(q) ||
        t.ntAntitypeRef.toLowerCase().includes(q) ||
        t.ntAntitypeText.toLowerCase().includes(q) ||
        t.explanation.toLowerCase().includes(q) ||
        t.personalNotes.toLowerCase().includes(q) ||
        (t.authorName || '').toLowerCase().includes(q) ||
        getCollectionName(t.collectionId).toLowerCase().includes(q)
      );
    });
  }, [communityTypeShadows, searchQuery, collections]);

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

        <div
          className={`h-px w-full ${
            isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
          }`}
        />

        {/* One continuous explanation area (no multiple internal dividers) */}
        <div
          className={`px-4 sm:px-5 py-3.5 text-xs sm:text-sm leading-relaxed space-y-2 ${
            isLight ? 'text-stone-800' : 'text-zinc-200'
          }`}
        >
          <p>{ctx.verseBreakdown.join(' ')}</p>
          {ctx.personalNotes && (
            <p className={`text-xs pt-1 ${isLight ? 'text-stone-600' : 'text-zinc-300'}`}>
              <span className="font-semibold">
                {ctx.authorName || 'Community Reader'}:
              </span>{' '}
              {ctx.personalNotes}
            </p>
          )}
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

  const renderTypeShadowCard = (tsItem: SavedTypeShadowItem) => {
    const isLiked = likedItemIds.includes(tsItem.id);
    const count = (tsItem.likesCount || 1) + (isLiked ? 1 : 0);
    const fullTag = `${tsItem.otTypeRef} → ${tsItem.ntAntitypeRef}`;
    const colLabel = getCollectionName(tsItem.collectionId);

    return (
      <div
        key={tsItem.id}
        className={`rounded-2xl border overflow-hidden transition ${
          isLight
            ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
            : 'bg-[#161616] border-zinc-800 text-zinc-100'
        }`}
      >
        <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
            <span
              className={`rounded-md px-2 py-0.5 text-[11px] font-bold shrink-0 ${
                isLight
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              Type & Shadow
            </span>
            <span
              title={fullTag}
              className={`text-xs font-semibold truncate ${
                isLight ? 'text-stone-800' : 'text-zinc-200'
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
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => likeCommunityItem(tsItem.id)}
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
                saveTypeShadowItem({
                  title: tsItem.title,
                  otTypeRef: tsItem.otTypeRef,
                  otTypeText: tsItem.otTypeText,
                  ntAntitypeRef: tsItem.ntAntitypeRef,
                  ntAntitypeText: tsItem.ntAntitypeText,
                  translation: tsItem.translation,
                  explanation: tsItem.explanation,
                  personalNotes: tsItem.personalNotes,
                  collectionId: tsItem.collectionId,
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

        {/* Old Testament Type & New Testament Fulfilment */}
        <div className="px-4 sm:px-5 py-3.5 space-y-3">
          <div className="space-y-1">
            <span
              className={`text-xs font-bold block ${
                isLight ? 'text-amber-800' : 'text-amber-400'
              }`}
            >
              Old Testament Type — {tsItem.otTypeRef}
            </span>
            <p
              className={`font-serif text-xs sm:text-sm leading-relaxed ${
                isLight ? 'text-stone-800' : 'text-zinc-100'
              }`}
            >
              “{tsItem.otTypeText}”
            </p>
          </div>

          <div className="space-y-1">
            <span
              className={`text-xs font-bold block ${
                isLight ? 'text-amber-800' : 'text-amber-400'
              }`}
            >
              New Testament Fulfilment — {tsItem.ntAntitypeRef}
            </span>
            <p
              className={`font-serif text-xs sm:text-sm leading-relaxed ${
                isLight ? 'text-stone-800' : 'text-zinc-100'
              }`}
            >
              “{tsItem.ntAntitypeText}”
            </p>
          </div>

          <p
            className={`text-xs leading-relaxed pt-1 ${
              isLight ? 'text-stone-700' : 'text-zinc-300'
            }`}
          >
            {tsItem.explanation}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 min-w-0 pb-28 lg:pb-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-8 pt-6 sm:pt-8 space-y-4">
        {/* 1. Community Header Row: Community Heading on Left (no icon in front) + Search Icon at Top-Right on the Same Horizontal Line */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center min-w-0">
            <h1
              className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight truncate ${
                isLight ? 'text-stone-900' : 'text-white'
              }`}
            >
              Community
            </h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsSearchViewOpen((prev) => {
                if (prev) setSearchQuery('');
                return !prev;
              });
            }}
            className={`rounded-xl border p-2.5 transition shrink-0 shadow-2xs ${
              isSearchViewOpen
                ? isLight
                  ? 'bg-amber-700 border-amber-700 text-white'
                  : 'bg-amber-500 border-amber-500 text-zinc-950'
                : isLight
                ? 'bg-white hover:bg-stone-100 border-stone-200/90 text-stone-800'
                : 'bg-[#161616] hover:bg-zinc-800 border-zinc-800 text-zinc-100'
            }`}
            title="Search Community items"
            aria-label="Toggle Community Search"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        {/* Clean & Minimal Expandable Search Input */}
        {isSearchViewOpen && (
          <div
            className={`rounded-xl border px-3.5 py-2 flex items-center gap-2.5 shadow-2xs transition ${
              isLight
                ? 'bg-white border-stone-200/90 text-stone-900'
                : 'bg-[#161616] border-zinc-800 text-zinc-100'
            }`}
          >
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
              placeholder="Search community verses, context, types & shadows, or references..."
              className={`w-full bg-transparent text-xs sm:text-sm focus:outline-none ${
                isLight
                  ? 'text-stone-900 placeholder-stone-400'
                  : 'text-zinc-100 placeholder-zinc-500'
              }`}
            />
            <button
              type="button"
              onClick={() => {
                if (searchQuery) {
                  setSearchQuery('');
                } else {
                  setIsSearchViewOpen(false);
                }
              }}
              className={`rounded-lg p-1 shrink-0 ${
                isLight
                  ? 'text-stone-400 hover:text-stone-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Close search"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* 2. Two Dropdowns Row (Fits Neatly Within the Same Horizontal Row on Mobile & Desktop) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
          {/* First Dropdown: Category Filter (All, Bible Verse, Context, Type and Shadow, References) */}
          <div
            className={`min-w-0 rounded-xl border px-2.5 sm:px-3 py-2 flex items-center gap-1.5 ${
              isLight
                ? 'bg-white border-stone-200/90 text-stone-800 shadow-2xs'
                : 'bg-[#161616] border-zinc-800 text-zinc-100'
            }`}
          >
            <Filter
              className={`h-3.5 w-3.5 shrink-0 ${
                isLight ? 'text-amber-700' : 'text-amber-400'
              }`}
            />
            <select
              value={contentFilter}
              onChange={(e) =>
                setContentFilter(e.target.value as CommunityContentFilter)
              }
              aria-label="Filter by Content Category"
              className={`w-full min-w-0 bg-transparent text-xs font-semibold truncate focus:outline-none ${
                isLight ? 'text-stone-800' : 'text-zinc-100'
              }`}
            >
              <option
                value="all"
                className={
                  isLight
                    ? 'bg-white text-stone-900'
                    : 'bg-[#161616] text-zinc-100'
                }
              >
                All
              </option>
              <option
                value="verses"
                className={
                  isLight
                    ? 'bg-white text-stone-900'
                    : 'bg-[#161616] text-zinc-100'
                }
              >
                Bible Verse
              </option>
              <option
                value="context"
                className={
                  isLight
                    ? 'bg-white text-stone-900'
                    : 'bg-[#161616] text-zinc-100'
                }
              >
                Context
              </option>
              <option
                value="type_shadow"
                className={
                  isLight
                    ? 'bg-white text-stone-900'
                    : 'bg-[#161616] text-zinc-100'
                }
              >
                Type and Shadow
              </option>
              <option
                value="connections"
                className={
                  isLight
                    ? 'bg-white text-stone-900'
                    : 'bg-[#161616] text-zinc-100'
                }
              >
                References
              </option>
            </select>
          </div>

          {/* Second Dropdown: Collection Filter + Create Collection Icon Inside the Field */}
          <div
            className={`min-w-0 rounded-xl border px-2.5 sm:px-3 py-2 flex items-center justify-between gap-1.5 ${
              isLight
                ? 'bg-white border-stone-200/90 text-stone-800 shadow-2xs'
                : 'bg-[#161616] border-zinc-800 text-zinc-100'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Folder
                className={`h-3.5 w-3.5 shrink-0 ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}
              />
              <select
                value={selectedCollectionId}
                onChange={(e) => setSelectedCollectionId(e.target.value)}
                aria-label="Filter by Collection"
                className={`w-full min-w-0 bg-transparent text-xs font-semibold truncate focus:outline-none ${
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

            <button
              type="button"
              onClick={() => setIsAddCollectionOpen(true)}
              className={`pl-2 border-l shrink-0 transition ${
                isLight
                  ? 'border-stone-200 text-amber-800 hover:text-amber-950'
                  : 'border-zinc-700 text-amber-400 hover:text-amber-300'
              }`}
              title="Create new collection"
              aria-label="Create new collection"
            >
              <FolderPlus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Community Content Display */}
        <div className="space-y-4">
          {contentFilter === 'all' &&
            filteredConnections.length === 0 &&
            filteredContexts.length === 0 &&
            filteredVerses.length === 0 &&
            filteredTypeShadows.length === 0 && (
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
                    No community Bible verses match your filter.
                  </p>
                </div>
              ) : (
                filteredVerses.map((vItem) => renderVerseCard(vItem))
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
                    No community content items match your filter.
                  </p>
                </div>
              ) : (
                filteredContexts.map((ctx) => renderContextCard(ctx))
              )}
            </>
          )}

          {(contentFilter === 'all' || contentFilter === 'type_shadow') && (
            <>
              {contentFilter === 'type_shadow' &&
              filteredTypeShadows.length === 0 ? (
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
                    No community Type and Shadow items match your filter.
                  </p>
                </div>
              ) : (
                filteredTypeShadows.map((tItem) =>
                  renderTypeShadowCard(tItem)
                )
              )}
            </>
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
                    No community references match your filter.
                  </p>
                </div>
              ) : (
                filteredConnections.map((conn) => renderConnectionCard(conn))
              )}
            </>
          )}
        </div>
      </div>

      {/* =====================================================================
          ADD COLLECTION MODAL
          ===================================================================== */}
      {isAddCollectionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <form
            onSubmit={handleCreateCollection}
            className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl ${
              isLight
                ? 'bg-white border-stone-200 text-stone-900'
                : 'bg-[#161616] border-zinc-800 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <FolderPlus className="h-4 w-4 text-amber-500" />
                <span>Create New Collection</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCollectionOpen(false)}
                className={`rounded-lg p-1 ${
                  isLight
                    ? 'text-stone-500 hover:bg-stone-100'
                    : 'text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  required
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g. Messianic Prophecies"
                  className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">
                  Description (optional)
                </label>
                <textarea
                  rows={2}
                  value={newCollectionDesc}
                  onChange={(e) => setNewCollectionDesc(e.target.value)}
                  placeholder="Short description of this study collection..."
                  className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddCollectionOpen(false)}
                className={`rounded-xl px-3.5 py-2 text-xs font-semibold border ${
                  isLight
                    ? 'border-stone-300 text-stone-700 hover:bg-stone-100'
                    : 'border-zinc-700 text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`rounded-xl px-4 py-2 text-xs font-bold ${
                  isLight
                    ? 'bg-amber-700 hover:bg-amber-800 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                }`}
              >
                Create Collection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
