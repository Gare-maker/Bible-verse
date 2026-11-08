'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Compass,
  Edit3,
  Folder,
  FolderPlus,
  Globe,
  Link2,
  Search,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import {
  NotebookCollection,
  SavedConnection,
  SavedContextItem,
  SavedVerseItem,
} from '@/types/bible';
import { usePlatform } from '@/context/PlatformContext';

type SavedContentFilter = 'all' | 'connections' | 'context' | 'verses';
type SavedSearchCategory = 'collections' | 'connections' | 'context' | 'verses';

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
    collections,
    createCollection,
    preferences,
  } = usePlatform();

  const isLight = preferences.theme === 'light';

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
    type: 'connection' | 'context' | 'verse';
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
    }
    setPendingDelete(null);
  };

  const getCollectionName = (colId?: string) => {
    if (!colId) return 'General Collection';
    return collections.find((c) => c.id === colId)?.name || 'General Collection';
  };

  // Main page filtered items (by selectedCollectionId)
  const filteredConnections = useMemo(() => {
    return savedConnections.filter((c) => {
      if (selectedCollectionId !== 'ALL' && c.collectionId !== selectedCollectionId) {
        return false;
      }
      return true;
    });
  }, [savedConnections, selectedCollectionId]);

  const filteredContexts = useMemo(() => {
    return savedContexts.filter((c) => {
      if (selectedCollectionId !== 'ALL' && c.collectionId !== selectedCollectionId) {
        return false;
      }
      return true;
    });
  }, [savedContexts, selectedCollectionId]);

  const filteredVerses = useMemo(() => {
    return savedVerses.filter((v) => {
      if (selectedCollectionId !== 'ALL' && v.collectionId !== selectedCollectionId) {
        return false;
      }
      return true;
    });
  }, [savedVerses, selectedCollectionId]);

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

  const renderConnectionCard = (conn: SavedConnection) => {
    const isEditing = editingItemId === conn.id;
    const fullRefLabel = `${conn.primaryRef} ↔ ${conn.connectedRef}`;
    return (
      <div
        key={conn.id}
        className={`rounded-2xl border overflow-hidden transition ${
          isLight
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
              onClick={() =>
                updateSavedConnection(conn.id, {
                  sharedToCommunity: !conn.sharedToCommunity,
                })
              }
              className={`rounded-lg p-1.5 border transition ${
                conn.sharedToCommunity
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : isLight
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              }`}
              title={
                conn.sharedToCommunity
                  ? 'Shared to Community'
                  : 'Share to Community'
              }
              aria-label="Toggle Share to Community"
            >
              <Share2 className="h-3.5 w-3.5" />
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
          isLight
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
                isLight ? 'text-amber-900' : 'text-amber-400'
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
              onClick={() =>
                updateSavedContext(ctx.id, {
                  sharedToCommunity: !ctx.sharedToCommunity,
                })
              }
              className={`rounded-lg p-1.5 border transition ${
                ctx.sharedToCommunity
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : isLight
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              }`}
              title={
                ctx.sharedToCommunity
                  ? 'Shared to Community'
                  : 'Share to Community'
              }
              aria-label="Toggle Share to Community"
            >
              <Share2 className="h-3.5 w-3.5" />
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

        {/* Verse Text */}
        <div
          className={`px-4 sm:px-5 py-3.5 font-serif text-sm leading-relaxed ${
            isLight ? 'text-stone-900' : 'text-zinc-100'
          }`}
        >
          “{ctx.verseText}”
        </div>

        {/* Context Breakdown separated by clean horizontal lines */}
        {ctx.verseBreakdown.map((pt, i) => (
          <React.Fragment key={i}>
            <div
              className={`h-px w-full ${
                isLight ? 'bg-stone-200/80' : 'bg-zinc-800'
              }`}
            />
            <div
              className={`px-4 sm:px-5 py-3 text-xs leading-relaxed ${
                isLight ? 'text-stone-700' : 'text-zinc-200'
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
          isLight
            ? 'bg-white border-stone-200/90 text-stone-900 shadow-2xs'
            : 'bg-[#161616] border-zinc-800 text-zinc-100'
        }`}
      >
        <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              title={`${vItem.verseRef} (${vItem.translation})`}
              className={`shrink-0 rounded-md px-2 py-0.5 text-xs font-semibold ${
                isLight
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
              onClick={() =>
                updateSavedVerse(vItem.id, {
                  sharedToCommunity: !vItem.sharedToCommunity,
                })
              }
              className={`rounded-lg p-1.5 border transition ${
                vItem.sharedToCommunity
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : isLight
                  ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                  : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
              }`}
              title={
                vItem.sharedToCommunity
                  ? 'Shared to Community'
                  : 'Share to Community'
              }
              aria-label="Toggle Share to Community"
            >
              <Share2 className="h-3.5 w-3.5" />
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

  return (
    <div className="flex-1 min-w-0 pb-28 lg:pb-16">
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 pt-8 sm:pt-10 space-y-6">
        {isSearchViewOpen ? (
          /* =================================================================
             DEDICATED WHATSAPP-STYLE SEARCH VIEW FOR SAVED
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
                title="Back to Saved"
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
                placeholder={`Search Saved ${
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
                              {col.description || 'Saved study collection'}
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
                        No matching saved connections found.
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
                        No matching saved contexts found.
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
                        No matching saved Bible verses found.
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
             STANDARD SAVED PAGE VIEW
             ================================================================= */
          <>
            {/* 1A. Heading on the Left + Prominent Search Icon on the Far Right */}
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h1
                  className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight ${
                    isLight ? 'text-stone-900' : 'text-white'
                  }`}
                >
                  Saved
                </h1>
                <p
                  className={`text-xs sm:text-sm mt-1 ${
                    isLight ? 'text-stone-500' : 'text-zinc-400'
                  }`}
                >
                  Your saved scripture connections, verse contexts, Bible verses, and personal insights.
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
                title="Search Saved items"
                aria-label="Open Saved Search"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {/* 1C. Horizontal Filter Row:
                All | Connections | Contexts | Bible Verses | Collection filter | Add Collection
                (Old tab navigation and its bottom divider removed) */}
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
                  className={`bg-transparent text-xs font-semibold focus:outline-none max-w-[135px] sm:max-w-[180px] truncate ${
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

              {/* Add Collection Action */}
              <button
                type="button"
                onClick={() => setIsNewCollectionOpen(true)}
                className={`rounded-xl border px-3 py-2 text-xs font-bold inline-flex items-center gap-1.5 transition shrink-0 ${
                  isLight
                    ? 'bg-white hover:bg-stone-100 border-stone-200/90 text-stone-800'
                    : 'bg-[#161616] hover:bg-zinc-800 border-zinc-800 text-zinc-100'
                }`}
                title="Add Collection"
                aria-label="Add Collection"
              >
                <FolderPlus className="h-3.5 w-3.5" />
                <span>Add Collection</span>
              </button>
            </div>

            {/* Saved Content Display */}
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
                      No saved items found in this collection.
                    </p>
                    <p
                      className={`text-xs ${
                        isLight ? 'text-stone-500' : 'text-zinc-400'
                      }`}
                    >
                      Tap any verse on the Bible page to save scripture connections, verse contexts, or Bible verses.
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
                        No saved connections found.
                      </p>
                      <p
                        className={`text-xs ${
                          isLight ? 'text-stone-500' : 'text-zinc-400'
                        }`}
                      >
                        Tap any verse on the Bible page to save a scripture connection with your reflections.
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
                        No saved verse contexts found.
                      </p>
                      <p
                        className={`text-xs ${
                          isLight ? 'text-stone-500' : 'text-zinc-400'
                        }`}
                      >
                        Tap any verse on the Bible page and save its Context breakdown with your personal notes.
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
                        No saved Bible verses found.
                      </p>
                      <p
                        className={`text-xs ${
                          isLight ? 'text-stone-500' : 'text-zinc-400'
                        }`}
                      >
                        Tap any verse on the Bible page and save it with your personal notes.
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
