'use client';

import React, { useMemo, useState } from 'react';
import {
  Bookmark,
  BookOpen,
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
  ReferenceCategory,
  SavedConnection,
  SavedContextItem,
  SavedVerseItem,
} from '@/types/bible';
import { getVerseText } from '@/data/scriptureDatabase';
import { buildVerseContextData, resolveScriptureVerse } from '@/services/bibleService';
import { usePlatform } from '@/context/PlatformContext';

type SavedTab = 'connections' | 'context' | 'verses';

const REFERENCE_CATEGORIES: ReferenceCategory[] = [
  'Prophecy fulfilment',
  'Direct quotation',
  'Prophecy',
  'Allusion',
  'Thematic connection',
  'Parallel passage',
  'Historical connection',
];

export default function NotesPage() {
  const {
    translation,
    savedConnections,
    saveConnectionToNotes,
    updateSavedConnection,
    deleteSavedConnection,
    savedContexts,
    saveContextItem,
    updateSavedContext,
    deleteSavedContext,
    savedVerses,
    saveBibleVerseItem,
    updateSavedVerse,
    deleteSavedVerse,
    collections,
    createCollection,
    navigateToReferenceString,
    preferences,
  } = usePlatform();

  const isLight = preferences.theme === 'light';

  const [activeTab, setActiveTab] = useState<SavedTab>('connections');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('ALL');

  // Inline Editing State for Personal Notes & Collection
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editNotesDraft, setEditNotesDraft] = useState('');
  const [editCollectionDraft, setEditCollectionDraft] = useState<string>('');

  // Create New Saved Item Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addType, setAddType] = useState<SavedTab>('connections');
  const [primaryRefInput, setPrimaryRefInput] = useState('Matthew 1:23');
  const [connectedRefInput, setConnectedRefInput] = useState('Isaiah 7:14');
  const [newCategory, setNewCategory] = useState<ReferenceCategory>('Prophecy fulfilment');
  const [newPersonalNotes, setNewPersonalNotes] = useState('');
  const [newCollectionId, setNewCollectionId] = useState<string>(
    collections[0]?.id || 'col-messianic'
  );
  const [newShareToCommunity, setNewShareToCommunity] = useState<boolean>(false);
  const [isSavingNew, setIsSavingNew] = useState(false);

  // Create New Collection Modal
  const [isNewCollectionOpen, setIsNewCollectionOpen] = useState(false);
  const [colNameInput, setColNameInput] = useState('');
  const [colDescInput, setColDescInput] = useState('');

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

  const handleCreateNewSavedItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!primaryRefInput.trim()) return;
    setIsSavingNew(true);

    try {
      const resolvedPrimary = await resolveScriptureVerse(
        primaryRefInput.trim(),
        translation
      );
      const pRef = resolvedPrimary?.canonicalRef || primaryRefInput.trim();
      const pText =
        resolvedPrimary?.text || getVerseText(pRef, translation);

      if (addType === 'connections') {
        const resolvedConnected = await resolveScriptureVerse(
          connectedRefInput.trim(),
          translation
        );
        const cRef = resolvedConnected?.canonicalRef || connectedRefInput.trim();
        const cText =
          resolvedConnected?.text || getVerseText(cRef, translation);

        saveConnectionToNotes({
          title: `${pRef} ↔ ${cRef}`,
          primaryRef: pRef,
          connectedRef: cRef,
          primaryText: pText,
          connectedText: cText,
          translation,
          category: newCategory,
          personalObservation: newPersonalNotes.trim(),
          collectionId: newCollectionId,
          sharedToCommunity: newShareToCommunity,
        });
        setActiveTab('connections');
      } else if (addType === 'context') {
        const ctx = await buildVerseContextData(pRef, translation);
        saveContextItem({
          verseRef: pRef,
          verseText: pText,
          translation,
          mainTheme: ctx?.mainTheme || `Main Theme of ${pRef}`,
          verseBreakdown: ctx?.verseBreakdown || [pText],
          contextSummary:
            ctx?.howPreviousChapterLeadsHere ||
            ctx?.immediateLiteraryContext ||
            `Context breakdown for ${pRef}`,
          personalNotes: newPersonalNotes.trim(),
          collectionId: newCollectionId,
          sharedToCommunity: newShareToCommunity,
        });
        setActiveTab('context');
      } else {
        saveBibleVerseItem({
          verseRef: pRef,
          verseText: pText,
          translation,
          personalNotes: newPersonalNotes.trim(),
          collectionId: newCollectionId,
          sharedToCommunity: newShareToCommunity,
        });
        setActiveTab('verses');
      }

      setNewPersonalNotes('');
      setIsAddModalOpen(false);
    } finally {
      setIsSavingNew(false);
    }
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
            PROMINENT LARGE HEADER TITLE: "Saved"
            =================================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1
              className={`text-3xl sm:text-4xl font-serif font-bold tracking-tight ${
                isLight ? 'text-stone-900' : 'text-white'
              }`}
            >
              Saved
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Your saved scripture connections, verse contexts, Bible verses, and personal insights.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewCollectionOpen(true)}
              className={`rounded-xl border px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 transition ${
                isLight
                  ? 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
                  : 'bg-[#181818] hover:bg-zinc-800 border-zinc-800 text-zinc-200'
              }`}
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span>New Collection</span>
            </button>

            <button
              onClick={() => {
                setAddType(activeTab);
                setIsAddModalOpen(true);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-1.5 transition shadow-xs ${
                isLight
                  ? 'bg-amber-700 hover:bg-amber-800 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Add Save</span>
            </button>
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
            placeholder="Search saved connections, verse contexts, Bible verses, or your personal notes..."
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
                <p className="text-sm font-semibold">No saved connections found.</p>
                <p className="text-xs">
                  Tap any verse on the Bible page or click &ldquo;Add Save&rdquo; above to save a scripture connection.
                </p>
              </div>
            ) : (
              filteredConnections.map((conn: SavedConnection) => {
                const isEditing = editingItemId === conn.id;
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
                          <span
                            className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold flex items-center gap-1 ${
                              conn.sharedToCommunity
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                : 'bg-stone-200/70 text-stone-600 dark:bg-zinc-800 dark:text-zinc-400'
                            }`}
                          >
                            {conn.sharedToCommunity ? (
                              <>
                                <Globe className="h-3 w-3" />
                                <span>Shared to Community</span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3" />
                                <span>Personal Save</span>
                              </>
                            )}
                          </span>
                        </div>
                        <h3 className="text-base font-bold pt-0.5">{conn.title}</h3>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateSavedConnection(conn.id, {
                              sharedToCommunity: !conn.sharedToCommunity,
                            })
                          }
                          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition ${
                            conn.sharedToCommunity
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : isLight
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                          }`}
                          title="Toggle Share to Community"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          <span>{conn.sharedToCommunity ? 'Shared' : 'Share to Community'}</span>
                        </button>

                        <button
                          onClick={() =>
                            handleStartEdit(
                              conn.id,
                              conn.personalObservation,
                              conn.collectionId
                            )
                          }
                          className={`rounded-xl border p-2 transition ${
                            isLight
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                          }`}
                          title="Edit Personal Notes & Collection"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => deleteSavedConnection(conn.id)}
                          className={`rounded-xl border p-2 transition ${
                            isLight
                              ? 'bg-stone-50 hover:bg-rose-50 border-stone-200 text-stone-500 hover:text-rose-600'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-rose-400'
                          }`}
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Connected Scriptures Grid */}
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

                    {/* Personal Notes / Reflections Section */}
                    {isEditing ? (
                      <div
                        className={`rounded-xl border p-3.5 space-y-3 ${
                          isLight
                            ? 'bg-stone-50 border-stone-200'
                            : 'bg-[#121212] border-zinc-800'
                        }`}
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] font-bold text-stone-500 block mb-1">
                              Collection
                            </label>
                            <select
                              value={editCollectionDraft}
                              onChange={(e) => setEditCollectionDraft(e.target.value)}
                              className={`w-full rounded-xl border px-3 py-1.5 text-xs ${
                                isLight
                                  ? 'bg-white border-stone-300 text-stone-900'
                                  : 'bg-zinc-900 border-zinc-700 text-white'
                              }`}
                            >
                              {collections.map((col) => (
                                <option key={col.id} value={col.id}>
                                  {col.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-stone-500 block mb-1">
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
                                : 'bg-zinc-900 border-zinc-700 text-white'
                            }`}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="rounded-xl border px-3 py-1.5 text-xs font-semibold text-stone-500"
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
                        className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
                          isLight
                            ? 'bg-stone-50/80 border-stone-200/80 text-stone-700'
                            : 'bg-[#121212] border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
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
                <p className="text-sm font-semibold">No saved verse contexts found.</p>
                <p className="text-xs">
                  Tap any verse on the Bible page and save its Context breakdown with your personal notes.
                </p>
              </div>
            ) : (
              filteredContexts.map((ctx: SavedContextItem) => {
                const isEditing = editingItemId === ctx.id;
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
                          <span
                            className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold flex items-center gap-1 ${
                              ctx.sharedToCommunity
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                : 'bg-stone-200/70 text-stone-600 dark:bg-zinc-800 dark:text-zinc-400'
                            }`}
                          >
                            {ctx.sharedToCommunity ? (
                              <>
                                <Globe className="h-3 w-3" />
                                <span>Shared to Community</span>
                              </>
                            ) : (
                              <>
                                <Lock className="h-3 w-3" />
                                <span>Personal Save</span>
                              </>
                            )}
                          </span>
                        </div>
                        <h3 className="text-base font-bold pt-0.5">{ctx.mainTheme}</h3>
                      </div>

                      <div className="flex items-center gap-1.5">
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
                          onClick={() =>
                            updateSavedContext(ctx.id, {
                              sharedToCommunity: !ctx.sharedToCommunity,
                            })
                          }
                          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition ${
                            ctx.sharedToCommunity
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : isLight
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                          }`}
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          <span>{ctx.sharedToCommunity ? 'Shared' : 'Share to Community'}</span>
                        </button>

                        <button
                          onClick={() =>
                            handleStartEdit(ctx.id, ctx.personalNotes, ctx.collectionId)
                          }
                          className={`rounded-xl border p-2 transition ${
                            isLight
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                          }`}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => deleteSavedContext(ctx.id)}
                          className={`rounded-xl border p-2 transition ${
                            isLight
                              ? 'bg-stone-50 hover:bg-rose-50 border-stone-200 text-stone-500 hover:text-rose-600'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-rose-400'
                          }`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Verse Text */}
                    <div
                      className={`rounded-xl border p-3.5 font-serif text-sm leading-relaxed ${
                        isLight
                          ? 'bg-[#FBF9F5] border-stone-200/80 text-stone-900'
                          : 'bg-[#121212] border-zinc-800 text-zinc-100'
                      }`}
                    >
                      “{ctx.verseText}”
                    </div>

                    {/* Context Breakdown */}
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

                    {/* Personal Notes */}
                    {isEditing ? (
                      <div
                        className={`rounded-xl border p-3.5 space-y-3 ${
                          isLight
                            ? 'bg-stone-50 border-stone-200'
                            : 'bg-[#121212] border-zinc-800'
                        }`}
                      >
                        <div>
                          <label className="text-[11px] font-bold text-stone-500 block mb-1">
                            Collection
                          </label>
                          <select
                            value={editCollectionDraft}
                            onChange={(e) => setEditCollectionDraft(e.target.value)}
                            className={`w-full rounded-xl border px-3 py-1.5 text-xs ${
                              isLight
                                ? 'bg-white border-stone-300 text-stone-900'
                                : 'bg-zinc-900 border-zinc-700 text-white'
                            }`}
                          >
                            {collections.map((col) => (
                              <option key={col.id} value={col.id}>
                                {col.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-stone-500 block mb-1">
                            Personal Notes & Reflections
                          </label>
                          <textarea
                            rows={3}
                            value={editNotesDraft}
                            onChange={(e) => setEditNotesDraft(e.target.value)}
                            className={`w-full rounded-xl border p-2.5 text-xs ${
                              isLight
                                ? 'bg-white border-stone-300 text-stone-900'
                                : 'bg-zinc-900 border-zinc-700 text-white'
                            }`}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="rounded-xl border px-3 py-1.5 text-xs font-semibold text-stone-500"
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
                        className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
                          isLight
                            ? 'bg-stone-50/80 border-stone-200/80 text-stone-700'
                            : 'bg-[#121212] border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
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
                <p className="text-sm font-semibold">No saved Bible verses found.</p>
                <p className="text-xs">
                  Tap any verse on the Bible page and click &ldquo;Save & Add Note&rdquo; to save verses here.
                </p>
              </div>
            ) : (
              filteredVerses.map((vItem: SavedVerseItem) => {
                const isEditing = editingItemId === vItem.id;
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
                        <span
                          className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold flex items-center gap-1 ${
                            vItem.sharedToCommunity
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                              : 'bg-stone-200/70 text-stone-600 dark:bg-zinc-800 dark:text-zinc-400'
                          }`}
                        >
                          {vItem.sharedToCommunity ? (
                            <>
                              <Globe className="h-3 w-3" />
                              <span>Shared to Community</span>
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3" />
                              <span>Personal Save</span>
                            </>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
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
                          onClick={() =>
                            updateSavedVerse(vItem.id, {
                              sharedToCommunity: !vItem.sharedToCommunity,
                            })
                          }
                          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition ${
                            vItem.sharedToCommunity
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : isLight
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                          }`}
                        >
                          <Share2 className="h-3.5 w-3.5" />
                          <span>
                            {vItem.sharedToCommunity ? 'Shared' : 'Share to Community'}
                          </span>
                        </button>

                        <button
                          onClick={() =>
                            handleStartEdit(
                              vItem.id,
                              vItem.personalNotes,
                              vItem.collectionId
                            )
                          }
                          className={`rounded-xl border p-2 transition ${
                            isLight
                              ? 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-600'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                          }`}
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => deleteSavedVerse(vItem.id)}
                          className={`rounded-xl border p-2 transition ${
                            isLight
                              ? 'bg-stone-50 hover:bg-rose-50 border-stone-200 text-stone-500 hover:text-rose-600'
                              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-rose-400'
                          }`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Scripture Text */}
                    <div
                      className={`rounded-xl border p-4 font-serif text-base leading-relaxed ${
                        isLight
                          ? 'bg-[#FBF9F5] border-stone-200/80 text-stone-900'
                          : 'bg-[#121212] border-zinc-800 text-zinc-100'
                      }`}
                    >
                      “{vItem.verseText}”
                    </div>

                    {/* Personal Notes */}
                    {isEditing ? (
                      <div
                        className={`rounded-xl border p-3.5 space-y-3 ${
                          isLight
                            ? 'bg-stone-50 border-stone-200'
                            : 'bg-[#121212] border-zinc-800'
                        }`}
                      >
                        <div>
                          <label className="text-[11px] font-bold text-stone-500 block mb-1">
                            Collection
                          </label>
                          <select
                            value={editCollectionDraft}
                            onChange={(e) => setEditCollectionDraft(e.target.value)}
                            className={`w-full rounded-xl border px-3 py-1.5 text-xs ${
                              isLight
                                ? 'bg-white border-stone-300 text-stone-900'
                                : 'bg-zinc-900 border-zinc-700 text-white'
                            }`}
                          >
                            {collections.map((col) => (
                              <option key={col.id} value={col.id}>
                                {col.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-stone-500 block mb-1">
                            Personal Notes & Reflections
                          </label>
                          <textarea
                            rows={3}
                            value={editNotesDraft}
                            onChange={(e) => setEditNotesDraft(e.target.value)}
                            className={`w-full rounded-xl border p-2.5 text-xs ${
                              isLight
                                ? 'bg-white border-stone-300 text-stone-900'
                                : 'bg-zinc-900 border-zinc-700 text-white'
                            }`}
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingItemId(null)}
                            className="rounded-xl border px-3 py-1.5 text-xs font-semibold text-stone-500"
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
                        className={`rounded-xl border p-3.5 text-xs leading-relaxed ${
                          isLight
                            ? 'bg-stone-50/80 border-stone-200/80 text-stone-700'
                            : 'bg-[#121212] border-zinc-800 text-zinc-300'
                        }`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
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
          MODAL: ADD NEW SAVED CONNECTION / CONTEXT / BIBLE VERSE
          ===================================================================== */}
      {isAddModalOpen && (
        <div
          onClick={() => setIsAddModalOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 my-auto ${
              isLight
                ? 'bg-white border-stone-200 text-stone-900'
                : 'bg-[#181818] border-zinc-800 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Add to Saved</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['connections', 'context', 'verses'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setAddType(t)}
                  className={`rounded-xl py-2 text-xs font-bold border capitalize transition ${
                    addType === t
                      ? isLight
                        ? 'bg-amber-700 border-amber-700 text-white'
                        : 'bg-amber-500 border-amber-500 text-zinc-950'
                      : isLight
                      ? 'bg-stone-50 border-stone-200 text-stone-700'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                  }`}
                >
                  {t === 'verses' ? 'Bible Verse' : t}
                </button>
              ))}
            </div>

            <form onSubmit={handleCreateNewSavedItem} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-stone-500 block mb-1">
                  {addType === 'connections' ? 'Primary Scripture Reference' : 'Scripture Reference'}
                </label>
                <input
                  type="text"
                  required
                  value={primaryRefInput}
                  onChange={(e) => setPrimaryRefInput(e.target.value)}
                  placeholder="e.g. Matthew 1:23 or Deuteronomy 32:6"
                  className={`w-full rounded-xl border px-3 py-2 ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-zinc-900 border-zinc-700 text-white'
                  }`}
                />
              </div>

              {addType === 'connections' && (
                <>
                  <div>
                    <label className="font-bold text-stone-500 block mb-1">
                      Connected Scripture Reference
                    </label>
                    <input
                      type="text"
                      required
                      value={connectedRefInput}
                      onChange={(e) => setConnectedRefInput(e.target.value)}
                      placeholder="e.g. Isaiah 7:14"
                      className={`w-full rounded-xl border px-3 py-2 ${
                        isLight
                          ? 'bg-stone-50 border-stone-300 text-stone-900'
                          : 'bg-zinc-900 border-zinc-700 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-stone-500 block mb-1">
                      Connection Type
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ReferenceCategory)}
                      className={`w-full rounded-xl border px-3 py-2 ${
                        isLight
                          ? 'bg-stone-50 border-stone-300 text-stone-900'
                          : 'bg-zinc-900 border-zinc-700 text-white'
                      }`}
                    >
                      {REFERENCE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="font-bold text-stone-500 block mb-1">Collection</label>
                <select
                  value={newCollectionId}
                  onChange={(e) => setNewCollectionId(e.target.value)}
                  className={`w-full rounded-xl border px-3 py-2 ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-zinc-900 border-zinc-700 text-white'
                  }`}
                >
                  {collections.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-500 block mb-1">
                  Personal Notes & Insights
                </label>
                <textarea
                  rows={3}
                  value={newPersonalNotes}
                  onChange={(e) => setNewPersonalNotes(e.target.value)}
                  placeholder="Write your personal reflections so you or others in the community can read your perspective..."
                  className={`w-full rounded-xl border p-3 ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-zinc-900 border-zinc-700 text-white'
                  }`}
                />
              </div>

              <label className="flex items-center gap-2 font-semibold cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newShareToCommunity}
                  onChange={(e) => setNewShareToCommunity(e.target.checked)}
                  className="h-4 w-4 accent-amber-700 rounded"
                />
                <span>Also share this save (with my notes) to the Community</span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border px-4 py-2 font-semibold text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingNew}
                  className={`rounded-xl px-5 py-2 font-bold ${
                    isLight
                      ? 'bg-amber-700 hover:bg-amber-800 text-white'
                      : 'bg-amber-500 text-zinc-950'
                  }`}
                >
                  {isSavingNew ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
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
              <h2 className="text-base font-bold">Create New Collection</h2>
              <button
                onClick={() => setIsNewCollectionOpen(false)}
                className="rounded-lg p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCollectionSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-stone-500 block mb-1">
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
                      : 'bg-zinc-900 border-zinc-700 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="font-bold text-stone-500 block mb-1">
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
                      : 'bg-zinc-900 border-zinc-700 text-white'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewCollectionOpen(false)}
                  className="rounded-xl border px-4 py-2 font-semibold text-stone-500"
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
