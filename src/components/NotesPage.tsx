'use client';

import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  Compass,
  Edit3,
  ExternalLink,
  Folder,
  FolderPlus,
  Globe,
  Link2,
  Lock,
  Plus,
  Search,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import {
  SavedConnection,
  SavedContextItem,
  SavedVerseItem,
} from '@/types/bible';
import { usePlatform } from '@/context/PlatformContext';

type SavedTab = 'connections' | 'context' | 'verses';

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
    navigateToReferenceString,
    preferences,
  } = usePlatform();

  const isLight = preferences.theme === 'light';

  // Requirement 5.1: Initial Page Position — Always start at the very top
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, []);

  const [activeTab, setActiveTab] = useState<SavedTab>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('ALL');

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

  // Filter Saved Connections
  const filteredConnections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
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
        c.personalObservation.toLowerCase().includes(q)
      );
    });
  }, [savedConnections, searchQuery, selectedCollectionId]);

  // Filter Saved Contexts
  const filteredContexts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
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
        c.personalNotes.toLowerCase().includes(q)
      );
    });
  }, [savedContexts, searchQuery, selectedCollectionId]);

  // Filter Saved Bible Verses
  const filteredVerses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return savedVerses.filter((v) => {
      if (selectedCollectionId !== 'ALL' && v.collectionId !== selectedCollectionId) {
        return false;
      }
      if (!q) return true;
      return (
        v.verseRef.toLowerCase().includes(q) ||
        v.verseText.toLowerCase().includes(q) ||
        v.personalNotes.toLowerCase().includes(q)
      );
    });
  }, [savedVerses, searchQuery, selectedCollectionId]);

  const getCollectionName = (colId?: string) => {
    if (!colId) return 'General Collection';
    return collections.find((c) => c.id === colId)?.name || 'General Collection';
  };

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

  return (
    <div className="flex-1 min-w-0 pb-28 lg:pb-16">
      <div className="mx-auto w-full max-w-4xl px-5 sm:px-8 pt-8 sm:pt-10 space-y-6">
        {/* ===================================================================
            PROMINENT LARGE HEADER TITLE: "Saved" (No Add Save button)
            =================================================================== */}
        <div>
          <h1
            className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight ${
              isLight ? 'text-stone-900' : 'text-white'
            }`}
          >
            Saved
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-zinc-400 mt-1">
            Your saved scripture connections, verse contexts, Bible verses, and personal insights.
          </p>
        </div>

        {/* ===================================================================
            SEARCH & COLLECTION CONTROLS (Side-by-Side on the same row)
            =================================================================== */}
        <div className="flex items-center gap-2 w-full">
          {/* Search Input on the Left */}
          <div
            className={`flex-1 min-w-0 rounded-2xl border px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xs ${
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
              placeholder="Search saves..."
              className="w-full bg-transparent text-xs sm:text-sm focus:outline-none text-stone-900 dark:text-zinc-100 placeholder-stone-400 dark:placeholder-zinc-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="rounded-lg p-0.5 text-stone-400 hover:text-stone-700 dark:text-zinc-400 dark:hover:text-zinc-200 shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Collection Selector & Add Collection on the Right */}
          <div className="flex items-center gap-1.5 shrink-0">
            <select
              value={selectedCollectionId}
              onChange={(e) => setSelectedCollectionId(e.target.value)}
              className={`rounded-2xl border px-3 py-2.5 text-xs font-semibold max-w-[130px] sm:max-w-[190px] truncate ${
                isLight
                  ? 'bg-white border-stone-200/90 text-stone-800'
                  : 'bg-[#161616] border-zinc-800 text-zinc-100'
              }`}
            >
              <option value="ALL" className="bg-white dark:bg-[#161616] text-stone-900 dark:text-zinc-100">All Collections</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id} className="bg-white dark:bg-[#161616] text-stone-900 dark:text-zinc-100">
                  {col.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setIsNewCollectionOpen(true)}
              className={`rounded-2xl border p-2.5 text-xs font-bold transition shrink-0 ${
                isLight
                  ? 'bg-white hover:bg-stone-50 border-stone-200/90 text-stone-700'
                  : 'bg-[#161616] hover:bg-zinc-800 border-zinc-800 text-zinc-200'
              }`}
              title="Add Collection"
              aria-label="Add Collection"
            >
              <FolderPlus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ===================================================================
            TABS (Connections | Context | Bible Verses — No Numerical Counters)
            =================================================================== */}
        <div className="overflow-x-auto no-scrollbar">
          <div
            className={`inline-flex items-center rounded-2xl border p-1 gap-1 ${
              isLight
                ? 'bg-stone-100/90 border-stone-200/90'
                : 'bg-[#161616] border-zinc-800'
            }`}
          >
            <button
              onClick={() => setActiveTab('connections')}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
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
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
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
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition ${
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
            TAB 1: SAVED CONNECTIONS
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
                <p className="text-sm font-semibold text-stone-700 dark:text-zinc-200">No saved connections found.</p>
                <p className="text-xs text-stone-500 dark:text-zinc-400">
                  Tap any verse on the Bible page to save a scripture connection with your reflections.
                </p>
              </div>
            ) : (
              filteredConnections.map((conn: SavedConnection) => {
                const isEditing = editingItemId === conn.id;
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
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span
                          className={`text-xs sm:text-sm font-bold tracking-tight ${
                            isLight ? 'text-amber-900' : 'text-amber-400'
                          }`}
                        >
                          {conn.primaryRef} ↔ {conn.connectedRef}
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-zinc-400 font-medium truncate">
                          • {conn.category || 'Connected'}
                        </span>
                        {conn.sharedToCommunity && (
                          <span title="Shared to Community" className="text-emerald-600 dark:text-emerald-400">
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
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                          }`}
                          title={conn.sharedToCommunity ? 'Shared to Community' : 'Share to Community'}
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
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300'
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
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-rose-400'
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
                      <span className={`text-xs font-bold block ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                        {conn.primaryRef} ({conn.translation})
                      </span>
                      <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
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
                      <span className={`text-xs font-bold block ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                        {conn.connectedRef} ({conn.translation})
                      </span>
                      <p className="font-serif text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-zinc-200">
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
                            <label className="text-[11px] font-bold text-stone-500 dark:text-zinc-400 block mb-1">
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
                                <option key={col.id} value={col.id} className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100">
                                  {col.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-stone-500 dark:text-zinc-400 block mb-1">
                            Personal Notes & Reflections
                          </label>
                          <textarea
                            rows={3}
                            value={editNotesDraft}
                            onChange={(e) => setEditNotesDraft(e.target.value)}
                            placeholder="Write your reflections and insights on this connection..."
                            className={`w-full rounded-xl border p-2.5 text-xs ${
                              isLight
                                ? 'bg-white border-stone-300 text-stone-900'
                                : 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                            }`}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="rounded-xl border px-3 py-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200 border-stone-200 dark:border-zinc-700"
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
                      <div className="px-4 sm:px-5 py-3.5 text-xs leading-relaxed text-stone-700 dark:text-zinc-300">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block mb-1">
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
                            className="text-amber-700 dark:text-amber-400 font-semibold hover:underline"
                          >
                            + Add personal notes & insights
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 2: SAVED CONTEXT
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
                <p className="text-sm font-semibold text-stone-700 dark:text-zinc-200">No saved verse contexts found.</p>
                <p className="text-xs text-stone-500 dark:text-zinc-400">
                  Tap any verse on the Bible page and save its Context breakdown with your personal notes.
                </p>
              </div>
            ) : (
              filteredContexts.map((ctx: SavedContextItem) => {
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
                    {/* Top Row: Verse ref, main theme, community icon on left; Share, Edit, Delete on right */}
                    <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span
                          className={`text-xs sm:text-sm font-bold tracking-tight ${
                            isLight ? 'text-amber-900' : 'text-amber-400'
                          }`}
                        >
                          {ctx.verseRef} ({ctx.translation})
                        </span>
                        <span className="text-[11px] text-stone-500 dark:text-zinc-400 font-medium truncate">
                          • {ctx.mainTheme}
                        </span>
                        {ctx.sharedToCommunity && (
                          <span title="Shared to Community" className="text-emerald-600 dark:text-emerald-400">
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
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                          }`}
                          title={ctx.sharedToCommunity ? 'Shared to Community' : 'Share to Community'}
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
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300'
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
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-rose-400'
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
                    <div className="px-4 sm:px-5 py-3.5 font-serif text-sm leading-relaxed text-stone-900 dark:text-zinc-100">
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
                        <div className="px-4 sm:px-5 py-3 text-xs leading-relaxed text-stone-700 dark:text-zinc-200">
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
                          <label className="text-[11px] font-bold text-stone-500 dark:text-zinc-400 block mb-1">
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
                              <option key={col.id} value={col.id} className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100">
                                {col.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-stone-500 dark:text-zinc-400 block mb-1">
                            Personal Notes & Reflections
                          </label>
                          <textarea
                            rows={3}
                            value={editNotesDraft}
                            onChange={(e) => setEditNotesDraft(e.target.value)}
                            className={`w-full rounded-xl border p-2.5 text-xs ${
                              isLight
                                ? 'bg-white border-stone-300 text-stone-900'
                                : 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                            }`}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="rounded-xl border px-3 py-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200 border-stone-200 dark:border-zinc-700"
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
                      <div className="px-4 sm:px-5 py-3.5 text-xs leading-relaxed text-stone-700 dark:text-zinc-300">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block mb-1">
                          Personal Notes & Reflections
                        </span>
                        {ctx.personalNotes ? (
                          <p>{ctx.personalNotes}</p>
                        ) : (
                          <button
                            onClick={() =>
                              handleStartEdit(ctx.id, ctx.personalNotes, ctx.collectionId)
                            }
                            className="text-amber-700 dark:text-amber-400 font-semibold hover:underline"
                          >
                            + Add personal notes & insights
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ===================================================================
            TAB 3: SAVED BIBLE VERSES
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
                <p className="text-sm font-semibold text-stone-700 dark:text-zinc-200">No saved Bible verses found.</p>
                <p className="text-xs text-stone-500 dark:text-zinc-400">
                  Tap any verse on the Bible page and save it with your personal notes.
                </p>
              </div>
            ) : (
              filteredVerses.map((vItem: SavedVerseItem) => {
                const isEditing = editingItemId === vItem.id;
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
                        {vItem.sharedToCommunity && (
                          <span title="Shared to Community" className="text-emerald-600 dark:text-emerald-400">
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
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                          }`}
                          title={vItem.sharedToCommunity ? 'Shared to Community' : 'Share to Community'}
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
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300'
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
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-rose-400'
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
                    <div className="px-4 sm:px-5 py-4 font-serif text-base leading-relaxed text-stone-900 dark:text-zinc-100">
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
                          <label className="text-[11px] font-bold text-stone-500 dark:text-zinc-400 block mb-1">
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
                              <option key={col.id} value={col.id} className="bg-white dark:bg-zinc-900 text-stone-900 dark:text-zinc-100">
                                {col.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-stone-500 dark:text-zinc-400 block mb-1">
                            Personal Notes & Reflections
                          </label>
                          <textarea
                            rows={3}
                            value={editNotesDraft}
                            onChange={(e) => setEditNotesDraft(e.target.value)}
                            className={`w-full rounded-xl border p-2.5 text-xs ${
                              isLight
                                ? 'bg-white border-stone-300 text-stone-900'
                                : 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                            }`}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="rounded-xl border px-3 py-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200 border-stone-200 dark:border-zinc-700"
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
                      <div className="px-4 sm:px-5 py-3.5 text-xs leading-relaxed text-stone-700 dark:text-zinc-300">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-zinc-500 block mb-1">
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
                            className="text-amber-700 dark:text-amber-400 font-semibold hover:underline"
                          >
                            + Add personal notes & insights
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* =====================================================================
          MODAL: DELETE CONFIRMATION POPUP
          ===================================================================== */}
      {pendingDelete && (
        <div
          onClick={() => setPendingDelete(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
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
              <h2 className="text-base font-bold text-stone-900 dark:text-zinc-100">
                Confirm Deletion
              </h2>
              <button
                onClick={() => setPendingDelete(null)}
                className="rounded-lg p-1 text-stone-400 hover:text-stone-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <p className="text-stone-600 dark:text-zinc-300">
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
                className="rounded-xl border px-4 py-2 font-semibold text-stone-600 hover:text-stone-900 dark:text-zinc-300 dark:hover:text-white border-stone-200 dark:border-zinc-700"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4"
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
              <h2 className="text-base font-bold text-stone-900 dark:text-zinc-100">Create New Collection</h2>
              <button
                onClick={() => setIsNewCollectionOpen(false)}
                className="rounded-lg p-1 text-stone-400 hover:text-stone-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCollectionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-500 dark:text-zinc-400 block mb-1">
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
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-stone-500 dark:text-zinc-400 block mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={colDescInput}
                  onChange={(e) => setColDescInput(e.target.value)}
                  placeholder="What scriptures or themes belong to this collection?"
                  className={`w-full rounded-xl border p-2.5 ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-100 placeholder-zinc-500'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCollectionOpen(false)}
                  className="rounded-xl border px-4 py-2 font-semibold text-stone-500 hover:text-stone-800 dark:text-zinc-400 dark:hover:text-zinc-200 border-stone-200 dark:border-zinc-700"
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
