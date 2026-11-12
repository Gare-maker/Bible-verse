'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  BookOpen,
  Compass,
  Edit3,
  Filter,
  Folder,
  FolderPlus,
  Globe,
  Link2,
  Search,
  Share2,
  Copy,
  Trash2,
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

type SavedContentFilter = 'all' | 'connections' | 'context' | 'verses' | 'type_shadow';
type SavedSearchCategory =
  | 'collections'
  | 'connections'
  | 'context'
  | 'verses'
  | 'type_shadow';

export default function NotesPage() {
  const {
    savedConnections,
    updateSavedConnection,
    deleteSavedConnection,
    savedContexts,
    updateSavedContext,
    deleteSavedContext,
    savedVerses,
    updateSavedVerse,
    deleteSavedVerse,
    savedTypeShadows,
    updateSavedTypeShadow,
    deleteSavedTypeShadow,
    collections,
    createCollection,
    preferences,
    showToast,
  } = usePlatform();

  const isLight = preferences.theme === 'light';
  const isChildren = preferences.experienceMode === 'children';

  // Always start at top on initial mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  // Main page content filter: All | Connections | Contexts | Bible Verses
  const [contentFilter, setContentFilter] = useState<SavedContentFilter>('all');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('ALL');

  // Dedicated WhatsApp-style Search View state
  const [isSearchViewOpen, setIsSearchViewOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState<SavedSearchCategory>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSearchViewOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 40);
    }
  }, [isSearchViewOpen]);

  // Inline Editing State for Personal Notes & Collection
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editNotesDraft, setEditNotesDraft] = useState('');
  const [editCollectionDraft, setEditCollectionDraft] = useState<string>('');

  // Create New Collection Modal
  const [isNewCollectionOpen, setIsNewCollectionOpen] = useState(false);
  const [colNameInput, setColNameInput] = useState('');
  const [colDescInput, setColDescInput] = useState('');

  // Delete Confirmation Modal State
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    type: 'connection' | 'context' | 'verse' | 'type_shadow';
    label: string;
  } | null>(null);

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;
    if (pendingDelete.type === 'connection') {
      deleteSavedConnection(pendingDelete.id);
    } else if (pendingDelete.type === 'context') {
      deleteSavedContext(pendingDelete.id);
    } else if (pendingDelete.type === 'verse') {
      deleteSavedVerse(pendingDelete.id);
    } else if (pendingDelete.type === 'type_shadow') {
      deleteSavedTypeShadow(pendingDelete.id);
    }
    setPendingDelete(null);
  };

  const getCollectionName = (colId?: string) => {
    if (!colId) return 'General Collection';
    return collections.find((c) => c.id === colId)?.name || 'General Collection';
  };

  // Main page filtered items (by selectedCollectionId & active searchQuery)
  const filteredConnections = useMemo(() => {
    const q = isSearchViewOpen ? searchQuery.trim().toLowerCase() : '';
    return savedConnections.filter((c) => {
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
        getCollectionName(c.collectionId).toLowerCase().includes(q)
      );
    });
  }, [savedConnections, selectedCollectionId, isSearchViewOpen, searchQuery, collections]);

  const filteredContexts = useMemo(() => {
    const q = isSearchViewOpen ? searchQuery.trim().toLowerCase() : '';
    return savedContexts.filter((c) => {
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
        getCollectionName(c.collectionId).toLowerCase().includes(q)
      );
    });
  }, [savedContexts, selectedCollectionId, isSearchViewOpen, searchQuery, collections]);

  const filteredVerses = useMemo(() => {
    const q = isSearchViewOpen ? searchQuery.trim().toLowerCase() : '';
    return savedVerses.filter((v) => {
      if (selectedCollectionId !== 'ALL' && v.collectionId !== selectedCollectionId) {
        return false;
      }
      if (!q) return true;
      return (
        v.verseRef.toLowerCase().includes(q) ||
        v.verseText.toLowerCase().includes(q) ||
        v.personalNotes.toLowerCase().includes(q) ||
        getCollectionName(v.collectionId).toLowerCase().includes(q)
      );
    });
  }, [savedVerses, selectedCollectionId, isSearchViewOpen, searchQuery, collections]);

  const filteredTypeShadows = useMemo(() => {
    const q = isSearchViewOpen ? searchQuery.trim().toLowerCase() : '';
    return savedTypeShadows.filter((ts) => {
      if (selectedCollectionId !== 'ALL' && ts.collectionId !== selectedCollectionId) {
        return false;
      }
      if (!q) return true;
      return (
        ts.title.toLowerCase().includes(q) ||
        ts.otTypeRef.toLowerCase().includes(q) ||
        ts.ntAntitypeRef.toLowerCase().includes(q) ||
        ts.otTypeText.toLowerCase().includes(q) ||
        ts.ntAntitypeText.toLowerCase().includes(q) ||
        ts.explanation.toLowerCase().includes(q) ||
        ts.personalNotes.toLowerCase().includes(q) ||
        getCollectionName(ts.collectionId).toLowerCase().includes(q)
      );
    });
  }, [savedTypeShadows, selectedCollectionId, isSearchViewOpen, searchQuery, collections]);

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
    return savedConnections.filter((c) => {
      if (!q) return true;
      return (
        c.primaryRef.toLowerCase().includes(q) ||
        c.connectedRef.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.primaryText.toLowerCase().includes(q) ||
        c.connectedText.toLowerCase().includes(q) ||
        c.personalObservation.toLowerCase().includes(q) ||
        getCollectionName(c.collectionId).toLowerCase().includes(q)
      );
    });
  }, [savedConnections, searchQuery, collections]);

  const searchedContexts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return savedContexts.filter((c) => {
      if (!q) return true;
      return (
        c.verseRef.toLowerCase().includes(q) ||
        c.verseText.toLowerCase().includes(q) ||
        c.mainTheme.toLowerCase().includes(q) ||
        c.contextSummary.toLowerCase().includes(q) ||
        c.personalNotes.toLowerCase().includes(q) ||
        getCollectionName(c.collectionId).toLowerCase().includes(q)
      );
    });
  }, [savedContexts, searchQuery, collections]);

  const searchedVerses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return savedVerses.filter((v) => {
      if (!q) return true;
      return (
        v.verseRef.toLowerCase().includes(q) ||
        v.verseText.toLowerCase().includes(q) ||
        v.personalNotes.toLowerCase().includes(q) ||
        getCollectionName(v.collectionId).toLowerCase().includes(q)
      );
    });
  }, [savedVerses, searchQuery, collections]);

  const searchedTypeShadows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return savedTypeShadows.filter((ts) => {
      if (!q) return true;
      return (
        ts.title.toLowerCase().includes(q) ||
        ts.otTypeRef.toLowerCase().includes(q) ||
        ts.ntAntitypeRef.toLowerCase().includes(q) ||
        ts.otTypeText.toLowerCase().includes(q) ||
        ts.ntAntitypeText.toLowerCase().includes(q) ||
        ts.explanation.toLowerCase().includes(q) ||
        ts.personalNotes.toLowerCase().includes(q) ||
        getCollectionName(ts.collectionId).toLowerCase().includes(q)
      );
    });
  }, [savedTypeShadows, searchQuery, collections]);

  const handleStartEdit = (
    id: string,
    currentNotes: string,
    currentCol?: string
  ) => {
    setEditingItemId(id);
    setEditNotesDraft(currentNotes);
    setEditCollectionDraft(currentCol || collections[0]?.id || 'col-messianic');
  };

  const handleCreateCollectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!colNameInput.trim()) return;
    const created = createCollection(colNameInput.trim(), colDescInput.trim());
    setSelectedCollectionId(created.id);
    setColNameInput('');
    setColDescInput('');
    setIsNewCollectionOpen(false);
  };

  const handleCopyConnection = (conn: SavedConnection) => {
    const textToCopy = `*${conn.primaryRef} ↔ ${conn.connectedRef}*\n\n` +
      `*${conn.primaryRef} (${conn.translation}):*\n"${conn.primaryText}"\n\n` +
      `*${conn.connectedRef} (${conn.translation}):*\n"${conn.connectedText}"\n\n` +
      (conn.connectionLabel ? `*Context:*\n${conn.connectionLabel}\n\n` : '') +
      (conn.personalObservation ? `*Personal Notes:*\n${conn.personalObservation}\n\n` : '') +
      `Shared from Bible Study App`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      showToast('Copied to clipboard for sharing!');
    }
  };

  const handleCopyContext = (ctx: SavedContextItem) => {
    const textToCopy = `*Context Study: ${ctx.verseRef} (${ctx.translation})*\n\n` +
      `"${ctx.verseText}"\n\n` +
      `*Main Theme:* ${ctx.mainTheme}\n` +
      (ctx.contextSummary ? `*Summary:* ${ctx.contextSummary}\n\n` : '') +
      (ctx.personalNotes ? `*Personal Notes:*\n${ctx.personalNotes}\n\n` : '') +
      `Shared from Bible Study App`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      showToast('Copied to clipboard for sharing!');
    }
  };

  const handleCopyVerse = (vItem: SavedVerseItem) => {
    const textToCopy = `*${vItem.verseRef} (${vItem.translation})*\n\n` +
      `"${vItem.verseText}"\n\n` +
      (vItem.personalNotes ? `*Personal Notes:*\n${vItem.personalNotes}\n\n` : '') +
      `Shared from Bible Study App`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      showToast('Copied to clipboard for sharing!');
    }
  };

  const handleCopyTypeShadow = (tsItem: SavedTypeShadowItem) => {
    const textToCopy = `*Type & Shadow: ${tsItem.title}*\n\n` +
      `*Old Testament Type (${tsItem.otTypeRef}):*\n"${tsItem.otTypeText}"\n\n` +
      `*New Testament Fulfilment (${tsItem.ntAntitypeRef}):*\n"${tsItem.ntAntitypeText}"\n\n` +
      `*Biblical Explanation:*\n${tsItem.explanation}\n\n` +
      (tsItem.personalNotes ? `*Personal Notes:*\n${tsItem.personalNotes}\n\n` : '') +
      `Shared from Bible Study App`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      showToast('Copied to clipboard for sharing!');
    }
  };

  const renderConnectionCard = (conn: SavedConnection) => {
    const isEditing = editingItemId === conn.id;
    const fullRefLabel = `${conn.primaryRef} ↔ ${conn.connectedRef}`;
    return (
      <div
        key={conn.id}
        className={`rounded-2xl border overflow-hidden transition ${
          isChildren
            ? isLight
              ? 'bg-[#FFF9E6] border-amber-300 text-slate-900 shadow-2xs'
              : 'bg-[#161D35] border-indigo-700/80 text-slate-100 shadow-md'
            : isLight
            ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
            : 'bg-[#161616] border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Top Row: Verse connection, concise category, community icon on left; Share, Edit, Delete on right */}
        <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              title={fullRefLabel}
              className={`text-xs sm:text-sm font-bold tracking-tight truncate max-w-[165px] sm:max-w-[260px] md:max-w-none ${
                isLight ? 'text-amber-900' : 'text-amber-400'
              }`}
            >
              {fullRefLabel}
            </span>
            <span
              title={conn.category || 'Connected'}
              className={`text-[11px] font-medium truncate max-w-[110px] sm:max-w-[180px] ${
                isLight ? 'text-stone-500' : 'text-zinc-400'
              }`}
            >
              • {conn.category || 'Connected'}
            </span>
            {conn.sharedToCommunity && (
              <span
                title="Shared to Community"
                className={`shrink-0 ${
                  isLight ? 'text-emerald-600' : 'text-emerald-400'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleCopyConnection(conn)}
              className={`rounded-lg p-1.5 transition ${
                isChildren
                  ? isLight
                    ? 'text-amber-900 hover:bg-amber-200/60'
                    : 'text-amber-300 hover:bg-indigo-900/60'
                  : isLight
                  ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`}
              title="Copy to clipboard for WhatsApp or sharing"
              aria-label="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </button>

            <button
              onClick={() =>
                handleStartEdit(
                  conn.id,
                  conn.personalObservation,
                  conn.collectionId
                )
              }
              className={`rounded-lg p-1.5 border transition ${
                isLight
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              }`}
              title="Edit Personal Notes & Collection"
              aria-label="Edit Notes"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() =>
                setPendingDelete({
                  id: conn.id,
                  type: 'connection',
                  label: `Saved Connection: ${conn.primaryRef} ↔ ${conn.connectedRef}`,
                })
              }
              className={`rounded-lg p-1.5 border transition ${
                isLight
                  ? 'bg-stone-50 hover:bg-rose-50 border-stone-200 text-stone-500 hover:text-rose-600'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300 hover:text-rose-400'
              }`}
              title="Delete"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div
          className={`h-px w-full ${
            isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
          }`}
        />

        {/* Primary Scripture Section */}
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

        {/* Connected Scripture Section */}
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

        {/* Personal Notes / Reflections Section */}
        {isEditing ? (
          <div className="px-4 sm:px-5 py-3.5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label
                  className={`text-[11px] font-bold block mb-1 ${
                    isLight ? 'text-stone-500' : 'text-zinc-400'
                  }`}
                >
                  Collection
                </label>
                <select
                  value={editCollectionDraft}
                  onChange={(e) => setEditCollectionDraft(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-1.5 text-xs ${
                    isLight
                      ? 'bg-white border-stone-300 text-stone-900'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                  }`}
                >
                  {collections.map((col) => (
                    <option
                      key={col.id}
                      value={col.id}
                      className={
                        isLight
                          ? 'bg-white text-stone-900'
                          : 'bg-zinc-900 text-zinc-100'
                      }
                    >
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                className={`text-[11px] font-bold block mb-1 ${
                  isLight ? 'text-stone-500' : 'text-zinc-400'
                }`}
              >
                Personal Notes & Reflections
              </label>
              <textarea
                rows={3}
                value={editNotesDraft}
                onChange={(e) => setEditNotesDraft(e.target.value)}
                placeholder="Write your reflections and insights on this connection..."
                className={`w-full rounded-xl border p-2.5 text-xs ${
                  isLight
                    ? 'bg-white border-stone-300 text-stone-900 placeholder-stone-400'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                }`}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingItemId(null)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                  isLight
                    ? 'text-stone-600 hover:text-stone-900 border-stone-200'
                    : 'text-zinc-300 hover:text-white border-zinc-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateSavedConnection(conn.id, {
                    personalObservation: editNotesDraft.trim(),
                    collectionId: editCollectionDraft,
                  });
                  setEditingItemId(null);
                }}
                className={`rounded-xl px-4 py-1.5 text-xs font-bold ${
                  isLight
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-500 text-zinc-950'
                }`}
              >
                Save Notes
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`px-4 sm:px-5 py-3.5 text-xs leading-relaxed ${
              isLight ? 'text-stone-700' : 'text-zinc-200'
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                isLight ? 'text-stone-400' : 'text-zinc-400'
              }`}
            >
              Personal Notes & Reflections
            </span>
            {conn.personalObservation ? (
              <p>{conn.personalObservation}</p>
            ) : (
              <button
                onClick={() =>
                  handleStartEdit(
                    conn.id,
                    conn.personalObservation,
                    conn.collectionId
                  )
                }
                className={`font-semibold hover:underline ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}
              >
                + Add personal notes & insights
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderContextCard = (ctx: SavedContextItem) => {
    const isEditing = editingItemId === ctx.id;
    return (
      <div
        key={ctx.id}
        className={`rounded-2xl border overflow-hidden transition ${
          isChildren
            ? isLight
              ? 'bg-[#FFF9E6] border-amber-300 text-slate-900 shadow-2xs'
              : 'bg-[#161D35] border-indigo-700/80 text-slate-100 shadow-md'
            : isLight
            ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
            : 'bg-[#161616] border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Top Row */}
        <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              title={`${ctx.verseRef} (${ctx.translation})`}
              className={`text-xs sm:text-sm font-bold tracking-tight shrink-0 ${
                isChildren
                  ? isLight
                    ? 'text-amber-950 font-extrabold'
                    : 'text-amber-300 font-extrabold'
                  : isLight
                  ? 'text-amber-900'
                  : 'text-amber-400'
              }`}
            >
              {ctx.verseRef} ({ctx.translation})
            </span>
            <span
              title={ctx.mainTheme}
              className={`text-[11px] font-medium truncate ${
                isLight ? 'text-stone-500' : 'text-zinc-400'
              }`}
            >
              • {ctx.mainTheme}
            </span>
            {ctx.sharedToCommunity && (
              <span
                title="Shared to Community"
                className={`shrink-0 ${
                  isLight ? 'text-emerald-600' : 'text-emerald-400'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleCopyContext(ctx)}
              className={`rounded-lg p-1.5 transition ${
                isChildren
                  ? isLight
                    ? 'text-amber-900 hover:bg-amber-200/60'
                    : 'text-amber-300 hover:bg-indigo-900/60'
                  : isLight
                  ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`}
              title="Copy to clipboard for WhatsApp or sharing"
              aria-label="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </button>

            <button
              onClick={() =>
                handleStartEdit(ctx.id, ctx.personalNotes, ctx.collectionId)
              }
              className={`rounded-lg p-1.5 border transition ${
                isLight
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              }`}
              title="Edit Personal Notes"
              aria-label="Edit Notes"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() =>
                setPendingDelete({
                  id: ctx.id,
                  type: 'context',
                  label: `Saved Context: ${ctx.verseRef} (${ctx.mainTheme})`,
                })
              }
              className={`rounded-lg p-1.5 border transition ${
                isLight
                  ? 'bg-stone-50 hover:bg-rose-50 border-stone-200 text-stone-500 hover:text-rose-600'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300 hover:text-rose-400'
              }`}
              title="Delete"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div
          className={`h-px w-full ${
            isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
          }`}
        />

        {/* Unified Explanation in One Continuous Location (No Multiple Dividers) */}
        <div
          className={`px-4 sm:px-5 py-3.5 space-y-2 text-xs leading-relaxed ${
            isLight ? 'text-stone-700' : 'text-zinc-200'
          }`}
        >
          <p
            className={`font-serif text-sm leading-relaxed ${
              isLight ? 'text-stone-900' : 'text-zinc-100'
            }`}
          >
            “{ctx.verseText}”
          </p>
          <p>
            {ctx.verseBreakdown
              .map((pt) =>
                pt.replace(
                  /^(What Is Being Discussed|How Preceding Verses Lead Here|How It Ties Into the Whole Passage):\s*/i,
                  ''
                )
              )
              .join(' ')}
          </p>
        </div>

        <div
          className={`h-px w-full ${
            isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
          }`}
        />

        {/* Personal Notes */}
        {isEditing ? (
          <div className="px-4 sm:px-5 py-3.5 space-y-3">
            <div>
              <label
                className={`text-[11px] font-bold block mb-1 ${
                  isLight ? 'text-stone-500' : 'text-zinc-400'
                }`}
              >
                Collection
              </label>
              <select
                value={editCollectionDraft}
                onChange={(e) => setEditCollectionDraft(e.target.value)}
                className={`w-full rounded-xl border px-3 py-1.5 text-xs ${
                  isLight
                    ? 'bg-white border-stone-300 text-stone-900'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                }`}
              >
                {collections.map((col) => (
                  <option
                    key={col.id}
                    value={col.id}
                    className={
                      isLight
                        ? 'bg-white text-stone-900'
                        : 'bg-zinc-900 text-zinc-100'
                    }
                  >
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`text-[11px] font-bold block mb-1 ${
                  isLight ? 'text-stone-500' : 'text-zinc-400'
                }`}
              >
                Personal Notes & Reflections
              </label>
              <textarea
                rows={3}
                value={editNotesDraft}
                onChange={(e) => setEditNotesDraft(e.target.value)}
                className={`w-full rounded-xl border p-2.5 text-xs ${
                  isLight
                    ? 'bg-white border-stone-300 text-stone-900 placeholder-stone-400'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                }`}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingItemId(null)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                  isLight
                    ? 'text-stone-600 hover:text-stone-900 border-stone-200'
                    : 'text-zinc-300 hover:text-white border-zinc-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateSavedContext(ctx.id, {
                    personalNotes: editNotesDraft.trim(),
                    collectionId: editCollectionDraft,
                  });
                  setEditingItemId(null);
                }}
                className={`rounded-xl px-4 py-1.5 text-xs font-bold ${
                  isLight
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-500 text-zinc-950'
                }`}
              >
                Save Notes
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`px-4 sm:px-5 py-3.5 text-xs leading-relaxed ${
              isLight ? 'text-stone-700' : 'text-zinc-200'
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                isLight ? 'text-stone-400' : 'text-zinc-400'
              }`}
            >
              Personal Notes & Reflections
            </span>
            {ctx.personalNotes ? (
              <p>{ctx.personalNotes}</p>
            ) : (
              <button
                onClick={() =>
                  handleStartEdit(ctx.id, ctx.personalNotes, ctx.collectionId)
                }
                className={`font-semibold hover:underline ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}
              >
                + Add personal notes & insights
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderVerseCard = (vItem: SavedVerseItem) => {
    const isEditing = editingItemId === vItem.id;
    const colLabel = getCollectionName(vItem.collectionId);
    return (
      <div
        key={vItem.id}
        className={`rounded-2xl border overflow-hidden transition ${
          isChildren
            ? isLight
              ? 'bg-[#FFF9E6] border-amber-300 text-slate-900 shadow-2xs'
              : 'bg-[#161D35] border-indigo-700/80 text-slate-100 shadow-md'
            : isLight
            ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
            : 'bg-[#161616] border-zinc-800 text-zinc-100'
        }`}
      >
        <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              title={`${vItem.verseRef} (${vItem.translation})`}
              className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${
                isChildren
                  ? isLight
                    ? 'bg-amber-200 text-amber-950 font-bold'
                    : 'bg-indigo-900 text-amber-300 font-bold'
                  : isLight
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-amber-500/20 text-amber-300'
              }`}
            >
              {vItem.verseRef} ({vItem.translation})
            </span>
            <span
              title={colLabel}
              className={`text-[11px] font-medium truncate ${
                isLight ? 'text-stone-500' : 'text-zinc-400'
              }`}
            >
              • {colLabel}
            </span>
            {vItem.sharedToCommunity && (
              <span
                title="Shared to Community"
                className={`shrink-0 ${
                  isLight ? 'text-emerald-600' : 'text-emerald-400'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleCopyVerse(vItem)}
              className={`rounded-lg p-1.5 transition ${
                isChildren
                  ? isLight
                    ? 'text-amber-900 hover:bg-amber-200/60'
                    : 'text-amber-300 hover:bg-indigo-900/60'
                  : isLight
                  ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`}
              title="Copy to clipboard for WhatsApp or sharing"
              aria-label="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </button>

            <button
              onClick={() =>
                handleStartEdit(
                  vItem.id,
                  vItem.personalNotes,
                  vItem.collectionId
                )
              }
              className={`rounded-lg p-1.5 border transition ${
                isLight
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              }`}
              title="Edit Personal Notes & Collection"
              aria-label="Edit Notes"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() =>
                setPendingDelete({
                  id: vItem.id,
                  type: 'verse',
                  label: `Saved Bible Verse: ${vItem.verseRef} (${vItem.translation})`,
                })
              }
              className={`rounded-lg p-1.5 border transition ${
                isLight
                  ? 'bg-stone-50 hover:bg-rose-50 border-stone-200 text-stone-500 hover:text-rose-600'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300 hover:text-rose-400'
              }`}
              title="Delete"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
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

        {/* Personal Notes */}
        {isEditing ? (
          <div className="px-4 sm:px-5 py-3.5 space-y-3">
            <div>
              <label
                className={`text-[11px] font-bold block mb-1 ${
                  isLight ? 'text-stone-500' : 'text-zinc-400'
                }`}
              >
                Collection
              </label>
              <select
                value={editCollectionDraft}
                onChange={(e) => setEditCollectionDraft(e.target.value)}
                className={`w-full rounded-xl border px-3 py-1.5 text-xs ${
                  isLight
                    ? 'bg-white border-stone-300 text-stone-900'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                }`}
              >
                {collections.map((col) => (
                  <option
                    key={col.id}
                    value={col.id}
                    className={
                      isLight
                        ? 'bg-white text-stone-900'
                        : 'bg-zinc-900 text-zinc-100'
                    }
                  >
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`text-[11px] font-bold block mb-1 ${
                  isLight ? 'text-stone-500' : 'text-zinc-400'
                }`}
              >
                Personal Notes & Reflections
              </label>
              <textarea
                rows={3}
                value={editNotesDraft}
                onChange={(e) => setEditNotesDraft(e.target.value)}
                className={`w-full rounded-xl border p-2.5 text-xs ${
                  isLight
                    ? 'bg-white border-stone-300 text-stone-900 placeholder-stone-400'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                }`}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingItemId(null)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                  isLight
                    ? 'text-stone-600 hover:text-stone-900 border-stone-200'
                    : 'text-zinc-300 hover:text-white border-zinc-700'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateSavedVerse(vItem.id, {
                    personalNotes: editNotesDraft.trim(),
                    collectionId: editCollectionDraft,
                  });
                  setEditingItemId(null);
                }}
                className={`rounded-xl px-4 py-1.5 text-xs font-bold ${
                  isLight
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-500 text-zinc-950'
                }`}
              >
                Save Notes
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`px-4 sm:px-5 py-3.5 text-xs leading-relaxed ${
              isLight ? 'text-stone-700' : 'text-zinc-200'
            }`}
          >
            <span
              className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${
                isLight ? 'text-stone-400' : 'text-zinc-400'
              }`}
            >
              Personal Notes & Reflections
            </span>
            {vItem.personalNotes ? (
              <p>{vItem.personalNotes}</p>
            ) : (
              <button
                onClick={() =>
                  handleStartEdit(
                    vItem.id,
                    vItem.personalNotes,
                    vItem.collectionId
                  )
                }
                className={`font-semibold hover:underline ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}
              >
                + Add personal notes & insights
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderTypeShadowCard = (tsItem: SavedTypeShadowItem) => {
    const isEditing = editingItemId === tsItem.id;
    const colLabel = getCollectionName(tsItem.collectionId);
    const fullRefLabel = `${tsItem.otTypeRef} ↔ ${tsItem.ntAntitypeRef}`;
    return (
      <div
        key={tsItem.id}
        className={`rounded-2xl border overflow-hidden transition ${
          isChildren
            ? isLight
              ? 'bg-[#FFF9E6] border-emerald-300 text-slate-900 shadow-2xs'
              : 'bg-[#161D35] border-emerald-700/80 text-slate-100 shadow-md'
            : isLight
            ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
            : 'bg-[#161616] border-zinc-800 text-zinc-100'
        }`}
      >
        {/* Top Row: Type & Shadow tag, OT ↔ NT reference, collection, and actions */}
        <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                isLight
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}
            >
              Type & Shadow
            </span>
            <span
              title={fullRefLabel}
              className={`text-xs sm:text-sm font-bold tracking-tight truncate ${
                isLight ? 'text-stone-900' : 'text-zinc-100'
              }`}
            >
              {fullRefLabel}
            </span>
            <span
              title={colLabel}
              className={`text-[11px] font-medium truncate hidden sm:inline ${
                isLight ? 'text-stone-500' : 'text-zinc-400'
              }`}
            >
              • {colLabel}
            </span>
            {tsItem.sharedToCommunity && (
              <span
                title="Shared to Community"
                className={`shrink-0 ${
                  isLight ? 'text-emerald-600' : 'text-emerald-400'
                }`}
              >
                <Globe className="h-3.5 w-3.5" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleCopyTypeShadow(tsItem)}
              className={`rounded-lg p-1.5 transition ${
                isChildren
                  ? isLight
                    ? 'text-amber-900 hover:bg-amber-200/60'
                    : 'text-amber-300 hover:bg-indigo-900/60'
                  : isLight
                  ? 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
              }`}
              title="Copy to clipboard for WhatsApp or sharing"
              aria-label="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </button>

            <button
              onClick={() =>
                handleStartEdit(
                  tsItem.id,
                  tsItem.personalNotes,
                  tsItem.collectionId
                )
              }
              className={`rounded-lg p-1.5 border transition ${
                isLight
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              }`}
              title="Edit Personal Notes & Collection"
              aria-label="Edit Notes"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>

            <button
              onClick={() =>
                setPendingDelete({
                  id: tsItem.id,
                  type: 'type_shadow',
                  label: `Saved Type & Shadow: ${tsItem.otTypeRef} ↔ ${tsItem.ntAntitypeRef}`,
                })
              }
              className={`rounded-lg p-1.5 border transition ${
                isLight
                  ? 'bg-stone-50 hover:bg-rose-50 border-stone-200 text-stone-500 hover:text-rose-600'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300 hover:text-rose-400'
              }`}
              title="Delete"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div
          className={`h-px w-full ${
            isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
          }`}
        />

        {/* Old Testament Type, New Testament Fulfilment, and Concise Explanation */}
        <div className="px-4 sm:px-5 py-3.5 space-y-3">
          <div className="space-y-1">
            <span
              className={`text-xs font-bold block ${
                isLight ? 'text-amber-800' : 'text-amber-400'
              }`}
            >
              Old Testament Type — {tsItem.otTypeRef} ({tsItem.translation})
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
                isLight ? 'text-emerald-800' : 'text-emerald-400'
              }`}
            >
              New Testament Fulfilment — {tsItem.ntAntitypeRef} ({tsItem.translation})
            </span>
            <p
              className={`font-serif text-xs sm:text-sm leading-relaxed ${
                isLight ? 'text-stone-800' : 'text-zinc-100'
              }`}
            >
              “{tsItem.ntAntitypeText}”
            </p>
          </div>

          {tsItem.explanation && (
            <p
              className={`text-xs leading-relaxed pt-0.5 ${
                isLight ? 'text-stone-700' : 'text-zinc-300'
              }`}
            >
              {tsItem.explanation}
            </p>
          )}
        </div>

        {isEditing && (
          <>
            <div
              className={`h-px w-full ${
                isLight ? 'bg-stone-200/90' : 'bg-zinc-800'
              }`}
            />
            <div className="px-4 sm:px-5 py-3.5 space-y-3">
              <div>
                <label
                  className={`text-[11px] font-bold block mb-1 ${
                    isLight ? 'text-stone-500' : 'text-zinc-400'
                  }`}
                >
                  Collection
                </label>
                <select
                  value={editCollectionDraft}
                  onChange={(e) => setEditCollectionDraft(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-1.5 text-xs ${
                    isLight
                      ? 'bg-white border-stone-300 text-stone-900'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                  }`}
                >
                  {collections.map((col) => (
                    <option
                      key={col.id}
                      value={col.id}
                      className={
                        isLight
                          ? 'bg-white text-stone-900'
                          : 'bg-zinc-900 text-zinc-100'
                      }
                    >
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className={`text-[11px] font-bold block mb-1 ${
                    isLight ? 'text-stone-500' : 'text-zinc-400'
                  }`}
                >
                  Personal Notes & Reflections
                </label>
                <textarea
                  rows={3}
                  value={editNotesDraft}
                  onChange={(e) => setEditNotesDraft(e.target.value)}
                  className={`w-full rounded-xl border p-2.5 text-xs ${
                    isLight
                      ? 'bg-white border-stone-300 text-stone-900 placeholder-stone-400'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingItemId(null)}
                  className={`rounded-xl border px-3 py-1.5 text-xs font-semibold ${
                    isLight
                      ? 'text-stone-600 hover:text-stone-900 border-stone-200'
                      : 'text-zinc-300 hover:text-white border-zinc-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateSavedTypeShadow(tsItem.id, {
                      personalNotes: editNotesDraft.trim(),
                      collectionId: editCollectionDraft,
                    });
                    setEditingItemId(null);
                  }}
                  className={`rounded-xl px-4 py-1.5 text-xs font-bold ${
                    isLight
                      ? 'bg-amber-700 text-white'
                      : 'bg-amber-500 text-zinc-950'
                  }`}
                >
                  Save Notes
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 min-w-0 pb-28 lg:pb-16">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-8 pt-6 sm:pt-8 space-y-4">
        {/* 1. Saved Header Row: Saved Heading on Left (no icon in front), Search Icon at Top-Right on the Same Horizontal Line */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center min-w-0">
            <h1
              className={`text-2xl sm:text-3xl font-serif font-bold tracking-tight truncate ${
                isLight ? 'text-stone-900' : 'text-white'
              }`}
            >
              Saved
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
            title="Search Saved items"
            aria-label="Toggle Saved Search"
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
              placeholder="Search saved verses, context, types & shadows, or references..."
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
            className={`min-w-0 rounded-xl border px-2.5 sm:px-3 py-2 flex items-center gap-1.5 transition ${
              isChildren
                ? isLight
                  ? 'bg-amber-100/90 border-amber-300 text-amber-950 font-bold shadow-2xs'
                  : 'bg-indigo-900/80 border-indigo-700 text-amber-200 font-bold'
                : isLight
                ? 'bg-white border-stone-200/90 text-stone-800 shadow-2xs'
                : 'bg-[#161616] border-zinc-800 text-zinc-100'
            }`}
          >
            <Filter
              className={`h-3.5 w-3.5 shrink-0 ${
                isChildren
                  ? isLight
                    ? 'text-amber-800'
                    : 'text-amber-300'
                  : isLight
                  ? 'text-amber-700'
                  : 'text-amber-400'
              }`}
            />
            <select
              value={contentFilter}
              onChange={(e) =>
                setContentFilter(e.target.value as SavedContentFilter)
              }
              aria-label="Filter by Content Category"
              className={`w-full min-w-0 bg-transparent text-xs font-semibold truncate focus:outline-none ${
                isChildren
                  ? isLight
                    ? 'text-amber-950 font-extrabold'
                    : 'text-amber-200 font-extrabold'
                  : isLight
                  ? 'text-stone-800'
                  : 'text-zinc-100'
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
            className={`min-w-0 rounded-xl border px-2.5 sm:px-3 py-2 flex items-center justify-between gap-1.5 transition ${
              isChildren
                ? isLight
                  ? 'bg-amber-100/90 border-amber-300 text-amber-950 font-bold shadow-2xs'
                  : 'bg-indigo-900/80 border-indigo-700 text-amber-200 font-bold'
                : isLight
                ? 'bg-white border-stone-200/90 text-stone-800 shadow-2xs'
                : 'bg-[#161616] border-zinc-800 text-zinc-100'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Folder
                className={`h-3.5 w-3.5 shrink-0 ${
                  isChildren
                    ? isLight
                      ? 'text-amber-800'
                      : 'text-amber-300'
                    : isLight
                    ? 'text-amber-700'
                    : 'text-amber-400'
                }`}
              />
              <select
                value={selectedCollectionId}
                onChange={(e) => setSelectedCollectionId(e.target.value)}
                aria-label="Filter by Collection"
                className={`w-full min-w-0 bg-transparent text-xs font-semibold truncate focus:outline-none ${
                  isChildren
                    ? isLight
                      ? 'text-amber-950 font-extrabold'
                      : 'text-amber-200 font-extrabold'
                    : isLight
                    ? 'text-stone-800'
                    : 'text-zinc-100'
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
                {collections.map((col) => (
                  <option
                    key={col.id}
                    value={col.id}
                    className={
                      isLight
                        ? 'bg-white text-stone-900'
                        : 'bg-[#161616] text-zinc-100'
                    }
                  >
                    {col.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => setIsNewCollectionOpen(true)}
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

        {/* Saved Content Display */}
        <div className="space-y-4">
          {contentFilter === 'all' &&
            filteredConnections.length === 0 &&
            filteredContexts.length === 0 &&
            filteredVerses.length === 0 &&
            filteredTypeShadows.length === 0 && (
              <div
                className={`rounded-2xl border p-8 text-center space-y-2 ${
                  isChildren
                    ? isLight
                      ? 'bg-[#FFF9E6] border-amber-300 text-slate-900 shadow-2xs'
                      : 'bg-[#161D35] border-indigo-700/80 text-slate-100 shadow-md'
                    : isLight
                    ? 'bg-white border-stone-200 text-stone-600'
                    : 'bg-[#161616] border-zinc-800 text-zinc-300'
                }`}
              >
                <p
                  className={`text-sm font-semibold ${
                    isLight ? 'text-stone-800' : 'text-zinc-100'
                  }`}
                >
                  No saved items found.
                </p>
                <p
                  className={`text-xs ${
                    isLight ? 'text-stone-500' : 'text-zinc-400'
                  }`}
                >
                  Tap any verse on the Bible page to save Bible verses, content, types and shadows, or references.
                </p>
              </div>
            )}

          {(contentFilter === 'all' || contentFilter === 'verses') && (
            <>
              {contentFilter === 'verses' && filteredVerses.length === 0 ? (
                <div
                  className={`rounded-2xl border p-8 text-center space-y-2 ${
                    isChildren
                      ? isLight
                        ? 'bg-[#FFF9E6] border-amber-300 text-slate-900 shadow-2xs'
                        : 'bg-[#161D35] border-indigo-700/80 text-slate-100 shadow-md'
                      : isLight
                      ? 'bg-white border-stone-200 text-stone-600'
                      : 'bg-[#161616] border-zinc-800 text-zinc-300'
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      isLight ? 'text-stone-800' : 'text-zinc-100'
                    }`}
                  >
                    No saved Bible verses found.
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
                    isChildren
                      ? isLight
                        ? 'bg-[#FFF9E6] border-amber-300 text-slate-900 shadow-2xs'
                        : 'bg-[#161D35] border-indigo-700/80 text-slate-100 shadow-md'
                      : isLight
                      ? 'bg-white border-stone-200 text-stone-600'
                      : 'bg-[#161616] border-zinc-800 text-zinc-300'
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      isLight ? 'text-stone-800' : 'text-zinc-100'
                    }`}
                  >
                    No saved content items found.
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
                    isChildren
                      ? isLight
                        ? 'bg-[#FFF9E6] border-amber-300 text-slate-900 shadow-2xs'
                        : 'bg-[#161D35] border-indigo-700/80 text-slate-100 shadow-md'
                      : isLight
                      ? 'bg-white border-stone-200 text-stone-600'
                      : 'bg-[#161616] border-zinc-800 text-zinc-300'
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      isLight ? 'text-stone-800' : 'text-zinc-100'
                    }`}
                  >
                    No saved Type and Shadow items found.
                  </p>
                </div>
              ) : (
                filteredTypeShadows.map((tsItem) =>
                  renderTypeShadowCard(tsItem)
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
                    isChildren
                      ? isLight
                        ? 'bg-[#FFF9E6] border-amber-300 text-slate-900 shadow-2xs'
                        : 'bg-[#161D35] border-indigo-700/80 text-slate-100 shadow-md'
                      : isLight
                      ? 'bg-white border-stone-200 text-stone-600'
                      : 'bg-[#161616] border-zinc-800 text-zinc-300'
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      isLight ? 'text-stone-800' : 'text-zinc-100'
                    }`}
                  >
                    No saved references found.
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
          MODAL: DELETE CONFIRMATION POPUP
          ===================================================================== */}
      {pendingDelete && (
        <div
          onClick={() => setPendingDelete(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 ${
              isLight
                ? 'bg-white border-stone-200 text-stone-900'
                : 'bg-[#181818] border-zinc-800 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2
                className={`text-base font-bold ${
                  isLight ? 'text-stone-900' : 'text-zinc-100'
                }`}
              >
                Confirm Deletion
              </h2>
              <button
                onClick={() => setPendingDelete(null)}
                className={`rounded-lg p-1 ${
                  isLight
                    ? 'text-stone-400 hover:text-stone-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <p className={isLight ? 'text-stone-600' : 'text-zinc-300'}>
                Are you sure you want to permanently delete this item?
              </p>
              <p
                className={`font-bold px-3 py-2 rounded-xl border ${
                  isLight
                    ? 'bg-stone-50 border-stone-200 text-stone-900'
                    : 'bg-[#121212] border-zinc-800 text-zinc-100'
                }`}
              >
                {pendingDelete.label}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className={`rounded-xl border px-4 py-2 font-semibold ${
                  isLight
                    ? 'text-stone-600 hover:text-stone-900 border-stone-200'
                    : 'text-zinc-300 hover:text-white border-zinc-700'
                }`}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl px-5 py-2 font-bold bg-rose-600 hover:bg-rose-700 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CREATE NEW COLLECTION
          ===================================================================== */}
      {isNewCollectionOpen && (
        <div
          onClick={() => setIsNewCollectionOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 ${
              isLight
                ? 'bg-white border-stone-200 text-stone-900'
                : 'bg-[#181818] border-zinc-800 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2
                className={`text-base font-bold ${
                  isLight ? 'text-stone-900' : 'text-zinc-100'
                }`}
              >
                Create New Collection
              </h2>
              <button
                onClick={() => setIsNewCollectionOpen(false)}
                className={`rounded-lg p-1 ${
                  isLight
                    ? 'text-stone-400 hover:text-stone-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCollectionSubmit} className="space-y-3 text-xs">
              <div>
                <label
                  className={`font-bold block mb-1 ${
                    isLight ? 'text-stone-600' : 'text-zinc-300'
                  }`}
                >
                  Collection Name
                </label>
                <input
                  type="text"
                  required
                  value={colNameInput}
                  onChange={(e) => setColNameInput(e.target.value)}
                  placeholder="e.g. Parables of the Kingdom"
                  className={`w-full rounded-xl border px-3 py-2 ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                  }`}
                />
              </div>

              <div>
                <label
                  className={`font-bold block mb-1 ${
                    isLight ? 'text-stone-600' : 'text-zinc-300'
                  }`}
                >
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={colDescInput}
                  onChange={(e) => setColDescInput(e.target.value)}
                  placeholder="What scriptures or themes belong to this collection?"
                  className={`w-full rounded-xl border p-2.5 ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCollectionOpen(false)}
                  className={`rounded-xl border px-4 py-2 font-semibold ${
                    isLight
                      ? 'text-stone-600 hover:text-stone-900 border-stone-200'
                      : 'text-zinc-300 hover:text-white border-zinc-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-xl px-5 py-2 font-bold ${
                    isLight
                      ? 'bg-amber-700 hover:bg-amber-800 text-white'
                      : 'bg-amber-500 text-zinc-950'
                  }`}
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
